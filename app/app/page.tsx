import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  MessageCircle,
  PlayCircle,
  Scale,
  Utensils,
} from "lucide-react";

import { CabecalhoDePagina } from "@/components/app/cabecalho-de-pagina";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Progress } from "@/components/ui/progress";
import { garantirPerfil, primeiroNome } from "@/lib/auth/perfil";
import { grupoConfigurado } from "@/lib/content/comunidade";
import { carregarTrilha } from "@/lib/data/curso";
import { listarCalculosSalvos, listarCenarios } from "@/lib/data/ferramentas";
import { formatarInteiro, formatarMoeda } from "@/lib/format";

export const metadata: Metadata = { title: "Painel" };

const ATALHOS = [
  {
    href: "/app/precificacao",
    icone: Calculator,
    titulo: "Calcular um preço",
    texto: "Descubra o custo real e o preço que fecha a margem.",
  },
  {
    href: "/app/macros",
    icone: Scale,
    titulo: "Montar uma ficha",
    texto: "Some os ingredientes e tire a ficha nutricional.",
  },
  {
    href: "/app/receitas",
    icone: Utensils,
    titulo: "Ver o banco de receitas",
    texto: "Cardápio pronto, com custo estimado por porção.",
  },
];

export default async function PainelPage() {
  const perfil = await garantirPerfil();

  const [trilha, calculos, cenarios] = await Promise.all([
    carregarTrilha(perfil.id),
    listarCalculosSalvos(perfil.id, 4),
    listarCenarios(perfil.id, 3),
  ]);

  const percentual = Math.round(trilha.progresso * 100);

  return (
    <div className="space-y-10">
      <CabecalhoDePagina
        sobrelinha="Painel"
        titulo={`Bom te ver ${primeiroNome(perfil)}.`}
        descricao="Um lugar só para o que você precisa fazer hoje: avançar a trilha e fechar as contas da semana."
      />

      {/* Trilha ------------------------------------------------------- */}
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="t-eyebrow">Próxima aula</p>
                <CardTitle className="mt-2 text-balance">
                  {trilha.proximaAula
                    ? trilha.proximaAula.titulo
                    : "Você concluiu a trilha inteira"}
                </CardTitle>
              </div>
              {trilha.proximaAula ? (
                <Badge variant="primary" className="shrink-0">
                  {trilha.proximaAula.moduloTitulo}
                </Badge>
              ) : (
                <Badge variant="success" className="shrink-0">
                  Completa
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <p className="t-body text-muted">
              {trilha.proximaAula
                ? trilha.proximaAula.resumo
                : "Todas as aulas foram marcadas como concluídas. Volte quando quiser revisar um módulo."}
            </p>

            {trilha.proximaAula ? (
              <Button asChild>
                <Link
                  href={`/app/curso/${trilha.proximaAula.moduloSlug}/${trilha.proximaAula.slug}`}
                >
                  <PlayCircle />
                  Continuar de onde parei
                </Link>
              </Button>
            ) : (
              <Button asChild variant="secondary">
                <Link href="/app/curso">Revisar a trilha</Link>
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <p className="t-eyebrow">Seu progresso</p>
            <p className="t-metric mt-2" data-numeric>
              {percentual}%
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress
              value={percentual}
              aria-label={`Progresso da trilha: ${percentual}%`}
            />
            <dl className="space-y-2 border-t border-border pt-4 text-[0.8125rem]">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Aulas concluídas</dt>
                <dd className="tabular-nums">
                  {trilha.aulasConcluidas} de {trilha.totalAulas}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Módulos</dt>
                <dd className="tabular-nums">{trilha.modulos.length}</dd>
              </div>
            </dl>
            <Button asChild variant="ghost" size="sm" className="-ml-3">
              <Link href="/app/curso">
                Ver a trilha
                <ArrowRight />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Atalhos ------------------------------------------------------ */}
      <section>
        <h2 className="t-eyebrow">Ferramentas do dia a dia</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {ATALHOS.map((atalho) => {
            const Icone = atalho.icone;
            return (
              <Link
                key={atalho.href}
                href={atalho.href}
                className="group rounded-lg border border-border bg-surface p-5 transition-[border-color,background-color] duration-150 hover:border-border-strong hover:bg-surface-hover"
              >
                <span className="grid size-9 place-items-center rounded-lg border border-border bg-surface-sunken text-primary">
                  <Icone className="size-4" aria-hidden="true" />
                </span>
                <p className="t-h3 mt-4">{atalho.titulo}</p>
                <p className="t-small mt-1.5 text-muted">{atalho.texto}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Comunidade ---------------------------------------------------
          Entrada principal no celular: a barra inferior guarda cinco itens e
          a comunidade fica de fora, então ela precisa existir aqui. */}
      {grupoConfigurado ? (
        <section>
          <Link
            href="/app/comunidade"
            className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-lg border border-border bg-surface px-5 py-4 transition-[border-color,background-color] duration-150 hover:border-border-strong hover:bg-surface-hover"
          >
            <span className="flex items-center gap-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-primary-soft text-primary">
                <MessageCircle className="size-4" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-[0.9375rem] font-medium">
                  Grupo da comunidade no WhatsApp
                </span>
                <span className="t-small block text-muted">
                  Preço praticado, fornecedor e cardápio com quem já vende.
                </span>
              </span>
            </span>
            <span className="t-small flex items-center gap-1.5 text-primary">
              Ver a comunidade
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </span>
          </Link>
        </section>
      ) : null}

      {/* Receitas salvas ---------------------------------------------- */}
      <section>
        <div className="flex items-end justify-between gap-4">
          <h2 className="t-eyebrow">Receitas salvas recentemente</h2>
          {calculos.length > 0 ? (
            <Button asChild variant="ghost" size="sm">
              <Link href="/app/macros">
                Ver todas
                <ArrowRight />
              </Link>
            </Button>
          ) : null}
        </div>

        {calculos.length === 0 ? (
          <EmptyState
            className="mt-5"
            icon={BookOpen}
            title="Nenhuma receita salva ainda"
            description="Monte uma receita na calculadora de macros e salve para consultar a ficha depois."
            action={
              <Button asChild size="sm">
                <Link href="/app/macros">Abrir a calculadora</Link>
              </Button>
            }
          />
        ) : (
          <ul className="mt-5 divide-y divide-border overflow-hidden rounded-lg border border-border">
            {calculos.map((calculo) => (
              <li
                key={calculo.id}
                className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 bg-surface px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="t-h3 truncate">{calculo.nome}</p>
                  <p className="t-small text-muted">
                    {calculo.porcoes}{" "}
                    {calculo.porcoes === 1 ? "porção" : "porções"} ·{" "}
                    {formatarInteiro(
                      Number(calculo.kcal_total) / calculo.porcoes
                    )}{" "}
                    kcal por porção
                  </p>
                </div>
                <span className="t-small shrink-0 tabular-nums text-muted">
                  custo {formatarMoeda(Number(calculo.custo_total))}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Cenários de preço -------------------------------------------- */}
      {cenarios.length > 0 ? (
        <section>
          <div className="flex items-end justify-between gap-4">
            <h2 className="t-eyebrow">Últimos cenários de preço</h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/app/precificacao">
                Ver todos
                <ArrowRight />
              </Link>
            </Button>
          </div>

          <ul className="mt-5 divide-y divide-border overflow-hidden rounded-lg border border-border">
            {cenarios.map((cenario) => (
              <li
                key={cenario.id}
                className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 bg-surface px-5 py-4"
              >
                <p className="t-h3 min-w-0 truncate">{cenario.nome}</p>
                <span className="t-small shrink-0 tabular-nums text-muted">
                  margem{" "}
                  {Math.round(Number(cenario.margem_desejada) * 100)}% ·{" "}
                  {cenario.volume_mensal} un/mês
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
