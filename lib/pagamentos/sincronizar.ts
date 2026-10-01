/**
 * Traduz o que aconteceu no Asaas para o espelho local da assinatura.
 *
 * Duas portas chegam aqui: o webhook, que é o caminho normal, e a própria
 * tela de checkout, que confere o pagamento na hora para não deixar quem
 * acabou de pagar olhando para uma tela de "aguardando". As duas passam pelas
 * mesmas funções, então o resultado não depende de qual chegou primeiro.
 */

import {
  ErroDoAsaas,
  cancelarAssinatura,
  cancelarAutorizacaoPixAutomatico,
  cobrancasRecebidasDesde,
  obterAssinatura,
} from "@/lib/pagamentos/asaas";
import { DIAS_DE_CARENCIA } from "@/lib/pagamentos/inadimplencia";
import { planoPorId } from "@/lib/pagamentos/planos";
import { clienteAdmin } from "@/lib/supabase/server";
import type { Assinatura } from "@/types/database";


export async function assinaturaPorIdDoAsaas(
  asaasSubscriptionId: string
): Promise<Assinatura | null> {
  const supabase = clienteAdmin();

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("asaas_subscription_id", asaasSubscriptionId)
    .maybeSingle();

  if (error) throw new Error(`Falha ao ler a assinatura: ${error.message}`);
  return data;
}

/** A assinatura de Pix Automático, pelo id da autorização no Asaas. */
export async function assinaturaPorAutorizacao(
  autorizacaoId: string
): Promise<Assinatura | null> {
  const supabase = clienteAdmin();

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("asaas_authorization_id", autorizacaoId)
    .maybeSingle();

  if (error) throw new Error(`Falha ao ler a assinatura: ${error.message}`);
  return data;
}

/**
 * Grava o id da assinatura que o Asaas cria para gerar os débitos do Pix
 * Automático. Sem ele, os avisos de pagamento dos meses seguintes — que
 * chegam pela assinatura, não pela autorização — não achariam a quem liberar.
 */
export async function vincularAssinaturaDoAsaas(
  assinatura: Assinatura,
  asaasSubscriptionId: string | null | undefined
): Promise<Assinatura> {
  if (!asaasSubscriptionId || assinatura.asaas_subscription_id === asaasSubscriptionId) {
    return assinatura;
  }
  await atualizar(assinatura.id, { asaas_subscription_id: asaasSubscriptionId });
  return { ...assinatura, asaas_subscription_id: asaasSubscriptionId };
}

function somarDias(data: string, dias: number): string {
  const d = new Date(`${data}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
}

/**
 * Pagamento confirmado: libera o acesso até o próximo vencimento.
 *
 * O próximo vencimento vem do Asaas, que já avançou o ciclo ao confirmar —
 * é mais confiável que somar o ciclo por conta própria, porque o Asaas
 * considera proporcionalidade, mês curto e feriado. Se a consulta falhar,
 * caímos no prazo do plano, que erra por no máximo um dia.
 */
export async function registrarPagamentoConfirmado(
  assinatura: Assinatura,
  quando = new Date()
): Promise<void> {
  let proximoVencimento: string | null = null;
  let bandeira: string | null = assinatura.cartao_bandeira;
  let final: string | null = assinatura.cartao_final;

  // Pix Automático recém-autorizado ainda pode não ter assinatura no Asaas:
  // aí o prazo sai do plano.
  if (assinatura.asaas_subscription_id) {
    try {
      const remota = await obterAssinatura(assinatura.asaas_subscription_id);
      proximoVencimento = remota.nextDueDate ?? null;
      bandeira = remota.creditCard?.creditCardBrand ?? bandeira;
      final = remota.creditCard?.creditCardNumber ?? final;
    } catch {
      // Seguimos com o prazo do plano: perder o acesso de quem pagou é pior
      // do que conceder um dia a mais para quem parou de pagar.
    }
  }

  const plano = planoPorId(assinatura.plano);
  const base = quando.toISOString().slice(0, 10);

  const acessoAte = proximoVencimento
    ? somarDias(proximoVencimento, DIAS_DE_CARENCIA)
    : somarDias(base, plano?.diasDeAcesso ?? 33);

  await atualizar(assinatura.id, {
    status: "ativa",
    acesso_ate: acessoAte,
    proximo_vencimento: proximoVencimento,
    ultimo_pagamento_em: quando.toISOString(),
    cartao_bandeira: bandeira,
    cartao_final: final,
  });
}

/**
 * Se o cliente já pagou o QR do primeiro ciclo do Pix Automático: procura
 * uma cobrança recebida no valor do plano, criada desde que a assinatura foi
 * aberta.
 */
export async function pagamentoInicialRecebido(
  assinatura: Assinatura
): Promise<boolean> {
  // Um dia antes da abertura: `updated_at` é UTC, e um QR gerado às 23h50 em
  // Brasília já é o dia seguinte em UTC, enquanto o Asaas data a cobrança no
  // dia de Brasília. Cliente e valor já tornam a busca precisa.
  const abertura = new Date(assinatura.updated_at);
  abertura.setUTCDate(abertura.getUTCDate() - 1);

  const recebidas = await cobrancasRecebidasDesde(
    assinatura.asaas_customer_id,
    abertura.toISOString().slice(0, 10)
  ).catch(() => []);
  return recebidas.some((c) => Number(c.value) === Number(assinatura.valor));
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
export async function encerrarNoAsaas(
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

/** Venceu e não pagou. O acesso ainda respeita `acesso_ate`, que tem folga. */
export async function registrarAtraso(assinatura: Assinatura): Promise<void> {
  await atualizar(assinatura.id, { status: "atrasada" });
}

/**
 * Cancelamento pedido pelo usuário: o acesso vale até o fim do que foi pago,
 * porque foi pago. O Asaas já não gera a cobrança seguinte.
 */
export async function registrarCancelamento(
  assinatura: Assinatura
): Promise<void> {
  await atualizar(assinatura.id, { status: "cancelada" });
}

/**
 * Estorno e chargeback cortam na hora: o dinheiro voltou para quem pagou.
 */
export async function registrarEstorno(assinatura: Assinatura): Promise<void> {
  await atualizar(assinatura.id, { status: "cancelada", acesso_ate: null });
}

async function atualizar(
  id: string,
  campos: Partial<Assinatura>
): Promise<void> {
  const supabase = clienteAdmin();
  const { error } = await supabase
    .from("subscriptions")
    .update(campos)
    .eq("id", id);

  if (error) throw new Error(`Falha ao atualizar a assinatura: ${error.message}`);
}
