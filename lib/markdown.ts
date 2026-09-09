/**
 * Analisador de um subconjunto de Markdown, suficiente para o conteúdo das
 * aulas: títulos, parágrafos, listas, citação, negrito, itálico, código e
 * links.
 *
 * A saída é uma árvore de blocos — quem renderiza monta os elementos React.
 * Nada de HTML cru, então não existe superfície para injeção.
 */

export type Trecho =
  | { tipo: "texto"; valor: string }
  | { tipo: "forte"; valor: string }
  | { tipo: "enfase"; valor: string }
  | { tipo: "codigo"; valor: string }
  | { tipo: "link"; valor: string; destino: string };

export type Bloco =
  | { tipo: "titulo"; nivel: 2 | 3; conteudo: Trecho[] }
  | { tipo: "paragrafo"; conteudo: Trecho[] }
  | { tipo: "citacao"; conteudo: Trecho[] }
  | { tipo: "lista"; ordenada: boolean; itens: Trecho[][] };

const PADRAO_INLINE =
  /(\[[^\]]+\]\([^)\s]+\)|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;

const PADRAO_LINK = /^\[([^\]]+)\]\(([^)\s]+)\)$/;

/**
 * Só rota interna do próprio app ou https.
 *
 * O conteúdo hoje é nosso, mas o destino vira `href` direto: aceitar esquema
 * livre abriria a porta para `javascript:` no dia em que uma aula ou receita
 * puder ser escrita por alguém de fora.
 */
function destinoSeguro(bruto: string): string | null {
  if (bruto.startsWith("//")) return null;
  if (bruto.startsWith("/")) return bruto;
  if (bruto.startsWith("https://")) return bruto;
  return null;
}

export function analisarInline(texto: string): Trecho[] {
  const partes = texto.split(PADRAO_INLINE).filter((parte) => parte !== "");

  return partes.map((parte): Trecho => {
    const link = PADRAO_LINK.exec(parte);
    if (link) {
      const destino = destinoSeguro(link[2]);
      // Destino recusado vira texto puro: melhor perder o link do que renderizar
      // um href que não deveria existir.
      return destino
        ? { tipo: "link", valor: link[1], destino }
        : { tipo: "texto", valor: link[1] };
    }
    if (parte.startsWith("**") && parte.endsWith("**")) {
      return { tipo: "forte", valor: parte.slice(2, -2) };
    }
    if (parte.startsWith("`") && parte.endsWith("`")) {
      return { tipo: "codigo", valor: parte.slice(1, -1) };
    }
    if (parte.startsWith("*") && parte.endsWith("*")) {
      return { tipo: "enfase", valor: parte.slice(1, -1) };
    }
    return { tipo: "texto", valor: parte };
  });
}

export function analisarMarkdown(fonte: string): Bloco[] {
  const linhas = fonte.replace(/\r\n/g, "\n").split("\n");
  const blocos: Bloco[] = [];

  let paragrafo: string[] = [];
  let lista: { ordenada: boolean; itens: string[] } | null = null;

  function fecharParagrafo() {
    if (paragrafo.length === 0) return;
    blocos.push({
      tipo: "paragrafo",
      conteudo: analisarInline(paragrafo.join(" ")),
    });
    paragrafo = [];
  }

  function fecharLista() {
    if (!lista) return;
    blocos.push({
      tipo: "lista",
      ordenada: lista.ordenada,
      itens: lista.itens.map(analisarInline),
    });
    lista = null;
  }

  for (const linhaBruta of linhas) {
    const linha = linhaBruta.trimEnd();

    if (linha.trim() === "") {
      fecharParagrafo();
      fecharLista();
      continue;
    }

    const titulo = /^(#{2,3})\s+(.*)$/.exec(linha);
    if (titulo) {
      fecharParagrafo();
      fecharLista();
      blocos.push({
        tipo: "titulo",
        nivel: titulo[1].length === 2 ? 2 : 3,
        conteudo: analisarInline(titulo[2]),
      });
      continue;
    }

    const citacao = /^>\s?(.*)$/.exec(linha);
    if (citacao) {
      fecharParagrafo();
      fecharLista();
      blocos.push({ tipo: "citacao", conteudo: analisarInline(citacao[1]) });
      continue;
    }

    const itemOrdenado = /^\s*\d+\.\s+(.*)$/.exec(linha);
    if (itemOrdenado) {
      fecharParagrafo();
      if (!lista || !lista.ordenada) {
        fecharLista();
        lista = { ordenada: true, itens: [] };
      }
      lista.itens.push(itemOrdenado[1]);
      continue;
    }

    const itemSimples = /^\s*[-*]\s+(.*)$/.exec(linha);
    if (itemSimples) {
      fecharParagrafo();
      if (!lista || lista.ordenada) {
        fecharLista();
        lista = { ordenada: false, itens: [] };
      }
      lista.itens.push(itemSimples[1]);
      continue;
    }

    fecharLista();
    paragrafo.push(linha.trim());
  }

  fecharParagrafo();
  fecharLista();

  return blocos;
}
