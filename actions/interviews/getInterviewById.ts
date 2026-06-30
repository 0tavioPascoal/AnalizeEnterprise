// src/actions/interviews/getInterviewById.ts

import { createServerClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

export interface InterviewGuideContent {
  summary?: string;
  interview_objective?: string;
  technical_questions?: string[];
  behavioral_questions?: string[];
  risk_questions?: string[];
  missing_skill_questions?: string[];
  scorecard?: {
    title: string;
    description: string;
    score_criteria: string;
  }[];
  final_recommendation_criteria?: string;
}

export interface InterviewGuideDetail {
  id: string;
  company_id: string;
  analysis_id: string;
  job_id: string | null;
  title: string;
  status: string;
  content: InterviewGuideContent;
  created_at: string | null;

  candidate_name: string | null;
  candidate_email: string | null;
  candidate_phone: string | null;
  analysis_score: number | null;
  job_title: string | null;
  job_seniority: string | null;
  job_contract_type: string | null;
}

function toInterviewGuideContent(value: unknown): InterviewGuideContent {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as InterviewGuideContent;
}

export async function getInterviewById(
  id: string,
): Promise<InterviewGuideDetail | null> {
  const supabase = await createServerClient();

  const { data: interview, error } = await supabase
    .from("interview_guides")
    .select("id, company_id, analysis_id, job_id, title, status, content, created_at")
    .eq("id", id)
    .single();

  if (error || !interview) {
    logger.error("interview.detail.failed", error, {
      interviewId: id,
    });
    return null;
  }

  const { data: analysis } = await supabase
    .from("candidate_analysis")
    .select("candidate_name, candidate_email, candidate_phone, score")
    .eq("id", interview.analysis_id)
    .maybeSingle();

  const { data: job } = interview.job_id
    ? await supabase
        .from("jobs")
        .select("title, seniority, contract_type")
        .eq("id", interview.job_id)
        .maybeSingle()
    : { data: null };

  return {
    id: interview.id,
    company_id: interview.company_id,
    analysis_id: interview.analysis_id,
    job_id: interview.job_id,
    title: interview.title,
    status: interview.status,
    content: toInterviewGuideContent(interview.content),
    created_at: interview.created_at,

    candidate_name: analysis?.candidate_name ?? null,
    candidate_email: analysis?.candidate_email ?? null,
    candidate_phone: analysis?.candidate_phone ?? null,
    analysis_score: analysis?.score ?? null,

    job_title: job?.title ?? null,
    job_seniority: job?.seniority ?? null,
    job_contract_type: job?.contract_type ?? null,
  };
}
