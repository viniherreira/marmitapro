"use server";

import { revalidatePath } from "next/cache";

import type { ResultadoDeAcao } from "@/lib/actions/onboarding";
import { garantirPerfil } from "@/lib/auth/perfil";
import { clienteAdmin } from "@/lib/supabase/server";
import { alternarProgressoSchema } from "@/lib/validacao/schemas";

/** Marca ou desmarca uma aula como concluída para o perfil logado. */
export async function alternarProgressoDaAula(
  entrada: unknown
): Promise<ResultadoDeAcao> {
  const analise = alternarProgressoSchema.safeParse(entrada);

  if (!analise.success) {
    return { ok: false, erro: "Aula inválida." };
  }

  try {
    const perfil = await garantirPerfil();
    const supabase = clienteAdmin();

    if (analise.data.concluida) {
      const { error } = await supabase.from("lesson_progress").upsert(
        {
          profile_id: perfil.id,
          lesson_id: analise.data.lessonId,
          concluida: true,
          concluida_em: new Date().toISOString(),
        },
        { onConflict: "profile_id,lesson_id" }
      );

      if (error) return { ok: false, erro: error.message };
    } else {
      const { error } = await supabase
        .from("lesson_progress")
        .delete()
        .eq("profile_id", perfil.id)
        .eq("lesson_id", analise.data.lessonId);

      if (error) return { ok: false, erro: error.message };
    }

    revalidatePath("/app", "layout");

    return { ok: true };
  } catch (erro) {
    return {
      ok: false,
      erro: erro instanceof Error ? erro.message : "Falha ao salvar o progresso.",
    };
  }
}
