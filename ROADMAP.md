# ROADMAP — MarmitaPRO

Este documento descreve o que ficou **fora** do MVP de propósito, e como a
arquitetura atual já foi preparada para receber cada item.

---

## Fase 1 — MVP (entregue)

Trilha do curso, calculadora de macros, calculadora de precificação, banco de
receitas, onboarding, autenticação e PWA instalável.

---

## Fase 2

### 1. CRM de pedidos — **núcleo feito**

A aba `/app/pedidos` é o caderno de pedidos de quem vende: cliente, marmitas,
dia e hora de entrega, e a situação de cada pedido
(`recebido → em produção → pronto → entregue`, ou `cancelado`). A semana vem
somada — pedidos, marmitas, faturamento — e a produção sai agrupada por
prato. Cliente novo é criado no próprio pedido, o preço de um prato já vendido
entra sozinho, e o telefone vira atalho para o WhatsApp. Faz parte da
assinatura, com o mesmo bloqueio suave das calculadoras.

Tabelas: `customers`, `orders`, `order_items`, com o enum `situacao_pedido`.

Fica para depois:

- Tela de clientes: editar telefone e endereço, ver o histórico de cada um
- Janela de pedido semanal, com fechamento automático em dia e hora definidos
- Lista de compra: ligar cada item à receita e somar os ingredientes em
  gramas, com a folga configurável. `order_items.recipe_id` já guarda o
  vínculo quando o nome bate com uma receita do banco
- Plano semanal do cliente final, com renovação e aviso de vencimento. **Não
  pode se chamar `subscriptions`**: esse nome já é a assinatura do MarmitaPRO
  cobrada pelo Asaas. Algo como `planos_de_clientes`
- `delivery_routes`, para organizar a ordem de entrega

---

### 2. Integração de pagamento — **feita**

Cobrança pelo Asaas, com checkout dentro do app (`/app/assinatura`): cartão de
crédito e Pix, sem mandar o cliente para a página do Asaas. O webhook em
`app/api/webhooks/asaas/` sincroniza a tabela `subscriptions`, e o bloqueio
suave está de pé: sem assinatura ativa a trilha continua aberta e as
calculadoras e o banco de receitas pedem o plano.

Fica para depois:

- Trocar o cartão sem cancelar e assinar de novo (depende de tokenização
  liberada na conta de produção)
- Período de teste e a garantia de sete dias anunciada na página de vendas
- Histórico de faturas dentro do app

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
