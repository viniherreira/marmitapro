import Link from "next/link";
import { KeyRound } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { variaveisFaltando } from "@/lib/env";
import { cn } from "@/lib/utils";

/**
 * Mostrada quando o app roda sem as credenciais do Clerk ou do Supabase.
 * Evita erro cru de runtime e diz exatamente o que falta.
 */
export function ConfiguracaoPendente({
  compacto = false,
}: {
  /** Dentro de um layout que já centraliza o conteúdo, dispensa a moldura. */
  compacto?: boolean;
}) {
  const faltando = variaveisFaltando();

  return (
    <div
      className={
        compacto
          ? "w-full"
          : "texture-paper flex min-h-dvh items-center justify-center bg-background px-5 py-16"
      }
    >
      <div className={compacto ? "w-full" : "w-full max-w-xl"}>
        {compacto ? null : <Logo className="text-[15px]" />}

        <div
          className={cn(
            "rounded-xl border border-border bg-surface p-7 sm:p-8",
            !compacto && "mt-8"
          )}
        >
          <span className="grid size-10 place-items-center rounded-lg border border-border bg-surface-sunken text-muted">
            <KeyRound className="size-4" aria-hidden="true" />
          </span>

          <h1 className="t-h2 mt-5">Configuração pendente</h1>
          <p className="t-body mt-3 text-muted">
            O app precisa das credenciais do Clerk e do Supabase para funcionar.
            Copie o arquivo <code className="font-mono text-[0.875em]">.env.example</code>{" "}
            para <code className="font-mono text-[0.875em]">.env.local</code> e
            preencha as variáveis abaixo.
          </p>

          <ul className="mt-6 divide-y divide-border overflow-hidden rounded-lg border border-border">
            {faltando.map((variavel) => (
              <li
                key={variavel}
                className="bg-surface-sunken px-4 py-2.5 font-mono text-[0.8125rem] text-foreground"
              >
                {variavel}
              </li>
            ))}
          </ul>

          <p className="t-small mt-6 text-muted">
            O passo a passo completo está no README, na seção de setup local.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild variant="secondary">
              <Link href="/">Voltar para a landing</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/design-system">Ver o design system</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
