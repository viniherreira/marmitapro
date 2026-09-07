-- ---------------------------------------------------------------------------
-- MarmitaPRO — Row Level Security
-- ---------------------------------------------------------------------------
-- RLS fica habilitada em todas as tabelas. O acesso do servidor usa a service
-- role, que ignora RLS por definição; as políticas abaixo existem para o
-- caminho em que o Clerk é registrado como provedor de terceiros no Supabase
-- (Authentication > Sign In / Providers > Clerk). Nesse cenário o "sub" do JWT
-- do Clerk chega em auth.jwt() e o acesso direto do navegador fica seguro.
--
-- Sem essa integração configurada, nenhuma linha é legível pelas chaves
-- públicas — que é exatamente o comportamento desejado.
-- ---------------------------------------------------------------------------

create or replace function public.clerk_user_id()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(nullif(auth.jwt() ->> 'sub', ''), '')::text;
$$;

comment on function public.clerk_user_id() is
  'Identificador do usuário autenticado no Clerk, extraído do JWT.';

create or replace function public.perfil_atual()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select p.id
  from public.profiles p
  where p.clerk_user_id = public.clerk_user_id()
  limit 1;
$$;

-- Perfis --------------------------------------------------------------------

alter table public.profiles enable row level security;

create policy "perfil proprio visivel"
  on public.profiles for select
  to authenticated
  using (clerk_user_id = public.clerk_user_id());

create policy "perfil proprio criavel"
  on public.profiles for insert
  to authenticated
  with check (clerk_user_id = public.clerk_user_id());

create policy "perfil proprio editavel"
  on public.profiles for update
  to authenticated
  using (clerk_user_id = public.clerk_user_id())
  with check (clerk_user_id = public.clerk_user_id());

-- Respostas do onboarding ---------------------------------------------------

alter table public.onboarding_answers enable row level security;

create policy "onboarding proprio"
  on public.onboarding_answers for all
  to authenticated
  using (profile_id = public.perfil_atual())
  with check (profile_id = public.perfil_atual());

-- Conteúdo da trilha (catálogo, leitura para quem está logado) ---------------

alter table public.modules enable row level security;

create policy "modulos legiveis por autenticados"
  on public.modules for select
  to authenticated
  using (true);

alter table public.lessons enable row level security;

create policy "aulas legiveis por autenticados"
  on public.lessons for select
  to authenticated
  using (true);

-- Progresso -----------------------------------------------------------------

alter table public.lesson_progress enable row level security;

create policy "progresso proprio"
  on public.lesson_progress for all
  to authenticated
  using (profile_id = public.perfil_atual())
  with check (profile_id = public.perfil_atual());

-- Ingredientes --------------------------------------------------------------

alter table public.ingredients enable row level security;

create policy "ingredientes legiveis por autenticados"
  on public.ingredients for select
  to authenticated
  using (true);

-- Receitas ------------------------------------------------------------------

alter table public.recipes enable row level security;

create policy "receitas publicas ou proprias visiveis"
  on public.recipes for select
  to authenticated
  using (publica = true or profile_id = public.perfil_atual());

create policy "receitas proprias criaveis"
  on public.recipes for insert
  to authenticated
  with check (profile_id = public.perfil_atual());

create policy "receitas proprias editaveis"
  on public.recipes for update
  to authenticated
  using (profile_id = public.perfil_atual())
  with check (profile_id = public.perfil_atual());

create policy "receitas proprias removiveis"
  on public.recipes for delete
  to authenticated
  using (profile_id = public.perfil_atual());

alter table public.recipe_ingredients enable row level security;

create policy "ingredientes de receita visiveis"
  on public.recipe_ingredients for select
  to authenticated
  using (
    exists (
      select 1
      from public.recipes r
      where r.id = recipe_ingredients.recipe_id
        and (r.publica = true or r.profile_id = public.perfil_atual())
    )
  );

create policy "ingredientes de receita propria editaveis"
  on public.recipe_ingredients for all
  to authenticated
  using (
    exists (
      select 1
      from public.recipes r
      where r.id = recipe_ingredients.recipe_id
        and r.profile_id = public.perfil_atual()
    )
  )
  with check (
    exists (
      select 1
      from public.recipes r
      where r.id = recipe_ingredients.recipe_id
        and r.profile_id = public.perfil_atual()
    )
  );

-- Cálculos e cenários salvos ------------------------------------------------

alter table public.saved_calculations enable row level security;

create policy "calculos proprios"
  on public.saved_calculations for all
  to authenticated
  using (profile_id = public.perfil_atual())
  with check (profile_id = public.perfil_atual());

alter table public.pricing_scenarios enable row level security;

create policy "cenarios proprios"
  on public.pricing_scenarios for all
  to authenticated
  using (profile_id = public.perfil_atual())
  with check (profile_id = public.perfil_atual());
