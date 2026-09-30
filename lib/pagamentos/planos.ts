/**
 * Os planos vendidos, em número.
 *
 * Aqui é a fonte da verdade do preço: a landing formata a partir destes
 * valores e a assinatura no Asaas é criada com eles. Preço escrito à mão em
 * dois lugares vira preço divergente na primeira promoção.
 */

export type IdDePlano = "basico" | "mensal" | "anual";

/** Ciclo no vocabulário do Asaas (campo `cycle` da assinatura). */
export type CicloAsaas = "MONTHLY" | "YEARLY";

/**
 * O mesmo ciclo no vocabulário do Pix Automático, que chama o anual de
 * ANNUALLY e não de YEARLY como a assinatura. Mandar o nome da assinatura
 * para a autorização faz o Asaas recusar a criação.
 */
export type FrequenciaPix = "MONTHLY" | "ANNUALLY";

/**
 * Menor valor que o Asaas aceita emitir em boleto. Cartão e Pix aceitam a
 * partir de R$ 5; abaixo de R$ 10, o boleto é recusado na criação.
 */
export const VALOR_MINIMO_DO_BOLETO = 10;

export type PlanoDeCobranca = {
  id: IdDePlano;
  nome: string;
  valor: number;
  ciclo: CicloAsaas;
  frequenciaPix: FrequenciaPix;
  /** Meses entre um débito e o seguinte: define o início da recorrência. */
  mesesPorCiclo: number;
  /** Quantos dias de acesso cada pagamento libera, com folga. */
  diasDeAcesso: number;
  descricaoNaFatura: string;
};

export const PLANOS_DE_COBRANCA: Record<IdDePlano, PlanoDeCobranca> = {
  basico: {
    id: "basico",
    nome: "Básico",
    valor: 5,
    ciclo: "MONTHLY",
    frequenciaPix: "MONTHLY",
    mesesPorCiclo: 1,
    diasDeAcesso: 33,
    descricaoNaFatura: "MarmitaPRO — plano básico",
  },
  mensal: {
    id: "mensal",
    nome: "Mensal",
    valor: 39,
    ciclo: "MONTHLY",
    frequenciaPix: "MONTHLY",
    mesesPorCiclo: 1,
    // 30 do ciclo + 3 de folga: o acesso não pode cair no intervalo entre o
    // vencimento e a confirmação do pagamento seguinte.
    diasDeAcesso: 33,
    descricaoNaFatura: "MarmitaPRO — plano mensal",
  },
  anual: {
    id: "anual",
    nome: "Anual",
    valor: 290,
    ciclo: "YEARLY",
    frequenciaPix: "ANNUALLY",
    mesesPorCiclo: 12,
    diasDeAcesso: 368,
    descricaoNaFatura: "MarmitaPRO — plano anual",
  },
};

export const IDS_DE_PLANO = Object.keys(PLANOS_DE_COBRANCA) as IdDePlano[];

export function planoPorId(id: string): PlanoDeCobranca | null {
  return PLANOS_DE_COBRANCA[id as IdDePlano] ?? null;
}

/**
 * Se o plano pode ser pago em boleto. Sai do valor, e não de uma marcação no
 * plano: se o preço mudar, a regra acompanha sozinha.
 */
export function aceitaBoleto(plano: PlanoDeCobranca): boolean {
  return plano.valor >= VALOR_MINIMO_DO_BOLETO;
}

/** O plano mais barato: é o preço que o convite para assinar anuncia. */
export function planoMaisBarato(): PlanoDeCobranca {
  return Object.values(PLANOS_DE_COBRANCA).reduce((a, b) =>
    b.valor < a.valor ? b : a
  );
}

/** "R$ 39" — inteiro, do jeito que a página de vendas anuncia. */
export function precoCurto(plano: PlanoDeCobranca): string {
  return `R$ ${plano.valor}`;
}
