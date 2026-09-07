import { cn } from "@/lib/utils";

export function CabecalhoDePagina({
  sobrelinha,
  titulo,
  descricao,
  acao,
  className,
}: {
  sobrelinha?: string;
  titulo: string;
  descricao?: string;
  acao?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex flex-col gap-5 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="max-w-2xl">
        {sobrelinha ? <p className="t-eyebrow">{sobrelinha}</p> : null}
        <h1 className={cn("t-h1", sobrelinha && "mt-3")}>{titulo}</h1>
        {descricao ? <p className="t-lead mt-3">{descricao}</p> : null}
      </div>
      {acao ? <div className="shrink-0">{acao}</div> : null}
    </header>
  );
}
