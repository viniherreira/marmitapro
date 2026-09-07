import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";

import { appConfigurado } from "@/lib/env";

const rotaProtegida = createRouteMatcher(["/app(.*)", "/onboarding(.*)"]);

const protegerComClerk = clerkMiddleware(async (auth, request) => {
  if (rotaProtegida(request)) {
    await auth.protect();
  }
});

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
