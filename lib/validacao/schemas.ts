import { z } from "zod";

import { MARGEM_MAXIMA } from "@/lib/calculos/precificacao";

/** Aceita "12,50" e "12.50" — o usuário digita como fala. */
const numeroBR = z.preprocess((valor) => {
  if (typeof valor === "number") return valor;
  if (typeof valor !== "string") return valor;
  const limpo = valor.trim().replace(/\./g, "").replace(",", ".");
  if (limpo === "") return undefined;
  const convertido = Number(limpo);
  return Number.isNaN(convertido) ? valor : convertido;
}, z.number());

export const dinheiro = numeroBR.pipe(
  z
    .number()
    .min(0, "Não pode ser negativo.")
    .max(100000, "Valor acima do limite aceito.")
);

export const gramas = numeroBR.pipe(
  z
    .number()
    .positive("Informe uma quantidade maior que zero.")
    .max(100000, "Máximo de 100.000 g por ingrediente.")
);

// Onboarding ----------------------------------------------------------------

export const respostasOnboardingSchema = z.object({
  situacao: z.enum(["comecando", "ja_vendo", "escalando"]),
  horas_por_semana: z.enum(["ate_5", "de_5_a_15", "de_15_a_30", "acima_de_30"]),
  meta_de_renda: z.enum([
    "ate_1000",
    "de_1000_a_3000",
    "de_3000_a_6000",
    "acima_de_6000",
  ]),
  precificacao: z.enum(["nao_sei", "mais_ou_menos", "sei_calcular"]),
});

export type RespostasOnboardingInput = z.infer<typeof respostasOnboardingSchema>;

// Progresso -----------------------------------------------------------------

export const alternarProgressoSchema = z.object({
  lessonId: z.uuid("Aula inválida."),
  concluida: z.boolean(),
});

// Calculadora de macros -----------------------------------------------------

export const itemDeCalculoSchema = z.object({
  ingredient_id: z.uuid(),
  nome: z.string().min(1).max(160),
  gramas,
});

export const salvarCalculoSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, "Dê um nome com pelo menos 2 caracteres.")
    .max(120, "Nome muito longo."),
  porcoes: z.coerce
    .number()
    .int("Use um número inteiro de porções.")
    .min(1, "Mínimo de 1 porção.")
    .max(200, "Máximo de 200 porções."),
  itens: z
    .array(itemDeCalculoSchema)
    .min(1, "Adicione ao menos um ingrediente.")
    .max(60, "Máximo de 60 ingredientes por receita."),
});

export type SalvarCalculoInput = z.infer<typeof salvarCalculoSchema>;

// Calculadora de precificação -----------------------------------------------

export const cenarioSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, "Dê um nome com pelo menos 2 caracteres.")
    .max(120, "Nome muito longo."),
  custo_ingredientes: dinheiro,
  custo_embalagem: dinheiro,
  custo_energia: dinheiro,
  minutos_mao_de_obra: numeroBR.pipe(
    z.number().min(0, "Não pode ser negativo.").max(600, "Máximo de 600 minutos.")
  ),
  valor_hora: dinheiro,
  margem_desejada: numeroBR.pipe(
    z
      .number()
      .min(0, "Não pode ser negativa.")
      .max(MARGEM_MAXIMA, "A margem precisa ser menor que 95%.")
  ),
  volume_mensal: z.coerce
    .number()
    .int("Use um número inteiro de marmitas.")
    .min(0, "Não pode ser negativo.")
    .max(100000, "Volume acima do limite aceito."),
});

export type CenarioInput = z.infer<typeof cenarioSchema>;

/**
 * Versão do schema usada no formulário. Os campos numéricos chegam já como
 * número (inputs do tipo number), e a margem é digitada em pontos percentuais
 * — é assim que a pessoa pensa: "quero 45 por cento".
 */
const numeroDoFormulario = (max: number, rotulo: string) =>
  z
    .number({ error: `Informe ${rotulo}.` })
    .min(0, "Não pode ser negativo.")
    .max(max, "Valor acima do limite aceito.");

export const cenarioFormSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, "Dê um nome com pelo menos 2 caracteres.")
    .max(120, "Nome muito longo."),
  custo_ingredientes: numeroDoFormulario(100000, "o custo dos ingredientes"),
  custo_embalagem: numeroDoFormulario(100000, "o custo da embalagem"),
  custo_energia: numeroDoFormulario(100000, "o rateio de gás e energia"),
  minutos_mao_de_obra: numeroDoFormulario(600, "os minutos de mão de obra"),
  valor_hora: numeroDoFormulario(100000, "o valor da sua hora"),
  margem_percentual: z
    .number({ error: "Informe a margem desejada." })
    .min(0, "Não pode ser negativa.")
    .max(95, "A margem precisa ser menor que 95%."),
  volume_mensal: z
    .number({ error: "Informe o volume mensal." })
    .int("Use um número inteiro de marmitas.")
    .min(0, "Não pode ser negativo.")
    .max(100000, "Volume acima do limite aceito."),
});

export type CenarioFormInput = z.infer<typeof cenarioFormSchema>;

export const removerPorIdSchema = z.object({ id: z.uuid("Registro inválido.") });
