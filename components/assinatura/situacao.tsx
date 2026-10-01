"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Barcode, CreditCard, Loader2, QrCode } from "lucide-react";
import { toast } from "sonner";

import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PagamentoBoleto, PagamentoPix } from "@/components/assinatura/checkout";
import {
  cancelarMinhaAssinatura,
  cobrancaParaPagarAgora,
  conferirCobranca,
  type CobrancaParaPagarAgora,
} from "@/lib/actions/assinatura";
import { formatarMoeda } from "@/lib/format";
import { avisoDeCobranca } from "@/lib/pagamentos/inadimplencia";
import type { PlanoDeCobranca } from "@/lib/pagamentos/planos";
import type { Assinatura, StatusDaAssinatura } from "@/types/database";

const ROTULO: Record<StatusDaAssinatura, { texto: string; tom: "success" | "warning" | "info" }> =
  {
    ativa: { texto: "Ativa", tom: "success" },
    atrasada: { texto: "Pagamento em atraso", tom: "warning" },
    cancelada: { texto: "Cancelada", tom: "info" },
    pendente: { texto: "Aguardando pagamento", tom: "info" },
  };

function dataPorExtenso(iso: string | null): string {
  if (!iso) return "—";
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

type CobrancaAberta = Extract<CobrancaParaPagarAgora, { ok: true }>;

export function SituacaoDaAssinatura({
  assinatura,
  plano,
  hoje,
}: {
  assinatura: Assinatura;
  plano: PlanoDeCobranca | null;
  /** Hoje em Brasília, vindo do servidor: o relógio do aparelho pode mentir. */
  hoje: string;
}) {
  const router = useRouter();
  const [cancelando, iniciarCancelamento] = React.useTransition();
  const [confirmando, setConfirmando] = React.useState(false);
  const [buscandoCobranca, iniciarBusca] = React.useTransition();
  const [cobranca, setCobranca] = React.useState<CobrancaAberta | null>(null);

  const aviso = avisoDeCobranca(assinatura, hoje);
  const pagaNaMao = assinatura.metodo === "PIX" || assinatura.metodo === "BOLETO";
  const podePagarAgora = pagaNaMao && aviso !== null;

  function pagarAgora() {
    iniciarBusca(async () => {
      const resultado = await cobrancaParaPagarAgora();
      if (!resultado.ok) {
        toast.error(resultado.erro);
        return;
      }
      setCobranca(resultado);
    });
  }

  const conferirEstaCobranca = React.useCallback(
    async () =>
      cobranca ? (await conferirCobranca(cobranca.cobrancaId)).pago : false,
    [cobranca]
  );

  const status = assinatura.status as StatusDaAssinatura;
  const rotulo = ROTULO[status] ?? ROTULO.pendente;
  const noCartao = assinatura.metodo === "CREDIT_CARD";
  const pixAutomatico = assinatura.metodo === "PIX_AUTOMATICO";
  const noBoleto = assinatura.metodo === "BOLETO";

  const formaDePagamento = noCartao
    ? assinatura.cartao_final
      ? `${assinatura.cartao_bandeira ?? "cartão"} final ${assinatura.cartao_final}`
      : "cartão"
    : pixAutomatico
      ? "Pix Automático"
      : noBoleto
        ? "Boleto"
        : "Pix";

  const emAtraso = aviso?.tipo === "em_atraso" ? aviso : null;

  const prazoDeCancelamento = emAtraso?.cancelaEm
    ? ` Sem pagamento até ${dataPorExtenso(emAtraso.cancelaEm)}, a assinatura é cancelada.`
    : "";

  const situacaoDoAcesso = !emAtraso
    ? ""
    : emAtraso.diasDeAcesso > 0
      ? ` O acesso continua por mais ${emAtraso.diasDeAcesso} ${emAtraso.diasDeAcesso === 1 ? "dia" : "dias"}.`
      : emAtraso.diasDeAcesso === 0
        ? " Hoje é o último dia de acesso às ferramentas."
        : " As ferramentas estão bloqueadas até o pagamento; a trilha do curso continua aberta.";

  const avisoDeAtraso =
    (noCartao
      ? "O Asaas já tentou cobrar o cartão. Se ele mudou, cancele aqui e assine outra vez com o cartão novo."
      : pixAutomatico
        ? "O débito automático não passou — costuma ser saldo ou limite do Pix no banco."
        : noBoleto
          ? "O boleto venceu sem pagamento. Dá para pagar agora, pelo botão abaixo."
          : "O Pix da renovação não foi pago. Dá para pagar agora, pelo botão abaixo.") +
    situacaoDoAcesso +
    prazoDeCancelamento;

  function cancelar() {
    iniciarCancelamento(async () => {
      const resultado = await cancelarMinhaAssinatura();
      if (!resultado.ok) {
        toast.error(resultado.erro);
        return;
      }
      toast.success("Assinatura cancelada. O acesso vale até o fim do período pago.");
      setConfirmando(false);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-surface p-6 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {noCartao ? (
              <CreditCard className="size-5 text-primary" aria-hidden="true" />
            ) : noBoleto ? (
              <Barcode className="size-5 text-primary" aria-hidden="true" />
            ) : (
              <QrCode className="size-5 text-primary" aria-hidden="true" />
            )}
            <div>
              <p className="t-h3">Plano {plano?.nome.toLowerCase() ?? assinatura.plano}</p>
              <p className="t-small text-muted">
                {formatarMoeda(Number(assinatura.valor))}{" "}
                {plano?.periodo ?? "por mês"} ·{" "}
                {formaDePagamento}
              </p>
            </div>
          </div>

          <Badge variant={rotulo.tom === "success" ? "accent" : "outline"}>
            {rotulo.texto}
          </Badge>
        </div>

        <dl className="mt-6 grid gap-5 border-t border-border pt-6 sm:grid-cols-2">
          <div>
            <dt className="t-small text-muted">Acesso garantido até</dt>
            <dd className="mt-1 font-medium" data-numeric>
              {dataPorExtenso(assinatura.acesso_ate)}
            </dd>
          </div>
          <div>
            <dt className="t-small text-muted">
              {status === "cancelada" ? "Não renova mais" : "Próxima cobrança"}
            </dt>
            <dd className="mt-1 font-medium" data-numeric>
              {status === "cancelada"
                ? "—"
                : dataPorExtenso(assinatura.proximo_vencimento)}
            </dd>
          </div>
        </dl>
      </div>

      {status === "atrasada" ? (
        <Alert tone="warning" title="A última cobrança não foi paga">
          {avisoDeAtraso}
        </Alert>
      ) : aviso?.tipo === "vence_em_breve" ? (
        <Alert tone="info" title={aviso.dias === 0 ? "Seu plano vence hoje" : `Seu plano vence em ${aviso.dias} ${aviso.dias === 1 ? "dia" : "dias"}`}>
          A renovação é paga {noBoleto ? "no boleto" : "no Pix"}: pague até{" "}
          {dataPorExtenso(aviso.vencimento)} para não perder o acesso. A
          cobrança também está no seu e-mail.
        </Alert>
      ) : null}

      {podePagarAgora && !cobranca ? (
        <Button type="button" onClick={pagarAgora} disabled={buscandoCobranca}>
          {buscandoCobranca ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : null}
          Pagar agora
        </Button>
      ) : null}

      {cobranca?.tipo === "pix" ? (
        <PagamentoPix
          qrCode={cobranca.qrCode}
          automatico={false}
          periodo={plano?.periodo ?? "por mês"}
          conferir={conferirEstaCobranca}
        />
      ) : cobranca?.tipo === "boleto" ? (
        <PagamentoBoleto boleto={cobranca.boleto} conferir={conferirEstaCobranca} />
      ) : null}

      {status !== "cancelada" ? (
        <div className="flex flex-wrap items-center gap-3">
          {confirmando ? (
            <>
              <p className="t-small text-muted">
                Cancelar mesmo? O acesso continua até{" "}
                {dataPorExtenso(assinatura.acesso_ate)}.
              </p>
              <Button
                type="button"
                variant="secondary"
                onClick={cancelar}
                disabled={cancelando}
              >
                {cancelando ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : null}
                Sim, cancelar
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setConfirmando(false)}
                disabled={cancelando}
              >
                Voltar
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setConfirmando(true)}
            >
              Cancelar assinatura
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}
