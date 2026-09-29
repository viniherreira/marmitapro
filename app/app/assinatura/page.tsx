import type { Metadata } from "next";

import { CabecalhoDePagina } from "@/components/app/cabecalho-de-pagina";
import { Checkout } from "@/components/assinatura/checkout";
import { SituacaoDaAssinatura } from "@/components/assinatura/situacao";
import { Alert } from "@/components/ui/alert";
import { assinaturaDaAcesso, situacaoDeAcesso } from "@/lib/data/assinaturas";
import { PLANOS_DE_COBRANCA } from "@/lib/pagamentos/planos";

export const metadata: Metadata = {
  title: "Assinatura",
  description: "Assine o MarmitaPRO no cartão ou no Pix e libere as ferramentas.",
};

/** A tela precisa refletir o pagamento que acabou de cair, nunca um cache. */
export const dynamic = "force-dynamic";

const PLANOS_NA_TELA = [
  {
    id: PLANOS_DE_COBRANCA.mensal.id,
    nome: PLANOS_DE_COBRANCA.mensal.nome,
    valor: PLANOS_DE_COBRANCA.mensal.valor,
    periodo: "por mês",
    destaque: false,
  },
  {
    id: PLANOS_DE_COBRANCA.anual.id,
    nome: PLANOS_DE_COBRANCA.anual.nome,
    valor: PLANOS_DE_COBRANCA.anual.valor,
    periodo: "por ano",
    equivalente: `equivale a R$ ${(PLANOS_DE_COBRANCA.anual.valor / 12)
      .toFixed(2)
      .replace(".", ",")} por mês`,
    destaque: true,
  },
];

export default async function AssinaturaPage() {
  const situacao = await situacaoDeAcesso();

  return (
    <div className="space-y-10">
      <CabecalhoDePagina
        sobrelinha="Sua conta"
        titulo="Assinatura"
        descricao="O pagamento acontece aqui dentro, no cartão ou no Pix. Quem processa é o Asaas, e o dinheiro cai direto na conta do MarmitaPRO."
      />

      {!situacao.cobrancaLigada ? (
        <Alert tone="info" title="Cobrança ainda desligada">
          Falta a chave do Asaas neste ambiente. Enquanto ela não existir, o app
          segue com tudo liberado e nada é cobrado.
        </Alert>
      ) : situacao.assinatura && assinaturaDaAcesso(situacao.assinatura) ? (
        // Assinatura paga vem antes da cortesia: quem tem as duas precisa ver
        // e poder cancelar o que está pagando.
        <SituacaoDaAssinatura
          assinatura={situacao.assinatura}
          plano={situacao.plano}
        />
      ) : situacao.cortesia ? (
        <Alert tone="success" title="Acesso cortesia">
          Esta conta tem o MarmitaPRO completo liberado, sem assinatura e sem
          cobrança: trilha, calculadoras, receitas e pedidos.
        </Alert>
      ) : (
        <Checkout planos={PLANOS_NA_TELA} />
      )}
    </div>
  );
}
