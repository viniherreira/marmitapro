import { fimDaSemana } from "@/lib/pedidos/semana";
import { clienteAdmin } from "@/lib/supabase/server";
import type {
  Cliente,
  ItemDoPedido,
  Pedido,
  SituacaoPedido,
} from "@/types/database";

export type PedidoCompleto = Pedido & {
  cliente: Cliente;
  itens: ItemDoPedido[];
};

export type ResumoDaSemana = {
  pedidos: number;
  marmitas: number;
  faturamento: number;
  porSituacao: Record<SituacaoPedido, number>;
  /** Quantas de cada prato produzir, do mais pedido para o menos. */
  producao: { descricao: string; quantidade: number }[];
};

/** Sugestão para o campo de item: nome do prato e o último preço cobrado. */
export type SugestaoDeItem = {
  descricao: string;
  preco: number | null;
};

// --- leitura ----------------------------------------------------------------
// Toda consulta filtra por profile_id explicitamente: o servidor usa a service
// role, que ignora RLS, então a posse é garantida aqui.

export async function listarPedidosDaSemana(
  profileId: string,
  inicio: string
): Promise<PedidoCompleto[]> {
  const supabase = clienteAdmin();

  const { data: pedidos, error } = await supabase
    .from("orders")
    .select("*")
    .eq("profile_id", profileId)
    .gte("entrega_data", inicio)
    .lte("entrega_data", fimDaSemana(inicio))
    .order("entrega_data")
    .order("entrega_hora", { nullsFirst: false })
    .order("created_at");

  if (error) throw new Error(`Falha ao ler os pedidos: ${error.message}`);
  return completar(pedidos ?? []);
}

export async function obterPedido(
  profileId: string,
  id: string
): Promise<PedidoCompleto | null> {
  const supabase = clienteAdmin();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("profile_id", profileId)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Falha ao ler o pedido: ${error.message}`);
  if (!data) return null;

  const [completo] = await completar([data]);
  return completo ?? null;
}

export async function listarClientes(profileId: string): Promise<Cliente[]> {
  const supabase = clienteAdmin();

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("profile_id", profileId)
    .order("nome");

  if (error) throw new Error(`Falha ao ler os clientes: ${error.message}`);
  return data ?? [];
}

/**
 * O que já foi vendido vem primeiro, com o último preço cobrado: quem vende
 * repete o mesmo cardápio toda semana e não deveria redigitar o preço. Depois
 * entram as receitas do banco que ainda não foram vendidas, sem preço.
 */
export async function sugestoesDeItens(
  profileId: string
): Promise<SugestaoDeItem[]> {
  const supabase = clienteAdmin();

  const [{ data: ultimosPedidos }, { data: receitas }] = await Promise.all([
    supabase
      .from("orders")
      .select("id")
      .eq("profile_id", profileId)
      .order("created_at", { ascending: false })
      .limit(60),
    supabase.from("recipes").select("nome").eq("publica", true).order("nome"),
  ]);

  const ordemDoPedido = new Map(
    (ultimosPedidos ?? []).map((pedido, indice) => [pedido.id, indice])
  );

  const { data: itensRecentes } = ordemDoPedido.size
    ? await supabase
        .from("order_items")
        .select("order_id, descricao, preco_unitario")
        .in("order_id", Array.from(ordemDoPedido.keys()))
    : { data: [] };

  // Do pedido mais novo para o mais antigo: o primeiro preço visto de cada
  // prato é o mais recente.
  const recentes = (itensRecentes ?? []).sort(
    (a, b) =>
      (ordemDoPedido.get(a.order_id) ?? 0) - (ordemDoPedido.get(b.order_id) ?? 0)
  );

  const vistos = new Map<string, SugestaoDeItem>();

  for (const item of recentes) {
    const chave = item.descricao.trim().toLowerCase();
    if (!vistos.has(chave)) {
      vistos.set(chave, {
        descricao: item.descricao,
        preco: Number(item.preco_unitario),
      });
    }
  }

  for (const receita of receitas ?? []) {
    const chave = receita.nome.trim().toLowerCase();
    if (!vistos.has(chave)) {
      vistos.set(chave, { descricao: receita.nome, preco: null });
    }
  }

  return Array.from(vistos.values());
}

// --- resumo -----------------------------------------------------------------

/**
 * Números da semana. Pedido cancelado aparece na contagem por situação, mas
 * fica fora de marmitas, faturamento e produção: não vai para a panela nem
 * para o caixa.
 */
export function resumirSemana(pedidos: PedidoCompleto[]): ResumoDaSemana {
  const porSituacao: Record<SituacaoPedido, number> = {
    recebido: 0,
    em_producao: 0,
    pronto: 0,
    entregue: 0,
    cancelado: 0,
  };

  const producao = new Map<string, { descricao: string; quantidade: number }>();
  let marmitas = 0;
  let faturamento = 0;

  for (const pedido of pedidos) {
    porSituacao[pedido.situacao] += 1;
    if (pedido.situacao === "cancelado") continue;

    faturamento += Number(pedido.valor_total);

    for (const item of pedido.itens) {
      marmitas += item.quantidade;

      const chave = item.descricao.trim().toLowerCase();
      const atual = producao.get(chave);
      if (atual) {
        atual.quantidade += item.quantidade;
      } else {
        producao.set(chave, {
          descricao: item.descricao,
          quantidade: item.quantidade,
        });
      }
    }
  }

  return {
    pedidos: pedidos.length - porSituacao.cancelado,
    marmitas,
    faturamento,
    porSituacao,
    producao: Array.from(producao.values()).sort(
      (a, b) => b.quantidade - a.quantidade || a.descricao.localeCompare(b.descricao)
    ),
  };
}

// ---------------------------------------------------------------------------

/**
 * Junta cliente e itens aos pedidos em duas consultas, e não uma por pedido.
 * Mesmo motivo de lib/data/receitas.ts: junção em memória é barata no volume
 * de uma semana e dispensa tipos de relacionamento embutido.
 */
async function completar(pedidos: Pedido[]): Promise<PedidoCompleto[]> {
  if (pedidos.length === 0) return [];

  const supabase = clienteAdmin();
  const idsDePedido = pedidos.map((p) => p.id);
  const idsDeCliente = Array.from(new Set(pedidos.map((p) => p.customer_id)));

  const [{ data: itens, error: erroItens }, { data: clientes, error: erroClientes }] =
    await Promise.all([
      supabase
        .from("order_items")
        .select("*")
        .in("order_id", idsDePedido)
        .order("ordem"),
      supabase.from("customers").select("*").in("id", idsDeCliente),
    ]);

  if (erroItens) throw new Error(`Falha ao ler os itens: ${erroItens.message}`);
  if (erroClientes) {
    throw new Error(`Falha ao ler os clientes: ${erroClientes.message}`);
  }

  const clientePorId = new Map((clientes ?? []).map((c) => [c.id, c]));
  const itensPorPedido = new Map<string, ItemDoPedido[]>();
  for (const item of itens ?? []) {
    const lista = itensPorPedido.get(item.order_id) ?? [];
    lista.push(item);
    itensPorPedido.set(item.order_id, lista);
  }

  return pedidos.flatMap((pedido) => {
    const cliente = clientePorId.get(pedido.customer_id);
    // Sem cliente só se o banco estiver inconsistente; melhor esconder o
    // pedido do que derrubar a tela inteira por causa dele.
    if (!cliente) return [];
    return [{ ...pedido, cliente, itens: itensPorPedido.get(pedido.id) ?? [] }];
  });
}
