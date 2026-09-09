/**
 * Gera a migração do cardápio a partir de `curadoria-receitas.mjs`.
 *
 *   node scripts/gerar-receitas.mjs
 *
 * Existe para que um banco montado do zero termine igual ao que está no ar.
 * Sem isso, as receitas só existiriam onde o carregador foi executado, e o
 * repositório contaria uma história diferente da produção.
 *
 * Os vínculos são resolvidos por slug dentro do próprio SQL: os ids são
 * gerados pelo banco, então gravá-los aqui deixaria a migração presa a uma
 * instância específica.
 */

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { CORRECOES, RECEITAS } from "./curadoria-receitas.mjs";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const DESTINO = join(
  RAIZ,
  "supabase",
  "migrations",
  "20260908130000_cardapio_ampliado.sql"
);

const aspas = (s) => `'${String(s).replace(/'/g, "''")}'`;

const receitas = RECEITAS.map(
  (r) =>
    `  (${aspas(r.slug)}, ${aspas(r.nome)}, ${aspas(r.descricao)}, ` +
    `${aspas(r.objetivo)}::public.objetivo_receita, ${aspas(r.modoPreparo)}, ` +
    `${r.porcoes}, ${r.minutos}, true)`
).join(",\n");

const vinculos = RECEITAS.flatMap((r) =>
  r.itens.map(
    ([slug, gramas], ordem) =>
      `    (${aspas(r.slug)}, ${aspas(slug)}, ${gramas}, ${ordem})`
  )
).join(",\n");

const correcoes = CORRECOES.map((c) => {
  const trocas = (c.trocas ?? [])
    .map(
      ([de, para, gramas]) => `
-- ${c.slug}: ${de} -> ${para}
update public.recipe_ingredients ri
set ingredient_id = novo.id, quantidade_g = ${gramas}
from public.recipes r, public.ingredients antigo, public.ingredients novo
where ri.recipe_id = r.id
  and r.slug = ${aspas(c.slug)}
  and antigo.slug = ${aspas(de)}
  and novo.slug = ${aspas(para)}
  and ri.ingredient_id = antigo.id;`
    )
    .join("\n");

  const ajustes = (c.ajustes ?? [])
    .map(
      ([slug, gramas]) => `
update public.recipe_ingredients ri
set quantidade_g = ${gramas}
from public.recipes r, public.ingredients i
where ri.recipe_id = r.id
  and r.slug = ${aspas(c.slug)}
  and i.slug = ${aspas(slug)}
  and ri.ingredient_id = i.id;`
    )
    .join("\n");

  const objetivo = c.objetivo
    ? `
update public.recipes set objetivo = ${aspas(c.objetivo)}::public.objetivo_receita
where slug = ${aspas(c.slug)};`
    : "";

  const motivo = c.porque
    .match(/.{1,72}(\s|$)/g)
    .map((l) => `-- ${l.trim()}`)
    .join("\n");

  return `${motivo}${objetivo}${trocas}${ajustes}`;
}).join("\n");

const sql = `-- ---------------------------------------------------------------------------
-- MarmitaPRO — cardápio ampliado
-- ---------------------------------------------------------------------------
-- GERADO por scripts/gerar-receitas.mjs. Não edite à mão: ajuste
-- scripts/curadoria-receitas.mjs e rode o script de novo.
--
-- Depende da migração de ingredientes: as receitas resolvem os ingredientes
-- por slug, e slug que não existir faz a inserção do vínculo não acontecer.
-- ---------------------------------------------------------------------------

insert into public.recipes
  (slug, nome, descricao, objetivo, modo_preparo, rendimento_porcoes,
   tempo_preparo_minutos, publica)
values
${receitas}
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  objetivo = excluded.objetivo,
  modo_preparo = excluded.modo_preparo,
  rendimento_porcoes = excluded.rendimento_porcoes,
  tempo_preparo_minutos = excluded.tempo_preparo_minutos,
  publica = excluded.publica;

-- A lista de ingredientes é substituída inteira. Editar item a item deixaria
-- sobra de uma versão anterior, e a ficha sairia com ingrediente fantasma.
delete from public.recipe_ingredients ri
using public.recipes r
where ri.recipe_id = r.id
  and r.slug in (${RECEITAS.map((r) => aspas(r.slug)).join(", ")});

insert into public.recipe_ingredients (recipe_id, ingredient_id, quantidade_g, ordem)
select r.id, i.id, v.gramas, v.ordem
from (
  values
${vinculos}
) as v(receita, ingrediente, gramas, ordem)
join public.recipes r on r.slug = v.receita
join public.ingredients i on i.slug = v.ingrediente;

-- ---------------------------------------------------------------------------
-- Correções em receitas da primeira versão do cardápio, cujo rótulo de
-- objetivo a ficha nutricional não sustentava.
-- ---------------------------------------------------------------------------
${correcoes}
`;

writeFileSync(DESTINO, sql, "utf8");

const porObjetivo = new Map();
for (const r of RECEITAS) {
  porObjetivo.set(r.objetivo, (porObjetivo.get(r.objetivo) ?? 0) + 1);
}

console.log(`${RECEITAS.length} receitas e ${CORRECOES.length} correcoes em ${DESTINO}`);
for (const [o, n] of [...porObjetivo].sort()) {
  console.log(`  ${String(n).padStart(3)}  ${o}`);
}
