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

// Assinatura ----------------------------------------------------------------

/** Só dígitos: o formulário aceita máscara, o servidor guarda limpo. */
const digitos = (valor: unknown) =>
  typeof valor === "string" ? valor.replace(/\D/g, "") : valor;

export const cpfCnpj = z.preprocess(
  digitos,
  z
    .string()
    .refine((v) => v.length === 11 || v.length === 14, "Informe um CPF ou CNPJ válido.")
);

export const cep = z.preprocess(
  digitos,
  z.string().length(8, "O CEP tem 8 dígitos.")
);

export const telefone = z.preprocess(
  digitos,
  z
    .string()
    .min(10, "Informe o DDD e o número.")
    .max(11, "Telefone acima do tamanho esperado.")
);

/** Dados do titular exigidos pelo Asaas para cobrar no cartão. */
const titularSchema = z.object({
  nome: z.string().trim().min(3, "Informe o nome completo."),
  email: z.email("Informe um e-mail válido."),
  cpf_cnpj: cpfCnpj,
  telefone,
  cep,
  numero_endereco: z
    .string()
    .trim()
    .min(1, "Informe o número do endereço.")
    .max(10, "Só o número, sem o complemento."),
});

export const planoSchema = z.enum(["mensal", "anual"], {
  error: "Escolha um dos planos.",
});

export const assinaturaPixSchema = z.object({
  plano: planoSchema,
  titular: titularSchema,
});

export type AssinaturaPixInput = z.infer<typeof assinaturaPixSchema>;

/**
 * O cartão não passa pelo nosso banco: estes campos só existem entre o
 * formulário e a chamada ao Asaas, dentro da mesma requisição.
 */
export const assinaturaCartaoSchema = assinaturaPixSchema.extend({
  cartao: z.object({
    nome_impresso: z.string().trim().min(3, "Informe o nome impresso no cartão."),
    numero: z.preprocess(
      digitos,
      z
        .string()
        .min(13, "Número de cartão incompleto.")
        .max(19, "Número de cartão acima do tamanho.")
    ),
    mes: z.preprocess(
      digitos,
      z.string().regex(/^(0[1-9]|1[0-2])$/, "Mês inválido.")
    ),
    ano: z.preprocess(
      digitos,
      z.string().regex(/^20\d{2}$/, "Use o ano com quatro dígitos.")
    ),
    cvv: z.preprocess(
      digitos,
      z.string().min(3, "CVV inválido.").max(4, "CVV inválido.")
    ),
  }),
});

export type AssinaturaCartaoInput = z.infer<typeof assinaturaCartaoSchema>;

// Pedidos -------------------------------------------------------------------

const textoOpcional = (max: number, rotulo: string) =>
  z
    .string()
    .trim()
    .max(max, `${rotulo} muito longo.`)
    .optional()
    .transform((v) => (v ? v : null));

export const situacaoPedidoSchema = z.enum(
  ["recebido", "em_producao", "pronto", "entregue", "cancelado"],
  { error: "Situação inválida." }
);

/**
 * O cliente vem de um jeito ou de outro: o id de alguém já cadastrado, ou os
 * dados de um cliente novo, criado junto com o pedido. Anotar o pedido não
 * pode exigir passar antes por uma tela de cadastro.
 */
const clienteDoPedidoSchema = z.union([
  z.object({ id: z.uuid("Cliente inválido.") }),
  z.object({
    nome: z
      .string()
      .trim()
      .min(2, "Informe o nome do cliente.")
      .max(120, "Nome muito longo."),
    telefone: textoOpcional(30, "Telefone"),
    endereco: textoOpcional(300, "Endereço"),
  }),
]);

export const itemDoPedidoSchema = z.object({
  descricao: z
    .string()
    .trim()
    .min(2, "Diga qual é a marmita.")
    .max(150, "Descrição muito longa."),
  quantidade: z
    .number({ error: "Informe a quantidade." })
    .int("Use um número inteiro.")
    .min(1, "Pelo menos 1.")
    .max(1000, "Máximo de 1.000 por item."),
  preco_unitario: z
    .number({ error: "Informe o preço." })
    .min(0, "Não pode ser negativo.")
    .max(10000, "Preço acima do limite aceito."),
});

export const pedidoSchema = z.object({
  id: z.uuid().optional(),
  cliente: clienteDoPedidoSchema,
  entrega_data: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Informe a data de entrega."),
  entrega_hora: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Hora inválida.")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  observacoes: textoOpcional(1000, "Observação"),
  itens: z
    .array(itemDoPedidoSchema)
    .min(1, "Adicione pelo menos uma marmita.")
    .max(30, "Máximo de 30 itens por pedido."),
});

export type PedidoInput = z.input<typeof pedidoSchema>;

export const mudarSituacaoSchema = z.object({
  id: z.uuid("Pedido inválido."),
  situacao: situacaoPedidoSchema,
});
