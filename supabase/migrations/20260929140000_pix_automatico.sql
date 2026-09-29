-- ---------------------------------------------------------------------------
-- MarmitaPRO — Pix Automático
-- ---------------------------------------------------------------------------
-- No Pix Automático o cliente lê um QR Code só: paga o primeiro ciclo e, no
-- mesmo passo, autoriza no banco os débitos seguintes. Do lado do Asaas isso
-- é uma autorização, que depois de ativa gera as cobranças por uma assinatura.
--
-- A assinatura passa a poder nascer sem id de assinatura do Asaas: enquanto o
-- banco do cliente não confirma a autorização, o que existe é só o id dela.
-- ---------------------------------------------------------------------------

alter table public.subscriptions
  alter column asaas_subscription_id drop not null;

alter table public.subscriptions
  add column asaas_authorization_id text unique;

alter table public.subscriptions
  drop constraint subscriptions_metodo_check;

alter table public.subscriptions
  add constraint subscriptions_metodo_check
  check (metodo in ('CREDIT_CARD', 'PIX', 'PIX_AUTOMATICO'));

-- Toda assinatura precisa ser encontrável pelos avisos do Asaas: pelo id da
-- assinatura, pelo da autorização, ou pelos dois.
alter table public.subscriptions
  add constraint subscriptions_tem_referencia_no_asaas
  check (asaas_subscription_id is not null or asaas_authorization_id is not null);

comment on column public.subscriptions.asaas_authorization_id is
  'Autorização do Pix Automático no Asaas, quando o método é PIX_AUTOMATICO.';
