-- ---------------------------------------------------------------------------
-- MarmitaPRO — setup completo do banco, em um arquivo só.
--
-- Cole tudo no SQL Editor do Supabase e execute uma vez.
-- Gerado a partir de supabase/migrations/ + supabase/seed.sql, na ordem.
-- É reexecutável: as inserções são idempotentes por slug.
-- ---------------------------------------------------------------------------


-- ===========================================================================
-- supabase/migrations/20260907120000_esquema_inicial.sql
-- ===========================================================================

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

-- ===========================================================================
-- supabase/migrations/20260907120100_politicas_rls.sql
-- ===========================================================================

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

-- ===========================================================================
-- supabase/seed.sql
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- MarmitaPRO — carga inicial de conteúdo
-- ---------------------------------------------------------------------------
-- Reexecutável: todas as inserções são idempotentes por slug.
-- Valores nutricionais por 100 g, com base em tabelas de composição de
-- alimentos brasileiras. Preços médios são referência de compra no varejo e
-- devem ser ajustados pelo usuário na calculadora de precificação.
-- ---------------------------------------------------------------------------

-- Módulos -------------------------------------------------------------------

insert into public.modules (slug, titulo, descricao, ordem) values
  ('comecando-do-zero',
   'Começando do zero',
   'Estruturar a operação com a cozinha que você já tem, sem investir antes da hora.',
   1),
  ('precificacao-sem-chute',
   'Precificação sem chute',
   'Descobrir o custo real de uma marmita e transformar isso em uma tabela de preços que fecha.',
   2),
  ('marketing-local',
   'Marketing local',
   'Vender no raio de três quilômetros, com WhatsApp, cardápio e parcerias de bairro.',
   3),
  ('logistica-e-entrega',
   'Logística e entrega',
   'Produzir em lote, embalar com segurança e entregar sem que o frete coma o lucro.',
   4),
  ('atendimento-e-fidelizacao',
   'Atendimento e fidelização',
   'Fazer o cliente da primeira compra virar cliente da semana seguinte.',
   5)
on conflict (slug) do nothing;

-- Aulas — Módulo 1 ----------------------------------------------------------

insert into public.lessons (module_id, slug, titulo, resumo, conteudo, duracao_minutos, ordem)
select m.id, v.slug, v.titulo, v.resumo, v.conteudo, v.duracao, v.ordem
from public.modules m
join (values
  ('comecando-do-zero', 'o-que-voce-esta-montando', 'O que você está montando de verdade',
   'Antes de cozinhar, entender que negócio é esse e o que ele exige de você.',
   $md$Vender marmita fit não é vender comida: é vender **resolução de um problema semanal**. O seu cliente não quer almoço, quer não pensar no almoço.

Isso muda três decisões logo de cara:

- **Recorrência acima de variedade.** É melhor ter oito pratos que você faz muito bem e giram toda semana do que trinta que você faz uma vez.
- **Constância acima de perfeição.** A marmita da terça precisa ter o mesmo peso, a mesma aparência e o mesmo tempero da marmita da quinta.
- **Volume acima de margem unitária.** Você ganha dinheiro repetindo, não com uma venda genial.

Escreva agora, em uma frase, quem é o seu cliente e qual dia da semana ele mais sofre com comida. Essa frase vai orientar cardápio, preço e entrega daqui para frente.

O erro clássico de quem começa é montar um cardápio de restaurante. Restaurante vive de escolha; marmita vive de repetição.$md$,
   7, 1),

  ('comecando-do-zero', 'quanto-da-para-faturar', 'Quanto dá para faturar com marmita fit',
   'Números realistas de faturamento e lucro para produção caseira.',
   $md$Vamos tirar a conversa do achismo. Uma operação caseira típica trabalha com três faixas:

- **Início (até 10 h/semana):** 60 a 100 marmitas por mês. Com preço médio de R$ 22 e margem de 45%, isso dá algo entre R$ 590 e R$ 990 de lucro.
- **Consolidação (15 a 25 h/semana):** 200 a 350 marmitas por mês. Faturamento entre R$ 4.400 e R$ 7.700.
- **Limite da cozinha doméstica:** por volta de 500 a 600 marmitas por mês. Acima disso, a estrutura vira gargalo antes da demanda.

Repare que o salto de faixa quase nunca vem de preço. Vem de **produção em lote** e de **entrega concentrada**, os dois temas do módulo 4.

Abra a calculadora de precificação e simule o seu cenário com o volume que a sua semana comporta hoje. O número que aparecer é a sua meta realista dos próximos 90 dias — não a meta do anúncio que você viu no Instagram.$md$,
   8, 2),

  ('comecando-do-zero', 'estruturando-a-cozinha', 'Estruturando a cozinha que você já tem',
   'O mínimo de equipamento que muda o jogo, na ordem de prioridade de compra.',
   $md$Não compre nada antes de vender as primeiras 50 marmitas. Depois disso, a ordem de compra que mais devolve dinheiro é:

1. **Balança digital de cozinha (até R$ 60).** Sem ela não existe ficha técnica, não existe custo confiável e não existe padronização de porção. É o item de maior retorno da lista.
2. **Embalagens adequadas (marmita de PP com trava).** Vazamento na entrega custa mais caro que a embalagem boa.
3. **Freezer ou geladeira com espaço real.** Resfriar rápido é segurança alimentar, não conforto.
4. **Assadeiras grandes e panela de pressão.** Produção em lote depende de equipamento que cozinha muito de uma vez.
5. **Seladora ou etiquetadora.** Só quando o volume passar de 150 unidades por mês.

O que **não** comprar no começo: fogão industrial, câmara fria, sistema de gestão pago e embalagem personalizada com logo. Tudo isso vem depois que o volume justificar.$md$,
   6, 3),

  ('comecando-do-zero', 'higiene-e-boas-praticas', 'Higiene e boas práticas que não são negociáveis',
   'O básico de segurança alimentar que protege o cliente e o seu negócio.',
   $md$Três regras concentram a maior parte do risco:

- **Zona de perigo entre 5 °C e 60 °C.** É a faixa em que a bactéria se multiplica. A comida pronta não pode ficar mais de duas horas nela.
- **Resfriamento rápido.** Depois de cozinhar, a marmita precisa sair de quente para gelada em até duas horas. Espalhe em recipiente raso, não empilhe panela quente na geladeira.
- **Contaminação cruzada.** Tábua e faca de carne crua não encostam em nada pronto. O ideal é ter tábuas de cores diferentes.

Complete com o óbvio que as pessoas pulam: cabelo preso, unhas curtas e sem esmalte, avental de uso exclusivo, lavagem de mãos por 20 segundos ao trocar de tarefa.

**Validade prática:** 3 a 4 dias refrigerada, até 90 dias congelada. Etiquete toda marmita com data de produção. Não é burocracia — é o que te protege se algum cliente reclamar.$md$,
   7, 4),

  ('comecando-do-zero', 'formalizacao-mei', 'Formalização: quando o MEI passa a valer a pena',
   'O ponto em que sair da informalidade deixa de ser custo e vira ferramenta.',
   $md$Não existe obrigação de abrir empresa para vender a primeira marmita para a vizinha. Existe um ponto em que continuar informal passa a custar mais caro que formalizar.

Esse ponto chega quando você quer:

- **Vender para empresa.** Escritório e academia costumam exigir nota fiscal.
- **Aceitar cartão com taxa de PJ.** As taxas de maquininha para pessoa jurídica são menores.
- **Comprar no atacado com CNPJ.** A diferença de preço no atacadista paga a contribuição mensal.

O MEI cobre atividades de produção e venda de alimentos preparados e tem limite de faturamento anual, com contribuição mensal fixa e baixa. Consulte o Portal do Empreendedor para os valores e a lista de ocupações vigentes, porque eles mudam.

Além do MEI, verifique a exigência de **licença sanitária municipal** para produção de alimentos. A regra varia por cidade e é o item que mais pega gente desprevenida.

Esta aula é orientação geral de negócio, não consultoria contábil ou jurídica.$md$,
   6, 5),

  ('comecando-do-zero', 'cardapio-de-largada', 'Definindo o seu cardápio de largada',
   'Como escolher os primeiros pratos para reduzir custo e erro.',
   $md$Comece com **seis pratos**, não com vinte. E escolha esses seis com três critérios:

1. **Ingredientes que se cruzam.** Se quatro pratos usam frango e três usam batata-doce, você compra em volume maior e paga menos por quilo.
2. **Aguentam três dias na geladeira.** Massa cozida, folha crua e fritura empanada não sobrevivem bem. Assados, refogados e ensopados sim.
3. **Você faz de olhos fechados.** O cardápio de largada não é onde você testa receita nova.

Monte a grade cobrindo os três objetivos que o cliente pede: dois **ricos em proteína**, dois **low carb** e dois **econômicos**. Assim você atende o cliente de academia, o de dieta e o que olha preço, sem triplicar a compra.

Use o banco de receitas do app para montar essa grade e rode cada uma na calculadora de macros. Você sai desta aula com seis fichas técnicas prontas.$md$,
   7, 6)
) as v(modulo, slug, titulo, resumo, conteudo, duracao, ordem)
  on v.modulo = m.slug
