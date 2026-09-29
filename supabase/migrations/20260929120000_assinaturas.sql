-- ---------------------------------------------------------------------------
-- MarmitaPRO — Assinaturas cobradas pelo Asaas
-- ---------------------------------------------------------------------------
-- O Asaas é a fonte da verdade do dinheiro; esta tabela é o espelho local que
-- responde, sem chamada de rede, a única pergunta que o app faz a cada tela:
-- esta pessoa tem acesso liberado?
--
-- Nada de dado de cartão aqui. Ficam só a bandeira e os quatro últimos
-- dígitos, que o próprio Asaas devolve, para a pessoa reconhecer o cartão que
-- está pagando.
-- ---------------------------------------------------------------------------

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles (id) on delete cascade,

  plano text not null check (plano in ('mensal', 'anual')),
  metodo text not null check (metodo in ('CREDIT_CARD', 'PIX')),
  status text not null default 'pendente'
    check (status in ('pendente', 'ativa', 'atrasada', 'cancelada')),
  valor numeric(9, 2) not null check (valor > 0),

  asaas_customer_id text not null,
  asaas_subscription_id text not null unique,

  -- Até quando o acesso vale. Escrito a cada pagamento confirmado, com folga
  -- sobre o vencimento: sem isso, o acesso cairia no intervalo entre vencer e
  -- o Asaas confirmar a cobrança seguinte.
  acesso_ate date,
  proximo_vencimento date,
  ultimo_pagamento_em timestamptz,

  cartao_bandeira text,
  cartao_final text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.tocar_updated_at();

comment on table public.subscriptions is
  'Espelho local da assinatura no Asaas. Uma por perfil.';

-- Eventos recebidos do webhook ----------------------------------------------
-- O Asaas reenvia o mesmo evento quando não recebe 200. Guardar o id torna o
-- processamento idempotente: reentrega vira leitura, não um segundo crédito.

create table public.asaas_events (
  id text primary key,
  evento text not null,
  asaas_payment_id text,
  asaas_subscription_id text,
  payload jsonb not null,
  recebido_em timestamptz not null default now()
);

create index asaas_events_recebido_em_idx
  on public.asaas_events (recebido_em desc);

comment on table public.asaas_events is
  'Histórico cru dos webhooks do Asaas, usado para idempotência e auditoria.';

-- RLS ------------------------------------------------------------------------
-- Mesmo padrão das demais tabelas: o servidor usa a service role, e a política
-- cobre o acesso direto pelo navegador caso o Clerk seja registrado como
-- provedor no Supabase. Escrita é só do servidor — quem paga não edita o que
-- pagou. A tabela de eventos não recebe política nenhuma: ninguém além da
-- service role tem o que fazer com ela.

alter table public.subscriptions enable row level security;
alter table public.asaas_events enable row level security;

create policy "assinatura propria e legivel"
  on public.subscriptions
  for select
  using (profile_id = public.perfil_atual());
