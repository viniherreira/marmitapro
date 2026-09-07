import { AberturaDeSecao, Secao } from "@/components/landing/secao";
import { PASSOS } from "@/lib/content/landing";

export function SecaoComoFunciona() {
  return (
    <Secao
      id="como-funciona"
      className="border-t border-border bg-surface-sunken/40"
    >
      <AberturaDeSecao
        sobrelinha="Como funciona"
        titulo="Da primeira tela ao primeiro preço fechado"
      />

      <ol className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
        {PASSOS.map((passo) => (
          <li key={passo.numero} className="bg-surface p-6 sm:p-8">
            <span className="t-eyebrow tabular-nums">{passo.numero}</span>
            <h3 className="t-h3 mt-4">{passo.titulo}</h3>
            <p className="t-body mt-2.5 text-muted">{passo.texto}</p>
          </li>
        ))}
      </ol>
    </Secao>
  );
}
