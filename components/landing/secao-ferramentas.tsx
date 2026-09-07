import { Check } from "lucide-react";

import {
  DemoMacros,
  DemoPrecificacao,
  DemoReceitas,
  DemoTrilha,
} from "@/components/landing/demos";
import { AberturaDeSecao, Secao } from "@/components/landing/secao";
import { FUNCIONALIDADES } from "@/lib/content/landing";
import { cn } from "@/lib/utils";

const DEMOS: Record<string, React.ReactNode> = {
  precificacao: <DemoPrecificacao />,
  macros: <DemoMacros />,
  trilha: <DemoTrilha />,
  receitas: <DemoReceitas />,
};

export function SecaoFerramentas() {
  return (
    <Secao id="ferramentas" className="border-t border-border">
      <AberturaDeSecao
        sobrelinha="Dentro do app"
        titulo="Conteúdo e ferramenta no mesmo lugar"
        texto="A concorrência entrega aula em PDF e você abre o Excel do lado. Aqui a aula sobre preço abre ao lado da calculadora de preço."
      />

      <div className="mt-16 space-y-20 sm:mt-20 sm:space-y-28">
        {FUNCIONALIDADES.map((item, indice) => {
          const invertido = indice % 2 === 1;
          const Icone = item.icone;

          return (
            <article
              key={item.id}
              className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
            >
              <div className={cn(invertido && "lg:order-2")}>
                <span className="grid size-10 place-items-center rounded-lg border border-border bg-surface text-primary">
                  <Icone className="size-4" aria-hidden="true" />
                </span>
                <p className="t-eyebrow mt-5">{item.sobrelinha}</p>
                <h3 className="t-h2 mt-3 max-w-md text-balance">{item.titulo}</h3>
                <p className="t-body mt-4 max-w-lg text-muted">{item.texto}</p>

                <ul className="mt-6 space-y-2.5">
                  {item.itens.map((linha) => (
                    <li key={linha} className="flex gap-3">
                      <Check
                        className="mt-1 size-3.5 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      <span className="t-small text-muted-strong">{linha}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={cn(invertido && "lg:order-1")}>
                {DEMOS[item.id]}
              </div>
            </article>
          );
        })}
      </div>
    </Secao>
  );
}
