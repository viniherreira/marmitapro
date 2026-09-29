"use server";

import { revalidatePath } from "next/cache";

import type { ResultadoDeAcao } from "@/lib/actions/onboarding";
import { garantirPerfil } from "@/lib/auth/perfil";
import { situacaoDeAcesso } from "@/lib/data/assinaturas";
import { dataValida, inicioDaSemana } from "@/lib/pedidos/semana";
import { clienteAdmin } from "@/lib/supabase/server";
import {
  mudarSituacaoSchema,
  pedidoSchema,
  removerPorIdSchema,
} from "@/lib/validacao/schemas";

function mensagemDoZod(erros: { message: string }[]): string {
  return erros[0]?.message ?? "Dados inválidos.";
}

/** Centavos, para somar dinheiro sem erro de ponto flutuante. */
function emCentavos(valor: number): number {
  return Math.round(valor * 100);
}

/**
 * O perfil de quem pode mexer em pedidos. A tela já esconde o módulo de quem
 * não assinou, mas a ação é pública por natureza — qualquer um pode chamá-la
 * — então a regra vale aqui também.
 */
async function perfilComAcesso() {
  const perfil = await garantirPerfil();
  const { liberado } = await situacaoDeAcesso();
  if (!liberado) throw new ErroDeAcesso();
  return perfil;
}

class ErroDeAcesso extends Error {
  constructor() {
    super("Os pedidos fazem parte da assinatura.");
  }
}

function comoErro(erro: unknown): string {
  if (erro instanceof ErroDeAcesso) return erro.message;
  if (erro instanceof Error && erro.message.startsWith("Cliente")) {
    return erro.message;
  }
  return "Não foi possível salvar agora. Tente de novo em instantes.";
}

/**
 * Resolve o cliente do pedido: confere a posse de um cliente existente, ou
 * cria o novo. Um nome que já existe (sem diferenciar maiúsculas) reaproveita
 * o cadastro em vez de duplicar a "Ana Souza" toda semana.
 */
async function resolverCliente(
  profileId: string,
  cliente:
    | { id: string }
    | { nome: string; telefone: string | null; endereco: string | null }
): Promise<string> {
  const supabase = clienteAdmin();

  if ("id" in cliente) {
    const { data } = await supabase
      .from("customers")
      .select("id")
      .eq("profile_id", profileId)
      .eq("id", cliente.id)
      .maybeSingle();
    if (!data) throw new Error("Cliente não encontrado.");
    return data.id;
  }

  const { data: existente } = await supabase
    .from("customers")
    .select("id, telefone, endereco")
    .eq("profile_id", profileId)
    .ilike("nome", cliente.nome.replace(/[%_]/g, "\\$&"))
    .limit(1)
    .maybeSingle();

  if (existente) {
    // Completa o cadastro com o que veio de novo, sem apagar o que já havia.
    const complemento = {
      telefone: cliente.telefone ?? existente.telefone,
      endereco: cliente.endereco ?? existente.endereco,
    };
    await supabase.from("customers").update(complemento).eq("id", existente.id);
    return existente.id;
  }

  const { data: criado, error } = await supabase
    .from("customers")
    .insert({
      profile_id: profileId,
      nome: cliente.nome,
      telefone: cliente.telefone,
      endereco: cliente.endereco,
    })
    .select("id")
    .single();

  if (error) throw new Error(`Falha ao criar o cliente: ${error.message}`);
  return criado.id;
}

/** Liga o item à receita do banco quando o nome bate exatamente. */
async function receitasPorNome(nomes: string[]): Promise<Map<string, string>> {
  const supabase = clienteAdmin();
  const { data } = await supabase
    .from("recipes")
    .select("id, nome")
    .eq("publica", true)
    .in("nome", Array.from(new Set(nomes)));

  return new Map((data ?? []).map((r) => [r.nome.toLowerCase(), r.id]));
}

/**
 * Cria ou atualiza um pedido. O total é somado aqui, a partir dos itens —
 * o navegador não define quanto o pedido vale.
 */
