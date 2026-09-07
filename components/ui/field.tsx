import * as React from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * Envelope de campo de formulário: rótulo, dica, sufixo de unidade e erro.
 * Mantém o espaçamento e a mensagem de erro idênticos em todo o app.
 */
export function Field({
  id,
  label,
  hint,
  error,
  suffix,
  className,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  suffix?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={id}>{label}</Label>
        {suffix ? (
          <span className="t-small text-muted tabular-nums">{suffix}</span>
        ) : null}
      </div>

      {children}

      {hint && !error ? (
        <p id={hintId} className="t-small text-muted">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} className="t-small text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
