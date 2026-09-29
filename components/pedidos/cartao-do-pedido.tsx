"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, Loader2, MapPin, MessageCircle, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SelectNativo } from "@/components/ui/select-nativo";
import { excluirPedido, mudarSituacaoDoPedido } from "@/lib/actions/pedidos";
import type { PedidoCompleto } from "@/lib/data/pedidos";
import { formatarMoeda } from "@/lib/format";
import { horaCurta } from "@/lib/pedidos/semana";
import { SITUACOES, dadosDaSituacao } from "@/lib/pedidos/situacao";
import { cn } from "@/lib/utils";
import type { SituacaoPedido } from "@/types/database";

/**
 * Link do WhatsApp a partir do telefone como a pessoa digitou.
 *
 * Com 10 ou 11 dígitos é número brasileiro com DDD e ganha o 55. Com 12 ou 13
 * já veio com o código do país. Fora disso não arriscamos um link que abre a
 * conversa com um estranho.
 */
function linkDoWhatsApp(telefone: string | null): string | null {
  const digitos = telefone?.replace(/\D/g, "") ?? "";
  if (digitos.length === 10 || digitos.length === 11) {
    return `https://wa.me/55${digitos}`;
  }
  if ((digitos.length === 12 || digitos.length === 13) && digitos.startsWith("55")) {
    return `https://wa.me/${digitos}`;
  }
  return null;
}

export function CartaoDoPedido({ pedido }: { pedido: PedidoCompleto }) {
  const router = useRouter();
  const [mudando, iniciarMudanca] = React.useTransition();
  const [excluindo, iniciarExclusao] = React.useTransition();
  const [confirmando, setConfirmando] = React.useState(false);

  // A troca aparece na hora; se o servidor recusar, volta ao que era.
  const [situacao, setSituacao] = React.useState<SituacaoPedido>(pedido.situacao);
  React.useEffect(() => setSituacao(pedido.situacao), [pedido.situacao]);

  const dados = dadosDaSituacao(situacao);
  const hora = horaCurta(pedido.entrega_hora);
  const whatsapp = linkDoWhatsApp(pedido.cliente.telefone);
  const cancelado = situacao === "cancelado";

  function mudarSituacao(nova: SituacaoPedido) {
    const anterior = situacao;
    setSituacao(nova);

    iniciarMudanca(async () => {
      const resultado = await mudarSituacaoDoPedido({ id: pedido.id, situacao: nova });
      if (!resultado.ok) {
        setSituacao(anterior);
        toast.error(resultado.erro);
        return;
      }
      router.refresh();
    });
  }

  function excluir() {
    iniciarExclusao(async () => {
      const resultado = await excluirPedido({ id: pedido.id });
      if (!resultado.ok) {
        toast.error(resultado.erro);
        return;
      }
      toast.success("Pedido excluído.");
      router.refresh();
    });
  }

  return (
    <article
      className={cn(
        "rounded-xl border border-border bg-surface p-5 transition-opacity",
        cancelado && "opacity-60"
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className={cn("t-h3 truncate", cancelado && "line-through")}>
            {pedido.cliente.nome}
          </h3>
          <p className="t-small mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted">
            {hora ? (
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5" aria-hidden="true" />
                {hora}
              </span>
            ) : null}
            {pedido.cliente.endereco ? (
              <span className="inline-flex min-w-0 items-center gap-1">
                <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{pedido.cliente.endereco}</span>
              </span>
            ) : null}
          </p>
        </div>
        <Badge variant={dados.variante}>{dados.rotulo}</Badge>
      </header>

      <ul className="mt-4 space-y-1.5 border-t border-border pt-4">
        {pedido.itens.map((item) => (
          <li key={item.id} className="flex justify-between gap-4 text-[0.9375rem]">
            <span className="min-w-0">
              <span className="font-medium tabular-nums">{item.quantidade}×</span>{" "}
              {item.descricao}
            </span>
            <span className="shrink-0 tabular-nums text-muted">
              {formatarMoeda(item.quantidade * Number(item.preco_unitario))}
            </span>
          </li>
        ))}
      </ul>

      {pedido.observacoes ? (
        <p className="t-small mt-3 rounded-lg bg-surface-sunken px-3 py-2 text-muted-strong">
          {pedido.observacoes}
        </p>
      ) : null}

      <footer className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <p className="font-medium tabular-nums">
          {formatarMoeda(Number(pedido.valor_total))}
        </p>

        {/* No celular a linha de controles ocupa a largura toda e o seletor
            estica: assim os botões de ícone cabem ao lado dele, em vez de a
            lixeira cair sozinha numa linha de baixo. */}
        <div className="flex w-full items-center gap-1 sm:w-auto sm:gap-2">
          <div className="min-w-0 flex-1 sm:w-40 sm:flex-none">
            <SelectNativo
              aria-label={`Situação do pedido de ${pedido.cliente.nome}`}
              value={situacao}
              disabled={mudando}
              onChange={(e) => mudarSituacao(e.target.value as SituacaoPedido)}
              className="h-9 text-sm"
            >
              {SITUACOES.map((s) => (
                <option key={s.valor} value={s.valor}>
                  {s.rotulo}
                </option>
              ))}
            </SelectNativo>
          </div>

          {whatsapp ? (
            <Button asChild variant="ghost" size="sm">
              <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-4" aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">WhatsApp</span>
              </a>
            </Button>
          ) : null}

          <Button asChild variant="ghost" size="sm">
            <Link href={`/app/pedidos/${pedido.id}`}>
              <Pencil className="size-4" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">Editar</span>
            </Link>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setConfirmando(true)}
            aria-label="Excluir pedido"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </footer>

      {confirmando ? (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-destructive/25 bg-destructive-soft p-3">
          <p className="t-small flex-1">
            Excluir este pedido? Se ele só não vai acontecer, marque como
            cancelado — assim fica no histórico.
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={excluir}
            disabled={excluindo}
          >
            {excluindo ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : null}
            Excluir
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setConfirmando(false)}
            disabled={excluindo}
          >
            Voltar
          </Button>
        </div>
      ) : null}
    </article>
  );
}
