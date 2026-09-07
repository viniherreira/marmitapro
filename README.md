# MarmitaPRO

O único app que ensina você a vender marmita fit e ainda cuida da gestão do seu
negócio no dia a dia — de calcular macro a fechar pedido.

Conteúdo e ferramenta vivem no mesmo lugar: a aula sobre precificação abre ao
lado da calculadora de precificação, e a aula sobre cardápio abre ao lado do
banco de receitas. A concorrência vende PDF; aqui o usuário aprende e executa na
mesma tela.

**Público:** pessoas de 25 a 45 anos, com pouco ou nenhum conhecimento de
nutrição, precificação e gestão, querendo gerar renda vendendo marmitas fit.

Toda a interface e todo o conteúdo estão em português do Brasil.

---

## O que já está no ar neste build

| Rota | O que faz |
| --- | --- |
| `/` | Página de vendas pública, com a promessa, o problema, as ferramentas, prova social, planos e FAQ |
| `/design-system` | Fonte da verdade visual: paleta, tipografia, componentes e estados. **Só em desenvolvimento** |
| `/entrar`, `/cadastro` | Autenticação pelo Clerk, com as telas estilizadas na identidade do produto |
| `/onboarding` | Quiz de quatro passos que define o destino do usuário |
| `/app` | Painel: progresso na trilha, próxima aula, atalhos e receitas salvas |
| `/app/curso` | Trilha com cinco módulos e 27 aulas, progresso persistido por aula |
| `/app/curso/[modulo]/[aula]` | Aula em texto rico, player de vídeo opcional e botão de concluir |
| `/app/macros` | Calculadora de macros com 67 ingredientes brasileiros, totais e por porção |
| `/app/precificacao` | Calculadora de precificação com a conta aberta e cenários salvos |
| `/app/receitas` | Banco de receitas com busca e filtro por objetivo |
| `/app/receitas/[slug]` | Ficha completa: ingredientes, preparo, ficha nutricional e custo |
| `/app/pedidos`, `/app/comunidade` | Stubs reservados para a fase 2 (ver [ROADMAP.md](./ROADMAP.md)) |

---

## Stack

- **Next.js 15** (App Router) e **React 19**, com TypeScript em modo estrito
- **Tailwind CSS v4** (configuração em CSS) e **shadcn/ui** com todas as
  primitivas reescritas na identidade do produto
- **Clerk** para autenticação, com localização pt-BR
- **Supabase** (Postgres) com migrations versionadas e RLS habilitada
- **Zod** para validação de schemas, formulários e toda Server Action
- **react-hook-form** nos formulários com muitos campos
- **lucide-react** para ícones
- PWA instalável: manifest, ícones gerados a partir da marca e service worker

Sem state manager global: o estado de servidor vive em Server Components e o
estado de interface vive na URL ou em `useState` local.

---

## Setup local

### 1. Requisitos

