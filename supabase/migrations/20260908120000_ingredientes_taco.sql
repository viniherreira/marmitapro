-- ---------------------------------------------------------------------------
-- MarmitaPRO — base nutricional ancorada na TACO
-- ---------------------------------------------------------------------------
-- GERADO por scripts/gerar-ingredientes.mjs. Não edite à mão: ajuste a
-- curadoria em scripts/curadoria-ingredientes.mjs e rode o script de novo.
--
-- Fonte: Tabela Brasileira de Composição de Alimentos (TACO), 4ª edição
-- revisada e ampliada — NEPA/UNICAMP, 2011. Valores por 100 g.
--
-- Fibra alimentar e sódio entram porque a RDC 429/2020 da Anvisa exige os dois
-- na tabela nutricional de alimento embalado. Sem eles a ficha que o app
-- entrega não serve para rótulo.
--
-- Preço NÃO vem da TACO: é estimativa de varejo, ponto de partida para o
-- usuário substituir pelo que ele realmente paga.
-- ---------------------------------------------------------------------------

alter table public.ingredients
  add column if not exists fibra_g numeric(6, 2) not null default 0
    check (fibra_g >= 0),
  add column if not exists sodio_mg numeric(8, 2) not null default 0
    check (sodio_mg >= 0),
  add column if not exists fonte text not null default 'Nao informada',
  add column if not exists taco_id integer;

comment on column public.ingredients.fonte is
  'De onde vieram os valores nutricionais desta linha.';
comment on column public.ingredients.taco_id is
  'Numero do alimento na TACO 4a edicao, quando a linha vem de la.';

-- Upsert por slug: as receitas apontam para o id do ingrediente, então apagar
-- e recriar quebraria as fichas já montadas. O preço só entra na criação —
-- preço ajustado pelo dono do negócio não é sobrescrito por estimativa nossa.
insert into public.ingredients
  (slug, nome, categoria, kcal, proteina_g, carboidrato_g, gordura_g,
   fibra_g, sodio_mg, preco_medio_kg, fonte, taco_id)
