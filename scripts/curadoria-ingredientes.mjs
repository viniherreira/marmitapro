/**
 * Curadoria dos ingredientes do MarmitaPRO.
 *
 * Cada linha amarra um alimento da TACO (Tabela Brasileira de Composição de
 * Alimentos, 4ª edição — NEPA/UNICAMP) ao ingrediente que aparece no app.
 *
 *   [ descrição exata na TACO, slug, nome exibido, categoria, preço médio/kg ]
 *
 * A descrição é a chave: o gerador falha alto se alguma não bater, então a
 * curadoria não silencia quando a fonte muda de versão.
 *
 * Escolha de estado (cru x cozido): seguimos como a pessoa pesa na cozinha.
 * Carne, peixe e legume vão crus, porque é assim que saem da balança na hora
 * de montar a ficha. Arroz, feijão e massa vão cozidos, porque ninguém porciona
 * arroz cru na marmita.
 *
 * O preço é estimativa de varejo brasileiro e NÃO vem da TACO — ela não traz
 * preço. Serve de ponto de partida; o custo real é o que a pessoa paga.
 */

export const CATEGORIAS = [
  "Carnes e ovos",
  "Peixes e frutos do mar",
  "Grãos e massas",
  "Legumes e verduras",
  "Frutas",
  "Laticínios",
  "Gorduras e oleaginosas",
  "Molhos e temperos",
];

