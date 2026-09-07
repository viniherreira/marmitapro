import { Skeleton } from "@/components/ui/skeleton";

export default function Carregando() {
  return (
    <div className="space-y-10" aria-busy="true" aria-live="polite">
      <span className="sr-only">Carregando…</span>

      <div className="space-y-4 border-b border-border pb-8">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-9 w-3/5" />
        <Skeleton className="h-4 w-4/5 max-w-xl" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
        <div className="space-y-4 rounded-lg border border-border p-6">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-10 w-52" />
        </div>
        <div className="space-y-4 rounded-lg border border-border p-6">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-1.5 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((indice) => (
          <div
            key={indice}
            className="space-y-3 rounded-lg border border-border p-5"
          >
            <Skeleton className="size-9 rounded-lg" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
