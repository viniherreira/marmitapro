/**
 * Carrega a curadoria de ingredientes no banco.
 *
 *   node scripts/aplicar-ingredientes.mjs
 *
 * Lê as mesmas fontes que geram a migração — curadoria + TACO — e faz upsert
 * por slug. Serve para atualizar um banco que já existe sem recriar linha
 * nenhuma: as receitas apontam para o id do ingrediente, e recriar quebraria
 * as fichas montadas.
 *
 * Migração e script saem da mesma curadoria de propósito: não existe caminho
 * em que os dois discordem.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

import { montarRegistros } from "./gerar-ingredientes.mjs";
import { APOSENTADOS } from "./curadoria-ingredientes.mjs";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");

function ambiente() {
  const bruto = readFileSync(join(RAIZ, ".env.local"), "utf8");
  const pares = bruto
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i), l.slice(i + 1)];
    });
  return Object.fromEntries(pares);
}

async function main() {
  const env = ambiente();
  const db = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/+$/, ""),
    env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );

  const registros = await montarRegistros();

  const linhas = registros.map((r) => ({
    slug: r.slug,
    nome: r.nome,
    categoria: r.categoria,
    kcal: r.kcal,
    proteina_g: r.proteina,
    carboidrato_g: r.carboidrato,
    gordura_g: r.gordura,
    fibra_g: r.fibra,
    sodio_mg: r.sodio,
    preco_medio_kg: r.preco,
    fonte: r.fonte,
    taco_id: r.taco,
  }));

  // Preço já ajustado pelo dono do negócio não pode ser sobrescrito por
  // estimativa nossa, então preservamos o que já está gravado.
  const { data: existentes, error: erroLeitura } = await db
    .from("ingredients")
    .select("slug, preco_medio_kg");
  if (erroLeitura) throw new Error(erroLeitura.message);

  const precoAtual = new Map(
    (existentes ?? []).map((e) => [e.slug, Number(e.preco_medio_kg)])
  );
  for (const linha of linhas) {
    const atual = precoAtual.get(linha.slug);
    if (atual !== undefined && atual > 0) linha.preco_medio_kg = atual;
  }

  const { error } = await db
    .from("ingredients")
    .upsert(linhas, { onConflict: "slug" });
  if (error) throw new Error(error.message);

  console.log(`${linhas.length} ingredientes gravados.`);

  // Aposentados saem só se ninguém apontar para eles.
  const { data: candidatos } = await db
    .from("ingredients")
    .select("id, slug")
    .in("slug", APOSENTADOS);

  for (const candidato of candidatos ?? []) {
    const { count } = await db
      .from("recipe_ingredients")
      .select("recipe_id", { count: "exact", head: true })
      .eq("ingredient_id", candidato.id);

    if (count && count > 0) {
      console.log(`  mantido (usado em receita): ${candidato.slug}`);
      continue;
    }

    const { error: erroDelete } = await db
      .from("ingredients")
      .delete()
      .eq("id", candidato.id);
    console.log(
      erroDelete
        ? `  falha ao aposentar ${candidato.slug}: ${erroDelete.message}`
        : `  aposentado: ${candidato.slug}`
    );
  }

  const { count: total } = await db
    .from("ingredients")
    .select("id", { count: "exact", head: true });
  console.log(`\ntotal no banco: ${total}`);
}

main().catch((erro) => {
  console.error(erro.message);
  process.exit(1);
});
