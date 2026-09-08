import type { Metadata } from "next";
import { ArrowUpRight, Check, MessageCircle, Users } from "lucide-react";

import { CabecalhoDePagina } from "@/components/app/cabecalho-de-pagina";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  COMBINADOS,
  O_QUE_ROLA,
  grupoConfigurado,
  linkDoGrupo,
} from "@/lib/content/comunidade";

export const metadata: Metadata = { title: "Comunidade" };

export default function ComunidadePage() {
  return (
    <div className="space-y-10">
      <CabecalhoDePagina
        sobrelinha="Comunidade"
        titulo="Você não precisa descobrir tudo sozinho."
        descricao="O grupo no WhatsApp é onde quem já está vendendo troca preço, fornecedor e cardápio com quem está começando."
      />

      {/* Convite ------------------------------------------------------- */}
      {grupoConfigurado ? (
        <Card>
          <CardContent className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border bg-primary-soft text-primary">
                <MessageCircle className="size-4" aria-hidden="true" />
              </span>
              <div className="max-w-md">
                <p className="t-h3">Grupo da comunidade no WhatsApp</p>
                <p className="t-small mt-1.5 text-muted">
                  Entrada livre para quem tem conta no MarmitaPRO. O convite
                  abre direto no aplicativo.
                </p>
              </div>
            </div>

            <Button asChild size="lg" className="shrink-0">
              <a href={linkDoGrupo} target="_blank" rel="noopener noreferrer">
                Entrar no grupo
                <ArrowUpRight aria-hidden="true" />
                <span className="sr-only">(abre em uma nova aba)</span>
              </a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <EmptyState
          icon={Users}
          title="O convite do grupo ainda não foi publicado"
          description="Assim que o link do grupo for cadastrado, o botão de entrada aparece aqui — sem precisar de atualização do aplicativo."
        />
      )}

      {/* O que rola lá dentro ------------------------------------------ */}
      <section className="space-y-5">
        <h2 className="t-h3">O que você encontra lá</h2>

        <ul className="grid gap-4 sm:grid-cols-2">
          {O_QUE_ROLA.map((item) => (
            <li
              key={item.titulo}
              className="rounded-lg border border-border p-5"
            >
              <p className="text-[0.9375rem] font-medium">{item.titulo}</p>
              <p className="t-small mt-1.5 text-muted">{item.texto}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Combinados ----------------------------------------------------- */}
      <section className="space-y-5">
        <h2 className="t-h3">Combinados</h2>

        <ul className="space-y-3">
          {COMBINADOS.map((regra) => (
            <li key={regra} className="flex gap-3">
              <Check
                className="mt-1 size-3.5 shrink-0 text-primary"
                aria-hidden="true"
              />
              <span className="t-body text-muted">{regra}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
