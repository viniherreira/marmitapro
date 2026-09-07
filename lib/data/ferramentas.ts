import { clienteAdmin } from "@/lib/supabase/server";
import { itemDeCalculoSchema } from "@/lib/validacao/schemas";
import type { CalculoSalvo, CenarioDePreco, Ingrediente } from "@/types/database";

/** Base de ingredientes usada pela calculadora de macros. */
export async function listarIngredientes(): Promise<Ingrediente[]> {
  const supabase = clienteAdmin();

  const { data, error } = await supabase
    .from("ingredients")
    .select("*")
    .order("categoria")
    .order("nome");

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listarCalculosSalvos(
  profileId: string,
  limite = 50
): Promise<CalculoSalvo[]> {
  const supabase = clienteAdmin();

  const { data, error } = await supabase
    .from("saved_calculations")
    .select("*")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false })
    .limit(limite);

  if (error) throw new Error(error.message);

  // `itens` é jsonb: o banco não garante a forma, então validamos na leitura.
  // Item malformado é descartado em vez de derrubar a página inteira.
  return (data ?? []).map((linha) => ({
    ...linha,
    itens: itensValidados(linha.itens),
  }));
}

function itensValidados(bruto: unknown): CalculoSalvo["itens"] {
  if (!Array.isArray(bruto)) return [];

  return bruto.flatMap((item) => {
    const analise = itemDeCalculoSchema.safeParse(item);
    return analise.success ? [analise.data] : [];
  });
}

export async function listarCenarios(
  profileId: string,
  limite = 50
): Promise<CenarioDePreco[]> {
  const supabase = clienteAdmin();

  const { data, error } = await supabase
    .from("pricing_scenarios")
    .select("*")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false })
    .limit(limite);

  if (error) throw new Error(error.message);
  return data ?? [];
}
