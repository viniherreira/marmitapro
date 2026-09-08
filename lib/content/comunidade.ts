/**
 * Grupo de WhatsApp da comunidade.
 *
 * Mora aqui e não no banco porque é um endereço único do produto: muda
 * raramente e não pertence a nenhum usuário. A variável
 * `NEXT_PUBLIC_WHATSAPP_COMUNIDADE` sobrescreve, para trocar o convite pelo
 * painel da hospedagem sem mexer no código.
 */
const LINK_PADRAO = "";

export const linkDoGrupo = (
  process.env.NEXT_PUBLIC_WHATSAPP_COMUNIDADE || LINK_PADRAO
).trim();

/**
 * Validamos antes de mostrar: mandar o usuário para um link quebrado é pior do
 * que avisar que o convite ainda não está pronto.
 *
 * Aceita as três formas que o WhatsApp gera de verdade — convite de grupo,
 * link curto de conversa e o link longo de envio. Só https, porque http seria
 * degradar a conexão de quem clica.
 */
const FORMATOS_ACEITOS = [
  /^https:\/\/chat\.whatsapp\.com\/[\w-]+$/, // convite de grupo
  /^https:\/\/wa\.me\/\d{8,15}(\?.*)?$/, // conversa direta
  /^https:\/\/api\.whatsapp\.com\/send\?.*$/, // link longo de envio
];

export const grupoConfigurado = FORMATOS_ACEITOS.some((formato) =>
  formato.test(linkDoGrupo)
);

/** O que a pessoa encontra lá dentro. Define expectativa antes de entrar. */
export const O_QUE_ROLA = [
  {
    titulo: "Preço praticado por região",
    texto:
      "O que dá para cobrar em São Paulo não é o que dá para cobrar no interior. Aqui a conta sai do abstrato.",
  },
  {
    titulo: "Fornecedor e compra em conjunto",
    texto:
      "Indicação de atacado, embalagem e proteína — e gente juntando pedido para chegar em preço de volume.",
  },
  {
    titulo: "Cardápio da semana",
    texto:
      "Quem já está vendendo mostra o que montou, o que saiu e o que encalhou. Ideia pronta, testada por outra pessoa.",
  },
  {
    titulo: "Dúvida travada",
    texto:
      "Aquela pergunta que não cabe numa aula: cliente sumiu, marmita voltou, entregador atrasou. Pergunte.",
  },
] as const;

/** Combinados do grupo. Curtos de propósito — regra longa ninguém lê. */
export const COMBINADOS = [
  "Sem corrente, sem divulgação de outro curso e sem link de indicação.",
  "Preço e fornecedor se compartilham para ajudar, não para copiar cardápio inteiro.",
  "Foto de marmita é bem-vinda. Cobrança de resposta imediata, não.",
] as const;
