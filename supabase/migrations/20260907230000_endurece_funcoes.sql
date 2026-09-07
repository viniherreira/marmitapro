-- ---------------------------------------------------------------------------
-- MarmitaPRO — endurecimento das funções
-- ---------------------------------------------------------------------------
-- Corrige os apontamentos do linter de segurança do Supabase.
-- ---------------------------------------------------------------------------

-- 1. search_path fixo no gatilho de updated_at.
--    Sem isso, um schema malicioso no search_path do chamador poderia
--    sequestrar nomes resolvidos dentro da função.
create or replace function public.tocar_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 2. As funções auxiliares de RLS não são API pública.
--
--    `authenticated` mantém EXECUTE de propósito: políticas de RLS são
--    avaliadas com o papel de quem consulta, então revogar dele quebraria o
--    acesso do usuário aos próprios dados. O que elas devolvem é a identidade
--    do próprio chamador, não há vazamento entre usuários.
--
--    `anon` e `public` perdem o acesso: nenhuma política nossa é `to anon`.
revoke all on function public.clerk_user_id() from public, anon;
revoke all on function public.perfil_atual() from public, anon;
grant execute on function public.clerk_user_id() to authenticated;
grant execute on function public.perfil_atual() to authenticated;

comment on function public.perfil_atual() is
  'Id do perfil do usuario autenticado. Uso interno das politicas de RLS.';

-- 3. `rls_auto_enable` é o event trigger da plataforma que liga RLS em tabelas
--    novas. Event trigger dispara com privilégio próprio e não precisa de
--    EXECUTE por papel — tirar da API REST não afeta o funcionamento.
do $$
begin
  if exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'rls_auto_enable'
  ) then
    execute 'revoke all on function public.rls_auto_enable() from public, anon, authenticated';
  end if;
end
$$;