export const CURADORIA = [
  // --- Carnes e ovos -------------------------------------------------------
  ["Frango, peito, sem pele, cru", "peito-de-frango-cru", "Peito de frango, sem pele", "Carnes e ovos", 18.9],
  ["Frango, peito, sem pele, grelhado", "peito-de-frango-grelhado", "Peito de frango grelhado", "Carnes e ovos", 26.9],
  ["Frango, coxa, sem pele, crua", "coxa-de-frango-crua", "Coxa de frango, sem pele", "Carnes e ovos", 13.9],
  ["Frango, sobrecoxa, sem pele, crua", "sobrecoxa-de-frango-crua", "Sobrecoxa de frango, sem pele", "Carnes e ovos", 14.9],
  ["Frango, inteiro, sem pele, cru", "frango-inteiro-sem-pele", "Frango inteiro, sem pele", "Carnes e ovos", 12.9],
  ["Frango, fígado, cru", "figado-de-frango", "Fígado de frango", "Carnes e ovos", 14.9],
  ["Frango, coração, cru", "coracao-de-frango", "Coração de frango", "Carnes e ovos", 29.9],
  ["Peru, congelado, cru", "peito-de-peru-cru", "Peru, cru", "Carnes e ovos", 34.9],
  ["Carne, bovina, patinho, sem gordura, cru", "patinho-bovino", "Patinho bovino, sem gordura", "Carnes e ovos", 42.9],
  ["Carne, bovina, coxão mole, sem gordura, cru", "coxao-mole", "Coxão mole, sem gordura", "Carnes e ovos", 44.9],
  ["Carne, bovina, coxão duro, sem gordura, cru", "coxao-duro", "Coxão duro, sem gordura", "Carnes e ovos", 39.9],
  ["Carne, bovina, acém, sem gordura, cru", "acem-bovino", "Acém, sem gordura", "Carnes e ovos", 34.9],
  ["Carne, bovina, acém, moído, cru", "carne-moida-acem", "Carne moída de acém", "Carnes e ovos", 36.9],
  ["Carne, bovina, músculo, sem gordura, cru", "musculo-bovino", "Músculo bovino, sem gordura", "Carnes e ovos", 32.9],
  ["Carne, bovina, lagarto, cru", "lagarto-bovino", "Lagarto bovino", "Carnes e ovos", 42.9],
  ["Carne, bovina, paleta, sem gordura, crua", "paleta-bovina", "Paleta bovina, sem gordura", "Carnes e ovos", 33.9],
  ["Carne, bovina, maminha, crua", "maminha-bovina", "Maminha", "Carnes e ovos", 46.9],
  ["Carne, bovina, miolo de alcatra, sem gordura, cru", "alcatra-bovina", "Miolo de alcatra, sem gordura", "Carnes e ovos", 52.9],
  ["Carne, bovina, contra-filé, sem gordura, cru", "contra-file-bovino", "Contrafilé, sem gordura", "Carnes e ovos", 54.9],
  ["Carne, bovina, filé mingnon, sem gordura, cru", "file-mignon", "Filé-mignon, sem gordura", "Carnes e ovos", 89.9],
  ["Carne, bovina, fígado, cru", "figado-bovino", "Fígado bovino", "Carnes e ovos", 19.9],
  ["Carne, bovina, seca, crua", "carne-seca", "Carne-seca (antes de dessalgar)", "Carnes e ovos", 59.9],
  ["Porco, lombo, cru", "lombo-suino", "Lombo suíno", "Carnes e ovos", 26.9],
  ["Porco, bisteca, crua", "bisteca-suina", "Bisteca suína", "Carnes e ovos", 24.9],
  ["Porco, pernil, cru", "pernil-suino", "Pernil suíno", "Carnes e ovos", 22.9],
  ["Ovo, de galinha, inteiro, cru", "ovo-de-galinha", "Ovo de galinha inteiro", "Carnes e ovos", 18.9],
  ["Ovo, de galinha, clara, cozida/10minutos", "clara-de-ovo", "Clara de ovo cozida", "Carnes e ovos", 22.9],
  ["Ovo, de galinha, gema, cozida/10minutos", "gema-de-ovo", "Gema de ovo cozida", "Carnes e ovos", 22.9],

  // --- Peixes e frutos do mar ---------------------------------------------
  ["Merluza, filé, cru", "file-de-merluza", "Filé de merluza", "Peixes e frutos do mar", 32.9],
  ["Abadejo, filé, congelado, cru", "file-de-abadejo", "Filé de abadejo", "Peixes e frutos do mar", 34.9],
  ["Pescada, filé, cru", "file-de-pescada", "Filé de pescada", "Peixes e frutos do mar", 29.9],
  ["Cação, posta, crua", "posta-de-cacao", "Posta de cação", "Peixes e frutos do mar", 39.9],
  ["Tucunaré, filé, congelado, cru", "file-de-tucunare", "Filé de tucunaré", "Peixes e frutos do mar", 36.9],
  ["Pintado, cru", "pintado-cru", "Pintado", "Peixes e frutos do mar", 44.9],
  ["Corvina do mar, crua", "corvina-crua", "Corvina do mar", "Peixes e frutos do mar", 27.9],
  ["Salmão, sem pele, fresco, cru", "salmao-fresco", "Salmão, sem pele", "Peixes e frutos do mar", 89.9],
  ["Atum, fresco, cru", "atum-fresco", "Atum fresco", "Peixes e frutos do mar", 69.9],
  ["Sardinha, inteira, crua", "sardinha-fresca", "Sardinha inteira", "Peixes e frutos do mar", 24.9],
  ["Camarão, Rio Grande, grande, cru", "camarao-cru", "Camarão", "Peixes e frutos do mar", 79.9],
  ["Bacalhau, salgado, cru", "bacalhau-salgado", "Bacalhau salgado (antes de dessalgar)", "Peixes e frutos do mar", 99.9],

  // --- Grãos e massas ------------------------------------------------------
  ["Arroz, tipo 1, cozido", "arroz-branco-cozido", "Arroz branco cozido", "Grãos e massas", 6.5],
  ["Arroz, integral, cozido", "arroz-integral-cozido", "Arroz integral cozido", "Grãos e massas", 9.9],
  ["Arroz, tipo 1, cru", "arroz-branco-cru", "Arroz branco cru", "Grãos e massas", 6.5],
  ["Arroz, integral, cru", "arroz-integral-cru", "Arroz integral cru", "Grãos e massas", 9.9],
  ["Feijão, carioca, cozido", "feijao-carioca-cozido", "Feijão carioca cozido", "Grãos e massas", 9.9],
  ["Feijão, preto, cozido", "feijao-preto-cozido", "Feijão preto cozido", "Grãos e massas", 9.9],
  ["Feijão, fradinho, cozido", "feijao-fradinho-cozido", "Feijão-fradinho cozido", "Grãos e massas", 12.9],
  ["Feijão, roxo, cozido", "feijao-roxo-cozido", "Feijão roxo cozido", "Grãos e massas", 13.9],
  ["Lentilha, cozida", "lentilha-cozida", "Lentilha cozida", "Grãos e massas", 14.9],
  ["Grão-de-bico, cru", "grao-de-bico-cru", "Grão-de-bico cru", "Grãos e massas", 19.9],
  ["Soja, farinha", "farinha-de-soja", "Farinha de soja", "Grãos e massas", 24.9],
  ["Macarrão, trigo, cru", "macarrao-comum-cru", "Macarrão de trigo cru", "Grãos e massas", 7.9],
  ["Lasanha, massa fresca, cozida", "massa-fresca-cozida", "Massa fresca cozida", "Grãos e massas", 16.9],
  ["Aveia, flocos, crua", "aveia-em-flocos", "Aveia em flocos", "Grãos e massas", 12.9],
  ["Milho, fubá, cru", "fuba-de-milho", "Fubá de milho", "Grãos e massas", 6.9],
  ["Farinha, de milho, amarela", "farinha-de-milho", "Farinha de milho", "Grãos e massas", 7.9],
  ["Milho, verde, cru", "milho-verde-cru", "Milho verde", "Grãos e massas", 13.9],
  ["Canjica, branca, crua", "canjica-crua", "Canjica branca", "Grãos e massas", 8.9],
  ["Pão, trigo, forma, integral", "pao-integral", "Pão de forma integral", "Grãos e massas", 15.9],
  ["Farinha, de trigo", "farinha-de-trigo", "Farinha de trigo", "Grãos e massas", 5.9],
  ["Farinha, de centeio, integral", "farinha-de-centeio", "Farinha de centeio integral", "Grãos e massas", 18.9],
  ["Farinha, de rosca", "farinha-de-rosca", "Farinha de rosca", "Grãos e massas", 12.9],
  ["Milho, amido, cru", "amido-de-milho", "Amido de milho", "Grãos e massas", 12.9],
  ["Polenta, pré-cozida", "polenta-pronta", "Polenta pronta", "Grãos e massas", 9.9],
  ["Nhoque, batata, cozido", "nhoque-cozido", "Nhoque de batata cozido", "Grãos e massas", 17.9],

  // --- Legumes e verduras --------------------------------------------------
  ["Batata, doce, cozida", "batata-doce-cozida", "Batata-doce cozida", "Legumes e verduras", 5.9],
  ["Batata, doce, crua", "batata-doce-crua", "Batata-doce crua", "Legumes e verduras", 5.9],
  ["Batata, inglesa, cozida", "batata-inglesa-cozida", "Batata inglesa cozida", "Legumes e verduras", 4.9],
  ["Batata, baroa, cozida", "batata-baroa-cozida", "Batata-baroa cozida", "Legumes e verduras", 12.9],
  ["Mandioca, cozida", "mandioca-cozida", "Mandioca cozida", "Legumes e verduras", 4.5],
  ["Inhame, cru", "inhame-cru", "Inhame", "Legumes e verduras", 7.9],
  ["Cará, cozido", "cara-cozido", "Cará cozido", "Legumes e verduras", 8.9],
  ["Abóbora, cabotian, cozida", "abobora-cabotia-cozida", "Abóbora cabotiá cozida", "Legumes e verduras", 5.9],
  ["Abóbora, moranga, crua", "abobora-moranga-crua", "Abóbora moranga", "Legumes e verduras", 4.9],
  ["Abobrinha, italiana, cozida", "abobrinha-cozida", "Abobrinha cozida", "Legumes e verduras", 6.9],
  ["Abobrinha, italiana, crua", "abobrinha-crua", "Abobrinha crua", "Legumes e verduras", 6.9],
  ["Berinjela, cozida", "berinjela-cozida", "Berinjela cozida", "Legumes e verduras", 8.9],
  ["Chuchu, cozido", "chuchu-cozido", "Chuchu cozido", "Legumes e verduras", 4.5],
  ["Cenoura, cozida", "cenoura-cozida", "Cenoura cozida", "Legumes e verduras", 5.9],
  ["Cenoura, crua", "cenoura-crua", "Cenoura crua", "Legumes e verduras", 5.9],
  ["Beterraba, cozida", "beterraba-cozida", "Beterraba cozida", "Legumes e verduras", 5.9],
  ["Brócolis, cozido", "brocolis-cozido", "Brócolis cozido", "Legumes e verduras", 12.9],
  ["Couve-flor, cozida", "couve-flor-cozida", "Couve-flor cozida", "Legumes e verduras", 9.9],
  ["Couve, manteiga, crua", "couve-manteiga-crua", "Couve-manteiga crua", "Legumes e verduras", 9.9],
  ["Espinafre, Nova Zelândia, cru", "espinafre-cru", "Espinafre cru", "Legumes e verduras", 14.9],
  ["Vagem, crua", "vagem-crua", "Vagem crua", "Legumes e verduras", 12.9],
  ["Quiabo, cru", "quiabo-cru", "Quiabo", "Legumes e verduras", 11.9],
  ["Jiló, cru", "jilo-cru", "Jiló", "Legumes e verduras", 9.9],
  ["Maxixe, cru", "maxixe-cru", "Maxixe", "Legumes e verduras", 8.9],
  ["Repolho, branco, cru", "repolho-cru", "Repolho branco", "Legumes e verduras", 4.5],
  ["Repolho, roxo, cru", "repolho-roxo-cru", "Repolho roxo", "Legumes e verduras", 6.9],
  ["Tomate, com semente, cru", "tomate-cru", "Tomate", "Legumes e verduras", 7.9],
  ["Cebola, crua", "cebola-crua", "Cebola", "Legumes e verduras", 5.9],
  ["Alho, cru", "alho-cru", "Alho", "Legumes e verduras", 29.9],
  ["Alho-poró, cru", "alho-poro-cru", "Alho-poró", "Legumes e verduras", 16.9],
  ["Pimentão, verde, cru", "pimentao-verde", "Pimentão verde", "Legumes e verduras", 9.9],
  ["Pimentão, vermelho, cru", "pimentao-vermelho", "Pimentão vermelho", "Legumes e verduras", 12.9],
  ["Pimentão, amarelo, cru", "pimentao-amarelo", "Pimentão amarelo", "Legumes e verduras", 14.9],
  ["Pepino, cru", "pepino-cru", "Pepino", "Legumes e verduras", 6.9],
  ["Alface, crespa, crua", "alface-crespa", "Alface crespa", "Legumes e verduras", 12.9],
  ["Alface, americana, crua", "alface-americana", "Alface americana", "Legumes e verduras", 14.9],
  ["Rúcula, crua", "rucula-crua", "Rúcula", "Legumes e verduras", 19.9],
  ["Agrião, cru", "agriao-cru", "Agrião", "Legumes e verduras", 17.9],
  ["Acelga, crua", "acelga-crua", "Acelga", "Legumes e verduras", 9.9],
  ["Mostarda, folha, crua", "folha-de-mostarda", "Folha de mostarda", "Legumes e verduras", 11.9],
  ["Rabanete, cru", "rabanete-cru", "Rabanete", "Legumes e verduras", 12.9],
  ["Nabo, cru", "nabo-cru", "Nabo", "Legumes e verduras", 7.9],
  ["Feijão, broto, cru", "broto-de-feijao", "Broto de feijão", "Legumes e verduras", 14.9],

  // --- Frutas --------------------------------------------------------------
  ["Banana, prata, crua", "banana-prata", "Banana-prata", "Frutas", 6.9],
  ["Banana, nanica, crua", "banana-nanica", "Banana-nanica", "Frutas", 5.9],
  ["Banana, da terra, crua", "banana-da-terra", "Banana-da-terra", "Frutas", 8.9],
  ["Maçã, Fuji, com casca, crua", "maca-fuji", "Maçã Fuji, com casca", "Frutas", 9.9],
  ["Mamão, Formosa, cru", "mamao-formosa", "Mamão Formosa", "Frutas", 5.9],
  ["Abacaxi, cru", "abacaxi-cru", "Abacaxi", "Frutas", 6.9],
  ["Abacate, cru", "abacate-cru", "Abacate", "Frutas", 9.9],
  ["Laranja, pêra, crua", "laranja-pera", "Laranja-pera", "Frutas", 4.9],
  ["Limão, tahiti, cru", "limao-tahiti", "Limão-taiti", "Frutas", 8.9],
  ["Goiaba, vermelha, com casca, crua", "goiaba-vermelha", "Goiaba vermelha, com casca", "Frutas", 8.9],
  ["Kiwi, cru", "kiwi-cru", "Kiwi", "Frutas", 19.9],
  ["Ameixa, crua", "ameixa-crua", "Ameixa", "Frutas", 17.9],

  // --- Laticínios ----------------------------------------------------------
  ["Iogurte, natural", "iogurte-natural", "Iogurte natural integral", "Laticínios", 13.9],
  ["Iogurte, natural, desnatado", "iogurte-natural-desnatado", "Iogurte natural desnatado", "Laticínios", 15.9],
  ["Queijo, minas, frescal", "queijo-minas-frescal", "Queijo minas frescal", "Laticínios", 42.9],
  ["Queijo, mozarela", "queijo-mucarela", "Queijo muçarela", "Laticínios", 44.9],
  ["Queijo, prato", "queijo-prato", "Queijo prato", "Laticínios", 46.9],
  ["Queijo, ricota", "queijo-ricota", "Ricota", "Laticínios", 29.9],
  ["Queijo, parmesão", "queijo-parmesao", "Queijo parmesão", "Laticínios", 89.9],
  ["Queijo, requeijão, cremoso", "requeijao-cremoso", "Requeijão cremoso", "Laticínios", 29.9],
  ["Leite, de vaca, desnatado, pó", "leite-em-po-desnatado", "Leite em pó desnatado", "Laticínios", 44.9],
  ["Creme de Leite", "creme-de-leite", "Creme de leite", "Laticínios", 19.9],

  // --- Gorduras e oleaginosas ---------------------------------------------
  ["Azeite, de oliva, extra virgem", "azeite-extravirgem", "Azeite de oliva extravirgem", "Gorduras e oleaginosas", 49.9],
  ["Óleo, de soja", "oleo-de-soja", "Óleo de soja", "Gorduras e oleaginosas", 9.9],
  ["Óleo, de canola", "oleo-de-canola", "Óleo de canola", "Gorduras e oleaginosas", 14.9],
  ["Óleo, de girassol", "oleo-de-girassol", "Óleo de girassol", "Gorduras e oleaginosas", 12.9],
  ["Manteiga, sem sal", "manteiga-sem-sal", "Manteiga sem sal", "Gorduras e oleaginosas", 59.9],
  ["Castanha-do-Brasil, crua", "castanha-do-para", "Castanha-do-pará", "Gorduras e oleaginosas", 129.9],
  ["Castanha-de-caju, torrada, salgada", "castanha-de-caju", "Castanha de caju torrada", "Gorduras e oleaginosas", 99.9],
  ["Amêndoa, torrada, salgada", "amendoa-torrada", "Amêndoa torrada", "Gorduras e oleaginosas", 89.9],
  ["Amendoim, grão, cru", "amendoim-cru", "Amendoim cru", "Gorduras e oleaginosas", 19.9],
  ["Gergelim, semente", "gergelim", "Gergelim", "Gorduras e oleaginosas", 39.9],
  ["Coco, cru", "coco-cru", "Coco fresco", "Gorduras e oleaginosas", 14.9],

  // --- Molhos e temperos ---------------------------------------------------
  ["Farinha, de mandioca, crua", "farinha-de-mandioca", "Farinha de mandioca", "Molhos e temperos", 8.9],
  ["Salsa, crua", "salsa-crua", "Salsa", "Molhos e temperos", 24.9],
  ["Cebolinha, crua", "cebolinha-crua", "Cebolinha", "Molhos e temperos", 24.9],
  ["Manjericão, cru", "manjericao-cru", "Manjericão", "Molhos e temperos", 29.9],
];

