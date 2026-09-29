import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * `<select>` do próprio navegador com a aparência do Input.
 *
 * Para escolhas rápidas em formulário, o nativo ganha do Select desenhado:
 * no celular abre o seletor do sistema, que é o que a mão já sabe usar, e
 * funciona com `register` do react-hook-form sem Controller.
 */
function SelectNativo({
  className,
  children,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        data-slot="select-nativo"
        className={cn(
          "h-10 w-full min-w-0 appearance-none rounded-lg border border-border bg-surface py-0 pl-3 pr-9 text-[0.9375rem] text-foreground",
          "transition-[border-color,background-color] duration-150 ease-out",
          "hover:border-border-strong",
          "focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/15",
          "disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:opacity-60",
          "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/15",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted"
        aria-hidden="true"
      />
    </div>
  );
}

export { SelectNativo };
