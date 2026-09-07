"use server";

import { revalidatePath } from "next/cache";

import type { ResultadoDeAcao } from "@/lib/actions/onboarding";
import { garantirPerfil } from "@/lib/auth/perfil";
import { somarTotais } from "@/lib/calculos/macros";
import { clienteAdmin } from "@/lib/supabase/server";
import {
  cenarioSchema,
  removerPorIdSchema,
  salvarCalculoSchema,
} from "@/lib/validacao/schemas";

function mensagemDoZod(erros: { message: string }[]): string {
  return erros[0]?.message ?? "Dados inválidos.";
}

/**
 * Salva uma receita calculada. Os totais são recalculados no servidor a partir
 * da tabela de ingredientes — o cliente não define o resultado.
 */
export async function salvarCalculoDeMacros(
  entrada: unknown
): Promise<ResultadoDeAcao> {
  const analise = salvarCalculoSchema.safeParse(entrada);

  if (!analise.success) {
    return { ok: false, erro: mensagemDoZod(analise.error.issues) };
  }

  try {
    const perfil = await garantirPerfil();
    const supabase = clienteAdmin();

    const { data: ingredientes, error: erroIngredientes } = await supabase
      .from("ingredients")
      .select("*")
      .in(
        "id",
        analise.data.itens.map((item) => item.ingredient_id)
      );

    if (erroIngredientes) {
      return { ok: false, erro: erroIngredientes.message };
    }

    const porId = new Map(
      (ingredientes ?? []).map((ingrediente) => [ingrediente.id, ingrediente])
    );

    const itensValidos = analise.data.itens.filter((item) =>
      porId.has(item.ingredient_id)
    );

    if (itensValidos.length === 0) {
      return { ok: false, erro: "Nenhum ingrediente válido na receita." };
    }

    const totais = somarTotais(
      itensValidos.map((item) => ({
        gramas: item.gramas,
        // a presença foi garantida pelo filtro acima
        base: porId.get(item.ingredient_id)!,
      }))
    );

    const { error } = await supabase.from("saved_calculations").insert({
      profile_id: perfil.id,
      nome: analise.data.nome,
      porcoes: analise.data.porcoes,
      itens: itensValidos,
      kcal_total: Number(totais.kcal.toFixed(2)),
      proteina_total_g: Number(totais.proteina.toFixed(2)),
      carboidrato_total_g: Number(totais.carboidrato.toFixed(2)),
      gordura_total_g: Number(totais.gordura.toFixed(2)),
      custo_total: Number(totais.custo.toFixed(2)),
    });

    if (error) return { ok: false, erro: error.message };

    revalidatePath("/app/macros");
    revalidatePath("/app");

    return { ok: true };
  } catch (erro) {
    return {
      ok: false,
      erro: erro instanceof Error ? erro.message : "Falha ao salvar a receita.",
    };
  }
}

export async function removerCalculoDeMacros(
  entrada: unknown
): Promise<ResultadoDeAcao> {
  const analise = removerPorIdSchema.safeParse(entrada);
  if (!analise.success) return { ok: false, erro: "Registro inválido." };

  try {
    const perfil = await garantirPerfil();
    const supabase = clienteAdmin();

    const { error } = await supabase
      .from("saved_calculations")
      .delete()
      .eq("id", analise.data.id)
      .eq("profile_id", perfil.id);

    if (error) return { ok: false, erro: error.message };

    revalidatePath("/app/macros");
    revalidatePath("/app");

    return { ok: true };
  } catch (erro) {
    return {
      ok: false,
      erro: erro instanceof Error ? erro.message : "Falha ao remover.",
    };
  }
}

export async function salvarCenarioDePreco(
  entrada: unknown
): Promise<ResultadoDeAcao> {
  const analise = cenarioSchema.safeParse(entrada);

  if (!analise.success) {
    return { ok: false, erro: mensagemDoZod(analise.error.issues) };
  }

  try {
    const perfil = await garantirPerfil();
    const supabase = clienteAdmin();

    const { error } = await supabase.from("pricing_scenarios").insert({
      profile_id: perfil.id,
      ...analise.data,
    });

    if (error) return { ok: false, erro: error.message };

    revalidatePath("/app/precificacao");

    return { ok: true };
  } catch (erro) {
    return {
      ok: false,
      erro: erro instanceof Error ? erro.message : "Falha ao salvar o cenário.",
    };
  }
}

export async function removerCenarioDePreco(
  entrada: unknown
): Promise<ResultadoDeAcao> {
  const analise = removerPorIdSchema.safeParse(entrada);
  if (!analise.success) return { ok: false, erro: "Registro inválido." };

  try {
    const perfil = await garantirPerfil();
    const supabase = clienteAdmin();

    const { error } = await supabase
      .from("pricing_scenarios")
      .delete()
      .eq("id", analise.data.id)
      .eq("profile_id", perfil.id);

    if (error) return { ok: false, erro: error.message };

    revalidatePath("/app/precificacao");

    return { ok: true };
  } catch (erro) {
    return {
      ok: false,
      erro: erro instanceof Error ? erro.message : "Falha ao remover.",
    };
  }
}
