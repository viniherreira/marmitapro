/**
 * De qual arquivo vem a foto de cada receita.
 *
 * A chave da esquerda é um pedaço do nome do arquivo original — casamos por
 * prefixo porque alguns nomes vêm truncados com reticências e outros com
 * acento, e depender do nome exato quebraria na primeira renomeação.
 *
 * O mapa existe porque nome de arquivo mente: `almondegas.jpeg` é uma foto de
 * carne moída com abobrinha e arroz, não de almôndega. Conferido olhando a
 * imagem, não lendo o nome — foto trocada numa receita é o erro que o próprio
 * curso ensina a não cometer.
 */
export const FOTOS = {
  // --- rica em proteína ----------------------------------------------------
  Grilled_steak_meal_prep: "bife-acebolado-arroz-integral-vagem",
  Chicken_escondidinho: "escondidinho-de-frango-com-mandioca",
  Roasted_shark_steak: "cacao-em-posta-com-cuscuz",
  Meatballs_with_pasta: "almondegas-ao-sugo-com-macarrao-integral",
  Baked_hake: "merluza-com-crosta-de-castanha",
  Chicken_stroganoff: "strogonoff-fit-de-frango",
  Shredded_chicken_and_sweet_potato: "frango-desfiado-com-pure-de-batata-doce",
  Chicken_meal_prep_delivery_conta: "frango-grelhado-arroz-integral-brocolis",
  Turkey_meal_prep: "peito-de-peru-com-quinoa",
  Tilapia_fillet: "tilapia-ao-forno-com-legumes",

  // --- low carb ------------------------------------------------------------
  Shrimp_in_pumpkin: "camarao-na-moranga",
  Chicken_and_okra: "frango-com-quiabo-e-pure-de-couve-flor",
  Beef_and_broccoli: "carne-salteada-com-brocolis-e-champignon",
  Chicken_pie: "torta-de-frango-sem-massa",
  "abobrinha recheada": "abobrinha-recheada-com-carne-moida",
  Stuffed_eggplant: "berinjela-recheada-com-frango",
  Baked_omelet: "omelete-de-forno-com-legumes",
  Grilled_salmon_with_cauliflower: "salmao-com-pure-de-couve-flor",

  // --- econômica -----------------------------------------------------------
  Stewed_chicken: "frango-ensopado-com-batata-e-cenoura",
  "Baião_de_dois": "baiao-de-dois-com-frango",
  Beef_liver: "figado-acebolado-com-arroz-e-couve",
  Couscous_with_eggs_and_cheese: "cuscuz-nordestino-com-ovo-e-queijo",
  Lentil_feijoada: "feijoada-light-de-lentilha",
  Scrambled_eggs_with_polenta: "ovos-mexidos-com-polenta-cremosa",
  Baked_sardines: "sardinha-assada-com-salada-morna",
  Escondidinho_meal_prep: "escondidinho-de-abobora-com-carne-moida",
  Beef_pancakes: "panqueca-de-carne-com-molho",
  // Nome do arquivo diz "almondegas", mas a foto é de carne moída com
  // abobrinha e arroz. Vale o que está na imagem.
  "almondegas.jpeg": "carne-moida-com-abobrinha-e-arroz",
};

/**
 * Ajuste fino do enquadramento, por receita.
 *
 * O valor é o centro vertical do recorte como fração da altura da foto
 * original. O padrão de 0,56 funciona para prato montado dentro da marmita,
 * que é a maioria — mas prato alto, como a pilha de panqueca, sobe no quadro e
 * precisa de um centro mais acima para não encostar na borda.
 *
 * Só entre aqui quem precisar: lista vazia é lista que ninguém mantém.
 */
export const AJUSTES = {
  "panqueca-de-carne-com-molho": 0.5,
};
