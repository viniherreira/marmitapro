import type { Metadata } from "next";
import Link from "next/link";
import { Calculator } from "lucide-react";

import { CabecalhoDePagina } from "@/components/app/cabecalho-de-pagina";
import { CalculadoraDePrecificacao } from "@/components/precificacao/calculadora";
import { ListaDeCenarios } from "@/components/precificacao/lista-de-cenarios";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { garantirPerfil } from "@/lib/auth/perfil";
import { listarCenarios } from "@/lib/data/ferramentas";

export const metadata: Metadata = {
  title: "Calculadora de precificação",
  description:
    "Custo real, preço sugerido e lucro projetado, com a conta aberta.",
};

export default async function PrecificacaoPage() {
  const perfil = await garantirPerfil();
  const cenarios = await listarCenarios(perfil.id);

  return (
    <div className="space-y-10">
      <CabecalhoDePagina
        sobrelinha="Ferramenta"
        titulo="Calculadora de precificação"
        descricao="Lance os custos e o tempo gasto. O preço aparece com cada etapa da conta visível — a ideia é você aprender a fazer essa conta sozinho."
        acao={
          <Button asChild variant="ghost" size="sm">
            <Link href="/app/curso/precificacao-sem-chute/margem-e-markup">
              Ver a aula sobre margem
            </Link>
          </Button>
        }
      />

      <CalculadoraDePrecificacao />

      <section>
        <h2 className="t-eyebrow">Cenários salvos</h2>

        <div className="mt-5">
          {cenarios.length === 0 ? (
            <EmptyState
              icon={Calculator}
              title="Nenhum cenário salvo"
              description="Salve o cálculo com um nome para comparar preços lado a lado: avulso, pacote de cinco e plano semanal."
            />
          ) : (
            <ListaDeCenarios cenarios={cenarios} />
          )}
        </div>
      </section>
    </div>
  );
}
