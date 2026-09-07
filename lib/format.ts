const MOEDA = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const DECIMAL = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

const INTEIRO = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });

/** R$ 1.234,50 */
export function formatarMoeda(valor: number): string {
  return MOEDA.format(Number.isFinite(valor) ? valor : 0);
}

/** 1.234,5 — usado em gramas e macros */
export function formatarDecimal(valor: number): string {
  return DECIMAL.format(Number.isFinite(valor) ? valor : 0);
}

/** 1.234 — usado em calorias e contagens */
export function formatarInteiro(valor: number): string {
  return INTEIRO.format(Number.isFinite(valor) ? valor : 0);
}

/** 75% */
export function formatarPercentual(fracao: number): string {
  return `${INTEIRO.format((Number.isFinite(fracao) ? fracao : 0) * 100)}%`;
}
