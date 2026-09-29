"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import type { ResultadoDeAcao } from "@/lib/actions/onboarding";
import { garantirPerfil } from "@/lib/auth/perfil";
import { assinaturaDaAcesso, assinaturaDoPerfil } from "@/lib/data/assinaturas";
import { hojeNoBrasil, somarDias, somarMeses } from "@/lib/datas";
import { asaasConfigurado } from "@/lib/env";
import {
  ErroDoAsaas,
  cancelarAssinatura,
  cancelarAutorizacaoPixAutomatico,
  criarAssinatura,
  criarAutorizacaoPixAutomatico,
  garantirClienteNoAsaas,
  obterAutorizacaoPixAutomatico,
  obterCobranca,
  primeiraCobrancaDaAssinatura,
  linhaDigitavelDoBoleto,
  qrCodeDaCobranca,
  type CobrancaAsaas,
} from "@/lib/pagamentos/asaas";
import { planoPorId, type PlanoDeCobranca } from "@/lib/pagamentos/planos";
import {
  pagamentoInicialRecebido,
  registrarCancelamento,
  registrarPagamentoConfirmado,
  vincularAssinaturaDoAsaas,
} from "@/lib/pagamentos/sincronizar";
import { clienteAdmin } from "@/lib/supabase/server";
import {
  assinaturaCartaoSchema,
  assinaturaPixSchema,
} from "@/lib/validacao/schemas";
import type { Assinatura } from "@/types/database";

export type QrCodeParaPagar = {
  imagemBase64: string;
  copiaECola: string;
  expiraEm: string | null;
  valor: number;
};

export type ResultadoDoPix =
  | {
      ok: true;
      qrCode: QrCodeParaPagar;
      /**
       * Se o QR é de Pix Automático (paga agora e autoriza os próximos) ou
       * de Pix comum (paga só este ciclo). A tela explica cada um de um jeito.
       */
      automatico: boolean;
    }
  | { ok: false; erro: string };

export type BoletoParaPagar = {
  linhaDigitavel: string | null;
  pdfUrl: string | null;
  faturaUrl: string | null;
  vencimento: string;
  valor: number;
  /** O boleto do Asaas também aceita Pix; nem toda conta gera o QR. */
  pix: { imagemBase64: string; copiaECola: string } | null;
};

export type ResultadoDoBoleto =
  | { ok: true; boleto: BoletoParaPagar }
  | { ok: false; erro: string };

/** Dias entre gerar o boleto e o primeiro vencimento. */
const DIAS_PARA_PAGAR_O_BOLETO = 3;

/** Cobranças que o Asaas considera pagas. */
const PAGAS = new Set(["CONFIRMED", "RECEIVED", "RECEIVED_IN_CASH"]);

/** Quanto tempo o QR do primeiro pagamento do Pix Automático vale. */
const VALIDADE_DO_QR_EM_SEGUNDOS = 60 * 60;

function mensagemDoZod(erros: { message: string }[]): string {
  return erros[0]?.message ?? "Dados inválidos.";
}

function comoErro(erro: unknown): string {
  if (erro instanceof ErroDoAsaas) return erro.message;
  return "Não foi possível falar com o Asaas agora. Tente de novo em instantes.";
}

/**
 * IP de quem está pagando, exigido pelo Asaas na análise antifraude.
 *
 * Atrás da Vercel o IP real vem em `x-forwarded-for`, com a cadeia de proxies
 * separada por vírgula; o primeiro é o do visitante.
 */
async function ipDoPagador(): Promise<string> {
  const cabecalhos = await headers();
  const encaminhado = cabecalhos.get("x-forwarded-for");
  const primeiro = encaminhado?.split(",")[0]?.trim();
  return primeiro || cabecalhos.get("x-real-ip") || "127.0.0.1";
}

type Titular = {
  nome: string;
  email: string;
  cpf_cnpj: string;
  telefone: string;
  cep: string;
  numero_endereco: string;
};

type Metodo = "CREDIT_CARD" | "PIX" | "PIX_AUTOMATICO" | "BOLETO";

function exigirPlano(id: string): PlanoDeCobranca {
  const plano = planoPorId(id);
  if (!plano) throw new Error("Plano desconhecido.");
  return plano;
}

