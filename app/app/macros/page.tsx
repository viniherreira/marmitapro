import type { Metadata } from "next";
import { BookOpen } from "lucide-react";

import { CabecalhoDePagina } from "@/components/app/cabecalho-de-pagina";
import { CalculadoraDeMacros } from "@/components/macros/calculadora";
import { ListaDeSalvos } from "@/components/macros/lista-de-salvos";
import { EmptyState } from "@/components/ui/empty-state";
import { garantirPerfil } from "@/lib/auth/perfil";
import { listarCalculosSalvos, listarIngredientes } from "@/lib/data/ferramentas";

export const metadata: Metadata = {
  title: "Calculadora de macros",
  description:
    "Monte a receita em gramas e tire a ficha nutricional por porção.",
};

export default async function MacrosPage() {
  const perfil = await garantirPerfil();

  const [ingredientes, calculos] = await Promise.all([
    listarIngredientes(),
    listarCalculosSalvos(perfil.id),
  ]);

  return (
    <div className="space-y-10">
      <CabecalhoDePagina
        sobrelinha="Ferramenta"
        titulo="Calculadora de macros"
        descricao={`Some os ingredientes em gramas e a ficha sai pronta, no total e por porção. A base tem ${ingredientes.length} alimentos da cozinha brasileira.`}
      />

      <CalculadoraDeMacros ingredientes={ingredientes} />

      <section>
        <h2 className="t-eyebrow">Suas receitas salvas</h2>

        <div className="mt-5">
          {calculos.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="Você ainda não salvou nenhuma receita"
              description="Monte uma receita acima, dê um nome e salve. Ela fica disponível aqui e no painel."
            />
          ) : (
            <ListaDeSalvos calculos={calculos} />
          )}
        </div>
      </section>
    </div>
  );
}
