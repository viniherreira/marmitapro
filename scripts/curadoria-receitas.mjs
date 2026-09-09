/**
 * Receitas do cardápio do MarmitaPRO.
 *
 * As quantidades são em gramas e seguem o estado do ingrediente na base: carne
 * e peixe entram crus, arroz e feijão entram cozidos. Trocar isso sem trocar o
 * ingrediente correspondente estraga a ficha nutricional.
 *
 * O objetivo declarado é verificado na carga contra limites absolutos (veja
 * PROMESSAS em aplicar-receitas.mjs). Rótulo que não se sustenta na conta é
 * rótulo mentiroso, e este produto ensina justamente a fazer conta.
 */

export const RECEITAS = [
  {
    slug: "bife-acebolado-arroz-integral-vagem",
    nome: "Bife acebolado com arroz integral e vagem",
    descricao:
      "O prato feito de todo dia, montado com corte magro e arroz integral. Prova que marmita fit não precisa ser exótica para funcionar.",
    objetivo: "rica_proteina",
    porcoes: 4,
    minutos: 40,
    modoPreparo: `1. Corte o patinho em bifes finos e tempere com alho amassado e sal. Deixe descansar 15 minutos.
2. Aqueça bem a frigideira antes de colocar a carne. Panela morna cozinha o bife em vez de selar, e ele solta água.
3. Sele os bifes em fogo alto, dois de cada vez, sem amontoar. Reserve.
4. Na mesma frigideira, refogue a cebola em meia-lua até dourar nas pontas, aproveitando o fundo que a carne deixou.
5. Cozinhe a vagem no vapor por 5 minutos: ela deve continuar firme e verde.
6. Monte a marmita com o arroz integral embaixo, a vagem de um lado e o bife com cebola por cima.`,
    itens: [
      ["patinho-bovino", 600],
      ["arroz-integral-cozido", 600],
      ["vagem-cozida", 300],
      ["cebola-crua", 150],
      ["oleo-de-soja", 20],
      ["alho-cru", 10],
      ["sal-refinado", 6],
    ],
  },
  {
    slug: "escondidinho-de-frango-com-mandioca",
    nome: "Escondidinho de frango com purê de mandioca",
    descricao:
      "Rende bem, congela bem e agrada quem desconfia de comida fit. O purê de mandioca substitui a batata e segura melhor o reaquecimento.",
    objetivo: "rica_proteina",
    porcoes: 5,
    minutos: 55,
    modoPreparo: `1. Cozinhe o peito de frango em água com alho e sal até soltar em fibras. Guarde um pouco do caldo.
2. Desfie o frango ainda morno — frio ele resiste e desfia em pedaços grandes.
3. Refogue a cebola no azeite, junte o frango desfiado e o extrato de tomate. Use o caldo reservado para soltar o refogado.
4. Amasse a mandioca cozida ainda quente com o leite, até virar purê liso. Mandioca fria vira purê empelotado.
5. Monte em travessa: frango embaixo, purê por cima, muçarela ralada no topo.
6. Leve ao forno a 200 °C por 20 minutos, até corar.
7. Espere amornar antes de porcionar. Quente, o purê desmancha e a marmita fica com cara de sobra.`,
    itens: [
      ["peito-de-frango-cru", 700],
      ["mandioca-cozida", 800],
      ["cebola-crua", 120],
      ["leite-desnatado", 150],
      ["queijo-mucarela", 100],
      ["extrato-de-tomate", 80],
      ["azeite-extravirgem", 20],
      ["alho-cru", 10],
      ["cheiro-verde", 20],
      ["sal-refinado", 6],
    ],
  },
  {
    slug: "cacao-em-posta-com-cuscuz",
    nome: "Cação em posta com cuscuz e vinagrete morno",
    descricao:
      "Peixe de preço honesto, sem espinha e que aguenta o reaquecimento sem esfarelar. O cuscuz entra no lugar do arroz e muda o cardápio da semana.",
    objetivo: "rica_proteina",
    porcoes: 4,
    minutos: 35,
    modoPreparo: `1. Tempere as postas de cação com limão, alho e sal. Deixe 20 minutos — mais que isso o limão começa a cozinhar o peixe.
2. Hidrate o cuscuz conforme a embalagem e cozinhe no vapor até soltar.
3. Sele as postas em frigideira quente com pouco azeite, 3 minutos de cada lado. Vire uma vez só.
4. Corte tomate, cebola e pimentão em cubos pequenos e refogue rapidamente no azeite que sobrou — o vinagrete morno rende mais que o cru na marmita.
5. Monte com o cuscuz de base, a posta por cima e o vinagrete ao redor.`,
    itens: [
      ["posta-de-cacao", 600],
      ["cuscuz-de-milho", 500],
      ["tomate-cru", 200],
      ["cebola-crua", 120],
      ["pimentao-verde", 100],
      ["limao-tahiti", 40],
      ["azeite-extravirgem", 20],
      ["cheiro-verde", 20],
      ["sal-refinado", 6],
    ],
  },
  {
    slug: "almondegas-ao-sugo-com-macarrao-integral",
    nome: "Almôndegas ao sugo com macarrão integral",
    descricao:
      "A marmita que vende para quem não quer saber de dieta. Massa integral e almôndega assada em vez de frita seguram a conta sem denunciar.",
    objetivo: "rica_proteina",
    porcoes: 4,
    minutos: 50,
    modoPreparo: `1. Misture a carne moída, o ovo, a farinha de rosca, metade da cebola bem picada e o alho. Tempere com sal.
2. Sove a mistura por dois minutos: é isso que faz a almôndega não desmanchar no molho.
3. Modele bolinhas de cerca de 30 g e asse a 200 °C por 15 minutos, em vez de fritar.
4. Refogue o restante da cebola no azeite, junte o molho de tomate e cozinhe em fogo baixo por 10 minutos.
5. Passe as almôndegas assadas para o molho e deixe apurar mais 5 minutos.
6. Cozinha a massa al dente — ela continua cozinhando no reaquecimento da marmita.
7. Finalize com manjericão fora do fogo.`,
    itens: [
      ["carne-moida-acem", 600],
      ["macarrao-integral-cozido", 600],
      ["molho-de-tomate-pronto", 400],
      ["cebola-crua", 100],
      ["farinha-de-rosca", 60],
      ["ovo-de-galinha", 50],
      ["azeite-extravirgem", 20],
      ["alho-cru", 10],
      ["manjericao-cru", 10],
      ["sal-refinado", 6],
    ],
  },
  {
    slug: "merluza-com-crosta-de-castanha",
    nome: "Merluza ao forno com crosta de castanha",
    descricao:
      "Prato de cardápio caro feito com peixe barato. A crosta de castanha-do-pará dá textura e justifica um preço acima da média.",
    objetivo: "rica_proteina",
    porcoes: 4,
    minutos: 40,
    modoPreparo: `1. Tempere os filés de merluza com limão, alho e sal.
2. Triture a castanha-do-pará junto com a farinha de rosca até virar farofa grossa. Não bata demais: passar do ponto solta o óleo e a crosta empapa.
3. Misture metade do azeite na farofa, para ela dourar sem ressecar.
4. Disponha os filés numa assadeira, cubra com a farofa e pressione de leve.
5. Asse a 200 °C por 15 a 18 minutos. Peixe passa do ponto rápido: quando a carne solta em lascas, está pronto.
6. Sirva com a batata-doce em rodelas e o brócolis no vapor.`,
    itens: [
      ["file-de-merluza", 640],
      ["batata-doce-cozida", 500],
      ["brocolis-cozido", 300],
      ["castanha-do-para", 60],
      ["farinha-de-rosca", 40],
      ["limao-tahiti", 30],
      ["azeite-extravirgem", 20],
      ["alho-cru", 8],
      ["sal-refinado", 5],
    ],
  },
  {
    slug: "camarao-na-moranga",
    nome: "Camarão na moranga cremoso",
    descricao:
      "A marmita de fim de semana, que sai por um preço mais alto e ainda assim vende. Cremosidade vem do requeijão light, não de creme de leite.",
    objetivo: "low_carb",
    porcoes: 3,
    minutos: 50,
    modoPreparo: `1. Corte a moranga em cubos e cozinhe no vapor até ficar macia, sem deixar encharcar.
2. Amasse metade da moranga e reserve a outra metade em pedaços — o contraste de textura é o que faz o prato.
3. Refogue cebola e alho no azeite, junte o tomate picado e cozinhe até desmanchar.
4. Acrescente o camarão e cozinhe por 3 minutos, não mais. Camarão passado vira borracha e não tem volta.
5. Desligue o fogo e incorpore o requeijão fora da chama, para não talhar.
6. Junte a moranga, ajuste o sal e finalize com cheiro-verde.`,
    itens: [
      ["camarao-cru", 450],
      ["abobora-moranga-crua", 900],
      ["requeijao-light", 120],
      ["tomate-cru", 150],
      ["cebola-crua", 100],
      ["azeite-extravirgem", 15],
      ["alho-cru", 8],
      ["cheiro-verde", 15],
      ["sal-refinado", 5],
    ],
  },
  {
    slug: "frango-com-quiabo-e-pure-de-couve-flor",
    nome: "Frango com quiabo e purê de couve-flor",
    descricao:
      "Sabor mineiro numa versão sem arroz. O purê de couve-flor engana bem e corta quase todo o carboidrato do prato.",
    objetivo: "low_carb",
    porcoes: 4,
    minutos: 45,
    modoPreparo: `1. Corte o quiabo em rodelas grossas e refogue sozinho, em fogo alto, sem mexer muito, até secar a baba. Esse passo vem antes de tudo.
2. Tempere a coxa de frango com alho e sal e doure na panela até pegar cor.
3. Junte a cebola, deixe murchar e acrescente um pouco de água. Cozinhe tampado por 20 minutos.
4. Devolva o quiabo à panela só nos últimos 5 minutos, para ele não desmanchar.
5. Cozinhe a couve-flor no vapor e bata com o requeijão até virar purê. Vapor, não água fervente: couve-flor cozida em água vira purê aguado.
6. Monte com o purê embaixo e o frango com quiabo por cima.`,
    itens: [
      ["coxa-de-frango-crua", 700],
      ["couve-flor-cozida", 600],
      ["quiabo-cru", 400],
      ["cebola-crua", 100],
      ["requeijao-light", 80],
      ["azeite-extravirgem", 20],
      ["alho-cru", 10],
      ["cheiro-verde", 15],
      ["sal-refinado", 6],
    ],
  },
  {
    slug: "carne-salteada-com-brocolis-e-champignon",
    nome: "Carne salteada com brócolis e champignon",
    descricao:
      "Salteado rápido, de panela quente. Fica pronto em 20 minutos de fogo e é a low carb que mais volta pedido de quem treina.",
    objetivo: "low_carb",
    porcoes: 4,
    minutos: 30,
    modoPreparo: `1. Corte o coxão mole em tiras finas, no sentido contrário às fibras. Cortar a favor da fibra deixa a carne dura por mais macia que ela seja.
2. Tempere com alho e sal e deixe descansar enquanto prepara os legumes.
3. Aqueça a panela até quase fumegar. Salteado feito em panela morna solta água e cozinha.
4. Salteie a carne em duas levas, 2 minutos cada. Reserve.
5. Na mesma panela, salteie o pimentão e a cebola por 2 minutos, junte o brócolis e o champignon escorrido.
6. Devolva a carne, misture rápido, desligue e finalize com gergelim.`,
    itens: [
      ["coxao-mole", 600],
      ["brocolis-cozido", 400],
      ["champignon-conserva", 200],
      ["pimentao-vermelho", 150],
      ["cebola-crua", 100],
      ["azeite-extravirgem", 25],
      ["gergelim", 10],
      ["alho-cru", 10],
      ["sal-refinado", 5],
    ],
  },
  {
    slug: "torta-de-frango-sem-massa",
    nome: "Torta de frango sem massa",
    descricao:
      "Estrutura de ovo e ricota no lugar da massa. Corta o carboidrato, segura a fatia inteira e não desmancha na marmita.",
    objetivo: "low_carb",
    porcoes: 4,
    minutos: 50,
    modoPreparo: `1. Cozinhe e desfie o peito de frango.
2. Refogue cebola, alho e tomate no azeite até secar o líquido. Recheio úmido faz a torta não firmar.
3. Junte o frango desfiado ao refogado e deixe esfriar.
4. Bata os ovos com a ricota até ficar homogêneo — essa mistura é o que substitui a massa.
5. Misture a couve-flor cozida e bem escorrida ao creme de ovos.
6. Junte o recheio, despeje em forma untada e cubra com a muçarela.
7. Asse a 180 °C por 30 minutos. Espere esfriar completamente antes de cortar: quente, ela racha.`,
    itens: [
      ["peito-de-frango-cru", 500],
      ["couve-flor-cozida", 400],
      ["ovo-de-galinha", 200],
      ["queijo-ricota", 200],
      ["tomate-cru", 150],
      ["cebola-crua", 100],
      ["queijo-mucarela", 80],
      ["azeite-extravirgem", 15],
      ["cheiro-verde", 10],
      ["alho-cru", 8],
      ["sal-refinado", 5],
    ],
  },
  {
    slug: "abobrinha-recheada-com-carne-moida",
    nome: "Abobrinha recheada com carne moída",
    descricao:
      "A abobrinha vira a embalagem do recheio. Custa pouco, apresenta bem na foto e é das low carb mais fáceis de produzir em escala.",
    objetivo: "low_carb",
    porcoes: 4,
    minutos: 45,
    modoPreparo: `1. Corte as abobrinhas ao meio no comprimento e retire o miolo com uma colher. Guarde o miolo picado.
2. Salgue as metades e deixe escorrer 10 minutos com o corte para baixo. Isso tira água e evita a abobrinha soltar caldo no forno.
3. Refogue cebola e alho, junte a carne moída e deixe dourar de verdade, sem mexer o tempo todo.
4. Acrescente o tomate e o miolo picado, cozinhe até secar.
5. Recheie as metades, cubra com muçarela e asse a 200 °C por 20 minutos.
6. Finalize com manjericão fresco depois de tirar do forno.`,
    itens: [
      ["abobrinha-crua", 900],
      ["carne-moida-acem", 500],
      ["tomate-cru", 200],
      ["cebola-crua", 100],
      ["queijo-mucarela", 80],
      ["azeite-extravirgem", 20],
      ["alho-cru", 10],
      ["manjericao-cru", 10],
      ["sal-refinado", 5],
    ],
  },
  {
    slug: "sardinha-assada-com-salada-morna",
    nome: "Sardinha assada com salada morna de legumes",
    descricao:
      "A proteína mais barata por grama do cardápio. Assada com limão, perde o cheiro forte que costuma afastar o cliente.",
    objetivo: "economica",
    porcoes: 4,
    minutos: 40,
    modoPreparo: `1. Limpe as sardinhas e tempere com limão, alho e sal. Deixe 20 minutos.
2. Asse a 220 °C por 15 minutos, viradas uma única vez. Forno alto é o que garante a pele crocante.
3. Cozinhe batata, cenoura e vagem no vapor, cada uma no seu tempo — juntas, a vagem vira papa antes da batata amolecer.
4. Enquanto os legumes estão quentes, tempere com azeite, cebola crua fatiada fina e salsa. Legume morno absorve tempero; frio, não.
5. Monte a marmita com a salada de base e a sardinha inteira por cima.`,
    itens: [
      ["sardinha-fresca", 600],
      ["batata-inglesa-cozida", 500],
      ["vagem-cozida", 250],
      ["cenoura-cozida", 200],
      ["cebola-crua", 100],
      ["limao-tahiti", 40],
      ["azeite-extravirgem", 20],
      ["salsa-crua", 10],
      ["alho-cru", 8],
      ["sal-refinado", 6],
    ],
  },
  {
    slug: "figado-acebolado-com-arroz-e-couve",
    nome: "Fígado acebolado com arroz e couve",
    descricao:
      "Um dos pratos de melhor custo por grama de proteína que existe. Bem feito, sai da fama de comida de escola e vende.",
    objetivo: "economica",
    porcoes: 4,
    minutos: 35,
    modoPreparo: `1. Corte o fígado em tiras e deixe de molho no leite por 20 minutos. Esse passo tira o amargor e é o que separa o prato bom do ruim.
2. Escorra, seque bem e tempere com alho e sal na hora de ir para a panela — sal antes desidrata e endurece.
3. Sele em fogo alto por 2 minutos de cada lado. Fígado passado fica duro e arenoso.
4. Retire, refogue a cebola no mesmo óleo até dourar e devolva o fígado só para misturar.
5. Corte a couve em tiras finíssimas e refogue por 1 minuto, apenas para murchar mantendo o verde.
6. Sirva com arroz branco.`,
    itens: [
      ["figado-bovino", 600],
      ["arroz-branco-cozido", 600],
      ["cebola-crua", 250],
      ["couve-manteiga-crua", 200],
      ["oleo-de-soja", 25],
      ["alho-cru", 10],
      ["sal-refinado", 6],
    ],
  },
  {
    slug: "ovos-mexidos-com-polenta-cremosa",
    nome: "Ovos mexidos com polenta cremosa ao sugo",
    descricao:
      "Marmita sem carne que ainda assim sustenta. Custa pouco, é rápida de produzir e resolve o pedido de quem não come carne todo dia.",
    objetivo: "economica",
    porcoes: 4,
    minutos: 30,
    modoPreparo: `1. Prepare a polenta conforme a embalagem, mexendo sempre, e deixe mais mole que o normal — ela firma ao esfriar.
2. Aqueça o molho de tomate com a cebola refogada por 10 minutos, em fogo baixo.
3. Bata os ovos com uma pitada de sal. Não bata demais: ovo muito batido fica esponjoso em vez de cremoso.
4. Cozinhe os ovos em fogo baixo, mexendo devagar, e tire do fogo ainda um pouco úmidos. O calor residual termina o cozimento.
5. Monte com a polenta embaixo, o molho no meio e os ovos por cima.
6. Finalize com a muçarela ralada e cheiro-verde.`,
    itens: [
      ["polenta-pronta", 700],
      ["ovo-de-galinha", 400],
      ["molho-de-tomate-pronto", 250],
      ["cebola-crua", 100],
      ["queijo-mucarela", 60],
      ["oleo-de-soja", 15],
      ["cheiro-verde", 10],
      ["sal-refinado", 5],
    ],
  },
  {
    slug: "baiao-de-dois-com-frango",
    nome: "Baião de dois com frango",
    descricao:
      "Adaptação do baião nordestino trocando a carne-seca por sobrecoxa: menos sódio, custo parecido e o mesmo sabor de comida de casa.",
    objetivo: "economica",
    porcoes: 5,
    minutos: 50,
    modoPreparo: `1. Tempere a sobrecoxa com alho e sal e doure bem na própria gordura, sem pressa.
2. Retire o frango, desfie grosso e reserve. O fundo dourado que ficou na panela é o tempero do prato.
3. Refogue a cebola nesse fundo, raspando com a colher.
4. Junte o feijão-fradinho já cozido e escorrido e deixe pegar o gosto do refogado por 5 minutos.
5. Misture o arroz e o frango desfiado, mexendo de baixo para cima para não empapar.
6. Desligue, junte o queijo em cubos e o cheiro-verde. O queijo entra no fim, só para amolecer.`,
    itens: [
      ["arroz-branco-cozido", 700],
      ["feijao-fradinho-cozido", 500],
      ["sobrecoxa-de-frango-crua", 500],
      ["queijo-minas-frescal", 100],
      ["cebola-crua", 100],
      ["oleo-de-soja", 20],
      ["cheiro-verde", 15],
      ["alho-cru", 10],
      ["sal-refinado", 6],
    ],
  },
  {
    slug: "frango-ensopado-com-batata-e-cenoura",
    nome: "Frango ensopado com batata e cenoura",
    descricao:
      "A marmita de menor custo por porção do cardápio. Panela única, ingrediente de feira e sabor que todo mundo reconhece.",
    objetivo: "economica",
    porcoes: 5,
    minutos: 45,
    modoPreparo: `1. Doure a coxa de frango temperada com alho e sal, em panela larga, sem tampar.
2. Junte a cebola e deixe murchar; acrescente o tomate picado e o extrato e cozinhe até formar um molho encorpado.
3. Cubra com água quente — água fria interrompe o cozimento e endurece a carne.
4. Cozinhe tampado por 20 minutos.
5. Acrescente batata e cenoura em pedaços grandes e cozinhe mais 15 minutos, sem mexer muito, para não desmanchar.
6. Ajuste o sal no final: o caldo reduz e concentra o tempero.
7. Finalize com cheiro-verde.`,
    itens: [
      ["coxa-de-frango-crua", 800],
      ["batata-inglesa-cozida", 600],
      ["cenoura-cozida", 300],
      ["tomate-cru", 250],
      ["cebola-crua", 150],
      ["extrato-de-tomate", 60],
      ["oleo-de-soja", 20],
      ["cheiro-verde", 15],
      ["alho-cru", 12],
      ["sal-refinado", 6],
    ],
  },
  {
    slug: "cuscuz-nordestino-com-ovo-e-queijo",
    nome: "Cuscuz nordestino com ovo e queijo",
    descricao:
      "Sai em meia hora, custa pouco e resolve o pedido de janta leve. Boa porta de entrada para quem está montando o primeiro cardápio.",
    objetivo: "economica",
    porcoes: 3,
    minutos: 25,
    modoPreparo: `1. Hidrate a farinha de cuscuz com água morna e sal, misturando com as mãos até ficar como areia úmida. Descanse 10 minutos.
2. Cozinhe na cuscuzeira por 8 minutos. Passar disso resseca e ele vira farofa.
3. Enquanto isso, refogue a cebola e o tomate na manteiga.
4. Faça os ovos mexidos em fogo baixo, tirando do fogo ainda cremosos.
5. Solte o cuscuz com um garfo, misture o refogado e cubra com o queijo em cubos e os ovos.
6. Sirva imediatamente ou porcione ainda morno — cuscuz frio resseca e não volta.`,
    itens: [
      ["cuscuz-de-milho", 450],
      ["ovo-de-galinha", 200],
      ["queijo-minas-frescal", 120],
      ["tomate-cru", 120],
      ["cebola-crua", 60],
      ["manteiga-sem-sal", 20],
      ["cheiro-verde", 10],
      ["sal-refinado", 4],
    ],
  },
];

