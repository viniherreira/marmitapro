/**
 * Precificação de marmita.
 *
 * A margem trabalhada aqui é sempre **margem sobre o preço de venda**, não
 * markup. É a distinção que a aula "Margem, markup e a conta que a maioria
 * erra" explica, e o resultado devolve as duas leituras para não restar
 * dúvida.
 */

export type EntradaDePrecificacao = {
  custoIngredientes: number;
  custoEmbalagem: number;
  custoEnergia: number;
  minutosMaoDeObra: number;
  valorHora: number;
  /** Fração entre 0 e 0,95. 0,45 significa 45% do preço final. */
  margemDesejada: number;
  volumeMensal: number;
};

export type EtapaDoCalculo = {
  rotulo: string;
  formula: string;
  valor: number;
  destaque?: boolean;
};

export type ResultadoDePrecificacao = {
  custoMaoDeObra: number;
  custoTotal: number;
  precoSugerido: number;
  lucroPorUnidade: number;
  markup: number;
  margemReal: number;
  faturamentoMensal: number;
  custoMensal: number;
  lucroMensal: number;
  etapas: EtapaDoCalculo[];
  alerta: "saudavel" | "apertada" | "prejuizo";
};

/** Acima disso a fórmula da margem explode; é o teto aceito pelo formulário. */
export const MARGEM_MAXIMA = 0.95;

/** Abaixo disso um imprevisto de custo apaga o lucro. */
export const MARGEM_MINIMA_SAUDAVEL = 0.3;

function saneado(valor: number): number {
  return Number.isFinite(valor) && valor > 0 ? valor : 0;
}

export function calcularPrecificacao(
  entrada: EntradaDePrecificacao
): ResultadoDePrecificacao {
  const custoIngredientes = saneado(entrada.custoIngredientes);
  const custoEmbalagem = saneado(entrada.custoEmbalagem);
  const custoEnergia = saneado(entrada.custoEnergia);
  const minutos = saneado(entrada.minutosMaoDeObra);
  const valorHora = saneado(entrada.valorHora);
  const volumeMensal = Math.floor(saneado(entrada.volumeMensal));

  const margem = Math.min(
    Math.max(Number.isFinite(entrada.margemDesejada) ? entrada.margemDesejada : 0, 0),
    MARGEM_MAXIMA
  );

  const custoMaoDeObra = (minutos / 60) * valorHora;
  const custoTotal =
    custoIngredientes + custoEmbalagem + custoEnergia + custoMaoDeObra;

  const precoSugerido = custoTotal / (1 - margem);
  const lucroPorUnidade = precoSugerido - custoTotal;

  const markup = custoTotal > 0 ? precoSugerido / custoTotal : 0;
  const margemReal = precoSugerido > 0 ? lucroPorUnidade / precoSugerido : 0;

  const faturamentoMensal = precoSugerido * volumeMensal;
  const custoMensal = custoTotal * volumeMensal;
  const lucroMensal = lucroPorUnidade * volumeMensal;

  const etapas: EtapaDoCalculo[] = [
    {
      rotulo: "Ingredientes da receita",
      formula: "informado por você",
      valor: custoIngredientes,
    },
    {
      rotulo: "Embalagem e etiqueta",
      formula: "informado por você",
      valor: custoEmbalagem,
    },
    {
      rotulo: "Gás e energia rateados",
      formula: "informado por você",
      valor: custoEnergia,
    },
    {
      rotulo: "Mão de obra",
      formula: `${minutos.toLocaleString("pt-BR")} min ÷ 60 × valor da hora`,
      valor: custoMaoDeObra,
    },
    {
      rotulo: "Custo real por unidade",
      formula: "soma das quatro linhas acima",
      valor: custoTotal,
      destaque: true,
    },
    {
      rotulo: "Preço de venda sugerido",
      formula: `custo ÷ (1 − ${margem.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      })})`,
      valor: precoSugerido,
      destaque: true,
    },
    {
      rotulo: "Lucro por marmita",
      formula: "preço sugerido − custo real",
      valor: lucroPorUnidade,
      destaque: true,
    },
  ];

  const alerta =
    custoTotal <= 0
      ? "apertada"
      : margemReal <= 0
        ? "prejuizo"
        : margemReal < MARGEM_MINIMA_SAUDAVEL
          ? "apertada"
          : "saudavel";

  return {
    custoMaoDeObra,
    custoTotal,
    precoSugerido,
    lucroPorUnidade,
    markup,
    margemReal,
    faturamentoMensal,
    custoMensal,
    lucroMensal,
    etapas,
    alerta,
  };
}

/** Caminho inverso: a partir de um preço praticado, qual é a margem real. */
export function margemDeUmPreco(preco: number, custo: number): number {
  if (!Number.isFinite(preco) || preco <= 0) return 0;
  return (preco - custo) / preco;
}
