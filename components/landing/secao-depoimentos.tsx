import { AberturaDeSecao, Secao } from "@/components/landing/secao";
import { Badge } from "@/components/ui/badge";
import { DEPOIMENTOS_PLACEHOLDER } from "@/lib/content/landing";

export function SecaoDepoimentos() {
  return (
    <Secao className="border-t border-border">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <AberturaDeSecao
          sobrelinha="Prova social"
          titulo="O que dizem quem usa"
        />
        <Badge variant="warning">Conteúdo de exemplo</Badge>
      </div>

      <p className="t-small mt-6 max-w-2xl rounded-lg border border-dashed border-border-strong bg-surface-sunken/60 p-4 text-muted">
        Os três depoimentos abaixo são fictícios e existem apenas para demonstrar
        o layout. Nomes, cidades e resultados são inventados. Substitua por
        depoimentos reais, com autorização de uso, antes de publicar.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {DEPOIMENTOS_PLACEHOLDER.map((depoimento) => (
          <figure
            key={depoimento.nome}
            className="flex flex-col justify-between rounded-xl border border-border bg-surface p-6"
          >
            <blockquote className="t-body text-muted-strong">
              <span aria-hidden="true" className="font-display text-2xl leading-none text-border-strong">
                “
              </span>
              {depoimento.texto}
            </blockquote>
            <figcaption className="mt-6 border-t border-border pt-4">
              <p className="t-h3">{depoimento.nome}</p>
              <p className="t-small mt-0.5 text-muted">{depoimento.contexto}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </Secao>
  );
}
