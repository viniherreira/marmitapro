/**
 * Gera a migração de ingredientes a partir da TACO.
 *
 *   node scripts/gerar-ingredientes.mjs
 *
 * Baixa a TACO 4ª edição normalizada, cruza com `curadoria-ingredientes.mjs` e
 * escreve a migração em supabase/migrations/. O script existe para que a base
 * nutricional seja auditável: dá para reexecutar, comparar o SQL gerado e ver
 * exatamente de onde saiu cada número.
 *
 * A fonte é fixada num commit específico — atualização de fonte deve ser uma
 * decisão, não algo que acontece sozinho entre duas execuções.
 */

import { mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  APOSENTADOS,
  CURADORIA,
  FORA_DA_TACO,
} from "./curadoria-ingredientes.mjs";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const COMMIT = "56a4ace81fd269b8b364a709c446218b6f3ac827";
const ORIGEM = `https://raw.githubusercontent.com/brolesi/taco/${COMMIT}/data/processed/taco/taco_composicao.csv`;
const CACHE = join(RAIZ, "scripts", ".cache", "taco_composicao.csv");
const DESTINO = join(
  RAIZ,
  "supabase",
  "migrations",
  "20260908120000_ingredientes_taco.sql"
);

const FONTE_TACO = "TACO 4a ed. (NEPA/UNICAMP, 2011)";

async function csvDaTaco() {
  if (existsSync(CACHE)) return readFileSync(CACHE, "utf8");

  const resposta = await fetch(ORIGEM);
  if (!resposta.ok) {
    throw new Error(`Nao consegui baixar a TACO: HTTP ${resposta.status}`);
  }

  const texto = await resposta.text();
  mkdirSync(dirname(CACHE), { recursive: true });
  writeFileSync(CACHE, texto, "utf8");
  return texto;
}

/** CSV com campos entre aspas e vírgulas dentro — parser próprio, sem dependência. */
function lerCsv(texto) {
  const linhas = [];
  let campos = [];
  let campo = "";
  let dentroDeAspas = false;

  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];

    if (dentroDeAspas) {
      if (c === '"') {
        if (texto[i + 1] === '"') {
          campo += '"';
          i++;
        } else {
          dentroDeAspas = false;
        }
      } else {
        campo += c;
      }
      continue;
    }

    if (c === '"') dentroDeAspas = true;
    else if (c === ",") {
      campos.push(campo);
      campo = "";
    } else if (c === "\n") {
      campos.push(campo);
      linhas.push(campos);
      campos = [];
      campo = "";
    } else if (c !== "\r") campo += c;
  }

  if (campo || campos.length) {
    campos.push(campo);
    linhas.push(campos);
  }

  return linhas;
}

/** TACO usa `Tr` (traço) e vazio para "não detectado" — ambos viram 0. */
function numero(bruto) {
  const n = Number(bruto);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.round(n * 100) / 100);
}

const aspas = (s) => `'${String(s).replace(/'/g, "''")}'`;

/**
 * Cruza a curadoria com a TACO e devolve as linhas prontas.
 * Exportada para que o carregador do banco use exatamente a mesma origem.
 */
export async function montarRegistros() {
  const [cabecalho, ...linhas] = lerCsv(await csvDaTaco());
  const col = Object.fromEntries(cabecalho.map((c, i) => [c.trim(), i]));

  const porDescricao = new Map();
  for (const l of linhas) {
    if (l.length < cabecalho.length) continue;
    porDescricao.set(l[col.descricao].trim(), l);
  }

  const registros = [];
  const faltando = [];

  for (const [descricao, slug, nome, categoria, preco] of CURADORIA) {
    const linha = porDescricao.get(descricao);
    if (!linha) {
      faltando.push(descricao);
      continue;
    }

    const kcal = numero(linha[col.energia_kcal]);
    if (kcal === 0) {
      faltando.push(`${descricao} (sem energia na fonte)`);
      continue;
    }

    registros.push({
      slug,
      nome,
      categoria,
      kcal,
      proteina: numero(linha[col.proteina_g]),
      carboidrato: numero(linha[col.carboidrato_g]),
      gordura: numero(linha[col.lipideos_g]),
      fibra: numero(linha[col.fibra_g]),
      sodio: numero(linha[col.sodio_mg]),
      preco,
      fonte: FONTE_TACO,
      taco: Number(linha[col.numero_alimento]) || null,
    });
  }

  for (const [
    slug,
    nome,
    categoria,
    kcal,
    proteina,
    carboidrato,
    gordura,
    fibra,
    sodio,
    preco,
    fonte,
  ] of FORA_DA_TACO) {
    registros.push({
      slug,
      nome,
      categoria,
      kcal,
      proteina,
      carboidrato,
      gordura,
      fibra,
      sodio,
      preco,
      fonte,
      taco: null,
    });
  }

  if (faltando.length) {
    console.error("Curadoria aponta para alimentos que nao existem na fonte:");
    for (const f of faltando) console.error(`  - ${f}`);
    process.exit(1);
  }

  const repetidos = registros
    .map((r) => r.slug)
    .filter((s, i, todos) => todos.indexOf(s) !== i);
  if (repetidos.length) {
    console.error(`Slugs repetidos: ${[...new Set(repetidos)].join(", ")}`);
    process.exit(1);
  }

  registros.sort(
    (a, b) =>
      a.categoria.localeCompare(b.categoria, "pt-BR") ||
      a.nome.localeCompare(b.nome, "pt-BR")
  );

  return registros;
}

