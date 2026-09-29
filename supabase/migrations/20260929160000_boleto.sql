-- ---------------------------------------------------------------------------
-- MarmitaPRO — Boleto como forma de pagamento da assinatura
-- ---------------------------------------------------------------------------
-- O boleto entra como terceira forma, ao lado do cartão e do Pix. É uma
-- assinatura comum do Asaas com billingType BOLETO: a cada ciclo o Asaas gera
-- um boleto novo e envia ao cliente por e-mail.
-- ---------------------------------------------------------------------------

alter table public.subscriptions
  drop constraint subscriptions_metodo_check;

alter table public.subscriptions
  add constraint subscriptions_metodo_check
  check (metodo in ('CREDIT_CARD', 'PIX', 'PIX_AUTOMATICO', 'BOLETO'));
