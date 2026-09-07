/**
 * Dados das demonstrações visuais da landing. São recortes fiéis do que o
 * app produz — ficam aqui para que nenhum componente carregue dado embutido.
 */

export const DEMO_CALCULO = {
  titulo: "Como o preço foi formado",
  etapas: [
    { rotulo: "Ingredientes da receita", operacao: "+", valor: "R$ 6,80" },
    { rotulo: "Embalagem e etiqueta", operacao: "+", valor: "R$ 1,20" },
    { rotulo: "Gás e energia rateados", operacao: "+", valor: "R$ 0,45" },
    { rotulo: "12 min × R$ 12,00/hora", operacao: "+", valor: "R$ 2,40" },
  ],
  subtotal: { rotulo: "Custo real por unidade", valor: "R$ 10,85" },
  margem: { rotulo: "Margem de 50% sobre o preço", operacao: "÷", valor: "0,50" },
  total: { rotulo: "Preço sugerido", valor: "R$ 21,70" },
  projecao: [
    { rotulo: "120 marmitas/mês", valor: "R$ 2.604,00" },
    { rotulo: "Lucro no mês", valor: "R$ 1.302,00" },
  ],
} as const;

export const DEMO_MACROS = {
  receita: "Strogonoff fit de frango",
  porcoes: 4,
  ingredientes: [
    { nome: "Peito de frango cru", gramas: 600 },
    { nome: "Creme de ricota light", gramas: 200 },
    { nome: "Champignon em conserva", gramas: 150 },
    { nome: "Extrato de tomate", gramas: 60 },
  ],
  totais: [
    { rotulo: "Calorias", total: "1.032 kcal", porcao: "258 kcal" },
    { rotulo: "Proteínas", total: "148,6 g", porcao: "37,2 g" },
    { rotulo: "Carboidratos", total: "34,1 g", porcao: "8,5 g" },
    { rotulo: "Gorduras", total: "28,4 g", porcao: "7,1 g" },
  ],
} as const;

export const DEMO_TRILHA = {
  progresso: 38,
  modulos: [
    { nome: "Começando do zero", aulas: 6, concluidas: 6 },
    { nome: "Precificação sem chute", aulas: 6, concluidas: 4 },
    { nome: "Marketing local", aulas: 5, concluidas: 0 },
    { nome: "Logística e entrega", aulas: 5, concluidas: 0 },
  ],
} as const;

export const DEMO_RECEITAS = [
  {
    nome: "Frango grelhado com arroz integral",
    objetivo: "Rica em proteína",
    kcal: "498 kcal",
    custo: "R$ 6,80",
  },
  {
    nome: "Escondidinho de abóbora com carne moída",
    objetivo: "Econômica",
    kcal: "436 kcal",
    custo: "R$ 5,10",
  },
  {
    nome: "Salmão com purê de couve-flor",
    objetivo: "Low carb",
    kcal: "412 kcal",
    custo: "R$ 14,30",
  },
] as const;
