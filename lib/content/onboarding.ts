import type { RespostasOnboardingInput } from "@/lib/validacao/schemas";

export type CampoDoQuiz = keyof RespostasOnboardingInput;

export type PerguntaDoQuiz = {
  campo: CampoDoQuiz;
  sobrelinha: string;
  pergunta: string;
  ajuda: string;
  opcoes: { valor: string; rotulo: string; detalhe: string }[];
};

/** Uma pergunta por tela, na ordem em que o app precisa saber. */
export const PERGUNTAS_DO_QUIZ: PerguntaDoQuiz[] = [
  {
    campo: "situacao",
    sobrelinha: "Pergunta 1 de 4",
    pergunta: "Você já vende marmitas ou está começando?",
    ajuda: "Isso define em que ponto da trilha o app vai te colocar.",
    opcoes: [
      {
        valor: "comecando",
        rotulo: "Estou começando do zero",
        detalhe: "Ainda não vendi nenhuma marmita.",
      },
      {
        valor: "ja_vendo",
        rotulo: "Já vendo, quero organizar",
        detalhe: "Tenho clientes, mas a conta não fecha direito.",
      },
      {
        valor: "escalando",
        rotulo: "Já vendo e quero escalar",
        detalhe: "A operação anda; quero aumentar volume e margem.",
      },
    ],
  },
  {
    campo: "horas_por_semana",
    sobrelinha: "Pergunta 2 de 4",
    pergunta: "Quantas horas por semana você tem disponível?",
    ajuda: "Serve para calibrar a meta de produção que faz sentido para você.",
    opcoes: [
      {
        valor: "ate_5",
        rotulo: "Até 5 horas",
        detalhe: "Um turno de produção por semana.",
      },
      {
        valor: "de_5_a_15",
        rotulo: "De 5 a 15 horas",
        detalhe: "Dois turnos, ou um fim de semana inteiro.",
      },
      {
        valor: "de_15_a_30",
        rotulo: "De 15 a 30 horas",
        detalhe: "Meio período dedicado ao negócio.",
      },
      {
        valor: "acima_de_30",
        rotulo: "Mais de 30 horas",
        detalhe: "É a minha atividade principal.",
      },
    ],
  },
  {
    campo: "meta_de_renda",
    sobrelinha: "Pergunta 3 de 4",
    pergunta: "Qual a sua meta de renda mensal com marmitas?",
    ajuda: "O painel usa esse número como referência de volume necessário.",
    opcoes: [
      {
        valor: "ate_1000",
        rotulo: "Até R$ 1.000",
        detalhe: "Uma renda extra para complementar.",
      },
      {
        valor: "de_1000_a_3000",
        rotulo: "De R$ 1.000 a R$ 3.000",
        detalhe: "Uma segunda fonte de renda relevante.",
      },
      {
        valor: "de_3000_a_6000",
        rotulo: "De R$ 3.000 a R$ 6.000",
        detalhe: "Substituir ou superar um salário.",
      },
      {
        valor: "acima_de_6000",
        rotulo: "Acima de R$ 6.000",
        detalhe: "Montar uma operação com estrutura.",
      },
    ],
  },
  {
    campo: "precificacao",
    sobrelinha: "Pergunta 4 de 4",
    pergunta: "Você já sabe precificar seus produtos?",
    ajuda: "Se a resposta for não, essa é a primeira coisa que vamos resolver.",
    opcoes: [
      {
        valor: "nao_sei",
        rotulo: "Não sei calcular",
        detalhe: "Hoje eu chuto ou copio o preço de quem está por perto.",
      },
      {
        valor: "mais_ou_menos",
        rotulo: "Mais ou menos",
        detalhe: "Somo os ingredientes, mas não incluo tempo e custos fixos.",
      },
      {
        valor: "sei_calcular",
        rotulo: "Sei calcular",
        detalhe: "Tenho custo, margem e preço fechados.",
      },
    ],
  },
];
