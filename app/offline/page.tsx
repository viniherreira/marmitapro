import type { Metadata } from "next";
import Link from "next/link";
import { WifiOff } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Sem conexão",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div className="texture-paper flex min-h-dvh flex-col items-center justify-center bg-background px-5 text-center">
      <Logo className="text-[15px]" />

      <span className="mt-12 grid size-12 place-items-center rounded-xl border border-border bg-surface text-muted">
        <WifiOff className="size-5" aria-hidden="true" />
      </span>

      <h1 className="t-h1 mt-6 max-w-lg">Você está sem conexão</h1>
      <p className="t-lead mt-4 max-w-md">
        As telas que você já abriu continuam disponíveis. O que depende do
        servidor volta assim que a internet voltar.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/app">Tentar abrir o painel</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/app/receitas">Ver receitas em cache</Link>
        </Button>
      </div>
    </div>
  );
}
