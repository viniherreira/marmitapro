import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { env, supabaseConfigurado } from "@/lib/env";
import type { Database } from "@/types/database";

export type ClienteSupabase = SupabaseClient<Database>;

let cliente: ClienteSupabase | null = null;

/**
 * Cliente de servidor com service role.
 *
 * Todo acesso a dados do MarmitaPRO acontece em Server Components e Server
 * Actions, nunca no navegador. A service role ignora RLS por definição, então
 * a filtragem por dono é feita explicitamente nas funções de lib/data.
 * As políticas de RLS continuam ativas e cobrem o acesso direto pelo
 * navegador, caso o Clerk seja registrado como provedor no Supabase.
 */
export function clienteAdmin(): ClienteSupabase {
  if (!supabaseConfigurado) {
    throw new Error(
      "Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  cliente ??= createClient<Database>(
    env.supabaseUrl,
    env.supabaseServiceRoleKey,
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { "x-application-name": "marmitapro" } },
    }
  );

  return cliente;
}
