"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  NAVEGACAO_APP,
  NAVEGACAO_FASE_2,
  rotaAtiva,
} from "@/lib/navegacao";
import { cn } from "@/lib/utils";

export function Sidebar({
  progressoDaTrilha,
  children,
}: {
  progressoDaTrilha: number;
  children?: React.ReactNode;
}) {
  const pathname = usePathname();
  const percentual = Math.round(progressoDaTrilha * 100);

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-surface lg:flex">
      <div className="flex h-16 items-center border-b border-border px-5">
        <Link href="/app" className="rounded-sm text-[15px]">
          <Logo />
        </Link>
      </div>

      <nav aria-label="Navegação principal" className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-0.5">
          {NAVEGACAO_APP.map((item) => {
            const ativo = rotaAtiva(pathname, item.href);
            const Icone = item.icone;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={ativo ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.9375rem] transition-colors duration-150",
                    ativo
                      ? "bg-primary-soft font-medium text-primary"
                      : "text-muted-strong hover:bg-surface-hover hover:text-foreground"
                  )}
                >
                  <Icone className="size-4 shrink-0" aria-hidden="true" />
                  {item.rotulo}
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="t-eyebrow mt-8 px-3">Em breve</p>
        <ul className="mt-3 space-y-0.5">
          {NAVEGACAO_FASE_2.map((item) => {
            const Icone = item.icone;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.9375rem] text-muted transition-colors duration-150 hover:bg-surface-hover"
                >
                  <Icone className="size-4 shrink-0" aria-hidden="true" />
                  <span className="flex-1">{item.rotulo}</span>
                  <Badge variant="outline">Fase 2</Badge>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="space-y-4 border-t border-border p-4">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="t-small text-muted">Trilha</span>
            <span className="t-small tabular-nums text-foreground">
              {percentual}%
            </span>
          </div>
          <Progress
            value={percentual}
            aria-label={`Progresso da trilha: ${percentual}%`}
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          {children}
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
