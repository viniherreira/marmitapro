import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { FichaDeCusto } from "@/components/landing/ficha-de-custo";
import { Button } from "@/components/ui/button";
import { PROMESSA } from "@/lib/content/landing";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="texture-grid pointer-events-none absolute inset-x-0 top-0 h-[560px]"
      />

      <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-12 sm:px-8 sm:pb-28 sm:pt-20">
        <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7 lg:pt-4">
            <p
              className="t-eyebrow animate-rise flex items-center gap-2"
              style={{ animationDelay: "40ms" }}
            >
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-accent"
              />
              {PROMESSA.sobrelinha}
            </p>

            <h1
              className="t-display animate-rise mt-6 max-w-[15ch]"
              style={{ animationDelay: "90ms" }}
            >
              {PROMESSA.titulo}
            </h1>

            <p
              className="t-lead animate-rise mt-6 max-w-xl"
              style={{ animationDelay: "150ms" }}
            >
              {PROMESSA.apoio}
            </p>

            <div
              className="animate-rise mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
              style={{ animationDelay: "210ms" }}
            >
              <Button asChild size="xl">
                <Link href="/cadastro">
                  Criar minha conta
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="xl">
                <a href="#ferramentas">Ver as ferramentas</a>
              </Button>
            </div>

            <ul
              className="animate-rise mt-8 flex flex-wrap gap-x-6 gap-y-2"
              style={{ animationDelay: "270ms" }}
            >
              {PROMESSA.garantias.map((item) => (
                <li
                  key={item}
                  className="t-small flex items-center gap-2 text-muted"
                >
                  <Check className="size-3.5 text-success" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="animate-rise lg:col-span-5"
            style={{ animationDelay: "330ms" }}
          >
            <FichaDeCusto />
            <p className="t-small mt-3 text-center text-muted">
              Exemplo real de saída da calculadora de precificação.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
