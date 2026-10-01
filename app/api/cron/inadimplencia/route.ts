/**
 * Rotina diária da régua de cobrança (agendada em vercel.json).
 *
 * Cancela no Asaas as assinaturas que ninguém vai pagar, para o Asaas parar
 * de gerar cobrança e mandar lembrete para quem foi embora:
 *
 * 1. Em atraso há 15 dias ou mais (DIAS_ATE_CANCELAR).
 * 2. Abertas e nunca pagas há 15 dias ou mais: quem gerou um Pix ou um boleto
 *    e desistiu. Sem isto, a assinatura seguiria viva no Asaas, emitindo uma
 *    cobrança nova a cada ciclo.
 *
 * Antes de cancelar por atraso, a rotina confirma no Asaas que existe mesmo
 * uma cobrança vencida. Se o webhook do pagamento se perdeu, a pessoa pagou e
 * o espelho local só não ficou sabendo — aí a rotina sincroniza o pagamento
 * em vez de cancelar quem está em dia.
 *
 * A Vercel chama esta rota com `Authorization: Bearer <CRON_SECRET>`. Sem a
 * variável configurada, a rotina não roda: uma rota que cancela assinaturas
 * não pode ficar aberta para quem descobrir o endereço.
 */

import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

import { hojeNoBrasil, somarDias } from "@/lib/datas";
import { env } from "@/lib/env";
import { cobrancasDaAssinatura } from "@/lib/pagamentos/asaas";
import {
  DIAS_ATE_CANCELAR,
  DIAS_DE_CARENCIA,
} from "@/lib/pagamentos/inadimplencia";
import {
  encerrarNoAsaas,
  registrarCancelamento,
  registrarPagamentoConfirmado,
} from "@/lib/pagamentos/sincronizar";
import { clienteAdmin } from "@/lib/supabase/server";
import type { Assinatura } from "@/types/database";

export const dynamic = "force-dynamic";

const PAGAS = new Set(["CONFIRMED", "RECEIVED", "RECEIVED_IN_CASH"]);

function autorizado(cabecalho: string | null): boolean {
  if (!env.cronSecret || !cabecalho) return false;
  const a = Buffer.from(cabecalho);
  const b = Buffer.from(`Bearer ${env.cronSecret}`);
  return a.length === b.length && timingSafeEqual(a, b);
}

type Resultado = "cancelada" | "sincronizada" | "mantida" | "erro";

/**
 * Decide o destino de uma assinatura em atraso, olhando as cobranças dela no
 * Asaas — nunca só o espelho local.
 */
async function resolverAtraso(assinatura: Assinatura): Promise<Resultado> {
  // Pix Automático que nunca chegou a ter assinatura no Asaas: só existe a
  // autorização, e não há cobrança para conferir.
  if (!assinatura.asaas_subscription_id) {
    await encerrarNoAsaas(assinatura, { estrito: false });
    await registrarCancelamento(assinatura);
    return "cancelada";
  }

  const cobrancas = await cobrancasDaAssinatura(assinatura.asaas_subscription_id);

  if (cobrancas.some((c) => c.status === "OVERDUE")) {
    await encerrarNoAsaas(assinatura, { estrito: false });
    await registrarCancelamento(assinatura);
    return "cancelada";
  }

  // Nada vencido no Asaas: o pagamento caiu e o aviso não chegou aqui.
  if (cobrancas.some((c) => PAGAS.has(c.status))) {
    await registrarPagamentoConfirmado(assinatura);
    return "sincronizada";
  }

  return "mantida";
}

export async function GET(requisicao: Request) {
  if (!env.cronSecret) {
    return NextResponse.json(
      { erro: "CRON_SECRET não configurada: a rotina não roda sem ela." },
      { status: 503 }
    );
  }
  if (!autorizado(requisicao.headers.get("authorization"))) {
    return NextResponse.json({ erro: "não autorizado" }, { status: 401 });
  }

  const hoje = hojeNoBrasil();
  const supabase = clienteAdmin();

  // O acesso vai até vencimento + carência; 15 dias depois do vencimento é
  // acesso_ate + (15 - carência). Pela data do acesso, e não só pelo status,
  // pega também quem ficou "ativa" porque o aviso de atraso nunca chegou.
  const limiteDoAcesso = somarDias(hoje, -(DIAS_ATE_CANCELAR - DIAS_DE_CARENCIA));

  const { data: atrasadas, error: erroAtrasadas } = await supabase
    .from("subscriptions")
    .select("*")
    .in("status", ["ativa", "atrasada"])
    .not("acesso_ate", "is", null)
    // Estritamente antes: a tela promete "sem pagamento até <vencimento + 15>,
    // cancela", então o dia do prazo inteiro ainda vale para pagar.
    .lt("acesso_ate", limiteDoAcesso);

  // Abertas e nunca pagas: a última mudança na linha é de antes do limite.
  const limiteDasPendentes = new Date(
    Date.now() - DIAS_ATE_CANCELAR * 86_400_000
  ).toISOString();

  const { data: pendentes, error: erroPendentes } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("status", "pendente")
    .lte("updated_at", limiteDasPendentes);

  if (erroAtrasadas || erroPendentes) {
    return NextResponse.json(
      { erro: (erroAtrasadas ?? erroPendentes)?.message },
      { status: 500 }
    );
  }

  const resumo: Record<Resultado, number> = {
    cancelada: 0,
    sincronizada: 0,
    mantida: 0,
    erro: 0,
  };

  // Uma por vez: são poucas por dia, e em série o Asaas não vê uma rajada.
  for (const assinatura of atrasadas ?? []) {
    try {
      resumo[await resolverAtraso(assinatura)] += 1;
    } catch (erro) {
      resumo.erro += 1;
      console.error(`[inadimplencia] ${assinatura.id}:`, erro);
    }
  }

  for (const assinatura of pendentes ?? []) {
    try {
      await encerrarNoAsaas(assinatura, { estrito: false });
      await registrarCancelamento(assinatura);
      resumo.cancelada += 1;
    } catch (erro) {
      resumo.erro += 1;
      console.error(`[inadimplencia] pendente ${assinatura.id}:`, erro);
    }
  }

  console.log(`[inadimplencia] ${hoje}:`, JSON.stringify(resumo));
  return NextResponse.json({ hoje, ...resumo });
}
