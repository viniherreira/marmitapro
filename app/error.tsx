"use client";

import * as React from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function Erro({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="texture-paper flex min-h-dvh flex-col items-center justify-center bg-background px-5">
      <div className="w-full max-w-lg">
        <Logo className="text-[15px]" />

        <p className="t-eyebrow mt-12">Algo quebrou</p>
        <h1 className="t-h1 mt-4">Não foi possível carregar esta tela.</h1>
        <p className="t-lead mt-4">
          O erro foi registrado. Tente de novo — se persistir, volte ao painel e
          siga por outro caminho.
        </p>

        <Alert tone="error" title="Detalhe técnico" className="mt-6">
          {error.message || "Erro desconhecido."}
          {error.digest ? (
            <span className="mt-1 block font-mono text-[0.75rem] text-muted">
              digest {error.digest}
            </span>
          ) : null}
        </Alert>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button type="button" onClick={reset}>
            <RotateCcw />
            Tentar de novo
          </Button>
          <Button asChild variant="secondary">
            <Link href="/app">Ir para o painel</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
