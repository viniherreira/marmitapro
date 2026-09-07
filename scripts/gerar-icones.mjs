/**
 * Gera os ícones PNG do PWA a partir da marca, sem dependência externa.
 *
 *   node scripts/gerar-icones.mjs
 *
 * O desenho usa funções de distância com sombreamento suave, então as bordas
 * saem antisserrilhadas sem precisar de biblioteca de imagem.
 */

import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");

const VERDE = [0x12, 0x3b, 0x2e];
const CLARO = [0xfa, 0xfa, 0xf8];
const LIMAO = [0xa3, 0xe6, 0x35];

// --- PNG --------------------------------------------------------------------

const TABELA_CRC = (() => {
  const tabela = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    tabela[n] = c >>> 0;
  }
  return tabela;
})();

function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) {
    c = TABELA_CRC[(c ^ byte) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function bloco(tipo, dados) {
  const tamanho = Buffer.alloc(4);
  tamanho.writeUInt32BE(dados.length);

  const corpo = Buffer.concat([Buffer.from(tipo, "ascii"), dados]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(corpo));

  return Buffer.concat([tamanho, corpo, crc]);
}

function comoPng(largura, altura, rgba) {
  const linhas = Buffer.alloc((largura * 4 + 1) * altura);
  for (let y = 0; y < altura; y += 1) {
    const origem = y * largura * 4;
    const destino = y * (largura * 4 + 1);
    linhas[destino] = 0; // filtro "none"
    rgba.copy(linhas, destino + 1, origem, origem + largura * 4);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(largura, 0);
  ihdr.writeUInt32BE(altura, 4);
  ihdr[8] = 8; // profundidade
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    bloco("IHDR", ihdr),
    bloco("IDAT", deflateSync(linhas, { level: 9 })),
    bloco("IEND", Buffer.alloc(0)),
  ]);
}

// --- Geometria --------------------------------------------------------------

function sdRoundRect(px, py, cx, cy, meiaLargura, meiaAltura, raio) {
  const qx = Math.abs(px - cx) - (meiaLargura - raio);
  const qy = Math.abs(py - cy) - (meiaAltura - raio);
  const fora = Math.hypot(Math.max(qx, 0), Math.max(qy, 0));
  return fora + Math.min(Math.max(qx, qy), 0) - raio;
}

function sdSegmento(px, py, ax, ay, bx, by) {
  const pax = px - ax;
  const pay = py - ay;
  const bax = bx - ax;
  const bay = by - ay;
  const h = Math.min(
    1,
    Math.max(0, (pax * bax + pay * bay) / (bax * bax + bay * bay))
  );
  return Math.hypot(pax - bax * h, pay - bay * h);
}

function cobertura(distancia) {
  return Math.min(1, Math.max(0, 0.5 - distancia));
}

function misturar(alvo, indice, cor, alfa) {
  if (alfa <= 0) return;
  const inverso = 1 - alfa;
  alvo[indice] = Math.round(alvo[indice] * inverso + cor[0] * alfa);
  alvo[indice + 1] = Math.round(alvo[indice + 1] * inverso + cor[1] * alfa);
  alvo[indice + 2] = Math.round(alvo[indice + 2] * inverso + cor[2] * alfa);
  alvo[indice + 3] = Math.round(alvo[indice + 3] * inverso + 255 * alfa);
}

/**
 * @param {number} tamanho lado do PNG em pixels
 * @param {boolean} maskable fundo sangrado e glifo dentro da zona segura
 */
function desenharIcone(tamanho, maskable) {
  const pixels = Buffer.alloc(tamanho * tamanho * 4, 0);

  const centro = tamanho / 2;
  const raioFundo = maskable ? tamanho : tamanho * 0.22;
  const meioFundo = tamanho / 2;

  // proporção do glifo: menor no maskable, para respeitar a zona segura
  const escala = maskable ? 0.5 : 0.62;
  const glifo = tamanho * escala;
  const meioGlifo = glifo / 2;
  const traco = Math.max(1, tamanho * (maskable ? 0.036 : 0.045));
  const meioTraco = traco / 2;

  for (let y = 0; y < tamanho; y += 1) {
    for (let x = 0; x < tamanho; x += 1) {
      const px = x + 0.5;
      const py = y + 0.5;
      const indice = (y * tamanho + x) * 4;

      // fundo
      const dFundo = sdRoundRect(
        px,
        py,
        centro,
        centro,
        meioFundo,
        meioFundo,
        raioFundo
      );
      misturar(pixels, indice, VERDE, cobertura(dFundo));

      // bandeja: retângulo arredondado vazado
      const dBandeja =
        Math.abs(
          sdRoundRect(
            px,
            py,
            centro,
            centro,
            meioGlifo,
            meioGlifo * 0.78,
            glifo * 0.17
          )
        ) - meioTraco;
      misturar(pixels, indice, CLARO, cobertura(dBandeja));

      // divisória vertical
      const topo = centro - meioGlifo * 0.78 + meioTraco;
      const base = centro + meioGlifo * 0.78 - meioTraco;
      const divisor = centro + meioGlifo * 0.14;
      const dDivisor =
        sdSegmento(px, py, divisor, topo, divisor, base) - meioTraco;
      misturar(pixels, indice, CLARO, cobertura(dDivisor));

      // divisória horizontal do lado direito
      const dHorizontal =
        sdSegmento(
          px,
          py,
          divisor,
          centro,
          centro + meioGlifo - meioTraco,
          centro
        ) - meioTraco;
      misturar(pixels, indice, CLARO, cobertura(dHorizontal));

      // porção redonda à esquerda, em verde-limão
      const dCirculo =
        Math.abs(
          Math.hypot(px - (centro - meioGlifo * 0.45), py - centro) -
            glifo * 0.19
        ) - meioTraco;
      misturar(pixels, indice, LIMAO, cobertura(dCirculo));
    }
  }

  return comoPng(tamanho, tamanho, pixels);
}

// --- Saída ------------------------------------------------------------------

const arquivos = [
  { caminho: "public/icone-192.png", tamanho: 192, maskable: false },
  { caminho: "public/icone-512.png", tamanho: 512, maskable: false },
  { caminho: "public/icone-maskable-512.png", tamanho: 512, maskable: true },
  { caminho: "public/apple-touch-icon.png", tamanho: 180, maskable: true },
  { caminho: "app/icon.png", tamanho: 256, maskable: false },
];

for (const arquivo of arquivos) {
  const destino = join(RAIZ, arquivo.caminho);
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(destino, desenharIcone(arquivo.tamanho, arquivo.maskable));
  process.stdout.write(`gerado ${arquivo.caminho}\n`);
}
