import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ClipboardList, Plus } from "lucide-react";

import { CabecalhoDePagina } from "@/components/app/cabecalho-de-pagina";
import { BloqueioDeAssinatura } from "@/components/assinatura/bloqueio";
import { CartaoDoPedido } from "@/components/pedidos/cartao-do-pedido";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { garantirPerfil } from "@/lib/auth/perfil";
import { situacaoDeAcesso } from "@/lib/data/assinaturas";
import {
  listarPedidosDaSemana,
  resumirSemana,
  type PedidoCompleto,
} from "@/lib/data/pedidos";
import { formatarInteiro, formatarMoeda } from "@/lib/format";
import {
  dataValida,
  hojeNoBrasil,
  inicioDaSemana,
  rotuloDaSemana,
  rotuloDoDia,
  somarDias,
} from "@/lib/pedidos/semana";
import { SITUACOES } from "@/lib/pedidos/situacao";

export const metadata: Metadata = {
  title: "Pedidos",
  description: "Anote e acompanhe os pedidos de marmita da semana.",
};

type Busca = { semana?: string };

export default async function PedidosPage({
  searchParams,
}: {
  searchParams: Promise<Busca>;
}) {
  const perfil = await garantirPerfil();
  const { liberado } = await situacaoDeAcesso();

  if (!liberado) {
    return (
      <div className="space-y-10">
        <CabecalhoDePagina
          sobrelinha="Operação"
          titulo="Pedidos"
          descricao="O caderno de pedidos da sua cozinha: quem pediu, o quê, quando entrega e em que pé está."
        />
        <BloqueioDeAssinatura
          ferramenta="O controle de pedidos"
          texto="Anote cada pedido, acompanhe da cozinha até a entrega e veja quantas marmitas de cada prato fazer na semana."
        />
      </div>
    );
  }

  const parametros = await searchParams;
  const hoje = hojeNoBrasil();
  const semanaAtual = inicioDaSemana(hoje);
  const inicio = dataValida(parametros.semana)
    ? inicioDaSemana(parametros.semana)
    : semanaAtual;

  const pedidos = await listarPedidosDaSemana(perfil.id, inicio);
  const resumo = resumirSemana(pedidos);

  const ehSemanaAtual = inicio === semanaAtual;
  // Novo pedido a partir de outra semana já abre com a data dela.
  const dataDoNovo = ehSemanaAtual ? hoje : inicio;

  const porDia = new Map<string, PedidoCompleto[]>();
  for (const pedido of pedidos) {
    const lista = porDia.get(pedido.entrega_data) ?? [];
    lista.push(pedido);
    porDia.set(pedido.entrega_data, lista);
  }

  return (
    <div className="space-y-8">
      <CabecalhoDePagina
        sobrelinha="Operação"
        titulo="Pedidos"
        descricao="Quem pediu, o quê, quando entrega e em que pé está. A produção da semana sai somada."
        acao={
          <Button asChild>
            <Link href={`/app/pedidos/novo?data=${dataDoNovo}`}>
              <Plus className="size-4" aria-hidden="true" />
              Novo pedido
            </Link>
          </Button>
        }
      />

      {/* Semana --------------------------------------------------------- */}
      <nav
        aria-label="Semana"
        className="flex flex-wrap items-center justify-between gap-3"
      >
        <Button asChild variant="ghost" size="sm">
          <Link href={`/app/pedidos?semana=${somarDias(inicio, -7)}`}>
            <ChevronLeft className="size-4" aria-hidden="true" />
            Anterior
          </Link>
        </Button>

        <div className="text-center">
          <p className="font-medium">
            {ehSemanaAtual ? "Esta semana" : `Semana de ${rotuloDaSemana(inicio)}`}
          </p>
          {ehSemanaAtual ? (
            <p className="t-small text-muted">{rotuloDaSemana(inicio)}</p>
          ) : (
            <Link href="/app/pedidos" className="t-small text-primary underline-offset-4 hover:underline">
              Voltar para esta semana
            </Link>
          )}
        </div>

        <Button asChild variant="ghost" size="sm">
          <Link href={`/app/pedidos?semana=${somarDias(inicio, 7)}`}>
            Próxima
            <ChevronRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </nav>

      {pedidos.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title={ehSemanaAtual ? "Nenhum pedido nesta semana ainda" : "Nenhum pedido nesta semana"}
          description="Chegou pedido pelo WhatsApp? Anote aqui: fica tudo num lugar só, e a produção da semana sai somada."
          action={
            <Button asChild>
              <Link href={`/app/pedidos/novo?data=${dataDoNovo}`}>
                <Plus className="size-4" aria-hidden="true" />
                Anotar o primeiro pedido
              </Link>
            </Button>
          }
        />
      ) : (
        <>
          {/* Números da semana ------------------------------------------ */}
          <section aria-label="Resumo da semana" className="grid gap-4 sm:grid-cols-3">
            <Numero rotulo="Pedidos" valor={formatarInteiro(resumo.pedidos)} />
            <Numero rotulo="Marmitas" valor={formatarInteiro(resumo.marmitas)} />
            <Numero rotulo="Faturamento" valor={formatarMoeda(resumo.faturamento)} />
          </section>

          <div className="flex flex-wrap gap-2">
            {SITUACOES.filter((s) => resumo.porSituacao[s.valor] > 0).map((s) => (
              <Badge key={s.valor} variant={s.variante}>
                {s.rotulo}: {resumo.porSituacao[s.valor]}
              </Badge>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
            {/* Pedidos por dia ---------------------------------------- */}
            <div className="space-y-8">
              {Array.from(porDia.entries()).map(([dia, lista]) => (
                <section key={dia} aria-labelledby={`dia-${dia}`}>
                  <h2 id={`dia-${dia}`} className="t-eyebrow">
                    {rotuloDoDia(dia)}
                    {dia === hoje ? " · hoje" : ""}
                  </h2>
                  <div className="mt-4 space-y-4">
                    {lista.map((pedido) => (
                      <CartaoDoPedido key={pedido.id} pedido={pedido} />
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* Produção da semana ------------------------------------- */}
            <aside
              aria-labelledby="producao"
              className="rounded-xl border border-border bg-surface-sunken/50 p-5 lg:sticky lg:top-6"
            >
              <h2 id="producao" className="t-eyebrow">
                Produção da semana
              </h2>
              <p className="t-small mt-2 text-muted">
                Quantas de cada prato fazer, somando os pedidos de{" "}
                {rotuloDaSemana(inicio)}. Cancelados ficam de fora.
              </p>

              {resumo.producao.length === 0 ? (
                <p className="t-small mt-4 text-muted">Nada a produzir.</p>
              ) : (
                <ul className="mt-4 space-y-2.5">
                  {resumo.producao.map((prato) => (
                    <li
                      key={prato.descricao}
                      className="flex items-baseline justify-between gap-4 text-[0.9375rem]"
                    >
                      <span className="min-w-0">{prato.descricao}</span>
                      <span className="shrink-0 font-medium tabular-nums">
                        {prato.quantidade}
                      </span>
                    </li>
                  ))}
                  <li className="flex items-baseline justify-between gap-4 border-t border-border pt-2.5 font-medium">
                    <span>Total</span>
                    <span className="tabular-nums">{resumo.marmitas}</span>
                  </li>
                </ul>
              )}
            </aside>
          </div>
        </>
      )}
    </div>
  );
}

function Numero({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <p className="t-small text-muted">{rotulo}</p>
      <p className="t-metric mt-1" data-numeric>
        {valor}
      </p>
    </div>
  );
}