- Node.js 20 ou superior
- Uma conta no [Clerk](https://dashboard.clerk.com)
- Um projeto no [Supabase](https://supabase.com/dashboard)

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar as variáveis de ambiente

```bash
cp .env.example .env.local
```

Abra `.env.local` e preencha:

**Clerk** — em <https://dashboard.clerk.com>, crie uma aplicação, ative
e-mail/senha e copie as duas chaves de *API keys*:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

**Supabase** — em <https://supabase.com/dashboard>, crie um projeto e copie de
*Project Settings → API*:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

> Enquanto essas variáveis não estiverem preenchidas, a landing e o design
> system continuam funcionando normalmente, e as rotas do app mostram uma tela
> dizendo exatamente o que falta.

### 4. Criar o banco

Com a [CLI do Supabase](https://supabase.com/docs/guides/local-development):

```bash
npx supabase link --project-ref SEU_PROJECT_REF
```

```bash
npx supabase db push
```

```bash
npx supabase db execute --file supabase/seed.sql
```

Sem a CLI, o caminho manual funciona igual: abra o **SQL Editor** do painel do
Supabase e execute, nesta ordem, o conteúdo de

1. `supabase/migrations/20260907120000_esquema_inicial.sql`
2. `supabase/migrations/20260907120100_politicas_rls.sql`
3. `supabase/seed.sql`

O seed é idempotente: pode rodar de novo sem duplicar nada.

### 5. Rodar

```bash
npm run dev
```

Abra <http://localhost:3000>.

---

## Comandos

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm start
```

```bash
npm run lint
```

```bash
npm run typecheck
```

```bash
npm run icons
```

`npm run icons` regenera os PNGs do PWA a partir do desenho da marca em
`scripts/gerar-icones.mjs`. Rode depois de mexer nas cores da identidade.

---

## Estrutura

```
app/
  (auth)/            telas do Clerk com layout próprio
  app/               área logada, protegida pelo middleware
  design-system/     vitrine visual, bloqueada em produção
  onboarding/        quiz de quatro passos
components/
  ui/                primitivas do shadcn/ui, reescritas
  app/               casca da área logada
  landing/           seções da página de vendas
  ...
lib/
  calculos/          regras de macros e de precificação
  data/              leitura do banco
  actions/           Server Actions, todas validadas com Zod
  validacao/         schemas Zod compartilhados
  content/           copy e conteúdo estático
supabase/
  migrations/        schema versionado
  seed.sql           conteúdo real em português
types/
  database.ts        tipos do banco
```

Regra que vale para o projeto inteiro: **nenhum componente carrega dado
embutido**. Tudo vem do banco ou de um módulo em `lib/`.

---

## Identidade visual

Os tokens vivem em `app/globals.css` e são a única fonte de cor, espaço e raio.
Nenhum componente escreve cor direto — o tema escuro é uma troca de valores, não
uma segunda folha de estilo.

- **Títulos:** Fraunces, com os eixos variáveis `opsz`, `WONK` e `SOFT` ativos
- **Interface:** Inter, com algarismos tabulares em todo dado numérico
- **Verde-floresta** (`--primary`) é a cor de ação
- **Verde-limão** (`--accent`) aparece só em progresso e badges, nunca em botão
- Cards são definidos por borda de 1px; sombra existe só em camada flutuante

A página `/design-system` mostra tudo isso em funcionamento e serve de checklist
antes de subir qualquer tela nova.

---

## Segurança dos dados

- RLS está **habilitada em todas as tabelas**.
- Todo acesso a dados acontece no servidor, com a service role, e a filtragem
  por dono é explícita nas funções de `lib/data` e `lib/actions`.
- As políticas de RLS são escritas contra `auth.jwt() ->> 'sub'`, o
  identificador do Clerk. Se você registrar o Clerk como provedor de terceiros
  no Supabase (*Authentication → Sign In / Providers*), o acesso direto pelo
  navegador também fica seguro. Sem essa integração, as chaves públicas não leem
  nenhuma linha — que é o comportamento desejado.
- Toda Server Action valida a entrada com Zod antes de tocar no banco, e os
  totais nutricionais são recalculados no servidor: o cliente não define
  resultado.

---

## Deploy na Vercel

1. Importe o repositório na Vercel.
2. Cadastre as mesmas variáveis de `.env.example` em *Settings → Environment
   Variables*, com `NEXT_PUBLIC_APP_URL` apontando para o domínio de produção.
3. O build padrão (`npm run build`) já funciona sem ajuste.

Em produção `/design-system` responde 404 por decisão de projeto.

---

## Avisos

Os valores nutricionais vêm de tabelas de composição de alimentos e são
estimativas técnicas para orientar cardápio e comunicação com o cliente. Não
substituem laudo laboratorial exigido em rotulagem obrigatória.

Os três depoimentos da landing são **fictícios** e estão marcados como tal na
própria página. Substitua por depoimentos reais, com autorização de uso, antes
de publicar.
