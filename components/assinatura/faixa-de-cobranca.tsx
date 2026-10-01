import Link from "next/link";
import { AlertTriangle, CalendarClock } from "lucide-react";

import { situacaoDeAcesso } from "@/lib/data/assinaturas";
import { hojeNoBrasil } from "@/lib/datas";
import { avisoDeCobranca } from "@/lib/pagamentos/inadimplencia";
import { cn } from "@/lib/utils";

function dataCurta(iso: string): string {
  const [, mes, dia] = iso.split("-");
  return `${dia}/${mes}`;
}

/**
 * Faixa no topo de todas as telas do app quando há cobrança pedindo atenção.
 *
 * Aparece em dois momentos da régua (lib/pagamentos/inadimplencia.ts): nos 3
 * dias antes do vencimento, só para quem paga na mão — Pix comum e boleto —,
 * e durante o atraso, para qualquer forma. Quem tem cortesia não vê nada: não
 * há o que pagar.
 *
 * Sem conexão com o Asaas: lê só o espelho local, que já vem da consulta que
 * a tela faria de qualquer jeito.
 */
export async function FaixaDeCobranca() {
  // A faixa mora no layout, logo em todas as telas — inclusive na trilha, que
  // é aberta. Uma falha ao ler a assinatura apaga a faixa, nunca a tela.
  const situacao = await situacaoDeAcesso().catch(() => null);
  if (!situacao?.cobrancaLigada || situacao.cortesia) return null;

  const aviso = avisoDeCobranca(situacao.assinatura, hojeNoBrasil());
  if (!aviso) return null;

  const emAtraso = aviso.tipo === "em_atraso";
  // acesso_ate vale inclusive: zero dias restantes ainda é acesso hoje.
  const bloqueado = emAtraso && aviso.diasDeAcesso < 0;
  const ultimoDia = emAtraso && aviso.diasDeAcesso === 0;

  const texto = emAtraso
    ? bloqueado
      ? "Pagamento em atraso: as ferramentas estão bloqueadas até o pagamento."
      : ultimoDia
        ? "Pagamento em atraso: hoje é o último dia de acesso às ferramentas."
        : `Pagamento em atraso: o acesso continua por mais ${aviso.diasDeAcesso} ${aviso.diasDeAcesso === 1 ? "dia" : "dias"}.`
    : aviso.dias === 0
      ? "Seu plano vence hoje."
      : `Seu plano vence em ${aviso.dias} ${aviso.dias === 1 ? "dia" : "dias"}, em ${dataCurta(aviso.vencimento)}.`;

  const Icone = emAtraso ? AlertTriangle : CalendarClock;

  return (
    <div
      role="status"
      className={cn(
        "mb-8 flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between",
        emAtraso
          ? "border-warning/30 bg-warning-soft"
          : "border-border bg-surface-sunken"
      )}
    >
      <p className="flex items-start gap-2.5 text-[0.9375rem]">
        <Icone
          className={cn("mt-0.5 size-4 shrink-0", emAtraso ? "text-warning" : "text-muted")}
          aria-hidden="true"
        />
        {texto}
      </p>
      <Link
        href="/app/assinatura"
        className="shrink-0 text-[0.9375rem] font-medium text-primary underline-offset-4 hover:underline"
      >
        {emAtraso && aviso.metodo === "CREDIT_CARD" ? "Ver a assinatura" : "Pagar agora"}
      </Link>
    </div>
  );
}
