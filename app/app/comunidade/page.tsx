import type { Metadata } from "next";
import { Users } from "lucide-react";

import { CabecalhoDePagina } from "@/components/app/cabecalho-de-pagina";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "Comunidade" };

export default function ComunidadePage() {
  return (
    <div className="space-y-8">
      <CabecalhoDePagina
        sobrelinha="Fase 2"
        titulo="Comunidade"
        descricao="Um espaço para quem está tocando o negócio trocar cardápio, fornecedor e preço praticado por região."
      />

      <EmptyState
        icon={Users}
        title="Ainda não disponível"
        description="A rota já existe para não quebrar links futuros. O escopo completo está descrito no ROADMAP do projeto."
      />
    </div>
  );
}
