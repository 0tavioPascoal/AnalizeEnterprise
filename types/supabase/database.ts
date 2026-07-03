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
      companies: {
        Row: {
          id: string;
          name: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          company_id: string;
          name: string | null;
          email: string | null;
          role: Database["public"]["Enums"]["user_role"];
          status: Database["public"]["Enums"]["user_status"];
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          company_id: string;
          name?: string | null;
          email?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
          status?: Database["public"]["Enums"]["user_status"];
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          company_id?: string;
          name?: string | null;
          email?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
          status?: Database["public"]["Enums"]["user_status"];
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
        ];
      };
      jobs: {
        Row: {
          id: string;
          title: string | null;
          context: string | null;
          score_min: number | null;
          created_at: string | null;
          company_id: string;
          contract_type: string | null;
          seniority: string | null;
          skills: string | null;
        };
        Insert: {
          id?: string;
          title?: string | null;
          context?: string | null;
          score_min?: number | null;
          created_at?: string | null;
          company_id: string;
          contract_type?: string | null;
          seniority?: string | null;
          skills?: string | null;
        };
        Update: {
          id?: string;
          title?: string | null;
          context?: string | null;
          score_min?: number | null;
          created_at?: string | null;
          company_id?: string;
          contract_type?: string | null;
          seniority?: string | null;
          skills?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "jobs_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
        ];
      };
      candidate_analysis: {
        Row: {
          id: string;
          company_id: string;
          job_id: string;
          candidate_name: string | null;
          candidate_email: string | null;
          candidate_phone: string | null;
          score: number | null;
          passed_minimum_score: boolean | null;
          match: boolean | null;
          recommendation: string | null;
          summary: string | null;
          status: Database["public"]["Enums"]["analysis_status"] | null;
          strengths: Json | null;
          weaknesses: Json | null;
          matched_skills: Json | null;
          missing_skills: Json | null;
          risks: Json | null;
          interview_questions: Json | null;
          seniority_assessment: string | null;
          contract_fit: string | null;
          final_opinion: string | null;
          technical_score: number | null;
          experience_score: number | null;
          seniority_score: number | null;
          context_fit_score: number | null;
          communication_score: number | null;
          ai_feedback: Json | null;
          pipeline_stage: Database["public"]["Enums"]["pipeline_stage"] | null;
          resume_file_path: string | null;
          resume_file_name: string | null;
          resume_file_size: number | null;
          resume_mime_type: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          company_id: string;
          job_id: string;
          candidate_name?: string | null;
          candidate_email?: string | null;
          candidate_phone?: string | null;
          score?: number | null;
          passed_minimum_score?: boolean | null;
          match?: boolean | null;
          recommendation?: string | null;
          summary?: string | null;
          status?: Database["public"]["Enums"]["analysis_status"] | null;
          strengths?: Json | null;
          weaknesses?: Json | null;
          matched_skills?: Json | null;
          missing_skills?: Json | null;
          risks?: Json | null;
          interview_questions?: Json | null;
          seniority_assessment?: string | null;
          contract_fit?: string | null;
          final_opinion?: string | null;
          technical_score?: number | null;
          experience_score?: number | null;
          seniority_score?: number | null;
          context_fit_score?: number | null;
          communication_score?: number | null;
          ai_feedback?: Json | null;
          pipeline_stage?: Database["public"]["Enums"]["pipeline_stage"] | null;
          resume_file_path?: string | null;
          resume_file_name?: string | null;
          resume_file_size?: number | null;
          resume_mime_type?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          company_id?: string;
          job_id?: string;
          candidate_name?: string | null;
          candidate_email?: string | null;
          candidate_phone?: string | null;
          score?: number | null;
          passed_minimum_score?: boolean | null;
          match?: boolean | null;
          recommendation?: string | null;
          summary?: string | null;
          status?: Database["public"]["Enums"]["analysis_status"] | null;
          strengths?: Json | null;
          weaknesses?: Json | null;
          matched_skills?: Json | null;
          missing_skills?: Json | null;
          risks?: Json | null;
          interview_questions?: Json | null;
          seniority_assessment?: string | null;
          contract_fit?: string | null;
          final_opinion?: string | null;
          technical_score?: number | null;
          experience_score?: number | null;
          seniority_score?: number | null;
          context_fit_score?: number | null;
          communication_score?: number | null;
          ai_feedback?: Json | null;
          pipeline_stage?: Database["public"]["Enums"]["pipeline_stage"] | null;
          resume_file_path?: string | null;
          resume_file_name?: string | null;
          resume_file_size?: number | null;
          resume_mime_type?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "candidate_analysis_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "candidate_analysis_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: false;
            referencedRelation: "jobs";
            referencedColumns: ["id"];
          },
        ];
      };
      interview_guides: {
        Row: {
          id: string;
          company_id: string;
          analysis_id: string;
          job_id: string | null;
          title: string;
          status: string;
          content: Json | null;
          created_by: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          company_id: string;
          analysis_id: string;
          job_id?: string | null;
          title: string;
          status?: string;
          content?: Json | null;
          created_by?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          company_id?: string;
          analysis_id?: string;
          job_id?: string | null;
          title?: string;
          status?: string;
          content?: Json | null;
          created_by?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "interview_guides_analysis_id_fkey";
            columns: ["analysis_id"];
            isOneToOne: false;
            referencedRelation: "candidate_analysis";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "interview_guides_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "interview_guides_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: false;
            referencedRelation: "jobs";
            referencedColumns: ["id"];
          },
        ];
      };
      candidate_email_templates: {
        Row: {
          id: string;
          company_id: string;
          type: Database["public"]["Enums"]["candidate_email_template_type"];
          subject: string;
          body: string;
          is_active: boolean;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          company_id: string;
          type: Database["public"]["Enums"]["candidate_email_template_type"];
          subject: string;
          body: string;
          is_active?: boolean;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          company_id?: string;
          type?: Database["public"]["Enums"]["candidate_email_template_type"];
          subject?: string;
          body?: string;
          is_active?: boolean;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "candidate_email_templates_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      analysis_status: "pending" | "approved" | "rejected";
      candidate_email_template_type: "approved" | "rejected";
      pipeline_stage: "new" | "screening" | "interview" | "approved" | "rejected";
      user_role: "admin" | "recruiter";
      user_status: "active" | "inactive";
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never;