async function garantirCliente(perfilId: string, titular: Titular) {
  return garantirClienteNoAsaas({
    perfilId,
    nome: titular.nome,
    email: titular.email,
    cpfCnpj: titular.cpf_cnpj,
    telefone: titular.telefone,
    cep: titular.cep,
    numeroDoEndereco: titular.numero_endereco,
  });
}

/**
 * Grava o espelho local da assinatura, uma linha por perfil.
 *
 * Todos os campos de referência ao Asaas são escritos a cada gravação, mesmo
 * os que ficam vazios: quem tentou o Pix Automático e depois assinou no
 * cartão não pode carregar o id de uma autorização velha, que faria os avisos
 * daquela autorização mexerem na assinatura nova.
 *
 * O período já pago (`acesso_ate`) passa para a linha nova: trocar de cartão,
 * de plano ou de forma de pagamento não pode custar dias pagos.
 */
async function gravarEspelho(campos: {
  perfilId: string;
  plano: PlanoDeCobranca;
  metodo: Metodo;
  clienteId: string;
  assinaturaId: string | null;
  autorizacaoId: string | null;
  proximoVencimento: string | null;
  cartaoBandeira?: string | null;
  cartaoFinal?: string | null;
  anterior: Assinatura | null;
}): Promise<Assinatura> {
  const { data, error } = await clienteAdmin()
    .from("subscriptions")
    .upsert(
      {
        profile_id: campos.perfilId,
        plano: campos.plano.id,
        metodo: campos.metodo,
        status: "pendente",
        valor: campos.plano.valor,
        asaas_customer_id: campos.clienteId,
        asaas_subscription_id: campos.assinaturaId,
        asaas_authorization_id: campos.autorizacaoId,
        acesso_ate: campos.anterior?.acesso_ate ?? null,
        proximo_vencimento: campos.proximoVencimento,
        cartao_bandeira: campos.cartaoBandeira ?? null,
        cartao_final: campos.cartaoFinal ?? null,
      },
      { onConflict: "profile_id" }
    )
    .select("*")
    .single();

  if (error) throw new Error(`Falha ao gravar a assinatura: ${error.message}`);
  return data;
}

/**
 * Encerra no Asaas tudo o que uma assinatura mantém vivo: a autorização do
 * Pix Automático e a assinatura que gera as cobranças.
 *
 * Com `estrito`, qualquer falha sobe — é o cancelamento pedido pelo usuário,
 * que precisa saber se deu certo. Sem ele, as falhas são engolidas: é a
 * limpeza da tentativa anterior depois de uma venda nova concluída, e uma
 * venda feita não pode ser desfeita por causa de uma sobra antiga, que pode
 * já nem existir no Asaas.
 */
async function encerrarNoAsaas(
  assinatura: Assinatura,
  { estrito }: { estrito: boolean }
): Promise<void> {
  const tarefas: Promise<unknown>[] = [];
  if (assinatura.asaas_authorization_id) {
    tarefas.push(cancelarAutorizacaoPixAutomatico(assinatura.asaas_authorization_id));
  }
  if (assinatura.asaas_subscription_id) {
    tarefas.push(cancelarAssinatura(assinatura.asaas_subscription_id));
  }

  const resultados = await Promise.allSettled(tarefas);
  if (!estrito) return;

  for (const resultado of resultados) {
    if (resultado.status === "fulfilled") continue;
    // 404: já não existe no Asaas, que é exatamente o que se queria.
    if (resultado.reason instanceof ErroDoAsaas && resultado.reason.status === 404) {
      continue;
    }
    throw resultado.reason;
  }
}

/**
 * Depois de gravar a assinatura nova, a anterior sai do Asaas. Sem isto, um
 * Pix gerado e não pago continuaria vivo, gerando cobrança todo mês para quem
 * já assinou de outro jeito.
 */
async function limparAnterior(anterior: Assinatura | null, nova: Assinatura) {
  if (!anterior || anterior.status === "cancelada") return;

  const mesma =
    (anterior.asaas_subscription_id !== null &&
      anterior.asaas_subscription_id === nova.asaas_subscription_id) ||
    (anterior.asaas_authorization_id !== null &&
      anterior.asaas_authorization_id === nova.asaas_authorization_id);
  if (mesma) return;

  await encerrarNoAsaas(anterior, { estrito: false });
}

