import type { Ingrediente } from "@/types/database";

/** O que a calculadora precisa saber de um ingrediente. Valores por 100 g. */
export type BaseNutricional = Pick<
  Ingrediente,
  | "kcal"
  | "proteina_g"
  | "carboidrato_g"
  | "gordura_g"
  | "fibra_g"
  | "sodio_mg"
  | "preco_medio_kg"
>;

export type ItemPesado = {
  gramas: number;
  base: BaseNutricional;
};

export type Totais = {
  kcal: number;
  proteina: number;
  carboidrato: number;
  gordura: number;
  /** Fibra alimentar e sódio são obrigatórios na tabela nutricional (RDC 429/2020). */
  fibra: number;
  sodio: number;
  custo: number;
  pesoTotal: number;
};

const ZERADO: Totais = {
  kcal: 0,
  proteina: 0,
  carboidrato: 0,
  gordura: 0,
  fibra: 0,
  sodio: 0,
  custo: 0,
  pesoTotal: 0,
};

/**
 * Soma os valores nutricionais e o custo de uma lista de ingredientes pesados.
 * A tabela guarda valores por 100 g e o preço por quilo — as duas conversões
 * ficam aqui para não se repetirem em nenhuma tela.
 */
export function somarTotais(itens: ItemPesado[]): Totais {
  return itens.reduce<Totais>((acumulado, item) => {
    const gramas = Number.isFinite(item.gramas) ? Math.max(item.gramas, 0) : 0;
    const fator = gramas / 100;

    return {
      kcal: acumulado.kcal + Number(item.base.kcal) * fator,
      proteina: acumulado.proteina + Number(item.base.proteina_g) * fator,
      carboidrato:
        acumulado.carboidrato + Number(item.base.carboidrato_g) * fator,
      gordura: acumulado.gordura + Number(item.base.gordura_g) * fator,
      fibra: acumulado.fibra + Number(item.base.fibra_g) * fator,
      sodio: acumulado.sodio + Number(item.base.sodio_mg) * fator,
      custo: acumulado.custo + (Number(item.base.preco_medio_kg) / 1000) * gramas,
      pesoTotal: acumulado.pesoTotal + gramas,
    };
  }, ZERADO);
}

/** Divide os totais pelo número de porções. Porção zero devolve zeros. */
export function dividirPorPorcoes(totais: Totais, porcoes: number): Totais {
  const divisor = porcoes > 0 ? porcoes : 1;

  return {
    kcal: totais.kcal / divisor,
    proteina: totais.proteina / divisor,
    carboidrato: totais.carboidrato / divisor,
    gordura: totais.gordura / divisor,
    fibra: totais.fibra / divisor,
    sodio: totais.sodio / divisor,
    custo: totais.custo / divisor,
    pesoTotal: totais.pesoTotal / divisor,
  };
}

/**
 * Distribuição calórica por macronutriente, útil para mostrar o perfil da
 * receita. Usa os fatores de Atwater: 4 kcal/g para proteína e carboidrato,
 * 9 kcal/g para gordura.
 */
export function distribuicaoCalorica(totais: Totais): {
  proteina: number;
  carboidrato: number;
  gordura: number;
} {
  const kcalProteina = totais.proteina * 4;
  const kcalCarboidrato = totais.carboidrato * 4;
  const kcalGordura = totais.gordura * 9;
  const soma = kcalProteina + kcalCarboidrato + kcalGordura;

  if (soma <= 0) {
    return { proteina: 0, carboidrato: 0, gordura: 0 };
  }

  return {
    proteina: kcalProteina / soma,
    carboidrato: kcalCarboidrato / soma,
    gordura: kcalGordura / soma,
  };
}
