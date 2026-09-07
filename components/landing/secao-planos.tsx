import Link from "next/link";
import { Check } from "lucide-react";

import { AberturaDeSecao, Secao } from "@/components/landing/secao";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PLANOS } from "@/lib/content/landing";
import { cn } from "@/lib/utils";

export function SecaoPlanos() {
  return (
    <Secao id="planos" className="border-t border-border bg-surface-sunken/40">
      <AberturaDeSecao
        sobrelinha="Planos"
        titulo="Um preço, tudo liberado"
        texto="Não existe versão capada. Os dois planos dão acesso à trilha inteira e às duas calculadoras — muda só a forma de pagar."
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        {PLANOS.map((plano) => (
          <div
            key={plano.id}
            className={cn(
              "flex flex-col rounded-xl border bg-surface p-7 sm:p-8",
              plano.destaque
                ? "border-primary ring-1 ring-primary/15"
                : "border-border"
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="t-h3">{plano.nome}</h3>
                <p className="t-small mt-1 text-muted">{plano.descricao}</p>
              </div>
              {plano.selo ? (
                <Badge variant="accent" className="shrink-0">
                  {plano.selo}
                </Badge>
              ) : null}
            </div>

            <div className="mt-7 flex items-baseline gap-2">
              <span className="t-metric" data-numeric>
                {plano.preco}
              </span>
              <span className="t-small text-muted">{plano.periodo}</span>
            </div>
            {plano.equivalente ? (
              <p className="t-small mt-1.5 text-muted">{plano.equivalente}</p>
            ) : null}

            <ul className="mt-7 flex-1 space-y-3 border-t border-border pt-7">
              {plano.inclui.map((item) => (
                <li key={item} className="flex gap-3">
                  <Check
                    className="mt-1 size-3.5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span className="t-small text-muted-strong">{item}</span>
                </li>
              ))}
            </ul>

            <Button
              asChild
              size="lg"
              variant={plano.destaque ? "primary" : "secondary"}
              className="mt-8 w-full"
            >
              <Link href="/cadastro">
                Começar no plano {plano.nome.toLowerCase()}
              </Link>
            </Button>
          </div>
        ))}
      </div>

      <p className="t-small mt-8 text-muted">
        Pagamento e cobrança recorrente entram na fase 2. Neste momento a
        criação de conta libera o acesso completo para avaliação.
      </p>
    </Secao>
  );
}
