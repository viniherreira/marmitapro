"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAVEGACAO_MOBILE, rotaAtiva } from "@/lib/navegacao";
import { cn } from "@/lib/utils";

/** Navegação inferior do mobile. Alvos de toque de 56px de altura. */
export function BarraInferior() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {NAVEGACAO_MOBILE.map((item) => {
          const ativo = rotaAtiva(pathname, item.href);
          const Icone = item.icone;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={ativo ? "page" : undefined}
                className={cn(
                  "flex h-14 flex-col items-center justify-center gap-1 transition-colors duration-150",
                  ativo ? "text-primary" : "text-muted"
                )}
              >
                <Icone className="size-5" aria-hidden="true" />
                <span className="text-[0.6875rem] font-medium leading-none">
                  {item.rotuloCurto}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
