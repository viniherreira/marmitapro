import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CtaFinal() {
  return (
    <section className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-2xl">
            <p className="t-eyebrow text-primary-foreground/60">
              Comece pelo número
            </p>
            <h2 className="t-h1 mt-4 text-primary-foreground">
              Calcule o custo de uma marmita sua ainda hoje.
            </h2>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-primary-foreground/75">
              Leva cinco minutos e não precisa de cartão. Se o número te
              surpreender, você já sabe por onde começar.
            </p>
          </div>

          <Button
            asChild
            size="xl"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            <Link href="/cadastro">
              Criar minha conta
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