/**
 * Correções em receitas da primeira versão do cardápio, cujo rótulo a ficha
 * não sustentava. Ficam aqui, com o motivo escrito, em vez de sumirem numa
 * edição direta no banco — daqui a seis meses ninguém lembra por que a carne
 * mudou de corte.
 *
 *   trocas:  [slug antigo, slug novo, gramas]
 *   ajustes: [slug, gramas]
 */
export const CORRECOES = [
  {
    slug: "carne-moida-com-abobrinha-e-arroz",
    porque:
      "Receita de carne moída usava patinho, o corte mais caro da base. " +
      "Ninguém mói patinho para marmita econômica: o acém moído faz o mesmo " +
      "prato e derruba a porção de R$ 8,18 para dentro do que o rótulo promete.",
    trocas: [["patinho-bovino", "carne-moida-acem", 450]],
  },
  {
    slug: "panqueca-de-carne-com-molho",
    porque:
      "Mesmo problema: recheio de panqueca com patinho. Trocado por acém " +
      "moído, que é o corte que se usa de verdade nesse recheio, em quantidade " +
      "que devolve a porção para dentro do teto do rótulo.",
    trocas: [["patinho-bovino", "carne-moida-acem", 420]],
  },
  {
    slug: "peito-de-peru-com-quinoa",
    porque:
      "Usava peito de peru defumado fatiado — frio de padaria, com 980 mg de " +
      "sódio por 100 g e pouca proteína para o preço. Numa marmita quente ele " +
      "não faz sentido. Trocado por peito de peru cru, com mais carne e menos " +
      "quinoa: a porção sai de 24,7 g para acima de 30 g de proteína e o sódio cai.",
    trocas: [["peito-de-peru-defumado", "peito-de-peru-cru", 450]],
    ajustes: [["quinoa-cozida", 300]],
  },
];
