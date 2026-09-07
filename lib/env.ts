/**
 * Leitura central das variáveis de ambiente.
 *
 * Só deve ser importado de código de servidor: `CLERK_SECRET_KEY` e
 * `SUPABASE_SERVICE_ROLE_KEY` nunca podem chegar ao bundle do navegador.
 */

export const env = {
  clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "",
  clerkSecretKey: process.env.CLERK_SECRET_KEY ?? "",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
} as const;

/** O Clerk só é montado quando as duas chaves existem. */
export const clerkConfigurado =
  env.clerkPublishableKey.length > 0 && env.clerkSecretKey.length > 0;

/** O acesso a dados exige URL do projeto e a service role. */
export const supabaseConfigurado =
  env.supabaseUrl.length > 0 && env.supabaseServiceRoleKey.length > 0;

export const appConfigurado = clerkConfigurado && supabaseConfigurado;

/** Lista o que falta, para a tela de configuração pendente. */
export function variaveisFaltando(): string[] {
  const faltando: string[] = [];
  if (!env.clerkPublishableKey) faltando.push("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY");
  if (!env.clerkSecretKey) faltando.push("CLERK_SECRET_KEY");
  if (!env.supabaseUrl) faltando.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!env.supabaseAnonKey) faltando.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  if (!env.supabaseServiceRoleKey) faltando.push("SUPABASE_SERVICE_ROLE_KEY");
  return faltando;
}
