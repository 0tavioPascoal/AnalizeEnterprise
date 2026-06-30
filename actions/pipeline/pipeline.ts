"use server";

import { createServerClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
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

export interface PipelineJobOption {
  label: string;
  value: string;
}

export interface PipelineStageCount {
  stage: PipelineStage;
  total: number;
}

export interface GetPipelineAnalysesParams {
  page?: number;
  pageSize?: number;
  stage?: PipelineStage;
  search?: string;
  jobId?: string;
}

export interface PipelineResult {
  items: PipelineAnalysis[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  stageCounts: PipelineStageCount[];
  jobOptions: PipelineJobOption[];
  filters: {
    stage: PipelineStage;
    search: string;
    jobId: string;
  };
}

const DEFAULT_PAGE_SIZE = 8;
const DEFAULT_STAGE: PipelineStage = "screening";
const STAGE_OPTIONS: PipelineStage[] = [
  "screening",
  "interview",
  "approved",
  "rejected",
];

type PipelineFilterQuery<T> = T & {
  eq(column: string, value: unknown): PipelineFilterQuery<T>;
  or(filters: string): PipelineFilterQuery<T>;
};

export async function getPipelineAnalyses({
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  stage = DEFAULT_STAGE,
  search = "",
  jobId = "all",
}: GetPipelineAnalysesParams = {}): Promise<PipelineResult> {
  const supabase = await createServerClient();
  const safePage = Math.max(1, page);
  const from = (safePage - 1) * pageSize;
  const to = from + pageSize - 1;
  const normalizedSearch = search.trim();
  const activeStage = STAGE_OPTIONS.includes(stage) ? stage : DEFAULT_STAGE;

  let query = supabase
    .from("candidate_analysis")
    .select(
      `
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
    `,
      { count: "exact" },
    );

  query = applyPipelineFilters(query, {
    stage: activeStage,
    search: normalizedSearch,
    jobId,
  });

  const [
    analysesResult,
    jobsResult,
    stageCounts,
  ] = await Promise.all([
    query.order("created_at", { ascending: false }).range(from, to),
    supabase
      .from("jobs")
      .select("id, title")
      .order("title", { ascending: true }),
    getPipelineStageCounts({
      stage: activeStage,
      search: normalizedSearch,
      jobId,
    }),
  ]);

  const { data: analyses, error, count } = analysesResult;

  if (error || !analyses) {
    logger.error("pipeline.list.failed", error);
    return emptyPipelineResult({
      page: safePage,
      pageSize,
      stage: activeStage,
      search: normalizedSearch,
      jobId,
      jobOptions: toPipelineJobOptions(jobsResult.data ?? []),
      stageCounts,
    });
  }

  const jobIds = analyses
    .map((analysis) => analysis.job_id)
    .filter((id): id is string => Boolean(id));

  const analysisIds = analyses.map((analysis) => analysis.id);

  const [pageJobsResult, interviewsResult] = await Promise.all([
    jobIds.length
      ? supabase.from("jobs").select("id, title").in("id", jobIds)
      : Promise.resolve({ data: [] }),
    analysisIds.length
      ? supabase
          .from("interview_guides")
          .select("id, analysis_id")
          .in("analysis_id", analysisIds)
      : Promise.resolve({ data: [] }),
  ]);

  const items = analyses.map((analysis) => {
    const jobs = pageJobsResult.data ?? [];
    const interviews = interviewsResult.data ?? [];
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

  const total = count ?? 0;

  return {
    items,
    total,
    page: safePage,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    stageCounts,
    jobOptions: toPipelineJobOptions(jobsResult.data ?? []),
    filters: {
      stage: activeStage,
      search: normalizedSearch,
      jobId,
    },
  };
}

function getDefaultStageByStatus(
  status: AnalysisStatus | null,
): PipelineStage {
  if (status === "approved") return "approved";
  if (status === "rejected") return "rejected";

  return "screening";
}

function applyPipelineFilters<T>(
  query: T,
  {
    stage,
    search,
    jobId,
  }: {
    stage: PipelineStage;
    search: string;
    jobId: string;
  },
): T {
  let nextQuery = query as PipelineFilterQuery<T>;

  if (stage === "screening") {
    nextQuery = nextQuery.or("pipeline_stage.eq.screening,pipeline_stage.is.null");
  } else {
    nextQuery = nextQuery.eq("pipeline_stage", stage);
  }

  if (jobId !== "all") {
    nextQuery = nextQuery.eq("job_id", jobId);
  }

  if (search) {
    const escapedSearch = search.replaceAll("%", "\\%");
    nextQuery = nextQuery.or(
      `candidate_name.ilike.%${escapedSearch}%,candidate_email.ilike.%${escapedSearch}%,recommendation.ilike.%${escapedSearch}%`,
    );
  }

  return nextQuery as T;
}

async function getPipelineStageCounts({
  search,
  jobId,
}: {
  stage: PipelineStage;
  search: string;
  jobId: string;
}): Promise<PipelineStageCount[]> {
  const supabase = await createServerClient();

  const results = await Promise.all(
    STAGE_OPTIONS.map(async (stage) => {
      let query = supabase
        .from("candidate_analysis")
        .select("id", { count: "exact", head: true });

      query = applyPipelineFilters(query, {
        stage,
        search,
        jobId,
      });

      const { count } = await query;

      return {
        stage,
        total: count ?? 0,
      };
    }),
  );

  return results;
}

function toPipelineJobOptions(
  jobs: Array<{ id: string; title: string | null }>,
): PipelineJobOption[] {
  return [
    { label: "Todas as vagas", value: "all" },
    ...jobs.map((job) => ({
      label: job.title ?? "Vaga sem título",
      value: job.id,
    })),
  ];
}

function emptyPipelineResult({
  page,
  pageSize,
  stage,
  search,
  jobId,
  jobOptions,
  stageCounts,
}: {
  page: number;
  pageSize: number;
  stage: PipelineStage;
  search: string;
  jobId: string;
  jobOptions: PipelineJobOption[];
  stageCounts: PipelineStageCount[];
}): PipelineResult {
  return {
    items: [],
    total: 0,
    page,
    pageSize,
    totalPages: 1,
    stageCounts,
    jobOptions,
    filters: {
      stage,
      search,
      jobId,
    },
  };
}