/**
 * Cartão, Pix comum e boleto: uma assinatura do Asaas com a primeira
 * cobrança na data dada — hoje, por padrão, no horário de Brasília. Em UTC,
 * depois das 21h a primeira cobrança seria marcada para amanhã, e o cartão
 * não aprovaria na hora.
 */
async function abrirAssinatura(parametros: {
  perfilId: string;
  plano: PlanoDeCobranca;
  metodo: "CREDIT_CARD" | "PIX" | "BOLETO";
  clienteId: string;
  extras: Record<string, unknown>;
  anterior: Assinatura | null;
  primeiroVencimento?: string;
}): Promise<Assinatura> {
  const { plano } = parametros;

  const remota = await criarAssinatura({
    customer: parametros.clienteId,
    billingType: parametros.metodo,
    value: plano.valor,
    nextDueDate: parametros.primeiroVencimento ?? hojeNoBrasil(),
    cycle: plano.ciclo,
    description: plano.descricaoNaFatura,
    externalReference: parametros.perfilId,
    ...parametros.extras,
  });

  const assinatura = await gravarEspelho({
    perfilId: parametros.perfilId,
    plano,
    metodo: parametros.metodo,
    clienteId: parametros.clienteId,
    assinaturaId: remota.id,
    autorizacaoId: null,
    proximoVencimento: remota.nextDueDate ?? null,
    cartaoBandeira: remota.creditCard?.creditCardBrand,
    cartaoFinal: remota.creditCard?.creditCardNumber,
    anterior: parametros.anterior,
  });

  await limparAnterior(parametros.anterior, assinatura);
  return assinatura;
}

/**
 * Pix Automático: um QR Code que paga o primeiro ciclo e, no mesmo passo,
 * autoriza no banco do cliente os débitos dos ciclos seguintes.
 *
 * A recorrência começa no ciclo seguinte (`startDate` = hoje + um ciclo),
 * porque o primeiro já é pago pelo QR. Começar hoje arriscaria o Asaas gerar
 * uma cobrança recorrente no mesmo dia do pagamento inicial, e o cliente
 * pagaria duas vezes o mesmo mês.
 */
async function abrirPixAutomatico(parametros: {
  perfilId: string;
  plano: PlanoDeCobranca;
  clienteId: string;
  anterior: Assinatura | null;
}): Promise<QrCodeParaPagar> {
  const { plano } = parametros;
  const inicioDaRecorrencia = somarMeses(hojeNoBrasil(), plano.mesesPorCiclo);

  const autorizacao = await criarAutorizacaoPixAutomatico({
    customerId: parametros.clienteId,
    frequency: plano.frequenciaPix,
    // Até 35 caracteres, e um por tentativa: quem tenta de novo ganha um
    // contrato novo, e o da tentativa anterior é cancelado em limparAnterior.
    contractId: `MP${parametros.perfilId.replace(/-/g, "").slice(0, 20)}${Date.now().toString(36)}`,
    startDate: inicioDaRecorrencia,
    value: plano.valor,
    description: `MarmitaPRO plano ${plano.id}`,
    primeiroPagamento: {
      valor: plano.valor,
      expiraEmSegundos: VALIDADE_DO_QR_EM_SEGUNDOS,
      descricao: plano.descricaoNaFatura,
    },
  });

  if (!autorizacao.encodedImage || !autorizacao.payload) {
    // Autorização sem QR não tem como ser paga. Desfaz para não deixar uma
    // autorização pendurada, e deixa o chamador cair no Pix comum.
    await cancelarAutorizacaoPixAutomatico(autorizacao.id).catch(() => {});
    throw new ErroDoAsaas(
      "O Asaas não devolveu o QR Code do Pix Automático.",
      502,
      null
    );
  }

  const assinatura = await gravarEspelho({
    perfilId: parametros.perfilId,
    plano,
    metodo: "PIX_AUTOMATICO",
    clienteId: parametros.clienteId,
    assinaturaId: autorizacao.subscriptionId ?? null,
    autorizacaoId: autorizacao.id,
    proximoVencimento: inicioDaRecorrencia,
    anterior: parametros.anterior,
  });

  await limparAnterior(parametros.anterior, assinatura);

  return {
    imagemBase64: autorizacao.encodedImage,
    copiaECola: autorizacao.payload,
    expiraEm: autorizacao.immediateQrCode?.expirationDate ?? null,
    valor: plano.valor,
  };
}

