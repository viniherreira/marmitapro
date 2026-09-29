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

  const assinatura = await assinaturaPorIdDoAsaas(idDaAssinatura);
  if (!assinatura) {
    return NextResponse.json({ recebido: true, desconhecida: idDaAssinatura });
  }

  const quando = evento.dateCreated ? new Date(evento.dateCreated) : new Date();

  switch (tipo) {
    case "PAYMENT_CONFIRMED":
    case "PAYMENT_RECEIVED":
      await registrarPagamentoConfirmado(assinatura, quando);
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

  return NextResponse.json({ recebido: true });
}
