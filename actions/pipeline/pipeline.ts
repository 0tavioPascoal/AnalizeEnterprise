"use server";

import { createServerClient } from "@/lib/supabase/server";
import type { AnalysisStatus } from "@/actions/analyzes/getAnalysisById";

export type PipelineStage =
  | "new"
  | "screening"
  | "interview"
  | "approved"
  | "rejected";

export interface PipelineAnalysis {
  id: string;
  candidate_name: string | null;
  candidate_email: string | null;
  score: number;
  status: AnalysisStatus;
  pipeline_stage: PipelineStage;
  recommendation: string | null;
  match: boolean | null;
  created_at: string | null;
  job_title: string | null;
  interview_id: string | null;
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
      pipeline_stage,
      recommendation,
      match,
      created_at,
      job_id
    `)
    .order("created_at", { ascending: false });

  if (error || !analyses) {
    console.error("Erro ao buscar pipeline:", error);
    return [];
  }

  const jobIds = analyses
    .map((analysis) => analysis.job_id)
    .filter((id): id is string => Boolean(id));

  const analysisIds = analyses.map((analysis) => analysis.id);

  const { data: jobs } = jobIds.length
    ? await supabase.from("jobs").select("id, title").in("id", jobIds)
    : { data: [] };

  const { data: interviews } = analysisIds.length
    ? await supabase
        .from("interview_guides")
        .select("id, analysis_id")
        .in("analysis_id", analysisIds)
    : { data: [] };

  return analyses.map((analysis) => {
    const job = jobs?.find((item) => item.id === analysis.job_id);

    const interview = interviews?.find(
      (item) => item.analysis_id === analysis.id,
    );

    return {
      id: analysis.id,
      candidate_name: analysis.candidate_name,
      candidate_email: analysis.candidate_email,
      score: analysis.score ?? 0,
      status: analysis.status ?? "pending",
      pipeline_stage:
        (analysis.pipeline_stage as PipelineStage | null) ??
        getDefaultStageByStatus(analysis.status),
      recommendation: analysis.recommendation,
      match: analysis.match,
      created_at: analysis.created_at,
      job_title: job?.title ?? null,
      interview_id: interview?.id ?? null,
    };
  });
}

function getDefaultStageByStatus(
  status: AnalysisStatus | null,
): PipelineStage {
  if (status === "approved") return "approved";
  if (status === "rejected") return "rejected";

  return "screening";
}