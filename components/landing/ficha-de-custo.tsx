import { Badge } from "@/components/ui/badge";
import {
  CUSTO_TOTAL_HEROI,
  FICHA_DO_HEROI,
  LUCRO_HEROI,
  PRECO_HEROI,
} from "@/lib/content/landing";
import { formatarMoeda, formatarPercentual } from "@/lib/format";

/**
 * Demonstração estática do resultado da calculadora de precificação.
 * Vive no herói para mostrar o produto em vez de descrevê-lo.
 */
export function FichaDeCusto() {
  return (
    <figure className="overflow-hidden rounded-xl border border-border bg-surface">
      <figcaption className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
        <div className="min-w-0">
          <p className="t-eyebrow">Ficha de custo</p>
          <p className="t-h3 mt-1.5 text-balance">{FICHA_DO_HEROI.receita}</p>
        </div>
        <Badge variant="outline" className="shrink-0 normal-case tracking-normal">
          {FICHA_DO_HEROI.porcao}
        </Badge>
      </figcaption>

      <div className="space-y-3 px-5 py-5">
        {FICHA_DO_HEROI.custos.map((linha) => (
          <div key={linha.rotulo} className="flex items-baseline gap-3">
            <span className="t-small shrink-0 text-muted">{linha.rotulo}</span>
            <span
              aria-hidden="true"
              className="mb-1 min-w-4 flex-1 border-b border-dashed border-border"
            />
            <span className="t-small shrink-0 tabular-nums text-foreground">
              {formatarMoeda(linha.valor)}
            </span>
          </div>
        ))}

        <div className="flex items-baseline gap-3 border-t border-border pt-3">
          <span className="t-small shrink-0 font-medium text-foreground">
            Custo real por marmita
          </span>
          <span
            aria-hidden="true"
            className="mb-1 min-w-4 flex-1 border-b border-dashed border-border"
          />
          <span className="t-small shrink-0 font-medium tabular-nums text-foreground">
            {formatarMoeda(CUSTO_TOTAL_HEROI)}
          </span>
        </div>
      </div>

      <div className="border-t border-border bg-surface-sunken px-5 py-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="t-eyebrow">Preço de venda sugerido</p>
            <p className="t-metric mt-2" data-numeric>
              {formatarMoeda(PRECO_HEROI)}
            </p>
          </div>
          <Badge variant="success">Margem saudável</Badge>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border pt-4 text-[0.8125rem]">
          <div className="flex justify-between gap-2">
            <dt className="text-muted">Margem</dt>
            <dd className="tabular-nums">
              {formatarPercentual(FICHA_DO_HEROI.margem)}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted">Lucro</dt>
            <dd className="tabular-nums text-success">
              {formatarMoeda(LUCRO_HEROI)}
            </dd>
          </div>
        </dl>
      </div>

      <dl className="grid grid-cols-4 divide-x divide-border border-t border-border">
        {FICHA_DO_HEROI.macros.map((macro) => (
          <div key={macro.rotulo} className="px-2 py-3 text-center">
            <dt className="text-[0.625rem] uppercase tracking-[0.1em] text-muted">
              {macro.rotulo}
            </dt>
            <dd className="mt-1 text-[0.8125rem] font-medium tabular-nums">
              {macro.valor}
            </dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}
