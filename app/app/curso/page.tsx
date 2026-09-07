import type { Metadata } from "next";
import Link from "next/link";
import { Check, Clock } from "lucide-react";

import { CabecalhoDePagina } from "@/components/app/cabecalho-de-pagina";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { garantirPerfil } from "@/lib/auth/perfil";
import { carregarTrilha } from "@/lib/data/curso";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Trilha do curso",
  description: "Cinco módulos, do zero ao cliente fidelizado.",
};

export default async function CursoPage() {
  const perfil = await garantirPerfil();
  const trilha = await carregarTrilha(perfil.id);

  const percentual = Math.round(trilha.progresso * 100);

  return (
    <div className="space-y-10">
      <CabecalhoDePagina
        sobrelinha="Trilha"
        titulo="Do zero ao primeiro cliente, em ordem"
        descricao="Cada módulo termina com uma ferramenta do app aberta. Marque a aula como concluída para o progresso ficar salvo."
      />

      <section className="space-y-3 rounded-lg border border-border bg-surface p-5 sm:p-6">
        <div className="flex items-baseline justify-between">
          <span className="t-small text-muted">Progresso geral</span>
          <span className="t-small tabular-nums">
            {trilha.aulasConcluidas} de {trilha.totalAulas} aulas · {percentual}%
          </span>
        </div>
        <Progress
          value={percentual}
          aria-label={`Progresso geral da trilha: ${percentual}%`}
        />
      </section>

      <div className="space-y-12">
        {trilha.modulos.map((modulo) => (
          <section key={modulo.id}>
            <header className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
              <div className="max-w-2xl">
                <p className="t-eyebrow tabular-nums">
                  Módulo {String(modulo.ordem).padStart(2, "0")}
                </p>
                <h2 className="t-h2 mt-3">{modulo.titulo}</h2>
                <p className="t-body mt-2 text-muted">{modulo.descricao}</p>
              </div>

              {modulo.aulasConcluidas === modulo.totalAulas &&
              modulo.totalAulas > 0 ? (
                <Badge variant="success">
                  <Check />
                  Concluído
                </Badge>
              ) : (
                <span className="t-small shrink-0 tabular-nums text-muted">
                  {modulo.aulasConcluidas}/{modulo.totalAulas}
                </span>
              )}
            </header>

            <ol className="mt-6 divide-y divide-border overflow-hidden rounded-lg border border-border">
              {modulo.aulas.map((aula, indice) => (
                <li key={aula.id}>
                  <Link
                    href={`/app/curso/${modulo.slug}/${aula.slug}`}
                    className="flex items-start gap-4 bg-surface px-5 py-4 transition-colors duration-150 hover:bg-surface-hover"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border text-[0.6875rem] font-medium tabular-nums",
                        aula.concluida
                          ? "border-success bg-success text-primary-foreground"
                          : "border-border-strong text-muted"
                      )}
                    >
                      {aula.concluida ? (
                        <Check className="size-3.5" />
                      ) : (
                        indice + 1
                      )}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="t-h3 block">{aula.titulo}</span>
                      <span className="t-small mt-1 block text-muted">
                        {aula.resumo}
                      </span>
                    </span>

                    <span className="t-small flex shrink-0 items-center gap-1.5 tabular-nums text-muted">
                      <Clock className="size-3.5" aria-hidden="true" />
                      {aula.duracao_minutos} min
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
