import { cache } from "react";

import { garantirPerfil } from "@/lib/auth/perfil";
import { hojeNoBrasil } from "@/lib/datas";
import { asaasConfigurado } from "@/lib/env";
import { planoPorId, type PlanoDeCobranca } from "@/lib/pagamentos/planos";
import { clienteAdmin } from "@/lib/supabase/server";
import type { Assinatura, StatusDaAssinatura } from "@/types/database";

export type SituacaoDeAcesso = {
  /** Se as ferramentas pagas podem abrir. */
  liberado: boolean;
  /** Falso enquanto não houver chave do Asaas: aí nada é cobrado nem bloqueado. */
  cobrancaLigada: boolean;
  assinatura: Assinatura | null;
  plano: PlanoDeCobranca | null;
  /** Acesso liberado sem assinatura, pela lista de cortesia (access_grants). */
  cortesia: boolean;
};

/**
 * Se o e-mail está na lista de cortesia, com liberação vigente.
 *
 * O e-mail vem do perfil, que o copia do Clerk — e o Clerk só entrega e-mail
 * verificado. Ninguém ganha a cortesia de outra pessoa digitando o e-mail
 * dela no cadastro.
 */
export async function temCortesia(email: string | null): Promise<boolean> {
  if (!email) return false;

  const { data, error } = await clienteAdmin()
    .from("access_grants")
    .select("valido_ate")
    .eq("email", email.trim().toLowerCase())
    .is("revogado_em", null)
    .maybeSingle();

  // Falha ao ler a lista não pode derrubar a tela de quem paga: sem a
  // resposta, a pessoa fica só com o que a assinatura dela dá.
  if (error || !data) return false;
  return !data.valido_ate || data.valido_ate >= hojeEmIso();
}

export async function assinaturaDoPerfil(
  profileId: string
): Promise<Assinatura | null> {
  const supabase = clienteAdmin();

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("profile_id", profileId)
    .maybeSingle();

  if (error) throw new Error(`Falha ao ler a assinatura: ${error.message}`);
  return data;
}

/**
 * Uma assinatura dá acesso enquanto `acesso_ate` não venceu.
 *
 * A data manda mais que o status porque ela só é escrita por pagamento
 * confirmado, que é o fato: quem pagou o ano tem o ano, mesmo que um webhook
 * de atraso chegue fora de ordem depois, e mesmo que tenha cancelado ou
 * esteja trocando de plano — o período pago continua valendo.
 *
 * O único caminho que tira acesso antes da data é estorno ou chargeback, e
 * ele faz isso apagando a data. Sem data, vale só o status.
 */
export function assinaturaDaAcesso(assinatura: Assinatura | null): boolean {
  if (!assinatura) return false;

  if (assinatura.acesso_ate) return assinatura.acesso_ate >= hojeEmIso();

  return (assinatura.status as StatusDaAssinatura) === "ativa";
}

/**
 * Hoje em "YYYY-MM-DD", que é como o Postgres devolve `date`. No horário de
 * Brasília: em UTC, o acesso que vence hoje cairia às 21h.
 */
export function hojeEmIso(): string {
  return hojeNoBrasil();
}

/**
 * Situação do usuário logado, deduplicada por renderização: a página e o
 * bloqueio perguntam a mesma coisa, e sem `cache()` seriam duas consultas.
 */
export const situacaoDeAcesso = cache(
  async function situacaoDeAcesso(): Promise<SituacaoDeAcesso> {
    if (!asaasConfigurado) {
      return {
        liberado: true,
        cobrancaLigada: false,
        assinatura: null,
        plano: null,
        cortesia: false,
      };
    }

    const perfil = await garantirPerfil();
    const [assinatura, cortesia] = await Promise.all([
      assinaturaDoPerfil(perfil.id),
      temCortesia(perfil.email),
    ]);

    return {
      liberado: cortesia || assinaturaDaAcesso(assinatura),
      cobrancaLigada: true,
      assinatura,
      plano: assinatura ? planoPorId(assinatura.plano) : null,
      cortesia,
    };
  }
);