on conflict (slug) do nothing;

-- Aulas — Módulo 2 ----------------------------------------------------------

insert into public.lessons (module_id, slug, titulo, resumo, conteudo, duracao_minutos, ordem)
select m.id, v.slug, v.titulo, v.resumo, v.conteudo, v.duracao, v.ordem
from public.modules m
join (values
  ('precificacao-sem-chute', 'custo-direto', 'Custo direto: o que entra na marmita',
   'Como transformar preço de mercado em custo por porção sem erro.',
   $md$Custo direto é tudo que vai dentro da embalagem. A conta tem uma armadilha: você compra por quilo e vende por grama.

A fórmula é sempre a mesma:

> custo do ingrediente = (preço por quilo ÷ 1000) × gramas usadas

Um exemplo com peito de frango a R$ 18,90 o quilo e 150 g por marmita: (18,90 ÷ 1000) × 150 = **R$ 2,84**.

Duas correções que quase todo mundo esquece:

- **Perda de limpeza.** Se você compra frango com osso e pele, o rendimento cai. Compre 1 kg, limpe, pese o que sobrou e use esse peso na conta. Um rendimento de 70% significa que o seu quilo real custa R$ 27, não R$ 18,90.
- **Perda de cocção.** Arroz e feijão ganham peso ao cozinhar; carne perde. Padronize se você mede cru ou cozido e não misture os dois.

Na calculadora de macros do app você monta a receita em gramas e o custo estimado sai junto da ficha nutricional.$md$,
   9, 1),

  ('precificacao-sem-chute', 'custo-indireto', 'Custo indireto: gás, energia, embalagem e transporte',
   'Os custos que não aparecem no prato mas saem do seu bolso.',
   $md$Custo indireto é o que você paga para a marmita existir, mas não está dentro dela. Ele se divide em dois tipos:

**Por unidade (fácil de ratear):**
- Embalagem, tampa e etiqueta
- Sacola de entrega
- Talher descartável, quando você oferece

**Por lote (precisa ser dividido):**
- Gás e energia elétrica da produção
- Água e produto de limpeza
- Combustível ou taxa de entrega

Para ratear o custo de lote, some o gasto do dia de produção e divida pelo número de marmitas produzidas naquele dia. Se você gastou R$ 27 de gás e energia para fazer 60 marmitas, são **R$ 0,45 por unidade**.

Faça isso uma vez com atenção e depois use o valor como referência. Ele muda pouco enquanto o seu volume não muda muito.

O erro comum é achar que R$ 0,45 é irrelevante. Em 300 marmitas por mês são R$ 135 que estavam saindo do seu lucro sem aparecer.$md$,
   8, 2),

  ('precificacao-sem-chute', 'pagar-a-sua-hora', 'O erro que quebra: não pagar a sua própria hora',
   'Por que a mão de obra precisa entrar no custo mesmo quando você trabalha sozinho.',
   $md$Se você não coloca a sua hora no custo, o negócio parece lucrativo e não é. Você está subsidiando o cliente com o seu tempo.

Faça o exercício uma vez, com cronômetro, num dia normal de produção:

- Compra e transporte de insumos
- Higienização e preparo (cortar, temperar, marinar)
- Cocção
- Montagem, pesagem e fechamento das marmitas
- Limpeza da cozinha
- Atendimento no WhatsApp e organização de pedidos

Some tudo e divida pelo número de marmitas do dia. É comum dar entre **10 e 15 minutos por unidade** em operação caseira.

Agora defina o valor da sua hora. Um piso honesto: quanto você ganharia por hora num emprego equivalente. Se você aceitaria R$ 12 por hora, então 12 minutos custam R$ 2,40 por marmita.

Esse número vai doer na primeira vez. É exatamente por isso que ele precisa estar lá.$md$,
   9, 3),

  ('precificacao-sem-chute', 'margem-e-markup', 'Margem, markup e a conta que a maioria erra',
   'A diferença entre os dois e por que confundir custa dinheiro.',
   $md$Duas palavras parecidas, resultados muito diferentes.

**Markup** é o quanto você multiplica o custo. Custo R$ 10 com markup 2,0 vira preço R$ 20.

**Margem** é quanto do preço final sobra como lucro. No exemplo acima, sobram R$ 10 de um preço de R$ 20 — margem de **50%**.

O erro clássico: alguém quer "40% de margem", multiplica o custo por 1,4 e chega a R$ 14. Mas R$ 4 de lucro sobre R$ 14 é margem de 28,5%, não 40%.

A fórmula correta para chegar a uma margem alvo:

> preço = custo ÷ (1 − margem desejada)

Para custo R$ 10 e margem de 40%: 10 ÷ 0,6 = **R$ 16,67**.

Para marmita caseira, uma margem entre **40% e 55%** costuma ser sustentável. Abaixo de 30%, qualquer alta no preço da proteína apaga o seu lucro.

A calculadora de precificação do app mostra as duas leituras lado a lado, para você nunca mais confundir.$md$,
   8, 4),

  ('precificacao-sem-chute', 'preco-psicologico', 'Preço psicológico e faixas de mercado',
   'Como posicionar o número depois que a matemática já definiu o piso.',
   $md$A conta te dá o **piso**. O mercado te dá o **teto**. O preço final mora entre os dois.

Antes de fechar, faça uma pesquisa de 30 minutos: veja quanto cobram cinco concorrentes do seu bairro e do seu perfil. Anote preço, gramagem e o que está incluso. Muita gente cobra menos porque entrega 350 g contra os seus 450 g.

Três ajustes que funcionam:

- **Termine em 0 ou 9 com intenção.** R$ 19,90 comunica acessível; R$ 24,00 comunica padrão. Escolha conscientemente.
- **Ancore com um combo.** Se a unidade custa R$ 24 e o pacote de 5 sai por R$ 110 (R$ 22 cada), o cliente compra o pacote e você garante recorrência.
- **Nunca compita só por preço.** Se o seu custo é maior porque a sua proteína é melhor, comunique isso. Gramagem e ficha nutricional na descrição justificam a diferença.

Se o piso calculado ficou acima do teto do mercado, o problema não é o preço: é o custo ou a porção.$md$,
   7, 5),

  ('precificacao-sem-chute', 'tabela-de-precos', 'Montando a sua tabela de preços',
   'Fechar preços por prato, por combo e por plano semanal.',
   $md$Você não vende um preço, vende uma tabela. Ela costuma ter três níveis:

1. **Avulso.** Preço cheio, margem cheia. Serve de âncora.
2. **Pacote (5 ou 10 unidades).** Desconto de 5% a 10% em troca de compra maior. Reduz o seu custo de venda.
3. **Plano semanal.** O melhor preço, com pagamento antecipado. É o que estabiliza o seu caixa e a sua produção.

Regra de ouro: o desconto do pacote sai da sua **margem**, nunca do custo. Simule cada nível na calculadora e confira se a margem do plano semanal ainda fecha acima de 35%. Se não fecha, o desconto está grande demais.

Diferencie também por prato quando o custo for muito diferente. Salmão e carne de segunda não podem ter o mesmo preço só para simplificar a tabela — a diferença sai do seu bolso.

Salve cada nível como um cenário no app. Quando o preço da proteína subir, você reabre os três e reajusta em minutos.$md$,
   8, 6)
) as v(modulo, slug, titulo, resumo, conteudo, duracao, ordem)
  on v.modulo = m.slug
