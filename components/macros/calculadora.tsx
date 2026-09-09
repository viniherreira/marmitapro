"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Save, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { salvarCalculoDeMacros } from "@/lib/actions/ferramentas";
import {
  distribuicaoCalorica,
  dividirPorPorcoes,
  somarTotais,
} from "@/lib/calculos/macros";
import { formatarDecimal, formatarInteiro, formatarMoeda } from "@/lib/format";
import type { Ingrediente } from "@/types/database";
import { cn } from "@/lib/utils";

type ItemNaLista = { ingrediente: Ingrediente; gramas: number };

const GRAMAS_PADRAO = 100;
const MAXIMO_DE_SUGESTOES = 8;

export function CalculadoraDeMacros({
  ingredientes,
}: {
  ingredientes: Ingrediente[];
}) {
  const router = useRouter();

  const [busca, setBusca] = React.useState("");
  const [itens, setItens] = React.useState<ItemNaLista[]>([]);
  const [porcoes, setPorcoes] = React.useState(4);
  const [nome, setNome] = React.useState("");
  const [salvando, iniciarTransicao] = React.useTransition();

  const jaAdicionados = React.useMemo(
    () => new Set(itens.map((item) => item.ingrediente.id)),
    [itens]
  );

  const sugestoes = React.useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (termo.length < 2) return [];

    return ingredientes
      .filter(
        (ingrediente) =>
          !jaAdicionados.has(ingrediente.id) &&
          (ingrediente.nome.toLowerCase().includes(termo) ||
            ingrediente.categoria.toLowerCase().includes(termo))
      )
      .slice(0, MAXIMO_DE_SUGESTOES);
  }, [busca, ingredientes, jaAdicionados]);

  const totais = React.useMemo(
    () =>
      somarTotais(
        itens.map((item) => ({ gramas: item.gramas, base: item.ingrediente }))
      ),
    [itens]
  );

  const porPorcao = React.useMemo(
    () => dividirPorPorcoes(totais, porcoes),
    [totais, porcoes]
  );

  const distribuicao = React.useMemo(
    () => distribuicaoCalorica(totais),
    [totais]
  );

  function adicionar(ingrediente: Ingrediente) {
    setItens((atual) => [...atual, { ingrediente, gramas: GRAMAS_PADRAO }]);
    setBusca("");
  }

  function ajustar(id: string, gramas: number) {
    setItens((atual) =>
      atual.map((item) =>
        item.ingrediente.id === id
          ? { ...item, gramas: Number.isFinite(gramas) ? Math.max(gramas, 0) : 0 }
          : item
      )
    );
  }

  function remover(id: string) {
    setItens((atual) => atual.filter((item) => item.ingrediente.id !== id));
  }

  function salvar() {
    if (itens.length === 0) {
      toast.error("Adicione ao menos um ingrediente.");
      return;
    }

    iniciarTransicao(async () => {
      const resultado = await salvarCalculoDeMacros({
        nome: nome.trim() || "Receita sem nome",
        porcoes,
        itens: itens.map((item) => ({
          ingredient_id: item.ingrediente.id,
          nome: item.ingrediente.nome,
          gramas: item.gramas,
        })),
      });

      if (!resultado.ok) {
        toast.error("Não foi possível salvar", { description: resultado.erro });
        return;
      }

      toast.success("Receita salva", {
        description: "Ela aparece na lista abaixo e no painel.",
      });
      setNome("");
      router.refresh();
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-start">
      {/* Montagem da receita ------------------------------------------ */}
      <div className="space-y-6">
        <div className="rounded-lg border border-border bg-surface p-5 sm:p-6">
          <Field
            id="busca-ingrediente"
            label="Adicionar ingrediente"
            hint="Digite ao menos duas letras. Os valores são por 100 g."
          >
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <Input
                id="busca-ingrediente"
                value={busca}
                onChange={(evento) => setBusca(evento.target.value)}
                placeholder="Frango, arroz integral, brócolis…"
                autoComplete="off"
                className="pl-9 pr-9"
              />
              {busca ? (
                <button
                  type="button"
                  onClick={() => setBusca("")}
                  aria-label="Limpar busca"
                  className="absolute right-2 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-md text-muted transition-colors duration-150 hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              ) : null}
            </div>
          </Field>

          {sugestoes.length > 0 ? (
            <ul className="mt-3 divide-y divide-border overflow-hidden rounded-lg border border-border">
              {sugestoes.map((ingrediente) => (
                <li key={ingrediente.id}>
                  <button
                    type="button"
                    onClick={() => adicionar(ingrediente)}
                    className="flex w-full items-center justify-between gap-4 bg-surface px-4 py-3 text-left transition-colors duration-150 hover:bg-surface-hover"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[0.9375rem]">
                        {ingrediente.nome}
                      </span>
                      <span className="t-small block text-muted">
                        {ingrediente.categoria} ·{" "}
                        {formatarInteiro(Number(ingrediente.kcal))} kcal/100 g
                      </span>
                    </span>
                    <Plus className="size-4 shrink-0 text-muted" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          {busca.trim().length >= 2 && sugestoes.length === 0 ? (
            <p className="t-small mt-3 rounded-lg border border-dashed border-border-strong bg-surface-sunken px-4 py-3 text-muted">
              Nenhum ingrediente encontrado para “{busca.trim()}”.
            </p>
          ) : null}
        </div>

        {itens.length === 0 ? (
          <EmptyState
            icon={Search}
            title="Sua receita está vazia"
            description="Busque um ingrediente acima e ajuste a quantidade em gramas. O cálculo é atualizado a cada mudança."
          />
        ) : (
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-left">
              <caption className="sr-only">
                Ingredientes da receita e quantidades em gramas
              </caption>
              <thead>
                <tr className="border-b border-border bg-surface-sunken">
                  <th scope="col" className="t-eyebrow px-4 py-3 font-medium">
                    Ingrediente
                  </th>
                  <th
                    scope="col"
                    className="t-eyebrow w-28 px-2 py-3 text-right font-medium"
                  >
                    Gramas
                  </th>
                  <th scope="col" className="w-12 px-2 py-3">
                    <span className="sr-only">Remover</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {itens.map((item) => (
                  <tr key={item.ingrediente.id} className="bg-surface">
                    <td className="px-4 py-3">
                      <span className="block text-[0.9375rem]">
                        {item.ingrediente.nome}
                      </span>
                      <span className="t-small block text-muted">
                        {formatarInteiro(
                          (Number(item.ingrediente.kcal) * item.gramas) / 100
                        )}{" "}
                        kcal ·{" "}
                        {formatarMoeda(
                          (Number(item.ingrediente.preco_medio_kg) / 1000) *
                            item.gramas
                        )}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <Input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        step={10}
                        value={item.gramas}
                        onChange={(evento) =>
                          ajustar(
                            item.ingrediente.id,
                            evento.target.valueAsNumber
                          )
                        }
                        aria-label={`Quantidade em gramas de ${item.ingrediente.nome}`}
                        className="h-9 text-right"
                      />
                    </td>
                    <td className="px-2 py-3">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => remover(item.ingrediente.id)}
                        aria-label={`Remover ${item.ingrediente.nome}`}
                      >
                        <Trash2 />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Resultado ---------------------------------------------------- */}
      <aside className="space-y-5 lg:sticky lg:top-8">
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="border-b border-border bg-surface-sunken px-5 py-3">
            <p className="t-eyebrow">Ficha nutricional</p>
          </div>

          <div className="space-y-5 p-5">
            <Field
              id="porcoes"
              label="Porções que essa receita rende"
              suffix={`${formatarInteiro(porPorcao.pesoTotal)} g por porção`}
            >
              <Input
                id="porcoes"
                type="number"
                inputMode="numeric"
                min={1}
                max={200}
                value={porcoes}
                onChange={(evento) =>
                  setPorcoes(
                    Number.isFinite(evento.target.valueAsNumber)
                      ? Math.max(1, Math.floor(evento.target.valueAsNumber))
                      : 1
                  )
                }
              />
            </Field>

            <div>
              <p className="t-eyebrow">Por porção</p>
              <p className="t-metric mt-2" data-numeric>
                {formatarInteiro(porPorcao.kcal)} kcal
              </p>
            </div>

            <table className="w-full text-left">
              <thead>
                <tr className="border-y border-border">
                  <th scope="col" className="t-eyebrow py-2 font-medium">
                    Nutriente
                  </th>
                  <th scope="col" className="t-eyebrow py-2 text-right font-medium">
                    Total
                  </th>
                  <th scope="col" className="t-eyebrow py-2 text-right font-medium">
                    Porção
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {/* A ordem segue a tabela nutricional da RDC 429/2020, para a
                    ficha sair na mesma sequência que vai para o rótulo. */}
                {(
                  [
                    ["Carboidratos", totais.carboidrato, porPorcao.carboidrato, "g", false],
                    ["Proteínas", totais.proteina, porPorcao.proteina, "g", false],
                    ["Gorduras totais", totais.gordura, porPorcao.gordura, "g", false],
                    ["Fibra alimentar", totais.fibra, porPorcao.fibra, "g", false],
                    ["Sódio", totais.sodio, porPorcao.sodio, "mg", true],
                  ] as const
                ).map(([rotulo, total, porcao, unidade, inteiro]) => (
                  <tr key={rotulo}>
                    <td className="t-small py-2.5 text-muted">{rotulo}</td>
                    <td className="t-small py-2.5 text-right tabular-nums text-muted">
                      {inteiro ? formatarInteiro(total) : formatarDecimal(total)}{" "}
                      {unidade}
                    </td>
                    <td className="t-small py-2.5 text-right font-medium tabular-nums">
                      {inteiro ? formatarInteiro(porcao) : formatarDecimal(porcao)}{" "}
                      {unidade}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totais.kcal > 0 ? (
              <div className="space-y-2">
                <p className="t-eyebrow">Distribuição calórica</p>
                <div
                  className="flex h-2 overflow-hidden rounded-full bg-surface-sunken"
                  role="img"
                  aria-label={`Proteína ${Math.round(distribuicao.proteina * 100)}%, carboidrato ${Math.round(distribuicao.carboidrato * 100)}%, gordura ${Math.round(distribuicao.gordura * 100)}%`}
                >
                  <span
                    className="bg-primary"
                    style={{ width: `${distribuicao.proteina * 100}%` }}
                  />
                  <span
                    className="bg-accent"
                    style={{ width: `${distribuicao.carboidrato * 100}%` }}
                  />
                  <span
                    className="bg-warning"
                    style={{ width: `${distribuicao.gordura * 100}%` }}
                  />
                </div>
                <dl className="flex flex-wrap gap-x-4 gap-y-1">
                  {[
                    ["Proteína", distribuicao.proteina, "bg-primary"],
                    ["Carboidrato", distribuicao.carboidrato, "bg-accent"],
                    ["Gordura", distribuicao.gordura, "bg-warning"],
                  ].map(([rotulo, fracao, cor]) => (
                    <div
                      key={String(rotulo)}
                      className="flex items-center gap-1.5"
                    >
                      <span
                        aria-hidden="true"
                        className={cn("size-2 rounded-full", String(cor))}
                      />
                      <dt className="t-small text-muted">{rotulo}</dt>
                      <dd className="t-small tabular-nums">
                        {Math.round(Number(fracao) * 100)}%
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
          </div>

          <dl className="grid grid-cols-2 divide-x divide-border border-t border-border">
            <div className="px-5 py-3">
              <dt className="t-small text-muted">Custo total</dt>
              <dd className="mt-0.5 text-[0.9375rem] font-medium tabular-nums">
                {formatarMoeda(totais.custo)}
              </dd>
            </div>
            <div className="px-5 py-3">
              <dt className="t-small text-muted">Custo por porção</dt>
              <dd className="mt-0.5 text-[0.9375rem] font-medium tabular-nums">
                {formatarMoeda(porPorcao.custo)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="space-y-4 rounded-xl border border-border bg-surface p-5">
          <Field
            id="nome-da-receita"
            label="Nome da receita"
            hint="Para encontrar depois na sua lista."
          >
            <Input
              id="nome-da-receita"
              value={nome}
              onChange={(evento) => setNome(evento.target.value)}
              placeholder="Frango com batata-doce"
              maxLength={120}
            />
          </Field>

          <Button
            type="button"
            onClick={salvar}
            disabled={salvando || itens.length === 0}
            className="w-full"
          >
            {salvando ? <Loader2 className="animate-spin" /> : <Save />}
            Salvar receita
          </Button>

          <p className="t-small text-muted">
            <Badge variant="outline" className="mr-2 align-middle">
              Estimativa
            </Badge>
            Valores por 100 g da Tabela Brasileira de Composição de Alimentos
            (TACO, 4ª edição — NEPA/UNICAMP). Itens sem equivalente na tabela
            usam média de rótulos, indicada na lista. A ficha orienta o seu
            cardápio, mas não substitui laudo laboratorial onde a rotulagem
            obrigatória exigir.
          </p>
        </div>
      </aside>
    </div>
  );
}
