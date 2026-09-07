import {
  BookOpen,
  Calculator,
  ClipboardList,
  GraduationCap,
  Receipt,
  Scale,
  type LucideIcon,
} from "lucide-react";

/**
 * Conteúdo da página de vendas. Fica fora dos componentes para que a
 * copy possa ser revisada sem tocar em layout.
 */

export const PROMESSA = {
  sobrelinha: "Trilha + ferramentas, no mesmo app",
  titulo: "Você sabe cozinhar. Falta saber precificar.",
  apoio:
    "MarmitaPRO é a trilha prática e as ferramentas de operação para montar e tocar um negócio de marmitas fit — de calcular macro a fechar o preço que dá lucro.",
  garantias: [
    "Sem cartão para começar",
    "7 dias de garantia",
    "Feito para o Brasil",
  ],
} as const;

/** Demonstração de custo exibida no herói — os números fecham entre si. */
export const FICHA_DO_HEROI = {
  receita: "Frango grelhado com arroz integral e brócolis",
  porcao: "450 g",
  custos: [
    { rotulo: "Ingredientes", valor: 6.8 },
    { rotulo: "Embalagem e etiqueta", valor: 1.2 },
    { rotulo: "Gás e energia", valor: 0.45 },
    { rotulo: "Mão de obra · 12 min", valor: 2.4 },
  ],
  margem: 1,
  macros: [
    { rotulo: "Proteína", valor: "42 g" },
    { rotulo: "Carboidrato", valor: "58 g" },
    { rotulo: "Gordura", valor: "9 g" },
    { rotulo: "Calorias", valor: "498 kcal" },
  ],
} as const;

export const CUSTO_TOTAL_HEROI = FICHA_DO_HEROI.custos.reduce(
  (total, item) => total + item.valor,
  0
);
export const PRECO_HEROI = CUSTO_TOTAL_HEROI * (1 + FICHA_DO_HEROI.margem);
export const LUCRO_HEROI = PRECO_HEROI - CUSTO_TOTAL_HEROI;

export type Dor = { numero: string; titulo: string; texto: string };

export const DORES: Dor[] = [
  {
    numero: "01",
    titulo: "Você cobra o que o vizinho cobra",
    texto:
      "Preço copiado do concorrente é preço sem base. Se o custo dele é outro, o seu lucro vira prejuízo sem você perceber.",
  },
  {
    numero: "02",
    titulo: "A sua hora de trabalho não entra na conta",
    texto:
      "Comprar, cozinhar, montar, higienizar e entregar leva tempo. Fora da planilha, esse tempo sai do seu bolso todo mês.",
  },
  {
    numero: "03",
    titulo: "O cliente pergunta os macros e você chuta",
    texto:
      "Quem compra marmita fit compara rótulo. Sem ficha nutricional, você perde a venda para quem tem — mesmo cozinhando melhor.",
  },
  {
    numero: "04",
    titulo: "O curso que você comprou virou PDF parado",
    texto:
      "Aula solta ensina a teoria e some. O que falta é a ferramenta aberta na hora de montar o cardápio da semana.",
  },
];

export type Funcionalidade = {
  id: string;
  icone: LucideIcon;
  sobrelinha: string;
  titulo: string;
  texto: string;
  itens: string[];
};

export const FUNCIONALIDADES: Funcionalidade[] = [
  {
    id: "precificacao",
    icone: Calculator,
    sobrelinha: "Calculadora de precificação",
    titulo: "O preço aparece com a conta aberta",
    texto:
      "Você lança ingredientes, embalagem, gás, o tempo gasto e o valor da sua hora. O app devolve o custo real por unidade, o preço sugerido, o lucro por marmita e o faturamento projetado — mostrando cada etapa do cálculo, para você aprender a fazer sozinho.",
    itens: [
      "Custo unitário real, incluindo mão de obra",
      "Preço sugerido pela margem que você definir",
      "Projeção de faturamento por volume mensal",
      "Cenários salvos para comparar lado a lado",
    ],
  },
  {
    id: "macros",
    icone: Scale,
    sobrelinha: "Calculadora de macros",
    titulo: "Ficha nutricional em minutos, não em planilha",
    texto:
      "Monte a receita somando ingredientes em gramas. Calorias, proteínas, carboidratos e gorduras saem no total e por porção, com o número de porções configurável. Salve e a ficha fica pronta para o rótulo e para responder o cliente.",
    itens: [
      "Base com mais de 60 alimentos da cozinha brasileira",
      "Total da receita e valor por porção",
      "Receita salva com ficha e custo estimado",
    ],
  },
  {
    id: "trilha",
    icone: GraduationCap,
    sobrelinha: "Trilha do curso",
    titulo: "Do zero ao primeiro cliente, em ordem",
    texto:
      "Cinco módulos que seguem a ordem real de quem monta o negócio: estruturar, precificar, divulgar no bairro, entregar sem estragar e fazer o cliente voltar. Cada aula marca progresso e aponta a ferramenta que resolve aquele passo.",
    itens: [
      "Começando do zero · Precificação · Marketing local",
      "Logística e entrega · Atendimento e fidelização",
      "Progresso salvo por aula, retoma de onde parou",
    ],
  },
  {
    id: "receitas",
    icone: BookOpen,
    sobrelinha: "Banco de receitas",
    titulo: "Cardápio pronto para vender",
    texto:
      "Receitas completas com modo de preparo, ficha nutricional e custo estimado, filtradas pelo objetivo que o seu cliente pede: low carb, rica em proteína ou econômica.",
    itens: [
      "Busca por nome e ingrediente",
      "Filtro por objetivo comercial",
      "Custo estimado por porção em cada receita",
    ],
  },
];

export type Passo = { numero: string; titulo: string; texto: string };

