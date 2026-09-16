/**
 * Processa as fotos das receitas e liga cada uma à sua ficha.
 *
 *   node scripts/aplicar-fotos.mjs [pasta-com-os-originais]
 *
 * Os originais são JPEG de 2K e cerca de 3 MB cada. Versionar isso somaria
 * quase 80 MB ao repositório e faria cada visitante baixar um arquivo de foto
 * profissional para ver um cartão de 400 px.
 *
 * Aqui eles viram WebP de 1400 px na mesma proporção em que as capas aparecem
 * na tela, para o layout não precisar cortar de novo por cima do corte que
 * este script já fez.
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";

import { AJUSTES, FOTOS } from "./curadoria-fotos.mjs";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const ORIGENS = process.argv[2] ?? "C:/Users/mauro/Downloads";
const DESTINO = join(RAIZ, "public", "receitas");

/**
 * 4:3, e a mesma proporcao vale nas duas telas que mostram a capa.
 *
 * Nao e escolha de gosto, e aritmetica: as fotos sao verticais (3:4), entao
 * uma faixa 16:9 captura so 42% da altura e a marmita nao cabe nela. Em 3:2
 * sao 50%, ainda apertado. Em 4:3 sao 56%, que e o suficiente para o
 * recipiente inteiro aparecer.
 *
 * Gravar numa proporcao e exibir em outra corta duas vezes — foi o que deixou
 * as capas com cara de zoom na primeira versao.
 */
const LARGURA = 1400;
const ALTURA = 1050;

/**
 * Centro vertical do recorte, em fração da altura original.
 *
 * O corte por saliência do sharp não serve aqui: ele se prende à janela e à
 * bancada clara, deixa vazio em cima e decepa a marmita embaixo. Nessas fotos
 * verticais o prato está sempre no terço inferior, então a posição fixa
 * enquadra melhor que o algoritmo.
 */
const CENTRO_VERTICAL = 0.66;

async function recortar(entrada, saida, centroVertical) {
  const { width, height } = await sharp(entrada).metadata();

  // Maior janela na proporção final que cabe dentro da foto original.
  let larguraJanela = width;
  let alturaJanela = Math.round((width * ALTURA) / LARGURA);
  if (alturaJanela > height) {
    alturaJanela = height;
    larguraJanela = Math.round((height * LARGURA) / ALTURA);
  }

  const topoIdeal = Math.round(height * centroVertical - alturaJanela / 2);
  const topo = Math.max(0, Math.min(topoIdeal, height - alturaJanela));
  const esquerda = Math.round((width - larguraJanela) / 2);

  await sharp(entrada)
    .extract({
      left: esquerda,
      top: topo,
      width: larguraJanela,
      height: alturaJanela,
    })
    .resize(LARGURA, ALTURA)
    .webp({ quality: 82 })
    .toFile(saida);
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
  if (!existsSync(ORIGENS)) {
    console.error(`Pasta nao encontrada: ${ORIGENS}`);
    process.exit(1);
  }

  mkdirSync(DESTINO, { recursive: true });

  const arquivos = readdirSync(ORIGENS).filter((a) =>
    /\.(jpe?g|png|webp)$/i.test(a)
  );

  const usados = new Set();
  const processados = [];
  const semArquivo = [];

  for (const [prefixo, slug] of Object.entries(FOTOS)) {
    const achado = arquivos.find((a) => a.startsWith(prefixo));
    if (!achado) {
      semArquivo.push(`${slug} (esperava arquivo comecando com "${prefixo}")`);
      continue;
    }
    if (usados.has(achado)) {
      console.error(`Arquivo ${achado} mapeado para mais de uma receita.`);
      process.exit(1);
    }
    usados.add(achado);

    const entrada = join(ORIGENS, achado);
    const saida = join(DESTINO, `${slug}.webp`);

    await recortar(entrada, saida, AJUSTES[slug] ?? CENTRO_VERTICAL);

    processados.push({
      slug,
      origem: achado,
      bytesOriginal: statSync(entrada).size,
      bytesFinal: statSync(saida).size,
    });
  }

  if (semArquivo.length) {
    console.error("Sem arquivo correspondente:");
    for (const s of semArquivo) console.error(`  - ${s}`);
    process.exit(1);
  }

  const totalAntes = processados.reduce((s, p) => s + p.bytesOriginal, 0);
  const totalDepois = processados.reduce((s, p) => s + p.bytesFinal, 0);

  for (const p of processados) {
    console.log(
      `  ${p.slug.padEnd(42)} ${(p.bytesFinal / 1024).toFixed(0).padStart(4)} KB` +
        `   (era ${(p.bytesOriginal / 1024 / 1024).toFixed(1)} MB)`
    );
  }
  console.log(
    `\n${processados.length} fotos | ` +
      `${(totalAntes / 1024 / 1024).toFixed(0)} MB -> ` +
      `${(totalDepois / 1024 / 1024).toFixed(1)} MB`
  );

  // --- liga no banco --------------------------------------------------------
  const env = ambiente();
  const db = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/+$/, ""),
    env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );

  for (const p of processados) {
    const { error } = await db
      .from("recipes")
      .update({ imagem_url: `/receitas/${p.slug}.webp` })
      .eq("slug", p.slug);
    if (error) throw new Error(`${p.slug}: ${error.message}`);
  }

  const { data: restantes } = await db
    .from("recipes")
    .select("slug")
    .eq("publica", true)
    .is("imagem_url", null);

  console.log(`\n${processados.length} receitas ligadas a foto.`);
  if (restantes?.length) {
    console.log(`ainda sem foto (${restantes.length}):`);
    for (const r of restantes) console.log(`  - ${r.slug}`);
  }
}

main().catch((erro) => {
  console.error(erro.message);
  process.exit(1);
});