values
  ('acem-bovino', 'Acém, sem gordura', 'Carnes e ovos', 144.03, 20.82, 0, 6.11, 0, 49.85, 34.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 329),
  ('bisteca-suina', 'Bisteca suína', 'Carnes e ovos', 164.12, 21.5, 0, 8.02, 0, 54.29, 24.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 427),
  ('carne-moida-acem', 'Carne moída de acém', 'Carnes e ovos', 136.56, 19.42, 0, 5.95, 0, 48.61, 36.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 327),
  ('carne-seca', 'Carne-seca (antes de dessalgar)', 'Carnes e ovos', 312.75, 19.66, 0, 25.37, 0, 4439.55, 59.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 385),
  ('clara-de-ovo', 'Clara de ovo cozida', 'Carnes e ovos', 59.44, 13.45, 0, 0.09, 0, 180.54, 22.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 486),
  ('contra-file-bovino', 'Contrafilé, sem gordura', 'Carnes e ovos', 156.62, 24, 0, 6, 0, 52.89, 54.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 345),
  ('coracao-de-frango', 'Coração de frango', 'Carnes e ovos', 221.5, 12.58, 0, 18.6, 0, 95.06, 29.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 394),
  ('coxa-de-frango-crua', 'Coxa de frango, sem pele', 'Carnes e ovos', 119.95, 17.81, 0.02, 4.86, 0, 98.37, 13.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 399),
  ('coxao-duro', 'Coxão duro, sem gordura', 'Carnes e ovos', 147.97, 21.51, 0, 6.22, 0, 48.55, 39.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 350),
  ('coxao-mole', 'Coxão mole, sem gordura', 'Carnes e ovos', 169.07, 21.23, 0, 8.69, 0, 60.53, 44.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 352),
  ('figado-bovino', 'Fígado bovino', 'Carnes e ovos', 141.05, 20.71, 1.11, 5.36, 0, 75.92, 19.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 355),
  ('figado-de-frango', 'Fígado de frango', 'Carnes e ovos', 106.48, 17.59, 0, 3.49, 0, 82.43, 14.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 400),
  ('file-mignon', 'Filé-mignon, sem gordura', 'Carnes e ovos', 142.86, 21.6, 0, 5.61, 0, 48.86, 89.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 357),
  ('frango-inteiro-sem-pele', 'Frango inteiro, sem pele', 'Carnes e ovos', 129.1, 20.59, 0, 4.57, 0, 72.96, 12.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 405),
  ('gema-de-ovo', 'Gema de ovo cozida', 'Carnes e ovos', 352.67, 15.9, 1.56, 30.78, 0, 44.91, 22.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 487),
  ('lagarto-bovino', 'Lagarto bovino', 'Carnes e ovos', 134.86, 20.54, 0, 5.23, 0, 53.56, 42.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 364),
  ('lombo-suino', 'Lombo suíno', 'Carnes e ovos', 175.63, 22.6, 0, 8.77, 0, 53.07, 26.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 433),
  ('maminha-bovina', 'Maminha', 'Carnes e ovos', 152.77, 20.93, 0, 7.03, 0, 37.42, 46.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 367),
  ('alcatra-bovina', 'Miolo de alcatra, sem gordura', 'Carnes e ovos', 162.87, 21.61, 0, 7.83, 0, 43.05, 52.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 369),
  ('musculo-bovino', 'Músculo bovino, sem gordura', 'Carnes e ovos', 141.58, 21.56, 0, 5.49, 0, 66.08, 32.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 372),
  ('ovo-de-galinha', 'Ovo de galinha inteiro', 'Carnes e ovos', 143.11, 13.03, 1.64, 8.9, 0, 167.91, 18.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 489),
  ('paleta-bovina', 'Paleta bovina, sem gordura', 'Carnes e ovos', 140.94, 21.03, 0, 5.67, 0, 65.86, 33.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 375),
  ('patinho-bovino', 'Patinho bovino, sem gordura', 'Carnes e ovos', 133.47, 21.72, 0, 4.51, 0, 49.13, 42.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 376),
  ('peito-de-frango-grelhado', 'Peito de frango grelhado', 'Carnes e ovos', 159.19, 32.03, 0, 2.48, 0, 50.25, 26.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 410),
  ('peito-de-frango-cru', 'Peito de frango, sem pele', 'Carnes e ovos', 119.16, 21.53, 0, 3.02, 0, 56.14, 18.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 409),
  ('peito-de-peru-defumado', 'Peito de peru defumado, fatiado', 'Carnes e ovos', 96, 16.4, 2.6, 2.2, 0, 980, 49.9, 'Média de rótulos', null),
  ('pernil-suino', 'Pernil suíno', 'Carnes e ovos', 186.06, 20.13, 0, 11.1, 0, 101.89, 22.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 436),
  ('peito-de-peru-cru', 'Peru, cru', 'Carnes e ovos', 93.72, 18.08, 0, 1.83, 0, 710.68, 34.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 426),
  ('sobrecoxa-de-frango-crua', 'Sobrecoxa de frango, sem pele', 'Carnes e ovos', 161.8, 17.57, 0, 9.62, 0, 79.75, 14.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 414),
  ('abacate-cru', 'Abacate', 'Frutas', 96.15, 1.24, 6.03, 8.4, 6.31, 0, 9.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 163),
  ('abacaxi-cru', 'Abacaxi', 'Frutas', 48.32, 0.86, 12.33, 0.12, 0.99, 0, 6.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 164),
  ('ameixa-crua', 'Ameixa', 'Frutas', 52.54, 0.77, 13.85, 0, 2.43, 0, 17.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 172),
  ('banana-da-terra', 'Banana-da-terra', 'Frutas', 128.02, 1.43, 33.67, 0.24, 1.53, 0, 8.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 175),
  ('banana-nanica', 'Banana-nanica', 'Frutas', 91.53, 1.4, 23.85, 0.12, 1.95, 0, 5.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 179),
  ('banana-prata', 'Banana-prata', 'Frutas', 98.25, 1.27, 25.96, 0.07, 2.04, 0, 6.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 182),
  ('goiaba-vermelha', 'Goiaba vermelha, com casca', 'Frutas', 54.17, 1.09, 13.01, 0.44, 6.22, 0, 8.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 200),
  ('kiwi-cru', 'Kiwi', 'Frutas', 51.14, 1.34, 11.5, 0.63, 2.65, 0, 19.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 207),
  ('laranja-pera', 'Laranja-pera', 'Frutas', 36.77, 1.04, 8.95, 0.13, 0.77, 0, 4.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 214),
  ('limao-tahiti', 'Limão-taiti', 'Frutas', 31.82, 0.94, 11.08, 0.14, 1.18, 1.25, 8.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 220),
  ('maca-fuji', 'Maçã Fuji, com casca', 'Frutas', 55.52, 0.29, 15.15, 0, 1.35, 0, 9.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 222),
  ('mamao-formosa', 'Mamão Formosa', 'Frutas', 45.34, 0.82, 11.55, 0.12, 1.81, 3.26, 5.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 225),
  ('amendoa-torrada', 'Amêndoa torrada', 'Gorduras e oleaginosas', 580.75, 18.55, 29.55, 47.32, 11.64, 278.52, 89.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 587),
  ('amendoim-cru', 'Amendoim cru', 'Gorduras e oleaginosas', 544.05, 27.19, 20.31, 43.85, 8.04, 0, 19.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 557),
  ('azeite-extravirgem', 'Azeite de oliva extravirgem', 'Gorduras e oleaginosas', 884, 0, 0, 100, 0, 0, 49.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 260),
  ('castanha-de-caju', 'Castanha de caju torrada', 'Gorduras e oleaginosas', 570.17, 18.51, 29.13, 46.28, 3.66, 125, 99.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 588),
  ('castanha-do-para', 'Castanha-do-pará', 'Gorduras e oleaginosas', 642.96, 14.54, 15.08, 63.46, 7.93, 0.65, 129.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 589),
  ('coco-cru', 'Coco fresco', 'Gorduras e oleaginosas', 406.49, 3.69, 10.4, 41.98, 5.38, 15.32, 14.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 590),
  ('gergelim', 'Gergelim', 'Gorduras e oleaginosas', 583.55, 21.16, 21.62, 50.43, 11.87, 2.58, 39.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 593),
  ('manteiga-sem-sal', 'Manteiga sem sal', 'Gorduras e oleaginosas', 757.54, 0.4, 0, 86.04, 0, 3.85, 59.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 262),
  ('oleo-de-canola', 'Óleo de canola', 'Gorduras e oleaginosas', 884, 0, 0, 100, 0, 0, 14.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 268),
  ('oleo-de-girassol', 'Óleo de girassol', 'Gorduras e oleaginosas', 884, 0, 0, 100, 0, 0, 12.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 269),
  ('oleo-de-soja', 'Óleo de soja', 'Gorduras e oleaginosas', 884, 0, 0, 100, 0, 0, 9.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 272),
  ('amido-de-milho', 'Amido de milho', 'Grãos e massas', 361.37, 0.6, 87.15, 0, 0.74, 8.08, 12.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 42),
  ('arroz-branco-cozido', 'Arroz branco cozido', 'Grãos e massas', 128.26, 2.52, 28.06, 0.23, 1.56, 1.2, 6.5, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 3),
  ('arroz-branco-cru', 'Arroz branco cru', 'Grãos e massas', 357.79, 7.16, 78.76, 0.34, 1.64, 1.02, 6.5, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 4),
  ('arroz-integral-cozido', 'Arroz integral cozido', 'Grãos e massas', 123.53, 2.59, 25.81, 1, 2.75, 1.24, 9.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 1),
  ('arroz-integral-cru', 'Arroz integral cru', 'Grãos e massas', 359.68, 7.32, 77.45, 1.86, 4.82, 1.65, 9.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 2),
  ('aveia-em-flocos', 'Aveia em flocos', 'Grãos e massas', 393.82, 13.92, 66.64, 8.5, 9.13, 4.63, 12.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 7),
  ('canjica-crua', 'Canjica branca', 'Grãos e massas', 357.6, 7.2, 78.06, 0.97, 5.5, 0.79, 8.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 19),
  ('cuscuz-de-milho', 'Cuscuz de milho pronto', 'Grãos e massas', 113, 2.2, 25.4, 0.4, 1.6, 190, 7.9, 'Média de rótulos', null),
  ('farinha-de-centeio', 'Farinha de centeio integral', 'Grãos e massas', 335.78, 12.52, 73.3, 1.75, 15.48, 41.38, 18.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 32),
  ('farinha-de-milho', 'Farinha de milho', 'Grãos e massas', 350.59, 7.19, 79.08, 1.47, 5.49, 44.93, 7.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 33),
  ('farinha-de-rosca', 'Farinha de rosca', 'Grãos e massas', 370.58, 11.38, 75.79, 1.46, 4.82, 332.5, 12.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 34),
  ('farinha-de-soja', 'Farinha de soja', 'Grãos e massas', 403.96, 36.03, 38.44, 14.63, 20.18, 5.75, 24.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 581),
  ('farinha-de-trigo', 'Farinha de trigo', 'Grãos e massas', 360.47, 9.79, 75.09, 1.37, 2.35, 0.74, 5.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 35),
  ('feijao-carioca-cozido', 'Feijão carioca cozido', 'Grãos e massas', 76.42, 4.78, 13.59, 0.54, 8.51, 1.76, 9.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 561),
  ('feijao-preto-cozido', 'Feijão preto cozido', 'Grãos e massas', 77.03, 4.48, 14.01, 0.54, 8.4, 1.85, 9.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 567),
  ('feijao-roxo-cozido', 'Feijão roxo cozido', 'Grãos e massas', 76.89, 5.72, 12.91, 0.54, 11.51, 1.46, 13.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 573),
  ('feijao-fradinho-cozido', 'Feijão-fradinho cozido', 'Grãos e massas', 78.01, 5.09, 13.5, 0.64, 7.47, 0.98, 12.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 563),
  ('fuba-de-milho', 'Fubá de milho', 'Grãos e massas', 353.48, 7.21, 78.87, 1.9, 4.71, 0, 6.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 43),
  ('tapioca-goma', 'Goma de tapioca hidratada', 'Grãos e massas', 240, 0.3, 59.5, 0.1, 0.6, 3, 12.9, 'Média de rótulos', null),
  ('grao-de-bico-cru', 'Grão-de-bico cru', 'Grãos e massas', 354.7, 21.23, 57.88, 5.43, 12.36, 5.19, 19.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 575),
  ('lentilha-cozida', 'Lentilha cozida', 'Grãos e massas', 92.64, 6.31, 16.3, 0.52, 7.86, 1.18, 14.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 577),
  ('macarrao-comum-cru', 'Macarrão de trigo cru', 'Grãos e massas', 371.12, 10, 77.94, 1.3, 2.93, 7.17, 7.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 40),
  ('macarrao-integral-cozido', 'Macarrão integral cozido', 'Grãos e massas', 124, 5.3, 26.5, 0.5, 3.9, 4, 12.9, 'Média de rótulos', null),
  ('massa-fresca-cozida', 'Massa fresca cozida', 'Grãos e massas', 163.76, 5.81, 32.52, 1.16, 1.64, 206.77, 16.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 37),
  ('milho-verde-cru', 'Milho verde', 'Grãos e massas', 138.17, 6.59, 28.56, 0.61, 3.92, 1.12, 13.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 44),
  ('nhoque-cozido', 'Nhoque de batata cozido', 'Grãos e massas', 180.78, 5.86, 36.78, 1.94, 1.78, 7.07, 17.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 136),
  ('pao-integral', 'Pão de forma integral', 'Grãos e massas', 253.19, 9.43, 49.94, 3.65, 6.88, 506.1, 15.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 52),
  ('polenta-pronta', 'Polenta pronta', 'Grãos e massas', 102.74, 2.29, 23.31, 0.3, 2.4, 441.89, 9.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 62),
  ('quinoa-cozida', 'Quinoa cozida', 'Grãos e massas', 120, 4.4, 21.3, 1.9, 2.8, 7, 39.9, 'Média de rótulos', null),
  ('creme-de-leite', 'Creme de leite', 'Laticínios', 221.48, 1.51, 4.51, 22.48, 0, 51.72, 19.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 447),
  ('creme-de-ricota-light', 'Creme de ricota light', 'Laticínios', 138, 9.8, 4.2, 9.1, 0, 430, 34.9, 'Média de rótulos', null),
  ('iogurte-natural-desnatado', 'Iogurte natural desnatado', 'Laticínios', 41.49, 3.83, 5.77, 0.32, 0, 59.64, 15.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 449),
  ('iogurte-natural', 'Iogurte natural integral', 'Laticínios', 51.49, 4.06, 1.92, 3.04, 0, 51.62, 13.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 448),
  ('leite-desnatado', 'Leite desnatado UHT', 'Laticínios', 35, 3.2, 4.9, 0.2, 0, 50, 5.5, 'Média de rótulos', null),
  ('leite-em-po-desnatado', 'Leite em pó desnatado', 'Laticínios', 361.61, 34.69, 53.04, 0.93, 0, 431.67, 44.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 456),
  ('queijo-cottage', 'Queijo cottage', 'Laticínios', 98, 12.4, 3.4, 4.3, 0, 380, 39.9, 'Média de rótulos', null),
  ('queijo-minas-frescal', 'Queijo minas frescal', 'Laticínios', 264.27, 17.41, 3.24, 20.18, 0, 31.23, 42.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 461),
  ('queijo-mucarela', 'Queijo muçarela', 'Laticínios', 329.87, 22.65, 3.05, 25.18, 0, 581.36, 44.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 463),
  ('queijo-parmesao', 'Queijo parmesão', 'Laticínios', 452.96, 35.55, 1.66, 33.53, 0, 1844.08, 89.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 464),
  ('queijo-prato', 'Queijo prato', 'Laticínios', 359.88, 22.66, 1.88, 29.11, 0, 579.77, 46.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 467),
  ('requeijao-cremoso', 'Requeijão cremoso', 'Laticínios', 256.58, 9.63, 2.43, 23.44, 0, 557.92, 29.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 468),
  ('requeijao-light', 'Requeijão light', 'Laticínios', 172, 10.4, 4.6, 12.3, 0, 510, 29.9, 'Média de rótulos', null),
  ('queijo-ricota', 'Ricota', 'Laticínios', 139.73, 12.6, 3.79, 8.11, 0, 282.58, 29.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 469),
  ('abobora-cabotia-cozida', 'Abóbora cabotiá cozida', 'Legumes e verduras', 48.04, 1.44, 10.76, 0.73, 2.46, 1.45, 5.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 64),
  ('abobora-moranga-crua', 'Abóbora moranga', 'Legumes e verduras', 12.36, 0.96, 2.67, 0.06, 1.7, 0, 4.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 67),
  ('abobrinha-cozida', 'Abobrinha cozida', 'Legumes e verduras', 15.04, 1.13, 2.98, 0.2, 1.59, 0.83, 6.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 70),
  ('abobrinha-crua', 'Abobrinha crua', 'Legumes e verduras', 19.28, 1.14, 4.29, 0.14, 1.35, 0, 6.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 71),
  ('acelga-crua', 'Acelga', 'Legumes e verduras', 20.94, 1.44, 4.63, 0.11, 1.12, 1.18, 9.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 74),
  ('agriao-cru', 'Agrião', 'Legumes e verduras', 16.58, 2.69, 2.25, 0.24, 2.14, 7.46, 17.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 75),
  ('alface-americana', 'Alface americana', 'Legumes e verduras', 8.79, 0.61, 1.75, 0.13, 1.02, 7.31, 14.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 77),
  ('alface-crespa', 'Alface crespa', 'Legumes e verduras', 10.68, 1.35, 1.7, 0.16, 1.83, 3.38, 12.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 78),
  ('alho-cru', 'Alho', 'Legumes e verduras', 113.13, 7.01, 23.91, 0.22, 4.32, 5.36, 29.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 82),
  ('alho-poro-cru', 'Alho-poró', 'Legumes e verduras', 31.51, 1.41, 6.88, 0.14, 2.51, 1.76, 16.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 83),
  ('batata-inglesa-cozida', 'Batata inglesa cozida', 'Legumes e verduras', 51.59, 1.16, 11.94, 0, 1.34, 2.29, 4.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 91),
  ('batata-baroa-cozida', 'Batata-baroa cozida', 'Legumes e verduras', 80.12, 0.85, 18.95, 0.17, 1.76, 2.1, 12.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 86),
  ('batata-doce-cozida', 'Batata-doce cozida', 'Legumes e verduras', 76.76, 0.64, 18.42, 0.09, 2.21, 2.7, 5.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 88),
  ('batata-doce-crua', 'Batata-doce crua', 'Legumes e verduras', 118.24, 1.26, 28.2, 0.13, 2.57, 8.77, 5.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 89),
  ('berinjela-cozida', 'Berinjela cozida', 'Legumes e verduras', 18.85, 0.68, 4.47, 0.15, 2.52, 1.33, 8.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 95),
  ('beterraba-cozida', 'Beterraba cozida', 'Legumes e verduras', 32.15, 1.29, 7.23, 0.09, 1.88, 22.76, 5.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 97),
  ('brocolis-cozido', 'Brócolis cozido', 'Legumes e verduras', 24.64, 2.13, 4.37, 0.46, 3.42, 2.12, 12.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 100),
  ('broto-de-feijao', 'Broto de feijão', 'Legumes e verduras', 38.72, 4.17, 7.76, 0.1, 1.97, 1.79, 14.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 125),
  ('cara-cozido', 'Cará cozido', 'Legumes e verduras', 77.58, 1.53, 18.85, 0.11, 2.63, 1.01, 8.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 102),
  ('cebola-crua', 'Cebola', 'Legumes e verduras', 39.42, 1.71, 8.85, 0.08, 2.19, 0.6, 5.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 107),
  ('cenoura-cozida', 'Cenoura cozida', 'Legumes e verduras', 29.86, 0.85, 6.69, 0.22, 2.63, 7.88, 5.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 109),
  ('cenoura-crua', 'Cenoura crua', 'Legumes e verduras', 34.14, 1.32, 7.66, 0.17, 3.18, 3.33, 5.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 110),
  ('champignon-conserva', 'Champignon em conserva', 'Legumes e verduras', 26, 2.2, 4.1, 0.3, 2, 380, 39.9, 'Média de rótulos', null),
  ('chuchu-cozido', 'Chuchu cozido', 'Legumes e verduras', 18.54, 0.41, 4.79, 0, 1.04, 1.81, 4.5, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 112),
  ('couve-flor-cozida', 'Couve-flor cozida', 'Legumes e verduras', 19.11, 1.24, 3.88, 0.27, 2.13, 1.79, 9.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 118),
  ('couve-manteiga-crua', 'Couve-manteiga crua', 'Legumes e verduras', 27.06, 2.87, 4.33, 0.55, 3.12, 6.17, 9.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 115),
  ('espinafre-cru', 'Espinafre cru', 'Legumes e verduras', 16.1, 2, 2.57, 0.24, 2.1, 17.09, 14.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 119),
  ('folha-de-mostarda', 'Folha de mostarda', 'Legumes e verduras', 18.11, 2.11, 3.24, 0.17, 1.89, 2.88, 11.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 135),
  ('inhame-cru', 'Inhame', 'Legumes e verduras', 96.7, 2.05, 23.23, 0.21, 1.65, 0, 7.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 126),
  ('jilo-cru', 'Jiló', 'Legumes e verduras', 27.37, 1.4, 6.19, 0.22, 4.83, 0, 9.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 127),
  ('mandioca-cozida', 'Mandioca cozida', 'Legumes e verduras', 125.36, 0.57, 30.09, 0.3, 1.56, 0.91, 4.5, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 129),
  ('maxixe-cru', 'Maxixe', 'Legumes e verduras', 13.75, 1.39, 2.73, 0.07, 2.19, 10.99, 8.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 134),
  ('milho-verde-conserva', 'Milho verde em conserva', 'Legumes e verduras', 98, 3.2, 19.8, 0.9, 2.6, 240, 13.9, 'Média de rótulos', null),
  ('nabo-cru', 'Nabo', 'Legumes e verduras', 18.19, 1.2, 4.15, 0.05, 2.64, 2.46, 7.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 137),
  ('pepino-cru', 'Pepino', 'Legumes e verduras', 9.53, 0.87, 2.04, 0, 1.12, 0, 6.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 142),
  ('pimentao-amarelo', 'Pimentão amarelo', 'Legumes e verduras', 27.93, 1.22, 5.96, 0.44, 1.92, 0, 14.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 143),
  ('pimentao-verde', 'Pimentão verde', 'Legumes e verduras', 21.29, 1.05, 4.89, 0.15, 2.56, 0, 9.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 144),
  ('pimentao-vermelho', 'Pimentão vermelho', 'Legumes e verduras', 23.28, 1.04, 5.47, 0.15, 1.59, 0, 12.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 145),
  ('quiabo-cru', 'Quiabo', 'Legumes e verduras', 29.94, 1.92, 6.37, 0.3, 4.55, 0.89, 11.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 147),
  ('rabanete-cru', 'Rabanete', 'Legumes e verduras', 13.74, 1.39, 2.73, 0.07, 2.19, 10.99, 12.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 148),
  ('repolho-cru', 'Repolho branco', 'Legumes e verduras', 17.12, 0.88, 3.86, 0.14, 1.89, 3.64, 4.5, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 149),
  ('repolho-roxo-cru', 'Repolho roxo', 'Legumes e verduras', 30.91, 1.91, 7.2, 0.06, 1.97, 2.34, 6.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 150),
  ('rucula-crua', 'Rúcula', 'Legumes e verduras', 13.13, 1.77, 2.22, 0.11, 1.74, 9.42, 19.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 152),
  ('tomate-cru', 'Tomate', 'Legumes e verduras', 15.34, 1.1, 3.14, 0.17, 1.17, 1.02, 7.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 157),
  ('vagem-cozida', 'Vagem cozida', 'Legumes e verduras', 25, 1.8, 5.3, 0.2, 2.4, 0, 12.9, 'TACO 4a ed. — valor da vagem crua', null),
  ('vagem-crua', 'Vagem crua', 'Legumes e verduras', 24.9, 1.79, 5.35, 0.17, 2.38, 0, 12.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 162),
  ('cebolinha-crua', 'Cebolinha', 'Molhos e temperos', 19.52, 1.87, 3.37, 0.35, 3.55, 1.6, 24.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 108),
  ('cheiro-verde', 'Cheiro-verde', 'Molhos e temperos', 27, 2.6, 4.6, 0.5, 2.7, 2, 24.9, 'Media de salsa e cebolinha (TACO 4a ed.)', null),
  ('extrato-de-tomate', 'Extrato de tomate', 'Molhos e temperos', 62, 2.9, 13.1, 0.3, 2.4, 480, 16.9, 'Média de rótulos', null),
  ('farinha-de-mandioca', 'Farinha de mandioca', 'Molhos e temperos', 360.87, 1.55, 87.9, 0.28, 6.39, 1.02, 8.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 121),
  ('manjericao-cru', 'Manjericão', 'Molhos e temperos', 21.15, 1.99, 3.64, 0.39, 3.31, 3.89, 29.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 133),
  ('molho-de-tomate-pronto', 'Molho de tomate pronto', 'Molhos e temperos', 38, 1.3, 7.4, 0.4, 1.3, 420, 9.9, 'Média de rótulos', null),
  ('sal-refinado', 'Sal refinado', 'Molhos e temperos', 0, 0, 0, 0, 0, 38758, 2.5, 'Composição do cloreto de sódio', null),
  ('salsa-crua', 'Salsa', 'Molhos e temperos', 33.42, 3.26, 5.71, 0.61, 1.85, 2.3, 24.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 153),
  ('atum-conserva-natural', 'Atum em conserva ao natural', 'Peixes e frutos do mar', 108, 23.6, 0, 1.2, 0, 320, 59.9, 'Média de rótulos', null),
  ('atum-fresco', 'Atum fresco', 'Peixes e frutos do mar', 117.5, 25.68, 0, 0.87, 0, 30.3, 69.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 278),
  ('bacalhau-salgado', 'Bacalhau salgado (antes de dessalgar)', 'Peixes e frutos do mar', 135.89, 29.04, 0, 1.32, 0, 13585.06, 99.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 279),
  ('camarao-cru', 'Camarão', 'Peixes e frutos do mar', 47.18, 9.99, 0, 0.5, 0, 201.13, 79.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 285),
  ('corvina-crua', 'Corvina do mar', 'Peixes e frutos do mar', 94, 18.57, 0, 1.58, 0, 67.97, 27.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 292),
  ('file-de-abadejo', 'Filé de abadejo', 'Peixes e frutos do mar', 59.11, 13.08, 0, 0.36, 0, 78.52, 34.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 275),
  ('file-de-merluza', 'Filé de merluza', 'Peixes e frutos do mar', 89.13, 16.61, 0, 2.02, 0, 79.5, 32.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 302),
  ('file-de-pescada', 'Filé de pescada', 'Peixes e frutos do mar', 107.21, 16.65, 0, 4, 0, 77.5, 29.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 307),
  ('file-de-tilapia', 'Filé de tilápia', 'Peixes e frutos do mar', 96, 20.1, 0, 1.7, 0, 52, 39.9, 'Média de rótulos', null),
  ('file-de-tucunare', 'Filé de tucunaré', 'Peixes e frutos do mar', 87.69, 17.96, 0, 1.22, 0, 56.55, 36.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 322),
  ('pintado-cru', 'Pintado', 'Peixes e frutos do mar', 91.08, 18.56, 0, 1.31, 0, 43.34, 44.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 312),
  ('posta-de-cacao', 'Posta de cação', 'Peixes e frutos do mar', 83.33, 17.85, 0, 0.79, 0, 176.02, 39.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 283),
  ('salmao-fresco', 'Salmão, sem pele', 'Peixes e frutos do mar', 169.78, 19.25, 0, 9.71, 0, 64.24, 89.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 316),
  ('sardinha-conserva-natural', 'Sardinha em conserva ao natural', 'Peixes e frutos do mar', 168, 21.8, 0, 8.9, 0, 390, 34.9, 'Média de rótulos', null),
  ('sardinha-fresca', 'Sardinha inteira', 'Peixes e frutos do mar', 113.9, 21.08, 0, 2.65, 0, 60.39, 24.9, 'TACO 4a ed. (NEPA/UNICAMP, 2011)', 321)
