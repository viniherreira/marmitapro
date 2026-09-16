-- Liga cada receita a sua foto de capa (public/receitas/<slug>.webp).
-- Antes isso so existia no banco, gravado por scripts/aplicar-fotos.mjs;
-- aqui fica versionado e vale para qualquer ambiente novo.
update public.recipes r
set imagem_url = '/receitas/' || r.slug || '.webp'
where r.slug in (
  'abobrinha-recheada-com-carne-moida',
  'almondegas-ao-sugo-com-macarrao-integral',
  'baiao-de-dois-com-frango',
  'berinjela-recheada-com-frango',
  'bife-acebolado-arroz-integral-vagem',
  'cacao-em-posta-com-cuscuz',
  'camarao-na-moranga',
  'carne-moida-com-abobrinha-e-arroz',
  'carne-salteada-com-brocolis-e-champignon',
  'cuscuz-nordestino-com-ovo-e-queijo',
  'escondidinho-de-abobora-com-carne-moida',
  'escondidinho-de-frango-com-mandioca',
  'feijoada-light-de-lentilha',
  'figado-acebolado-com-arroz-e-couve',
  'frango-com-quiabo-e-pure-de-couve-flor',
  'frango-desfiado-com-pure-de-batata-doce',
  'frango-ensopado-com-batata-e-cenoura',
  'frango-grelhado-arroz-integral-brocolis',
  'merluza-com-crosta-de-castanha',
  'omelete-de-forno-com-legumes',
  'ovos-mexidos-com-polenta-cremosa',
  'panqueca-de-carne-com-molho',
  'peito-de-peru-com-quinoa',
  'salmao-com-pure-de-couve-flor',
  'sardinha-assada-com-salada-morna',
  'strogonoff-fit-de-frango',
  'tilapia-ao-forno-com-legumes',
  'torta-de-frango-sem-massa'
);
