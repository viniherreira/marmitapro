import { cn } from "@/lib/utils";

export function DsSection({
  id,
  numero,
  titulo,
  descricao,
  children,
}: {
  id: string;
  numero: string;
  titulo: string;
  descricao: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-border pt-10">
      <header className="mb-10 grid gap-6 md:grid-cols-[7rem_minmax(0,1fr)] md:gap-10">
        <span className="t-eyebrow pt-1.5 tabular-nums">{numero}</span>
        <div className="max-w-2xl space-y-3">
          <h2 className="t-h2">{titulo}</h2>
          <p className="t-body text-muted">{descricao}</p>
        </div>
      </header>
      <div className="md:pl-[7rem] xl:pl-0">{children}</div>
    </section>
  );
}

/** Bloco rotulado que emoldura uma demonstração. */
export function DsBloco({
  rotulo,
  nota,
  className,
  contentClassName,
  children,
}: {
  rotulo: string;
  nota?: string;
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="t-eyebrow">{rotulo}</span>
        {nota ? <span className="t-small text-muted">{nota}</span> : null}
      </div>
      <div
        className={cn(
          "rounded-lg border border-border bg-surface p-6",
          contentClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}
