import { dividirPorPorcoes, somarTotais, type Totais } from "@/lib/calculos/macros";
import { clienteAdmin } from "@/lib/supabase/server";
import type { Ingrediente, ObjetivoReceita, Receita } from "@/types/database";

export const ROTULO_OBJETIVO: Record<ObjetivoReceita, string> = {
  low_carb: "Low carb",
  rica_proteina: "Rica em proteína",
  economica: "Econômica",
};

export const OBJETIVOS: ObjetivoReceita[] = [
  "rica_proteina",
  "low_carb",
  "economica",
];

export type ItemDaReceita = {
  ingrediente: Ingrediente;
  quantidade_g: number;
};

export type ReceitaDaLista = Receita & {
  totais: Totais;
  porPorcao: Totais;
};

export type ReceitaCompleta = ReceitaDaLista & {
  itens: ItemDaReceita[];
};

type FiltroDeReceitas = {
  busca?: string;
  objetivo?: ObjetivoReceita;
};

/**
 * Catálogo de receitas com a ficha nutricional e o custo já calculados.
 * A busca cobre nome, descrição e o nome dos ingredientes.
 */
export async function listarReceitas(
  filtro: FiltroDeReceitas = {}
): Promise<ReceitaDaLista[]> {
  const supabase = clienteAdmin();

  let consulta = supabase
    .from("recipes")
    .select("*")
    .eq("publica", true)
    .order("nome");

  if (filtro.objetivo) {
    consulta = consulta.eq("objetivo", filtro.objetivo);
  }

  const { data: receitas, error } = await consulta;
  if (error) throw new Error(error.message);
  if (!receitas || receitas.length === 0) return [];

  const itensPorReceita = await carregarItens(
    receitas.map((receita) => receita.id)
  );

  const termo = filtro.busca?.trim().toLowerCase() ?? "";

  return receitas
    .filter((receita) => {
      if (!termo) return true;
      const itens = itensPorReceita.get(receita.id) ?? [];
      return (
        receita.nome.toLowerCase().includes(termo) ||
        receita.descricao.toLowerCase().includes(termo) ||
        itens.some((item) => item.ingrediente.nome.toLowerCase().includes(termo))
      );
    })
    .map((receita) =>
      montarFicha(receita, itensPorReceita.get(receita.id) ?? [])
    );
}

export async function obterReceita(
  slug: string
): Promise<ReceitaCompleta | null> {
  const supabase = clienteAdmin();

  const { data: receita, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("slug", slug)
    .eq("publica", true)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!receita) return null;

  const itensPorReceita = await carregarItens([receita.id]);
  const itens = itensPorReceita.get(receita.id) ?? [];

  return { ...montarFicha(receita, itens), itens };
}

export async function listarSlugsDeReceitas(): Promise<string[]> {
  const supabase = clienteAdmin();

  const { data, error } = await supabase
    .from("recipes")
    .select("slug")
    .eq("publica", true);

  if (error) throw new Error(error.message);
  return (data ?? []).map((linha) => linha.slug);
}

// ---------------------------------------------------------------------------

/**
 * Duas consultas simples em vez de um join embutido: o PostgREST embutido
 * exigiria tipos de relacionamento gerados, e a junção em memória aqui é
 * barata para o tamanho do catálogo.
 */
async function carregarItens(
  receitaIds: string[]
): Promise<Map<string, ItemDaReceita[]>> {
  const mapa = new Map<string, ItemDaReceita[]>();
  if (receitaIds.length === 0) return mapa;

  const supabase = clienteAdmin();

  const { data: vinculos, error } = await supabase
    .from("recipe_ingredients")
    .select("recipe_id, ingredient_id, quantidade_g, ordem")
    .in("recipe_id", receitaIds)
    .order("ordem");

  if (error) throw new Error(error.message);
  if (!vinculos || vinculos.length === 0) return mapa;

  const ingredientIds = Array.from(
    new Set(vinculos.map((vinculo) => vinculo.ingredient_id))
  );

  const { data: ingredientes, error: erroIngredientes } = await supabase
    .from("ingredients")
    .select("*")
    .in("id", ingredientIds);

  if (erroIngredientes) throw new Error(erroIngredientes.message);

  const porId = new Map(
    (ingredientes ?? []).map((ingrediente) => [ingrediente.id, ingrediente])
  );

  for (const vinculo of vinculos) {
    const ingrediente = porId.get(vinculo.ingredient_id);
    if (!ingrediente) continue;

    const lista = mapa.get(vinculo.recipe_id) ?? [];
    lista.push({ ingrediente, quantidade_g: Number(vinculo.quantidade_g) });
    mapa.set(vinculo.recipe_id, lista);
  }

  return mapa;
}

/**
 * Fotos versionadas em public/receitas que ainda podem não estar gravadas em
 * `imagem_url` no banco de algum ambiente. O arquivo chega com o deploy, mas
 * o campo depende de rodar a migração ou o script de fotos — sem esta rede, a
 * receita aparece com a capa de marca mesmo tendo foto publicada.
 */
const FOTOS_SEM_REGISTRO_GARANTIDO = new Set(["tilapia-ao-forno-com-legumes"]);

function montarFicha(receita: Receita, itens: ItemDaReceita[]): ReceitaDaLista {
  const totais = somarTotais(
    itens.map((item) => ({ gramas: item.quantidade_g, base: item.ingrediente }))
  );

  const imagem_url =
    receita.imagem_url ??
    (FOTOS_SEM_REGISTRO_GARANTIDO.has(receita.slug)
      ? `/receitas/${receita.slug}.webp`
      : null);

  return {
    ...receita,
    imagem_url,
    totais,
    porPorcao: dividirPorPorcoes(totais, receita.rendimento_porcoes),
  };
}
