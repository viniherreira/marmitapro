import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { ptBR } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";

import { aparenciaClerk } from "@/components/auth/aparencia-clerk";
import { RegistrarServiceWorker } from "@/components/pwa/registrar-service-worker";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { clerkConfigurado, urlDoApp } from "@/lib/env";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(urlDoApp()),
  title: {
    default: "MarmitaPRO — monte e opere seu negócio de marmitas fit",
    template: "%s · MarmitaPRO",
  },
  description:
    "O único app que ensina você a vender marmita fit e ainda cuida da gestão do seu negócio no dia a dia — de calcular macro a fechar pedido.",
  applicationName: "MarmitaPRO",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "MarmitaPRO",
    statusBarStyle: "default",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "MarmitaPRO",
    title: "MarmitaPRO — monte e opere seu negócio de marmitas fit",
    description:
      "Trilha prática, calculadora de macros, precificação aberta e banco de receitas. Conteúdo e ferramenta no mesmo lugar.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf8" },
    { media: "(prefers-color-scheme: dark)", color: "#0e100f" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const documento = (
    // As variáveis de fonte ficam no <html>: os tokens --font-body e
    // --font-heading são resolvidos no :root e precisam enxergá-las ali.
    <html
      lang="pt-BR"
      className={`${inter.variable} ${fraunces.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <ThemeProvider>
          {children}
          <Toaster />
          <RegistrarServiceWorker />
        </ThemeProvider>
      </body>
    </html>
  );

  // Sem as chaves do Clerk o provider não é montado, para que a landing e o
  // design system continuem funcionando durante a configuração do ambiente.
  if (!clerkConfigurado) {
    return documento;
  }

  return (
    <ClerkProvider localization={ptBR} appearance={aparenciaClerk}>
      {documento}
    </ClerkProvider>
  );
}
