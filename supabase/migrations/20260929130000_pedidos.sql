-- ---------------------------------------------------------------------------
-- MarmitaPRO — Pedidos
-- ---------------------------------------------------------------------------
-- O caderno de pedidos de quem vende marmita: os clientes dela, o que cada um
-- pediu, quando entrega e em que pé está.
--
-- Tudo aqui pertence a um perfil. O cliente final da marmita não tem conta no
-- app — quem usa é a pessoa que cozinha e vende.
-- ---------------------------------------------------------------------------

create type public.situacao_pedido as enum (
  'recebido',
  'em_producao',
  'pronto',
  'entregue',
  'cancelado'
);

-- Clientes -------------------------------------------------------------------

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  nome text not null check (length(trim(nome)) > 0),
  telefone text,
  endereco text,
  observacoes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index customers_profile_id_nome_idx
  on public.customers (profile_id, nome);

create trigger customers_updated_at
  before update on public.customers
  for each row execute function public.tocar_updated_at();

-- Pedidos --------------------------------------------------------------------
-- A entrega é data mais hora, separadas e sem fuso. Quem vende pensa em
-- "segunda ao meio-dia", não num instante UTC; guardar como timestamptz faria
-- a semana virar um dia antes ou depois conforme o fuso do servidor.

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  -- restrict: apagar o cliente não pode apagar o histórico de vendas.
  customer_id uuid not null references public.customers (id) on delete restrict,
  entrega_data date not null,
  entrega_hora time,
  situacao public.situacao_pedido not null default 'recebido',
  observacoes text,
  -- Soma dos itens, recalculada no servidor a cada gravação.
  valor_total numeric(10, 2) not null default 0 check (valor_total >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_profile_id_entrega_idx
  on public.orders (profile_id, entrega_data);

create index orders_customer_id_idx on public.orders (customer_id);

create trigger orders_updated_at
  before update on public.orders
  for each row execute function public.tocar_updated_at();

-- Itens do pedido ------------------------------------------------------------
-- A descrição é gravada no item, e não só a receita: o cardápio de quem vende
-- tem prato que não está no banco de receitas, e renomear uma receita não
-- pode reescrever o que foi vendido semana passada.

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  recipe_id uuid references public.recipes (id) on delete set null,
  descricao text not null check (length(trim(descricao)) > 0),
  quantidade integer not null check (quantidade > 0 and quantidade <= 1000),
  preco_unitario numeric(9, 2) not null check (preco_unitario >= 0),
  ordem smallint not null default 0
);

create index order_items_order_id_idx on public.order_items (order_id);

-- RLS ------------------------------------------------------------------------
-- Mesmo padrão de saved_calculations e pricing_scenarios. Os itens não têm
-- profile_id: a posse vem do pedido a que pertencem.

alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "clientes proprios"
  on public.customers for all
  to authenticated
  using (profile_id = public.perfil_atual())
  with check (profile_id = public.perfil_atual());

create policy "pedidos proprios"
  on public.orders for all
  to authenticated
  using (profile_id = public.perfil_atual())
  with check (profile_id = public.perfil_atual());

create policy "itens de pedidos proprios"
  on public.order_items for all
  to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and o.profile_id = public.perfil_atual()
    )
  )
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and o.profile_id = public.perfil_atual()
    )
  );
