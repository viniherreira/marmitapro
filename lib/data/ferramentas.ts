import { clienteAdmin } from "@/lib/supabase/server";
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
  return data ?? [];
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
