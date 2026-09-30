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
        texto="Não existe versão capada. Todos os planos dão acesso à trilha inteira, às calculadoras e aos pedidos — muda só quanto e como você paga."
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
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
        Você cria a conta e assina por dentro do app, no cartão, no Pix ou no boleto.
        A trilha do curso fica aberta mesmo sem assinatura; as calculadoras e
        o banco de receitas fazem parte do plano.
      </p>
    </Secao>
  );
}
