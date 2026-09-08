import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";

import { AreaDeAutenticacao } from "@/components/auth/area-de-autenticacao";
import { ConfiguracaoPendente } from "@/components/configuracao-pendente";
import { clerkConfigurado } from "@/lib/env";

export const metadata: Metadata = {
  title: "Criar conta",
  description: "Crie a sua conta e comece a montar o seu negócio de marmitas.",
};

export default function CadastroPage() {
  if (!clerkConfigurado) {
    return <ConfiguracaoPendente compacto />;
  }

  return (
    <AreaDeAutenticacao voltarPara="/cadastro">
      <SignUp
        routing="path"
        path="/cadastro"
        signInUrl="/entrar"
        fallbackRedirectUrl="/onboarding"
      />
    </AreaDeAutenticacao>
  );
}
