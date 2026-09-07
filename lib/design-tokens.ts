/**
 * Espelho tipado dos tokens declarados em app/globals.css.
 * Serve à página /design-system e a qualquer documentação — não é
 * fonte de estilo em runtime: a fonte da verdade continua sendo o CSS.
 */

export type TokenDeCor = {
  nome: string;
  variavel: string;
  light: string;
  dark: string;
  uso: string;
};

export type GrupoDeCor = {
  titulo: string;
  descricao: string;
  tokens: TokenDeCor[];
};

export const GRUPOS_DE_COR: GrupoDeCor[] = [
  {
    titulo: "Superfícies",
    descricao:
      "O fundo é um off-white quente, nunca branco puro. O branco é reservado às superfícies elevadas, o que já cria hierarquia sem sombra.",
    tokens: [
      {
        nome: "background",
        variavel: "--background",
        light: "#FAFAF8",
        dark: "#0E100F",
        uso: "Fundo base da aplicação",
      },
      {
        nome: "surface",
        variavel: "--surface",
        light: "#FFFFFF",
        dark: "#161917",
        uso: "Cards, painéis e camadas flutuantes",
      },
      {
        nome: "surface-sunken",
        variavel: "--surface-sunken",
        light: "#F2F2EE",
        dark: "#121412",
        uso: "Recuos: cabeçalho de tabela, trilhos, campos travados",
      },
      {
        nome: "surface-hover",
        variavel: "--surface-hover",
        light: "#F5F5F1",
        dark: "#1C201D",
        uso: "Realce de hover em linhas e botões discretos",
      },
    ],
  },
  {
    titulo: "Texto",
    descricao:
      "Dois níveis bastam na maior parte das telas. O terceiro nível existe para textos de apoio que ainda precisam ser lidos com conforto.",
    tokens: [
      {
        nome: "foreground",
        variavel: "--foreground",
        light: "#12150F",
        dark: "#F2F3EF",
        uso: "Texto principal e títulos",
      },
      {
        nome: "muted-strong",
        variavel: "--muted-strong",
        light: "#4A4E47",
        dark: "#B9BDB4",
        uso: "Parágrafos de apoio dentro de blocos densos",
      },
      {
        nome: "muted",
        variavel: "--muted",
        light: "#6B6F68",
        dark: "#9A9E96",
        uso: "Rótulos, legendas e metadados",
      },
    ],
  },
  {
    titulo: "Linhas",
    descricao:
      "A borda de 1px é o principal recurso de separação do produto. Sombra só aparece em camada flutuante.",
    tokens: [
      {
        nome: "border",
        variavel: "--border",
        light: "#E4E4DF",
        dark: "#252925",
        uso: "Contorno padrão de cards, campos e divisórias",
      },
      {
        nome: "border-strong",
        variavel: "--border-strong",
        light: "#D2D2CA",
        dark: "#343A34",
        uso: "Hover, contornos de controle e estados de foco fraco",
      },
    ],
  },
  {
    titulo: "Marca",
    descricao:
      "O verde-floresta é a cor de ação. Aparece em botão primário, indicador de aba ativa e ícone da marca — e em pouco mais que isso.",
    tokens: [
      {
        nome: "primary",
        variavel: "--primary",
        light: "#123B2E",
        dark: "#2E7D5E",
        uso: "Ação principal, foco e sinalização de estado ativo",
      },
      {
        nome: "primary-soft",
        variavel: "--primary-soft",
        light: "#EAF0EC",
        dark: "#16241E",
        uso: "Fundo de badge e de bloco destacado da marca",
      },
      {
        nome: "primary-foreground",
        variavel: "--primary-foreground",
        light: "#F6FAF5",
        dark: "#05120C",
        uso: "Texto sobre o verde-floresta",
      },
    ],
  },
  {
    titulo: "Destaque",
    descricao:
      "O verde-limão é o único ponto de saturação alta do sistema. Reservado a progresso, badges e destaques pontuais — nunca a superfícies grandes ou botões.",
    tokens: [
      {
        nome: "accent",
        variavel: "--accent",
        light: "#A3E635",
        dark: "#A3E635",
        uso: "Preenchimento de barra de progresso e marcador de conquista",
      },
      {
        nome: "accent-soft",
        variavel: "--accent-soft",
        light: "#F0F9DD",
        dark: "#1E2A12",
        uso: "Fundo de badge de destaque",
      },
    ],
  },
  {
    titulo: "Semânticos",
    descricao:
      "Cores de significado. Cada uma tem par de fundo suave para compor alertas legíveis nos dois temas.",
    tokens: [
      {
        nome: "success",
        variavel: "--success",
        light: "#2E7D5E",
        dark: "#4FA37F",
        uso: "Confirmação, aula concluída, margem saudável",
      },
      {
        nome: "warning",
        variavel: "--warning",
        light: "#A9701A",
        dark: "#D5A144",
        uso: "Atenção: margem apertada, dado incompleto",
      },
      {
        nome: "destructive",
        variavel: "--destructive",
        light: "#A03327",
        dark: "#DD7D6D",
        uso: "Erro de validação e ações irreversíveis",
      },
    ],
  },
];

