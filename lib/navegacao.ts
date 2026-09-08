import {
  BookOpen,
  Calculator,
  ClipboardList,
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
    href: "/app/comunidade",
    rotulo: "Comunidade",
    rotuloCurto: "Comunidade",
    icone: Users,
  },
];

/** Rotas já reservadas para a fase 2. Aparecem na sidebar, marcadas. */
export const NAVEGACAO_FASE_2: ItemDeNavegacao[] = [
  {
    href: "/app/pedidos",
    rotulo: "Pedidos",
    rotuloCurto: "Pedidos",
    icone: ClipboardList,
    faseDois: true,
  },
];

/**
 * Itens da barra inferior no mobile — cinco no máximo, por conforto de toque.
 * A comunidade fica de fora: é visita ocasional, e ela tem entrada própria no
 * painel, que é a primeira tela de quem abre o app no celular.
 */
export const NAVEGACAO_MOBILE: ItemDeNavegacao[] = NAVEGACAO_APP.filter(
  (item) => item.href !== "/app/comunidade"
);

export function rotaAtiva(pathname: string, href: string): boolean {
  if (href === "/app") return pathname === "/app";
  return pathname === href || pathname.startsWith(`${href}/`);
}