export async function salvarPedido(entrada: unknown): Promise<ResultadoDeAcao> {
  const analise = pedidoSchema.safeParse(entrada);
  if (!analise.success) {
    return { ok: false, erro: mensagemDoZod(analise.error.issues) };
  }

  const dados = analise.data;
  if (!dataValida(dados.entrega_data)) {
    return { ok: false, erro: "Data de entrega inválida." };
  }

  try {
    const perfil = await perfilComAcesso();
    const supabase = clienteAdmin();

    const customerId = await resolverCliente(perfil.id, dados.cliente);
    const receitas = await receitasPorNome(dados.itens.map((i) => i.descricao));

    const totalEmCentavos = dados.itens.reduce(
      (soma, item) => soma + emCentavos(item.preco_unitario) * item.quantidade,
      0
    );

    const campos = {
      customer_id: customerId,
      entrega_data: dados.entrega_data,
      entrega_hora: dados.entrega_hora ?? null,
      observacoes: dados.observacoes,
      valor_total: totalEmCentavos / 100,
    };

    let pedidoId: string;
    let itensAntigos: string[] = [];

    if (dados.id) {
      const { data: atual } = await supabase
        .from("orders")
        .select("id")
        .eq("profile_id", perfil.id)
        .eq("id", dados.id)
        .maybeSingle();
      if (!atual) return { ok: false, erro: "Pedido não encontrado." };

      const { error } = await supabase
        .from("orders")
        .update(campos)
        .eq("id", atual.id);
      if (error) throw error;

      const { data: antigos } = await supabase
        .from("order_items")
        .select("id")
        .eq("order_id", atual.id);
      itensAntigos = (antigos ?? []).map((i) => i.id);
      pedidoId = atual.id;
    } else {
      const { data: criado, error } = await supabase
        .from("orders")
        .insert({ ...campos, profile_id: perfil.id })
        .select("id")
        .single();
      if (error) throw error;
      pedidoId = criado.id;
    }

    // Itens novos entram antes de os antigos saírem. Se a inserção falhar, o
    // pedido continua com os itens que tinha, em vez de ficar vazio.
    const { error: erroItens } = await supabase.from("order_items").insert(
      dados.itens.map((item, ordem) => ({
        order_id: pedidoId,
        recipe_id: receitas.get(item.descricao.toLowerCase()) ?? null,
        descricao: item.descricao,
        quantidade: item.quantidade,
        preco_unitario: item.preco_unitario,
        ordem,
      }))
    );

    if (erroItens) {
      // Pedido recém-criado sem item nenhum não serve para nada.
      if (!dados.id) await supabase.from("orders").delete().eq("id", pedidoId);
      throw erroItens;
    }

    if (itensAntigos.length) {
      await supabase.from("order_items").delete().in("id", itensAntigos);
    }

    revalidatePath("/app/pedidos");
    return {
      ok: true,
      destino: `/app/pedidos?semana=${inicioDaSemana(dados.entrega_data)}`,
    };
  } catch (erro) {
    return { ok: false, erro: comoErro(erro) };
  }
}

export async function mudarSituacaoDoPedido(
  entrada: unknown
): Promise<ResultadoDeAcao> {
  const analise = mudarSituacaoSchema.safeParse(entrada);
  if (!analise.success) {
    return { ok: false, erro: mensagemDoZod(analise.error.issues) };
  }

  try {
    const perfil = await perfilComAcesso();

    const { data, error } = await clienteAdmin()
      .from("orders")
      .update({ situacao: analise.data.situacao })
      .eq("profile_id", perfil.id)
      .eq("id", analise.data.id)
      .select("id");

    if (error) throw error;
    if (!data?.length) return { ok: false, erro: "Pedido não encontrado." };

    revalidatePath("/app/pedidos");
    return { ok: true };
  } catch (erro) {
    return { ok: false, erro: comoErro(erro) };
  }
}

export async function excluirPedido(entrada: unknown): Promise<ResultadoDeAcao> {
  const analise = removerPorIdSchema.safeParse(entrada);
  if (!analise.success) {
    return { ok: false, erro: mensagemDoZod(analise.error.issues) };
  }

  try {
    const perfil = await perfilComAcesso();

    // Os itens saem junto, pelo "on delete cascade" da tabela.
    const { error } = await clienteAdmin()
      .from("orders")
      .delete()
      .eq("profile_id", perfil.id)
      .eq("id", analise.data.id);

    if (error) throw error;

    revalidatePath("/app/pedidos");
    return { ok: true };
  } catch (erro) {
    return { ok: false, erro: comoErro(erro) };
  }
}
