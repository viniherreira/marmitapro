"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { removerCenarioDePreco } from "@/lib/actions/ferramentas";
import { calcularPrecificacao } from "@/lib/calculos/precificacao";
import { formatarMoeda } from "@/lib/format";
import type { CenarioDePreco } from "@/types/database";

export function ListaDeCenarios({ cenarios }: { cenarios: CenarioDePreco[] }) {
  const router = useRouter();
  const [removendo, setRemovendo] = React.useState<string | null>(null);
  const [, iniciarTransicao] = React.useTransition();

  function remover(id: string, nome: string) {
    setRemovendo(id);

    iniciarTransicao(async () => {
      const resultado = await removerCenarioDePreco({ id });
      setRemovendo(null);

      if (!resultado.ok) {
        toast.error("Não foi possível remover", { description: resultado.erro });
        return;
      }

      toast.success(`“${nome}” foi removido`);
      router.refresh();
    });
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[42rem] text-left">
        <caption className="sr-only">Cenários de precificação salvos</caption>
        <thead>
          <tr className="border-b border-border bg-surface-sunken">
            <th scope="col" className="t-eyebrow px-5 py-3 font-medium">
              Cenário
            </th>
            <th scope="col" className="t-eyebrow px-3 py-3 text-right font-medium">
              Custo
            </th>
            <th scope="col" className="t-eyebrow px-3 py-3 text-right font-medium">
              Preço
            </th>
            <th scope="col" className="t-eyebrow px-3 py-3 text-right font-medium">
              Lucro/un
            </th>
            <th scope="col" className="t-eyebrow px-3 py-3 text-right font-medium">
              Lucro/mês
            </th>
            <th scope="col" className="w-12 px-3 py-3">
              <span className="sr-only">Remover</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {cenarios.map((cenario) => {
            const resultado = calcularPrecificacao({
              custoIngredientes: Number(cenario.custo_ingredientes),
              custoEmbalagem: Number(cenario.custo_embalagem),
              custoEnergia: Number(cenario.custo_energia),
              minutosMaoDeObra: Number(cenario.minutos_mao_de_obra),
              valorHora: Number(cenario.valor_hora),
              margemDesejada: Number(cenario.margem_desejada),
              volumeMensal: cenario.volume_mensal,
            });

            return (
              <tr key={cenario.id} className="bg-surface">
                <th scope="row" className="px-5 py-4 font-normal">
                  <span className="t-h3 block">{cenario.nome}</span>
                  <span className="mt-1.5 flex flex-wrap gap-2">
                    <Badge variant="outline">
                      margem {Math.round(Number(cenario.margem_desejada) * 100)}%
                    </Badge>
                    <Badge variant="outline">
                      {cenario.volume_mensal} un/mês
                    </Badge>
                  </span>
                </th>
                <td className="px-3 py-4 text-right tabular-nums text-muted">
                  {formatarMoeda(resultado.custoTotal)}
                </td>
                <td className="px-3 py-4 text-right font-medium tabular-nums">
                  {formatarMoeda(resultado.precoSugerido)}
                </td>
                <td className="px-3 py-4 text-right tabular-nums text-muted">
                  {formatarMoeda(resultado.lucroPorUnidade)}
                </td>
                <td className="px-3 py-4 text-right font-medium tabular-nums text-success">
                  {formatarMoeda(resultado.lucroMensal)}
                </td>
                <td className="px-3 py-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => remover(cenario.id, cenario.nome)}
                    disabled={removendo === cenario.id}
                    aria-label={`Remover ${cenario.nome}`}
                  >
                    {removendo === cenario.id ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Trash2 />
                    )}
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
