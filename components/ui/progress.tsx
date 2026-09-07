"use client";

import * as React from "react";
import { Progress as ProgressPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Barra de progresso. O verde-limão é reservado a este uso e a badges —
 * é o único lugar onde a cor de destaque aparece em área.
 */
function Progress({
  className,
  value,
  tone = "accent",
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  tone?: "accent" | "primary";
}) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "h-full w-full flex-1 rounded-full transition-transform duration-500 ease-out",
          tone === "accent" ? "bg-accent" : "bg-primary"
        )}
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
