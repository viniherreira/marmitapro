"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import type { ResultadoDeAcao } from "@/lib/actions/onboarding";
import { garantirPerfil } from "@/lib/auth/perfil";
import { assinaturaDaAcesso, assinaturaDoPerfil } from "@/lib/data/assinaturas";
import { asaasConfigurado } from "@/lib/env";
import {
  ErroDoAsaas,
  cancelarAssinatura,
  criarAssinatura,
  garantirClienteNoAsaas,
  obterCobranca,
  primeiraCobrancaDaAssinatura,
  qrCodeDaCobranca,
} from "@/lib/pagamentos/asaas";
import { planoPorId } from "@/lib/pagamentos/planos";
import {
  assinaturaPorIdDoAsaas,
  registrarCancelamento,
  registrarPagamentoConfirmado,
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
  | { ok: true; qrCode: QrCodeParaPagar }
  | { ok: false; erro: string };

/** Cobranças que o Asaas considera pagas. */
const PAGAS = new Set(["CONFIRMED", "RECEIVED", "RECEIVED_IN_CASH"]);

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

/** Hoje em "YYYY-MM-DD": o Asaas cobra a primeira parcela na data que mandamos. */
function hoje(): string {
  return new Date().toISOString().slice(0, 10);
}

type Titular = {
  nome: string;
  email: string;
  cpf_cnpj: string;
  telefone: string;
  cep: string;
  numero_endereco: string;
};

/**
 * Passo comum às duas formas de pagamento: garante o cliente no Asaas, cria a
 * assinatura e grava o espelho local.
 *
 * O espelho é gravado com `upsert` por perfil: quem cancelou e volta, ou quem
 * teve uma tentativa pendente, reaproveita a mesma linha em vez de acumular
 * assinaturas mortas.
 */
async function abrirAssinatura(parametros: {
  perfilId: string;
  plano: string;
  metodo: "CREDIT_CARD" | "PIX";
  titular: Titular;
  extras: Record<string, unknown>;
}): Promise<Assinatura> {
  const plano = planoPorId(parametros.plano);
  if (!plano) throw new Error("Plano desconhecido.");

  const clienteId = await garantirClienteNoAsaas({
    perfilId: parametros.perfilId,
    nome: parametros.titular.nome,
    email: parametros.titular.email,
    cpfCnpj: parametros.titular.cpf_cnpj,
    telefone: parametros.titular.telefone,
    cep: parametros.titular.cep,
    numeroDoEndereco: parametros.titular.numero_endereco,
  });

  const assinaturaRemota = await criarAssinatura({
    customer: clienteId,
    billingType: parametros.metodo,
    value: plano.valor,
    nextDueDate: hoje(),
    cycle: plano.ciclo,
    description: plano.descricaoNaFatura,
    externalReference: parametros.perfilId,
    ...parametros.extras,
  });

  const supabase = clienteAdmin();
  const { data, error } = await supabase
    .from("subscriptions")
    .upsert(
      {
        profile_id: parametros.perfilId,
        plano: plano.id,
        metodo: parametros.metodo,
        status: "pendente",
        valor: plano.valor,
        asaas_customer_id: clienteId,
        asaas_subscription_id: assinaturaRemota.id,
        acesso_ate: null,
        proximo_vencimento: assinaturaRemota.nextDueDate ?? null,
        cartao_bandeira: assinaturaRemota.creditCard?.creditCardBrand ?? null,
        cartao_final: assinaturaRemota.creditCard?.creditCardNumber ?? null,
      },
      { onConflict: "profile_id" }
    )
    .select("*")
    .single();

  if (error) throw new Error(`Falha ao gravar a assinatura: ${error.message}`);
  return data;
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

  const { plano, titular, cartao } = analise.data;

  try {
    const perfil = await garantirPerfil();

    const jaTem = await assinaturaDoPerfil(perfil.id);
    if (jaTem && assinaturaDaAcesso(jaTem) && jaTem.status !== "cancelada") {
      return { ok: false, erro: "Você já tem uma assinatura ativa." };
    }

    const assinatura = await abrirAssinatura({
      perfilId: perfil.id,
      plano,
      metodo: "CREDIT_CARD",
      titular,
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
    const cobranca = await primeiraCobrancaDaAssinatura(
      assinatura.asaas_subscription_id
    );
    if (cobranca && PAGAS.has(cobranca.status)) {
      await registrarPagamentoConfirmado(assinatura);
    }

    revalidatePath("/app", "layout");
    return { ok: true, destino: "/app/assinatura" };
  } catch (erro) {
    return { ok: false, erro: comoErro(erro) };
  }
}

/**
 * Assinatura no Pix. Devolve o QR Code da primeira cobrança para o usuário
 * pagar sem sair da tela.
 */
export async function assinarComPix(entrada: unknown): Promise<ResultadoDoPix> {
  if (!asaasConfigurado) {
    return { ok: false, erro: "A cobrança ainda não está configurada." };
  }

  const analise = assinaturaPixSchema.safeParse(entrada);
  if (!analise.success) {
    return { ok: false, erro: mensagemDoZod(analise.error.issues) };
  }

  const { plano, titular } = analise.data;

  try {
    const perfil = await garantirPerfil();

    const jaTem = await assinaturaDoPerfil(perfil.id);
    if (jaTem && assinaturaDaAcesso(jaTem) && jaTem.status !== "cancelada") {
      return { ok: false, erro: "Você já tem uma assinatura ativa." };
    }

    const assinatura = await abrirAssinatura({
      perfilId: perfil.id,
      plano,
      metodo: "PIX",
      titular,
      extras: {},
    });

    const cobranca = await primeiraCobrancaDaAssinatura(
      assinatura.asaas_subscription_id
    );
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
 * Pergunta ao Asaas se a cobrança em aberto já foi paga.
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
    const assinatura = await assinaturaDoPerfil(perfil.id);
    if (!assinatura) return { liberado: false };
    if (assinaturaDaAcesso(assinatura)) return { liberado: true };

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

    await cancelarAssinatura(assinatura.asaas_subscription_id);

    const atual = await assinaturaPorIdDoAsaas(assinatura.asaas_subscription_id);
    await registrarCancelamento(atual ?? assinatura);

    revalidatePath("/app", "layout");
    return { ok: true };
  } catch (erro) {
    return { ok: false, erro: comoErro(erro) };
  }
}