on conflict (slug) do update set
  nome = excluded.nome,
  categoria = excluded.categoria,
  kcal = excluded.kcal,
  proteina_g = excluded.proteina_g,
  carboidrato_g = excluded.carboidrato_g,
  gordura_g = excluded.gordura_g,
  fibra_g = excluded.fibra_g,
  sodio_mg = excluded.sodio_mg,
  fonte = excluded.fonte,
  taco_id = excluded.taco_id;

-- Entradas da primeira versão do seed que foram substituídas por medições mais
-- precisas. Só saem se nenhuma receita apontar para elas: ficha já montada não
-- pode perder ingrediente por causa de arrumação nossa.
delete from public.ingredients i
where i.slug in ('coxa-sobrecoxa-frango', 'carne-seca-dessalgada', 'macarrao-comum-cozido', 'grao-de-bico-cozido')
  and not exists (
    select 1 from public.recipe_ingredients ri where ri.ingredient_id = i.id
  )
  and not exists (
    select 1 from public.saved_calculations sc
    where sc.itens @> jsonb_build_array(jsonb_build_object('ingredient_id', i.id::text))
  );

-- Qualquer linha que sobrou fora desta migração fica com procedência explícita.
-- Um app que manda o usuário imprimir tabela nutricional não pode apresentar
-- número de origem desconhecida como se fosse medição de laboratório.
update public.ingredients
set fonte = 'Origem nao documentada — confira antes de usar em rotulo'
where fonte = 'Nao informada';
