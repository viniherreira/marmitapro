/**
 * Cliente da API do Asaas.
 *
 * Só roda no servidor: a chave dá acesso total à conta, incluindo saque.
 * Nenhum dado de cartão passa pelo nosso banco — o formulário manda para uma
 * Server Action, que repassa direto para o Asaas e guarda apenas o que volta
 * (bandeira e os quatro últimos dígitos).
 *
 * Documentação: https://docs.asaas.com/reference/comece-por-aqui
 */

import { env } from "@/lib/env";
import type { FrequenciaPix } from "@/lib/pagamentos/planos";

const BASES = {
  sandbox: "https://api-sandbox.asaas.com/v3",
  producao: "https://api.asaas.com/v3",
} as const;

export type AmbienteAsaas = keyof typeof BASES;

/**
 * O ambiente sai do prefixo da própria chave.
 *
 * Chave de sandbox começa com `$aact_hmlg_` e a de produção com `$aact_prod_`.
 * Usar a chave de um ambiente contra a URL do outro devolve 401 — e é o erro
 * mais comum de quem integra. Deduzindo daqui, trocar a chave na Vercel basta
 * para virar a chave; não há uma segunda variável para esquecer de mudar.
 */
export function ambienteDoAsaas(): AmbienteAsaas {
  const forcado = process.env.ASAAS_AMBIENTE?.trim().toLowerCase();
  if (forcado === "sandbox" || forcado === "producao") return forcado;

  return env.asaasApiKey.startsWith("$aact_prod_") ? "producao" : "sandbox";
}

export class ErroDoAsaas extends Error {
  readonly status: number;
  readonly codigo: string | null;

  constructor(mensagem: string, status: number, codigo: string | null) {
    super(mensagem);
    this.name = "ErroDoAsaas";
    this.status = status;
    this.codigo = codigo;
  }
}

type RespostaDeErro = {
  errors?: { code?: string; description?: string }[];
};

/**
 * Uma requisição à API. `caminho` começa com barra, como "/customers".
 *
 * O corpo do erro do Asaas vem em `errors[]`, com uma descrição em português
 * que serve para mostrar ao usuário ("Número do cartão inválido", por
 * exemplo). Aproveitamos essa descrição em vez de inventar uma nossa.
 */
export async function chamarAsaas<T>(
  caminho: string,
  opcoes: { metodo?: "GET" | "POST" | "PUT" | "DELETE"; corpo?: unknown } = {}
): Promise<T> {
  if (!env.asaasApiKey) {
    throw new ErroDoAsaas("Asaas não configurado: falta ASAAS_API_KEY.", 500, null);
  }

  const resposta = await fetch(`${BASES[ambienteDoAsaas()]}${caminho}`, {
    method: opcoes.metodo ?? "GET",
    headers: {
      "Content-Type": "application/json",
      // O Asaas pede identificação da aplicação nas requisições.
      "User-Agent": "MarmitaPRO",
      access_token: env.asaasApiKey,
    },
    body: opcoes.corpo === undefined ? undefined : JSON.stringify(opcoes.corpo),
    cache: "no-store",
  });

  const texto = await resposta.text();

  // Em instabilidade o Asaas (ou o proxy na frente dele) pode devolver uma
  // página HTML. Sem esta guarda o JSON.parse estouraria e esconderia o
  // status real da resposta, que é o que decide a mensagem de erro.
  let dados: unknown = null;
  try {
    dados = texto ? JSON.parse(texto) : null;
  } catch {
    dados = null;
  }

  if (!resposta.ok) {
    const primeiro = (dados as RespostaDeErro | null)?.errors?.[0];
    throw new ErroDoAsaas(
      primeiro?.description ?? `Falha na comunicação com o Asaas (${resposta.status}).`,
      resposta.status,
      primeiro?.code ?? null
    );
  }

  return dados as T;
}

// --- formas que usamos das respostas ---------------------------------------
// Só os campos que consumimos. O Asaas avisa que o payload cresce com o tempo,
// então nada aqui pode depender do formato inteiro.

export type ClienteAsaas = { id: string };

export type AssinaturaAsaas = {
  id: string;
  status: string;
  nextDueDate: string;
  value: number;
  cycle: string;
  creditCard?: { creditCardNumber?: string; creditCardBrand?: string };
};

export type CobrancaAsaas = {
  id: string;
  status: string;
  dueDate: string;
  value: number;
  invoiceUrl?: string;
};

export type QrCodePix = {
  encodedImage: string;
  payload: string;
  expirationDate: string | null;
};

// --- operações --------------------------------------------------------------

/**
 * Acha o cliente pelo `externalReference` (o id do nosso perfil) ou cria um.
 *
 * Amarrar pelo nosso id evita cliente duplicado no Asaas quando a pessoa
 * tenta assinar duas vezes, e evita casar por CPF, que muda de dono quando o
 * usuário digita errado.
 */
