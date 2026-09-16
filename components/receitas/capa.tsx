import Image from "next/image";

import type { ObjetivoReceita } from "@/types/database";
import { cn } from "@/lib/utils";

/**
 * Capa da receita.
 *
 * Com foto cadastrada, mostra a foto. Sem foto, desenha uma capa de marca —
 * verde e laranja tirados do próprio logotipo, com a seta do símbolo como
 * assinatura.
 *
 * A decisão de não usar foto de banco de imagens é do produto, não preguiça:
 * a trilha ensina que quem recebe algo diferente da foto não compra de novo.
 * Ilustrar "feijoada de lentilha" com a foto de outra feijoada seria o app
 * fazendo exatamente o que o curso manda não fazer.
 */

/** Ângulo e deslocamento vêm do nome, então cada receita tem a sua capa. */
function assinatura(semente: string) {
  let h = 0;
  for (let i = 0; i < semente.length; i++) {
    h = (h * 31 + semente.charCodeAt(i)) >>> 0;
  }
  return {
    angulo: 18 + (h % 26), // 18° a 43°
    deslocamento: 12 + ((h >> 5) % 30), // posição da faixa
    escala: 0.9 + ((h >> 11) % 25) / 100,
  };
}

/**
 * Um sistema só: o verde da marca no fundo, a faixa mudando por objetivo.
 * Três fundos diferentes fariam o cardápio parecer três produtos.
 */
const TRATAMENTO: Record<
  ObjetivoReceita,
  { fundo: string; faixa: string; rotulo: string }
> = {
  rica_proteina: {
    fundo: "linear-gradient(152deg, #0d6349 0%, #06291f 100%)",
    faixa: "var(--marca-laranja)",
    rotulo: "Rica em proteína",
  },
  low_carb: {
    // Menta em vez de branco puro: a faixa branca engolia o rótulo do rodapé.
    fundo: "linear-gradient(152deg, #0a5541 0%, #04201a 100%)",
    faixa: "#8fd9bb",
    rotulo: "Low carb",
  },
  economica: {
    fundo: "linear-gradient(152deg, #14503c 0%, #07271e 100%)",
    faixa: "#f5b544",
    rotulo: "Econômica",
  },
};

export function CapaDaReceita({
  nome,
  objetivo,
  imagemUrl,
  className,
  prioridade = false,
}: {
  nome: string;
  objetivo: ObjetivoReceita;
  imagemUrl?: string | null;
  className?: string;
  prioridade?: boolean;
}) {
  if (imagemUrl) {
    return (
      <div className={cn("relative overflow-hidden bg-surface-sunken", className)}>
        <Image
          src={imagemUrl}
          alt={`Foto da receita ${nome}`}
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
          priority={prioridade}
          className="object-cover"
        />
      </div>
    );
  }

  const { angulo, deslocamento, escala } = assinatura(nome);
  const tema = TRATAMENTO[objetivo];

  return (
    <div
      aria-hidden="true"
      className={cn("relative overflow-hidden", className)}
      style={{ background: tema.fundo }}
    >
      {/* Faixa diagonal — a mesma inclinação da seta do símbolo */}
      <span
        className="absolute inset-y-[-40%] w-[14%] opacity-90"
        style={{
          left: `${deslocamento}%`,
          background: tema.faixa,
          transform: `rotate(${angulo}deg)`,
        }}
      />
      <span
        className="absolute inset-y-[-40%] w-[4%] opacity-40"
        style={{
          left: `${deslocamento + 18}%`,
          background: tema.faixa,
          transform: `rotate(${angulo}deg)`,
        }}
      />

      {/* Símbolo da marca, discreto, na diagonal oposta */}
      <span
        className="absolute bottom-[-8%] right-[-6%] opacity-[0.14]"
        style={{ width: `${44 * escala}%` }}
      >
        <Image
          src="/marca/simbolo-claro.png"
          alt=""
          width={512}
          height={512}
          className="h-auto w-full"
        />
      </span>

      {/* Véu no rodapé: sem ele o rótulo cai em cima da faixa clara e some. */}
      <span className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent" />

      <span className="absolute bottom-3 left-4 text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-white/85">
        {tema.rotulo}
      </span>
    </div>
  );
}
