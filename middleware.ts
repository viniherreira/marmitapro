import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";

import { appConfigurado } from "@/lib/env";

const rotaProtegida = createRouteMatcher(["/app(.*)", "/onboarding(.*)"]);

/**
 * Tolerância a relógio dessincronizado, só em desenvolvimento.
 *
 * O Clerk assina o token com a hora do servidor dele. Se o relógio da máquina
 * estiver alguns segundos atrasado, o token parece "emitido no futuro", a
 * sessão é recusada e o handshake entra em laço — o componente de login fica
 * em branco e o passo do código de verificação nunca aparece.
 *
 * Em produção mantemos o padrão do Clerk: afrouxar a validação de tempo num
 * servidor com relógio sincronizado só ampliaria a janela de reuso de token.
 */
const TOLERANCIA_DE_RELOGIO_MS =
  process.env.NODE_ENV === "production" ? undefined : 60_000;

const protegerComClerk = clerkMiddleware(
  async (auth, request) => {
    if (rotaProtegida(request)) {
      await auth.protect();
    }
  },
  { clockSkewInMs: TOLERANCIA_DE_RELOGIO_MS }
);

/**
 * A proteção de rota só entra quando o app está inteiramente configurado —
 * Clerk e Supabase, com chaves reais. Enquanto faltar qualquer credencial, ou
 * enquanto houver só placeholders, o middleware sai do caminho e as rotas do
 * app renderizam a tela de "Configuração pendente" em vez de exigir login
 * contra uma instância que ainda não está pronta.
 */
export default function middleware(request: NextRequest, event: NextFetchEvent) {
  if (!appConfigurado) {
    return NextResponse.next();
  }

  return protegerComClerk(request, event);
}

export const config = {
  matcher: [
    // tudo, menos arquivos estáticos e internos do Next
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