export async function garantirClienteNoAsaas(dados: {
  perfilId: string;
  nome: string;
  email: string;
  cpfCnpj: string;
  telefone?: string;
  cep?: string;
  numeroDoEndereco?: string;
}): Promise<string> {
  const lista = await chamarAsaas<{ data: ClienteAsaas[] }>(
    `/customers?externalReference=${encodeURIComponent(dados.perfilId)}&limit=1`
  );

  const corpo = {
    name: dados.nome,
    email: dados.email,
    cpfCnpj: dados.cpfCnpj,
    mobilePhone: dados.telefone,
    postalCode: dados.cep,
    addressNumber: dados.numeroDoEndereco,
    externalReference: dados.perfilId,
    notificationDisabled: false,
  };

  const existente = lista.data?.[0];
  if (existente) {
    const atualizado = await chamarAsaas<ClienteAsaas>(
      `/customers/${existente.id}`,
      { metodo: "POST", corpo }
    );
    return atualizado.id;
  }

  const criado = await chamarAsaas<ClienteAsaas>("/customers", {
    metodo: "POST",
    corpo,
  });
  return criado.id;
}

export async function criarAssinatura(corpo: Record<string, unknown>) {
  return chamarAsaas<AssinaturaAsaas>("/subscriptions", {
    metodo: "POST",
    corpo,
  });
}

export async function obterAssinatura(id: string) {
  return chamarAsaas<AssinaturaAsaas>(`/subscriptions/${id}`);
}

export async function cancelarAssinatura(id: string) {
  return chamarAsaas<{ deleted: boolean }>(`/subscriptions/${id}`, {
    metodo: "DELETE",
  });
}

/** A cobrança mais recente gerada por uma assinatura. */
export async function primeiraCobrancaDaAssinatura(
  assinaturaId: string
): Promise<CobrancaAsaas | null> {
  const lista = await chamarAsaas<{ data: CobrancaAsaas[] }>(
    `/subscriptions/${assinaturaId}/payments?limit=1`
  );
  return lista.data?.[0] ?? null;
}

export async function obterCobranca(id: string) {
  return chamarAsaas<CobrancaAsaas>(`/payments/${id}`);
}

export async function qrCodeDaCobranca(cobrancaId: string) {
  return chamarAsaas<QrCodePix>(`/payments/${cobrancaId}/pixQrCode`);
}

// --- Pix Automático ---------------------------------------------------------
// Documentação: https://docs.asaas.com/docs/pix-automatico
//
// O cliente lê um QR Code só, que paga o primeiro ciclo e autoriza os débitos
// seguintes no banco dele. A autorização nasce CREATED e vira ACTIVE quando o
// banco do pagador confirma — só a partir daí os débitos automáticos valem.

export type StatusDaAutorizacao =
  | "CREATED"
  | "ACTIVE"
  | "CANCELLED"
  | "REFUSED"
  | "EXPIRED";

export type AutorizacaoPixAutomatico = {
  id: string;
  status: StatusDaAutorizacao;
  /** Assinatura que gera as cobranças no modo SUBSCRIPTION. */
  subscriptionId?: string | null;
  /** QR Code do primeiro pagamento: vem na raiz da resposta de criação. */
  payload?: string | null;
  encodedImage?: string | null;
  immediateQrCode?: { expirationDate?: string | null } | null;
};

export async function criarAutorizacaoPixAutomatico(corpo: {
  customerId: string;
  frequency: FrequenciaPix;
  contractId: string;
  startDate: string;
  value: number;
  description: string;
  primeiroPagamento: { valor: number; expiraEmSegundos: number; descricao: string };
}) {
  return chamarAsaas<AutorizacaoPixAutomatico>("/pix/automatic/authorizations", {
    metodo: "POST",
    corpo: {
      customerId: corpo.customerId,
      frequency: corpo.frequency,
      contractId: corpo.contractId,
      startDate: corpo.startDate,
      value: corpo.value,
      description: corpo.description,
      // O Asaas gera as cobranças dos ciclos seguintes sozinho, por uma
      // assinatura. No modo MANUAL seria preciso criar cada cobrança pela
      // API entre 2 e 10 dias úteis antes do vencimento — um agendador a
      // mais para manter, sem ganho nenhum para quem vende um plano fixo.
      paymentCreationMode: "SUBSCRIPTION",
      // Débito recusado (saldo insuficiente) ganha até 3 novas tentativas em
      // 7 dias antes de virar atraso.
      retryPolicy: "ALLOW_THREE_IN_SEVEN_DAYS",
      immediateQrCode: {
        originalValue: corpo.primeiroPagamento.valor,
        expirationSeconds: corpo.primeiroPagamento.expiraEmSegundos,
        description: corpo.primeiroPagamento.descricao,
      },
    },
  });
}

export async function obterAutorizacaoPixAutomatico(id: string) {
  return chamarAsaas<AutorizacaoPixAutomatico>(
    `/pix/automatic/authorizations/${id}`
  );
}

export async function cancelarAutorizacaoPixAutomatico(id: string) {
  return chamarAsaas<unknown>(`/pix/automatic/authorizations/${id}`, {
    metodo: "DELETE",
  });
}

/**
 * Cobranças recebidas de um cliente a partir de uma data.
 *
 * Existe para um caso de borda do Pix Automático: o banco do pagador pode
 * recusar a autorização mesmo depois de o primeiro pagamento ter caído. Aí o
 * dinheiro entrou e o ciclo pago precisa virar acesso, mesmo sem recorrência.
 */
export async function cobrancasRecebidasDesde(
  clienteId: string,
  desde: string
): Promise<CobrancaAsaas[]> {
  const params = new URLSearchParams({
    customer: clienteId,
    status: "RECEIVED",
    "dateCreated[ge]": desde,
    limit: "10",
  });
  const lista = await chamarAsaas<{ data: CobrancaAsaas[] }>(`/payments?${params}`);
  return lista.data ?? [];
}
