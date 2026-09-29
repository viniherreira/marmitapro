import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { CabecalhoDePagina } from "@/components/app/cabecalho-de-pagina";
import { FormularioDePedido } from "@/components/pedidos/formulario";
import { Button } from "@/components/ui/button";
import { garantirPerfil } from "@/lib/auth/perfil";
import { situacaoDeAcesso } from "@/lib/data/assinaturas";
import {
  listarClientes,
  obterPedido,
  sugestoesDeItens,
} from "@/lib/data/pedidos";
import { inicioDaSemana } from "@/lib/pedidos/semana";

export const metadata: Metadata = { title: "Editar pedido" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function EditarPedidoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Id malformado iria até o banco e voltaria como erro de sintaxe do
  // Postgres; para quem digitou a URL, é só um pedido que não existe.
  if (!UUID.test(id)) notFound();

  const perfil = await garantirPerfil();
  const { liberado } = await situacaoDeAcesso();
  if (!liberado) redirect("/app/pedidos");

  const [pedido, clientes, sugestoes] = await Promise.all([
    obterPedido(perfil.id, id),
    listarClientes(perfil.id),
    sugestoesDeItens(perfil.id),
  ]);

  if (!pedido) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Button asChild variant="ghost" size="sm" className="-ml-3">
        <Link href={`/app/pedidos?semana=${inicioDaSemana(pedido.entrega_data)}`}>
          <ArrowLeft className="size-4" aria-hidden="true" />
          Pedidos
        </Link>
      </Button>

      <CabecalhoDePagina
        titulo="Editar pedido"
        descricao={`Pedido de ${pedido.cliente.nome}.`}
      />

      <FormularioDePedido
        clientes={clientes}
        sugestoes={sugestoes}
        dataPadrao={pedido.entrega_data}
        pedido={{
          id: pedido.id,
          customer_id: pedido.customer_id,
          entrega_data: pedido.entrega_data,
          entrega_hora: pedido.entrega_hora,
          observacoes: pedido.observacoes,
          itens: pedido.itens.map((item) => ({
            descricao: item.descricao,
            quantidade: item.quantidade,
            preco_unitario: Number(item.preco_unitario),
          })),
        }}
      />
    </div>
  );
}
