import Image from "next/image";

import type { ObjetivoReceita } from "@/types/database";
import { cn } from "@/lib/utils";

/**
 * Capa da receita. Quando existe foto cadastrada, ela é exibida; enquanto o
 * banco de imagens não estiver pronto, entra uma capa tipográfica gerada a
 * partir do próprio nome — nada de foto genérica de banco de imagens.
 */

const TRAMA: Record<ObjetivoReceita, string> = {
  rica_proteina:
    "repeating-linear-gradient(135deg, var(--border) 0 1px, transparent 1px 14px)",
  low_carb:
    "repeating-linear-gradient(45deg, var(--border) 0 1px, transparent 1px 14px)",
  economica:
    "repeating-linear-gradient(0deg, var(--border) 0 1px, transparent 1px 16px)",
};

export function CapaDaReceita({
  nome,
  objetivo,
  imagemUrl,
  className,
  prioridade = false,
}: {
  nome: string;
  objetivo: ObjetivoReceita;
  imagemUrl?: string | null;
  className?: string;
  prioridade?: boolean;
}) {
  if (imagemUrl) {
    return (
      <div className={cn("relative overflow-hidden bg-surface-sunken", className)}>
        <Image
          src={imagemUrl}
          alt={`Foto da receita ${nome}`}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          priority={prioridade}
          className="object-cover"
        />
      </div>
    );
  }

  const iniciais = nome
    .split(/\s+/)
    .filter((palavra) => palavra.length > 2)
    .slice(0, 2)
    .map((palavra) => palavra[0])
    .join("")
    .toUpperCase();

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative grid place-items-center overflow-hidden bg-surface-sunken",
        className
      )}
    >
      <span
        className="absolute inset-0 opacity-70"
        style={{ backgroundImage: TRAMA[objetivo] }}
      />
      <span className="relative font-display text-4xl text-border-strong">
        {iniciais || "MP"}
      </span>
    </div>
  );
}
