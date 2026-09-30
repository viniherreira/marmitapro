-- ---------------------------------------------------------------------------
-- MarmitaPRO — Plano Básico (R$ 5 por mês)
-- ---------------------------------------------------------------------------
-- Terceiro plano, ao lado do mensal e do anual, com o mesmo acesso completo.
-- O preço mora em lib/pagamentos/planos.ts; aqui só entra o nome, para a
-- assinatura poder ser gravada.
--
-- Não aceita boleto: o Asaas só emite boleto a partir de R$ 10. Cartão e Pix
-- aceitam a partir de R$ 5.
-- ---------------------------------------------------------------------------

alter table public.subscriptions
  drop constraint subscriptions_plano_check;

alter table public.subscriptions
  add constraint subscriptions_plano_check
  check (plano in ('basico', 'mensal', 'anual'));
