import type { Enums, Tables } from "@/types/supabase/database";

export type CandidateEmailTemplateType =
  Enums<"candidate_email_template_type">;

export type CandidateEmailTemplate = Tables<"candidate_email_templates">;

export interface UpsertCandidateEmailTemplateDTO {
  type: CandidateEmailTemplateType;
  subject: string;
  body: string;
}
