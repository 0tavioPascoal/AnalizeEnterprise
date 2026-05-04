export interface Job {
  id: string;
  title: string | null;
  context: string | null;
  score_min: number | null;
  created_at: string | null;
  company_id: string;
  contract_type: string | null;
  seniority: string | null;
  skills: string | null;
}