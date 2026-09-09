import Link from "next/link";

import { analisarMarkdown, type Trecho } from "@/lib/markdown";
import { cn } from "@/lib/utils";

function Inline({ trechos }: { trechos: Trecho[] }) {
  return (
    <>
      {trechos.map((trecho, indice) => {
        const chave = `${trecho.tipo}-${indice}`;

        switch (trecho.tipo) {
          case "forte":
            return (
              <strong key={chave} className="font-semibold text-foreground">
                {trecho.valor}
              </strong>
            );
          case "enfase":
            return (
              <em key={chave} className="italic">
                {trecho.valor}
              </em>
            );
          case "codigo":
            return (
              <code
                key={chave}
                className="rounded-sm bg-surface-sunken px-1.5 py-0.5 font-mono text-[0.875em]"
              >
                {trecho.valor}
              </code>
            );
          case "link": {
            const externo = trecho.destino.startsWith("https://");
            return (
              <Link
                key={chave}
                href={trecho.destino}
                {...(externo
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="rounded-sm font-medium text-primary underline decoration-border-strong decoration-1 underline-offset-4 transition-colors duration-150 hover:decoration-primary"
              >
                {trecho.valor}
              </Link>
            );
          }
          default:
            return <span key={chave}>{trecho.valor}</span>;
        }
      })}
    </>
  );
}

/** Renderiza o conteúdo de uma aula. Sem HTML cru em nenhum ponto. */
export function TextoRico({
  fonte,
  className,
}: {
  fonte: string;
  className?: string;
}) {
  const blocos = analisarMarkdown(fonte);

  return (
    <div className={cn("space-y-5", className)}>
      {blocos.map((bloco, indice) => {
        const chave = `${bloco.tipo}-${indice}`;

        switch (bloco.tipo) {
          case "titulo":
            return bloco.nivel === 2 ? (
              <h2 key={chave} className="t-h2 pt-4">
                <Inline trechos={bloco.conteudo} />
              </h2>
            ) : (
              <h3 key={chave} className="t-h3 pt-3">
                <Inline trechos={bloco.conteudo} />
              </h3>
            );

          case "citacao":
            return (
              <blockquote
                key={chave}
                className="border-l-2 border-primary bg-primary-soft/50 py-3 pl-5 pr-4 text-[1.0625rem] leading-relaxed"
              >
                <Inline trechos={bloco.conteudo} />
              </blockquote>
            );

          case "lista":
            return bloco.ordenada ? (
              <ol key={chave} className="space-y-2.5">
                {bloco.itens.map((item, i) => (
                  <li
                    key={`${chave}-${i}`}
                    className="t-body grid grid-cols-[1.5rem_minmax(0,1fr)] text-muted-strong"
                  >
                    <span className="tabular-nums text-muted">{i + 1}.</span>
                    <span>
                      <Inline trechos={item} />
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <ul key={chave} className="space-y-2.5">
                {bloco.itens.map((item, i) => (
                  <li
                    key={`${chave}-${i}`}
                    className="t-body grid grid-cols-[1.5rem_minmax(0,1fr)] text-muted-strong"
                  >
                    <span aria-hidden="true" className="text-muted">
                      —
                    </span>
                    <span>
                      <Inline trechos={item} />
                    </span>
                  </li>
                ))}
              </ul>
            );

          default:
            return (
              <p key={chave} className="t-body text-muted-strong">
                <Inline trechos={bloco.conteudo} />
              </p>
            );
        }
      })}
    </div>
  );
}
