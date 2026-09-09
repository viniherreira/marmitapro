-- ---------------------------------------------------------------------------
-- MarmitaPRO — cardápio ampliado
-- ---------------------------------------------------------------------------
-- GERADO por scripts/gerar-receitas.mjs. Não edite à mão: ajuste
-- scripts/curadoria-receitas.mjs e rode o script de novo.
--
-- Depende da migração de ingredientes: as receitas resolvem os ingredientes
-- por slug, e slug que não existir faz a inserção do vínculo não acontecer.
-- ---------------------------------------------------------------------------

insert into public.recipes
  (slug, nome, descricao, objetivo, modo_preparo, rendimento_porcoes,
   tempo_preparo_minutos, publica)
values
  ('bife-acebolado-arroz-integral-vagem', 'Bife acebolado com arroz integral e vagem', 'O prato feito de todo dia, montado com corte magro e arroz integral. Prova que marmita fit não precisa ser exótica para funcionar.', 'rica_proteina'::public.objetivo_receita, '1. Corte o patinho em bifes finos e tempere com alho amassado e sal. Deixe descansar 15 minutos.
2. Aqueça bem a frigideira antes de colocar a carne. Panela morna cozinha o bife em vez de selar, e ele solta água.
3. Sele os bifes em fogo alto, dois de cada vez, sem amontoar. Reserve.
4. Na mesma frigideira, refogue a cebola em meia-lua até dourar nas pontas, aproveitando o fundo que a carne deixou.
5. Cozinhe a vagem no vapor por 5 minutos: ela deve continuar firme e verde.
6. Monte a marmita com o arroz integral embaixo, a vagem de um lado e o bife com cebola por cima.', 4, 40, true),
  ('escondidinho-de-frango-com-mandioca', 'Escondidinho de frango com purê de mandioca', 'Rende bem, congela bem e agrada quem desconfia de comida fit. O purê de mandioca substitui a batata e segura melhor o reaquecimento.', 'rica_proteina'::public.objetivo_receita, '1. Cozinhe o peito de frango em água com alho e sal até soltar em fibras. Guarde um pouco do caldo.
2. Desfie o frango ainda morno — frio ele resiste e desfia em pedaços grandes.
3. Refogue a cebola no azeite, junte o frango desfiado e o extrato de tomate. Use o caldo reservado para soltar o refogado.
4. Amasse a mandioca cozida ainda quente com o leite, até virar purê liso. Mandioca fria vira purê empelotado.
5. Monte em travessa: frango embaixo, purê por cima, muçarela ralada no topo.
6. Leve ao forno a 200 °C por 20 minutos, até corar.
7. Espere amornar antes de porcionar. Quente, o purê desmancha e a marmita fica com cara de sobra.', 5, 55, true),
  ('cacao-em-posta-com-cuscuz', 'Cação em posta com cuscuz e vinagrete morno', 'Peixe de preço honesto, sem espinha e que aguenta o reaquecimento sem esfarelar. O cuscuz entra no lugar do arroz e muda o cardápio da semana.', 'rica_proteina'::public.objetivo_receita, '1. Tempere as postas de cação com limão, alho e sal. Deixe 20 minutos — mais que isso o limão começa a cozinhar o peixe.
2. Hidrate o cuscuz conforme a embalagem e cozinhe no vapor até soltar.
3. Sele as postas em frigideira quente com pouco azeite, 3 minutos de cada lado. Vire uma vez só.
4. Corte tomate, cebola e pimentão em cubos pequenos e refogue rapidamente no azeite que sobrou — o vinagrete morno rende mais que o cru na marmita.
5. Monte com o cuscuz de base, a posta por cima e o vinagrete ao redor.', 4, 35, true),
  ('almondegas-ao-sugo-com-macarrao-integral', 'Almôndegas ao sugo com macarrão integral', 'A marmita que vende para quem não quer saber de dieta. Massa integral e almôndega assada em vez de frita seguram a conta sem denunciar.', 'rica_proteina'::public.objetivo_receita, '1. Misture a carne moída, o ovo, a farinha de rosca, metade da cebola bem picada e o alho. Tempere com sal.
2. Sove a mistura por dois minutos: é isso que faz a almôndega não desmanchar no molho.
3. Modele bolinhas de cerca de 30 g e asse a 200 °C por 15 minutos, em vez de fritar.
4. Refogue o restante da cebola no azeite, junte o molho de tomate e cozinhe em fogo baixo por 10 minutos.
5. Passe as almôndegas assadas para o molho e deixe apurar mais 5 minutos.
6. Cozinha a massa al dente — ela continua cozinhando no reaquecimento da marmita.
7. Finalize com manjericão fora do fogo.', 4, 50, true),
  ('merluza-com-crosta-de-castanha', 'Merluza ao forno com crosta de castanha', 'Prato de cardápio caro feito com peixe barato. A crosta de castanha-do-pará dá textura e justifica um preço acima da média.', 'rica_proteina'::public.objetivo_receita, '1. Tempere os filés de merluza com limão, alho e sal.
2. Triture a castanha-do-pará junto com a farinha de rosca até virar farofa grossa. Não bata demais: passar do ponto solta o óleo e a crosta empapa.
3. Misture metade do azeite na farofa, para ela dourar sem ressecar.
4. Disponha os filés numa assadeira, cubra com a farofa e pressione de leve.
5. Asse a 200 °C por 15 a 18 minutos. Peixe passa do ponto rápido: quando a carne solta em lascas, está pronto.
6. Sirva com a batata-doce em rodelas e o brócolis no vapor.', 4, 40, true),
  ('camarao-na-moranga', 'Camarão na moranga cremoso', 'A marmita de fim de semana, que sai por um preço mais alto e ainda assim vende. Cremosidade vem do requeijão light, não de creme de leite.', 'low_carb'::public.objetivo_receita, '1. Corte a moranga em cubos e cozinhe no vapor até ficar macia, sem deixar encharcar.
2. Amasse metade da moranga e reserve a outra metade em pedaços — o contraste de textura é o que faz o prato.
3. Refogue cebola e alho no azeite, junte o tomate picado e cozinhe até desmanchar.
4. Acrescente o camarão e cozinhe por 3 minutos, não mais. Camarão passado vira borracha e não tem volta.
5. Desligue o fogo e incorpore o requeijão fora da chama, para não talhar.
6. Junte a moranga, ajuste o sal e finalize com cheiro-verde.', 3, 50, true),
  ('frango-com-quiabo-e-pure-de-couve-flor', 'Frango com quiabo e purê de couve-flor', 'Sabor mineiro numa versão sem arroz. O purê de couve-flor engana bem e corta quase todo o carboidrato do prato.', 'low_carb'::public.objetivo_receita, '1. Corte o quiabo em rodelas grossas e refogue sozinho, em fogo alto, sem mexer muito, até secar a baba. Esse passo vem antes de tudo.
2. Tempere a coxa de frango com alho e sal e doure na panela até pegar cor.
3. Junte a cebola, deixe murchar e acrescente um pouco de água. Cozinhe tampado por 20 minutos.
4. Devolva o quiabo à panela só nos últimos 5 minutos, para ele não desmanchar.
5. Cozinhe a couve-flor no vapor e bata com o requeijão até virar purê. Vapor, não água fervente: couve-flor cozida em água vira purê aguado.
6. Monte com o purê embaixo e o frango com quiabo por cima.', 4, 45, true),
  ('carne-salteada-com-brocolis-e-champignon', 'Carne salteada com brócolis e champignon', 'Salteado rápido, de panela quente. Fica pronto em 20 minutos de fogo e é a low carb que mais volta pedido de quem treina.', 'low_carb'::public.objetivo_receita, '1. Corte o coxão mole em tiras finas, no sentido contrário às fibras. Cortar a favor da fibra deixa a carne dura por mais macia que ela seja.
2. Tempere com alho e sal e deixe descansar enquanto prepara os legumes.
3. Aqueça a panela até quase fumegar. Salteado feito em panela morna solta água e cozinha.
4. Salteie a carne em duas levas, 2 minutos cada. Reserve.
5. Na mesma panela, salteie o pimentão e a cebola por 2 minutos, junte o brócolis e o champignon escorrido.
6. Devolva a carne, misture rápido, desligue e finalize com gergelim.', 4, 30, true),
  ('torta-de-frango-sem-massa', 'Torta de frango sem massa', 'Estrutura de ovo e ricota no lugar da massa. Corta o carboidrato, segura a fatia inteira e não desmancha na marmita.', 'low_carb'::public.objetivo_receita, '1. Cozinhe e desfie o peito de frango.
2. Refogue cebola, alho e tomate no azeite até secar o líquido. Recheio úmido faz a torta não firmar.
3. Junte o frango desfiado ao refogado e deixe esfriar.
4. Bata os ovos com a ricota até ficar homogêneo — essa mistura é o que substitui a massa.
5. Misture a couve-flor cozida e bem escorrida ao creme de ovos.
6. Junte o recheio, despeje em forma untada e cubra com a muçarela.
7. Asse a 180 °C por 30 minutos. Espere esfriar completamente antes de cortar: quente, ela racha.', 4, 50, true),
  ('abobrinha-recheada-com-carne-moida', 'Abobrinha recheada com carne moída', 'A abobrinha vira a embalagem do recheio. Custa pouco, apresenta bem na foto e é das low carb mais fáceis de produzir em escala.', 'low_carb'::public.objetivo_receita, '1. Corte as abobrinhas ao meio no comprimento e retire o miolo com uma colher. Guarde o miolo picado.
2. Salgue as metades e deixe escorrer 10 minutos com o corte para baixo. Isso tira água e evita a abobrinha soltar caldo no forno.
3. Refogue cebola e alho, junte a carne moída e deixe dourar de verdade, sem mexer o tempo todo.
4. Acrescente o tomate e o miolo picado, cozinhe até secar.
5. Recheie as metades, cubra com muçarela e asse a 200 °C por 20 minutos.
6. Finalize com manjericão fresco depois de tirar do forno.', 4, 45, true),
  ('sardinha-assada-com-salada-morna', 'Sardinha assada com salada morna de legumes', 'A proteína mais barata por grama do cardápio. Assada com limão, perde o cheiro forte que costuma afastar o cliente.', 'economica'::public.objetivo_receita, '1. Limpe as sardinhas e tempere com limão, alho e sal. Deixe 20 minutos.
2. Asse a 220 °C por 15 minutos, viradas uma única vez. Forno alto é o que garante a pele crocante.
3. Cozinhe batata, cenoura e vagem no vapor, cada uma no seu tempo — juntas, a vagem vira papa antes da batata amolecer.
4. Enquanto os legumes estão quentes, tempere com azeite, cebola crua fatiada fina e salsa. Legume morno absorve tempero; frio, não.
5. Monte a marmita com a salada de base e a sardinha inteira por cima.', 4, 40, true),
  ('figado-acebolado-com-arroz-e-couve', 'Fígado acebolado com arroz e couve', 'Um dos pratos de melhor custo por grama de proteína que existe. Bem feito, sai da fama de comida de escola e vende.', 'economica'::public.objetivo_receita, '1. Corte o fígado em tiras e deixe de molho no leite por 20 minutos. Esse passo tira o amargor e é o que separa o prato bom do ruim.
2. Escorra, seque bem e tempere com alho e sal na hora de ir para a panela — sal antes desidrata e endurece.
3. Sele em fogo alto por 2 minutos de cada lado. Fígado passado fica duro e arenoso.
4. Retire, refogue a cebola no mesmo óleo até dourar e devolva o fígado só para misturar.
5. Corte a couve em tiras finíssimas e refogue por 1 minuto, apenas para murchar mantendo o verde.
6. Sirva com arroz branco.', 4, 35, true),
  ('ovos-mexidos-com-polenta-cremosa', 'Ovos mexidos com polenta cremosa ao sugo', 'Marmita sem carne que ainda assim sustenta. Custa pouco, é rápida de produzir e resolve o pedido de quem não come carne todo dia.', 'economica'::public.objetivo_receita, '1. Prepare a polenta conforme a embalagem, mexendo sempre, e deixe mais mole que o normal — ela firma ao esfriar.
2. Aqueça o molho de tomate com a cebola refogada por 10 minutos, em fogo baixo.
3. Bata os ovos com uma pitada de sal. Não bata demais: ovo muito batido fica esponjoso em vez de cremoso.
4. Cozinhe os ovos em fogo baixo, mexendo devagar, e tire do fogo ainda um pouco úmidos. O calor residual termina o cozimento.
5. Monte com a polenta embaixo, o molho no meio e os ovos por cima.
6. Finalize com a muçarela ralada e cheiro-verde.', 4, 30, true),
  ('baiao-de-dois-com-frango', 'Baião de dois com frango', 'Adaptação do baião nordestino trocando a carne-seca por sobrecoxa: menos sódio, custo parecido e o mesmo sabor de comida de casa.', 'economica'::public.objetivo_receita, '1. Tempere a sobrecoxa com alho e sal e doure bem na própria gordura, sem pressa.
2. Retire o frango, desfie grosso e reserve. O fundo dourado que ficou na panela é o tempero do prato.
3. Refogue a cebola nesse fundo, raspando com a colher.
4. Junte o feijão-fradinho já cozido e escorrido e deixe pegar o gosto do refogado por 5 minutos.
5. Misture o arroz e o frango desfiado, mexendo de baixo para cima para não empapar.
6. Desligue, junte o queijo em cubos e o cheiro-verde. O queijo entra no fim, só para amolecer.', 5, 50, true),
  ('frango-ensopado-com-batata-e-cenoura', 'Frango ensopado com batata e cenoura', 'A marmita de menor custo por porção do cardápio. Panela única, ingrediente de feira e sabor que todo mundo reconhece.', 'economica'::public.objetivo_receita, '1. Doure a coxa de frango temperada com alho e sal, em panela larga, sem tampar.
2. Junte a cebola e deixe murchar; acrescente o tomate picado e o extrato e cozinhe até formar um molho encorpado.
3. Cubra com água quente — água fria interrompe o cozimento e endurece a carne.
4. Cozinhe tampado por 20 minutos.
5. Acrescente batata e cenoura em pedaços grandes e cozinhe mais 15 minutos, sem mexer muito, para não desmanchar.
6. Ajuste o sal no final: o caldo reduz e concentra o tempero.
7. Finalize com cheiro-verde.', 5, 45, true),
  ('cuscuz-nordestino-com-ovo-e-queijo', 'Cuscuz nordestino com ovo e queijo', 'Sai em meia hora, custa pouco e resolve o pedido de janta leve. Boa porta de entrada para quem está montando o primeiro cardápio.', 'economica'::public.objetivo_receita, '1. Hidrate a farinha de cuscuz com água morna e sal, misturando com as mãos até ficar como areia úmida. Descanse 10 minutos.
2. Cozinhe na cuscuzeira por 8 minutos. Passar disso resseca e ele vira farofa.
3. Enquanto isso, refogue a cebola e o tomate na manteiga.
4. Faça os ovos mexidos em fogo baixo, tirando do fogo ainda cremosos.
5. Solte o cuscuz com um garfo, misture o refogado e cubra com o queijo em cubos e os ovos.
6. Sirva imediatamente ou porcione ainda morno — cuscuz frio resseca e não volta.', 3, 25, true)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  objetivo = excluded.objetivo,
  modo_preparo = excluded.modo_preparo,
  rendimento_porcoes = excluded.rendimento_porcoes,
  tempo_preparo_minutos = excluded.tempo_preparo_minutos,
  publica = excluded.publica;

-- A lista de ingredientes é substituída inteira. Editar item a item deixaria
-- sobra de uma versão anterior, e a ficha sairia com ingrediente fantasma.
delete from public.recipe_ingredients ri
using public.recipes r
where ri.recipe_id = r.id
  and r.slug in ('bife-acebolado-arroz-integral-vagem', 'escondidinho-de-frango-com-mandioca', 'cacao-em-posta-com-cuscuz', 'almondegas-ao-sugo-com-macarrao-integral', 'merluza-com-crosta-de-castanha', 'camarao-na-moranga', 'frango-com-quiabo-e-pure-de-couve-flor', 'carne-salteada-com-brocolis-e-champignon', 'torta-de-frango-sem-massa', 'abobrinha-recheada-com-carne-moida', 'sardinha-assada-com-salada-morna', 'figado-acebolado-com-arroz-e-couve', 'ovos-mexidos-com-polenta-cremosa', 'baiao-de-dois-com-frango', 'frango-ensopado-com-batata-e-cenoura', 'cuscuz-nordestino-com-ovo-e-queijo');

insert into public.recipe_ingredients (recipe_id, ingredient_id, quantidade_g, ordem)
select r.id, i.id, v.gramas, v.ordem
from (
  values
    ('bife-acebolado-arroz-integral-vagem', 'patinho-bovino', 600, 0),
    ('bife-acebolado-arroz-integral-vagem', 'arroz-integral-cozido', 600, 1),
    ('bife-acebolado-arroz-integral-vagem', 'vagem-cozida', 300, 2),
    ('bife-acebolado-arroz-integral-vagem', 'cebola-crua', 150, 3),
    ('bife-acebolado-arroz-integral-vagem', 'oleo-de-soja', 20, 4),
    ('bife-acebolado-arroz-integral-vagem', 'alho-cru', 10, 5),
    ('bife-acebolado-arroz-integral-vagem', 'sal-refinado', 6, 6),
    ('escondidinho-de-frango-com-mandioca', 'peito-de-frango-cru', 700, 0),
    ('escondidinho-de-frango-com-mandioca', 'mandioca-cozida', 800, 1),
    ('escondidinho-de-frango-com-mandioca', 'cebola-crua', 120, 2),
    ('escondidinho-de-frango-com-mandioca', 'leite-desnatado', 150, 3),
    ('escondidinho-de-frango-com-mandioca', 'queijo-mucarela', 100, 4),
    ('escondidinho-de-frango-com-mandioca', 'extrato-de-tomate', 80, 5),
    ('escondidinho-de-frango-com-mandioca', 'azeite-extravirgem', 20, 6),
    ('escondidinho-de-frango-com-mandioca', 'alho-cru', 10, 7),
    ('escondidinho-de-frango-com-mandioca', 'cheiro-verde', 20, 8),
    ('escondidinho-de-frango-com-mandioca', 'sal-refinado', 6, 9),
    ('cacao-em-posta-com-cuscuz', 'posta-de-cacao', 600, 0),
    ('cacao-em-posta-com-cuscuz', 'cuscuz-de-milho', 500, 1),
    ('cacao-em-posta-com-cuscuz', 'tomate-cru', 200, 2),
    ('cacao-em-posta-com-cuscuz', 'cebola-crua', 120, 3),
    ('cacao-em-posta-com-cuscuz', 'pimentao-verde', 100, 4),
    ('cacao-em-posta-com-cuscuz', 'limao-tahiti', 40, 5),
    ('cacao-em-posta-com-cuscuz', 'azeite-extravirgem', 20, 6),
    ('cacao-em-posta-com-cuscuz', 'cheiro-verde', 20, 7),
    ('cacao-em-posta-com-cuscuz', 'sal-refinado', 6, 8),
    ('almondegas-ao-sugo-com-macarrao-integral', 'carne-moida-acem', 600, 0),
    ('almondegas-ao-sugo-com-macarrao-integral', 'macarrao-integral-cozido', 600, 1),
    ('almondegas-ao-sugo-com-macarrao-integral', 'molho-de-tomate-pronto', 400, 2),
    ('almondegas-ao-sugo-com-macarrao-integral', 'cebola-crua', 100, 3),
    ('almondegas-ao-sugo-com-macarrao-integral', 'farinha-de-rosca', 60, 4),
    ('almondegas-ao-sugo-com-macarrao-integral', 'ovo-de-galinha', 50, 5),
    ('almondegas-ao-sugo-com-macarrao-integral', 'azeite-extravirgem', 20, 6),
    ('almondegas-ao-sugo-com-macarrao-integral', 'alho-cru', 10, 7),
    ('almondegas-ao-sugo-com-macarrao-integral', 'manjericao-cru', 10, 8),
    ('almondegas-ao-sugo-com-macarrao-integral', 'sal-refinado', 6, 9),
    ('merluza-com-crosta-de-castanha', 'file-de-merluza', 640, 0),
    ('merluza-com-crosta-de-castanha', 'batata-doce-cozida', 500, 1),
    ('merluza-com-crosta-de-castanha', 'brocolis-cozido', 300, 2),
    ('merluza-com-crosta-de-castanha', 'castanha-do-para', 60, 3),
    ('merluza-com-crosta-de-castanha', 'farinha-de-rosca', 40, 4),
    ('merluza-com-crosta-de-castanha', 'limao-tahiti', 30, 5),
    ('merluza-com-crosta-de-castanha', 'azeite-extravirgem', 20, 6),
    ('merluza-com-crosta-de-castanha', 'alho-cru', 8, 7),
    ('merluza-com-crosta-de-castanha', 'sal-refinado', 5, 8),
    ('camarao-na-moranga', 'camarao-cru', 450, 0),
    ('camarao-na-moranga', 'abobora-moranga-crua', 900, 1),
    ('camarao-na-moranga', 'requeijao-light', 120, 2),
    ('camarao-na-moranga', 'tomate-cru', 150, 3),
    ('camarao-na-moranga', 'cebola-crua', 100, 4),
    ('camarao-na-moranga', 'azeite-extravirgem', 15, 5),
    ('camarao-na-moranga', 'alho-cru', 8, 6),
    ('camarao-na-moranga', 'cheiro-verde', 15, 7),
    ('camarao-na-moranga', 'sal-refinado', 5, 8),
    ('frango-com-quiabo-e-pure-de-couve-flor', 'coxa-de-frango-crua', 700, 0),
    ('frango-com-quiabo-e-pure-de-couve-flor', 'couve-flor-cozida', 600, 1),
    ('frango-com-quiabo-e-pure-de-couve-flor', 'quiabo-cru', 400, 2),
    ('frango-com-quiabo-e-pure-de-couve-flor', 'cebola-crua', 100, 3),
    ('frango-com-quiabo-e-pure-de-couve-flor', 'requeijao-light', 80, 4),
    ('frango-com-quiabo-e-pure-de-couve-flor', 'azeite-extravirgem', 20, 5),
    ('frango-com-quiabo-e-pure-de-couve-flor', 'alho-cru', 10, 6),
    ('frango-com-quiabo-e-pure-de-couve-flor', 'cheiro-verde', 15, 7),
    ('frango-com-quiabo-e-pure-de-couve-flor', 'sal-refinado', 6, 8),
    ('carne-salteada-com-brocolis-e-champignon', 'coxao-mole', 600, 0),
    ('carne-salteada-com-brocolis-e-champignon', 'brocolis-cozido', 400, 1),
    ('carne-salteada-com-brocolis-e-champignon', 'champignon-conserva', 200, 2),
    ('carne-salteada-com-brocolis-e-champignon', 'pimentao-vermelho', 150, 3),
    ('carne-salteada-com-brocolis-e-champignon', 'cebola-crua', 100, 4),
    ('carne-salteada-com-brocolis-e-champignon', 'azeite-extravirgem', 25, 5),
    ('carne-salteada-com-brocolis-e-champignon', 'gergelim', 10, 6),
    ('carne-salteada-com-brocolis-e-champignon', 'alho-cru', 10, 7),
    ('carne-salteada-com-brocolis-e-champignon', 'sal-refinado', 5, 8),
    ('torta-de-frango-sem-massa', 'peito-de-frango-cru', 500, 0),
    ('torta-de-frango-sem-massa', 'couve-flor-cozida', 400, 1),
    ('torta-de-frango-sem-massa', 'ovo-de-galinha', 200, 2),
    ('torta-de-frango-sem-massa', 'queijo-ricota', 200, 3),
    ('torta-de-frango-sem-massa', 'tomate-cru', 150, 4),
    ('torta-de-frango-sem-massa', 'cebola-crua', 100, 5),
    ('torta-de-frango-sem-massa', 'queijo-mucarela', 80, 6),
    ('torta-de-frango-sem-massa', 'azeite-extravirgem', 15, 7),
    ('torta-de-frango-sem-massa', 'cheiro-verde', 10, 8),
    ('torta-de-frango-sem-massa', 'alho-cru', 8, 9),
    ('torta-de-frango-sem-massa', 'sal-refinado', 5, 10),
    ('abobrinha-recheada-com-carne-moida', 'abobrinha-crua', 900, 0),
    ('abobrinha-recheada-com-carne-moida', 'carne-moida-acem', 500, 1),
    ('abobrinha-recheada-com-carne-moida', 'tomate-cru', 200, 2),
    ('abobrinha-recheada-com-carne-moida', 'cebola-crua', 100, 3),
    ('abobrinha-recheada-com-carne-moida', 'queijo-mucarela', 80, 4),
    ('abobrinha-recheada-com-carne-moida', 'azeite-extravirgem', 20, 5),
    ('abobrinha-recheada-com-carne-moida', 'alho-cru', 10, 6),
    ('abobrinha-recheada-com-carne-moida', 'manjericao-cru', 10, 7),
    ('abobrinha-recheada-com-carne-moida', 'sal-refinado', 5, 8),
    ('sardinha-assada-com-salada-morna', 'sardinha-fresca', 600, 0),
    ('sardinha-assada-com-salada-morna', 'batata-inglesa-cozida', 500, 1),
    ('sardinha-assada-com-salada-morna', 'vagem-cozida', 250, 2),
    ('sardinha-assada-com-salada-morna', 'cenoura-cozida', 200, 3),
    ('sardinha-assada-com-salada-morna', 'cebola-crua', 100, 4),
    ('sardinha-assada-com-salada-morna', 'limao-tahiti', 40, 5),
    ('sardinha-assada-com-salada-morna', 'azeite-extravirgem', 20, 6),
    ('sardinha-assada-com-salada-morna', 'salsa-crua', 10, 7),
    ('sardinha-assada-com-salada-morna', 'alho-cru', 8, 8),
    ('sardinha-assada-com-salada-morna', 'sal-refinado', 6, 9),
    ('figado-acebolado-com-arroz-e-couve', 'figado-bovino', 600, 0),
    ('figado-acebolado-com-arroz-e-couve', 'arroz-branco-cozido', 600, 1),
    ('figado-acebolado-com-arroz-e-couve', 'cebola-crua', 250, 2),
    ('figado-acebolado-com-arroz-e-couve', 'couve-manteiga-crua', 200, 3),
    ('figado-acebolado-com-arroz-e-couve', 'oleo-de-soja', 25, 4),
    ('figado-acebolado-com-arroz-e-couve', 'alho-cru', 10, 5),
    ('figado-acebolado-com-arroz-e-couve', 'sal-refinado', 6, 6),
    ('ovos-mexidos-com-polenta-cremosa', 'polenta-pronta', 700, 0),
    ('ovos-mexidos-com-polenta-cremosa', 'ovo-de-galinha', 400, 1),
    ('ovos-mexidos-com-polenta-cremosa', 'molho-de-tomate-pronto', 250, 2),
    ('ovos-mexidos-com-polenta-cremosa', 'cebola-crua', 100, 3),
    ('ovos-mexidos-com-polenta-cremosa', 'queijo-mucarela', 60, 4),
    ('ovos-mexidos-com-polenta-cremosa', 'oleo-de-soja', 15, 5),
    ('ovos-mexidos-com-polenta-cremosa', 'cheiro-verde', 10, 6),
    ('ovos-mexidos-com-polenta-cremosa', 'sal-refinado', 5, 7),
    ('baiao-de-dois-com-frango', 'arroz-branco-cozido', 700, 0),
    ('baiao-de-dois-com-frango', 'feijao-fradinho-cozido', 500, 1),
    ('baiao-de-dois-com-frango', 'sobrecoxa-de-frango-crua', 500, 2),
    ('baiao-de-dois-com-frango', 'queijo-minas-frescal', 100, 3),
    ('baiao-de-dois-com-frango', 'cebola-crua', 100, 4),
    ('baiao-de-dois-com-frango', 'oleo-de-soja', 20, 5),
    ('baiao-de-dois-com-frango', 'cheiro-verde', 15, 6),
    ('baiao-de-dois-com-frango', 'alho-cru', 10, 7),
    ('baiao-de-dois-com-frango', 'sal-refinado', 6, 8),
    ('frango-ensopado-com-batata-e-cenoura', 'coxa-de-frango-crua', 800, 0),
    ('frango-ensopado-com-batata-e-cenoura', 'batata-inglesa-cozida', 600, 1),
    ('frango-ensopado-com-batata-e-cenoura', 'cenoura-cozida', 300, 2),
    ('frango-ensopado-com-batata-e-cenoura', 'tomate-cru', 250, 3),
    ('frango-ensopado-com-batata-e-cenoura', 'cebola-crua', 150, 4),
    ('frango-ensopado-com-batata-e-cenoura', 'extrato-de-tomate', 60, 5),
    ('frango-ensopado-com-batata-e-cenoura', 'oleo-de-soja', 20, 6),
    ('frango-ensopado-com-batata-e-cenoura', 'cheiro-verde', 15, 7),
    ('frango-ensopado-com-batata-e-cenoura', 'alho-cru', 12, 8),
    ('frango-ensopado-com-batata-e-cenoura', 'sal-refinado', 6, 9),
    ('cuscuz-nordestino-com-ovo-e-queijo', 'cuscuz-de-milho', 450, 0),
    ('cuscuz-nordestino-com-ovo-e-queijo', 'ovo-de-galinha', 200, 1),
    ('cuscuz-nordestino-com-ovo-e-queijo', 'queijo-minas-frescal', 120, 2),
    ('cuscuz-nordestino-com-ovo-e-queijo', 'tomate-cru', 120, 3),
    ('cuscuz-nordestino-com-ovo-e-queijo', 'cebola-crua', 60, 4),
    ('cuscuz-nordestino-com-ovo-e-queijo', 'manteiga-sem-sal', 20, 5),
    ('cuscuz-nordestino-com-ovo-e-queijo', 'cheiro-verde', 10, 6),
    ('cuscuz-nordestino-com-ovo-e-queijo', 'sal-refinado', 4, 7)
) as v(receita, ingrediente, gramas, ordem)
join public.recipes r on r.slug = v.receita
join public.ingredients i on i.slug = v.ingrediente;

-- ---------------------------------------------------------------------------
-- Correções em receitas da primeira versão do cardápio, cujo rótulo de
-- objetivo a ficha nutricional não sustentava.
-- ---------------------------------------------------------------------------
-- Receita de carne moída usava patinho, o corte mais caro da base. Ninguém
-- mói patinho para marmita econômica: o acém moído faz o mesmo prato e
-- derruba a porção de R$ 8,18 para dentro do que o rótulo promete.
-- carne-moida-com-abobrinha-e-arroz: patinho-bovino -> carne-moida-acem
update public.recipe_ingredients ri
set ingredient_id = novo.id, quantidade_g = 450
from public.recipes r, public.ingredients antigo, public.ingredients novo
where ri.recipe_id = r.id
  and r.slug = 'carne-moida-com-abobrinha-e-arroz'
  and antigo.slug = 'patinho-bovino'
  and novo.slug = 'carne-moida-acem'
  and ri.ingredient_id = antigo.id;
-- Mesmo problema: recheio de panqueca com patinho. Trocado por acém moído,
-- que é o corte que se usa de verdade nesse recheio, em quantidade que
-- devolve a porção para dentro do teto do rótulo.
-- panqueca-de-carne-com-molho: patinho-bovino -> carne-moida-acem
update public.recipe_ingredients ri
set ingredient_id = novo.id, quantidade_g = 420
from public.recipes r, public.ingredients antigo, public.ingredients novo
where ri.recipe_id = r.id
  and r.slug = 'panqueca-de-carne-com-molho'
  and antigo.slug = 'patinho-bovino'
  and novo.slug = 'carne-moida-acem'
  and ri.ingredient_id = antigo.id;
-- Usava peito de peru defumado fatiado — frio de padaria, com 980 mg de
-- sódio por 100 g e pouca proteína para o preço. Numa marmita quente ele
-- não faz sentido. Trocado por peito de peru cru, com mais carne e menos
-- quinoa: a porção sai de 24,7 g para acima de 30 g de proteína e o sódio
-- cai.
-- peito-de-peru-com-quinoa: peito-de-peru-defumado -> peito-de-peru-cru
update public.recipe_ingredients ri
set ingredient_id = novo.id, quantidade_g = 450
from public.recipes r, public.ingredients antigo, public.ingredients novo
where ri.recipe_id = r.id
  and r.slug = 'peito-de-peru-com-quinoa'
  and antigo.slug = 'peito-de-peru-defumado'
  and novo.slug = 'peito-de-peru-cru'
  and ri.ingredient_id = antigo.id;
update public.recipe_ingredients ri
set quantidade_g = 300
from public.recipes r, public.ingredients i
where ri.recipe_id = r.id
  and r.slug = 'peito-de-peru-com-quinoa'
  and i.slug = 'quinoa-cozida'
  and ri.ingredient_id = i.id;
