"use server";

import { createServerClient } from "@/lib/supabase/server";

export type AnalysisStatus = "pending" | "approved" | "rejected";

export interface AnalysisDetail {
  id: string;
  company_id: string;
  job_id: string;

  candidate_name: string | null;
  candidate_email: string | null;
  candidate_phone: string | null;

  score: number;
  passed_minimum_score: boolean;
  match: boolean;
  recommendation: string;
  summary: string;
  status: AnalysisStatus;

  strengths: string[];
  weaknesses: string[];
  matched_skills: string[];
  missing_skills: string[];
  risks: string[];
  interview_questions: string[];

  seniority_assessment: string | null;
  contract_fit: string | null;
  final_opinion: string | null;

  technical_score: number | null;
  experience_score: number | null;
  seniority_score: number | null;
  context_fit_score: number | null;
  communication_score: number | null;

  ai_feedback: unknown;
  created_at: string | null;

  job_title: string | null;
  job_seniority: string | null;
  job_contract_type: string | null;

  resume_file_path: string | null;
  resume_file_name: string | null;
  resume_file_size: number | null;
  resume_mime_type: string | null;
}

type AiFeedback = {
  strengths?: unknown;
  weaknesses?: unknown;
  matched_skills?: unknown;
  missing_skills?: unknown;
  risks?: unknown;
  interview_questions?: unknown;
};

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === "string");
      }
    } catch {
      return [];
    }
  }

  return [];
}

function fallbackArray(
  columnValue: unknown,
  aiFeedback: AiFeedback | null,
  key: keyof AiFeedback,
): string[] {
  const fromColumn = toStringArray(columnValue);
  return fromColumn.length > 0 ? fromColumn : toStringArray(aiFeedback?.[key]);
}

export async function getAnalysisById(
  id: string,
): Promise<AnalysisDetail | null> {
  const supabase = await createServerClient();

  const { data: analysis, error } = await supabase
    .from("candidate_analysis")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !analysis) {
    console.error("Erro ao buscar análise:", error);
    return null;
  }

  const aiFeedback = analysis.ai_feedback as AiFeedback | null;

  const { data: job } = await supabase
    .from("jobs")
    .select("title, seniority, contract_type")
    .eq("id", analysis.job_id)
    .maybeSingle();

  return {
  id: analysis.id,
  company_id: analysis.company_id,
  job_id: analysis.job_id,

  candidate_name: analysis.candidate_name,
  candidate_email: analysis.candidate_email,
  candidate_phone: analysis.candidate_phone,

  score: analysis.score,
  passed_minimum_score: analysis.passed_minimum_score,
  match: analysis.match,
  recommendation: analysis.recommendation,
  summary: analysis.summary,
  status: analysis.status ?? "pending",

  strengths: fallbackArray(analysis.strengths, aiFeedback, "strengths"),
  weaknesses: fallbackArray(analysis.weaknesses, aiFeedback, "weaknesses"),
  matched_skills: fallbackArray(
    analysis.matched_skills,
    aiFeedback,
    "matched_skills",
  ),
  missing_skills: fallbackArray(
    analysis.missing_skills,
    aiFeedback,
    "missing_skills",
  ),
  risks: fallbackArray(analysis.risks, aiFeedback, "risks"),
  interview_questions: fallbackArray(
    analysis.interview_questions,
    aiFeedback,
    "interview_questions",
  ),

  seniority_assessment: analysis.seniority_assessment,
  contract_fit: analysis.contract_fit,
  final_opinion: analysis.final_opinion,

  technical_score: analysis.technical_score,
  experience_score: analysis.experience_score,
  seniority_score: analysis.seniority_score,
  context_fit_score: analysis.context_fit_score,
  communication_score: analysis.communication_score,

  ai_feedback: analysis.ai_feedback,
  created_at: analysis.created_at,

  job_title: job?.title ?? null,
  job_seniority: job?.seniority ?? null,
  job_contract_type: job?.contract_type ?? null,

  resume_file_path: analysis.resume_file_path ?? null,
  resume_file_name: analysis.resume_file_name ?? null,
  resume_file_size: analysis.resume_file_size ?? null,
  resume_mime_type: analysis.resume_mime_type ?? null,
};}