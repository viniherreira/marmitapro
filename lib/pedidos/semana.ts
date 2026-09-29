/**
 * Datas dos pedidos.
 *
 * Tudo aqui trabalha com "YYYY-MM-DD" puro, sem hora e sem fuso, que é como
 * a entrega é gravada. A única pergunta que depende de fuso é "que dia é
 * hoje?", e ela é respondida no horário de Brasília: o servidor roda em UTC,
 * e às 22h de domingo em São Paulo já é segunda em UTC — o pedido cairia na
 * semana errada.
 */

const DIAS = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

export { hojeNoBrasil } from "@/lib/datas";

function comoData(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

function comoIso(data: Date): string {
  return data.toISOString().slice(0, 10);
}

export function dataValida(iso: string | undefined | null): iso is string {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const data = comoData(iso);
  return !Number.isNaN(data.getTime()) && comoIso(data) === iso;
}

export function somarDias(iso: string, dias: number): string {
  const data = comoData(iso);
  data.setUTCDate(data.getUTCDate() + dias);
  return comoIso(data);
}

/** A segunda-feira da semana que contém a data. */
export function inicioDaSemana(iso: string): string {
  const diaDaSemana = comoData(iso).getUTCDay(); // 0 = domingo
  const recuo = diaDaSemana === 0 ? 6 : diaDaSemana - 1;
  return somarDias(iso, -recuo);
}

export function fimDaSemana(inicio: string): string {
  return somarDias(inicio, 6);
}

/** "29/09" */
export function diaEMes(iso: string): string {
  const [, mes, dia] = iso.split("-");
  return `${dia}/${mes}`;
}

/** "Segunda, 29/09" */
export function rotuloDoDia(iso: string): string {
  return `${DIAS[comoData(iso).getUTCDay()]}, ${diaEMes(iso)}`;
}

/** "Seg 29/09" — versão curta para caber no cartão do pedido. */
export function rotuloCurtoDoDia(iso: string): string {
  return `${DIAS[comoData(iso).getUTCDay()].slice(0, 3)} ${diaEMes(iso)}`;
}

/** "29/09 a 05/10" */
export function rotuloDaSemana(inicio: string): string {
  return `${diaEMes(inicio)} a ${diaEMes(fimDaSemana(inicio))}`;
}

/** "12:00:00" do Postgres vira "12:00"; sem hora, nada. */
export function horaCurta(hora: string | null): string | null {
  return hora ? hora.slice(0, 5) : null;
}
