import { cn } from "@/lib/utils";

/**
 * Marca: uma bandeja dividida vista de cima — a marmita reduzida a
 * três traços. Desenhada em currentColor para servir em qualquer fundo.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("size-6", className)}
    >
      <rect
        x="2.25"
        y="4.25"
        width="19.5"
        height="15.5"
        rx="3.75"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M13.5 4.75v14.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M13.5 12h8.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="7.9" cy="12" r="2.35" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function Logo({
  className,
  markClassName,
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-foreground",
        className
      )}
    >
      <LogoMark className={cn("size-6 text-primary", markClassName)} />
      <span className="flex items-baseline gap-[3px]">
        <span className="font-display text-[1.15em] leading-none">Marmita</span>
        <span className="text-[0.72em] font-semibold uppercase leading-none tracking-[0.14em] text-muted">
          Pro
        </span>
      </span>
    </span>
  );
}
