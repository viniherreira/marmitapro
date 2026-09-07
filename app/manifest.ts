import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MarmitaPRO — trilha e ferramentas para marmita fit",
    short_name: "MarmitaPRO",
    description:
      "A trilha e as ferramentas para montar e operar um negócio de marmitas fit: calculadora de macros, precificação e banco de receitas.",
    id: "/app",
    start_url: "/app",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    lang: "pt-BR",
    dir: "ltr",
    background_color: "#fafaf8",
    theme_color: "#123b2e",
    categories: ["business", "food", "education", "productivity"],
    icons: [
      {
        src: "/icone-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icone-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icone-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Calculadora de precificação",
        short_name: "Preço",
        url: "/app/precificacao",
      },
      {
        name: "Calculadora de macros",
        short_name: "Macros",
        url: "/app/macros",
      },
      { name: "Banco de receitas", short_name: "Receitas", url: "/app/receitas" },
    ],
  };
}
