import Link from "next/link";
import { Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PLANOS_DE_COBRANCA } from "@/lib/pagamentos/planos";
import { formatarMoeda } from "@/lib/format";

/**
 * Bloqueio suave das ferramentas pagas.
 *
 * A trilha do curso continua aberta de propósito: quem está aprendendo
 * precisa ver o valor antes de pagar, e é a aula que explica por que a conta
 * da calculadora importa. O que fica atrás da assinatura é a ferramenta que
 * economiza o trabalho, não o conhecimento.
 */
export function BloqueioDeAssinatura({
  ferramenta,
  texto,
}: {
  ferramenta: string;
  texto: string;
}) {
  const mensal = PLANOS_DE_COBRANCA.mensal;

  return (
    <div className="rounded-xl border border-border bg-surface-sunken/50 p-8 text-center sm:p-12">
      <span className="mx-auto grid size-11 place-items-center rounded-full border border-border bg-surface">
        <Lock className="size-5 text-muted" aria-hidden="true" />
      </span>

      <h2 className="t-h3 mt-5">{ferramenta} faz parte da assinatura</h2>
      <p className="t-small mx-auto mt-3 max-w-md text-muted">{texto}</p>

      <div className="mt-7 flex flex-col items-center gap-3">
        <Button asChild size="lg">
          <Link href="/app/assinatura">
            Assinar por {formatarMoeda(mensal.valor)} por mês
          </Link>
        </Button>
        <p className="t-small text-muted">
          A trilha do curso continua aberta, sem assinatura.
        </p>
      </div>
    </div>
  );
}
