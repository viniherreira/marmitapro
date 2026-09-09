/**
 * Carrega as receitas do cardápio no banco e confere o que elas prometem.
 *
 *   node scripts/aplicar-receitas.mjs
 *
 * Além de gravar, o script valida o rótulo de objetivo contra a conta real: os
 * limites estão em PROMESSAS, e receita que não cumpre o que o rótulo diz faz
 * a carga falhar. Um app que ensina precificação não pode publicar cardápio
 * com rótulo que a própria ficha desmente.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

import { CORRECOES, RECEITAS } from "./curadoria-receitas.mjs";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * O que cada objetivo promete, em número.
 *
 * Limite absoluto, não comparação com a média do cardápio: média move sozinha
 * a cada receita nova, e um rótulo que muda de significado conforme o vizinho
 * não serve para o cozinheiro que filtra por ele. Os cortes:
 *
 *  - 30 g de proteína numa refeição é o patamar em que a palavra "rica" para
 *    de ser retórica.
 *  - 20 g de carboidrato por porção é o teto usual de prato low carb.
 *  - R$ 6,50 por porção é o que permite vender a marmita na faixa popular
 *    ainda com margem, considerando embalagem e gás por cima.
 */
/** Metade do limite diário de 2 g de sódio que a OMS recomenda para adultos. */
const TETO_DE_SODIO_POR_PORCAO = 1200;

const PROMESSAS = {
  rica_proteina: {
    cumpre: (f) => f.proteina >= 30,
    recado: (f) =>
      `marcada como rica em proteina, mas entrega ${f.proteina.toFixed(1)} g por porcao (minimo 30 g)`,
  },
  low_carb: {
    cumpre: (f) => f.carboidrato <= 20,
    recado: (f) =>
      `marcada como low carb, mas tem ${f.carboidrato.toFixed(1)} g de carboidrato por porcao (teto 20 g)`,
  },
  economica: {
    cumpre: (f) => f.custo <= 6.5,
    recado: (f) =>
      `marcada como economica, mas custa R$ ${f.custo.toFixed(2)} por porcao (teto R$ 6,50)`,
  },
};

function ambiente() {
  return Object.fromEntries(
    readFileSync(join(RAIZ, ".env.local"), "utf8")
      .split(/\r?\n/)
      .filter((l) => l && !l.startsWith("#"))
      .map((l) => {
        const i = l.indexOf("=");
        return [l.slice(0, i), l.slice(i + 1)];
      })
  );
}

/** Espelha lib/calculos/macros.ts — se divergir, a verificação perde sentido. */
function totais(itens) {
  return itens.reduce(
    (acc, { gramas, base }) => {
      const f = gramas / 100;
      return {
        kcal: acc.kcal + Number(base.kcal) * f,
        proteina: acc.proteina + Number(base.proteina_g) * f,
        carboidrato: acc.carboidrato + Number(base.carboidrato_g) * f,
        gordura: acc.gordura + Number(base.gordura_g) * f,
        fibra: acc.fibra + Number(base.fibra_g) * f,
        sodio: acc.sodio + Number(base.sodio_mg) * f,
        custo: acc.custo + (Number(base.preco_medio_kg) / 1000) * gramas,
        peso: acc.peso + gramas,
      };
    },
    {
      kcal: 0,
      proteina: 0,
      carboidrato: 0,
      gordura: 0,
      fibra: 0,
      sodio: 0,
      custo: 0,
      peso: 0,
    }
  );
}

