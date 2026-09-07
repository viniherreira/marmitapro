"use client";

import * as React from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

const OPCOES = [
  { valor: "light", rotulo: "Claro", Icone: Sun },
  { valor: "dark", rotulo: "Escuro", Icone: Moon },
  { valor: "system", rotulo: "Sistema", Icone: Monitor },
] as const;

/**
 * Seletor de tema em três estados. Renderiza um esqueleto no servidor
 * para não piscar o estado errado antes da hidratação.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [montado, setMontado] = React.useState(false);

  React.useEffect(() => setMontado(true), []);

  return (
    <div
      role="radiogroup"
      aria-label="Tema da interface"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-lg border border-border bg-surface p-0.5",
        className
      )}
    >
      {OPCOES.map(({ valor, rotulo, Icone }) => {
        const ativo = montado && theme === valor;
        return (
          <button
            key={valor}
            type="button"
            role="radio"
            aria-checked={ativo}
            aria-label={rotulo}
            title={rotulo}
            onClick={() => setTheme(valor)}
            className={cn(
              "grid size-7 place-items-center rounded-md transition-colors duration-150 ease-out",
              ativo
                ? "bg-surface-sunken text-foreground"
                : "text-muted hover:text-foreground"
            )}
          >
            <Icone className="size-3.5" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
