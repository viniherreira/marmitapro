import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export default function NaoEncontrada() {
  return (
    <div className="texture-paper flex min-h-dvh flex-col items-center justify-center bg-background px-5 text-center">
      <Logo className="text-[15px]" />
      <p className="t-eyebrow mt-12">Erro 404</p>
      <h1 className="t-h1 mt-4 max-w-lg">
        Essa página saiu do cardápio.
      </h1>
      <p className="t-lead mt-4 max-w-md">
        O endereço não existe ou o conteúdo foi movido.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/app">Ir para o painel</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/">Voltar para o início</Link>
        </Button>
      </div>
    </div>
  );
}
