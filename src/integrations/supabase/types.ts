export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      assessment_audit: {
        Row: {
          action: string
          assessment_id: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          timestamp: string
          user_id: string
          user_name: string
        }
        Insert: {
          action: string
          assessment_id: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          timestamp?: string
          user_id: string
          user_name: string
        }
        Update: {
          action?: string
          assessment_id?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          timestamp?: string
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_audit_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          allowed_question_types: Database["public"]["Enums"]["question_type"][]
          bloom_l1: number
          bloom_l2: number
          bloom_l3: number
          bloom_l4: number
          bloom_l5: number
          bloom_l6: number
          blueprint_id: string | null
          blueprint_name: string | null
          chapters: string[] | null
          created_at: string
          created_by: string
          created_by_name: string
          created_by_role: string
          download_count: number
          duration: number | null
          grade: number
          has_manual_questions: boolean | null
          id: string
          learning_outcomes: string[] | null
          manual_questions_count: number | null
          manual_questions_data: Json | null
          medium: string
          mode: Database["public"]["Enums"]["assessment_mode"]
          pdf_hash: string | null
          pdf_url: string | null
          question_ids: string[] | null
          repository: Database["public"]["Enums"]["repository_type"]
          source: Database["public"]["Enums"]["assessment_source"]
          status: Database["public"]["Enums"]["assessment_status"]
          title: string
          total_marks: number | null
          total_questions: number
          updated_at: string
        }
        Insert: {
          allowed_question_types: Database["public"]["Enums"]["question_type"][]
          bloom_l1?: number
          bloom_l2?: number
          bloom_l3?: number
          bloom_l4?: number
          bloom_l5?: number
          bloom_l6?: number
          blueprint_id?: string | null
          blueprint_name?: string | null
          chapters?: string[] | null
          created_at?: string
          created_by: string
          created_by_name: string
          created_by_role: string
          download_count?: number
          duration?: number | null
          grade: number
          has_manual_questions?: boolean | null
          id?: string
          learning_outcomes?: string[] | null
          manual_questions_count?: number | null
          manual_questions_data?: Json | null
          medium: string
          mode?: Database["public"]["Enums"]["assessment_mode"]
          pdf_hash?: string | null
          pdf_url?: string | null
          question_ids?: string[] | null
          repository?: Database["public"]["Enums"]["repository_type"]
          source: Database["public"]["Enums"]["assessment_source"]
          status?: Database["public"]["Enums"]["assessment_status"]
          title: string
          total_marks?: number | null
          total_questions: number
          updated_at?: string
        }
        Update: {
          allowed_question_types?: Database["public"]["Enums"]["question_type"][]
          bloom_l1?: number
          bloom_l2?: number
          bloom_l3?: number
          bloom_l4?: number
          bloom_l5?: number
          bloom_l6?: number
          blueprint_id?: string | null
          blueprint_name?: string | null
          chapters?: string[] | null
          created_at?: string
          created_by?: string
          created_by_name?: string
          created_by_role?: string
          download_count?: number
          duration?: number | null
          grade?: number
          has_manual_questions?: boolean | null
          id?: string
          learning_outcomes?: string[] | null
          manual_questions_count?: number | null
          manual_questions_data?: Json | null
          medium?: string
          mode?: Database["public"]["Enums"]["assessment_mode"]
          pdf_hash?: string | null
          pdf_url?: string | null
          question_ids?: string[] | null
          repository?: Database["public"]["Enums"]["repository_type"]
          source?: Database["public"]["Enums"]["assessment_source"]
          status?: Database["public"]["Enums"]["assessment_status"]
          title?: string
          total_marks?: number | null
          total_questions?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessments_blueprint_id_fkey"
            columns: ["blueprint_id"]
            isOneToOne: false
            referencedRelation: "blueprints"
            referencedColumns: ["id"]
          },
        ]
      }
      blueprint_audit: {
        Row: {
          action: string
          blueprint_id: string
          diff: Json | null
          id: string
          timestamp: string
          user_id: string
          user_name: string
        }
        Insert: {
          action: string
          blueprint_id: string
          diff?: Json | null
          id?: string
          timestamp?: string
          user_id: string
          user_name: string
        }
        Update: {
          action?: string
          blueprint_id?: string
          diff?: Json | null
          id?: string
          timestamp?: string
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "blueprint_audit_blueprint_id_fkey"
            columns: ["blueprint_id"]
            isOneToOne: false
            referencedRelation: "blueprints"
            referencedColumns: ["id"]
          },
        ]
      }
      blueprints: {
        Row: {
          allowed_question_types: Database["public"]["Enums"]["question_type"][]
          bloom_l1: number
          bloom_l2: number
          bloom_l3: number
          bloom_l4: number
          bloom_l5: number
          bloom_l6: number
          created_at: string
          created_by: string
          duration: number | null
          id: string
          is_active: boolean
          mode: Database["public"]["Enums"]["assessment_mode"]
          name: string
          total_marks: number | null
          total_questions: number
          updated_at: string
          version: number
        }
        Insert: {
          allowed_question_types: Database["public"]["Enums"]["question_type"][]
          bloom_l1?: number
          bloom_l2?: number
          bloom_l3?: number
          bloom_l4?: number
          bloom_l5?: number
          bloom_l6?: number
          created_at?: string
          created_by: string
          duration?: number | null
          id?: string
          is_active?: boolean
          mode?: Database["public"]["Enums"]["assessment_mode"]
          name: string
          total_marks?: number | null
          total_questions: number
          updated_at?: string
          version?: number
        }
        Update: {
          allowed_question_types?: Database["public"]["Enums"]["question_type"][]
          bloom_l1?: number
          bloom_l2?: number
          bloom_l3?: number
          bloom_l4?: number
          bloom_l5?: number
          bloom_l6?: number
          created_at?: string
          created_by?: string
          duration?: number | null
          id?: string
          is_active?: boolean
          mode?: Database["public"]["Enums"]["assessment_mode"]
          name?: string
          total_marks?: number | null
          total_questions?: number
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      chapters: {
        Row: {
          chapter_number: number
          created_at: string
          id: string
          marks_weightage: number | null
          name: string
          periods: number | null
          subject_id: string
          unit_name: string | null
          updated_at: string
        }
        Insert: {
          chapter_number: number
          created_at?: string
          id?: string
          marks_weightage?: number | null
          name: string
          periods?: number | null
          subject_id: string
          unit_name?: string | null
          updated_at?: string
        }
        Update: {
          chapter_number?: number
          created_at?: string
          id?: string
          marks_weightage?: number | null
          name?: string
          periods?: number | null
          subject_id?: string
          unit_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapters_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_outcomes: {
        Row: {
          bloom_level: number
          chapter_id: string
          created_at: string
          id: string
          outcome_text: string
          updated_at: string
        }
        Insert: {
          bloom_level: number
          chapter_id: string
          created_at?: string
          id?: string
          outcome_text: string
          updated_at?: string
        }
        Update: {
          bloom_level?: number
          chapter_id?: string
          created_at?: string
          id?: string
          outcome_text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_outcomes_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          board: string
          created_at: string
          grade: number
          id: string
          medium: string
          name: string
          updated_at: string
        }
        Insert: {
          board?: string
          created_at?: string
          grade: number
          id?: string
          medium?: string
          name: string
          updated_at?: string
        }
        Update: {
          board?: string
          created_at?: string
          grade?: number
          id?: string
          medium?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      theme_audit: {
        Row: {
          action: string
          field_changes: Json | null
          id: string
          theme_id: string
          timestamp: string
          user_id: string
          user_name: string
        }
        Insert: {
          action: string
          field_changes?: Json | null
          id?: string
          theme_id: string
          timestamp?: string
          user_id: string
          user_name: string
        }
        Update: {
          action?: string
          field_changes?: Json | null
          id?: string
          theme_id?: string
          timestamp?: string
          user_id?: string
          user_name?: string
        }
        Relationships: []
      }
      themes: {
        Row: {
          background_url: string | null
          button_color: string
          created_at: string
          created_by: string
          id: string
          logo_url: string | null
          primary_color: string
          secondary_color: string
          state_name: string
          updated_at: string
        }
        Insert: {
          background_url?: string | null
          button_color?: string
          created_at?: string
          created_by: string
          id?: string
          logo_url?: string | null
          primary_color?: string
          secondary_color?: string
          state_name: string
          updated_at?: string
        }
        Update: {
          background_url?: string | null
          button_color?: string
          created_at?: string
          created_by?: string
          id?: string
          logo_url?: string | null
          primary_color?: string
          secondary_color?: string
          state_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          created_at: string
          grade: number
          id: string
          mini_course_id: string | null
          mini_course_name: string | null
          mini_course_sequence: string | null
          node_description: string | null
          node_ids: string | null
          sub_topic: string | null
          sub_topic_vernacular: string | null
          subject: string
          topic: string
          topic_id: string | null
          topic_vernacular: string | null
          updated_at: string
          video_id: string | null
          video_medium: string | null
          video_name: string
          video_provider: string | null
          video_tags_keywords: string | null
          video_tags_keywords_vernacular: string | null
          youtube_channel: string | null
          youtube_url: string
        }
        Insert: {
          created_at?: string
          grade: number
          id?: string
          mini_course_id?: string | null
          mini_course_name?: string | null
          mini_course_sequence?: string | null
          node_description?: string | null
          node_ids?: string | null
          sub_topic?: string | null
          sub_topic_vernacular?: string | null
          subject: string
          topic: string
          topic_id?: string | null
          topic_vernacular?: string | null
          updated_at?: string
          video_id?: string | null
          video_medium?: string | null
          video_name: string
          video_provider?: string | null
          video_tags_keywords?: string | null
          video_tags_keywords_vernacular?: string | null
          youtube_channel?: string | null
          youtube_url: string
        }
        Update: {
          created_at?: string
          grade?: number
          id?: string
          mini_course_id?: string | null
          mini_course_name?: string | null
          mini_course_sequence?: string | null
          node_description?: string | null
          node_ids?: string | null
          sub_topic?: string | null
          sub_topic_vernacular?: string | null
          subject?: string
          topic?: string
          topic_id?: string | null
          topic_vernacular?: string | null
          updated_at?: string
          video_id?: string | null
          video_medium?: string | null
          video_name?: string
          video_provider?: string | null
          video_tags_keywords?: string | null
          video_tags_keywords_vernacular?: string | null
          youtube_channel?: string | null
          youtube_url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      assessment_mode: "FA" | "SA"
      assessment_source: "Automated" | "Customised" | "CSV Upload" | "OCR"
      assessment_status: "Generated" | "Assigned" | "Archived"
      question_type:
        | "MCQ"
        | "FITB"
        | "TF"
        | "Match"
        | "Short-Answer"
        | "Long-Answer"
        | "RC"
      repository_type: "Public" | "Private"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      assessment_mode: ["FA", "SA"],
      assessment_source: ["Automated", "Customised", "CSV Upload", "OCR"],
      assessment_status: ["Generated", "Assigned", "Archived"],
      question_type: [
        "MCQ",
        "FITB",
        "TF",
        "Match",
        "Short-Answer",
        "Long-Answer",
        "RC",
      ],
      repository_type: ["Public", "Private"],
    },
  },
} as const
