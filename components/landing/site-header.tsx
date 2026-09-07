"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { NAVEGACAO_TOPO } from "@/lib/content/landing";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [aberto, setAberto] = React.useState(false);
  const [rolou, setRolou] = React.useState(false);

  React.useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 8);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = aberto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [aberto]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,border-color] duration-200",
        rolou
          ? "border-b border-border bg-background/85 backdrop-blur-md"
          : "border-b border-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link
          href="/"
          className="rounded-sm text-[15px]"
          aria-label="MarmitaPRO, ir para o início"
        >
          <Logo />
        </Link>

        <nav aria-label="Seções da página" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {NAVEGACAO_TOPO.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-sm text-[0.9375rem] text-muted transition-colors duration-150 hover:text-foreground"
                >
                  {item.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle className="hidden sm:inline-flex" />
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/entrar">Entrar</Link>
          </Button>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/cadastro">Criar conta</Link>
          </Button>

          <Button
            variant="outline"
            size="icon-sm"
            className="lg:hidden"
            aria-expanded={aberto}
            aria-controls="menu-mobile"
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
            onClick={() => setAberto((v) => !v)}
          >
            {aberto ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {aberto ? (
        <div
          id="menu-mobile"
          className="fixed inset-x-0 bottom-0 top-16 z-50 overflow-y-auto border-t border-border bg-background px-5 py-8 lg:hidden"
        >
          <ul className="space-y-1">
            {NAVEGACAO_TOPO.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setAberto(false)}
                  className="block rounded-lg px-3 py-3 text-lg text-foreground transition-colors duration-150 hover:bg-surface-hover"
                >
                  {item.rotulo}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 border-t border-border pt-8">
            <Button asChild size="lg">
              <Link href="/cadastro">Criar minha conta</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/entrar">Já tenho conta</Link>
            </Button>
            <div className="pt-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
