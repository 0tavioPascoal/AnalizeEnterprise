"use server";

import "server-only";

import { createServerClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/features/auth/server/current-profile";
import { logger } from "@/lib/logger";

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

export type MatchFilter = "all" | "match" | "no_match";
export type ScoreFilter = "all" | "low" | "medium" | "high";

export interface GetAnalysesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  jobId?: string;
  match?: MatchFilter;
  score?: ScoreFilter;
}

export interface AnalysisJobOption {
  label: string;
  value: string;
}

export interface AnalysesResult {
  items: AnalysisListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const DEFAULT_PAGE_SIZE = 8;

export async function getAnalyses({
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  search = "",
  jobId = "all",
  match = "all",
  score = "all",
}: GetAnalysesParams = {}): Promise<AnalysesResult> {
  const supabase = await createServerClient();
  const currentProfile = await getCurrentProfile();

  if (!currentProfile) {
    return {
      items: [],
      total: 0,
      page: 1,
      pageSize,
      totalPages: 1,
    };
  }

  const safePage = Math.max(1, page);
  const from = (safePage - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
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
      { count: "exact" },
    )
    .eq("company_id", currentProfile.company_id)
    .eq("status", "pending");

  const normalizedSearch = search.trim();

  if (normalizedSearch) {
    const escapedSearch = normalizedSearch.replaceAll("%", "\\%");

    query = query.or(
      `candidate_name.ilike.%${escapedSearch}%,candidate_email.ilike.%${escapedSearch}%,recommendation.ilike.%${escapedSearch}%`,
    );
  }

  if (jobId !== "all") {
    query = query.eq("job_id", jobId);
  }

  if (match === "match") {
    query = query.eq("match", true);
  }

  if (match === "no_match") {
    query = query.eq("match", false);
  }

  if (score === "low") {
    query = query.lte("score", 50);
  }

  if (score === "medium") {
    query = query.gt("score", 50).lte("score", 70);
  }

  if (score === "high") {
    query = query.gt("score", 70);
  }

  const { data: analyses, error: analysesError, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (analysesError) {
    logger.error("analysis.list.failed", analysesError, {
      companyId: currentProfile.company_id,
      userId: currentProfile.id,
    });
    return {
      items: [],
      total: 0,
      page: 1,
      pageSize,
      totalPages: 1,
    };
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
    const total = count ?? 0;

    return {
      items: analysisRows.map((analysis) => ({
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
      })),
      total,
      page: safePage,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  }

  const { data: jobs, error: jobsError } = await supabase
    .from("jobs")
    .select("id, title")
    .in("id", jobIds);

  if (jobsError) {
    logger.error("analysis.list.jobs_failed", jobsError, {
      companyId: currentProfile.company_id,
      userId: currentProfile.id,
    });
  }

  const jobRows = (jobs ?? []) as JobRow[];

  const jobTitleById = new Map<string, string | null>(
    jobRows.map((job) => [job.id, job.title]),
  );

  const total = count ?? 0;

  return {
    items: analysisRows.map((analysis) => ({
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
    })),
    total,
    page: safePage,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getAnalysisJobOptions(): Promise<AnalysisJobOption[]> {
  const supabase = await createServerClient();
  const currentProfile = await getCurrentProfile();

  if (!currentProfile) return [];

  const { data, error } = await supabase
    .from("jobs")
    .select("id, title")
    .eq("company_id", currentProfile.company_id)
    .order("title", { ascending: true });

  if (error) {
    logger.error("analysis.job_options.failed", error, {
      companyId: currentProfile.company_id,
      userId: currentProfile.id,
    });
    return [];
  }

  return (data ?? []).map((job) => ({
    label: job.title ?? "Vaga sem título",
    value: job.id,
  }));
}
