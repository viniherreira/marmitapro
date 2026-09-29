-- ---------------------------------------------------------------------------
-- MarmitaPRO — Acesso cortesia
-- ---------------------------------------------------------------------------
-- Contas que usam o app completo sem assinatura: o dono do produto, contas de
-- teste, um parceiro. A liberação é por e-mail, e não por perfil, para valer
-- também para quem ainda não entrou no app pela primeira vez.
--
-- Os e-mails liberados são dado, não código: entram direto no banco, e não
-- nesta migração, para não ficarem no histórico do repositório.
--
--   insert into public.access_grants (email, motivo)
--   values ('pessoa@exemplo.com', 'Conta de teste');
--
-- Para tirar a cortesia, marque a revogação em vez de apagar a linha — fica o
-- registro de quem teve acesso e até quando:
--
--   update public.access_grants set revogado_em = now()
--   where email = 'pessoa@exemplo.com' and revogado_em is null;
-- ---------------------------------------------------------------------------

create table public.access_grants (
  id uuid primary key default gen_random_uuid(),
  -- Sempre em minúsculas: o Clerk pode devolver o mesmo e-mail com caixa
  -- diferente, e a comparação precisa ser exata para não liberar por engano.
  email text not null check (email = lower(trim(email)) and email like '%_@_%'),
  motivo text not null check (length(trim(motivo)) > 0),
  -- Sem data, vale até ser revogada.
  valido_ate date,
  revogado_em timestamptz,
  created_at timestamptz not null default now()
);

-- Uma cortesia ativa por e-mail.
create unique index access_grants_email_ativa_idx
  on public.access_grants (email)
  where revogado_em is null;

comment on table public.access_grants is
  'Contas com acesso completo sem assinatura (cortesia), liberadas por e-mail.';

-- Sem política nenhuma: só o servidor, com a service role, lê ou escreve.
-- Ninguém pelo navegador precisa saber quem tem cortesia.
alter table public.access_grants enable row level security;
