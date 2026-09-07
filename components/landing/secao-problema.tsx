import { AberturaDeSecao, Secao } from "@/components/landing/secao";
import { DORES } from "@/lib/content/landing";

export function SecaoProblema() {
  return (
    <Secao id="problema" className="border-t border-border bg-surface-sunken/40">
      <AberturaDeSecao
        sobrelinha="O que trava quem vende marmita"
        titulo="O problema quase nunca é a comida"
        texto="Na maioria dos casos a receita está boa e o cliente elogia. O que derruba o negócio é a conta que ninguém fez."
      />

      <ol className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2">
        {DORES.map((dor) => (
          <li
            key={dor.numero}
            className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 border-t border-border pt-6"
          >
            <span className="t-eyebrow pt-1 tabular-nums">{dor.numero}</span>
            <div className="space-y-2">
              <h3 className="t-h3">{dor.titulo}</h3>
              <p className="t-body text-muted">{dor.texto}</p>
            </div>
          </li>
        ))}
      </ol>
    </Secao>
  );
}
