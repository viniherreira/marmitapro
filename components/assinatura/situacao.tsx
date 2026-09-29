"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Loader2, QrCode } from "lucide-react";
import { toast } from "sonner";

import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cancelarMinhaAssinatura } from "@/lib/actions/assinatura";
import { formatarMoeda } from "@/lib/format";
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

export function SituacaoDaAssinatura({
  assinatura,
  plano,
}: {
  assinatura: Assinatura;
  plano: PlanoDeCobranca | null;
}) {
  const router = useRouter();
  const [cancelando, iniciarCancelamento] = React.useTransition();
  const [confirmando, setConfirmando] = React.useState(false);

  const status = assinatura.status as StatusDaAssinatura;
  const rotulo = ROTULO[status] ?? ROTULO.pendente;
  const noCartao = assinatura.metodo === "CREDIT_CARD";

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
            ) : (
              <QrCode className="size-5 text-primary" aria-hidden="true" />
            )}
            <div>
              <p className="t-h3">Plano {plano?.nome.toLowerCase() ?? assinatura.plano}</p>
              <p className="t-small text-muted">
                {formatarMoeda(Number(assinatura.valor))}{" "}
                {assinatura.plano === "anual" ? "por ano" : "por mês"}
                {noCartao && assinatura.cartao_final
                  ? ` · ${assinatura.cartao_bandeira ?? "cartão"} final ${assinatura.cartao_final}`
                  : " · Pix"}
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
          {noCartao
            ? "O Asaas tenta de novo nos próximos dias. Se o cartão mudou, cancele aqui e assine outra vez com o cartão novo."
            : "Gere um novo Pix assinando de novo por aqui. O acesso continua até a data acima."}
        </Alert>
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