on conflict (slug) do nothing;

-- Aulas — Módulo 3 ----------------------------------------------------------

insert into public.lessons (module_id, slug, titulo, resumo, conteudo, duracao_minutos, ordem)
select m.id, v.slug, v.titulo, v.resumo, v.conteudo, v.duracao, v.ordem
from public.modules m
join (values
  ('marketing-local', 'cliente-em-3km', 'Quem é o seu cliente num raio de 3 km',
   'Achar demanda perto de casa antes de tentar alcançar a cidade inteira.',
   $md$Marmita é um negócio de raio curto. Entrega longe destrói a sua margem, então o seu mercado real é o que cabe em poucos quilômetros.

Mapeie o que existe nesse raio:

- **Academias e estúdios.** Público que já pensa em macro e aceita pagar mais por proteína.
- **Escritórios e clínicas.** Compram em grupo e valorizam pontualidade acima de tudo.
- **Condomínios grandes.** Entrega concentrada, custo de rota quase zero.
- **Salões, oficinas e comércio de rua.** Público que almoça no trabalho todo dia.

Para cada um, responda: quantas pessoas? qual horário de almoço? quanto pagam hoje?

Escolha **um** desses grupos para atacar primeiro. Vender para todo mundo ao mesmo tempo, com cardápio e discurso genéricos, é o jeito mais rápido de não convencer ninguém.$md$,
   7, 1),

  ('marketing-local', 'whatsapp-vitrine-e-caixa', 'WhatsApp como vitrine e caixa',
   'Organizar o canal onde a venda de marmita realmente acontece.',
   $md$O seu ponto de venda é o WhatsApp. Trate como loja, não como conversa solta.

O mínimo bem feito:

- **Perfil comercial** com foto do produto, descrição clara e endereço aproximado.
- **Catálogo** com os pratos, foto, descrição e preço. O cliente compra sem perguntar.
- **Mensagem de saudação automática** com horário de pedido e prazo de entrega.
- **Respostas rápidas** salvas para cardápio da semana, formas de pagamento e prazo.
- **Listas de transmissão** (não grupos) para enviar o cardápio semanal.

Estabeleça uma **janela de pedido**: por exemplo, pedidos até sexta às 18h para entrega na segunda. Sem janela, você produz no escuro e sobra ou falta.

E documente todo pedido no mesmo lugar. Enquanto o CRM não existe no app, uma planilha simples com nome, itens, valor, data de entrega e status já evita 90% dos erros.$md$,
   8, 2),

  ('marketing-local', 'cardapio-que-vende', 'Cardápio que vende sozinho',
   'Escrever a descrição que responde as dúvidas antes de o cliente perguntar.',
   $md$Cardápio de marmita fit não é lista de pratos. É um argumento de venda em texto curto.

Cada item precisa de quatro informações:

1. **Nome direto.** "Frango grelhado com arroz integral e brócolis" vende mais que "Fit Power Chicken".
2. **Gramagem total.** É o que permite ao cliente comparar o seu preço com o do concorrente.
3. **Ficha nutricional resumida.** Calorias e proteína bastam na listagem.
4. **Preço.** Sem "chame no direct".

Exemplo pronto para copiar:

> **Frango grelhado com arroz integral e brócolis** — 450 g
> 498 kcal · 42 g de proteína
> R$ 24,90

Agrupe por objetivo — rica em proteína, low carb, econômica — porque é assim que o cliente escolhe. E mande o cardápio sempre no mesmo dia e horário: previsibilidade cria hábito de compra.

Os dados nutricionais saem prontos da calculadora de macros do app.$md$,
   6, 3),

  ('marketing-local', 'foto-de-comida-com-celular', 'Foto de comida com celular',
   'Três ajustes que separam a foto que vende da que afasta.',
   $md$Você não precisa de câmera nem de estúdio. Precisa de três coisas:

- **Luz natural, lateral, sem flash.** Perto de uma janela, no meio da manhã. O flash achata a comida e deixa a cor cinzenta.
- **Fundo neutro e limpo.** Uma tábua de madeira, um pano liso, uma bancada clara. Nada de pia ao fundo.
- **Ângulo de 45° ou de cima.** De 45° para pratos com altura, de cima para a marmita aberta com as divisórias visíveis.

Fotografe a marmita **montada como o cliente recebe**, não uma versão caprichada que não existe. Foto que promete mais do que entrega gera a pior reclamação que existe.

Duas fotos por prato bastam: uma da marmita fechada com etiqueta e uma aberta. Refaça o banco de fotos a cada seis meses ou quando mudar a embalagem.$md$,
   6, 4),

  ('marketing-local', 'parcerias-locais', 'Parcerias com academias e escritórios',
   'A abordagem que funciona para vender em volume sem gastar com anúncio.',
   $md$Parceria local é o canal de aquisição mais barato para marmita. E a abordagem certa não é pedir espaço: é oferecer solução.

Roteiro para academia:

1. Vá no horário vazio, entre 14h e 16h, e fale com quem decide.
2. Leve **duas marmitas prontas** com etiqueta e ficha nutricional.
3. Proponha algo concreto: cardápio exclusivo para alunos com 10% de desconto, em troca de divulgação no grupo e um espaço para o seu cardápio na recepção.
4. Ofereça comissão ou permuta se fizer sentido — mensalidade em troca de marmitas costuma agradar.

Para escritório, mude o argumento: em vez de desconto, ofereça **entrega fixa no mesmo horário** e pedido consolidado numa única lista. O que eles compram é previsibilidade.

Meta realista: três conversas por semana. Uma parceria fechada por mês já muda o seu volume.$md$,
   7, 5)
) as v(modulo, slug, titulo, resumo, conteudo, duracao, ordem)
  on v.modulo = m.slug
on conflict (slug) do nothing;

-- Aulas — Módulo 4 ----------------------------------------------------------

