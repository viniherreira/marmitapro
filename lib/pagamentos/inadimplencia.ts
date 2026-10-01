/**
 * Régua de cobrança: o que acontece antes e depois do vencimento.
 *
 * O Asaas já cuida da comunicação por fora do app — e-mail e SMS 10 dias
 * antes, no vencimento, no dia do atraso e 7 dias depois — e, no cartão,
 * tenta cobrar até seis vezes em dois dias. O que fica com o app é o que só
 * ele pode fazer:
 *
 *   -3 dias   aviso dentro do app, só para quem paga na mão (Pix comum e
 *             boleto). Cartão e Pix Automático renovam sozinhos; avisar quem
 *             não precisa fazer nada é ruído.
 *    0        vencimento.
 *   +3 dias   fim da carência: as ferramentas bloqueiam, a trilha continua.
 *  +15 dias   a assinatura é cancelada no Asaas, pela rotina diária, para não
 *             seguir gerando cobrança para quem foi embora. Os dados ficam:
 *             quem voltar assina de novo e encontra tudo.
 *
 * Pagando a qualquer momento antes do cancelamento, o acesso volta na hora.
 */

import { somarDias } from "@/lib/datas";
import type { Assinatura } from "@/types/database";

/** Dias antes do vencimento em que o aviso aparece no app. */
export const DIAS_DE_AVISO_ANTES = 3;

/** Dias de acesso depois do vencimento, enquanto o pagamento não cai. */
export const DIAS_DE_CARENCIA = 3;

/** Dias de atraso até a assinatura ser cancelada sozinha. */
export const DIAS_ATE_CANCELAR = 15;

/** Formas que renovam sem a pessoa fazer nada. */
export function renovaSozinho(metodo: string): boolean {
  return metodo === "CREDIT_CARD" || metodo === "PIX_AUTOMATICO";
}

export type AvisoDeCobranca =
  | {
      tipo: "vence_em_breve";
      /** 0 = vence hoje. */
      dias: number;
      vencimento: string;
      metodo: string;
    }
  | {
      tipo: "em_atraso";
      vencimento: string | null;
      /**
       * Dias de acesso que restam depois de hoje. Zero = hoje é o último
       * dia (o acesso vale até `acesso_ate` inclusive); negativo = bloqueado.
       */
      diasDeAcesso: number;
      /** Dia em que a assinatura será cancelada, se nada for pago. */
      cancelaEm: string | null;
      metodo: string;
    };

/** Dias de `de` até `ate`, ambos "YYYY-MM-DD". Negativo se `ate` já passou. */
export function diasEntre(de: string, ate: string): number {
  const ms =
    new Date(`${ate}T00:00:00Z`).getTime() - new Date(`${de}T00:00:00Z`).getTime();
  return Math.round(ms / 86_400_000);
}

/**
 * O aviso que a assinatura merece hoje, ou nenhum.
 *
 * Função pura, sem banco e sem relógio próprio: recebe o "hoje" para poder ser
 * testada em qualquer data.
 */
export function avisoDeCobranca(
  assinatura: Assinatura | null,
  hoje: string
): AvisoDeCobranca | null {
  if (!assinatura) return null;

  if (assinatura.status === "atrasada") {
    const vencimento = assinatura.proximo_vencimento;
    return {
      tipo: "em_atraso",
      vencimento,
      diasDeAcesso: assinatura.acesso_ate ? diasEntre(hoje, assinatura.acesso_ate) : 0,
      cancelaEm: vencimento ? somarDias(vencimento, DIAS_ATE_CANCELAR) : null,
      metodo: assinatura.metodo,
    };
  }

  if (
    assinatura.status === "ativa" &&
    !renovaSozinho(assinatura.metodo) &&
    assinatura.proximo_vencimento
  ) {
    const dias = diasEntre(hoje, assinatura.proximo_vencimento);
    if (dias >= 0 && dias <= DIAS_DE_AVISO_ANTES) {
      return {
        tipo: "vence_em_breve",
        dias,
        vencimento: assinatura.proximo_vencimento,
        metodo: assinatura.metodo,
      };
    }
  }

  return null;
}
