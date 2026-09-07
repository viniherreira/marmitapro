import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Estado vazio padrão do produto. Sempre com uma saída — nunca só
 * um desenho e uma frase.
 */
export function EmptyState({
  icon: Icone,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-4 rounded-lg border border-dashed border-border-strong bg-surface-sunken/50 p-8",
        className
      )}
    >
      <span className="grid size-10 place-items-center rounded-lg border border-border bg-surface text-muted">
        <Icone className="size-4" aria-hidden="true" />
      </span>
      <div className="max-w-prose space-y-1.5">
        <p className="t-h3">{title}</p>
        {description ? (
          <p className="t-small text-muted">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
