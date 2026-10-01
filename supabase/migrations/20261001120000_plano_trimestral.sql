-- ---------------------------------------------------------------------------
-- MarmitaPRO — Plano Trimestral (R$ 99 a cada três meses)
-- ---------------------------------------------------------------------------
-- Quarto plano, com o mesmo acesso completo. O preço mora em
-- lib/pagamentos/planos.ts; aqui só entra o nome, para a assinatura poder ser
-- gravada.
-- ---------------------------------------------------------------------------

alter table public.subscriptions
  drop constraint subscriptions_plano_check;

alter table public.subscriptions
  add constraint subscriptions_plano_check
  check (plano in ('basico', 'mensal', 'trimestral', 'anual'));
