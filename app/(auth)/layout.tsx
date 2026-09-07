import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { PROMESSA } from "@/lib/content/landing";

const ARGUMENTOS = [
  "Calculadora de precificação com a conta aberta",
  "Ficha nutricional pronta para o seu cardápio",
  "Trilha de cinco módulos com progresso salvo",
  "Banco de receitas com custo estimado",
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Painel de marca — some no mobile para não empurrar o formulário */}
      <aside className="relative hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex xl:p-14">
        <Link href="/" className="rounded-sm text-[15px] text-primary-foreground">
          <Logo markClassName="text-accent" />
        </Link>

        <div className="max-w-md">
          <p className="t-eyebrow text-primary-foreground/60">
            {PROMESSA.sobrelinha}
          </p>
          <p className="t-h1 mt-5 text-primary-foreground">
            {PROMESSA.titulo}
          </p>

          <ul className="mt-9 space-y-3">
            {ARGUMENTOS.map((item) => (
              <li key={item} className="flex gap-3">
                <Check
                  className="mt-1 size-3.5 shrink-0 text-accent"
                  aria-hidden="true"
                />
                <span className="text-[0.9375rem] text-primary-foreground/85">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-[0.8125rem] text-primary-foreground/55">
          Os cálculos nutricionais são estimativas e não substituem laudo
          laboratorial.
        </p>
      </aside>

      <main className="texture-paper flex flex-col bg-background">
        <div className="flex items-center justify-between px-5 py-5 sm:px-8 lg:hidden">
          <Link href="/" className="rounded-sm text-[15px]">
            <Logo />
          </Link>
          <Link
            href="/"
            className="t-small flex items-center gap-1.5 rounded-sm text-muted transition-colors duration-150 hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Início
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 pb-16 pt-4 sm:px-8 lg:py-16">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </main>
    </div>
  );
}
