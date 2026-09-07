import type { GrupoDeCor } from "@/lib/design-tokens";

export function GrupoDeSwatches({ grupo }: { grupo: GrupoDeCor }) {
  return (
    <div className="grid gap-6 border-t border-border py-8 first:border-t-0 first:pt-0 md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] md:gap-10">
      <div className="space-y-2">
        <h3 className="t-h3">{grupo.titulo}</h3>
        <p className="t-small text-muted">{grupo.descricao}</p>
      </div>

      <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border">
        {grupo.tokens.map((token) => (
          <li
            key={token.variavel}
            className="flex flex-col gap-3 bg-surface p-4 sm:flex-row sm:items-center sm:gap-5"
          >
            <span
              aria-hidden="true"
              className="h-9 w-14 shrink-0 rounded-md border border-border"
              style={{ backgroundColor: `var(${token.variavel})` }}
            />
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[0.8125rem] font-medium text-foreground">
                {token.variavel}
              </p>
              <p className="t-small text-muted">{token.uso}</p>
            </div>
            <dl className="flex shrink-0 gap-4 text-[0.75rem] tabular-nums text-muted sm:flex-col sm:gap-0.5 sm:text-right">
              <div className="flex gap-1.5 sm:justify-end">
                <dt className="uppercase tracking-wide">Claro</dt>
                <dd className="text-muted-strong">{token.light}</dd>
              </div>
              <div className="flex gap-1.5 sm:justify-end">
                <dt className="uppercase tracking-wide">Escuro</dt>
                <dd className="text-muted-strong">{token.dark}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
