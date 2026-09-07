import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { RODAPE_LINKS } from "@/lib/content/landing";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
          <div>
            <Logo className="text-[15px]" />
            <p className="t-small mt-4 max-w-xs text-muted">
              A trilha e as ferramentas para montar e operar um negócio de
              marmitas fit no Brasil.
            </p>
            <div className="mt-6">
              <ThemeToggle />
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {RODAPE_LINKS.map((grupo) => (
              <nav key={grupo.titulo} aria-label={grupo.titulo}>
                <p className="t-eyebrow">{grupo.titulo}</p>
                <ul className="mt-4 space-y-2.5">
                  {grupo.itens.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="t-small rounded-sm text-muted transition-colors duration-150 hover:text-foreground"
                      >
                        {item.rotulo}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="t-small text-muted">
            © {new Date().getFullYear()} MarmitaPRO. Todos os direitos
            reservados.
          </p>
          <p className="t-small text-muted">
            Os cálculos nutricionais são estimativas e não substituem laudo
            laboratorial.
          </p>
        </div>
      </div>
    </footer>
  );
}
