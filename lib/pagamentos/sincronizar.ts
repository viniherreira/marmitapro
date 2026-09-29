/**
 * Traduz o que aconteceu no Asaas para o espelho local da assinatura.
 *
 * Duas portas chegam aqui: o webhook, que é o caminho normal, e a própria
 * tela de checkout, que confere o pagamento na hora para não deixar quem
 * acabou de pagar olhando para uma tela de "aguardando". As duas passam pelas
 * mesmas funções, então o resultado não depende de qual chegou primeiro.
 */

import { obterAssinatura } from "@/lib/pagamentos/asaas";
import { planoPorId } from "@/lib/pagamentos/planos";
import { clienteAdmin } from "@/lib/supabase/server";
import type { Assinatura } from "@/types/database";

/** Folga entre o vencimento e a confirmação da cobrança seguinte. */
const DIAS_DE_FOLGA = 3;

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

  try {
    const remota = await obterAssinatura(assinatura.asaas_subscription_id);
    proximoVencimento = remota.nextDueDate ?? null;
    bandeira = remota.creditCard?.creditCardBrand ?? bandeira;
    final = remota.creditCard?.creditCardNumber ?? final;
  } catch {
    // Seguimos com o prazo do plano: perder o acesso de quem pagou é pior do
    // que conceder um dia a mais para quem parou de pagar.
  }

  const plano = planoPorId(assinatura.plano);
  const base = quando.toISOString().slice(0, 10);

  const acessoAte = proximoVencimento
    ? somarDias(proximoVencimento, DIAS_DE_FOLGA)
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
