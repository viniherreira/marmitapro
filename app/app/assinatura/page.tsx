import type { Metadata } from "next";

import { CabecalhoDePagina } from "@/components/app/cabecalho-de-pagina";
import { Checkout } from "@/components/assinatura/checkout";
import { SituacaoDaAssinatura } from "@/components/assinatura/situacao";
import { Alert } from "@/components/ui/alert";
import { assinaturaDaAcesso, situacaoDeAcesso } from "@/lib/data/assinaturas";
import { hojeNoBrasil } from "@/lib/datas";
import {
  PLANOS_DE_COBRANCA,
  aceitaBoleto,
  equivalenteMensal,
  planoMaisBarato,
} from "@/lib/pagamentos/planos";

export const metadata: Metadata = {
  title: "Assinatura",
  description: "Assine o MarmitaPRO no cartão, no Pix ou no boleto e libere as ferramentas.",
};

/** A tela precisa refletir o pagamento que acabou de cair, nunca um cache. */
export const dynamic = "force-dynamic";

/**
 * Os planos na ordem em que aparecem, montados a partir da fonte única de
 * preços. Plano novo em lib/pagamentos/planos.ts aparece aqui sozinho.
 */
const maisBarato = planoMaisBarato();

const PLANOS_NA_TELA = Object.values(PLANOS_DE_COBRANCA).map((plano) => ({
  id: plano.id,
  nome: plano.nome,
  valor: plano.valor,
  periodo: plano.periodo,
  equivalente: equivalenteMensal(plano) ?? undefined,
  destaque: plano.id === maisBarato.id,
  selo: plano.id === maisBarato.id ? "Menor preço" : undefined,
  aceitaBoleto: aceitaBoleto(plano),
}));

export default async function AssinaturaPage() {
  const situacao = await situacaoDeAcesso();

  return (
    <div className="space-y-10">
      <CabecalhoDePagina
        sobrelinha="Sua conta"
        titulo="Assinatura"
        descricao="O pagamento acontece aqui dentro, no cartão, no Pix ou no boleto. Quem processa é o Asaas, e o dinheiro cai direto na conta do MarmitaPRO."
      />

      {!situacao.cobrancaLigada ? (
        <Alert tone="info" title="Cobrança ainda desligada">
          Falta a chave do Asaas neste ambiente. Enquanto ela não existir, o app
          segue com tudo liberado e nada é cobrado.
        </Alert>
      ) : situacao.assinatura &&
        (assinaturaDaAcesso(situacao.assinatura) ||
          situacao.assinatura.status === "atrasada") ? (
        // Assinatura paga vem antes da cortesia: quem tem as duas precisa ver
        // e poder cancelar o que está pagando. E quem está em atraso vê a
        // própria assinatura, com a cobrança para pagar — não o checkout, que
        // abriria uma assinatura nova em cima da que está devendo.
        <SituacaoDaAssinatura
          assinatura={situacao.assinatura}
          plano={situacao.plano}
          hoje={hojeNoBrasil()}
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