export type EscalaTipografica = {
  classe: string;
  nome: string;
  familia: "Fraunces" | "Inter";
  especificacao: string;
  uso: string;
  amostra: string;
};

export const ESCALA_TIPOGRAFICA: EscalaTipografica[] = [
  {
    classe: "t-display",
    nome: "Display",
    familia: "Fraunces",
    especificacao: "40 → 72px · entrelinha 1.02 · tracking −0.028em",
    uso: "Abertura da landing e de páginas de marca. Um por tela.",
    amostra: "Marmita fit dá dinheiro",
  },
  {
    classe: "t-h1",
    nome: "Título 1",
    familia: "Fraunces",
    especificacao: "30 → 44px · entrelinha 1.1",
    uso: "Título de página dentro do app",
    amostra: "Calculadora de precificação",
  },
  {
    classe: "t-h2",
    nome: "Título 2",
    familia: "Fraunces",
    especificacao: "22 → 28px · entrelinha 1.18",
    uso: "Abertura de seção e nome de módulo",
    amostra: "Módulo 2 · Precificação sem chute",
  },
  {
    classe: "t-h3",
    nome: "Título 3",
    familia: "Inter",
    especificacao: "17px · peso 600",
    uso: "Título de card e de aula",
    amostra: "Quanto custa realmente a sua marmita",
  },
  {
    classe: "t-lead",
    nome: "Linha de apoio",
    familia: "Inter",
    especificacao: "17 → 19px · entrelinha 1.6",
    uso: "Parágrafo logo abaixo de um título",
    amostra:
      "Você descobre o custo real por unidade antes de definir qualquer preço.",
  },
  {
    classe: "t-body",
    nome: "Corpo",
    familia: "Inter",
    especificacao: "15.5px · entrelinha 1.68",
    uso: "Texto corrido de aula e de descrição",
    amostra:
      "A margem que você aplica sobre um custo errado não é lucro: é prejuízo com atraso.",
  },
  {
    classe: "t-small",
    nome: "Apoio",
    familia: "Inter",
    especificacao: "13px · entrelinha 1.5",
    uso: "Legenda, dica de campo e metadado",
    amostra: "Valores por 100 g, base TACO",
  },
  {
    classe: "t-eyebrow",
    nome: "Sobrelinha",
    familia: "Inter",
    especificacao: "11px · caixa alta · tracking 0.14em",
    uso: "Assina a seção acima do título",
    amostra: "Ferramentas do dia a dia",
  },
  {
    classe: "t-metric",
    nome: "Métrica",
    familia: "Fraunces",
    especificacao: "28 → 38px · algarismos tabulares",
    uso: "Resultado de calculadora e número de destaque",
    amostra: "R$ 18,40",
  },
];

export const ESCALA_DE_ESPACO = [
  { token: "1", px: 4, uso: "Ajuste ótico" },
  { token: "2", px: 8, uso: "Rótulo e campo" },
  { token: "3", px: 12, uso: "Itens de uma mesma linha" },
  { token: "4", px: 16, uso: "Interno de componente compacto" },
  { token: "6", px: 24, uso: "Padding de card" },
  { token: "8", px: 32, uso: "Entre blocos de um card" },
  { token: "12", px: 48, uso: "Entre grupos de conteúdo" },
  { token: "16", px: 64, uso: "Entre seções no app" },
  { token: "24", px: 96, uso: "Entre seções na landing" },
] as const;

export const RAIOS = [
  { token: "rounded-sm", px: 8, uso: "Badge, checkbox, ícone pequeno" },
  { token: "rounded-md", px: 10, uso: "Item de menu e chip" },
  { token: "rounded-lg", px: 12, uso: "Padrão: botão, campo, card" },
  { token: "rounded-xl", px: 16, uso: "Painel grande e modal" },
  { token: "rounded-full", px: 9999, uso: "Avatar e trilho de progresso" },
] as const;
