import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";

import { clerkConfigurado } from "@/lib/env";

const rotaProtegida = createRouteMatcher(["/app(.*)", "/onboarding(.*)"]);

const protegerComClerk = clerkMiddleware(async (auth, request) => {
  if (rotaProtegida(request)) {
    await auth.protect();
  }
});

/**
 * Enquanto as chaves do Clerk não estiverem definidas, o middleware sai do
 * caminho: a landing e o design system continuam navegáveis e as rotas do app
 * mostram a tela de configuração pendente.
 */
export default function middleware(request: NextRequest, event: NextFetchEvent) {
  if (!clerkConfigurado) {
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
