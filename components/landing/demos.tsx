import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DEMO_CALCULO,
  DEMO_MACROS,
  DEMO_RECEITAS,
  DEMO_TRILHA,
} from "@/lib/content/demos";

function Moldura({
  rotulo,
  children,
}: {
  rotulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <p className="t-eyebrow border-b border-border bg-surface-sunken px-5 py-3">
        {rotulo}
      </p>
      {children}
    </div>
  );
}

/** Precificação — o valor pedagógico está em mostrar a conta aberta. */
export function DemoPrecificacao() {
  return (
    <Moldura rotulo={DEMO_CALCULO.titulo}>
      <div className="space-y-2.5 px-5 py-5">
        {DEMO_CALCULO.etapas.map((etapa) => (
          <div key={etapa.rotulo} className="flex items-baseline gap-3">
            <span
              aria-hidden="true"
              className="w-3 shrink-0 text-center text-[0.8125rem] text-muted"
            >
              {etapa.operacao}
            </span>
            <span className="t-small min-w-0 flex-1 text-muted">
              {etapa.rotulo}
            </span>
            <span className="t-small shrink-0 tabular-nums">{etapa.valor}</span>
          </div>
        ))}

        <div className="flex items-baseline gap-3 border-t border-border pt-3">
          <span aria-hidden="true" className="w-3 shrink-0" />
          <span className="t-small min-w-0 flex-1 font-medium">
            {DEMO_CALCULO.subtotal.rotulo}
          </span>
          <span className="t-small shrink-0 font-medium tabular-nums">
            {DEMO_CALCULO.subtotal.valor}
          </span>
        </div>

        <div className="flex items-baseline gap-3">
          <span
            aria-hidden="true"
            className="w-3 shrink-0 text-center text-[0.8125rem] text-muted"
          >
            {DEMO_CALCULO.margem.operacao}
          </span>
          <span className="t-small min-w-0 flex-1 text-muted">
            {DEMO_CALCULO.margem.rotulo}
          </span>
          <span className="t-small shrink-0 tabular-nums">
            {DEMO_CALCULO.margem.valor}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-border bg-primary-soft px-5 py-4">
        <span className="t-small font-medium text-primary">
          {DEMO_CALCULO.total.rotulo}
        </span>
        <span className="font-display text-2xl tabular-nums text-primary">
          {DEMO_CALCULO.total.valor}
        </span>
      </div>

      <dl className="grid grid-cols-2 divide-x divide-border border-t border-border">
        {DEMO_CALCULO.projecao.map((item) => (
          <div key={item.rotulo} className="px-5 py-3">
            <dt className="t-small text-muted">{item.rotulo}</dt>
            <dd className="mt-0.5 text-[0.9375rem] font-medium tabular-nums">
              {item.valor}
            </dd>
          </div>
        ))}
      </dl>
    </Moldura>
  );
}

export function DemoMacros() {
  return (
    <Moldura rotulo={`${DEMO_MACROS.receita} · ${DEMO_MACROS.porcoes} porções`}>
      <ul className="divide-y divide-border">
        {DEMO_MACROS.ingredientes.map((item) => (
          <li
            key={item.nome}
            className="flex items-center justify-between gap-4 px-5 py-2.5"
          >
            <span className="t-small min-w-0 truncate">{item.nome}</span>
            <span className="t-small shrink-0 tabular-nums text-muted">
              {item.gramas} g
            </span>
          </li>
        ))}
      </ul>

      <table className="w-full border-t border-border text-left">
        <thead>
          <tr className="border-b border-border bg-surface-sunken">
            <th className="t-eyebrow px-5 py-2.5 font-medium">Nutriente</th>
            <th className="t-eyebrow px-2 py-2.5 text-right font-medium">
              Total
            </th>
            <th className="t-eyebrow px-5 py-2.5 text-right font-medium">
              Por porção
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {DEMO_MACROS.totais.map((linha) => (
            <tr key={linha.rotulo}>
              <td className="t-small px-5 py-2.5 text-muted">{linha.rotulo}</td>
              <td className="t-small px-2 py-2.5 text-right tabular-nums text-muted">
                {linha.total}
              </td>
              <td className="t-small px-5 py-2.5 text-right font-medium tabular-nums">
                {linha.porcao}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Moldura>
  );
}

export function DemoTrilha() {
  return (
    <Moldura rotulo="Sua trilha">
      <div className="space-y-2 px-5 py-5">
        <div className="flex items-baseline justify-between">
          <span className="t-small text-muted">Progresso geral</span>
          <span className="t-small tabular-nums">{DEMO_TRILHA.progresso}%</span>
        </div>
        <Progress
          value={DEMO_TRILHA.progresso}
          aria-label="Progresso geral da trilha"
        />
      </div>

      <ul className="divide-y divide-border border-t border-border">
        {DEMO_TRILHA.modulos.map((modulo) => {
          const completo = modulo.concluidas === modulo.aulas;
          return (
            <li
              key={modulo.nome}
              className="flex items-center justify-between gap-4 px-5 py-3.5"
            >
              <span className="t-small min-w-0 truncate">{modulo.nome}</span>
              {completo ? (
                <Badge variant="success">Concluído</Badge>
              ) : (
                <span className="t-small shrink-0 tabular-nums text-muted">
                  {modulo.concluidas}/{modulo.aulas}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </Moldura>
  );
}

export function DemoReceitas() {
  return (
    <Moldura rotulo="Banco de receitas">
      <ul className="divide-y divide-border">
        {DEMO_RECEITAS.map((receita) => (
          <li key={receita.nome} className="space-y-2 px-5 py-4">
            <p className="t-h3 text-balance">{receita.nome}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Badge variant="outline">{receita.objetivo}</Badge>
              <span className="t-small tabular-nums text-muted">
                {receita.kcal}
              </span>
              <span className="t-small tabular-nums text-muted">
                custo {receita.custo}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Moldura>
  );
}
