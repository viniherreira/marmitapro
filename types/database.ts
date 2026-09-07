/**
 * Tipos do banco, espelhando supabase/migrations.
 *
 * Regenerar após qualquer migration:
 *   npx supabase gen types typescript --project-id <ref> > types/database.ts
 */

export type SituacaoVenda = "comecando" | "ja_vendo" | "escalando";

export type FaixaHoras = "ate_5" | "de_5_a_15" | "de_15_a_30" | "acima_de_30";

export type FaixaMetaRenda =
  | "ate_1000"
  | "de_1000_a_3000"
  | "de_3000_a_6000"
  | "acima_de_6000";

export type NivelPrecificacao = "nao_sei" | "mais_ou_menos" | "sei_calcular";

export type ObjetivoReceita = "low_carb" | "rica_proteina" | "economica";

export type ItemDeCalculo = {
  ingredient_id: string;
  nome: string;
  gramas: number;
};

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          clerk_user_id: string;
          email: string | null;
          nome: string | null;
          onboarding_concluido: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clerk_user_id: string;
          email?: string | null;
          nome?: string | null;
          onboarding_concluido?: boolean;
        };
        Update: {
          email?: string | null;
          nome?: string | null;
          onboarding_concluido?: boolean;
        };
        Relationships: [];
      };
      onboarding_answers: {
        Row: {
          id: string;
          profile_id: string;
          situacao: SituacaoVenda;
          horas_por_semana: FaixaHoras;
          meta_de_renda: FaixaMetaRenda;
          precificacao: NivelPrecificacao;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          situacao: SituacaoVenda;
          horas_por_semana: FaixaHoras;
          meta_de_renda: FaixaMetaRenda;
          precificacao: NivelPrecificacao;
        };
        Update: {
          situacao?: SituacaoVenda;
          horas_por_semana?: FaixaHoras;
          meta_de_renda?: FaixaMetaRenda;
          precificacao?: NivelPrecificacao;
        };
        Relationships: [];
      };
      modules: {
        Row: {
          id: string;
          slug: string;
          titulo: string;
          descricao: string;
          ordem: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          titulo: string;
          descricao: string;
          ordem: number;
        };
        Update: {
          titulo?: string;
          descricao?: string;
          ordem?: number;
        };
        Relationships: [];
      };
      lessons: {
        Row: {
          id: string;
          module_id: string;
          slug: string;
          titulo: string;
          resumo: string;
          conteudo: string;
          video_url: string | null;
          duracao_minutos: number;
          ordem: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          module_id: string;
          slug: string;
          titulo: string;
          resumo: string;
          conteudo: string;
          video_url?: string | null;
          duracao_minutos?: number;
          ordem: number;
        };
        Update: {
          titulo?: string;
          resumo?: string;
          conteudo?: string;
          video_url?: string | null;
          duracao_minutos?: number;
          ordem?: number;
        };
        Relationships: [];
      };
      lesson_progress: {
        Row: {
          id: string;
          profile_id: string;
          lesson_id: string;
          concluida: boolean;
          concluida_em: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          lesson_id: string;
          concluida?: boolean;
          concluida_em?: string;
        };
        Update: {
          concluida?: boolean;
          concluida_em?: string;
        };
        Relationships: [];
      };
      ingredients: {
        Row: {
          id: string;
          slug: string;
          nome: string;
          categoria: string;
          kcal: number;
          proteina_g: number;
          carboidrato_g: number;
          gordura_g: number;
          preco_medio_kg: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          nome: string;
          categoria: string;
          kcal: number;
          proteina_g: number;
          carboidrato_g: number;
          gordura_g: number;
          preco_medio_kg?: number;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      recipes: {
        Row: {
          id: string;
          slug: string;
          nome: string;
          descricao: string;
          objetivo: ObjetivoReceita;
          modo_preparo: string;
          rendimento_porcoes: number;
          tempo_preparo_minutos: number;
          imagem_url: string | null;
          publica: boolean;
          profile_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          nome: string;
          descricao: string;
          objetivo: ObjetivoReceita;
          modo_preparo: string;
          rendimento_porcoes: number;
          tempo_preparo_minutos?: number;
          imagem_url?: string | null;
          publica?: boolean;
          profile_id?: string | null;
        };
        Update: {
          nome?: string;
          descricao?: string;
          objetivo?: ObjetivoReceita;
          modo_preparo?: string;
          rendimento_porcoes?: number;
          tempo_preparo_minutos?: number;
          imagem_url?: string | null;
          publica?: boolean;
        };
        Relationships: [];
      };
      recipe_ingredients: {
        Row: {
          id: string;
          recipe_id: string;
          ingredient_id: string;
          quantidade_g: number;
          ordem: number;
        };
        Insert: {
          id?: string;
          recipe_id: string;
          ingredient_id: string;
          quantidade_g: number;
          ordem?: number;
        };
        Update: {
          quantidade_g?: number;
          ordem?: number;
        };
        Relationships: [];
      };
      saved_calculations: {
        Row: {
          id: string;
          profile_id: string;
          nome: string;
          porcoes: number;
          itens: ItemDeCalculo[];
          kcal_total: number;
          proteina_total_g: number;
          carboidrato_total_g: number;
          gordura_total_g: number;
          custo_total: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          nome: string;
          porcoes: number;
          itens: ItemDeCalculo[];
          kcal_total: number;
          proteina_total_g: number;
          carboidrato_total_g: number;
          gordura_total_g: number;
          custo_total: number;
        };
        Update: {
          nome?: string;
          porcoes?: number;
          itens?: ItemDeCalculo[];
        };
        Relationships: [];
      };
      pricing_scenarios: {
        Row: {
          id: string;
          profile_id: string;
          nome: string;
          custo_ingredientes: number;
          custo_embalagem: number;
          custo_energia: number;
          minutos_mao_de_obra: number;
          valor_hora: number;
          margem_desejada: number;
          volume_mensal: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          nome: string;
          custo_ingredientes: number;
          custo_embalagem: number;
          custo_energia: number;
          minutos_mao_de_obra: number;
          valor_hora: number;
          margem_desejada: number;
          volume_mensal: number;
        };
        Update: {
          nome?: string;
          custo_ingredientes?: number;
          custo_embalagem?: number;
          custo_energia?: number;
          minutos_mao_de_obra?: number;
          valor_hora?: number;
          margem_desejada?: number;
          volume_mensal?: number;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      situacao_venda: SituacaoVenda;
      faixa_horas: FaixaHoras;
      faixa_meta_renda: FaixaMetaRenda;
      nivel_precificacao: NivelPrecificacao;
      objetivo_receita: ObjetivoReceita;
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Tabelas<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type Perfil = Tabelas<"profiles">;
export type RespostasOnboarding = Tabelas<"onboarding_answers">;
export type Modulo = Tabelas<"modules">;
export type Aula = Tabelas<"lessons">;
export type ProgressoAula = Tabelas<"lesson_progress">;
export type Ingrediente = Tabelas<"ingredients">;
export type Receita = Tabelas<"recipes">;
export type IngredienteDaReceita = Tabelas<"recipe_ingredients">;
export type CalculoSalvo = Tabelas<"saved_calculations">;
export type CenarioDePreco = Tabelas<"pricing_scenarios">;
