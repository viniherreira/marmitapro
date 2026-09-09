/**
 * Carrega o conteúdo da trilha no banco.
 *
 *   node scripts/aplicar-trilha.mjs
 *
 * A duração de cada aula é calculada a partir do texto, nunca declarada à mão.
 * Antes desta carga o curso dizia "8 min" em aulas de 150 palavras, que se leem
 * em menos de um minuto — o tipo de exagero que o aluno percebe na primeira
 * aula e não esquece mais.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

import { AULAS } from "./curadoria-trilha.mjs";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * 180 palavras por minuto: leitura atenta em português, num texto com número e
 * fórmula no meio. Ritmo de leitura corrida (250 a 300) inflaria a promessa de
 * novo, agora para o outro lado.
 */
const PALAVRAS_POR_MINUTO = 180;

function duracaoEmMinutos(texto) {
  const palavras = texto.trim().split(/\s+/).length;
  return Math.max(3, Math.round(palavras / PALAVRAS_POR_MINUTO));
}

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

async function main() {
  const env = ambiente();
  const db = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/+$/, ""),
    env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );

  const { data: modulos, error } = await db.from("modules").select("id, slug");
  if (error) throw new Error(error.message);
  const porSlug = new Map(modulos.map((m) => [m.slug, m.id]));

  const semModulo = AULAS.filter((a) => !porSlug.has(a.modulo));
  if (semModulo.length) {
    console.error("Aula aponta para modulo inexistente:");
    for (const a of semModulo) console.error(`  - ${a.slug} -> ${a.modulo}`);
    process.exit(1);
  }

  // Os links do conteúdo têm que existir de verdade. Aula que manda o aluno
  // para uma rota morta destrói a confiança mais rápido do que erro de texto.
  const ROTAS = new Set([
    "/app",
    "/app/curso",
    "/app/macros",
    "/app/precificacao",
    "/app/receitas",
    "/app/comunidade",
    "/app/pedidos",
  ]);
  const quebrados = [];
  for (const aula of AULAS) {
    for (const [, destino] of aula.conteudo.matchAll(/\[[^\]]+\]\(([^)\s]+)\)/g)) {
      if (destino.startsWith("https://")) continue;
      const raiz = destino.split(/[?#]/)[0];
      if (!ROTAS.has(raiz)) quebrados.push(`${aula.slug} -> ${destino}`);
    }
  }
  if (quebrados.length) {
    console.error("Link para rota que nao existe:");
    for (const q of quebrados) console.error(`  - ${q}`);
    process.exit(1);
  }

  let totalPalavras = 0;
  let totalMinutos = 0;

  for (const aula of AULAS) {
    const minutos = duracaoEmMinutos(aula.conteudo);
    totalMinutos += minutos;
    totalPalavras += aula.conteudo.trim().split(/\s+/).length;

    const { data: existente } = await db
      .from("lessons")
      .select("id, ordem")
      .eq("slug", aula.slug)
      .maybeSingle();

    if (!existente) {
      console.error(`Aula ${aula.slug} nao existe no banco — ordem indefinida.`);
      process.exit(1);
    }

    const { error: erroUpdate } = await db
      .from("lessons")
      .update({
        module_id: porSlug.get(aula.modulo),
        titulo: aula.titulo,
        resumo: aula.resumo,
        conteudo: aula.conteudo,
        duracao_minutos: minutos,
      })
      .eq("id", existente.id);
    if (erroUpdate) throw new Error(`${aula.slug}: ${erroUpdate.message}`);

    console.log(
      `  ${String(minutos).padStart(2)} min  ` +
        `${String(aula.conteudo.length).padStart(5)} car  ${aula.titulo}`
    );
  }

  console.log(
    `\n${AULAS.length} aulas reescritas | ${totalPalavras} palavras | ` +
      `${totalMinutos} min de leitura`
  );

  // Panorama do curso inteiro, para ver o que ainda falta reescrever.
  const { data: todas } = await db
    .from("lessons")
    .select("slug, conteudo, duracao_minutos");
  const curtas = todas.filter((a) => a.conteudo.length < 1500);
  console.log(
    `\ncurso: ${todas.length} aulas | ` +
      `${todas.reduce((s, a) => s + a.duracao_minutos, 0)} min declarados`
  );
  if (curtas.length) {
    console.log(`ainda por reescrever (menos de 1500 caracteres): ${curtas.length}`);
  }
}

main().catch((erro) => {
  console.error(erro.message);
  process.exit(1);
});
