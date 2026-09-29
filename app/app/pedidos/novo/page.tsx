import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { CabecalhoDePagina } from "@/components/app/cabecalho-de-pagina";
import { FormularioDePedido } from "@/components/pedidos/formulario";
import { Button } from "@/components/ui/button";
import { garantirPerfil } from "@/lib/auth/perfil";
import { situacaoDeAcesso } from "@/lib/data/assinaturas";
import { listarClientes, sugestoesDeItens } from "@/lib/data/pedidos";
import { dataValida, hojeNoBrasil } from "@/lib/pedidos/semana";

export const metadata: Metadata = { title: "Novo pedido" };

export default async function NovoPedidoPage({
  searchParams,
}: {
  searchParams: Promise<{ data?: string }>;
}) {
  const perfil = await garantirPerfil();
  const { liberado } = await situacaoDeAcesso();
  if (!liberado) redirect("/app/pedidos");

  const { data } = await searchParams;

  const [clientes, sugestoes] = await Promise.all([
    listarClientes(perfil.id),
    sugestoesDeItens(perfil.id),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Button asChild variant="ghost" size="sm" className="-ml-3">
        <Link href="/app/pedidos">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Pedidos
        </Link>
      </Button>

      <CabecalhoDePagina
        titulo="Novo pedido"
        descricao="Quem pediu, quais marmitas e quando entrega. O resto é opcional."
      />

      <FormularioDePedido
        clientes={clientes}
        sugestoes={sugestoes}
        dataPadrao={dataValida(data) ? data : hojeNoBrasil()}
      />
    </div>
  );
}
