/**
 * Tipos do banco — GERADOS a partir do schema real do projeto Supabase.
 *
 * Regenerar após qualquer migration:
 *   npx supabase gen types typescript --project-id obibnxwuijhybpqjyrvx > types/database.ts
 *
 * Depois de regenerar, reponha o bloco de aliases de domínio no fim do arquivo.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ingredients: {
        Row: {
          carboidrato_g: number
          categoria: string
          created_at: string
          fibra_g: number
          fonte: string
          gordura_g: number
          id: string
          kcal: number
          nome: string
          preco_medio_kg: number
          proteina_g: number
          slug: string
          sodio_mg: number
          taco_id: number | null
        }
        Insert: {
          carboidrato_g: number
          categoria: string
          created_at?: string
          fibra_g?: number
          fonte?: string
          gordura_g: number
          id?: string
          kcal: number
          nome: string
          preco_medio_kg?: number
          proteina_g: number
          slug: string
          sodio_mg?: number
          taco_id?: number | null
        }
        Update: {
          carboidrato_g?: number
          categoria?: string
          created_at?: string
          fibra_g?: number
          fonte?: string
          gordura_g?: number
          id?: string
          kcal?: number
          nome?: string
          preco_medio_kg?: number
          proteina_g?: number
          slug?: string
          sodio_mg?: number
          taco_id?: number | null
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          concluida: boolean
          concluida_em: string
          id: string
          lesson_id: string
          profile_id: string
        }
        Insert: {
          concluida?: boolean
          concluida_em?: string
          id?: string
          lesson_id: string
          profile_id: string
        }
        Update: {
          concluida?: boolean
          concluida_em?: string
          id?: string
          lesson_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          conteudo: string
          created_at: string
          duracao_minutos: number
          id: string
          module_id: string
          ordem: number
          resumo: string
          slug: string
          titulo: string
          video_url: string | null
        }
        Insert: {
          conteudo: string
          created_at?: string
          duracao_minutos?: number
          id?: string
          module_id: string
          ordem: number
          resumo: string
          slug: string
          titulo: string
          video_url?: string | null
        }
        Update: {
          conteudo?: string
          created_at?: string
          duracao_minutos?: number
          id?: string
          module_id?: string
          ordem?: number
          resumo?: string
          slug?: string
          titulo?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          created_at: string
          descricao: string
          id: string
          ordem: number
          slug: string
          titulo: string
        }
        Insert: {
          created_at?: string
          descricao: string
          id?: string
          ordem: number
          slug: string
          titulo: string
        }
        Update: {
          created_at?: string
          descricao?: string
          id?: string
          ordem?: number
          slug?: string
          titulo?: string
        }
        Relationships: []
      }
      onboarding_answers: {
        Row: {
          created_at: string
          horas_por_semana: Database["public"]["Enums"]["faixa_horas"]
          id: string
          meta_de_renda: Database["public"]["Enums"]["faixa_meta_renda"]
          precificacao: Database["public"]["Enums"]["nivel_precificacao"]
          profile_id: string
          situacao: Database["public"]["Enums"]["situacao_venda"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          horas_por_semana: Database["public"]["Enums"]["faixa_horas"]
          id?: string
          meta_de_renda: Database["public"]["Enums"]["faixa_meta_renda"]
          precificacao: Database["public"]["Enums"]["nivel_precificacao"]
          profile_id: string
          situacao: Database["public"]["Enums"]["situacao_venda"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          horas_por_semana?: Database["public"]["Enums"]["faixa_horas"]
          id?: string
          meta_de_renda?: Database["public"]["Enums"]["faixa_meta_renda"]
          precificacao?: Database["public"]["Enums"]["nivel_precificacao"]
          profile_id?: string
          situacao?: Database["public"]["Enums"]["situacao_venda"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_answers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_scenarios: {
        Row: {
          created_at: string
          custo_embalagem: number
          custo_energia: number
          custo_ingredientes: number
          id: string
          margem_desejada: number
          minutos_mao_de_obra: number
          nome: string
          profile_id: string
          updated_at: string
          valor_hora: number
          volume_mensal: number
        }
        Insert: {
          created_at?: string
          custo_embalagem?: number
          custo_energia?: number
          custo_ingredientes?: number
          id?: string
          margem_desejada?: number
          minutos_mao_de_obra?: number
          nome: string
          profile_id: string
          updated_at?: string
          valor_hora?: number
          volume_mensal?: number
        }
        Update: {
          created_at?: string
          custo_embalagem?: number
          custo_energia?: number
          custo_ingredientes?: number
          id?: string
          margem_desejada?: number
          minutos_mao_de_obra?: number
          nome?: string
          profile_id?: string
          updated_at?: string
          valor_hora?: number
          volume_mensal?: number
        }
        Relationships: [
          {
            foreignKeyName: "pricing_scenarios_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          clerk_user_id: string
          created_at: string
          email: string | null
          id: string
          nome: string | null
          onboarding_concluido: boolean
          updated_at: string
        }
        Insert: {
          clerk_user_id: string
          created_at?: string
          email?: string | null
          id?: string
          nome?: string | null
          onboarding_concluido?: boolean
          updated_at?: string
        }
        Update: {
          clerk_user_id?: string
          created_at?: string
          email?: string | null
          id?: string
          nome?: string | null
          onboarding_concluido?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      recipe_ingredients: {
        Row: {
          id: string
          ingredient_id: string
          ordem: number
          quantidade_g: number
          recipe_id: string
        }
        Insert: {
          id?: string
          ingredient_id: string
          ordem?: number
          quantidade_g: number
          recipe_id: string
        }
        Update: {
          id?: string
          ingredient_id?: string
          ordem?: number
          quantidade_g?: number
          recipe_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          created_at: string
          descricao: string
          id: string
          imagem_url: string | null
          modo_preparo: string
          nome: string
          objetivo: Database["public"]["Enums"]["objetivo_receita"]
          profile_id: string | null
          publica: boolean
          rendimento_porcoes: number
          slug: string
          tempo_preparo_minutos: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao: string
          id?: string
          imagem_url?: string | null
          modo_preparo: string
          nome: string
          objetivo: Database["public"]["Enums"]["objetivo_receita"]
          profile_id?: string | null
          publica?: boolean
          rendimento_porcoes: number
          slug: string
          tempo_preparo_minutos?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao?: string
          id?: string
          imagem_url?: string | null
          modo_preparo?: string
          nome?: string
          objetivo?: Database["public"]["Enums"]["objetivo_receita"]
          profile_id?: string | null
          publica?: boolean
          rendimento_porcoes?: number
          slug?: string
          tempo_preparo_minutos?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_calculations: {
        Row: {
          carboidrato_total_g: number
          created_at: string
          custo_total: number
          gordura_total_g: number
          id: string
          itens: Json
          kcal_total: number
          nome: string
          porcoes: number
          profile_id: string
          proteina_total_g: number
          updated_at: string
        }
        Insert: {
          carboidrato_total_g?: number
          created_at?: string
          custo_total?: number
          gordura_total_g?: number
          id?: string
          itens?: Json
          kcal_total?: number
          nome: string
          porcoes?: number
          profile_id: string
          proteina_total_g?: number
          updated_at?: string
        }
        Update: {
          carboidrato_total_g?: number
          created_at?: string
          custo_total?: number
          gordura_total_g?: number
          id?: string
          itens?: Json
          kcal_total?: number
          nome?: string
          porcoes?: number
          profile_id?: string
          proteina_total_g?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_calculations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      clerk_user_id: { Args: never; Returns: string }
      perfil_atual: { Args: never; Returns: string }
    }
    Enums: {
      faixa_horas: "ate_5" | "de_5_a_15" | "de_15_a_30" | "acima_de_30"
      faixa_meta_renda:
        | "ate_1000"
        | "de_1000_a_3000"
        | "de_3000_a_6000"
        | "acima_de_6000"
      nivel_precificacao: "nao_sei" | "mais_ou_menos" | "sei_calcular"
      objetivo_receita: "low_carb" | "rica_proteina" | "economica"
      situacao_venda: "comecando" | "ja_vendo" | "escalando"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      faixa_horas: ["ate_5", "de_5_a_15", "de_15_a_30", "acima_de_30"],
      faixa_meta_renda: [
        "ate_1000",
        "de_1000_a_3000",
        "de_3000_a_6000",
        "acima_de_6000",
      ],
      nivel_precificacao: ["nao_sei", "mais_ou_menos", "sei_calcular"],
      objetivo_receita: ["low_carb", "rica_proteina", "economica"],
      situacao_venda: ["comecando", "ja_vendo", "escalando"],
    },
  },
} as const

/* ------------------------------------------------------------------------ */
/*  Aliases de domínio — escritos à mão, em português, sobre o tipo gerado.  */
/*  Reponha este bloco depois de regerar o arquivo.                          */
/* ------------------------------------------------------------------------ */

export type SituacaoVenda = Database["public"]["Enums"]["situacao_venda"];
export type FaixaHoras = Database["public"]["Enums"]["faixa_horas"];
export type FaixaMetaRenda = Database["public"]["Enums"]["faixa_meta_renda"];
export type NivelPrecificacao =
  Database["public"]["Enums"]["nivel_precificacao"];
export type ObjetivoReceita = Database["public"]["Enums"]["objetivo_receita"];

/** Forma de cada item guardado em saved_calculations.itens (jsonb). */
export type ItemDeCalculo = {
  ingredient_id: string;
  nome: string;
  gramas: number;
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
export type CenarioDePreco = Tabelas<"pricing_scenarios">;

/** `itens` vem como Json do gerador; aqui recuperamos a forma real. */
export type CalculoSalvo = Omit<Tabelas<"saved_calculations">, "itens"> & {
  itens: ItemDeCalculo[];
};
