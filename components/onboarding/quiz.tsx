"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { salvarOnboarding } from "@/lib/actions/onboarding";
import { PERGUNTAS_DO_QUIZ, type CampoDoQuiz } from "@/lib/content/onboarding";
import { respostasOnboardingSchema } from "@/lib/validacao/schemas";
import { cn } from "@/lib/utils";

type Respostas = Partial<Record<CampoDoQuiz, string>>;

export function QuizDeOnboarding() {
  const router = useRouter();
  const [passo, setPasso] = React.useState(0);
  const [respostas, setRespostas] = React.useState<Respostas>({});
  const [erro, setErro] = React.useState<string | null>(null);
  const [salvando, iniciarTransicao] = React.useTransition();

  const pergunta = PERGUNTAS_DO_QUIZ[passo];
  const total = PERGUNTAS_DO_QUIZ.length;
  const selecionado = respostas[pergunta.campo];
  const ultimoPasso = passo === total - 1;
  const progresso = ((passo + (selecionado ? 1 : 0)) / total) * 100;

  function escolher(valor: string) {
    setErro(null);
    setRespostas((atual) => ({ ...atual, [pergunta.campo]: valor }));

    // Avanço automático dá ritmo ao quiz; o último passo espera a confirmação.
    if (!ultimoPasso) {
      window.setTimeout(() => setPasso((p) => Math.min(p + 1, total - 1)), 180);
    }
  }

  function concluir() {
    const analise = respostasOnboardingSchema.safeParse(respostas);

    if (!analise.success) {
      setErro("Responda todas as perguntas para continuar.");
      return;
    }

    iniciarTransicao(async () => {
      const resultado = await salvarOnboarding(analise.data);

      if (!resultado.ok) {
        setErro(resultado.erro);
        return;
      }

      router.push(resultado.destino ?? "/app");
    });
  }

  return (
    <div className="w-full max-w-xl">
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="t-eyebrow">{pergunta.sobrelinha}</span>
          <span className="t-small tabular-nums text-muted">
            {Math.round(progresso)}%
          </span>
        </div>
        <Progress
          value={progresso}
          aria-label={`Progresso do questionário: ${Math.round(progresso)}%`}
        />
      </div>

      <fieldset className="mt-10">
        <legend className="t-h1 text-balance">{pergunta.pergunta}</legend>
        <p className="t-body mt-3 text-muted">{pergunta.ajuda}</p>

        <div className="mt-8 space-y-3" role="radiogroup" aria-label={pergunta.pergunta}>
          {pergunta.opcoes.map((opcao) => {
            const ativo = selecionado === opcao.valor;

            return (
              <button
                key={opcao.valor}
                type="button"
                role="radio"
                aria-checked={ativo}
                onClick={() => escolher(opcao.valor)}
                className={cn(
                  "flex w-full items-start gap-4 rounded-lg border p-4 text-left transition-[background-color,border-color] duration-150 sm:p-5",
                  ativo
                    ? "border-primary bg-primary-soft"
                    : "border-border bg-surface hover:border-border-strong hover:bg-surface-hover"
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border",
                    ativo
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border-strong"
                  )}
                >
                  {ativo ? <Check className="size-3" /> : null}
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.9375rem] font-medium text-foreground">
                    {opcao.rotulo}
                  </span>
                  <span className="t-small mt-0.5 block text-muted">
                    {opcao.detalhe}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {erro ? (
        <Alert tone="error" title="Não foi possível continuar" className="mt-6">
          {erro}
        </Alert>
      ) : null}

      <div className="mt-10 flex items-center justify-between gap-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setPasso((p) => Math.max(p - 1, 0))}
          disabled={passo === 0 || salvando}
        >
          <ArrowLeft />
          Voltar
        </Button>

        {ultimoPasso ? (
          <Button
            type="button"
            size="lg"
            onClick={concluir}
            disabled={!selecionado || salvando}
          >
            {salvando ? (
              <>
                <Loader2 className="animate-spin" />
                Salvando
              </>
            ) : (
              <>
                Concluir
                <ArrowRight />
              </>
            )}
          </Button>
        ) : (
          <Button
            type="button"
            variant="secondary"
            onClick={() => setPasso((p) => Math.min(p + 1, total - 1))}
            disabled={!selecionado}
          >
            Avançar
            <ArrowRight />
          </Button>
        )}
      </div>
    </div>
  );
}
