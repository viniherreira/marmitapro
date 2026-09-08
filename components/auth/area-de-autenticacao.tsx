"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

/**
 * Tempo que damos ao Clerk para montar o formulário antes de assumir que ele
 * não vai montar. Folgado de propósito: em conexão lenta o script do Clerk
 * demora, e um aviso prematuro seria pior que a espera.
 */
const ESPERA_ATE_DESISTIR_MS = 5000;

/**
 * Rede de segurança para as telas do Clerk.
 *
 * Os passos internos de login e cadastro moram em sub-rotas (`/entrar/factor-one`,
 * `/cadastro/verify-email-address`). Se o usuário recarrega a página ou volta a
 * ela mais tarde, a tentativa em andamento já não existe e o componente do Clerk
 * monta uma caixa vazia — no tema escuro isso é literalmente uma tela preta, sem
 * nem um botão para sair dali.
 *
 * Aqui observamos a caixa do Clerk: se ela continuar sem conteúdo, mostramos uma
 * saída de verdade. Como a checagem é pelo que foi realmente renderizado, um
 * fluxo que funciona nunca vê este aviso.
 */
export function AreaDeAutenticacao({
  voltarPara,
  children,
}: {
  voltarPara: string;
  children: React.ReactNode;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [semConteudo, setSemConteudo] = useState(false);

  useEffect(() => {
    const raiz = container.current;
    if (!raiz) return;

    const vazia = () => {
      const caixa = raiz.querySelector("[data-clerk-component]");
      return caixa !== null && caixa.childElementCount === 0;
    };

    let observador: MutationObserver | undefined;

    const armar = window.setTimeout(() => {
      setSemConteudo(vazia());

      // Se o Clerk montar depois — retomando a sessão, por exemplo — o aviso sai
      // de cena sozinho.
      observador = new MutationObserver(() => setSemConteudo(vazia()));
      observador.observe(raiz, { childList: true, subtree: true });
    }, ESPERA_ATE_DESISTIR_MS);

    return () => {
      window.clearTimeout(armar);
      observador?.disconnect();
    };
  }, []);

  return (
    <div ref={container}>
      {children}

      {semConteudo ? (
        <EmptyState
          icon={RotateCcw}
          title="Esta etapa expirou"
          description="O código de verificação vale por pouco tempo e esta tentativa não está mais valendo. Comece de novo — leva alguns segundos."
          action={
            <Button asChild variant="primary" size="sm">
              <Link href={voltarPara}>Recomeçar</Link>
            </Button>
          }
        />
      ) : null}
    </div>
  );
}
