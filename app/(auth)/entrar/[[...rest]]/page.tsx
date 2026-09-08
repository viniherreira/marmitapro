import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";

import { AreaDeAutenticacao } from "@/components/auth/area-de-autenticacao";
import { ConfiguracaoPendente } from "@/components/configuracao-pendente";
import { clerkConfigurado } from "@/lib/env";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesse a sua conta do MarmitaPRO.",
};

export default function EntrarPage() {
  if (!clerkConfigurado) {
    return <ConfiguracaoPendente compacto />;
  }

  return (
    <AreaDeAutenticacao voltarPara="/entrar">
      <SignIn
        routing="path"
        path="/entrar"
        signUpUrl="/cadastro"
        fallbackRedirectUrl="/onboarding"
      />
    </AreaDeAutenticacao>
  );
}
