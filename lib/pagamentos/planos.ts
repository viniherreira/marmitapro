/**
 * Os dois planos vendidos, em número.
 *
 * Aqui é a fonte da verdade do preço: a landing formata a partir destes
 * valores e a assinatura no Asaas é criada com eles. Preço escrito à mão em
 * dois lugares vira preço divergente na primeira promoção.
 */

export type IdDePlano = "mensal" | "anual";

/** Ciclo no vocabulário do Asaas (campo `cycle` da assinatura). */
export type CicloAsaas = "MONTHLY" | "YEARLY";

/**
 * O mesmo ciclo no vocabulário do Pix Automático, que chama o anual de
 * ANNUALLY e não de YEARLY como a assinatura. Mandar o nome da assinatura
 * para a autorização faz o Asaas recusar a criação.
 */
export type FrequenciaPix = "MONTHLY" | "ANNUALLY";

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

/** "R$ 39" — inteiro, do jeito que a página de vendas anuncia. */
export function precoCurto(plano: PlanoDeCobranca): string {
  return `R$ ${plano.valor}`;
}