/**
 * Ingredientes que a TACO não cobre — industrializados, cortes de mercado e
 * temperos prontos. Ficam com valor declarado pelo fabricante ou média de
 * rótulos, e a `fonte` avisa disso na ficha.
 */
export const FORA_DA_TACO = [
  // slug, nome, categoria, kcal, prot, carb, gord, fibra, sodio_mg, preço/kg, fonte

  // A TACO traz vagem só crua. Cozimento em água mexe pouco na composição por
  // 100 g de uma hortaliça, então usamos o valor da crua — e a fonte diz isso,
  // em vez de fingir que existe medição de vagem cozida.
  ["vagem-cozida", "Vagem cozida", "Legumes e verduras", 25, 1.8, 5.3, 0.2, 2.4, 0, 12.9, "TACO 4a ed. — valor da vagem crua"],
  // Cheiro-verde é mistura, não alimento: média das duas ervas da TACO.
  ["cheiro-verde", "Cheiro-verde", "Molhos e temperos", 27, 2.6, 4.6, 0.5, 2.7, 2, 24.9, "Media de salsa e cebolinha (TACO 4a ed.)"],
  ["file-de-tilapia", "Filé de tilápia", "Peixes e frutos do mar", 96, 20.1, 0, 1.7, 0, 52, 39.9, "Média de rótulos"],
  ["atum-conserva-natural", "Atum em conserva ao natural", "Peixes e frutos do mar", 108, 23.6, 0, 1.2, 0, 320, 59.9, "Média de rótulos"],
  ["sardinha-conserva-natural", "Sardinha em conserva ao natural", "Peixes e frutos do mar", 168, 21.8, 0, 8.9, 0, 390, 34.9, "Média de rótulos"],
  ["peito-de-peru-defumado", "Peito de peru defumado, fatiado", "Carnes e ovos", 96, 16.4, 2.6, 2.2, 0, 980, 49.9, "Média de rótulos"],
  ["quinoa-cozida", "Quinoa cozida", "Grãos e massas", 120, 4.4, 21.3, 1.9, 2.8, 7, 39.9, "Média de rótulos"],
  ["macarrao-integral-cozido", "Macarrão integral cozido", "Grãos e massas", 124, 5.3, 26.5, 0.5, 3.9, 4, 12.9, "Média de rótulos"],
  ["cuscuz-de-milho", "Cuscuz de milho pronto", "Grãos e massas", 113, 2.2, 25.4, 0.4, 1.6, 190, 7.9, "Média de rótulos"],
  ["tapioca-goma", "Goma de tapioca hidratada", "Grãos e massas", 240, 0.3, 59.5, 0.1, 0.6, 3, 12.9, "Média de rótulos"],
  ["queijo-cottage", "Queijo cottage", "Laticínios", 98, 12.4, 3.4, 4.3, 0, 380, 39.9, "Média de rótulos"],
  ["creme-de-ricota-light", "Creme de ricota light", "Laticínios", 138, 9.8, 4.2, 9.1, 0, 430, 34.9, "Média de rótulos"],
  ["requeijao-light", "Requeijão light", "Laticínios", 172, 10.4, 4.6, 12.3, 0, 510, 29.9, "Média de rótulos"],
  ["leite-desnatado", "Leite desnatado UHT", "Laticínios", 35, 3.2, 4.9, 0.2, 0, 50, 5.5, "Média de rótulos"],
  ["extrato-de-tomate", "Extrato de tomate", "Molhos e temperos", 62, 2.9, 13.1, 0.3, 2.4, 480, 16.9, "Média de rótulos"],
  ["molho-de-tomate-pronto", "Molho de tomate pronto", "Molhos e temperos", 38, 1.3, 7.4, 0.4, 1.3, 420, 9.9, "Média de rótulos"],
  ["champignon-conserva", "Champignon em conserva", "Legumes e verduras", 26, 2.2, 4.1, 0.3, 2.0, 380, 39.9, "Média de rótulos"],
  ["milho-verde-conserva", "Milho verde em conserva", "Legumes e verduras", 98, 3.2, 19.8, 0.9, 2.6, 240, 13.9, "Média de rótulos"],
  ["sal-refinado", "Sal refinado", "Molhos e temperos", 0, 0, 0, 0, 0, 38758, 2.5, "Composição do cloreto de sódio"],
];

/**
 * Slugs da primeira versão do seed que foram substituídos por entradas mais
 * precisas. Saem do banco só se nenhuma receita apontar para eles — a migração
 * verifica antes de apagar.
 *
 * `coxa-sobrecoxa-frango` virou coxa e sobrecoxa separadas, que têm gordura
 * bem diferente. `carne-seca-dessalgada` virou a carne-seca da TACO, medida
 * antes de dessalgar. Macarrão e grão-de-bico cozidos saem porque a TACO só
 * mede os dois crus, e estimar cozido a partir de cru erra feio nesses dois.
 */
export const APOSENTADOS = [
  "coxa-sobrecoxa-frango",
  "carne-seca-dessalgada",
  "macarrao-comum-cozido",
  "grao-de-bico-cozido",
];