insert into public.lessons (module_id, slug, titulo, resumo, conteudo, duracao_minutos, ordem)
select m.id, v.slug, v.titulo, v.resumo, v.conteudo, v.duracao, v.ordem
from public.modules m
join (values
  ('logistica-e-entrega', 'producao-em-lote', 'Produção em lote: cozinhar uma vez, vender a semana',
   'O método que multiplica a sua capacidade sem aumentar a sua jornada.',
   $md$Produção em lote é o que separa 60 marmitas por mês de 300 com o mesmo esforço.

A lógica: **agrupe por técnica, não por prato**. Em vez de fazer um prato inteiro de cada vez, faça todas as proteínas assadas juntas, todos os grãos juntos, todos os legumes juntos. Depois monte.

Um dia de produção bem sequenciado:

1. **Antes de tudo:** ligue o forno e a panela de pressão. Eles são o gargalo.
2. **Enquanto assam:** lave e corte todos os legumes da semana.
3. **Grãos:** arroz e feijão em panelas grandes, uma vez só.
4. **Resfriamento:** espalhe tudo em assadeiras rasas até baixar a temperatura.
5. **Montagem em linha:** balança de um lado, marmitas alinhadas, um componente por vez em todas.
6. **Fechar, etiquetar, refrigerar.**

Monte sempre com balança. É a padronização de porção que protege o seu custo — 20 g a mais de proteína em 300 marmitas é dinheiro de verdade indo embora.$md$,
   9, 1),

  ('logistica-e-entrega', 'resfriamento-e-validade', 'Resfriamento, embalagem e validade',
   'Como a comida chega segura e ainda com cara de comida.',
   $md$O que estraga a marmita não é a receita, é o intervalo entre a panela e a geladeira.

**Resfriamento:** espalhe a comida quente em recipiente raso, nunca em panela funda. O alvo é sair de 60 °C para menos de 10 °C em até duas horas. Só feche e empilhe depois de fria — vapor preso vira água no fundo e amolece tudo.

**Embalagem:** marmita de polipropileno com trava suporta micro-ondas e não vaza. Separe o molho quando ele puder encharcar a base. Componente crocante vai em saquinho à parte.

**Etiqueta obrigatória:** nome do prato, data de produção, validade e modo de aquecimento. Isso reduz reclamação e passa profissionalismo por menos de dez centavos.

**Validade prática:** 3 a 4 dias refrigerada, até 90 dias congelada. Nunca recongele o que já descongelou.

Detalhe que muda percepção: escreva o modo de aquecer na etiqueta. Marmita aquecida errado vira reclamação sobre a sua comida.$md$,
   8, 2),

  ('logistica-e-entrega', 'rota-e-taxa-de-entrega', 'Rota de entrega e taxa que não come o lucro',
   'Como calcular frete de verdade e organizar a rota por bairro.',
   $md$Entrega mal calculada é o segundo maior destruidor de margem, atrás só da mão de obra não contabilizada.

Calcule o custo real da sua rota:

> custo por entrega = (combustível + desgaste + o seu tempo) ÷ número de entregas da rota

Se você roda 20 km, gasta R$ 18 entre combustível e desgaste, leva 1h30 e entrega 12 marmitas, o custo é R$ 1,50 mais a sua hora — algo perto de **R$ 3,00 por entrega**.

Três decisões que resolvem quase tudo:

- **Dias fixos por região.** Segunda o bairro A, quarta o bairro B. Rota concentrada derruba o custo por entrega.
- **Pedido mínimo por entrega gratuita.** Frete grátis acima de 4 marmitas incentiva o pacote e paga a rota.
- **Ponto de retirada.** Combinar retirada num local fixo elimina o custo e agrada quem passa por perto.

Nunca ofereça entrega grátis para unidade avulsa longe. É a venda que dá prejuízo com cara de crescimento.$md$,
   8, 3),

  ('logistica-e-entrega', 'entrega-propria-ou-app', 'Entrega própria, aplicativo ou retirada',
   'Comparando os três canais pelo que sobra no fim.',
   $md$Cada canal tem um custo escondido diferente.

**Entrega própria.** Custo entre R$ 2 e R$ 4 por unidade em rota concentrada. Você mantém o contato com o cliente e o dado do pedido. É o melhor canal para recorrência.

**Aplicativo de delivery.** Comissão que costuma variar de 12% a 27% do valor da venda. Numa marmita de R$ 24 com margem de 45%, uma comissão de 25% consome mais da metade do seu lucro. Serve para aquisição de cliente novo, não como canal principal.

**Retirada.** Custo zero de logística. Ofereça um desconto pequeno, de 5% a 8%, e boa parte dos clientes próximos aceita.

A composição saudável para operação caseira costuma ser: **60% entrega própria, 30% retirada, 10% aplicativo**. Use o app de delivery como vitrine para conhecer gente nova e migre esse cliente para o seu WhatsApp na segunda compra, com um cartão dentro da sacola.$md$,
   7, 4),

  ('logistica-e-entrega', 'controle-de-estoque', 'Controle de estoque sem sistema caro',
   'O mínimo de controle que evita compra errada e perda de insumo.',
   $md$Você não precisa de ERP. Precisa de três controles, e uma planilha resolve.

**1. Lista de compra derivada do pedido.** Some as gramagens das receitas vendidas na semana e compre exatamente isso mais 10% de folga. Sem isso você compra por intuição e joga fora.

**2. Contagem semanal do que não perece.** Arroz, feijão, óleo, tempero e embalagem. Anote o saldo no mesmo dia toda semana. Você descobre o consumo real e para de comprar em pânico.

**3. Primeiro que entra, primeiro que sai.** Insumo novo vai para o fundo da prateleira. Óbvio, e é o que quase ninguém faz.

Registre também a **perda**: o que estragou, o que sobrou, o que caiu. Perda acima de 5% do custo de insumo é sinal de compra desalinhada com a venda.

Esses números são a base do módulo de estoque que entra na fase 2 do app.$md$,
   6, 5)
) as v(modulo, slug, titulo, resumo, conteudo, duracao, ordem)
  on v.modulo = m.slug
on conflict (slug) do nothing;

-- Aulas — Módulo 5 ----------------------------------------------------------

insert into public.lessons (module_id, slug, titulo, resumo, conteudo, duracao_minutos, ordem)
select m.id, v.slug, v.titulo, v.resumo, v.conteudo, v.duracao, v.ordem
from public.modules m
join (values
  ('atendimento-e-fidelizacao', 'primeiro-contato', 'O primeiro contato define a recompra',
   'O roteiro de atendimento que transforma curioso em cliente.',
   $md$A maior parte da perda de venda acontece na primeira mensagem. Padronize esse momento.

Quando alguém chega perguntando preço:

1. **Responda em minutos, não em horas.** Velocidade de resposta é o fator que mais converte nesse negócio.
2. **Mande o cardápio completo**, com gramagem, ficha nutricional e preço. Não devolva pergunta com pergunta.
3. **Faça uma pergunta útil:** "É para você ou para a família?" ou "Prefere mais proteína ou mais leve?". Isso te dá o dado para recomendar.
4. **Recomende um prato específico.** Cliente indeciso não compra; cliente orientado compra.
5. **Feche com a janela de pedido.** "Fecho os pedidos sexta às 18h para entregar segunda."

Depois da primeira entrega, mande **uma** mensagem em até 48 horas perguntando o que ele achou. Não é gentileza: é a pergunta que abre a segunda venda e te dá o feedback do módulo três desta trilha.$md$,
   7, 1),

  ('atendimento-e-fidelizacao', 'plano-semanal', 'Plano semanal: a assinatura da marmita',
   'Transformar venda avulsa em receita previsível.',
   $md$O plano semanal é a mudança mais rentável que existe nesse negócio. Ele resolve três problemas de uma vez: caixa antecipado, produção previsível e compra de insumo em volume.

Como estruturar:

- **Pacotes fechados.** 5, 10 ou 20 marmitas por semana, com pagamento antecipado.
- **Desconto entre 8% e 12%.** Sai da sua margem, e ainda assim vale porque o custo de venda cai a quase zero.
- **Cardápio rotativo.** Você define os pratos da semana, com uma troca permitida. Isso protege a sua produção em lote.
- **Renovação automática por padrão**, com aviso na quinta-feira e cancelamento fácil.

Simule o plano como um cenário na calculadora de precificação antes de anunciar. Se a margem do plano cair abaixo de 35%, reduza o desconto ou aumente o tamanho mínimo do pacote.

Meta prática: converter **30% dos clientes recorrentes** em plano nos primeiros três meses.$md$,
   8, 2),

  ('atendimento-e-fidelizacao', 'usando-feedback', 'Como pedir e usar feedback',
   'A pergunta certa, na hora certa, para melhorar o que importa.',
   $md$Feedback genérico não serve para nada. "Tá ótimo!" não te diz o que mudar.

Pergunte duas coisas, 48 horas depois da primeira entrega:

1. **"De 0 a 10, quanto você indicaria para um amigo?"**
2. **"O que faltou para ser 10?"**

A segunda pergunta é a que vale. Ela força uma resposta específica: tempero fraco, porção pequena, entrega atrasada, embalagem vazando.

Organize as respostas em três baldes:

- **Comida** (sabor, tempero, ponto, variedade)
- **Porção e preço** (percepção de valor)
- **Operação** (horário, embalagem, comunicação)

Mexa primeiro no balde com mais menções. E avise o cliente quando você mudar por causa dele — "aumentei a proteína de 130 g para 150 g depois do seu comentário" gera lealdade que desconto nenhum compra.

Quem dá 9 ou 10 é quem você convida para o programa de indicação da próxima aula.$md$,
   6, 3),

  ('atendimento-e-fidelizacao', 'reclamacao-sem-perder-margem', 'Resolvendo reclamação sem perder margem',
   'Um protocolo simples que resolve o problema sem virar prejuízo.',
   $md$Reclamação vai acontecer. O que define o estrago é o protocolo.

**Passo 1 — Ouça sem justificar.** "Me conta o que aconteceu." Nada de explicar antes de entender.

**Passo 2 — Classifique.**
- *Erro seu* (faltou item, vazou, atrasou, veio errado)
- *Preferência* (achou salgado, não gostou do prato)
- *Uso* (aqueceu errado, deixou fora da geladeira)

**Passo 3 — Responda conforme o tipo.**
- Erro seu: reponha a unidade na próxima entrega. Sem discussão. Custa uma marmita e salva um cliente.
- Preferência: ofereça a troca do prato no próximo pedido, sem reposição.
- Uso: oriente com gentileza e mande o modo de aquecimento por escrito.

**Passo 4 — Registre.** Se o mesmo problema aparece três vezes, não é cliente chato: é processo furado.

O limite: reposição é para erro seu. Repor por preferência transforma o seu lucro num serviço de degustação gratuita.$md$,
   7, 4),

  ('atendimento-e-fidelizacao', 'programa-de-indicacao', 'Programa de indicação que funciona no bairro',
   'O canal de aquisição mais barato, estruturado para dar resultado.',
   $md$Indicação em negócio de bairro converte mais que qualquer anúncio pago. O problema é que quase ninguém pede.

Estruture assim:

- **Quem convidar:** os clientes que deram 9 ou 10 no feedback. Só eles.
- **A oferta:** uma marmita grátis para quem indica, depois que o indicado fizer a primeira compra. Simples de entender e você só paga com venda no bolso.
- **O convite:** mensagem direta, nominal. "Fulano, você é dos clientes que mais elogiam o frango. Se indicar alguém que comprar, a próxima é por minha conta."
- **O controle:** anote quem indicou quem. Sem controle, você paga errado e perde a confiança.

Faça o convite uma vez por mês, não toda semana. E dê o brinde rápido — recompensa que demora não estimula ninguém.

Conta simples: se o custo da marmita grátis é R$ 11 e o cliente novo compra em média R$ 90 por mês, você comprou um cliente por 12% de uma mensalidade. Nenhum anúncio chega perto disso.$md$,
   7, 5)
) as v(modulo, slug, titulo, resumo, conteudo, duracao, ordem)
  on v.modulo = m.slug
