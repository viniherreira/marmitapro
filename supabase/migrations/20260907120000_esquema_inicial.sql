-- ---------------------------------------------------------------------------
-- MarmitaPRO — esquema inicial
-- ---------------------------------------------------------------------------
-- A autenticação é feita pelo Clerk. A ponte entre o usuário do Clerk e o
-- banco é a coluna profiles.clerk_user_id, que guarda o "sub" do JWT.
-- ---------------------------------------------------------------------------

create extension if not exists "pgcrypto";

-- Tipos ---------------------------------------------------------------------

create type public.situacao_venda as enum (
  'comecando',
  'ja_vendo',
  'escalando'
);

create type public.faixa_horas as enum (
  'ate_5',
  'de_5_a_15',
  'de_15_a_30',
  'acima_de_30'
);

create type public.faixa_meta_renda as enum (
  'ate_1000',
  'de_1000_a_3000',
  'de_3000_a_6000',
  'acima_de_6000'
);

create type public.nivel_precificacao as enum (
  'nao_sei',
  'mais_ou_menos',
  'sei_calcular'
);

create type public.objetivo_receita as enum (
  'low_carb',
  'rica_proteina',
  'economica'
);

-- Função utilitária de updated_at -------------------------------------------

create or replace function public.tocar_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Perfis --------------------------------------------------------------------

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null unique,
  email text,
  nome text,
  onboarding_concluido boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.tocar_updated_at();

-- Respostas do onboarding ---------------------------------------------------

create table public.onboarding_answers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique
    references public.profiles (id) on delete cascade,
  situacao public.situacao_venda not null,
  horas_por_semana public.faixa_horas not null,
  meta_de_renda public.faixa_meta_renda not null,
  precificacao public.nivel_precificacao not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger onboarding_answers_updated_at
  before update on public.onboarding_answers
  for each row execute function public.tocar_updated_at();

-- Trilha do curso -----------------------------------------------------------

create table public.modules (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  titulo text not null,
  descricao text not null,
  ordem smallint not null unique,
  created_at timestamptz not null default now()
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules (id) on delete cascade,
  slug text not null unique,
  titulo text not null,
  resumo text not null,
  conteudo text not null,
  video_url text,
  duracao_minutos smallint not null default 6,
  ordem smallint not null,
  created_at timestamptz not null default now(),
  unique (module_id, ordem)
);

create index lessons_module_id_idx on public.lessons (module_id);

create table public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  concluida boolean not null default true,
  concluida_em timestamptz not null default now(),
  unique (profile_id, lesson_id)
);

create index lesson_progress_profile_id_idx on public.lesson_progress (profile_id);

-- Ingredientes e receitas ---------------------------------------------------

create table public.ingredients (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nome text not null,
  categoria text not null,
  -- todos os valores nutricionais são por 100 g
  kcal numeric(7, 2) not null check (kcal >= 0),
  proteina_g numeric(6, 2) not null check (proteina_g >= 0),
  carboidrato_g numeric(6, 2) not null check (carboidrato_g >= 0),
  gordura_g numeric(6, 2) not null check (gordura_g >= 0),
  preco_medio_kg numeric(8, 2) not null default 0 check (preco_medio_kg >= 0),
  created_at timestamptz not null default now()
);

create index ingredients_categoria_idx on public.ingredients (categoria);

create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nome text not null,
  descricao text not null,
  objetivo public.objetivo_receita not null,
  modo_preparo text not null,
  rendimento_porcoes smallint not null check (rendimento_porcoes > 0),
  tempo_preparo_minutos smallint not null default 30,
  imagem_url text,
  publica boolean not null default true,
  -- receitas criadas pelo usuário guardam o dono aqui; as do catálogo ficam nulas
  profile_id uuid references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index recipes_objetivo_idx on public.recipes (objetivo);
create index recipes_profile_id_idx on public.recipes (profile_id);

create trigger recipes_updated_at
  before update on public.recipes
  for each row execute function public.tocar_updated_at();

create table public.recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  ingredient_id uuid not null references public.ingredients (id) on delete restrict,
  quantidade_g numeric(8, 2) not null check (quantidade_g > 0),
  ordem smallint not null default 0,
  unique (recipe_id, ingredient_id)
);

create index recipe_ingredients_recipe_id_idx on public.recipe_ingredients (recipe_id);

-- Cálculos salvos -----------------------------------------------------------

create table public.saved_calculations (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  nome text not null,
  porcoes smallint not null default 1 check (porcoes > 0),
  -- [{ ingredient_id, nome, gramas }]
  itens jsonb not null default '[]'::jsonb,
  kcal_total numeric(9, 2) not null default 0,
  proteina_total_g numeric(8, 2) not null default 0,
  carboidrato_total_g numeric(8, 2) not null default 0,
  gordura_total_g numeric(8, 2) not null default 0,
  custo_total numeric(9, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index saved_calculations_profile_id_idx on public.saved_calculations (profile_id);

create trigger saved_calculations_updated_at
  before update on public.saved_calculations
  for each row execute function public.tocar_updated_at();

-- Cenários de precificação --------------------------------------------------

create table public.pricing_scenarios (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  nome text not null,
  custo_ingredientes numeric(9, 2) not null default 0 check (custo_ingredientes >= 0),
  custo_embalagem numeric(9, 2) not null default 0 check (custo_embalagem >= 0),
  custo_energia numeric(9, 2) not null default 0 check (custo_energia >= 0),
  minutos_mao_de_obra numeric(7, 2) not null default 0 check (minutos_mao_de_obra >= 0),
  valor_hora numeric(9, 2) not null default 0 check (valor_hora >= 0),
  margem_desejada numeric(6, 4) not null default 1 check (margem_desejada >= 0),
  volume_mensal integer not null default 0 check (volume_mensal >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index pricing_scenarios_profile_id_idx on public.pricing_scenarios (profile_id);

create trigger pricing_scenarios_updated_at
  before update on public.pricing_scenarios
  for each row execute function public.tocar_updated_at();
