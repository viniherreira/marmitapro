"use server";

import { revalidatePath } from "next/cache";

import { garantirPerfil } from "@/lib/auth/perfil";
import { clienteAdmin } from "@/lib/supabase/server";
import { respostasOnboardingSchema } from "@/lib/validacao/schemas";

export type ResultadoDeAcao =
  | { ok: true; destino?: string }
  | { ok: false; erro: string };

/**
 * Grava as respostas do quiz e define o destino: quem já vende cai no painel
 * com as ferramentas; quem está começando cai na trilha.
 */
export async function salvarOnboarding(
  entrada: unknown
): Promise<ResultadoDeAcao> {
  const analise = respostasOnboardingSchema.safeParse(entrada);

  if (!analise.success) {
    return { ok: false, erro: "Respostas inválidas. Refaça o questionário." };
  }

  try {
    const perfil = await garantirPerfil();
    const supabase = clienteAdmin();

    const { error: erroRespostas } = await supabase
      .from("onboarding_answers")
      .upsert(
        { profile_id: perfil.id, ...analise.data },
        { onConflict: "profile_id" }
      );

    if (erroRespostas) {
      return { ok: false, erro: erroRespostas.message };
    }

    const { error: erroPerfil } = await supabase
      .from("profiles")
      .update({ onboarding_concluido: true })
      .eq("id", perfil.id);

    if (erroPerfil) {
      return { ok: false, erro: erroPerfil.message };
    }

    revalidatePath("/app", "layout");

    const destino =
      analise.data.situacao === "comecando" ? "/app/curso" : "/app";

    return { ok: true, destino };
  } catch (erro) {
    return {
      ok: false,
      erro: erro instanceof Error ? erro.message : "Falha ao salvar.",
    };
  }
}
