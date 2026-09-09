import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Users } from "lucide-react";

import { TextoRico } from "@/components/conteudo/texto-rico";
import { CapaDaReceita } from "@/components/receitas/capa";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { obterReceita, ROTULO_OBJETIVO } from "@/lib/data/receitas";
import { formatarDecimal, formatarInteiro, formatarMoeda } from "@/lib/format";

type Parametros = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: Parametros): Promise<Metadata> {
  const { slug } = await params;
  const receita = await obterReceita(slug);

  if (!receita) return { title: "Receita não encontrada" };

  return { title: receita.nome, description: receita.descricao };
}

export default async function ReceitaPage({ params }: Parametros) {
  const { slug } = await params;
  const receita = await obterReceita(slug);

  if (!receita) {
    notFound();
  }

  // Sequência da tabela nutricional da RDC 429/2020: a ficha sai na mesma
  // ordem que vai para o rótulo, para conferir linha a linha sem reorganizar.
  const nutrientes = [
    ["Valor energético", receita.totais.kcal, receita.porPorcao.kcal, "kcal", true],
    [
      "Carboidratos",
      receita.totais.carboidrato,
      receita.porPorcao.carboidrato,
      "g",
      false,
    ],
    ["Proteínas", receita.totais.proteina, receita.porPorcao.proteina, "g", false],
    [
      "Gorduras totais",
      receita.totais.gordura,
      receita.porPorcao.gordura,
      "g",
      false,
    ],
    [
      "Fibra alimentar",
      receita.totais.fibra,
      receita.porPorcao.fibra,
      "g",
      false,
    ],
    ["Sódio", receita.totais.sodio, receita.porPorcao.sodio, "mg", true],
  ] as const;

  return (
    <article className="space-y-10">
      <Button asChild variant="ghost" size="sm" className="-ml-3">
        <Link href="/app/receitas">
          <ArrowLeft />
          Voltar para o cardápio
        </Link>
      </Button>

      <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-start">
        <div>
          <Badge variant="outline">{ROTULO_OBJETIVO[receita.objetivo]}</Badge>
          <h1 className="t-h1 mt-4 text-balance">{receita.nome}</h1>
          <p className="t-lead mt-4">{receita.descricao}</p>

          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            <div className="flex items-center gap-2">
              <Users className="size-4 text-muted" aria-hidden="true" />
              <dt className="t-small text-muted">Rende</dt>
              <dd className="t-small font-medium tabular-nums">
                {receita.rendimento_porcoes} porções
              </dd>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-muted" aria-hidden="true" />
              <dt className="t-small text-muted">Preparo</dt>
              <dd className="t-small font-medium tabular-nums">
                {receita.tempo_preparo_minutos} min
              </dd>
            </div>
            <div className="flex items-center gap-2">
              <dt className="t-small text-muted">Custo por porção</dt>
              <dd className="t-small font-medium tabular-nums">
                {formatarMoeda(receita.porPorcao.custo)}
              </dd>
            </div>
          </dl>
        </div>

        <CapaDaReceita
          nome={receita.nome}
          objetivo={receita.objetivo}
          imagemUrl={receita.imagem_url}
          prioridade
          className="aspect-[4/3] w-full rounded-xl border border-border"
        />
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-start">
        <div className="space-y-10">
          <section>
            <h2 className="t-h2">Ingredientes</h2>
            <p className="t-small mt-2 text-muted">
              Quantidades para {receita.rendimento_porcoes} porções.
            </p>

            <ul className="mt-5 divide-y divide-border overflow-hidden rounded-lg border border-border">
              {receita.itens.map((item) => (
                <li
                  key={item.ingrediente.id}
                  className="flex items-center justify-between gap-4 bg-surface px-5 py-3"
                >
                  <span className="min-w-0 text-[0.9375rem]">
                    {item.ingrediente.nome}
                  </span>
                  <span className="t-small shrink-0 tabular-nums text-muted">
                    {formatarInteiro(item.quantidade_g)} g
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="t-h2">Modo de preparo</h2>
            <TextoRico fonte={receita.modo_preparo} className="mt-5" />
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-8">
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <p className="t-eyebrow border-b border-border bg-surface-sunken px-5 py-3">
              Ficha técnica nutricional
            </p>

            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="t-eyebrow px-5 py-2.5 font-medium">
                    Nutriente
                  </th>
                  <th
                    scope="col"
                    className="t-eyebrow px-2 py-2.5 text-right font-medium"
                  >
                    Receita
                  </th>
                  <th
                    scope="col"
                    className="t-eyebrow px-5 py-2.5 text-right font-medium"
                  >
                    Porção
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {nutrientes.map(([rotulo, total, porcao, unidade, inteiro]) => (
                  <tr key={rotulo}>
                    <td className="t-small px-5 py-2.5 text-muted">{rotulo}</td>
                    <td className="t-small px-2 py-2.5 text-right tabular-nums text-muted">
                      {inteiro
                        ? formatarInteiro(total)
                        : formatarDecimal(total)}{" "}
                      {unidade}
                    </td>
                    <td className="t-small px-5 py-2.5 text-right font-medium tabular-nums">
                      {inteiro
                        ? formatarInteiro(porcao)
                        : formatarDecimal(porcao)}{" "}
                      {unidade}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <dl className="grid grid-cols-2 divide-x divide-border border-t border-border">
              <div className="px-5 py-3">
                <dt className="t-small text-muted">Peso por porção</dt>
                <dd className="mt-0.5 text-[0.9375rem] font-medium tabular-nums">
                  {formatarInteiro(receita.porPorcao.pesoTotal)} g
                </dd>
              </div>
              <div className="px-5 py-3">
                <dt className="t-small text-muted">Custo total</dt>
                <dd className="mt-0.5 text-[0.9375rem] font-medium tabular-nums">
                  {formatarMoeda(receita.totais.custo)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <p className="t-h3">Feche o preço desta receita</p>
            <p className="t-small mt-2 text-muted">
              Leve o custo por porção de{" "}
              {formatarMoeda(receita.porPorcao.custo)} para a calculadora e
              descubra por quanto vender.
            </p>
            <Button asChild variant="secondary" size="sm" className="mt-4">
              <Link href="/app/precificacao">Abrir a precificação</Link>
            </Button>
          </div>

          <p className="t-small text-muted">
            Valores nutricionais estimados a partir de tabelas de composição de
            alimentos. O custo usa preços médios de referência e deve ser
            ajustado ao que você paga.
          </p>
        </aside>
      </div>
    </article>
  );
}
