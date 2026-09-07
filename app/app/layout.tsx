import Link from "next/link";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

import { BarraInferior } from "@/components/app/barra-inferior";
import { Sidebar } from "@/components/app/sidebar";
import { Logo } from "@/components/brand/logo";
import { ConfiguracaoPendente } from "@/components/configuracao-pendente";
import { ThemeToggle } from "@/components/theme-toggle";
import { garantirPerfil } from "@/lib/auth/perfil";
import { carregarTrilha } from "@/lib/data/curso";
import { appConfigurado } from "@/lib/env";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!appConfigurado) {
    return <ConfiguracaoPendente />;
  }

  const perfil = await garantirPerfil();

  if (!perfil.onboarding_concluido) {
    redirect("/onboarding");
  }

  const trilha = await carregarTrilha(perfil.id);

  return (
    <div className="min-h-dvh bg-background">
      <Sidebar progressoDaTrilha={trilha.progresso}>
        <UserButton
          appearance={{ elements: { avatarBox: "size-8" } }}
          userProfileUrl="/app/conta"
        />
      </Sidebar>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/90 px-5 backdrop-blur-md lg:hidden">
          <Link href="/app" className="rounded-sm text-[15px]">
            <Logo />
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <UserButton appearance={{ elements: { avatarBox: "size-8" } }} />
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-5 pb-28 pt-8 sm:px-8 sm:pt-10 lg:pb-16">
          {children}
        </main>
      </div>

      <BarraInferior />
    </div>
  );
}
