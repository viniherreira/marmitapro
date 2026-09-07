import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Clock } from "lucide-react";

import { TextoRico } from "@/components/conteudo/texto-rico";
import { BotaoConcluir } from "@/components/curso/botao-concluir";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { garantirPerfil } from "@/lib/auth/perfil";
import { carregarAula } from "@/lib/data/curso";

type Parametros = { params: Promise<{ modulo: string; aula: string }> };

export async function generateMetadata({
  params,
}: Parametros): Promise<Metadata> {
  const { modulo, aula } = await params;
  const perfil = await garantirPerfil();
  const detalhe = await carregarAula(perfil.id, modulo, aula);

  if (!detalhe) return { title: "Aula não encontrada" };

  return { title: detalhe.aula.titulo, description: detalhe.aula.resumo };
}

export default async function AulaPage({ params }: Parametros) {
  const { modulo: moduloSlug, aula: aulaSlug } = await params;
  const perfil = await garantirPerfil();
  const detalhe = await carregarAula(perfil.id, moduloSlug, aulaSlug);

  if (!detalhe) {
    notFound();
  }

  const { aula, modulo, concluida, anterior, proxima, posicao, totalNoModulo } =
    detalhe;

  return (
    <article className="mx-auto max-w-3xl">
      <Button asChild variant="ghost" size="sm" className="-ml-3">
        <Link href="/app/curso">
          <ArrowLeft />
          Voltar para a trilha
        </Link>
      </Button>

      <header className="mt-6 border-b border-border pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="primary">{modulo.titulo}</Badge>
          <span className="t-small tabular-nums text-muted">
            Aula {posicao} de {totalNoModulo}
          </span>
          <span className="t-small flex items-center gap-1.5 tabular-nums text-muted">
            <Clock className="size-3.5" aria-hidden="true" />
            {aula.duracao_minutos} min
          </span>
          {concluida ? (
            <Badge variant="success">
              <Check />
              Concluída
            </Badge>
          ) : null}
        </div>

        <h1 className="t-h1 mt-5 text-balance">{aula.titulo}</h1>
        <p className="t-lead mt-4">{aula.resumo}</p>
      </header>

      {aula.video_url ? (
        <div className="mt-8 overflow-hidden rounded-xl border border-border bg-surface-sunken">
          <div className="aspect-video">
            <iframe
              src={aula.video_url}
              title={`Vídeo da aula: ${aula.titulo}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="size-full border-0"
            />
          </div>
        </div>
      ) : null}

      <TextoRico fonte={aula.conteudo} className="mt-8" />

      <div className="mt-12 border-t border-border pt-8">
        <BotaoConcluir lessonId={aula.id} concluida={concluida} />
      </div>

      <nav
        aria-label="Navegação entre aulas"
        className="mt-8 grid gap-3 border-t border-border pt-8 sm:grid-cols-2"
      >
        {anterior ? (
          <Link
            href={`/app/curso/${modulo.slug}/${anterior.slug}`}
            className="group rounded-lg border border-border bg-surface p-4 transition-colors duration-150 hover:bg-surface-hover"
          >
            <span className="t-eyebrow flex items-center gap-1.5">
              <ArrowLeft className="size-3" aria-hidden="true" />
              Anterior
            </span>
            <span className="t-h3 mt-2 block">{anterior.titulo}</span>
          </Link>
        ) : (
          <span aria-hidden="true" />
        )}

        {proxima ? (
          <Link
            href={`/app/curso/${modulo.slug}/${proxima.slug}`}
            className="group rounded-lg border border-border bg-surface p-4 text-right transition-colors duration-150 hover:bg-surface-hover"
          >
            <span className="t-eyebrow flex items-center justify-end gap-1.5">
              Próxima
              <ArrowRight className="size-3" aria-hidden="true" />
            </span>
            <span className="t-h3 mt-2 block">{proxima.titulo}</span>
          </Link>
        ) : (
          <Link
            href="/app/curso"
            className="group rounded-lg border border-border bg-surface p-4 text-right transition-colors duration-150 hover:bg-surface-hover"
          >
            <span className="t-eyebrow flex items-center justify-end gap-1.5">
              Fim do módulo
              <ArrowRight className="size-3" aria-hidden="true" />
            </span>
            <span className="t-h3 mt-2 block">Voltar para a trilha</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
