"use server";

import { createServerClient } from "@/lib/supabase/server";
import type { AnalysisStatus } from "@/actions/analyzes/getAnalysisById";

export interface PipelineAnalysis {
  id: string;
  candidate_name: string | null;
  candidate_email: string | null;
  score: number;
  status: AnalysisStatus;
  recommendation: string | null;
  match: boolean | null;
  created_at: string | null;
  job_title: string | null;
}

export async function getPipelineAnalyses(): Promise<PipelineAnalysis[]> {
  const supabase = await createServerClient();

  const { data: analyses, error } = await supabase
    .from("candidate_analysis")
    .select(`
      id,
      candidate_name,
      candidate_email,
      score,
      status,
      recommendation,
      match,
      created_at,
      job_id
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar pipeline:", error);
    return [];
  }

  const jobIds = analyses
    .map((analysis) => analysis.job_id)
    .filter((id): id is string => Boolean(id));

  const { data: jobs } = await supabase
    .from("jobs")
    .select("id, title")
    .in("id", jobIds);

  return analyses.map((analysis) => {
    const job = jobs?.find((item) => item.id === analysis.job_id);

    return {
      id: analysis.id,
      candidate_name: analysis.candidate_name,
      candidate_email: analysis.candidate_email,
      score: analysis.score ?? 0,
      status: analysis.status ?? "pending",
      recommendation: analysis.recommendation,
      match: analysis.match,
      created_at: analysis.created_at,
      job_title: job?.title ?? null,
    };
  });
}