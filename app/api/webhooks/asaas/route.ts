/**
 * Webhook do Asaas.
 *
 * É por aqui que o pagamento vira acesso: o app nunca pergunta ao Asaas a
 * cada tela, ele reage ao aviso e guarda o resultado.
 *
 * Três cuidados que o Asaas exige de quem recebe:
 *
 * 1. Validar o header `asaas-access-token` contra o token cadastrado no
 *    webhook. Sem isso, qualquer um que descubra a URL libera acesso de graça.
 * 2. Responder 200 rápido. Enquanto o endereço não devolve 200, o Asaas
 *    reenfileira o evento e pausa a fila inteira da conta.
 * 3. Aguentar reentrega do mesmo evento. Guardamos o id em `asaas_events` e
 *    ignoramos o que já passou por aqui.
 *
 * Documentação: https://docs.asaas.com/docs/sobre-os-webhooks
 */

import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import {
  assinaturaPorIdDoAsaas,
  registrarAtraso,
  registrarCancelamento,
  registrarEstorno,
  registrarPagamentoConfirmado,
} from "@/lib/pagamentos/sincronizar";
import { clienteAdmin } from "@/lib/supabase/server";

type EventoDoAsaas = {
  id?: string;
  event?: string;
  dateCreated?: string;
  payment?: {
    id?: string;
    subscription?: string;
    value?: number;
    status?: string;
  };
  subscription?: { id?: string };
};

/** Comparação de tokens sem vazar o tamanho nem a posição do primeiro erro. */
function tokenConfere(recebido: string | null): boolean {
  if (!env.asaasWebhookToken || !recebido) return false;

  const a = Buffer.from(recebido);
  const b = Buffer.from(env.asaasWebhookToken);
  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}

export async function POST(requisicao: Request) {
  if (!tokenConfere(requisicao.headers.get("asaas-access-token"))) {
    return NextResponse.json({ erro: "não autorizado" }, { status: 401 });
  }

  let evento: EventoDoAsaas;
  try {
    evento = (await requisicao.json()) as EventoDoAsaas;
  } catch {
    return NextResponse.json({ erro: "corpo inválido" }, { status: 400 });
  }

  const idDoEvento = evento.id ?? null;
  const tipo = evento.event ?? "";
  const idDaAssinatura = evento.payment?.subscription ?? evento.subscription?.id;

  const supabase = clienteAdmin();

  // Idempotência: a inserção falha por chave duplicada quando o evento já
  // passou. Nesse caso respondemos 200 sem processar de novo.
  if (idDoEvento) {
    const { error } = await supabase.from("asaas_events").insert({
      id: idDoEvento,
      evento: tipo,
      asaas_payment_id: evento.payment?.id ?? null,
      asaas_subscription_id: idDaAssinatura ?? null,
      payload: evento as never,
    });

    if (error) {
      // 23505 = unique_violation. Qualquer outro erro é problema nosso, e
      // devolver 500 faz o Asaas reenviar depois, que é o que queremos.
      if (error.code === "23505") {
        return NextResponse.json({ recebido: true, repetido: true });
      }
      return NextResponse.json({ erro: "falha ao registrar" }, { status: 500 });
    }
  }

  // Evento que não é de assinatura (cobrança avulsa, transferência) não tem o
  // que fazer aqui, mas também não é erro: 200 para não travar a fila.
  if (!idDaAssinatura) {
    return NextResponse.json({ recebido: true, ignorado: tipo });
  }

  try {
    await aplicarEvento(tipo, idDaAssinatura, evento.dateCreated);
  } catch {
    // O registro do evento sai junto com a falha. Sem isso, a reentrega do
    // Asaas esbarraria na idempotência como "repetida" e o pagamento nunca
    // viraria acesso — o evento ficaria marcado como visto sem ter sido
    // aplicado. Apagando, o 500 abaixo faz o Asaas tentar de novo do zero.
    if (idDoEvento) {
      await supabase.from("asaas_events").delete().eq("id", idDoEvento);
    }
    return NextResponse.json({ erro: "falha ao processar" }, { status: 500 });
  }

  return NextResponse.json({ recebido: true });
}

async function aplicarEvento(
  tipo: string,
  idDaAssinatura: string,
  dataDoEvento: string | undefined
): Promise<void> {
  const assinatura = await assinaturaPorIdDoAsaas(idDaAssinatura);

  // Assinatura que não é nossa (criada à mão no painel, ou de outro sistema
  // na mesma conta) não é erro: não há o que atualizar.
  if (!assinatura) return;

  switch (tipo) {
    case "PAYMENT_CONFIRMED":
    case "PAYMENT_RECEIVED":
      await registrarPagamentoConfirmado(assinatura, dataDoAsaas(dataDoEvento));
      break;

    case "PAYMENT_OVERDUE":
      await registrarAtraso(assinatura);
      break;

    case "PAYMENT_REFUNDED":
    case "PAYMENT_CHARGEBACK_REQUESTED":
      await registrarEstorno(assinatura);
      break;

    case "SUBSCRIPTION_DELETED":
    case "SUBSCRIPTION_INACTIVATED":
      await registrarCancelamento(assinatura);
      break;

    default:
      // Os demais eventos ficam gravados em asaas_events e não mudam acesso.
      break;
  }
}

/**
 * O Asaas manda datas como "2026-09-29 14:03:11", no horário de Brasília e
 * sem fuso. Lida como veio, a data depende do fuso do servidor; aqui ela é
 * ancorada em -03:00. Qualquer formato inesperado cai no agora, que erra por
 * segundos — melhor que derrubar o processamento de um pagamento.
 */
function dataDoAsaas(bruta: string | undefined): Date {
  if (!bruta) return new Date();

  const iso = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(bruta)
    ? `${bruta.replace(" ", "T")}-03:00`
    : bruta;

  const data = new Date(iso);
  return Number.isNaN(data.getTime()) ? new Date() : data;
}
