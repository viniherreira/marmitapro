# ROADMAP — MarmitaPRO

Este documento descreve o que ficou **fora** do MVP de propósito, e como a
arquitetura atual já foi preparada para receber cada item.

---

## Fase 1 — MVP (entregue)

Trilha do curso, calculadora de macros, calculadora de precificação, banco de
receitas, onboarding, autenticação e PWA instalável.

---

## Fase 2

### 1. CRM de pedidos

O módulo que transforma o app de ferramenta de cálculo em ferramenta de
operação. É o item de maior valor percebido pelo público que já vende.

**Escopo**

- Cadastro de cliente com endereço, telefone e preferências
- Pedido com itens, valor, data de entrega e status
  (`recebido → em produção → pronto → entregue → cancelado`)
- Janela de pedido semanal, com fechamento automático em dia e hora definidos
- Lista de produção do dia: soma das receitas vendidas em gramas por ingrediente
- Lista de compra derivada da lista de produção, com a folga configurável
- Plano semanal (assinatura) com renovação e aviso de vencimento

**O que já existe**

- As rotas `/app/pedidos` e a entrada na navegação, marcadas como fase 2
- `profiles` como âncora de propriedade para as novas tabelas
- `recipes` e `recipe_ingredients` já permitem calcular a lista de produção a
  partir do que foi vendido

**Tabelas a criar**

`customers`, `orders`, `order_items`, `delivery_routes`, `subscriptions`.
Todas com `profile_id` e RLS no mesmo padrão das tabelas atuais.

---

### 2. Integração de pagamento

**Escopo**

- Assinatura mensal e anual, com os planos já descritos na landing
- Período de teste e a garantia de sete dias anunciada na página de vendas
- Bloqueio suave: usuário sem assinatura ativa mantém a trilha aberta e perde as
  ferramentas de cálculo
- Portal de gestão da assinatura (trocar cartão, cancelar, ver faturas)

**Caminho técnico**

Stripe ou um provedor nacional com Pix recorrente. O Clerk já entrega o
identificador estável do usuário; falta uma tabela `subscriptions` e um webhook
em `app/api/webhooks/` para sincronizar o status.

**O que já existe**

- A seção de planos na landing, com os dois preços definidos
- O aviso, na própria seção, de que a cobrança entra na fase 2

---

### 3. Comunidade

**Escopo**

- Feed por região, para trocar preço praticado, fornecedor e cardápio
- Tópicos ligados a um módulo da trilha
- Moderação simples e denúncia

**O que já existe**

- `/app/comunidade` entregue como ponte para o grupo de WhatsApp: convite,
  expectativa do que se encontra lá e combinados do grupo
- O link vem de `NEXT_PUBLIC_WHATSAPP_COMUNIDADE` e é validado antes de
  aparecer — sem convite válido, a tela avisa em vez de levar a link quebrado
- A comunidade dentro do produto (feed, tópicos, moderação) continua na fase 2;
  o grupo externo é o degrau anterior, e serve para descobrir o que a
  comunidade precisa antes de construí-la

---

## Fase 3 — ideias em avaliação

Nada aqui está comprometido; a lista existe para não perder o rastro.

- **Controle de estoque**, alimentado pela lista de compra do CRM
- **Cardápio público** por usuário: uma página `/c/[slug]` com os pratos, ficha
  nutricional e botão de pedido no WhatsApp
- **Etiqueta imprimível** com nome do prato, data, validade e modo de aquecer
- **Importar preço de compra** para substituir os preços médios de referência
  pelos preços reais que a pessoa paga
- **Exportar ficha técnica** em PDF, para quem precisa apresentar a um cliente
  corporativo
- **Multi-usuário**, para operações com mais de uma pessoa na cozinha

---

## Dívidas técnicas conhecidas

| Item | Situação |
| --- | --- |
| Fotos das receitas | O campo `imagem_url` existe e é renderizado quando preenchido. Enquanto não há banco de imagens próprio, entra uma capa tipográfica gerada a partir do nome — nunca uma foto genérica de banco de imagens. |
| Tipos do banco | `types/database.ts` é escrito à mão espelhando as migrations. Regerar com `npx supabase gen types typescript --project-id <ref>` depois que o projeto estiver de pé. |
| Clerk como provedor no Supabase | As políticas de RLS já estão escritas para esse cenário. Configurar a integração fecha o acesso direto pelo navegador. |
| Cache offline | O service worker guarda assets e as páginas já visitadas. As telas do app dependem de sessão e continuam exigindo rede. |
| Testes | Não há suíte automatizada. Os candidatos naturais são `lib/calculos/*`, que são funções puras e concentram a regra de negócio. |
