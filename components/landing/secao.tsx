import { cn } from "@/lib/utils";

export function Secao({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-20 py-20 sm:py-28", className)}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">{children}</div>
    </section>
  );
}

export function AberturaDeSecao({
  sobrelinha,
  titulo,
  texto,
  className,
}: {
  sobrelinha: string;
  titulo: string;
  texto?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <p className="t-eyebrow">{sobrelinha}</p>
      <h2 className="t-h1 mt-4">{titulo}</h2>
      {texto ? <p className="t-lead mt-5">{texto}</p> : null}
    </div>
  );
}
