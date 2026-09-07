import type { NextConfig } from "next";

// Desliga o modo keyless do Clerk de forma versionada. Sem isto, rodar em
// desenvolvimento sem chaves faz o Clerk provisionar uma instância temporária
// e gravar chaves no .env sozinho, deixando o app meio-configurado (Clerk
// ativo, Supabase não) e quebrando /app e /onboarding. Fica aqui, e não só no
// .env, para sobreviver a um clone limpo do repositório.
process.env.CLERK_ENABLE_KEYLESS ??= "false";

const nextConfig: NextConfig = {
  env: {
    CLERK_ENABLE_KEYLESS: process.env.CLERK_ENABLE_KEYLESS,
  },
};

export default nextConfig;
