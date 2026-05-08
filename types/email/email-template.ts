export type CandidateEmailTemplateType = "approved" | "rejected";

export interface CandidateEmailTemplate {
  id: string;
  company_id: string;
  type: CandidateEmailTemplateType;
  subject: string;
  body: string;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface UpsertCandidateEmailTemplateDTO {
  type: CandidateEmailTemplateType;
  subject: string;
  body: string;
}