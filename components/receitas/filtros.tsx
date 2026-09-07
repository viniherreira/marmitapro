"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OBJETIVOS, ROTULO_OBJETIVO } from "@/lib/data/receitas";
import { cn } from "@/lib/utils";

/**
 * O estado do filtro vive na URL: a listagem continua sendo Server Component
 * e o link pode ser compartilhado.
 */
export function FiltrosDeReceitas() {
  const router = useRouter();
  const pathname = usePathname();
  const parametros = useSearchParams();

  const buscaAtual = parametros.get("busca") ?? "";
  const objetivoAtual = parametros.get("objetivo") ?? "";

  const [busca, setBusca] = React.useState(buscaAtual);

  React.useEffect(() => setBusca(buscaAtual), [buscaAtual]);

  const aplicar = React.useCallback(
    (proximos: { busca?: string; objetivo?: string }) => {
      const novos = new URLSearchParams(parametros.toString());

      for (const [chave, valor] of Object.entries(proximos)) {
        if (valor) {
          novos.set(chave, valor);
        } else {
          novos.delete(chave);
        }
      }

      const consulta = novos.toString();
      router.replace(consulta ? `${pathname}?${consulta}` : pathname, {
        scroll: false,
      });
    },
    [parametros, pathname, router]
  );

  // Debounce da busca para não navegar a cada tecla.
  React.useEffect(() => {
    if (busca === buscaAtual) return;

    const temporizador = window.setTimeout(() => aplicar({ busca }), 320);
    return () => window.clearTimeout(temporizador);
  }, [busca, buscaAtual, aplicar]);

  const temFiltro = Boolean(buscaAtual || objetivoAtual);

  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <Input
          value={busca}
          onChange={(evento) => setBusca(evento.target.value)}
          placeholder="Buscar por nome ou ingrediente…"
          aria-label="Buscar receitas"
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="t-eyebrow mr-1">Objetivo</span>

        {OBJETIVOS.map((objetivo) => {
          const ativo = objetivoAtual === objetivo;

          return (
            <button
              key={objetivo}
              type="button"
              aria-pressed={ativo}
              onClick={() => aplicar({ objetivo: ativo ? "" : objetivo })}
              className={cn(
                "rounded-md border px-3 py-1.5 text-[0.8125rem] transition-colors duration-150",
                ativo
                  ? "border-primary bg-primary-soft font-medium text-primary"
                  : "border-border bg-surface text-muted-strong hover:bg-surface-hover"
              )}
            >
              {ROTULO_OBJETIVO[objetivo]}
            </button>
          );
        })}

        {temFiltro ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setBusca("");
              aplicar({ busca: "", objetivo: "" });
            }}
          >
            <X />
            Limpar
          </Button>
        ) : null}
      </div>
    </div>
  );
}