async function main() {
  const registros = await montarRegistros();

  const valores = registros
    .map(
      (r) =>
        `  (${aspas(r.slug)}, ${aspas(r.nome)}, ${aspas(r.categoria)}, ` +
        `${r.kcal}, ${r.proteina}, ${r.carboidrato}, ${r.gordura}, ` +
        `${r.fibra}, ${r.sodio}, ${r.preco}, ${aspas(r.fonte)}, ${r.taco ?? "null"})`
    )
    .join(",\n");

  const sql = `-- ---------------------------------------------------------------------------
-- MarmitaPRO — base nutricional ancorada na TACO
-- ---------------------------------------------------------------------------
-- GERADO por scripts/gerar-ingredientes.mjs. Não edite à mão: ajuste a
-- curadoria em scripts/curadoria-ingredientes.mjs e rode o script de novo.
--
-- Fonte: Tabela Brasileira de Composição de Alimentos (TACO), 4ª edição
-- revisada e ampliada — NEPA/UNICAMP, 2011. Valores por 100 g.
--
-- Fibra alimentar e sódio entram porque a RDC 429/2020 da Anvisa exige os dois
-- na tabela nutricional de alimento embalado. Sem eles a ficha que o app
-- entrega não serve para rótulo.
--
-- Preço NÃO vem da TACO: é estimativa de varejo, ponto de partida para o
-- usuário substituir pelo que ele realmente paga.
-- ---------------------------------------------------------------------------

alter table public.ingredients
  add column if not exists fibra_g numeric(6, 2) not null default 0
    check (fibra_g >= 0),
  add column if not exists sodio_mg numeric(8, 2) not null default 0
    check (sodio_mg >= 0),
  add column if not exists fonte text not null default 'Nao informada',
  add column if not exists taco_id integer;

comment on column public.ingredients.fonte is
  'De onde vieram os valores nutricionais desta linha.';
comment on column public.ingredients.taco_id is
  'Numero do alimento na TACO 4a edicao, quando a linha vem de la.';

-- Upsert por slug: as receitas apontam para o id do ingrediente, então apagar
-- e recriar quebraria as fichas já montadas. O preço só entra na criação —
-- preço ajustado pelo dono do negócio não é sobrescrito por estimativa nossa.
insert into public.ingredients
  (slug, nome, categoria, kcal, proteina_g, carboidrato_g, gordura_g,
   fibra_g, sodio_mg, preco_medio_kg, fonte, taco_id)
values
${valores}
on conflict (slug) do update set
  nome = excluded.nome,
  categoria = excluded.categoria,
  kcal = excluded.kcal,
  proteina_g = excluded.proteina_g,
  carboidrato_g = excluded.carboidrato_g,
  gordura_g = excluded.gordura_g,
  fibra_g = excluded.fibra_g,
  sodio_mg = excluded.sodio_mg,
  fonte = excluded.fonte,
  taco_id = excluded.taco_id;

-- Entradas da primeira versão do seed que foram substituídas por medições mais
-- precisas. Só saem se nenhuma receita apontar para elas: ficha já montada não
-- pode perder ingrediente por causa de arrumação nossa.
delete from public.ingredients i
where i.slug in (${APOSENTADOS.map(aspas).join(", ")})
  and not exists (
    select 1 from public.recipe_ingredients ri where ri.ingredient_id = i.id
  )
  and not exists (
    select 1 from public.saved_calculations sc
    where sc.itens @> jsonb_build_array(jsonb_build_object('ingredient_id', i.id::text))
  );

-- Qualquer linha que sobrou fora desta migração fica com procedência explícita.
-- Um app que manda o usuário imprimir tabela nutricional não pode apresentar
-- número de origem desconhecida como se fosse medição de laboratório.
update public.ingredients
set fonte = 'Origem nao documentada — confira antes de usar em rotulo'
where fonte = 'Nao informada';
`;

  writeFileSync(DESTINO, sql, "utf8");

  const porCategoria = new Map();
  for (const r of registros) {
    porCategoria.set(r.categoria, (porCategoria.get(r.categoria) ?? 0) + 1);
  }

  console.log(`${registros.length} ingredientes gerados em ${DESTINO}`);
  for (const [c, n] of [...porCategoria].sort()) {
    console.log(`  ${String(n).padStart(3)}  ${c}`);
  }
  console.log(
    `\n  ${registros.filter((r) => r.taco).length} com valores da TACO, ` +
      `${registros.filter((r) => !r.taco).length} de rótulo ou outra fonte`
  );
}

// Só executa quando chamado direto; importar o módulo não gera arquivo.
if (process.argv[1]?.endsWith("gerar-ingredientes.mjs")) {
  main().catch((erro) => {
    console.error(erro.message);
    process.exit(1);
  });
}
