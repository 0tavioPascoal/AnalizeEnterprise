"use server";

import { createServerClient } from "@/lib/supabase/server";

export type AnalysisStatus = "pending" | "approved" | "rejected";

export interface AnalysisListItem {
  id: string;
  candidate_name: string | null;
  candidate_email: string | null;
  job_id: string;
  job_title: string | null;
  score: number;
  recommendation: string;
  match: boolean;
  status: AnalysisStatus;
  created_at: string | null;
}

interface CandidateAnalysisRow {
  id: string;
  candidate_name: string | null;
  candidate_email: string | null;
  job_id: string;
  score: number;
  recommendation: string;
  match: boolean;
  status: AnalysisStatus | null;
  created_at: string | null;
}

interface JobRow {
  id: string;
  title: string | null;
}

export async function getAnalyses(): Promise<AnalysisListItem[]> {
  const supabase = await createServerClient();

  const { data: analyses, error: analysesError } = await supabase
    .from("candidate_analysis")
    .select(
      `
      id,
      candidate_name,
      candidate_email,
      job_id,
      score,
      recommendation,
      match,
      status,
      created_at
    `,
    )
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (analysesError) {
    console.error("ANALYSES ERROR:", analysesError);
    return [];
  }

  const analysisRows = (analyses ?? []) as CandidateAnalysisRow[];

  const jobIds = [
    ...new Set(
      analysisRows
        .map((item) => item.job_id)
        .filter((id): id is string => Boolean(id)),
    ),
  ];

  if (jobIds.length === 0) {
    return analysisRows.map((analysis) => ({
      id: analysis.id,
      candidate_name: analysis.candidate_name,
      candidate_email: analysis.candidate_email,
      job_id: analysis.job_id,
      job_title: "Vaga não encontrada",
      score: analysis.score,
      recommendation: analysis.recommendation,
      match: analysis.match,
      status: analysis.status ?? "pending",
      created_at: analysis.created_at,
    }));
  }

  const { data: jobs, error: jobsError } = await supabase
    .from("jobs")
    .select("id, title")
    .in("id", jobIds);

  if (jobsError) {
    console.error("JOBS ERROR:", jobsError);
  }

  const jobRows = (jobs ?? []) as JobRow[];

  const jobTitleById = new Map<string, string | null>(
    jobRows.map((job) => [job.id, job.title]),
  );

  return analysisRows.map((analysis) => ({
    id: analysis.id,
    candidate_name: analysis.candidate_name,
    candidate_email: analysis.candidate_email,
    job_id: analysis.job_id,
    job_title: jobTitleById.get(analysis.job_id) ?? "Vaga não encontrada",
    score: analysis.score,
    recommendation: analysis.recommendation,
    match: analysis.match,
    status: analysis.status ?? "pending",
    created_at: analysis.created_at,
  }));
}