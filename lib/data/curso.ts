import { clienteAdmin } from "@/lib/supabase/server";
import type { Aula, Modulo } from "@/types/database";

export type AulaComProgresso = Aula & { concluida: boolean };

export type ModuloComAulas = Modulo & {
  aulas: AulaComProgresso[];
  totalAulas: number;
  aulasConcluidas: number;
  progresso: number;
};

export type ResumoDaTrilha = {
  modulos: ModuloComAulas[];
  totalAulas: number;
  aulasConcluidas: number;
  progresso: number;
  proximaAula: (AulaComProgresso & { moduloSlug: string; moduloTitulo: string }) | null;
};

/** Trilha completa com o progresso do perfil aplicado. */
export async function carregarTrilha(profileId: string): Promise<ResumoDaTrilha> {
  const supabase = clienteAdmin();

  const [modulosRes, aulasRes, progressoRes] = await Promise.all([
    supabase.from("modules").select("*").order("ordem"),
    supabase.from("lessons").select("*").order("ordem"),
    supabase
      .from("lesson_progress")
      .select("lesson_id, concluida")
      .eq("profile_id", profileId),
  ]);

  if (modulosRes.error) throw new Error(modulosRes.error.message);
  if (aulasRes.error) throw new Error(aulasRes.error.message);
  if (progressoRes.error) throw new Error(progressoRes.error.message);

  const concluidas = new Set(
    (progressoRes.data ?? [])
      .filter((linha) => linha.concluida)
      .map((linha) => linha.lesson_id)
  );

  const modulos: ModuloComAulas[] = (modulosRes.data ?? []).map((modulo) => {
    const aulas: AulaComProgresso[] = (aulasRes.data ?? [])
      .filter((aula) => aula.module_id === modulo.id)
      .map((aula) => ({ ...aula, concluida: concluidas.has(aula.id) }));

    const aulasConcluidas = aulas.filter((aula) => aula.concluida).length;

    return {
      ...modulo,
      aulas,
      totalAulas: aulas.length,
      aulasConcluidas,
      progresso: aulas.length > 0 ? aulasConcluidas / aulas.length : 0,
    };
  });

  const totalAulas = modulos.reduce((soma, m) => soma + m.totalAulas, 0);
  const aulasConcluidas = modulos.reduce((soma, m) => soma + m.aulasConcluidas, 0);

  let proximaAula: ResumoDaTrilha["proximaAula"] = null;
  for (const modulo of modulos) {
    const pendente = modulo.aulas.find((aula) => !aula.concluida);
    if (pendente) {
      proximaAula = {
        ...pendente,
        moduloSlug: modulo.slug,
        moduloTitulo: modulo.titulo,
      };
      break;
    }
  }

  return {
    modulos,
    totalAulas,
    aulasConcluidas,
    progresso: totalAulas > 0 ? aulasConcluidas / totalAulas : 0,
    proximaAula,
  };
}

export type AulaDetalhada = {
  aula: Aula;
  modulo: Modulo;
  concluida: boolean;
  anterior: { slug: string; titulo: string } | null;
  proxima: { slug: string; titulo: string } | null;
  posicao: number;
  totalNoModulo: number;
};

export async function carregarAula(
  profileId: string,
  moduloSlug: string,
  aulaSlug: string
): Promise<AulaDetalhada | null> {
  const supabase = clienteAdmin();

  const { data: modulo, error: erroModulo } = await supabase
    .from("modules")
    .select("*")
    .eq("slug", moduloSlug)
    .maybeSingle();

  if (erroModulo) throw new Error(erroModulo.message);
  if (!modulo) return null;

  const { data: aulas, error: erroAulas } = await supabase
    .from("lessons")
    .select("*")
    .eq("module_id", modulo.id)
    .order("ordem");

  if (erroAulas) throw new Error(erroAulas.message);

  const lista = aulas ?? [];
  const indice = lista.findIndex((item) => item.slug === aulaSlug);
  if (indice === -1) return null;

  const aula = lista[indice];

  const { data: progresso, error: erroProgresso } = await supabase
    .from("lesson_progress")
    .select("concluida")
    .eq("profile_id", profileId)
    .eq("lesson_id", aula.id)
    .maybeSingle();

  if (erroProgresso) throw new Error(erroProgresso.message);

  return {
    aula,
    modulo,
    concluida: progresso?.concluida ?? false,
    anterior:
      indice > 0
        ? { slug: lista[indice - 1].slug, titulo: lista[indice - 1].titulo }
        : null,
    proxima:
      indice < lista.length - 1
        ? { slug: lista[indice + 1].slug, titulo: lista[indice + 1].titulo }
        : null,
    posicao: indice + 1,
    totalNoModulo: lista.length,
  };
}
