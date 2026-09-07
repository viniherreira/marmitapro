import { auth, currentUser } from "@clerk/nextjs/server";

import { clienteAdmin } from "@/lib/supabase/server";
import type { Perfil } from "@/types/database";

/**
 * Devolve o perfil do usuário logado, criando-o na primeira visita.
 * O Clerk é a fonte da verdade da identidade; o perfil é o espelho local
 * que amarra progresso, cálculos e receitas ao usuário.
 */
export async function garantirPerfil(): Promise<Perfil> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Sessão não encontrada.");
  }

  const supabase = clienteAdmin();

  const { data: existente, error: erroBusca } = await supabase
    .from("profiles")
    .select("*")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (erroBusca) {
    throw new Error(`Falha ao carregar o perfil: ${erroBusca.message}`);
  }

  if (existente) {
    return existente;
  }

  const usuario = await currentUser();

  const { data: criado, error: erroCriacao } = await supabase
    .from("profiles")
    .insert({
      clerk_user_id: userId,
      email: usuario?.primaryEmailAddress?.emailAddress ?? null,
      nome:
        [usuario?.firstName, usuario?.lastName].filter(Boolean).join(" ") ||
        null,
    })
    .select("*")
    .single();

  if (erroCriacao || !criado) {
    throw new Error(
      `Falha ao criar o perfil: ${erroCriacao?.message ?? "resposta vazia"}`
    );
  }

  return criado;
}

/** Primeiro nome, para saudação. Cai para um rótulo neutro. */
export function primeiroNome(perfil: Perfil): string {
  const nome = perfil.nome?.trim();
  if (!nome) return "por aqui";
  return nome.split(/\s+/)[0];
}
