"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { removerCalculoDeMacros } from "@/lib/actions/ferramentas";
import { formatarDecimal, formatarInteiro, formatarMoeda } from "@/lib/format";
import type { CalculoSalvo } from "@/types/database";

export function ListaDeSalvos({ calculos }: { calculos: CalculoSalvo[] }) {
  const router = useRouter();
  const [removendo, setRemovendo] = React.useState<string | null>(null);
  const [, iniciarTransicao] = React.useTransition();

  function remover(id: string, nome: string) {
    setRemovendo(id);

    iniciarTransicao(async () => {
      const resultado = await removerCalculoDeMacros({ id });
      setRemovendo(null);

      if (!resultado.ok) {
        toast.error("Não foi possível remover", { description: resultado.erro });
        return;
      }

      toast.success(`“${nome}” foi removida`);
      router.refresh();
    });
  }

  return (
    <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border">
      {calculos.map((calculo) => {
        const porcoes = calculo.porcoes > 0 ? calculo.porcoes : 1;

        return (
          <li
            key={calculo.id}
            className="flex flex-wrap items-center gap-x-6 gap-y-3 bg-surface px-5 py-4"
          >
            <div className="min-w-0 flex-1">
              <p className="t-h3 truncate">{calculo.nome}</p>
              <p className="t-small mt-0.5 text-muted">
                {calculo.porcoes} {calculo.porcoes === 1 ? "porção" : "porções"}{" "}
                · {Array.isArray(calculo.itens) ? calculo.itens.length : 0}{" "}
                ingredientes
              </p>
            </div>

            <dl className="flex shrink-0 gap-5 tabular-nums">
              <div>
                <dt className="t-small text-muted">Por porção</dt>
                <dd className="text-[0.9375rem] font-medium">
                  {formatarInteiro(Number(calculo.kcal_total) / porcoes)} kcal
                </dd>
              </div>
              <div>
                <dt className="t-small text-muted">Proteína</dt>
                <dd className="text-[0.9375rem] font-medium">
                  {formatarDecimal(Number(calculo.proteina_total_g) / porcoes)} g
                </dd>
              </div>
              <div>
                <dt className="t-small text-muted">Custo</dt>
                <dd className="text-[0.9375rem] font-medium">
                  {formatarMoeda(Number(calculo.custo_total))}
                </dd>
              </div>
            </dl>

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => remover(calculo.id, calculo.nome)}
              disabled={removendo === calculo.id}
              aria-label={`Remover ${calculo.nome}`}
            >
              {removendo === calculo.id ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Trash2 />
              )}
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
