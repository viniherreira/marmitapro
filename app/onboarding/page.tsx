import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Logo } from "@/components/brand/logo";
import { ConfiguracaoPendente } from "@/components/configuracao-pendente";
import { QuizDeOnboarding } from "@/components/onboarding/quiz";
import { ThemeToggle } from "@/components/theme-toggle";
import { garantirPerfil } from "@/lib/auth/perfil";
import { appConfigurado } from "@/lib/env";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vamos configurar o seu app",
  robots: { index: false, follow: false },
};

export default async function OnboardingPage() {
  if (!appConfigurado) {
    return <ConfiguracaoPendente />;
  }

  const perfil = await garantirPerfil();

  if (perfil.onboarding_concluido) {
    redirect("/app");
  }

  return (
    <div className="texture-paper flex min-h-dvh flex-col bg-background">
      <header className="flex items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="rounded-sm text-[15px]">
          <Logo />
        </Link>
        <ThemeToggle />
      </header>

      <div className="flex flex-1 items-center justify-center px-5 pb-20 pt-6 sm:px-8">
        <QuizDeOnboarding />
      </div>
    </div>
  );
}
