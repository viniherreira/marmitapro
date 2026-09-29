/**
 * Datas no calendário de quem usa o app: o horário de Brasília.
 *
 * O servidor da Vercel roda em UTC. Das 21h à meia-noite em São Paulo ele já
 * está no dia seguinte, e qualquer "hoje" calculado com `new Date()` erraria
 * o dia — a cobrança marcada para amanhã, o pedido na semana errada, o acesso
 * cortado três horas antes.
 */

const FUSO = "America/Sao_Paulo";

/** Hoje, no horário de Brasília, em "YYYY-MM-DD". */
export function hojeNoBrasil(): string {
  // en-CA formata como YYYY-MM-DD, que é exatamente o que precisamos.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: FUSO,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/**
 * Soma meses a uma data "YYYY-MM-DD", segurando no último dia do mês quando
 * o dia não existe: 31/01 + 1 mês é 28/02 (ou 29), e não 03/03.
 */
export function somarMeses(iso: string, meses: number): string {
  const [ano, mes, dia] = iso.split("-").map(Number);
  const alvo = new Date(Date.UTC(ano, mes - 1 + meses, 1));
  const ultimoDia = new Date(
    Date.UTC(alvo.getUTCFullYear(), alvo.getUTCMonth() + 1, 0)
  ).getUTCDate();
  alvo.setUTCDate(Math.min(dia, ultimoDia));
  return alvo.toISOString().slice(0, 10);
}
