import type { Metadata } from "next";
import { ClipboardList } from "lucide-react";

import { CabecalhoDePagina } from "@/components/app/cabecalho-de-pagina";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "Pedidos" };

export default function PedidosPage() {
  return (
    <div className="space-y-8">
      <CabecalhoDePagina
        sobrelinha="Fase 2"
        titulo="Pedidos"
        descricao="O controle de pedidos entra na próxima fase: cadastro de cliente, janela de pedido semanal, status de produção e entrega."
      />

      <EmptyState
        icon={ClipboardList}
        title="Ainda não disponível"
        description="A rota já existe e o modelo de dados foi desenhado prevendo esse módulo. O escopo completo está descrito no ROADMAP do projeto."
      />
    </div>
  );
}
