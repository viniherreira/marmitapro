/**
 * Transforma os arquivos originais da marca em assets de web.
 *
 *   node scripts/gerar-marca.mjs [pasta-com-os-originais]
 *
 * Os originais vêm em JPEG sobre fundo branco, com 1 a 2 MB cada. Isso não
 * serve para web: JPEG não tem transparência, então o logo carregaria um
 * retângulo branco por cima de qualquer fundo — e no tema escuro isso é um
 * bloco claro no meio da tela.
 *
 * O que o script faz:
 *  - recorta a moldura branca em volta da arte
 *  - transforma o branco em transparência, com borda suave para o traço não
 *    ficar serrilhado
 *  - gera a variante clara, para o logo aparecer sobre fundo escuro
 *  - exporta os tamanhos de ícone que a PWA e o navegador pedem
 */

import { existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const ORIGENS = process.argv[2] ?? "C:/Users/mauro/Downloads";
const PUBLICO = join(RAIZ, "public");
const MARCA = join(PUBLICO, "marca");

const SIMBOLO = join(ORIGENS, "logo.jpeg");
const LOGOTIPO = join(ORIGENS, "logo marmita pro.jpeg");

/** Tom claro da variante para fundo escuro — o --foreground do tema escuro. */
const CLARO = { r: 242, g: 243, b: 239 };

/**
 * Branco vira transparente com rampa suave.
 *
 * Corte seco deixaria o traço serrilhado, porque o JPEG espalha o contorno em
 * dezenas de tons intermediários. A rampa preserva a borda desenhada.
 */
const OPACO_ATE = 225;
const TRANSPARENTE_A_PARTIR = 250;

async function comAlfa(caminho, { recolorirVerde = false } = {}) {
  const { data, info } = await sharp(caminho)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const canais = info.channels;
  const saida = Buffer.alloc(info.width * info.height * 4);

  for (let p = 0, q = 0; p < data.length; p += canais, q += 4) {
    let r = data[p];
    let g = data[p + 1];
    let b = data[p + 2];

    const luz = 0.299 * r + 0.587 * g + 0.114 * b;

    let alfa = 255;
    if (luz >= TRANSPARENTE_A_PARTIR) alfa = 0;
    else if (luz > OPACO_ATE) {
      alfa = Math.round(
        255 * (1 - (luz - OPACO_ATE) / (TRANSPARENTE_A_PARTIR - OPACO_ATE))
      );
    }

    if (recolorirVerde && alfa > 0) {
      // Decidir por família de cor, não por distância: o pixel de borda é
      // mistura de verde com branco, fica longe do verde puro e escapava do
      // corte — o resultado era um contorno cinza em volta das letras.
      //
      // Aqui tudo que não for da família do laranja vira o tom claro, e a
      // suavização da borda continua viva no canal alfa, que já foi calculado
      // a partir da luminância.
      const ehLaranja = r > g + 40 && r > b + 60;
      if (!ehLaranja) {
        r = CLARO.r;
        g = CLARO.g;
        b = CLARO.b;
      }
    }

    saida[q] = r;
    saida[q + 1] = g;
    saida[q + 2] = b;
    saida[q + 3] = alfa;
  }

  return sharp(saida, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim({ threshold: 1 })
    .png();
}

async function main() {
  for (const arquivo of [SIMBOLO, LOGOTIPO]) {
    if (!existsSync(arquivo)) {
      console.error(`Nao encontrei ${arquivo}`);
      process.exit(1);
    }
  }

  mkdirSync(MARCA, { recursive: true });

  // --- símbolo --------------------------------------------------------------
  const simbolo = await comAlfa(SIMBOLO);
  const simboloBuffer = await simbolo.toBuffer();
  const dim = await sharp(simboloBuffer).metadata();
  console.log(`simbolo recortado: ${dim.width}x${dim.height}`);

  await sharp(simboloBuffer)
    .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(join(MARCA, "simbolo.png"));

  const simboloClaro = await comAlfa(SIMBOLO, { recolorirVerde: true });
  await simboloClaro
    .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(join(MARCA, "simbolo-claro.png"));

  // --- logotipo horizontal --------------------------------------------------
  const logotipo = await comAlfa(LOGOTIPO);
  const logotipoBuffer = await logotipo.toBuffer();
  const dimLogo = await sharp(logotipoBuffer).metadata();
  console.log(`logotipo recortado: ${dimLogo.width}x${dimLogo.height}`);

  await sharp(logotipoBuffer)
    .resize({ height: 160, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(join(MARCA, "logotipo.png"));

  const logotipoClaro = await comAlfa(LOGOTIPO, { recolorirVerde: true });
  await logotipoClaro
    .resize({ height: 160, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(join(MARCA, "logotipo-claro.png"));

  // --- ícones da PWA --------------------------------------------------------
  // Fundo sólido: ícone de app não pode ser transparente, senão o sistema
  // coloca preto atrás e o verde da marca some.
  const FUNDO = { r: 250, g: 250, b: 248, alpha: 1 };

  /**
   * O sharp aplica `resize` antes de `extend`, e a última chamada de resize na
   * mesma cadeia substitui a anterior — encadear os dois dá um arquivo maior
   * que o pedido. Por isso são dois passes: primeiro a arte no tamanho
   * interno, depois a moldura.
   */
  async function icone(lado, proporcaoDaArte, destino) {
    const interno = Math.round(lado * proporcaoDaArte);
    const margem = Math.round((lado - interno) / 2);

    const arte = await sharp(simboloBuffer)
      .resize(interno, interno, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .toBuffer();

    await sharp(arte)
      .extend({
        top: margem,
        bottom: lado - interno - margem,
        left: margem,
        right: lado - interno - margem,
        background: FUNDO,
      })
      .flatten({ background: FUNDO })
      .png({ compressionLevel: 9 })
      .toFile(destino);
  }

  await icone(192, 0.78, join(PUBLICO, "icone-192.png"));
  await icone(512, 0.78, join(PUBLICO, "icone-512.png"));
  // Maskable: o sistema recorta em círculo, então a arte fica dentro de 60%.
  await icone(512, 0.6, join(PUBLICO, "icone-maskable-512.png"));
  await icone(180, 0.82, join(PUBLICO, "apple-touch-icon.png"));
  // Favicon que o Next serve a partir de app/icon.png
  await icone(64, 0.84, join(RAIZ, "app", "icon.png"));

  console.log("\ngerados:");
  for (const arq of [
    "public/marca/simbolo.png",
    "public/marca/simbolo-claro.png",
    "public/marca/logotipo.png",
    "public/marca/logotipo-claro.png",
    "public/icone-192.png",
    "public/icone-512.png",
    "public/icone-maskable-512.png",
    "public/apple-touch-icon.png",
    "app/icon.png",
  ]) {
    const info = await sharp(join(RAIZ, arq)).metadata();
    const bytes = statSync(join(RAIZ, arq)).size;
    console.log(
      `  ${arq.padEnd(34)} ${String(info.width).padStart(4)}x${String(info.height).padEnd(4)}  ` +
        `${(bytes / 1024).toFixed(1).padStart(6)} KB`
    );
  }
}

main().catch((erro) => {
  console.error(erro.message);
  process.exit(1);
});
