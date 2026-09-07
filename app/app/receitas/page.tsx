import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Utensils } from "lucide-react";

import { CabecalhoDePagina } from "@/components/app/cabecalho-de-pagina";
import { CapaDaReceita } from "@/components/receitas/capa";
import { FiltrosDeReceitas } from "@/components/receitas/filtros";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { listarReceitas, ROTULO_OBJETIVO } from "@/lib/data/receitas";
import { formatarDecimal, formatarInteiro, formatarMoeda } from "@/lib/format";
import type { ObjetivoReceita } from "@/types/database";

export const metadata: Metadata = {
  title: "Banco de receitas",
  description:
    "Receitas completas com modo de preparo, ficha nutricional e custo estimado.",
};

const OBJETIVOS_VALIDOS: ObjetivoReceita[] = [
  "low_carb",
  "rica_proteina",
  "economica",
];

type Busca = { busca?: string; objetivo?: string };

export default async function ReceitasPage({
  searchParams,
}: {
  searchParams: Promise<Busca>;
}) {
  const parametros = await searchParams;

  const objetivo = OBJETIVOS_VALIDOS.includes(
    parametros.objetivo as ObjetivoReceita
  )
    ? (parametros.objetivo as ObjetivoReceita)
    : undefined;

  const receitas = await listarReceitas({ busca: parametros.busca, objetivo });

  return (
    <div className="space-y-8">
      <CabecalhoDePagina
        sobrelinha="Cardápio"
        titulo="Banco de receitas"
        descricao="Cada receita traz o modo de preparo, a ficha nutricional por porção e o custo estimado dos ingredientes."
      />

      <Suspense fallback={<Skeleton className="h-24 w-full max-w-md" />}>
        <FiltrosDeReceitas />
      </Suspense>

      {receitas.length === 0 ? (
        <EmptyState
          icon={Utensils}
          title="Nenhuma receita encontrada"
          description="Tente outro termo de busca ou remova o filtro de objetivo."
        />
      ) : (
        <>
          <p className="t-small text-muted" aria-live="polite">
            {receitas.length}{" "}
            {receitas.length === 1 ? "receita" : "receitas"} no cardápio.
          </p>

          <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {receitas.map((receita, indice) => (
              <li key={receita.id}>
                <Link
                  href={`/app/receitas/${receita.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface transition-[border-color] duration-150 hover:border-border-strong"
                >
                  <CapaDaReceita
                    nome={receita.nome}
                    objetivo={receita.objetivo}
                    imagemUrl={receita.imagem_url}
                    prioridade={indice < 3}
                    className="aspect-[16/9] w-full"
                  />

                  <div className="flex flex-1 flex-col p-5">
                    <Badge variant="outline">
                      {ROTULO_OBJETIVO[receita.objetivo]}
                    </Badge>
                    <h2 className="t-h3 mt-3 text-balance">{receita.nome}</h2>
                    <p className="t-small mt-2 flex-1 text-muted">
                      {receita.descricao}
                    </p>

                    <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-4 text-[0.75rem]">
                      <div>
                        <dt className="text-muted">Por porção</dt>
                        <dd className="mt-0.5 font-medium tabular-nums">
                          {formatarInteiro(receita.porPorcao.kcal)} kcal
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted">Proteína</dt>
                        <dd className="mt-0.5 font-medium tabular-nums">
                          {formatarDecimal(receita.porPorcao.proteina)} g
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted">Custo</dt>
                        <dd className="mt-0.5 font-medium tabular-nums">
                          {formatarMoeda(receita.porPorcao.custo)}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