async function main() {
  const env = ambiente();
  const db = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/+$/, ""),
    env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );

  const { data: ingredientes, error: erroIng } = await db
    .from("ingredients")
    .select("*");
  if (erroIng) throw new Error(erroIng.message);

  const porSlug = new Map(ingredientes.map((i) => [i.slug, i]));

  const desconhecidos = RECEITAS.flatMap((r) =>
    r.itens.filter(([slug]) => !porSlug.has(slug)).map(([slug]) => `${r.slug}: ${slug}`)
  );
  if (desconhecidos.length) {
    console.error("Receita aponta para ingrediente que nao existe:");
    for (const d of desconhecidos) console.error(`  - ${d}`);
    process.exit(1);
  }

  for (const receita of RECEITAS) {
    const { data: gravada, error } = await db
      .from("recipes")
      .upsert(
        {
          slug: receita.slug,
          nome: receita.nome,
          descricao: receita.descricao,
          objetivo: receita.objetivo,
          modo_preparo: receita.modoPreparo,
          rendimento_porcoes: receita.porcoes,
          tempo_preparo_minutos: receita.minutos,
          publica: true,
        },
        { onConflict: "slug" }
      )
      .select("id")
      .single();
    if (error) throw new Error(`${receita.slug}: ${error.message}`);

    // Substituímos a lista inteira: editar item a item deixaria sobra de uma
    // versão anterior da receita, e a ficha sairia com ingrediente fantasma.
    await db.from("recipe_ingredients").delete().eq("recipe_id", gravada.id);

    const vinculos = receita.itens.map(([slug, gramas], ordem) => ({
      recipe_id: gravada.id,
      ingredient_id: porSlug.get(slug).id,
      quantidade_g: gramas,
      ordem,
    }));

    const { error: erroVinc } = await db
      .from("recipe_ingredients")
      .insert(vinculos);
    if (erroVinc) throw new Error(`${receita.slug}: ${erroVinc.message}`);
  }

  console.log(`${RECEITAS.length} receitas gravadas.`);

  // --- correções em receitas da primeira versão ----------------------------
  for (const correcao of CORRECOES) {
    const { data: receita } = await db
      .from("recipes")
      .select("id")
      .eq("slug", correcao.slug)
      .maybeSingle();
    if (!receita) continue;

    if (correcao.objetivo) {
      await db
        .from("recipes")
        .update({ objetivo: correcao.objetivo })
        .eq("id", receita.id);
    }

    for (const [de, para, gramas] of correcao.trocas ?? []) {
      const antigo = porSlug.get(de);
      const novo = porSlug.get(para);
      if (!antigo || !novo) {
        throw new Error(
          `${correcao.slug}: troca ${de} -> ${para} aponta para ingrediente inexistente`
        );
      }
      // Idempotente: numa segunda execução o ingrediente antigo já não está
      // lá, e a correção precisa continuar valendo em vez de virar silêncio.
      const { data: trocado, error } = await db
        .from("recipe_ingredients")
        .update({ ingredient_id: novo.id, quantidade_g: gramas })
        .eq("recipe_id", receita.id)
        .eq("ingredient_id", antigo.id)
        .select("id");
      if (error) throw new Error(`${correcao.slug}: ${error.message}`);

      if (!trocado?.length) {
        const { error: erroQuantidade } = await db
          .from("recipe_ingredients")
          .update({ quantidade_g: gramas })
          .eq("recipe_id", receita.id)
          .eq("ingredient_id", novo.id);
        if (erroQuantidade) {
          throw new Error(`${correcao.slug}: ${erroQuantidade.message}`);
        }
      }
    }

    for (const [slug, gramas] of correcao.ajustes ?? []) {
      const { error } = await db
        .from("recipe_ingredients")
        .update({ quantidade_g: gramas })
        .eq("recipe_id", receita.id)
        .eq("ingredient_id", porSlug.get(slug).id);
      if (error) throw new Error(`${correcao.slug}: ${error.message}`);
    }

    console.log(`  corrigida: ${correcao.slug}`);
  }

  // --- conferência do cardápio inteiro, não só do que acabou de entrar ------
  const { data: todas } = await db
    .from("recipes")
    .select("id, slug, nome, objetivo, rendimento_porcoes")
    .eq("publica", true);
  const { data: vinculos } = await db
    .from("recipe_ingredients")
    .select("recipe_id, ingredient_id, quantidade_g");

  const fichas = todas.map((r) => {
    const itens = vinculos
      .filter((v) => v.recipe_id === r.id)
      .map((v) => ({
        gramas: Number(v.quantidade_g),
        base: ingredientes.find((i) => i.id === v.ingredient_id),
      }));
    const t = totais(itens);
    const p = r.rendimento_porcoes;
    return {
      ...r,
      kcal: t.kcal / p,
      proteina: t.proteina / p,
      carboidrato: t.carboidrato / p,
      custo: t.custo / p,
      sodio: t.sodio / p,
      peso: t.peso / p,
      itens: itens.length,
    };
  });

  const media = (campo) =>
    fichas.reduce((s, f) => s + f[campo], 0) / fichas.length;

  const problemas = [];
  for (const f of fichas) {
    if (f.itens === 0) problemas.push(`${f.slug}: sem ingredientes`);
    if (f.peso < 250 || f.peso > 700) {
      problemas.push(`${f.slug}: ${Math.round(f.peso)} g por porcao fora do razoavel`);
    }

    const promessa = PROMESSAS[f.objetivo];
    if (promessa && !promessa.cumpre(f)) {
      problemas.push(`${f.slug}: ${promessa.recado(f)}`);
    }
  }

  // Sódio não reprova receita — sal é escolha de quem cozinha, e uma marmita
  // temperada não é defeito. Mas o valor precisa aparecer: acima de 1200 mg
  // uma única refeição já come mais da metade do limite diário recomendado.
  const salgadas = fichas
    .filter((f) => f.sodio > TETO_DE_SODIO_POR_PORCAO)
    .sort((a, b) => b.sodio - a.sodio);

  fichas.sort(
    (a, b) => a.objetivo.localeCompare(b.objetivo) || a.custo - b.custo
  );

  let objetivo = "";
  for (const f of fichas) {
    if (f.objetivo !== objetivo) {
      objetivo = f.objetivo;
      console.log(`\n[${objetivo}]`);
    }
    console.log(
      `  ${f.nome.slice(0, 44).padEnd(46)}` +
        `${Math.round(f.kcal).toString().padStart(4)} kcal  ` +
        `P ${f.proteina.toFixed(1).padStart(5)} g  ` +
        `C ${f.carboidrato.toFixed(1).padStart(5)} g  ` +
        `Na ${Math.round(f.sodio).toString().padStart(5)} mg  ` +
        `R$ ${f.custo.toFixed(2).padStart(6)}  ` +
        `${Math.round(f.peso)} g`
    );
  }

  console.log(
    `\ncardapio: ${fichas.length} receitas | ` +
      `custo medio R$ ${media("custo").toFixed(2)}/porcao | ` +
      `proteina media ${media("proteina").toFixed(1)} g/porcao`
  );

  if (salgadas.length) {
    console.log(
      `\nAVISO — acima de ${TETO_DE_SODIO_POR_PORCAO} mg de sodio por porcao:`
    );
    for (const f of salgadas) {
      console.log(`  ${Math.round(f.sodio).toString().padStart(5)} mg  ${f.nome}`);
    }
  }

  if (problemas.length) {
    console.log("\nROTULOS QUE A CONTA NAO SUSTENTA:");
    for (const p of problemas) console.log(`  - ${p}`);
    process.exit(1);
  }
  console.log("\nTodos os objetivos declarados batem com a ficha.");
}

main().catch((erro) => {
  console.error(erro.message);
  process.exit(1);
});
