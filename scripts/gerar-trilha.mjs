/**
 * Gera a migração do conteúdo da trilha a partir de `curadoria-trilha.mjs`.
 *
 *   node scripts/gerar-trilha.mjs
 *
 * As aulas já existem no seed inicial — o que muda aqui é o conteúdo. Por isso
 * a migração é UPDATE por slug, e não inserção: `module_id` e `ordem` continuam
 * sendo responsabilidade do seed.
 *
 * A duração é recalculada do texto, igual ao carregador, para os dois caminhos
 * chegarem no mesmo número.
 */

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { AULAS } from "./curadoria-trilha.mjs";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const DESTINO = join(
  RAIZ,
  "supabase",
  "migrations",
  "20260908140000_trilha_reescrita.sql"
);

const PALAVRAS_POR_MINUTO = 180;

const duracao = (texto) =>
  Math.max(3, Math.round(texto.trim().split(/\s+/).length / PALAVRAS_POR_MINUTO));

const aspas = (s) => `'${String(s).replace(/'/g, "''")}'`;

const atualizacoes = AULAS.map(
  (a) => `update public.lessons set
  titulo = ${aspas(a.titulo)},
  resumo = ${aspas(a.resumo)},
  duracao_minutos = ${duracao(a.conteudo)},
  conteudo = ${aspas(a.conteudo)}
where slug = ${aspas(a.slug)};`
).join("\n\n");

const palavras = AULAS.reduce(
  (s, a) => s + a.conteudo.trim().split(/\s+/).length,
  0
);
const minutos = AULAS.reduce((s, a) => s + duracao(a.conteudo), 0);

const sql = `-- ---------------------------------------------------------------------------
-- MarmitaPRO — trilha reescrita
-- ---------------------------------------------------------------------------
-- GERADO por scripts/gerar-trilha.mjs. Não edite à mão: ajuste
-- scripts/curadoria-trilha.mjs e rode o script de novo.
--
-- O conteúdo anterior tinha cerca de 850 caracteres por aula e declarava 7 a 9
-- minutos de duração — um texto de 150 palavras se lê em menos de um minuto.
-- Aqui são ${palavras} palavras no total, e a duração de cada aula é calculada
-- a partir do próprio texto (${minutos} minutos somados).
--
-- Toda aula fecha com "Faça agora", levando para a ferramenta correspondente
-- do app. Os links usam o subconjunto de Markdown de lib/markdown.ts, que só
-- aceita rota interna ou https.
-- ---------------------------------------------------------------------------

${atualizacoes}
`;

writeFileSync(DESTINO, sql, "utf8");

console.log(`${AULAS.length} aulas em ${DESTINO}`);
console.log(`${palavras} palavras | ${minutos} min de leitura`);