/**
 * A cobrança ainda em aberto de uma tentativa anterior, se servir: mesmo
 * plano, mesma forma de pagamento. Quem gerou o Pix ou o boleto, fechou a
 * tela e voltou recebe o mesmo, em vez de espalhar cobranças pendentes na
 * conta do Asaas — e, no boleto, em vez de receber dois boletos por e-mail.
 */
async function cobrancaEmAberto(
  assinatura: Assinatura | null,
  plano: string,
  metodo: "PIX" | "BOLETO"
): Promise<{ assinatura: Assinatura; cobranca: CobrancaAsaas } | null> {
  if (
    !assinatura ||
    assinatura.status !== "pendente" ||
    assinatura.metodo !== metodo ||
    assinatura.plano !== plano ||
    !assinatura.asaas_subscription_id
  ) {
    return null;
  }

  const cobranca = await primeiraCobrancaDaAssinatura(
    assinatura.asaas_subscription_id
  ).catch(() => null);

  return cobranca?.status === "PENDING" ? { assinatura, cobranca } : null;
}

/** Só quem tem assinatura ativa e em dia está impedido de assinar de novo. */
function jaAssinante(assinatura: Assinatura | null): boolean {
  return assinatura?.status === "ativa" && assinaturaDaAcesso(assinatura);
}

/**
 * Assinatura no cartão. Os dados do cartão existem só dentro desta função:
 * vão para o Asaas e não são gravados, registrados em log nem devolvidos.
 */
export async function assinarComCartao(
  entrada: unknown
): Promise<ResultadoDeAcao> {
  if (!asaasConfigurado) {
    return { ok: false, erro: "A cobrança ainda não está configurada." };
  }

  const analise = assinaturaCartaoSchema.safeParse(entrada);
  if (!analise.success) {
    return { ok: false, erro: mensagemDoZod(analise.error.issues) };
  }

  const { titular, cartao } = analise.data;

  try {
    const plano = exigirPlano(analise.data.plano);
    const perfil = await garantirPerfil();

    const jaTem = await assinaturaDoPerfil(perfil.id);
    if (jaAssinante(jaTem)) {
      return { ok: false, erro: "Você já tem uma assinatura ativa." };
    }

    const assinatura = await abrirAssinatura({
      perfilId: perfil.id,
      plano,
      metodo: "CREDIT_CARD",
      clienteId: await garantirCliente(perfil.id, titular),
      anterior: jaTem,
      extras: {
        creditCard: {
          holderName: cartao.nome_impresso,
          number: cartao.numero,
          expiryMonth: cartao.mes,
          expiryYear: cartao.ano,
          ccv: cartao.cvv,
        },
        creditCardHolderInfo: {
          name: titular.nome,
          email: titular.email,
          cpfCnpj: titular.cpf_cnpj,
          postalCode: titular.cep,
          addressNumber: titular.numero_endereco,
          phone: titular.telefone,
        },
        remoteIp: await ipDoPagador(),
      },
    });

    // No cartão a aprovação é imediata. Conferir agora evita deixar quem
    // acabou de pagar esperando o webhook para ver a tela liberar.
    if (assinatura.asaas_subscription_id) {
      const cobranca = await primeiraCobrancaDaAssinatura(
        assinatura.asaas_subscription_id
      );
      if (cobranca && PAGAS.has(cobranca.status)) {
        await registrarPagamentoConfirmado(assinatura);
      }
    }

    revalidatePath("/app", "layout");
    return { ok: true, destino: "/app/assinatura" };
  } catch (erro) {
    return { ok: false, erro: comoErro(erro) };
  }
}

/**
 * Assinatura no Pix. Tenta o Pix Automático e, se o Asaas recusar, cai no
 * Pix comum.
 *
 * A recusa mais provável é de elegibilidade: o Pix Automático exige conta de
 * Pessoa Jurídica com CNPJ ativo há pelo menos seis meses. Enquanto a conta
 * não cumprir isso, o cliente paga pelo Pix comum — QR novo a cada ciclo — em
 * vez de ficar sem conseguir pagar. Quando a conta passar a cumprir, o
 * Automático começa a valer sozinho, sem mudança no código.
 */
