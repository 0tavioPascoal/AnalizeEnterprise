import type { Tables } from "@/types/supabase/database";

export type Job = Tables<"jobs">;

export interface JobFormData {
  title: string;
  seniority: string;
  contract_type: string;
  score_min: number;
  skills?: string;
  context: string;
}
