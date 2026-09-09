/**
 * Conteúdo da trilha do curso.
 *
 * O formato aceito é o subconjunto de Markdown de `lib/markdown.ts`: `##` e
 * `###` para títulos, `>` para a regra que fica, listas, `**negrito**`,
 * `*itálico*`, `` `código` `` e `[texto](/rota)` para links.
 *
 * Toda aula fecha com "Faça agora", levando o aluno para a ferramenta do
 * próprio app. É o que separa este produto de um PDF: a aula não termina em
 * teoria, termina numa conta feita.
 *
 * `duracao_minutos` não vem daqui — é calculada pelo carregador a partir do
 * texto. Tempo declarado que não bate com o conteúdo é a primeira coisa que
 * denuncia curso improvisado.
 */

export const AULAS = [
  // =========================================================================
  // Módulo 1 — Começando do zero
  // =========================================================================
  {
    modulo: "comecando-do-zero",
    slug: "o-que-voce-esta-montando",
    titulo: "O que você está montando de verdade",
    resumo:
      "Antes de cozinhar, entender que negócio é esse e o que ele exige de você.",
    conteudo: `Você não está montando um restaurante. Também não está fazendo um bico de fim de semana. Marmita fit é um negócio de **produção em lote com entrega recorrente**, e quase todo erro do começo vem de confundir isso com outra coisa.

Restaurante vive de fluxo: gente que passa, entra e decide na hora. O seu negócio vive de **assinatura informal** — as mesmas dez ou quinze pessoas comprando toda semana. Isso muda tudo.

## As três engrenagens

Um negócio de marmita só para de pé quando as três giram juntas:

1. **Produção.** Cozinhar 40 marmitas iguais não é cozinhar 4 vezes 10. É outro processo, com outra panela, outro tempo e outra cabeça.
2. **Precificação.** Vender caro demais trava o pedido. Vender barato demais faz você trabalhar de graça — e esse é o erro mais comum, porque ele demora meses para aparecer.
3. **Recompra.** Cliente novo custa caro de conseguir. Cliente antigo custa quase nada. O negócio vive do segundo.

Quem só cuida da primeira vira cozinheiro cansado. Quem só cuida da terceira vende o que não consegue produzir.

## O tamanho real do começo

A conta que assusta menos do que parece: com **30 marmitas por semana** a R$ 22, o faturamento é de R$ 660 por semana, cerca de R$ 2.860 por mês. Com uma margem de 45%, sobram por volta de **R$ 1.290 líquidos**.

Não é dinheiro de largar o emprego no primeiro mês. Mas 30 marmitas cabem numa cozinha doméstica, num sábado, com o fogão que você já tem.

> Marmita fit não é negócio de escala grande. É negócio de **margem controlada e cliente que volta**.

## O que este curso não vai resolver

Duas coisas precisam ser ditas agora:

- **Não existe cardápio mágico.** O prato que vende bem no seu bairro pode encalhar a três quilômetros dali. Você vai descobrir testando, e a trilha ensina a testar barato.
- **Não existe atalho na conta.** Se a sua marmita custa R$ 12 e você vende a R$ 15, nenhuma estratégia de venda salva a operação. Precificação vem antes de marketing.

## O compromisso que vale fazer

Antes de seguir, decida uma coisa: **quantas marmitas por semana você quer estar entregando daqui a três meses?** Anote esse número. Ele vai definir o tamanho da sua compra, a sua rota de entrega e o preço que você pode praticar.

Sem esse número, toda decisão vira palpite.

## Faça agora

Abra o [banco de receitas](/app/receitas) e escolha três pratos que você já sabe fazer sem consultar nada. Não os mais bonitos — os que saem certo mesmo num dia ruim.

Esses três são o seu cardápio de teste. Vamos precificar cada um deles no módulo 2.`,
  },
  {
    modulo: "comecando-do-zero",
    slug: "quanto-da-para-faturar",
    titulo: "Quanto dá para faturar com marmita fit",
    resumo: "A conta realista, com os números que ninguém mostra no anúncio.",
    conteudo: `Toda propaganda de curso de marmita mostra faturamento. Quase nenhuma mostra **lucro**. A diferença entre os dois é onde os negócios morrem.

## Faturamento não é seu

Faturamento é o que entra. Dentro dele estão o frango, a embalagem, o gás, a gasolina da entrega e o seu tempo. O que sobra depois de tudo isso é o que você leva para casa.

Uma operação de marmita bem tocada trabalha com **margem líquida entre 35% e 50%**. Abaixo de 30% o negócio fica frágil: qualquer alta no preço da proteína apaga o lucro.

## Três cenários honestos

Considerando marmita a R$ 22 e margem de 45%:

- **20 marmitas/semana** — R$ 440 por semana, R$ 1.900 por mês de faturamento, cerca de **R$ 860 líquidos**. É renda complementar. Cabe num sábado.
- **50 marmitas/semana** — R$ 1.100 por semana, R$ 4.760 por mês, cerca de **R$ 2.140 líquidos**. Aqui já são dois dias de produção e a cozinha doméstica começa a apertar.
- **100 marmitas/semana** — R$ 2.200 por semana, R$ 9.520 por mês, cerca de **R$ 4.280 líquidos**. Nesse ponto você precisa de ajuda, de freezer maior e provavelmente de sair do MEI.

Repare no que cresce junto: nas 100 marmitas o lucro é 5 vezes maior que nas 20, mas o **esforço é mais que 5 vezes**. Escalar não é só multiplicar.

## O gargalo aparece antes do que você espera

O limite não costuma ser a demanda. É:

- **Espaço de freezer.** 50 marmitas ocupam muito mais do que parece.
- **Boca de fogão.** Quatro bocas cozinham 40 marmitas com folga, 80 com sofrimento.
- **Tempo de porcionamento.** Montar e fechar 50 marmitas leva de 1h30 a 2h, sozinho.

> O gargalo do negócio de marmita quase nunca é vender. É **produzir sem quebrar a rotina da sua casa**.

## Sazonalidade que ninguém avisa

Dezembro e janeiro caem. Gente viaja, empresa entra em recesso, academia esvazia. Fevereiro e março sobem forte, quando todo mundo volta querendo se ajeitar.

Se você começar em novembro e olhar só dezembro, vai achar que o negócio não funciona. Não é isso: é a época.

## Faça agora

Pegue os três pratos que você escolheu na aula anterior e defina a sua meta de três meses. Depois use a [calculadora de precificação](/app/precificacao) com um chute grosseiro de custo — só para ver a ordem de grandeza do lucro mensal.

Não precisa estar certo ainda. O módulo 2 inteiro serve para transformar esse chute em número.`,
  },
  {
    modulo: "comecando-do-zero",
    slug: "estruturando-a-cozinha",
    titulo: "Estruturando a cozinha que você já tem",
    resumo:
      "O que comprar agora, o que comprar depois e o que não comprar nunca.",
    conteudo: `A tentação do começo é gastar. Comprar embaladora a vácuo, fogão industrial, armário de inox. Quase nada disso é necessário para as primeiras 100 marmitas, e cada real gasto aí é um real que não está no estoque.

## O que você precisa de verdade

Lista curta, na ordem de importância:

1. **Balança digital de cozinha** (R$ 40 a R$ 80). Não é opcional. Sem pesar, você não tem custo, não tem ficha nutricional e não tem porção padronizada. É o item mais barato e o mais decisivo da lista.
2. **Marmitas descartáveis com trava** (R$ 1,20 a R$ 2,50 a unidade). Compre um pacote pequeno de dois modelos antes de fechar com um.
3. **Panelas grandes** — pelo menos uma de 24 cm e uma de 28 cm. Panela pequena obriga a cozinhar em levas e dobra o tempo.
4. **Espaço de freezer.** Se o seu não comporta a produção de uma semana, esse é o primeiro investimento sério.

## O que fica para depois

- **Seladora a vácuo.** Útil, mas só quando você já vende o suficiente para justificar a validade maior.
- **Fogão industrial.** Consome muito mais gás. Só compensa acima de umas 80 marmitas por semana.
- **Etiquetadora.** Etiqueta impressa em folha adesiva comum resolve por muito tempo.

## O que não comprar nunca no começo

Ponto de venda, reforma de cozinha e estoque grande de proteína congelada. Os três prendem dinheiro que você ainda vai precisar para descobrir o que o seu cliente quer.

> Regra do começo: **compre o que reduz erro, não o que aumenta capacidade.** Capacidade sem cliente é prejuízo parado.

## Organizando o espaço

Divida a bancada em três zonas fixas e não misture:

- **Zona suja** — onde chega o alimento cru, onde você corta carne.
- **Zona de cocção** — fogão e panelas.
- **Zona limpa** — onde a marmita é montada e fechada.

O fluxo anda sempre numa direção: sujo → cocção → limpo. Voltar para trás é como contaminação cruzada acontece na prática.

Se a cozinha é pequena e não dá para separar por espaço, separe **por tempo**: prepare tudo o que é cru, limpe a bancada inteira, e só então comece a montar.

## Faça agora

Meça o seu freezer, em litros ou em número de marmitas que cabem. Anote. Esse número é o teto real da sua produção semanal enquanto você não investir em mais frio — e vai aparecer de novo no módulo de logística.`,
  },
  {
    modulo: "comecando-do-zero",
    slug: "higiene-e-boas-praticas",
    titulo: "Higiene e boas práticas que não são negociáveis",
    resumo:
      "O que a vigilância cobra e, mais importante, o que evita você intoxicar um cliente.",
    conteudo: `Esta é a aula que mais gente pula e a única que pode acabar com o negócio num único dia. Um cliente intoxicado não vira reclamação: vira processo, vira post e vira fim.

## A zona de perigo

Bactéria se multiplica rápido entre **5 °C e 60 °C**. Esse intervalo tem nome: zona de perigo. Toda regra prática vem daí.

- Comida quente fica **acima de 60 °C** até ser resfriada.
- Comida fria fica **abaixo de 5 °C**.
- O tempo total que um alimento passa na faixa do meio deve ser o menor possível — trabalhe com **até 2 horas** como teto.

O erro clássico da marmita caseira: cozinhar de manhã, deixar a panela esfriando na bancada até a tarde e só então porcionar. Nesse intervalo o alimento passa horas na zona de perigo.

## Resfriamento correto

O jeito certo custa zero:

1. Divida a comida quente em recipientes rasos — panela funda esfria pelo lado de fora e mantém o miolo quente por horas.
2. Coloque o recipiente dentro de uma bacia com água e gelo.
3. Mexa de vez em quando.
4. Leve à geladeira assim que parar de soltar vapor forte.

A meta é sair de 60 °C para menos de 10 °C em até duas horas.

> Não existe marmita segura sem resfriamento rápido. É o passo que separa comida caseira de **comida vendida**.

## Contaminação cruzada

Regras simples que resolvem quase tudo:

- **Tábua separada** para carne crua. Se só tem uma, corte primeiro o que vai cozinhar e por último o que vai cru.
- **Nunca** reutilize o recipiente que teve carne crua sem lavar.
- Pano de prato é o objeto mais sujo da cozinha. Use papel-toalha na zona limpa.

## Higiene pessoal

Unhas curtas e sem esmalte, cabelo preso, sem anel nem pulseira durante a produção. Lavagem de mãos com água e sabão por **20 segundos**, sempre que trocar de tarefa. Álcool 70% não substitui a lavagem quando a mão está visivelmente suja.

## Rotulagem: o mínimo

Toda marmita que sai da sua cozinha precisa de etiqueta com:

- nome do produto
- data de produção
- data de validade
- orientação de conservação e reaquecimento

Isso protege você. Numa reclamação, a etiqueta é a prova de que o produto saiu dentro do prazo.

## Faça agora

Escreva o roteiro de higiene da sua produção — da chegada do alimento cru até a marmita fechada — e cole na parede da cozinha. Não confie na memória num dia de 40 marmitas.

Uma observação honesta: as regras de vigilância sanitária **variam por município**. O que está aqui é a base técnica que vale em qualquer lugar, mas procure a vigilância da sua cidade antes de formalizar.`,
  },
  {
    modulo: "comecando-do-zero",
    slug: "formalizacao-mei",
    titulo: "Formalização: quando o MEI passa a valer a pena",
    resumo: "Os números de 2026, o que o MEI resolve e o que ele não resolve.",
    conteudo: `Dá para começar sem CNPJ vendendo para conhecidos. Não dá para crescer assim. A pergunta certa não é *se* formalizar, é *quando*.

## Os números de 2026

- **Teto de faturamento:** R$ 81.000 por ano, o equivalente a uma média de R$ 6.750 por mês. Não existe limite mensal oficial — o que vale é o total do ano.
- **DAS mensal:** entre **R$ 82,05 e R$ 87,05**, conforme a atividade. Produção e venda de alimentos costuma cair na faixa de comércio e indústria.
- **Tolerância:** estourar em até 20% (até R$ 97.200) permite continuar como MEI até o fim do ano, pagando um DAS complementar sobre o excedente.

Traduzindo para marmita: com marmita a R$ 22, o teto do MEI equivale a cerca de **3.680 marmitas por ano**, ou aproximadamente 70 por semana.

## O que o DAS te dá

Não é imposto jogado fora. Pagando o DAS você tem:

- **INSS** contando para aposentadoria
- **auxílio-doença** e salário-maternidade
- CNPJ para emitir nota, abrir conta jurídica e ter maquininha com taxa menor

## Quando formalizar vale a pena

Três gatilhos claros:

1. **Cliente pede nota fiscal.** Empresa e academia costumam pedir. Sem CNPJ, você perde a venda maior.
2. **Você quer maquininha.** As taxas de pessoa jurídica são menores, e a diferença cobre o DAS rápido.
3. **Você passou de 20 marmitas por semana.** Nesse ponto o risco de operar informal já é maior que o custo do DAS.

> R$ 82 por mês equivalem a menos de **4 marmitas**. Se o CNPJ te trouxer um único cliente corporativo, ele já se pagou.

## O que o MEI não resolve

Aqui a maior parte dos cursos silencia:

- **MEI não é licença sanitária.** São coisas diferentes. Produzir alimento para venda costuma exigir alvará da vigilância do seu município, e as regras para cozinha doméstica mudam de cidade para cidade.
- **MEI não permite sócio** e admite **um único empregado**.
- **Nem toda cidade permite** produção de alimentos em residência. Algumas exigem espaço separado da cozinha da família.

## A ordem que evita dor de cabeça

1. Comece vendendo pequeno, para conhecidos, enquanto testa o cardápio.
2. Consulte a vigilância sanitária da sua cidade **antes** de abrir o CNPJ — é ela que diz se o seu espaço serve.
3. Abra o MEI quando um dos três gatilhos acontecer.

## Faça agora

Procure "vigilância sanitária" mais o nome da sua cidade e descubra duas coisas: se existe licença específica para produção artesanal de alimentos e se cozinha residencial é aceita.

Essa resposta define se o seu próximo passo é o CNPJ ou uma adaptação no espaço. Se ficar em dúvida, leve a pergunta para o [grupo da comunidade](/app/comunidade) — provavelmente alguém da sua região já passou por isso.`,
  },
  {
    modulo: "comecando-do-zero",
    slug: "cardapio-de-largada",
    titulo: "Definindo o seu cardápio de largada",
    resumo:
      "Poucos pratos, escolhidos por critério de produção, não por gosto pessoal.",
    conteudo: `O erro mais comum do primeiro cardápio é oferecer variedade demais. Doze opções numa cozinha doméstica significam doze compras, doze processos e doze chances de sobra.

## A regra dos cinco

Comece com **cinco pratos**, não mais. E escolha os cinco por critérios de produção:

1. **Compartilham base.** Se três pratos usam frango desfiado, você cozinha frango uma vez.
2. **Aguentam congelar e reaquecer.** Nem tudo aguenta: fritura murcha, batata cozida em cubo fica com textura de esponja, folha crua não sobrevive.
3. **Têm custo previsível.** Evite ingrediente que oscila muito de preço no começo.
4. **Você faz sem receita.** Prato que exige consulta atrasa o lote inteiro.
5. **Um deles é o "seguro".** O prato que todo mundo come — arroz, feijão, frango, legume. Ele sustenta o pedido quando a novidade não emplaca.

## Os que não aguentam a marmita

Vale saber antes de gastar ingrediente:

- **Fritura empanada** — perde a crocância na hora.
- **Massa longa cozida demais** — vira papa no reaquecimento. Sempre al dente.
- **Batata inglesa em cubos** — fica arenosa depois de congelar. Purê aguenta melhor.
- **Folha crua** — só se for embalada separada.
- **Molho com creme de leite tradicional** — talha ao reaquecer. Creme de ricota ou requeijão aguentam.

## Como montar as cinco combinações

Pense em **matriz**, não em pratos soltos: 3 proteínas × 3 acompanhamentos de carboidrato × 3 legumes já dão 27 combinações possíveis com uma lista de compras curta.

Na prática, monte assim:

- 2 pratos de frango (o mais barato e o mais aceito)
- 1 de carne bovina (o de maior valor percebido)
- 1 de peixe ou ovo (a opção mais leve)
- 1 sem carne (você vai receber esse pedido mais cedo do que imagina)

## Testando antes de vender

Faça uma porção de cada, congele, e reaqueça **depois de três dias** — no micro-ondas, como o cliente vai fazer. Prove. Prato que não passa nesse teste não entra no cardápio, por melhor que fique fresco.

> O cardápio bom não é o mais gostoso na panela. É o mais gostoso **três dias depois, no micro-ondas de outra pessoa**.

## Faça agora

Escolha as suas cinco combinações no [banco de receitas](/app/receitas) usando os filtros de objetivo — pegue pelo menos uma econômica, uma rica em proteína e uma low carb, para atender perfis diferentes de cliente.

Depois monte a ficha de cada uma na [calculadora de macros](/app/macros). Você vai precisar dos totais no próximo módulo, quando a gente for descobrir quanto cada uma custa de verdade.`,
  },

  // =========================================================================
  // Módulo 2 — Precificação sem chute
  // =========================================================================
  {
    modulo: "precificacao-sem-chute",
    slug: "custo-direto",
    titulo: "Custo direto: o que entra na marmita",
    resumo:
      "Pesar, converter e descobrir o custo real do que vai dentro da embalagem.",
    conteudo: `Custo direto é tudo que fisicamente entra na marmita: ingrediente e embalagem. É a parte fácil da conta — e ainda assim quase todo mundo erra, por três motivos específicos.

## Erro 1: usar o preço do pacote

O frango custa R$ 18,90 o quilo. A sua marmita não leva um quilo, leva 150 gramas. A conta é:

> custo do ingrediente = (preço por quilo ÷ 1000) × gramas usadas

Para o frango: (18,90 ÷ 1000) × 150 = **R$ 2,84**.

Parece óbvio escrito assim. Na correria, muita gente divide o pacote pelo número de marmitas e erra por não considerar o que sobrou.

## Erro 2: ignorar a perda

Você compra 1 kg de frango com osso e aproveita 700 g. O custo real do que foi para a marmita não é R$ 18,90 o quilo — é R$ 27,00 o quilo.

O nome disso é **fator de correção**:

> fator de correção = peso comprado ÷ peso aproveitado

Alguns números para orientar:

- Frango inteiro com osso: aproveitamento de 60% a 70%
- Cebola e alho descascados: cerca de 85%
- Folhas verdes limpas: 70% a 80%
- Peixe inteiro: 45% a 55%

Filé, peito sem osso e legume já limpo têm fator próximo de 1 — por isso costumam sair mais em conta do que parecem.

## Erro 3: esquecer o que é invisível

Sal, óleo, alho, tempero, gás para refogar. Cada um custa centavos, mas somados numa marmita chegam facilmente a R$ 0,40 a R$ 0,80.

Se você tem 200 marmitas por mês, são até R$ 160 de lucro que somem sem explicação. Some tudo e adicione como um item só na ficha.

## A embalagem conta como custo direto

E ela é maior do que parece:

- marmita com trava: R$ 1,20 a R$ 2,50
- etiqueta: R$ 0,05 a R$ 0,15
- sacola: R$ 0,10 a R$ 0,30
- talher descartável, se você oferece: R$ 0,20

Numa marmita de R$ 22, a embalagem pode ser **10% do preço de venda**. Não é detalhe.

## Faça agora

Abra a [calculadora de macros](/app/macros) e monte um dos seus pratos com as gramagens reais. Ela mostra o custo total e o custo por porção junto com a ficha nutricional — os dois números que você vai precisar na próxima aula.

Se algum ingrediente seu tem preço diferente do que está na base, ajuste. O custo que interessa é o que **você** paga, não a média do mercado.`,
  },
  {
    modulo: "precificacao-sem-chute",
    slug: "custo-indireto",
    titulo: "Custo indireto: gás, energia, embalagem e transporte",
    resumo: "O que não entra na marmita mas sai do seu bolso todo mês.",
    conteudo: `Custo indireto é o que você paga para poder produzir, mesmo que não vá dentro da embalagem. É o custo que some da conta e reaparece no fim do mês, quando o dinheiro não bate com o que você achava que tinha ganhado.

## O método: ratear

Você não consegue medir quanto de gás uma marmita específica consumiu. Nem precisa. O caminho é pegar o gasto do mês e dividir pela produção do mês.

> custo indireto por marmita = total de custos indiretos do mês ÷ marmitas produzidas no mês

## O que entra na lista

- **Gás.** Um botijão de 13 kg custa em torno de R$ 110 e rende cerca de 15 horas de fogo alto contínuo. Numa produção de 4 horas por semana, é aproximadamente um botijão a cada quatro meses.
- **Energia elétrica.** O freezer é o vilão silencioso: ele fica ligado 24 horas. Um freezer horizontal consome de 30 a 50 kWh por mês, algo entre R$ 25 e R$ 45.
- **Água.** Lavagem de alimento, panela e bancada. Estime pelo aumento na conta desde que começou.
- **Transporte.** Combustível ou aplicativo para a compra e para a entrega.
- **Internet e celular.** Se o WhatsApp é o seu canal de venda, uma parte da conta é do negócio.
- **Desgaste de equipamento.** Panela, liquidificador e freezer têm vida útil. Uma reserva de R$ 30 a R$ 50 por mês evita a surpresa do dia em que o freezer para.

## Um exemplo fechado

Operação de 120 marmitas por mês:

- gás rateado: R$ 28
- energia: R$ 40
- água: R$ 15
- transporte: R$ 90
- celular e internet: R$ 30
- reserva de equipamento: R$ 40

Total: **R$ 243 por mês**, ou **R$ 2,03 por marmita**.

Dois reais por marmita parecem pouco. Sobre 120 marmitas, são R$ 243 que estavam saindo do seu lucro sem aparecer em lugar nenhum.

## O erro do volume baixo

Repare no que acontece com pouca produção: os mesmos R$ 243 divididos por 40 marmitas viram **R$ 6,08 por unidade**. Custo indireto é fixo — quanto menos você produz, mais pesado ele fica.

> É por isso que produzir 20 marmitas por semana raramente compensa. Não é o ingrediente que pesa: é o **custo fixo dividido por pouca gente**.

## Faça agora

Levante os seus custos indiretos do último mês. Se você nunca mediu, estime e escreva assim mesmo — número estimado é melhor que número ausente.

Depois abra a [calculadora de precificação](/app/precificacao) e preencha o campo de custos indiretos. Você vai ver a conta aberta, passo a passo, em vez de um preço final que aparece do nada.`,
  },
  {
    modulo: "precificacao-sem-chute",
    slug: "pagar-a-sua-hora",
    titulo: "O erro que quebra: não pagar a sua própria hora",
    resumo:
      "Por que ignorar o seu trabalho faz o negócio parecer lucrativo quando não é.",
    conteudo: `Este é o erro que mais quebra negócio de marmita, e ele é traiçoeiro porque **parece generosidade**. "Eu mesma faço, então não conto." O resultado é um negócio que parece dar lucro e na verdade está pagando um salário disfarçado — abaixo do mínimo.

## Por que isso é grave

Enquanto você não conta a sua hora, três coisas acontecem:

1. **O preço fica artificialmente baixo.** Você consegue vender a R$ 18 porque não está pagando ninguém para cozinhar.
2. **Você não consegue contratar.** No dia em que precisar de ajuda, o preço não cabe o custo do ajudante — e aí é tarde para reajustar.
3. **Você não sabe se vale a pena.** Talvez as suas 6 horas de sábado rendam menos que qualquer outro uso do mesmo tempo. Sem a conta, não dá para saber.

## Quanto vale a sua hora

Três formas de chegar num número, da mais simples à mais ambiciosa:

- **Piso do mercado.** Quanto custa contratar alguém para fazer isso? Uma cozinheira diarista sai entre R$ 15 e R$ 25 por hora, dependendo da região.
- **Custo de oportunidade.** Quanto você ganharia nas mesmas horas fazendo outra coisa?
- **Meta de renda.** Se você quer tirar R$ 3.000 por mês trabalhando 60 horas, a sua hora vale R$ 50.

Para começar, use o piso do mercado. É o mais defensável e o mais fácil de justificar.

## Contando as horas certas

Não é só o tempo de fogão. Conte tudo:

- ir ao mercado e conferir a compra
- higienizar e pré-preparar
- cozinhar
- resfriar e porcionar
- etiquetar e embalar
- responder cliente no WhatsApp
- entregar

A parte invisível — compra, mensagem, entrega — costuma ser **metade do tempo total**.

## Um exemplo fechado

Produção de 40 marmitas num sábado:

- compra: 1h30
- pré-preparo: 1h
- cocção: 2h30
- resfriamento e porcionamento: 1h30
- atendimento na semana: 1h
- entrega: 1h30

Total: **9 horas** para 40 marmitas. A R$ 20 por hora, são R$ 180, ou **R$ 4,50 por marmita**.

> Quatro reais e cinquenta por marmita de mão de obra. Se você não coloca isso na conta, esse valor sai direto do seu lucro — e você chama isso de "dar certo".

## O teste que dói

Some o seu lucro do mês e divida pelas horas trabalhadas. Se o resultado for menor que o salário mínimo por hora, o negócio não está lucrativo: está subsidiado pelo seu tempo.

Isso não significa desistir. Significa que o preço precisa subir ou a produção precisa crescer — e agora você sabe qual dos dois.

## Faça agora

Cronometre a sua próxima produção inteira, do mercado à entrega. Anote o total.

Depois abra a [calculadora de precificação](/app/precificacao) e preencha o tempo de trabalho e o valor da sua hora. Compare o preço sugerido com o que você cobra hoje. Se houver diferença grande, você acabou de encontrar o seu problema de margem.`,
  },
  {
    modulo: "precificacao-sem-chute",
    slug: "margem-e-markup",
    titulo: "Margem, markup e a conta que a maioria erra",
    resumo: "A diferença entre os dois e por que confundir custa dinheiro.",
    conteudo: `Duas palavras parecidas, resultados muito diferentes. Confundir as duas é o erro de conta mais caro do setor, e ele é silencioso: você acha que tem 40% de lucro e tem 28%.

## As duas definições

**Markup** é o quanto você multiplica o custo. Custo R$ 10 com markup 2,0 vira preço R$ 20.

**Margem** é quanto do preço final sobra como lucro. No mesmo exemplo, sobram R$ 10 de um preço de R$ 20 — margem de **50%**.

A diferença: markup olha para o **custo**, margem olha para o **preço de venda**.

## O erro clássico

Alguém quer 40% de margem. Multiplica o custo por 1,4:

- custo R$ 10 × 1,4 = R$ 14
- lucro: R$ 4
- margem real: 4 ÷ 14 = **28,5%**

Faltaram 11,5 pontos. Numa operação de 120 marmitas por mês, isso é dinheiro suficiente para pagar todos os custos indiretos — e ele simplesmente não existe.

## A fórmula correta

> preço = custo ÷ (1 − margem desejada)

Para custo R$ 10 e margem de 40%: 10 ÷ 0,6 = **R$ 16,67**.

Confira: lucro de R$ 6,67 sobre preço de R$ 16,67 = 40%. Bate.

## Tabela de conversão

Guarde esta relação:

- margem 30% → divida o custo por 0,70 (markup 1,43)
- margem 40% → divida por 0,60 (markup 1,67)
- margem 45% → divida por 0,55 (markup 1,82)
- margem 50% → divida por 0,50 (markup 2,00)
- margem 55% → divida por 0,45 (markup 2,22)

Repare como o markup cresce rápido: para dobrar a margem de 30% para 60%, o multiplicador quase dobra também.

## Qual margem buscar

Para marmita caseira, entre **40% e 55%** costuma ser sustentável.

- **Abaixo de 30%** o negócio é frágil. Uma alta de 15% no preço do frango apaga o seu lucro.
- **Acima de 60%** você provavelmente está fora do preço do bairro, a menos que tenha um diferencial claro.

## Margem não é lucro no bolso

Um alerta importante: a margem que você calcula aqui já desconta ingrediente, embalagem, custo indireto e a sua hora. Se você **não** incluiu a sua hora no custo, a margem que aparece está inflada — e o dinheiro que sobra é o seu salário, não lucro.

## Faça agora

Abra a [calculadora de precificação](/app/precificacao) e teste o mesmo prato com margem de 30%, 40% e 50%. Veja o preço mudar e o lucro por unidade junto.

A calculadora mostra a conta aberta de propósito: o objetivo não é que ela te dê um número, é que você entenda de onde ele vem. No dia em que o frango subir, você vai saber exatamente o que recalcular.`,
  },
  {
    modulo: "precificacao-sem-chute",
    slug: "preco-psicologico",
    titulo: "Preço psicológico e faixas de mercado",
    resumo:
      "Onde o seu preço se encaixa na cabeça do cliente e como pesquisar a sua região.",
    conteudo: `A conta te dá um preço mínimo. O mercado te dá um teto. O preço que você pratica mora entre os dois — e a distância entre eles é o seu espaço de manobra.

## As faixas que o cliente enxerga

Marmita fit costuma ser lida em três faixas:

- **Até R$ 18** — faixa popular. Ganha no volume, exige custo muito controlado e cardápio simples.
- **R$ 19 a R$ 28** — faixa intermediária. É onde a maior parte das operações caseiras vive e onde a margem é mais confortável.
- **Acima de R$ 29** — faixa premium. Exige justificativa visível: corte nobre, ficha nutricional detalhada, embalagem melhor, entrega pontual.

O erro é escolher a faixa pelo que você quer ganhar. A faixa é definida pelo **bairro e pelo cliente**, não pela sua meta.

## Como pesquisar de verdade

Em uma tarde:

1. Procure no iFood pelo seu CEP e anote 10 preços de marmita fit.
2. Procure no Instagram por "marmita fit" mais o nome do seu bairro.
3. Pergunte no grupo do condomínio ou da academia quanto pagam hoje.

Você vai encontrar uma faixa, não um número. Se a maioria está entre R$ 20 e R$ 26, esse é o seu campo de jogo.

## Quando o seu custo não cabe na faixa

Acontece, e é uma informação valiosa, não um fracasso. Se o preço mínimo que fecha a sua margem é R$ 30 e o bairro paga R$ 22, existem três saídas:

1. **Baixar o custo** — trocar corte de carne, comprar em maior volume, reduzir gramagem da proteína.
2. **Subir o valor percebido** — ficha nutricional impressa, embalagem melhor, entrega em horário fixo.
3. **Mudar de cliente** — sair do bairro e mirar academia, escritório ou condomínio de maior renda.

O que **não** é saída: vender a R$ 22 com margem de 15% e esperar que o volume resolva. Volume com margem baixa só multiplica o cansaço.

## Os detalhes que funcionam

- **R$ 19,90 em vez de R$ 20,00.** Diferença de 10 centavos, percepção de faixa diferente.
- **Combo de 5 com desconto pequeno.** Vender 5 marmitas a R$ 21 em vez de 1 a R$ 22 aumenta o ticket e reduz o seu custo de entrega.
- **Nunca dê desconto sem contrapartida.** Desconto por quantidade, por pagamento antecipado ou por indicação — nunca só por pedir.

> Cada real de desconto sai inteiro do lucro. Numa margem de 45%, dar R$ 2 de desconto equivale a **produzir uma marmita a mais de graça**.

## Faça agora

Faça a pesquisa das 10 referências do seu bairro e anote a faixa. Depois compare com o preço que a [calculadora de precificação](/app/precificacao) sugeriu para os seus pratos.

Se o seu preço mínimo estiver acima da faixa, você já sabe que o trabalho agora é no custo — não no marketing.`,
  },
  {
    modulo: "precificacao-sem-chute",
    slug: "tabela-de-precos",
    titulo: "Montando a sua tabela de preços",
    resumo:
      "Transformar os cálculos em uma tabela que você usa e revisa sem refazer tudo.",
    conteudo: `Precificar prato por prato, toda vez, não se sustenta. O que se sustenta é uma **tabela**: poucos preços, definidos por faixa, que você revisa em bloco.

## Não precifique prato a prato

Se cada prato tiver um preço diferente, você cria três problemas: o cliente não decora, você erra no pedido e a atualização vira um dia de trabalho.

Agrupe em **duas ou três faixas**:

- **Padrão** — frango, ovo, carne moída. O grosso do cardápio.
- **Especial** — corte bovino melhor, peixe. R$ 3 a R$ 5 acima da padrão.
- **Premium**, se fizer sentido — salmão, camarão. R$ 8 a R$ 12 acima.

Precifique cada faixa pelo **prato mais caro dentro dela**. Assim nenhum item fica no prejuízo, e os mais baratos da faixa compensam.

## Combos que fazem sentido

Combo bom reduz o **seu** custo, não só o preço do cliente:

- **Pacote semanal de 5** — uma entrega em vez de cinco. Desconto de 5% a 8% se paga fácil.
- **Pacote de 10 ou 15** — duas semanas. Desconto de 10%, com pagamento antecipado.
- **Combo com bebida ou sobremesa** — aumenta o ticket sem aumentar a entrega.

O desconto do pacote deve sair da **economia de entrega**, não da sua margem de produção.

## Quando reajustar

Marque uma data fixa — a cada três meses — para revisar. Fora isso, reajuste quando:

- o custo de um ingrediente principal subir mais de 15%
- a sua margem real cair abaixo de 35%
- você mudar embalagem ou gramagem

Reajuste pequeno e frequente incomoda menos que reajuste grande e raro. Subir R$ 1 duas vezes por ano passa despercebido; subir R$ 4 de uma vez gera cancelamento.

## Como comunicar aumento

Três regras:

1. **Avise antes**, com pelo menos uma semana.
2. **Não peça desculpa.** Você está corrigindo um preço, não cometendo uma falta.
3. **Dê um motivo concreto**: "o quilo do frango subiu 22% desde março".

> Cliente aceita aumento explicado. O que ele não aceita é descobrir na hora de pagar.

## Guarde os cenários

Cada vez que você calcular um prato, salve o cenário. Quando o frango subir, você abre o cenário salvo, troca o custo do frango e vê o novo preço em segundos — sem refazer a conta inteira.

É para isso que serve o histórico da calculadora.

## Faça agora

Monte a sua tabela: defina duas ou três faixas, calcule cada uma na [calculadora de precificação](/app/precificacao) usando o prato mais caro da faixa, e **salve os cenários**.

Depois escreva a tabela num papel e cole na cozinha. Preço que só existe no celular é preço que você vai improvisar no meio do atendimento — e improviso em preço sempre sai para baixo.`,
  },

  // =========================================================================
  // Módulo 3 — Marketing local
  // =========================================================================
  {
    modulo: "marketing-local",
    slug: "cliente-em-3km",
    titulo: "Quem é o seu cliente num raio de 3 km",
    resumo:
      "Por que o seu mercado é geográfico antes de ser demográfico, e como mapear o seu.",
    conteudo: `Marmita não viaja bem. Ela precisa sair da sua cozinha e chegar refrigerada, no horário, sem custar mais de frete do que de lucro. Isso define o seu mercado antes de qualquer coisa: ele é **geográfico**.

Um raio de 3 km a pé ou de moto é o campo onde a conta fecha. Fora dele, o custo de entrega come a margem.

## Os quatro perfis que compram

Dentro desse raio, quatro grupos concentram quase toda a demanda:

- **Quem treina.** Academia, crossfit, corrida. Compra por proteína e constância, não por preço. É o cliente que mais aceita pagar mais e o que mais pede ficha nutricional.
- **Quem trabalha fora e não tem tempo.** Escritório, comércio, hospital. Compra por praticidade. Quer sabor conhecido, não quer dieta.
- **Quem mora sozinho.** Cozinhar para um sai caro e sobra. Compra pacote semanal e é o cliente mais fiel de todos.
- **Família com rotina apertada.** Compra volume, quer porção maior e preço por unidade menor.

Os quatro querem coisas diferentes. Falar com todos ao mesmo tempo é falar com ninguém.

## Como mapear o seu raio

Uma tarde de trabalho, sem gastar nada:

1. Abra o mapa e desenhe o círculo de 3 km em volta da sua casa.
2. Marque **academias, escritórios, clínicas e condomínios grandes**. Cada um é um ponto de concentração de cliente.
3. Anote quantas academias existem. Cada academia com 200 alunos tem, tipicamente, de 20 a 40 pessoas que já compram ou comprariam marmita.
4. Veja quem já vende ali. Concorrência não é problema — é prova de que existe demanda.

## O erro de mirar em todo mundo

"Marmita fit para quem quer emagrecer, ganhar massa, economizar tempo e comer bem." Essa frase não vende para ninguém, porque não se parece com a necessidade específica de nenhuma pessoa.

Escolha **um perfil para começar**. O cardápio, o preço, a foto e o texto mudam completamente conforme o perfil:

- Para quem treina: destaque a proteína por porção.
- Para quem trabalha fora: destaque o horário de entrega e o preço do pacote.
- Para quem mora sozinho: destaque a variedade da semana e a validade.

> Você não precisa de mil clientes. Com **15 pessoas comprando 5 marmitas por semana** você já tem 75 marmitas semanais — uma operação de verdade.

## Faça agora

Desenhe o seu raio de 3 km e liste os pontos de concentração. Depois escolha **um** perfil para os seus primeiros trinta clientes.

Escreva numa frase: "eu faço marmita para ______, que precisa de ______." Essa frase vai definir o cardápio, o preço e cada palavra que você escrever nas próximas aulas.`,
  },
  {
    modulo: "marketing-local",
    slug: "whatsapp-vitrine-e-caixa",
    titulo: "WhatsApp como vitrine e caixa",
    resumo:
      "Organizar pedido, catálogo e cobrança sem sistema, sem planilha e sem perder venda.",
    conteudo: `Você não precisa de site, de aplicativo nem de loja virtual. Precisa de um WhatsApp organizado. Ele é, ao mesmo tempo, a sua vitrine, o seu caixa e o seu histórico de cliente.

## Comece pelo WhatsApp Business

É gratuito e resolve quase tudo que um sistema pago faria no seu tamanho:

- **Catálogo** com foto, nome, descrição e preço de cada prato
- **Mensagem de saudação** automática, para quem chama fora do horário
- **Respostas rápidas** com atalho, para não digitar a mesma coisa vinte vezes
- **Etiquetas** para marcar cliente por situação: novo, pedido feito, pago, entregue

As etiquetas são a parte mais subestimada. Elas transformam a lista de conversas num controle de pedidos.

## O ciclo da semana

Um ritmo fixo vale mais que qualquer ferramenta:

1. **Segunda ou terça** — publique o cardápio da semana no status e mande para a lista de transmissão.
2. **Até quarta** — receba os pedidos. Deixe claro o prazo: "pedidos até quarta às 20h".
3. **Quinta** — feche a lista, calcule a compra, confirme os pagamentos.
4. **Sexta ou sábado** — produza e entregue.

O prazo de fechamento não é burocracia: é o que permite você comprar a quantidade certa e não sobrar comida.

## Lista de transmissão, não grupo

Grupo de clientes vira bagunça: um responde, todo mundo recebe, gente sai. **Lista de transmissão** manda para todos individualmente, e cada resposta chega só para você.

Uma limitação a saber: a pessoa só recebe a transmissão se tiver o seu número salvo. Peça isso explicitamente na primeira conversa.

## O status é a sua vitrine diária

Poste no status, com constância:

- o cardápio da semana
- a comida sendo feita
- a marmita montada
- o depoimento de quem elogiou

Quem vê status é quem já te conhece — é o público mais quente que existe. Três a cinco posts por semana bastam.

## Cobrança sem fricção

**Pix é o padrão.** Chave curta, de preferência o telefone. Peça o comprovante e confirme com uma mensagem: "recebido, sua marmita sai sexta".

Duas regras que evitam a maior parte do prejuízo:

- **Cliente novo paga antes.** Não é desconfiança, é padrão da casa. Diga assim.
- **Pacote semanal paga antecipado.** É o que garante o seu capital de compra.

> Fiado é a forma mais rápida de transformar cliente bom em ex-cliente. Quando o pagamento atrasa, a conversa muda de tom — e você perde os dois.

## Faça agora

Instale o WhatsApp Business, monte o catálogo com os cinco pratos do seu cardápio de largada e cadastre três respostas rápidas: cardápio da semana, forma de pagamento e horário de entrega.

Se ainda não tiver a foto dos pratos, a próxima aula resolve isso com o celular que você já tem.`,
  },
  {
    modulo: "marketing-local",
    slug: "cardapio-que-vende",
    titulo: "Cardápio que vende sozinho",
    resumo:
      "Como descrever um prato para a pessoa bater o olho e pedir, sem você precisar explicar.",
    conteudo: `O seu cardápio vai ser lido no celular, entre um compromisso e outro, em uns quinze segundos. Ele precisa vender sem você por perto.

## O que faz um item vender

Cada prato precisa de quatro informações, nessa ordem:

1. **Nome que dá vontade.** "Frango grelhado com arroz integral e brócolis" vende mais que "Opção 3 — Fit Frango".
2. **O que tem dentro**, em uma linha curta.
3. **A informação nutricional que importa** para o seu perfil de cliente.
4. **O preço**, sem esconder.

Esconder preço para "conversar antes" só faz a pessoa não perguntar.

## Descrição: concreto vence adjetivo

Compare:

- "Deliciosa marmita fitness saudável e nutritiva" — não diz nada.
- "Frango grelhado, arroz integral e brócolis no vapor. 436 kcal e 38 g de proteína por porção." — diz tudo.

A segunda usa números que você já tem, se montou a ficha na calculadora.

## Use a ficha nutricional como argumento

Aqui está uma vantagem que a maior parte da concorrência não tem: **você sabe os números dos seus pratos**. Quem compra por treino escolhe pela proteína. Quem compra por dieta olha caloria.

E há um dado que quase ninguém informa e que diferencia: o **sódio**. Vale saber de onde ele vem na sua comida — na maioria das receitas caseiras o maior responsável não é o industrializado, é o sal da panela. Cinco gramas de sal jogam quase 2.000 mg de sódio no total da receita.

Se você controla isso e informa, tem um argumento real com quem se preocupa com pressão.

## Organize por perfil, não por ingrediente

Em vez de "pratos de frango" e "pratos de carne", agrupe pelo que o cliente procura:

- **Mais proteína** — para quem treina
- **Low carb** — para quem está cortando carboidrato
- **Do dia a dia** — o arroz com feijão bem-feito, que é o que mais vende

## Escassez honesta funciona

"Faço 40 marmitas por semana, pedidos até quarta" é verdade e cria urgência real. Não invente escassez que não existe: se você entregar depois de dizer que estava esgotado, perde a credibilidade de tudo o que disser depois.

> Cardápio bom não convence ninguém a comprar. Ele **remove a dúvida** de quem já estava quase pedindo.

## Faça agora

Escreva o cardápio dos seus cinco pratos com nome, uma linha de descrição, calorias e proteína por porção, e o preço.

Os números você pega direto do [banco de receitas](/app/receitas), que já traz a ficha por porção, ou da [calculadora de macros](/app/macros) se o prato for seu. Copie e cole — é informação que a concorrência do bairro provavelmente não tem.`,
  },
  {
    modulo: "marketing-local",
    slug: "foto-de-comida-com-celular",
    titulo: "Foto de comida com celular",
    resumo:
      "A diferença entre a foto que vende e a que afasta está na luz, não no aparelho.",
    conteudo: `Foto ruim de comida não é neutra: ela **afasta**. Uma marmita fotografada com luz amarela de cozinha, de cima, com flash, parece comida de ontem. E o cliente decide em um segundo.

A boa notícia é que o problema quase nunca é o celular.

## Luz é 80% do resultado

Uma regra só, que resolve a maior parte:

> Fotografe **de dia, perto da janela, com o flash desligado**.

O flash achata a comida e deixa a cor cinzenta. A luz da janela é difusa e mostra textura. Se a janela é muito forte, pendure um pano branco fino na frente.

Evite luz de lâmpada amarela: ela deixa arroz e frango com aparência de comida velha.

## Ângulo conforme o prato

- **De cima (90°)** — bom para marmita montada, que é composta por partes separadas. Mostra tudo de uma vez.
- **De lado (45°)** — bom para prato com altura, como escondidinho ou lasanha. Dá volume.

Na dúvida com marmita, use de cima.

## Fundo simples

Bancada de madeira, mármore, tábua, pano liso. Nunca a pia atrás, nunca embalagem de mercado no canto do quadro. Limpe o entorno antes de fotografar — leva dez segundos e muda tudo.

## Detalhes que aparecem na foto

- Limpe a borda da marmita antes de fotografar. Respingo aparece muito.
- Coloque a proteína por cima, nunca embaixo.
- Um toque de verde — salsa, cebolinha — muda a foto inteira.
- Comida fotografa melhor **recém-montada**. Depois de dez minutos, o arroz seca e o brócolis murcha.

## Edição: pouca e só de luz

No próprio celular:

- aumente **brilho** e **contraste** um pouco
- suba um pouco a **saturação**, sem exagero
- **não** use filtro colorido: comida azulada ou alaranjada demais parece falsa

O objetivo é a foto parecer com a comida real. Quem recebe algo diferente da foto não compra de novo.

## Faça uma sessão só

Fotografe os cinco pratos no mesmo dia, com a mesma luz e o mesmo fundo. O conjunto fica coerente, e cardápio coerente parece profissional mesmo quando é feito em casa.

## Faça agora

Escolha o prato que você mais quer vender. Fotografe perto da janela, sem flash, de cima, com fundo limpo. Tire cinco fotos e escolha uma.

Coloque essa foto no catálogo do WhatsApp Business, ao lado da descrição que você escreveu na aula anterior. Você acabou de montar a sua vitrine.`,
  },
  {
    modulo: "marketing-local",
    slug: "parcerias-locais",
    titulo: "Parcerias com academias e escritórios",
    resumo:
      "Como chegar em quem já reuniu o seu cliente, sem parecer vendedor incômodo.",
    conteudo: `Conseguir cliente um a um é lento. Academia, escritório e clínica já reuniram dezenas de pessoas do seu perfil no mesmo lugar. A parceria é o atalho — desde que você chegue com proposta, não com pedido.

## Por que o dono aceita

Ninguém aceita parceria por bondade. Ele aceita porque ganha alguma coisa:

- **Academia** ganha um serviço para oferecer ao aluno sem custo nenhum. Melhora a percepção da academia.
- **Escritório** ganha funcionário que almoça bem sem sair, e volta no horário.
- **Clínica de nutrição** ganha paciente que consegue seguir a dieta prescrita.

Comece a conversa pelo que o outro ganha. Se você começar pelo que você precisa, vira pedido de favor.

## As três formas de parceria

Da mais simples para a mais comprometida:

1. **Indicação simples.** Você deixa cartão ou cardápio no balcão. Custo zero para os dois. É por onde começar.
2. **Comissão.** Você paga de 5% a 10% sobre o que vier dali. Exige controle: use um código ou pergunte sempre como a pessoa chegou.
3. **Entrega no local.** Você entrega tudo num ponto só, num horário fixo. É a melhor das três: reduz o seu custo de rota drasticamente e cria hábito.

A terceira é a que muda a operação. Vinte marmitas entregues num escritório às 11h30 custam menos que cinco entregas espalhadas.

## Como abordar

Vá pessoalmente, fora do horário de pico, e leve amostra. Uma marmita pronta na mão vale mais que qualquer apresentação.

Fale em três frases:

1. Quem você é e onde produz. ("Moro aqui na região, faço marmita fit.")
2. O que você propõe, com o ganho do outro na frente. ("Queria deixar o cardápio aqui para os alunos — sem custo para vocês.")
3. Uma pergunta que exige resposta. ("Com quem eu falo sobre isso?")

Deixe a amostra e vá embora. Não fique esperando resposta na hora.

## O que não fazer

- **Não peça para postar no grupo dos alunos** logo de cara. É o pedido que mais gera recusa.
- **Não ofereça marmita grátis para o dono para sempre.** Uma amostra é cortesia; toda semana é prejuízo.
- **Não abandone a parceria depois de fechada.** Aparecer uma vez por mês mantém você na cabeça de quem indica.

## Nutricionista é o melhor parceiro

Vale um destaque: nutricionista de bairro atende gente que precisa exatamente do que você faz e **não tem tempo de cozinhar**. É a indicação de maior conversão que existe nesse negócio.

Para essa conversa, leve a ficha nutricional dos seus pratos. É o que separa você de quem só diz "é fit".

> A parceria que funciona não é a que te dá cliente. É a que **coloca você onde o cliente já está**.

## Faça agora

Liste três lugares do seu raio de 3 km: uma academia, um escritório ou comércio, e um profissional de saúde.

Prepare a ficha nutricional de dois pratos no [banco de receitas](/app/receitas) para levar impressa. Visite um dos três esta semana — só um. Aprenda com a conversa antes de fazer as outras duas.`,
  },

  // =========================================================================
  // Módulo 4 — Logística e entrega
  // =========================================================================
  {
    modulo: "logistica-e-entrega",
    slug: "producao-em-lote",
    titulo: "Produção em lote: cozinhar uma vez, vender a semana",
    resumo:
      "O método que transforma seis horas de cozinha em quarenta marmitas sem caos.",
    conteudo: `Cozinhar 40 marmitas não é cozinhar 4 vezes 10. É outro processo. Quem tenta fazer marmita como faz o almoço de casa passa dez horas na cozinha e produz vinte.

## A ordem que economiza horas

A sequência importa mais que a velocidade:

1. **Compra** — um dia antes, nunca no dia da produção.
2. **Higienização** — lave e sanitize tudo que entra.
3. **Pré-preparo** — corte, tempere e separe **tudo** antes de acender o fogo.
4. **Cocção por grupo** — cozinhe todos os grãos, depois todas as proteínas, depois todos os legumes.
5. **Resfriamento**
6. **Montagem em linha**
7. **Fechamento e etiquetagem**

O erro mais caro é misturar as etapas 3 e 4: cortar cebola com a panela no fogo faz você perder o ponto de tudo.

## Pré-preparo é o segredo

Separar todos os ingredientes antes de cozinhar parece perda de tempo. É o oposto: numa produção de 40 marmitas, o pré-preparo bem-feito economiza de uma a duas horas.

Enquanto o arroz cozinha, você não precisa correr para descascar cebola — ela já está pronta, em pote, esperando.

## Cozinhe por grupo, não por prato

Se três pratos levam arroz, cozinhe **todo o arroz de uma vez**. Se dois levam frango desfiado, cozinhe todo o frango junto.

Você usa menos panela, menos gás e menos tempo de espera. E o resultado fica mais uniforme, que é o que o cliente percebe entre uma semana e outra.

## Montagem em linha

Monte como uma esteira: todas as marmitas abertas na bancada, e você passa colocando um componente de cada vez em todas. Arroz em todas, depois feijão em todas, depois proteína em todas.

É muito mais rápido que montar uma marmita completa por vez, e a porção fica mais parecida entre elas.

## Padronize a porção com a balança

Pesar cada componente parece exagero até você perceber duas coisas:

- **Sem pesar, a porção varia** — e o cliente que recebeu a menor reclama.
- **Sem pesar, o custo é chute** — e a sua precificação inteira vira ficção.

Depois de algumas produções você acerta no olho. Mas mantenha a balança na bancada para conferir uma a cada dez.

## Um cronograma de 40 marmitas

- 1h30 — compra (no dia anterior)
- 1h — higienização e pré-preparo
- 2h30 — cocção por grupos
- 1h — resfriamento (você faz outra coisa nesse tempo)
- 1h — montagem, fechamento e etiquetagem

Cerca de **7 horas de trabalho efetivo**, sendo que o resfriamento acontece sozinho.

> Se a sua produção está levando muito mais que isso, o problema quase nunca é lentidão. É **ordem**.

## Faça agora

Escreva o roteiro da sua próxima produção com horário para cada etapa. Cronometre no dia e compare com o previsto.

O tempo real que você medir aqui é exatamente o que entra na [calculadora de precificação](/app/precificacao) como custo de mão de obra. Produção organizada não economiza só o seu sábado: ela **derruba o custo da marmita**.`,
  },
  {
    modulo: "logistica-e-entrega",
    slug: "resfriamento-e-validade",
    titulo: "Resfriamento, embalagem e validade",
    resumo:
      "Quanto tempo a sua marmita realmente dura, e o que define esse prazo.",
    conteudo: `A validade da sua marmita não é um número que você escolhe. Ela é consequência de três coisas: como você resfriou, como embalou e a que temperatura ela ficou até chegar na casa do cliente.

## Resfriamento define quase tudo

Comida quente guardada quente estraga rápido, mesmo na geladeira. Uma panela funda com comida a 70 °C leva horas para o miolo esfriar, e nesse tempo a bactéria se multiplica.

O método correto:

1. Espalhe a comida em recipientes **rasos**, com no máximo 5 cm de altura.
2. Coloque em banho de gelo — bacia com água e gelo em volta.
3. Mexa a cada poucos minutos.
4. Leve à geladeira ou freezer quando parar de soltar vapor forte.

Meta: sair de 60 °C para menos de 10 °C em **até 2 horas**.

## Validade realista

Com resfriamento correto e embalagem fechada:

- **Refrigerado (0 a 4 °C):** 3 a 5 dias
- **Congelado (−18 °C):** 60 a 90 dias
- **Congelado com selagem a vácuo:** até 120 dias

Sem resfriamento rápido, corte esses prazos pela metade — e ainda assim é aposta.

Um detalhe que muda o prazo: **prato com molho e proteína dura menos** que prato seco. Arroz, feijão e frango grelhado aguentam mais que estrogonofe.

## Congelar direito

- Congele **no dia da produção**, nunca no dia seguinte.
- Deixe cerca de 1 cm de espaço até a tampa: comida expande ao congelar.
- Não empilhe marmitas quentes no freezer. Elas aquecem as vizinhas e o freezer inteiro sai da temperatura.
- Congele em camada única primeiro; depois de firmes, pode empilhar.

## A etiqueta é a sua proteção

Toda marmita precisa de:

- nome do prato
- **data de produção**
- **data de validade**
- instrução de conservação: "manter congelado a −18 °C"
- instrução de reaquecimento: "micro-ondas por 4 min em potência alta, com a tampa entreaberta"

A instrução de reaquecimento não é gentileza: marmita reaquecida errado fica ruim, e o cliente vai achar que a comida é ruim.

> Numa reclamação, a etiqueta com data é a diferença entre "o produto estava dentro do prazo" e a sua palavra contra a do cliente.

## Transporte

Do seu freezer até a casa do cliente, a comida não pode descongelar. Bolsa térmica com gelo reutilizável resolve entregas de até uma hora. Acima disso, considere caixa térmica maior.

Se a marmita chegar mole, ela perdeu parte da validade — e você não tem como saber quanto.

## Faça agora

Meça o tempo de resfriamento da sua próxima produção: anote a hora que desligou o fogo e a hora que a comida entrou na geladeira.

Se passou de duas horas, o ajuste é dividir em recipientes mais rasos e usar banho de gelo. É a mudança mais barata e de maior impacto em segurança que existe nesse negócio.`,
  },
  {
    modulo: "logistica-e-entrega",
    slug: "rota-e-taxa-de-entrega",
    titulo: "Rota de entrega e taxa que não come o lucro",
    resumo:
      "Quanto custa cada entrega de verdade e como organizar para o frete não zerar a margem.",
    conteudo: `Entrega é o custo que mais some da conta e mais destrói margem. Uma marmita de R$ 22 com R$ 8 de custo de entrega não tem lucro nenhum — e muita gente descobre isso tarde.

## O custo real de uma entrega

Some tudo:

- **Combustível** — uma moto faz cerca de 30 km por litro; um carro, 10.
- **Tempo** — 20 minutos de ida e volta, ao valor da sua hora.
- **Desgaste** — pneu, óleo, manutenção.

Um exemplo: entrega de 6 km ida e volta, de moto, com a sua hora a R$ 20:

- combustível: R$ 1,20
- tempo (20 min): R$ 6,67
- desgaste: R$ 0,50

Total: **R$ 8,37 por entrega**.

Se você entrega uma marmita por vez, esse valor sai inteiro do lucro daquela unidade. É o suficiente para transformar margem de 45% em prejuízo.

## A solução é agrupar

O mesmo custo dividido muda tudo:

- 1 marmita por parada: R$ 8,37 por marmita
- 5 marmitas na mesma parada: **R$ 1,67** por marmita
- 10 marmitas no mesmo prédio: **R$ 0,84** por marmita

Por isso o pacote semanal não é só conveniência para o cliente: é a **estratégia de logística** que viabiliza o negócio.

## Como agrupar na prática

1. **Dia fixo por região.** Segunda no bairro A, quarta no bairro B. O cliente se acostuma e você faz uma rota só.
2. **Janela de horário, não hora marcada.** "Entre 18h e 20h" permite otimizar a rota. Hora marcada obriga a fazer zigue-zague.
3. **Ponto de retirada.** Academia, portaria de condomínio, comércio parceiro. Uma parada, várias entregas.
4. **Pedido mínimo por entrega.** Abaixo de 3 marmitas, cobre taxa ou peça retirada.

## Como cobrar

Três modelos, e o terceiro costuma ser o melhor:

- **Frete embutido no preço.** Simples, mas penaliza quem mora perto.
- **Taxa por faixa de distância.** Justo e transparente: até 2 km, R$ 4; de 2 a 4 km, R$ 7.
- **Frete grátis acima de X marmitas.** Estimula exatamente o comportamento que reduz o seu custo.

O terceiro alinha o interesse dos dois lados: o cliente compra mais, você entrega menos vezes.

> Frete grátis não é desconto. É **pagar para o cliente juntar o pedido** — e sai muito mais barato que dez entregas avulsas.

## Faça agora

Calcule o custo de uma entrega sua com a conta acima: combustível, tempo e desgaste. Depois defina o seu pedido mínimo e a faixa de frete grátis.

Coloque esse custo na [calculadora de precificação](/app/precificacao) como parte dos custos indiretos. Muita gente descobre nesse momento que estava entregando de graça.`,
  },
  {
    modulo: "logistica-e-entrega",
    slug: "entrega-propria-ou-app",
    titulo: "Entrega própria, aplicativo ou retirada",
    resumo:
      "As três formas de fazer a marmita chegar, com a conta de cada uma.",
    conteudo: `Três caminhos, custos muito diferentes e uma consequência que quase ninguém considera: **quem é dono do cliente**.

## Entrega própria

Você mesmo entrega, de moto, carro ou a pé.

- **Custo:** R$ 5 a R$ 10 por parada, contando o seu tempo.
- **A favor:** você vê o cliente, ouve o retorno na hora, mantém o contato direto e não paga comissão.
- **Contra:** consome muito tempo e não escala. Vinte entregas espalhadas tomam a tarde inteira.

É o melhor modelo no começo, justamente porque o contato direto ensina muito sobre o seu cliente.

## Aplicativo de entrega

iFood, Rappi e equivalentes.

- **Custo:** comissão de **12% a 27%** do valor do pedido, mais taxas.
- **A favor:** traz cliente que você não alcançaria e resolve a logística.
- **Contra:** a comissão come quase toda a sua margem, e **o cliente é do aplicativo**, não seu. Ele não tem o seu WhatsApp e não vira recompra direta.

A conta que assusta: numa marmita de R$ 22 com 25% de comissão, são R$ 5,50 por unidade. Se a sua margem era de 45% (R$ 9,90), sobra R$ 4,40 — margem real de 20%.

Para caber, você precisaria vender no aplicativo por cerca de R$ 29 para ter o mesmo lucro de R$ 22 na venda direta.

## Retirada no local

O cliente busca na sua casa ou num ponto combinado.

- **Custo:** praticamente zero.
- **A favor:** margem cheia.
- **Contra:** menos gente aceita, e você recebe pessoas na sua casa.

O ponto intermediário que funciona bem: **retirada num parceiro** — academia ou comércio. Custo baixo, sem expor o seu endereço.

## A estratégia que costuma funcionar

Não é escolher um. É combinar, com papéis diferentes:

1. **Venda direta pelo WhatsApp** como base do negócio — é onde está a margem e o relacionamento.
2. **Retirada** com desconto de R$ 2, para quem topar.
3. **Aplicativo** apenas como vitrine para conquistar cliente novo, com preço mais alto que cobre a comissão.

E, no aplicativo, coloque um cartão dentro da sacola convidando a comprar direto na próxima vez. É legítimo e é o que transforma cliente do aplicativo em cliente seu.

> Aplicativo é ótimo para **descobrir** cliente. É péssimo para **manter** cliente. Use pelo que ele faz bem.

## Faça agora

Calcule quanto você precisaria cobrar no aplicativo para ter o mesmo lucro da venda direta: pegue o seu preço atual e divida por (1 − comissão). Com 25%, divida por 0,75.

Faça essa conta na [calculadora de precificação](/app/precificacao) usando a comissão como custo. O número que aparecer costuma decidir a questão sozinho.`,
  },
  {
    modulo: "logistica-e-entrega",
    slug: "controle-de-estoque",
    titulo: "Controle de estoque sem sistema caro",
    resumo:
      "Saber o que tem, o que falta e o que está parado, com um caderno e uma regra.",
    conteudo: `Estoque é dinheiro parado no congelador. Estoque demais estraga; estoque de menos faz você perder venda ou correr no mercado no dia da produção, pagando mais caro.

## As três listas

Você precisa de três, e nenhuma exige sistema:

1. **O que tem no congelador** — quantas marmitas, de qual prato, de qual data.
2. **O que tem na despensa** — ingrediente seco e enlatado.
3. **O que precisa comprar** — montada a partir dos pedidos da semana.

Um caderno na parede da cozinha resolve. Bloco de notas do celular resolve. O que não resolve é a memória.

## O que vence primeiro, sai primeiro

A regra mais importante do estoque de comida:

> **O que vence primeiro, sai primeiro.** Sempre.

Na prática: marmita nova vai para o fundo do freezer, marmita antiga vem para a frente. Toda vez. É o hábito que evita a perda mais burra que existe — descobrir cinco marmitas vencidas atrás de dez novas.

## Compra puxada pelo pedido

O erro clássico é comprar por intuição e cozinhar o que comprou. O certo é o contrário:

1. Feche os pedidos na quarta.
2. Some as gramagens de cada ingrediente pelas fichas dos pratos pedidos.
3. Compre exatamente isso, mais uma folga de 10%.

Se 12 pessoas pediram frango grelhado e a sua ficha usa 150 g por porção, são 1,8 kg de frango — mais a folga, 2 kg. Sem chute.

É aqui que a ficha de cada prato deixa de ser enfeite e vira **lista de compras automática**.

## Estoque de segurança

Mantenha sempre em casa:

- arroz, feijão e óleo para uma produção
- embalagem para uma produção e meia
- tempero seco

São itens que não estragam e que, faltando, param a produção inteira.

## O que não estocar

- **Proteína em grande quantidade** — prende muito dinheiro e ocupa o freezer que você precisa para marmita pronta.
- **Legume fresco além da semana** — murcha.
- **Marmita pronta acima de duas semanas de venda** — se não vendeu, o problema é o cardápio, não o estoque.

## Conferência semanal

Uma vez por semana, dez minutos:

- conte as marmitas por prato
- confira as datas
- anote o que está parado há mais de duas semanas

Prato que encalha duas semanas seguidas sai do cardápio. Não insista por gosto pessoal — o cardápio é do cliente.

## Faça agora

Monte a sua lista de compras da próxima produção somando as gramagens das fichas dos pratos pedidos. Use as fichas que você montou na [calculadora de macros](/app/macros).

Compare o total gasto com o que você costuma gastar comprando no olho. A diferença costuma pagar o esforço de fazer a conta.`,
  },

  // =========================================================================
  // Módulo 5 — Atendimento e fidelização
  // =========================================================================
  {
    modulo: "atendimento-e-fidelizacao",
    slug: "primeiro-contato",
    titulo: "O primeiro contato define a recompra",
    resumo:
      "Os primeiros minutos de conversa valem mais que qualquer estratégia de venda.",
    conteudo: `Conquistar cliente novo custa muito mais caro que manter um antigo. Em marmita, onde a venda é recorrente por natureza, isso é ainda mais verdadeiro: um cliente que compra 5 marmitas por semana durante um ano vale mais de R$ 5.000.

E quase tudo se decide no primeiro contato.

## Responda rápido

O tempo de resposta é o fator isolado que mais afeta a conversão. Quem pergunta preço de marmita está com fome ou planejando a semana — nos dois casos, decide rápido.

- Resposta em **até 15 minutos**: ótima chance de fechar.
- Resposta em **mais de 2 horas**: a pessoa provavelmente já resolveu de outro jeito.

Se não puder responder na hora, configure a mensagem automática dizendo quando responde. Isso segura a pessoa.

## O que responder

Quando alguém pergunta "quanto é?", não responda só o preço. Responda o preço **e** o que ele leva:

> "Oi! A marmita sai R$ 22, com 400 g. Essa semana tem frango grelhado com arroz integral e brócolis, 38 g de proteína. Faço entrega às quintas na sua região. Quer que eu te mande o cardápio completo?"

Preço sozinho vira comparação. Preço com contexto vira conversa.

E repare no fim: uma **pergunta**. Toda mensagem sua deve terminar com uma, para a conversa continuar.

## Combine tudo antes de fechar

Antes de confirmar o primeiro pedido, deixe explícito:

- o que vai na marmita e o peso
- o dia e a janela de entrega
- a forma de pagamento (e que cliente novo paga antes)
- como conservar e reaquecer

Quase toda reclamação nasce de algo que não foi combinado. Um minuto a mais aqui evita meia hora de problema depois.

## A primeira entrega é uma demonstração

Nela você prova três coisas de uma vez: que a comida é boa, que chega no horário e que você é confiável. Capriche mais que o normal — é a entrega que decide se existe a segunda.

Um bilhete escrito à mão com o nome da pessoa custa nada e é lembrado por muito tempo.

## O acompanhamento no dia seguinte

Uma mensagem, um dia depois:

> "Oi, Marina! Tudo certo com a marmita de ontem? Qualquer coisa me fala."

Simples assim. Ela faz três coisas: mostra cuidado, abre espaço para o problema aparecer enquanto é pequeno, e coloca você de volta na conversa **na hora de pedir de novo**.

> A segunda compra é a que transforma comprador em cliente. Quase sempre ela acontece porque você lembrou, não porque ele lembrou.

## Faça agora

Escreva as suas três mensagens padrão e salve como respostas rápidas no WhatsApp Business: resposta ao "quanto é", confirmação de pedido com tudo combinado, e acompanhamento do dia seguinte.

Três mensagens prontas economizam horas por mês e evitam que você esqueça de combinar algo no meio da correria.`,
  },
  {
    modulo: "atendimento-e-fidelizacao",
    slug: "plano-semanal",
    titulo: "Plano semanal: a assinatura da marmita",
    resumo:
      "Como transformar venda avulsa em receita previsível, sem sistema de assinatura.",
    conteudo: `Venda avulsa te obriga a reconquistar o cliente toda semana. Plano semanal inverte isso: o padrão passa a ser continuar, e cancelar vira a exceção. É a mudança que mais estabiliza um negócio de marmita.

## O que o plano resolve para você

- **Previsibilidade.** Você sabe quantas marmitas produzir antes de comprar.
- **Compra melhor.** Volume conhecido permite comprar mais barato.
- **Menos desperdício.** Você produz o que já está vendido.
- **Caixa antecipado.** O pagamento entra antes da produção.

E resolve para o cliente também: ele para de decidir toda semana. A decisão de comer bem vira automática, que é exatamente o que quem procura marmita quer.

## Como montar

Três tamanhos bastam:

- **Plano 5** — 5 marmitas por semana, almoço de segunda a sexta
- **Plano 10** — 10 por semana, almoço e jantar
- **Plano 15** — duas semanas de almoço, para quem prefere pedir quinzenal

Desconto de **5% a 10%** em relação ao avulso. Não precisa ser mais: o valor do plano para o cliente é a conveniência, não o desconto.

E lembre da aula de entrega: o desconto sai da **economia de rota**, não da sua margem de produção.

## Regras que evitam problema

Deixe as três explícitas desde o começo:

1. **Pagamento antecipado**, na segunda-feira da semana.
2. **Prazo para mudar ou pausar** — até quarta. Depois disso a compra já foi feita.
3. **Pode pular semana** avisando no prazo. Rigidez demais faz o cliente cancelar em vez de pausar.

Essa terceira regra é a mais importante. Quem viaja e não pode pausar, cancela. E cliente cancelado raramente volta.

## Variedade sem complicar

Cliente de plano enjoa mais rápido, porque come mais vezes. Duas soluções que não aumentam o seu trabalho:

- **Cardápio rotativo** — os mesmos 5 pratos, em ordem diferente a cada semana.
- **Cardápio fechado com uma escolha** — você define 4 pratos e ele escolhe 1.

Não caia na armadilha de oferecer escolha total: isso multiplica a sua produção e destrói o ganho de escala.

## Quando alguém quer cancelar

Pergunte por quê, sempre. As respostas costumam ser:

- **"Está caro"** — ofereça o plano menor em vez de perder tudo.
- **"Enjoei"** — é problema de cardápio, e você acabou de ganhar informação valiosa.
- **"Vou viajar"** — ofereça pausa, não cancelamento.

> Cliente que cancela e explica vale mais que cliente que some. Pergunte sempre, mesmo quando não der para reverter.

## Faça agora

Monte os seus três planos com preço e regras escritas. Calcule cada um na [calculadora de precificação](/app/precificacao) para confirmar que o desconto cabe na margem.

Depois ofereça para os seus três melhores clientes atuais — os que já compram com frequência. São eles que aceitam primeiro, e o retorno deles ajusta as regras antes de você oferecer para todo mundo.`,
  },
  {
    modulo: "atendimento-e-fidelizacao",
    slug: "usando-feedback",
    titulo: "Como pedir e usar feedback",
    resumo:
      "Perguntar do jeito certo e transformar resposta em decisão de cardápio.",
    conteudo: `A maioria dos clientes insatisfeitos não reclama. Simplesmente para de comprar. Quando você percebe, já perdeu — e sem saber o motivo.

Feedback é o sistema que evita isso.

## Pergunte específico

"Gostou?" recebe "gostei, obrigado" e não serve para nada. Pergunta específica recebe resposta útil:

- "O tempero estava no ponto ou faltou sal?"
- "A quantidade de arroz estava boa para você?"
- "Qual dos três pratos dessa semana você repetiria?"

A última é a melhor pergunta do curso. Ela te diz o que manter no cardápio sem constranger ninguém a criticar.

## Quando perguntar

- **Depois da primeira entrega** — um dia depois, sempre.
- **Depois de prato novo** — no mesmo dia.
- **A cada dois meses**, com quem é de plano.

Não pergunte toda semana. Vira incômodo e a resposta fica automática.

## O sinal que fala mais alto

Existe um dado que não depende de ninguém responder: **o que sobra**.

Se um prato encalha duas semanas seguidas, ele já te respondeu. Não precisa de pesquisa. Tire do cardápio, mesmo que seja o seu preferido.

O contrário também vale: o prato que acaba primeiro toda semana deveria ter produção maior — e talvez preço maior.

## Separe gosto de defeito

Nem todo retorno merece mudança. Aprenda a separar:

- **"Não gosto de berinjela"** — gosto pessoal de uma pessoa. Anote na ficha dela, não mude o cardápio.
- **"O arroz veio seco"** — defeito. Se aparecer duas vezes, é processo, e precisa ser corrigido.
- **"Achei pouca comida"** — se vier de três pessoas diferentes, é gramagem, não impressão.

A regra: **um cliente é opinião, três clientes são padrão**.

## Feche o ciclo

Quando alguém sugere algo e você aplica, avise:

> "Lembra que você comentou que o frango estava seco? Mudei o ponto de cozimento. Me diz o que achou dessa semana."

Isso faz duas coisas: mostra que você escuta, e transforma o cliente em alguém que se sente parte do negócio. Cliente assim não troca por R$ 2 de diferença.

## Elogio também é material de trabalho

Peça autorização e use. Print de elogio no status vale mais que qualquer anúncio, porque vem de alguém do mesmo bairro.

> Feedback não serve para você se sentir bem. Serve para **decidir o cardápio da semana que vem**.

## Faça agora

Escolha os três clientes que mais compram e mande uma pergunta específica para cada um: qual prato eles repetiriam.

Com as respostas, compare com o que encalhou no seu estoque. Onde os dois apontarem para o mesmo prato, você tem uma decisão pronta — e ela pode ser cortar um prato do [seu cardápio](/app/receitas) e colocar outro no lugar.`,
  },
  {
    modulo: "atendimento-e-fidelizacao",
    slug: "reclamacao-sem-perder-margem",
    titulo: "Resolvendo reclamação sem perder margem",
    resumo:
      "O roteiro para transformar problema em fidelidade, sem virar refém.",
    conteudo: `Reclamação vai acontecer. Comida atrasa, tempero sai errado, marmita chega amassada. O que separa um negócio sólido de um frágil não é a ausência de problema — é o que acontece nos cinco minutos seguintes.

## O roteiro dos quatro passos

Nessa ordem, sempre:

1. **Escute sem interromper.** Deixe a pessoa terminar. Metade da irritação passa só de ser ouvida.
2. **Reconheça o fato**, sem discutir a percepção. "Entendo, o arroz não deveria estar assim."
3. **Resolva na hora**, com uma proposta concreta.
4. **Corrija o processo**, para não repetir.

O passo 4 é o que a maioria pula, e é o que transforma reclamação em melhoria.

## Não peça desculpa em excesso

Uma desculpa sincera e uma solução valem mais que cinco "mil desculpas". Desculpa demais passa a impressão de que o erro é comum.

E nunca discuta se o cliente tem razão. Mesmo quando ele não tem, discutir custa mais caro que resolver.

## A escala de solução

Nem toda reclamação merece a mesma resposta. Use a escala:

- **Problema pequeno** (tempero fraco, pouca quantidade): desconto na próxima ou um acompanhamento extra.
- **Problema médio** (prato errado, atraso grande): marmita de reposição na próxima entrega.
- **Problema grave** (comida estragada, mal-estar): devolução integral do valor, **imediata**, sem discussão.

No caso grave, além de devolver: pergunte a data de produção da marmita, verifique o seu lote e avise os outros clientes que receberam o mesmo lote se houver qualquer dúvida.

Isso não é exagero. É a diferença entre um problema e um problema de saúde pública.

## Quando o cliente abusa

Existe. Cliente que reclama toda semana, sempre pedindo desconto.

- Na primeira e na segunda vez, resolva normalmente.
- Na terceira, converse com franqueza: "percebi que várias entregas não te agradaram. Prefiro entender o que está errado a continuar entregando algo que não serve para você."

Se o padrão continuar, é legítimo encerrar a relação com educação. Cliente que dá prejuízo constante não é cliente.

> Reclamação bem resolvida **fideliza mais que entrega perfeita**. A pessoa descobre que, quando dá problema, você resolve — e isso vale mais que nunca ter dado problema.

## O custo disso na sua conta

Reserve de **2% a 3% do faturamento** para reposição e ajuste. Numa operação de R$ 3.000 por mês, são R$ 60 a R$ 90 — o preço de três ou quatro marmitas.

Tratado como custo previsto, você resolve sem hesitar. Tratado como prejuízo inesperado, você hesita — e a hesitação é o que o cliente percebe.

## Faça agora

Coloque essa reserva de 2% como custo na sua [calculadora de precificação](/app/precificacao) e veja o impacto no preço. Costuma ser menos de R$ 0,50 por marmita.

Meio real por marmita para nunca mais ter que decidir, no calor do momento, se vale a pena repor.`,
  },
  {
    modulo: "atendimento-e-fidelizacao",
    slug: "programa-de-indicacao",
    titulo: "Programa de indicação que funciona no bairro",
    resumo:
      "Como fazer o cliente satisfeito trazer o próximo, sem gastar com anúncio.",
    conteudo: `Cliente indicado é o melhor que existe: chega confiando, negocia menos, custa quase nada e costuma ficar mais tempo. Num negócio de bairro, indicação supera qualquer anúncio pago.

Mas indicação espontânea é rara. Precisa de sistema.

## Por que quase ninguém indica sozinho

Não é falta de vontade. É que a pessoa **não lembra** na hora certa, e **não sabe** que você quer indicação.

O programa resolve os dois: lembra e autoriza.

## O modelo mais simples que funciona

Recompensa para os dois lados:

> Quem indica ganha **1 marmita grátis** quando o indicado faz o primeiro pedido. Quem é indicado ganha **R$ 5 de desconto** na primeira compra.

Simples de explicar, simples de controlar, e o custo só existe quando dá certo.

## A conta que mostra por que vale

Uma marmita grátis custa a você o custo de produção — digamos R$ 12, não o preço de venda.

O cliente que ela trouxe, se comprar 5 marmitas por semana durante 6 meses, gera cerca de R$ 2.600 de faturamento.

> R$ 12 para conquistar um cliente. Nenhum anúncio no mundo chega perto disso.

## Quando pedir

O momento importa mais que a oferta. Peça:

- logo depois de um **elogio espontâneo** — é o melhor momento que existe
- ao **fechar um plano semanal**
- quando o cliente **completa um mês** comprando

Nunca peça na primeira compra. A pessoa ainda não tem opinião formada.

## Como pedir

Direto e sem rodeio:

> "Que bom que você gostou! Se conhecer alguém aqui do bairro que precisa disso, me indica? Você ganha uma marmita e a pessoa ganha R$ 5 de desconto na primeira."

Facilite ao máximo: mande uma mensagem pronta que ela possa **encaminhar**, com foto do cardápio e o seu contato. Quanto menos trabalho, mais gente indica.

## Controle sem sistema

Um caderno com três colunas basta: quem indicou, quem foi indicado, se a recompensa já saiu.

E pergunte sempre a todo cliente novo: **"como você chegou até mim?"**. Sem essa pergunta você não sabe o que está funcionando — e pode estar gastando esforço no canal errado.

## Outras formas de circular no bairro

- **Cartão dentro da sacola**, com a oferta de indicação impressa.
- **Grupos de bairro e condomínio.** Participe de verdade, não só para vender.
- **Parceria cruzada** com quem atende o mesmo cliente sem competir: personal, nutricionista, salão.

## Faça agora

Escreva a regra do seu programa numa frase e mande para os seus cinco melhores clientes esta semana.

Depois leve a experiência para o [grupo da comunidade](/app/comunidade): o que funcionou no seu bairro provavelmente funciona no de outra pessoa, e o contrário também. É a última aula da trilha — daqui em diante, quem ensina você é a prática e quem já está vendendo.`,
  },
];