export async function assinarComPix(entrada: unknown): Promise<ResultadoDoPix> {
  if (!asaasConfigurado) {
    return { ok: false, erro: "A cobrança ainda não está configurada." };
  }

  const analise = assinaturaPixSchema.safeParse(entrada);
  if (!analise.success) {
    return { ok: false, erro: mensagemDoZod(analise.error.issues) };
  }

  try {
    const plano = exigirPlano(analise.data.plano);
    const perfil = await garantirPerfil();

    const jaTem = await assinaturaDoPerfil(perfil.id);
    if (jaAssinante(jaTem)) {
      return { ok: false, erro: "Você já tem uma assinatura ativa." };
    }

    const clienteId = await garantirCliente(perfil.id, analise.data.titular);

    try {
      const qrCode = await abrirPixAutomatico({
        perfilId: perfil.id,
        plano,
        clienteId,
        anterior: jaTem,
      });
      revalidatePath("/app", "layout");
      return { ok: true, qrCode, automatico: true };
    } catch (erro) {
      if (!(erro instanceof ErroDoAsaas)) throw erro;
      // Fica no log da Vercel: é por aqui que se descobre quando e por que o
      // Automático não está valendo (conta ainda não elegível, por exemplo).
      console.warn(
        `[pix-automatico] recusado pelo Asaas (${erro.status}${
          erro.codigo ? `, ${erro.codigo}` : ""
        }): ${erro.message} — usando Pix comum.`
      );
    }

    // Pix comum. Quem gerou o QR, fechou a tela e voltou recebe o mesmo, desde
    // que seja o mesmo plano e a cobrança ainda esteja em aberto.
    const pendente = await cobrancaEmAberto(jaTem, plano.id, "PIX");

    const assinatura =
      pendente?.assinatura ??
      (await abrirAssinatura({
        perfilId: perfil.id,
        plano,
        metodo: "PIX",
        clienteId,
        anterior: jaTem,
        extras: {},
      }));

    const cobranca =
      pendente?.cobranca ??
      (assinatura.asaas_subscription_id
        ? await primeiraCobrancaDaAssinatura(assinatura.asaas_subscription_id)
        : null);
    if (!cobranca) {
      return {
        ok: false,
        erro: "O Asaas ainda não gerou a cobrança. Atualize a página em instantes.",
      };
    }

    const qr = await qrCodeDaCobranca(cobranca.id);

    revalidatePath("/app", "layout");
    return {
      ok: true,
      automatico: false,
      qrCode: {
        imagemBase64: qr.encodedImage,
        copiaECola: qr.payload,
        expiraEm: qr.expirationDate,
        valor: cobranca.value,
      },
    };
  } catch (erro) {
    return { ok: false, erro: comoErro(erro) };
  }
}

/**
 * Assinatura no boleto. Devolve a linha digitável, o PDF e, quando o Asaas
 * gera, o Pix do próprio boleto — o boleto do Asaas também aceita Pix, e quem
 * paga por ele libera o acesso na hora em vez de esperar a compensação.
 *
 * O primeiro vencimento fica alguns dias à frente: boleto que vence hoje
 * obriga o cliente a pagar no mesmo dia, e boleto gerado à noite já nasceria
 * praticamente vencido.
 */