on conflict (slug) do nothing;

-- Ingredientes --------------------------------------------------------------
-- kcal, proteína, carboidrato e gordura por 100 g. Preço em R$ por quilo.

insert into public.ingredients
  (slug, nome, categoria, kcal, proteina_g, carboidrato_g, gordura_g, preco_medio_kg)
values
  -- Carnes, peixes e ovos
  ('peito-de-frango-cru', 'Peito de frango cru, sem pele', 'Carnes e ovos', 113, 23.10, 0, 1.90, 18.90),
  ('coxa-sobrecoxa-frango', 'Coxa e sobrecoxa de frango sem pele', 'Carnes e ovos', 120, 19.50, 0, 4.50, 13.90),
  ('patinho-bovino', 'Patinho bovino cru', 'Carnes e ovos', 133, 21.70, 0, 4.50, 42.90),
  ('coxao-mole', 'Coxão mole cru', 'Carnes e ovos', 143, 21.50, 0, 5.90, 44.90),
  ('acem-bovino', 'Acém bovino cru', 'Carnes e ovos', 172, 19.80, 0, 10.00, 34.90),
  ('musculo-bovino', 'Músculo bovino cru', 'Carnes e ovos', 143, 21.00, 0, 6.00, 32.90),
  ('lombo-suino', 'Lombo suíno cru', 'Carnes e ovos', 141, 22.60, 0, 5.20, 26.90),
  ('file-de-tilapia', 'Filé de tilápia cru', 'Carnes e ovos', 96, 20.10, 0, 1.70, 39.90),
  ('salmao-fresco', 'Salmão fresco cru', 'Carnes e ovos', 208, 20.40, 0, 13.40, 89.90),
  ('sardinha-fresca', 'Sardinha fresca', 'Carnes e ovos', 164, 21.00, 0, 8.80, 24.90),
  ('atum-conserva-natural', 'Atum em conserva ao natural', 'Carnes e ovos', 116, 25.50, 0, 1.00, 59.90),
  ('ovo-de-galinha', 'Ovo de galinha inteiro cru', 'Carnes e ovos', 143, 13.00, 1.10, 9.50, 18.90),
  ('clara-de-ovo', 'Clara de ovo', 'Carnes e ovos', 52, 10.90, 0.70, 0.20, 22.90),
  ('carne-seca-dessalgada', 'Carne seca dessalgada', 'Carnes e ovos', 194, 26.00, 0, 9.50, 59.90),
  ('peito-de-peru-defumado', 'Peito de peru defumado', 'Carnes e ovos', 111, 17.40, 2.50, 3.40, 49.90),

  -- Grãos, tubérculos e massas
  ('arroz-branco-cozido', 'Arroz branco cozido', 'Grãos e massas', 128, 2.50, 28.10, 0.20, 6.50),
  ('arroz-integral-cozido', 'Arroz integral cozido', 'Grãos e massas', 124, 2.60, 25.80, 1.00, 9.90),
  ('batata-doce-cozida', 'Batata-doce cozida', 'Grãos e massas', 77, 0.60, 18.40, 0.10, 5.90),
  ('batata-inglesa-cozida', 'Batata inglesa cozida', 'Grãos e massas', 52, 1.20, 11.90, 0.10, 4.90),
  ('mandioca-cozida', 'Mandioca cozida', 'Grãos e massas', 125, 0.60, 30.10, 0.30, 4.50),
  ('macarrao-integral-cozido', 'Macarrão integral cozido', 'Grãos e massas', 124, 5.00, 25.00, 0.90, 12.90),
  ('macarrao-comum-cozido', 'Macarrão comum cozido', 'Grãos e massas', 111, 3.40, 22.00, 0.60, 7.90),
  ('quinoa-cozida', 'Quinoa cozida', 'Grãos e massas', 120, 4.40, 21.30, 1.90, 39.90),
  ('aveia-em-flocos', 'Aveia em flocos', 'Grãos e massas', 394, 13.90, 66.60, 8.50, 12.90),
  ('feijao-carioca-cozido', 'Feijão carioca cozido', 'Grãos e massas', 76, 4.80, 13.60, 0.50, 9.90),
  ('feijao-preto-cozido', 'Feijão preto cozido', 'Grãos e massas', 77, 4.50, 14.00, 0.50, 9.90),
  ('lentilha-cozida', 'Lentilha cozida', 'Grãos e massas', 93, 6.30, 16.30, 0.50, 14.90),
  ('grao-de-bico-cozido', 'Grão-de-bico cozido', 'Grãos e massas', 121, 8.40, 16.70, 2.10, 19.90),
  ('milho-verde-conserva', 'Milho verde em conserva', 'Grãos e massas', 98, 3.20, 17.10, 2.40, 13.90),
  ('cuscuz-de-milho', 'Cuscuz de milho cozido', 'Grãos e massas', 113, 2.20, 25.30, 0.30, 7.90),
  ('pao-integral', 'Pão integral', 'Grãos e massas', 253, 9.40, 43.90, 3.70, 15.90),
  ('tapioca-goma', 'Tapioca, goma hidratada', 'Grãos e massas', 175, 0.10, 43.00, 0.10, 12.90),

  -- Legumes e verduras
  ('brocolis-cozido', 'Brócolis cozido', 'Legumes e verduras', 25, 2.10, 4.40, 0.50, 12.90),
  ('couve-flor-cozida', 'Couve-flor cozida', 'Legumes e verduras', 19, 1.20, 3.90, 0.20, 9.90),
  ('cenoura-cozida', 'Cenoura cozida', 'Legumes e verduras', 30, 0.80, 6.70, 0.20, 5.90),
  ('abobrinha-cozida', 'Abobrinha cozida', 'Legumes e verduras', 15, 1.10, 3.00, 0.20, 6.90),
  ('berinjela-cozida', 'Berinjela cozida', 'Legumes e verduras', 19, 0.70, 4.40, 0.10, 8.90),
  ('abobora-cabotia-cozida', 'Abóbora cabotiá cozida', 'Legumes e verduras', 48, 1.40, 10.80, 0.50, 5.90),
  ('chuchu-cozido', 'Chuchu cozido', 'Legumes e verduras', 19, 0.40, 4.80, 0.10, 4.50),
  ('vagem-cozida', 'Vagem cozida', 'Legumes e verduras', 25, 1.80, 5.30, 0.20, 12.90),
  ('espinafre-cru', 'Espinafre cru', 'Legumes e verduras', 23, 2.70, 3.60, 0.40, 14.90),
  ('couve-manteiga-crua', 'Couve manteiga crua', 'Legumes e verduras', 27, 2.90, 4.30, 0.50, 9.90),
  ('repolho-cru', 'Repolho cru', 'Legumes e verduras', 25, 1.30, 5.80, 0.10, 4.50),
  ('tomate-cru', 'Tomate cru', 'Legumes e verduras', 15, 1.10, 3.10, 0.20, 7.90),
  ('cebola-crua', 'Cebola crua', 'Legumes e verduras', 39, 1.70, 8.90, 0.10, 5.90),
  ('alho-cru', 'Alho cru', 'Legumes e verduras', 113, 7.00, 23.90, 0.20, 29.90),
  ('pimentao-verde', 'Pimentão verde cru', 'Legumes e verduras', 21, 1.10, 4.90, 0.20, 9.90),
  ('beterraba-cozida', 'Beterraba cozida', 'Legumes e verduras', 32, 1.30, 7.20, 0.10, 5.90),
  ('alface-crespa', 'Alface crespa', 'Legumes e verduras', 11, 1.30, 1.70, 0.20, 12.90),
  ('pepino-cru', 'Pepino cru', 'Legumes e verduras', 10, 0.90, 2.00, 0.10, 6.90),

  -- Laticínios e gorduras
  ('azeite-extravirgem', 'Azeite de oliva extravirgem', 'Gorduras', 884, 0, 0, 100.00, 49.90),
  ('oleo-de-soja', 'Óleo de soja', 'Gorduras', 884, 0, 0, 100.00, 9.90),
  ('manteiga-sem-sal', 'Manteiga sem sal', 'Gorduras', 760, 0.40, 0.10, 84.00, 59.90),
  ('creme-de-ricota-light', 'Creme de ricota light', 'Laticínios', 176, 8.00, 4.00, 14.00, 34.90),
  ('requeijao-light', 'Requeijão light', 'Laticínios', 172, 9.40, 4.60, 12.40, 29.90),
  ('queijo-mucarela', 'Queijo muçarela', 'Laticínios', 330, 22.60, 3.00, 25.20, 44.90),
  ('queijo-cottage', 'Queijo cottage', 'Laticínios', 98, 11.10, 3.40, 4.30, 39.90),
  ('iogurte-natural-desnatado', 'Iogurte natural desnatado', 'Laticínios', 41, 4.10, 5.80, 0.20, 15.90),
  ('leite-desnatado', 'Leite desnatado', 'Laticínios', 35, 3.40, 4.90, 0.20, 5.50),
  ('castanha-do-para', 'Castanha-do-pará', 'Gorduras', 643, 14.50, 15.10, 63.50, 129.90),

  -- Bases, molhos e temperos
  ('extrato-de-tomate', 'Extrato de tomate', 'Molhos e temperos', 61, 3.00, 12.00, 0.40, 16.90),
  ('molho-de-tomate-pronto', 'Molho de tomate pronto', 'Molhos e temperos', 38, 1.30, 7.00, 0.50, 9.90),
  ('champignon-conserva', 'Champignon em conserva', 'Molhos e temperos', 22, 2.40, 3.30, 0.30, 39.90),
  ('farinha-de-mandioca', 'Farinha de mandioca', 'Molhos e temperos', 365, 1.60, 87.90, 0.30, 8.90),
  ('farinha-de-trigo', 'Farinha de trigo', 'Molhos e temperos', 360, 9.80, 75.10, 1.40, 5.90),
  ('cheiro-verde', 'Cheiro-verde', 'Molhos e temperos', 32, 2.60, 5.60, 0.40, 24.90),
  ('sal-refinado', 'Sal refinado', 'Molhos e temperos', 0, 0, 0, 0, 2.50)
