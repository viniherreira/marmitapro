/**
 * Leitura central das variáveis de ambiente.
 *
 * Só deve ser importado de código de servidor: `CLERK_SECRET_KEY` e
 * `SUPABASE_SERVICE_ROLE_KEY` nunca podem chegar ao bundle do navegador.
 */

/**
 * Valores de exemplo do `.env.example`. Ferramentas externas (como o modo
 * keyless do Clerk) podem gerar um `.env.local` copiando esses placeholders;
 * tratá-los como "ausentes" evita o app se achar configurado pela metade.
 */
const PLACEHOLDERS = new Set<string>([
  "pk_test_troque_por_sua_chave",
  "sk_test_troque_por_sua_chave",
  "https://seu-projeto.supabase.co",
  "troque_pela_anon_key",
  "troque_pela_service_role_key",
]);

function valor(nome: string): string {
  const bruto = process.env[nome]?.trim() ?? "";
  if (bruto === "" || PLACEHOLDERS.has(bruto)) return "";
  // qualquer coisa que ainda comece com "troque_" é placeholder editado
  if (bruto.startsWith("troque_")) return "";
  return bruto;
}

export const env = {
  clerkPublishableKey: valor("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"),
  clerkSecretKey: valor("CLERK_SECRET_KEY"),
  supabaseUrl: valor("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: valor("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  supabaseServiceRoleKey: valor("SUPABASE_SERVICE_ROLE_KEY"),
} as const;

/** O Clerk só é montado quando as duas chaves existem e são reais. */
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