export const PASSOS: Passo[] = [
  {
    numero: "01",
    titulo: "Responda quatro perguntas",
    texto:
      "Em menos de um minuto o app entende se você está começando ou já vende, quanto tempo tem e qual a sua meta — e abre no lugar certo.",
  },
  {
    numero: "02",
    titulo: "Feche o seu preço",
    texto:
      "Antes de qualquer aula, você calcula o custo real de uma marmita sua e descobre por quanto precisa vender.",
  },
  {
    numero: "03",
    titulo: "Rode a semana com o app aberto",
    texto:
      "Monta o cardápio no banco de receitas, tira a ficha nutricional na calculadora e avança a trilha nos intervalos.",
  },
];

export type Depoimento = {
  nome: string;
  contexto: string;
  texto: string;
};

/**
 * ATENÇÃO: depoimentos fictícios, de demonstração.
 * Substituir por depoimentos reais antes de publicar.
 */
export const DEPOIMENTOS_PLACEHOLDER: Depoimento[] = [
  {
    nome: "Fulana de Tal",
    contexto: "Personagem fictícia · Interior de SP",
    texto:
      "Eu vendia a marmita por dezesseis reais achando que estava lucrando. Fiz a conta no app e o custo real era quinze e vinte. Reajustei para vinte e dois e não perdi cliente.",
  },
  {
    nome: "Beltrano da Silva",
    contexto: "Personagem fictício · Belo Horizonte",
    texto:
      "A ficha nutricional foi o que destravou. Comecei a mandar os macros junto do cardápio no WhatsApp e a taxa de resposta mudou de figura.",
  },
  {
    nome: "Sicrana Souza",
    contexto: "Personagem fictícia · Recife",
    texto:
      "Fazia tudo no caderno. Hoje monto o cardápio da semana no banco de receitas e já saio com o custo de cada uma fechado.",
  },
];

export type Plano = {
  id: string;
  nome: string;
  preco: string;
  periodo: string;
  equivalente?: string;
  descricao: string;
  destaque: boolean;
  selo?: string;
  inclui: string[];
};

export const PLANOS: Plano[] = [
  {
    id: "mensal",
    nome: "Mensal",
    preco: "R$ 39",
    periodo: "por mês",
    descricao: "Para experimentar sem compromisso de longo prazo.",
    destaque: false,
    inclui: [
      "Trilha completa, cinco módulos",
      "Calculadora de macros e de precificação",
      "Banco de receitas com ficha e custo",
      "Cenários e receitas salvos sem limite",
      "Cancela quando quiser",
    ],
  },
  {
    id: "anual",
    nome: "Anual",
    preco: "R$ 290",
    periodo: "por ano",
    equivalente: "equivale a R$ 24,17 por mês",
    descricao: "Para quem já decidiu que isso vira renda.",
    destaque: true,
    selo: "Melhor valor",
    inclui: [
      "Tudo do plano mensal",
      "Dois meses e meio de economia",
      "Acesso às ferramentas da fase 2 sem custo extra",
      "Prioridade no suporte por e-mail",
    ],
  },
];

export type Pergunta = { pergunta: string; resposta: string };

export const PERGUNTAS: Pergunta[] = [
  {
    pergunta: "Preciso ter cozinha profissional ou CNPJ para começar?",
    resposta:
      "Não. A trilha começa exatamente no cenário de cozinha doméstica e produção pequena, e o módulo inicial trata de formalização como um passo posterior, quando o volume justificar.",
  },
  {
    pergunta: "Os valores nutricionais são confiáveis?",
    resposta:
      "A base de ingredientes usa valores por 100 g de tabelas de composição de alimentos brasileiras. O cálculo é uma estimativa técnica para orientar o seu cardápio e a comunicação com o cliente, e não substitui laudo laboratorial exigido em rotulagem obrigatória.",
  },
  {
    pergunta: "Funciona no celular?",
    resposta:
      "Sim, e é onde o app foi pensado para viver. Você instala na tela inicial como um aplicativo e as telas de consulta continuam abrindo mesmo com a internet oscilando.",
  },
  {
    pergunta: "É curso ou é ferramenta?",
    resposta:
      "Os dois, e essa é a diferença. A aula sobre precificação abre ao lado da calculadora de precificação; a aula sobre cardápio abre ao lado do banco de receitas. Você aprende e executa no mesmo lugar.",
  },
  {
    pergunta: "E se eu não gostar?",
    resposta:
      "Você tem sete dias para pedir o reembolso integral, sem justificativa e sem formulário. Basta responder o e-mail de compra.",
  },
];

export const RODAPE_LINKS: { titulo: string; itens: { rotulo: string; href: string }[] }[] = [
  {
    titulo: "Produto",
    itens: [
      { rotulo: "Como funciona", href: "#como-funciona" },
      { rotulo: "Ferramentas", href: "#ferramentas" },
      { rotulo: "Planos", href: "#planos" },
      { rotulo: "Perguntas", href: "#perguntas" },
    ],
  },
  {
    titulo: "Conta",
    itens: [
      { rotulo: "Entrar", href: "/entrar" },
      { rotulo: "Criar conta", href: "/cadastro" },
    ],
  },
  {
    titulo: "Legal",
    itens: [
      { rotulo: "Termos de uso", href: "/termos" },
      { rotulo: "Privacidade", href: "/privacidade" },
    ],
  },
];

export const NAVEGACAO_TOPO = [
  { rotulo: "O problema", href: "#problema" },
  { rotulo: "Ferramentas", href: "#ferramentas" },
  { rotulo: "Como funciona", href: "#como-funciona" },
  { rotulo: "Planos", href: "#planos" },
] as const;

export const ICONES_APOIO = { ClipboardList, Receipt } as const;