on conflict (slug) do nothing;

-- Receitas ------------------------------------------------------------------

insert into public.recipes
  (slug, nome, descricao, objetivo, modo_preparo, rendimento_porcoes, tempo_preparo_minutos, publica)
values
  ('frango-grelhado-arroz-integral-brocolis',
   'Frango grelhado com arroz integral e brócolis',
   'O prato de entrada de qualquer cardápio fit: barato de produzir, aceito por quase todo cliente e estável por três dias na geladeira.',
   'rica_proteina',
   $md$1. Tempere o peito de frango com alho amassado, sal e cheiro-verde. Deixe descansar por 20 minutos.
2. Aqueça uma frigideira antiaderente com o azeite e grelhe o frango em fogo médio, cerca de 6 minutos de cada lado, até dourar e o centro perder o rosado.
3. Cozinhe o arroz integral com o dobro de água e um fio de azeite, por aproximadamente 35 minutos.
4. Cozinhe o brócolis no vapor por 5 minutos: precisa ficar firme, porque ele amolece de novo no reaquecimento.
5. Deixe tudo esfriar em recipiente raso antes de montar.
6. Monte a marmita com o arroz de um lado, o brócolis do outro e o frango fatiado por cima.$md$,
   4, 45, true),

  ('strogonoff-fit-de-frango',
   'Strogonoff fit de frango',
   'A versão sem creme de leite tradicional, com creme de ricota. Mantém a cremosidade e corta boa parte da gordura.',
   'rica_proteina',
   $md$1. Corte o peito de frango em cubos e tempere com sal e alho.
2. Refogue a cebola no azeite até ficar transparente, junte o frango e sele até dourar.
3. Acrescente o champignon escorrido e o extrato de tomate. Cozinhe por 5 minutos.
4. Desligue o fogo, espere baixar a fervura e só então incorpore o creme de ricota, mexendo devagar para não talhar.
5. Ajuste o sal e finalize com cheiro-verde.
6. Sirva com arroz branco. Para a marmita, mantenha o molho separado do arroz sempre que possível.$md$,
   4, 35, true),

  ('escondidinho-de-abobora-com-carne-moida',
   'Escondidinho de abóbora com carne moída',
   'Prato de custo baixo e alta aceitação, que rende bem e congela sem perder textura.',
   'economica',
   $md$1. Cozinhe a abóbora cabotiá até ficar bem macia, escorra e amasse com um pouco de leite desnatado e sal.
2. Refogue a cebola e o alho no óleo, junte a carne moída e cozinhe até secar o líquido.
3. Acrescente o molho de tomate e deixe apurar por 10 minutos.
4. Em um refratário, faça uma camada de carne e cubra com o purê de abóbora.
5. Leve ao forno a 200 °C por 20 minutos, até formar uma casquinha dourada.
6. Espere esfriar completamente antes de porcionar — quente, o purê solta água na marmita.$md$,
   5, 50, true),

  ('salmao-com-pure-de-couve-flor',
   'Salmão com purê de couve-flor',
   'A opção premium do cardápio: baixo carboidrato, alto valor percebido e preço de venda maior.',
   'low_carb',
   $md$1. Tempere o salmão com sal e alho e deixe descansar 15 minutos.
2. Cozinhe a couve-flor até ficar bem macia. Escorra muito bem — água residual arruína o purê.
3. Bata a couve-flor com o requeijão light e o sal até obter um creme liso.
4. Grelhe o salmão com a pele para baixo por 4 minutos, vire e finalize por mais 3.
5. Monte com o purê na base e o salmão por cima.
6. Finalize com cheiro-verde. Esta receita é a que menos tolera reaquecimento no micro-ondas em potência alta: oriente o cliente na etiqueta.$md$,
   2, 30, true),

  ('omelete-de-forno-com-legumes',
   'Omelete de forno com legumes',
   'Assada em travessa e cortada em porções: produção rápida e um dos menores custos por marmita do cardápio.',
   'low_carb',
   $md$1. Bata os ovos com sal e cheiro-verde.
2. Refogue rapidamente a abobrinha, o tomate e a cebola no azeite, só para tirar a água.
3. Misture os legumes aos ovos e acrescente o queijo muçarela ralado.
4. Despeje em uma travessa untada e leve ao forno a 180 °C por 25 minutos, até firmar no centro.
5. Espere esfriar antes de cortar em porções quadradas.
6. Acompanha bem uma salada de folhas embalada à parte.$md$,
   4, 35, true),

  ('feijoada-light-de-lentilha',
   'Feijoada light de lentilha',
   'O sabor de comida caseira com custo controlado e proteína vegetal. Rende muito e agrada quem não quer carne todo dia.',
   'economica',
   $md$1. Deixe a lentilha de molho por 2 horas e escorra.
2. Refogue a cebola e o alho no óleo, junte o lombo suíno em cubos e sele.
3. Acrescente a lentilha, cubra com água e cozinhe em fogo baixo por 30 minutos, até ficar macia sem desmanchar.
4. Junte o tomate picado e ajuste o sal nos últimos 10 minutos.
5. Sirva com arroz branco e couve manteiga refogada.
6. Esta receita melhora no dia seguinte e é uma das que melhor suportam o congelamento.$md$,
   6, 60, true),

  ('tilapia-ao-forno-com-legumes',
   'Tilápia ao forno com legumes e batata-doce',
   'Assado de bandeja: entra tudo junto no forno, o que reduz drasticamente o tempo de mão de obra por marmita.',
   'rica_proteina',
   $md$1. Corte a batata-doce e a cenoura em rodelas de 1 cm e a abobrinha em meias-luas.
2. Espalhe os legumes em uma assadeira, regue com azeite, tempere com sal e alho e leve ao forno a 200 °C por 20 minutos.
3. Tempere os filés de tilápia com sal, alho e cheiro-verde.
4. Abra espaço na assadeira, acomode os filés sobre os legumes e volte ao forno por mais 15 minutos.
5. Confira o ponto do peixe: ele deve soltar em lascas com o garfo.
6. Monte a marmita com os legumes na base e o filé inteiro por cima, para não quebrar no transporte.$md$,
   4, 40, true),

  ('carne-moida-com-abobrinha-e-arroz',
   'Carne moída com abobrinha e arroz',
   'O clássico que sustenta o cardápio econômico. A abobrinha estica o rendimento da carne sem denunciar.',
   'economica',
   $md$1. Refogue a cebola e o alho no óleo até dourar.
2. Junte a carne moída e cozinhe em fogo alto, mexendo, até secar toda a água e começar a fritar.
3. Acrescente a abobrinha em cubos pequenos e o molho de tomate. Cozinhe por 10 minutos.
4. Ajuste o sal e finalize com cheiro-verde.
5. Sirva com arroz branco e feijão carioca.
6. Se quiser reduzir ainda mais o custo por porção, aumente a proporção de abobrinha em até 30% sem alterar o tempero.$md$,
   5, 35, true),

  ('frango-desfiado-com-pure-de-batata-doce',
   'Frango desfiado com purê de batata-doce',
   'A combinação mais pedida por quem treina. Fácil de padronizar na balança e estável na geladeira.',
   'rica_proteina',
   $md$1. Cozinhe o peito de frango na panela de pressão com sal, alho e cebola por 20 minutos.
2. Desfie o frango ainda morno e reserve o caldo do cozimento.
3. Refogue o frango desfiado com o molho de tomate e um pouco do caldo reservado, até ficar úmido mas não encharcado.
4. Cozinhe a batata-doce até ficar macia, amasse com o leite desnatado e ajuste o sal.
5. Cozinhe o brócolis no vapor por 5 minutos.
6. Monte com o purê, o frango e o brócolis em compartimentos separados.$md$,
   4, 45, true),

  ('panqueca-de-carne-com-molho',
   'Panqueca de carne com molho de tomate',
   'Prato de percepção de valor alta e custo médio. Boa saída para variar o cardápio sem mudar a lista de compras.',
   'economica',
   $md$1. Bata a farinha de trigo, os ovos e o leite desnatado até obter uma massa lisa. Deixe descansar 15 minutos.
2. Faça discos finos em frigideira antiaderente levemente untada.
3. Para o recheio, refogue a cebola e o alho, junte a carne moída e cozinhe até secar.
4. Recheie as panquecas, enrole e disponha em um refratário.
5. Cubra com o molho de tomate e leve ao forno a 180 °C por 20 minutos.
6. Porcione com duas unidades por marmita e mantenha um pouco de molho por cima para não ressecar no reaquecimento.$md$,
   4, 50, true),

  ('peito-de-peru-com-quinoa',
   'Peito de peru com quinoa e legumes',
   'Montagem rápida, sem forno e sem panela grande. Serve bem em dias de produção apertada.',
   'rica_proteina',
   $md$1. Cozinhe a quinoa em duas partes de água para uma de grão, por cerca de 15 minutos.
2. Refogue a cenoura, a vagem e o pimentão no azeite, mantendo-os firmes.
3. Corte o peito de peru defumado em tiras largas e aqueça rapidamente na mesma frigideira.
4. Misture a quinoa aos legumes e ajuste o sal.
5. Monte a marmita com a mistura na base e as tiras de peru por cima.
6. Finalize com cheiro-verde. Este prato também funciona bem servido frio.$md$,
   3, 30, true),

  ('berinjela-recheada-com-frango',
   'Berinjela recheada com frango',
   'Baixo carboidrato com boa apresentação. Um dos pratos que mais sustentam preço acima da média do cardápio.',
   'low_carb',
   $md$1. Corte as berinjelas ao meio no comprimento e retire parte da polpa, deixando uma borda de 1 cm.
2. Pincele com azeite, tempere com sal e asse a 200 °C por 15 minutos com o corte para baixo.
3. Pique a polpa reservada e refogue com cebola, alho e tomate.
4. Junte o peito de frango desfiado e o extrato de tomate. Cozinhe por 8 minutos.
5. Recheie as berinjelas, cubra com queijo muçarela e volte ao forno por 12 minutos.
6. Espere firmar antes de embalar: quente, o recheio escorre e desmonta a apresentação.$md$,
   4, 45, true)
