import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Logotipo do MarmitaPRO.
 *
 * São dois arquivos, não um com filtro: o logotipo tem verde escuro, que
 * desaparece sobre fundo escuro. A variante clara troca o verde por um tom
 * quase branco e mantém o laranja, que funciona nos dois fundos.
 *
 * A troca é por CSS, com os dois `<Image>` no HTML e um escondido conforme o
 * tema. Decidir isso em JavaScript faria o logotipo piscar na cor errada até
 * a hidratação — logo errado no primeiro quadro é a pior primeira impressão
 * que um produto pode dar.
 */

const LARGURA_ORIGINAL = 920;
const ALTURA_ORIGINAL = 160;

export function Logo({
  className,
  variante = "auto",
}: {
  /** Altura do logotipo. Use utilitários de altura: `h-7`, `h-9`. */
  className?: string;
  /** `clara` força a versão para fundo escuro, como o painel do login. */
  variante?: "auto" | "clara";
}) {
  const dimensoes = cn("h-7 w-auto", className);

  if (variante === "clara") {
    return (
      <Image
        src="/marca/logotipo-claro.png"
        alt="MarmitaPRO"
        width={LARGURA_ORIGINAL}
        height={ALTURA_ORIGINAL}
        priority
        className={dimensoes}
      />
    );
  }

  return (
    <>
      <Image
        src="/marca/logotipo.png"
        alt="MarmitaPRO"
        width={LARGURA_ORIGINAL}
        height={ALTURA_ORIGINAL}
        priority
        className={cn(dimensoes, "dark:hidden")}
      />
      <Image
        src="/marca/logotipo-claro.png"
        alt=""
        aria-hidden="true"
        width={LARGURA_ORIGINAL}
        height={ALTURA_ORIGINAL}
        priority
        className={cn(dimensoes, "hidden dark:block")}
      />
    </>
  );
}

/**
 * Só o símbolo, para espaço apertado — barra inferior do celular, avatar,
 * qualquer lugar onde o nome por extenso não caberia legível.
 */
export function LogoMark({
  className,
  variante = "auto",
}: {
  className?: string;
  variante?: "auto" | "clara";
}) {
  const dimensoes = cn("size-7", className);

  if (variante === "clara") {
    return (
      <Image
        src="/marca/simbolo-claro.png"
        alt="MarmitaPRO"
        width={512}
        height={512}
        className={dimensoes}
      />
    );
  }

  return (
    <>
      <Image
        src="/marca/simbolo.png"
        alt="MarmitaPRO"
        width={512}
        height={512}
        className={cn(dimensoes, "dark:hidden")}
      />
      <Image
        src="/marca/simbolo-claro.png"
        alt=""
        aria-hidden="true"
        width={512}
        height={512}
        className={cn(dimensoes, "hidden dark:block")}
      />
    </>
  );
}
