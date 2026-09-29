import {
  BookOpen,
  Calculator,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Scale,
  Users,
  type LucideIcon,
} from "lucide-react";

export type ItemDeNavegacao = {
  href: string;
  rotulo: string;
  rotuloCurto: string;
  icone: LucideIcon;
  faseDois?: boolean;
};

/** Navegação principal do app. A ordem vale para a sidebar e para a barra inferior. */
export const NAVEGACAO_APP: ItemDeNavegacao[] = [
  {
    href: "/app",
    rotulo: "Painel",
    rotuloCurto: "Painel",
    icone: LayoutDashboard,
  },
  {
    href: "/app/curso",
    rotulo: "Trilha do curso",
    rotuloCurto: "Trilha",
    icone: BookOpen,
  },
  {
    href: "/app/macros",
    rotulo: "Calculadora de macros",
    rotuloCurto: "Macros",
    icone: Scale,
  },
  {
    href: "/app/precificacao",
    rotulo: "Precificação",
    rotuloCurto: "Preço",
    icone: Calculator,
  },
  {
    href: "/app/receitas",
    rotulo: "Receitas",
    rotuloCurto: "Receitas",
    icone: BookOpen,
  },
  {
    href: "/app/pedidos",
    rotulo: "Pedidos",
    rotuloCurto: "Pedidos",
    icone: ClipboardList,
  },
  {
    href: "/app/comunidade",
    rotulo: "Comunidade",
    rotuloCurto: "Comunidade",
    icone: Users,
  },
  {
    href: "/app/assinatura",
    rotulo: "Assinatura",
    rotuloCurto: "Assinatura",
    icone: CreditCard,
  },
];

/**
 * Rotas reservadas para o que ainda vem. Aparecem na sidebar sob "Em breve";
 * com a lista vazia, a seção some.
 */
export const NAVEGACAO_FASE_2: ItemDeNavegacao[] = [];

/**
 * Itens da barra inferior no mobile — cinco no máximo, por conforto de toque.
 * Comunidade, assinatura e pedidos ficam de fora: as três têm entrada própria
 * no painel, que é a primeira tela de quem abre o app no celular.
 */
const FORA_DA_BARRA = new Set(["/app/comunidade", "/app/assinatura", "/app/pedidos"]);

export const NAVEGACAO_MOBILE: ItemDeNavegacao[] = NAVEGACAO_APP.filter(
  (item) => !FORA_DA_BARRA.has(item.href)
);

export function rotaAtiva(pathname: string, href: string): boolean {
  if (href === "/app") return pathname === "/app";
  return pathname === href || pathname.startsWith(`${href}/`);
}
