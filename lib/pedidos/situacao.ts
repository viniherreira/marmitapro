import type { SituacaoPedido } from "@/types/database";

/**
 * O caminho de um pedido, na ordem em que acontece na cozinha.
 *
 * A ordem da lista importa: é a do seletor na tela e a do resumo da semana.
 * Cancelado fica por último porque não é etapa, é saída.
 */
export const SITUACOES: {
  valor: SituacaoPedido;
  rotulo: string;
  variante: "neutral" | "warning" | "primary" | "success" | "outline";
}[] = [
  { valor: "recebido", rotulo: "Recebido", variante: "neutral" },
  { valor: "em_producao", rotulo: "Em produção", variante: "warning" },
  { valor: "pronto", rotulo: "Pronto", variante: "primary" },
  { valor: "entregue", rotulo: "Entregue", variante: "success" },
  { valor: "cancelado", rotulo: "Cancelado", variante: "outline" },
];

export function dadosDaSituacao(valor: SituacaoPedido) {
  return SITUACOES.find((s) => s.valor === valor) ?? SITUACOES[0];
}