export async function assinarComBoleto(
  entrada: unknown
): Promise<ResultadoDoBoleto> {
  if (!asaasConfigurado) {
    return { ok: false, erro: "A cobrança ainda não está configurada." };
  }

  const analise = assinaturaPixSchema.safeParse(entrada);
  if (!analise.success) {
    return { ok: false, erro: mensagemDoZod(analise.error.issues) };
  }

  try {
    const plano = exigirPlano(analise.data.plano);
    const perfil = await garantirPerfil();

    const jaTem = await assinaturaDoPerfil(perfil.id);
    if (jaAssinante(jaTem)) {
      return { ok: false, erro: "Você já tem uma assinatura ativa." };
    }

    const pendente = await cobrancaEmAberto(jaTem, plano.id, "BOLETO");

    const assinatura =
      pendente?.assinatura ??
      (await abrirAssinatura({
        perfilId: perfil.id,
        plano,
        metodo: "BOLETO",
        clienteId: await garantirCliente(perfil.id, analise.data.titular),
        anterior: jaTem,
        extras: {},
        primeiroVencimento: somarDias(hojeNoBrasil(), DIAS_PARA_PAGAR_O_BOLETO),
      }));

    const cobranca =
      pendente?.cobranca ??
      (assinatura.asaas_subscription_id
        ? await primeiraCobrancaDaAssinatura(assinatura.asaas_subscription_id)
        : null);
    if (!cobranca) {
      return {
        ok: false,
        erro: "O Asaas ainda não gerou o boleto. Atualize a página em instantes.",
      };
    }

    // O Asaas registra o boleto no banco logo depois de criar a cobrança; a
    // linha digitável pode demorar alguns segundos para existir. Sem ela, o
    // PDF e o link da fatura continuam servindo.
    const [linha, pix] = await Promise.all([
      linhaDigitavelDoBoleto(cobranca.id).catch(() => null),
      qrCodeDaCobranca(cobranca.id).catch(() => null),
    ]);

    revalidatePath("/app", "layout");
    return {
      ok: true,
      boleto: {
        linhaDigitavel: linha?.identificationField ?? null,
        pdfUrl: cobranca.bankSlipUrl ?? null,
        faturaUrl: cobranca.invoiceUrl ?? null,
        vencimento: cobranca.dueDate,
        valor: cobranca.value,
        pix: pix
          ? { imagemBase64: pix.encodedImage, copiaECola: pix.payload }
          : null,
      },
    };
  } catch (erro) {
    return { ok: false, erro: comoErro(erro) };
  }
}

/**
 * Pergunta ao Asaas se o pagamento em aberto já caiu.
 *
 * A tela do Pix chama isto enquanto o usuário paga. O webhook continua sendo
 * o caminho oficial; esta consulta existe para o caso de ele demorar, e
 * também para funcionar em desenvolvimento, onde o Asaas não alcança o
 * localhost.
 */
export async function conferirPagamento(): Promise<{ liberado: boolean }> {
  if (!asaasConfigurado) return { liberado: true };

  try {
    const perfil = await garantirPerfil();
    let assinatura = await assinaturaDoPerfil(perfil.id);
    if (!assinatura) return { liberado: false };
    if (assinaturaDaAcesso(assinatura)) return { liberado: true };

    if (assinatura.metodo === "PIX_AUTOMATICO" && assinatura.asaas_authorization_id) {
      const autorizacao = await obterAutorizacaoPixAutomatico(
        assinatura.asaas_authorization_id
      );
      assinatura = await vincularAssinaturaDoAsaas(
        assinatura,
        autorizacao.subscriptionId
      );

      // O acesso sai do dinheiro, não da autorização: o banco do cliente pode
      // levar um tempo para confirmar a recorrência depois de o pagamento já
      // ter caído, e quem pagou não deveria esperar por isso.
      const pagou =
        autorizacao.status === "ACTIVE" ||
        (await pagamentoInicialRecebido(assinatura));
      if (!pagou) return { liberado: false };

      await registrarPagamentoConfirmado(assinatura);
      revalidatePath("/app", "layout");
      return { liberado: true };
    }

    if (!assinatura.asaas_subscription_id) return { liberado: false };

    const cobranca = await primeiraCobrancaDaAssinatura(
      assinatura.asaas_subscription_id
    );
    if (!cobranca) return { liberado: false };

    const atual = await obterCobranca(cobranca.id);
    if (!PAGAS.has(atual.status)) return { liberado: false };

    await registrarPagamentoConfirmado(assinatura);
    revalidatePath("/app", "layout");
    return { liberado: true };
  } catch {
    return { liberado: false };
  }
}

/** Cancela no Asaas e no espelho. O acesso segue até o fim do período pago. */
export async function cancelarMinhaAssinatura(): Promise<ResultadoDeAcao> {
  try {
    const perfil = await garantirPerfil();
    const assinatura = await assinaturaDoPerfil(perfil.id);

    if (!assinatura) {
      return { ok: false, erro: "Você não tem assinatura para cancelar." };
    }

    await encerrarNoAsaas(assinatura, { estrito: true });
    await registrarCancelamento(assinatura);

    revalidatePath("/app", "layout");
    return { ok: true };
  } catch (erro) {
    return { ok: false, erro: comoErro(erro) };
  }
}