on conflict (slug) do nothing;

-- Ingredientes das receitas -------------------------------------------------

insert into public.recipe_ingredients (recipe_id, ingredient_id, quantidade_g, ordem)
select r.id, i.id, v.gramas, v.ordem
from (values
  -- Frango grelhado com arroz integral e brócolis
  ('frango-grelhado-arroz-integral-brocolis', 'peito-de-frango-cru', 600, 1),
  ('frango-grelhado-arroz-integral-brocolis', 'arroz-integral-cozido', 600, 2),
  ('frango-grelhado-arroz-integral-brocolis', 'brocolis-cozido', 400, 3),
  ('frango-grelhado-arroz-integral-brocolis', 'azeite-extravirgem', 20, 4),
  ('frango-grelhado-arroz-integral-brocolis', 'alho-cru', 10, 5),
  ('frango-grelhado-arroz-integral-brocolis', 'cheiro-verde', 10, 6),
  ('frango-grelhado-arroz-integral-brocolis', 'sal-refinado', 6, 7),

  -- Strogonoff fit de frango
  ('strogonoff-fit-de-frango', 'peito-de-frango-cru', 600, 1),
  ('strogonoff-fit-de-frango', 'creme-de-ricota-light', 200, 2),
  ('strogonoff-fit-de-frango', 'champignon-conserva', 150, 3),
  ('strogonoff-fit-de-frango', 'extrato-de-tomate', 60, 4),
  ('strogonoff-fit-de-frango', 'cebola-crua', 80, 5),
  ('strogonoff-fit-de-frango', 'azeite-extravirgem', 15, 6),
  ('strogonoff-fit-de-frango', 'alho-cru', 8, 7),
  ('strogonoff-fit-de-frango', 'arroz-branco-cozido', 600, 8),
  ('strogonoff-fit-de-frango', 'sal-refinado', 6, 9),

  -- Escondidinho de abóbora com carne moída
  ('escondidinho-de-abobora-com-carne-moida', 'abobora-cabotia-cozida', 900, 1),
  ('escondidinho-de-abobora-com-carne-moida', 'patinho-bovino', 500, 2),
  ('escondidinho-de-abobora-com-carne-moida', 'molho-de-tomate-pronto', 200, 3),
  ('escondidinho-de-abobora-com-carne-moida', 'cebola-crua', 100, 4),
  ('escondidinho-de-abobora-com-carne-moida', 'leite-desnatado', 100, 5),
  ('escondidinho-de-abobora-com-carne-moida', 'oleo-de-soja', 15, 6),
  ('escondidinho-de-abobora-com-carne-moida', 'alho-cru', 10, 7),
  ('escondidinho-de-abobora-com-carne-moida', 'sal-refinado', 8, 8),

  -- Salmão com purê de couve-flor
  ('salmao-com-pure-de-couve-flor', 'salmao-fresco', 300, 1),
  ('salmao-com-pure-de-couve-flor', 'couve-flor-cozida', 400, 2),
  ('salmao-com-pure-de-couve-flor', 'requeijao-light', 60, 3),
  ('salmao-com-pure-de-couve-flor', 'azeite-extravirgem', 10, 4),
  ('salmao-com-pure-de-couve-flor', 'alho-cru', 6, 5),
  ('salmao-com-pure-de-couve-flor', 'cheiro-verde', 8, 6),
  ('salmao-com-pure-de-couve-flor', 'sal-refinado', 4, 7),

  -- Omelete de forno com legumes
  ('omelete-de-forno-com-legumes', 'ovo-de-galinha', 480, 1),
  ('omelete-de-forno-com-legumes', 'abobrinha-cozida', 200, 2),
  ('omelete-de-forno-com-legumes', 'tomate-cru', 150, 3),
  ('omelete-de-forno-com-legumes', 'cebola-crua', 80, 4),
  ('omelete-de-forno-com-legumes', 'queijo-mucarela', 80, 5),
  ('omelete-de-forno-com-legumes', 'azeite-extravirgem', 15, 6),
  ('omelete-de-forno-com-legumes', 'cheiro-verde', 10, 7),
  ('omelete-de-forno-com-legumes', 'sal-refinado', 5, 8),

  -- Feijoada light de lentilha
  ('feijoada-light-de-lentilha', 'lentilha-cozida', 700, 1),
  ('feijoada-light-de-lentilha', 'lombo-suino', 400, 2),
  ('feijoada-light-de-lentilha', 'arroz-branco-cozido', 750, 3),
  ('feijoada-light-de-lentilha', 'couve-manteiga-crua', 200, 4),
  ('feijoada-light-de-lentilha', 'cebola-crua', 120, 5),
  ('feijoada-light-de-lentilha', 'tomate-cru', 150, 6),
  ('feijoada-light-de-lentilha', 'oleo-de-soja', 20, 7),
  ('feijoada-light-de-lentilha', 'alho-cru', 12, 8),
  ('feijoada-light-de-lentilha', 'sal-refinado', 10, 9),

  -- Tilápia ao forno com legumes e batata-doce
  ('tilapia-ao-forno-com-legumes', 'file-de-tilapia', 600, 1),
  ('tilapia-ao-forno-com-legumes', 'batata-doce-cozida', 600, 2),
  ('tilapia-ao-forno-com-legumes', 'cenoura-cozida', 250, 3),
  ('tilapia-ao-forno-com-legumes', 'abobrinha-cozida', 250, 4),
  ('tilapia-ao-forno-com-legumes', 'azeite-extravirgem', 25, 5),
  ('tilapia-ao-forno-com-legumes', 'alho-cru', 10, 6),
  ('tilapia-ao-forno-com-legumes', 'cheiro-verde', 10, 7),
  ('tilapia-ao-forno-com-legumes', 'sal-refinado', 6, 8),

  -- Carne moída com abobrinha e arroz
  ('carne-moida-com-abobrinha-e-arroz', 'patinho-bovino', 600, 1),
  ('carne-moida-com-abobrinha-e-arroz', 'abobrinha-cozida', 400, 2),
  ('carne-moida-com-abobrinha-e-arroz', 'arroz-branco-cozido', 750, 3),
  ('carne-moida-com-abobrinha-e-arroz', 'feijao-carioca-cozido', 500, 4),
  ('carne-moida-com-abobrinha-e-arroz', 'molho-de-tomate-pronto', 150, 5),
  ('carne-moida-com-abobrinha-e-arroz', 'cebola-crua', 100, 6),
  ('carne-moida-com-abobrinha-e-arroz', 'oleo-de-soja', 20, 7),
  ('carne-moida-com-abobrinha-e-arroz', 'alho-cru', 10, 8),
  ('carne-moida-com-abobrinha-e-arroz', 'sal-refinado', 8, 9),

  -- Frango desfiado com purê de batata-doce
  ('frango-desfiado-com-pure-de-batata-doce', 'peito-de-frango-cru', 700, 1),
  ('frango-desfiado-com-pure-de-batata-doce', 'batata-doce-cozida', 700, 2),
  ('frango-desfiado-com-pure-de-batata-doce', 'brocolis-cozido', 300, 3),
  ('frango-desfiado-com-pure-de-batata-doce', 'molho-de-tomate-pronto', 150, 4),
  ('frango-desfiado-com-pure-de-batata-doce', 'leite-desnatado', 100, 5),
  ('frango-desfiado-com-pure-de-batata-doce', 'cebola-crua', 80, 6),
  ('frango-desfiado-com-pure-de-batata-doce', 'alho-cru', 10, 7),
  ('frango-desfiado-com-pure-de-batata-doce', 'sal-refinado', 6, 8),

  -- Panqueca de carne com molho de tomate
  ('panqueca-de-carne-com-molho', 'farinha-de-trigo', 200, 1),
  ('panqueca-de-carne-com-molho', 'ovo-de-galinha', 120, 2),
  ('panqueca-de-carne-com-molho', 'leite-desnatado', 400, 3),
  ('panqueca-de-carne-com-molho', 'patinho-bovino', 500, 4),
  ('panqueca-de-carne-com-molho', 'molho-de-tomate-pronto', 300, 5),
  ('panqueca-de-carne-com-molho', 'cebola-crua', 100, 6),
  ('panqueca-de-carne-com-molho', 'oleo-de-soja', 20, 7),
  ('panqueca-de-carne-com-molho', 'alho-cru', 10, 8),
  ('panqueca-de-carne-com-molho', 'sal-refinado', 8, 9),

  -- Peito de peru com quinoa e legumes
  ('peito-de-peru-com-quinoa', 'peito-de-peru-defumado', 300, 1),
  ('peito-de-peru-com-quinoa', 'quinoa-cozida', 450, 2),
  ('peito-de-peru-com-quinoa', 'cenoura-cozida', 150, 3),
  ('peito-de-peru-com-quinoa', 'vagem-cozida', 150, 4),
  ('peito-de-peru-com-quinoa', 'pimentao-verde', 100, 5),
  ('peito-de-peru-com-quinoa', 'azeite-extravirgem', 15, 6),
  ('peito-de-peru-com-quinoa', 'cheiro-verde', 8, 7),
  ('peito-de-peru-com-quinoa', 'sal-refinado', 4, 8),

  -- Berinjela recheada com frango
  ('berinjela-recheada-com-frango', 'berinjela-cozida', 800, 1),
  ('berinjela-recheada-com-frango', 'peito-de-frango-cru', 500, 2),
  ('berinjela-recheada-com-frango', 'queijo-mucarela', 120, 3),
  ('berinjela-recheada-com-frango', 'extrato-de-tomate', 80, 4),
  ('berinjela-recheada-com-frango', 'tomate-cru', 150, 5),
  ('berinjela-recheada-com-frango', 'cebola-crua', 100, 6),
  ('berinjela-recheada-com-frango', 'azeite-extravirgem', 20, 7),
  ('berinjela-recheada-com-frango', 'alho-cru', 10, 8),
  ('berinjela-recheada-com-frango', 'sal-refinado', 6, 9)
) as v(receita_slug, ingrediente_slug, gramas, ordem)
join public.recipes r on r.slug = v.receita_slug
join public.ingredients i on i.slug = v.ingrediente_slug
on conflict (recipe_id, ingredient_id) do nothing;
