import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "flex w-full items-start gap-3 rounded-lg border p-4 text-[0.9375rem] leading-relaxed",
  {
    variants: {
      tone: {
        info: "border-border bg-surface-sunken text-foreground",
        success: "border-success/25 bg-success-soft text-foreground",
        warning: "border-warning/30 bg-warning-soft text-foreground",
        error: "border-destructive/25 bg-destructive-soft text-foreground",
      },
    },
    defaultVariants: { tone: "info" },
  }
);

const ICONES: Record<NonNullable<AlertTone>, LucideIcon> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
};

const COR_ICONE: Record<NonNullable<AlertTone>, string> = {
  info: "text-muted",
  success: "text-success",
  warning: "text-warning",
  error: "text-destructive",
};

type AlertTone = VariantProps<typeof alertVariants>["tone"];

function Alert({
  className,
  tone = "info",
  title,
  children,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof alertVariants> & { title?: string }) {
  const t = tone ?? "info";
  const Icone = ICONES[t];

  return (
    <div
      role={t === "error" ? "alert" : "status"}
      className={cn(alertVariants({ tone }), className)}
      {...props}
    >
      <Icone className={cn("mt-0.5 size-4 shrink-0", COR_ICONE[t])} aria-hidden="true" />
      <div className="min-w-0 space-y-1">
        {title ? <p className="font-medium leading-snug">{title}</p> : null}
        {children ? (
          <div className="text-[0.875rem] leading-relaxed text-muted-strong">
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export { Alert, alertVariants };
