import { CtaFinal } from "@/components/landing/cta-final";
import { Hero } from "@/components/landing/hero";
import { SecaoComoFunciona } from "@/components/landing/secao-como-funciona";
import { SecaoDepoimentos } from "@/components/landing/secao-depoimentos";
import { SecaoFerramentas } from "@/components/landing/secao-ferramentas";
import { SecaoPerguntas } from "@/components/landing/secao-perguntas";
import { SecaoPlanos } from "@/components/landing/secao-planos";
import { SecaoProblema } from "@/components/landing/secao-problema";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";

export default function LandingPage() {
  return (
    <div className="texture-paper min-h-dvh bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <SecaoProblema />
        <SecaoFerramentas />
        <SecaoComoFunciona />
        <SecaoDepoimentos />
        <SecaoPlanos />
        <SecaoPerguntas />
        <CtaFinal />
      </main>
      <SiteFooter />
    </div>
  );
}
