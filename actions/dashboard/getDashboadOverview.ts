"use server";

import { createServerClient } from "@/lib/supabase/server";

export type DashboardAnalysisStatus = "pending" | "approved" | "rejected";

export interface DashboardAnalysisItem {
  id: string;
  candidate_name: string | null;
  candidate_email: string | null;
  job_id: string;
  job_title: string | null;
  score: number;
  match: boolean;
  status: DashboardAnalysisStatus;
  created_at: string | null;
}

export interface DashboardOverview {
  totalAnalyzed: number;
  highMatches: number;
  belowProfile: number;
  pending: number;
  weeklyFlow: number[];
  recentAnalyses: DashboardAnalysisItem[];
  pendingAnalyses: DashboardAnalysisItem[];
}

interface CandidateAnalysisRow {
  id: string;
  candidate_name: string | null;
  candidate_email: string | null;
  job_id: string;
  score: number | null;
  match: boolean | null;
  status: DashboardAnalysisStatus | null;
  created_at: string | null;
}

interface JobRow {
  id: string;
  title: string | null;
}

function toDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function getSevenDaysAgo(): string {
  const date = new Date();
  date.setDate(date.getDate() - 6);
  date.setHours(0, 0, 0, 0);

  return date.toISOString();
}

async function hydrateWithJobs(
  rows: CandidateAnalysisRow[],
): Promise<DashboardAnalysisItem[]> {
  const supabase = await createServerClient();

  const jobIds = [
    ...new Set(
      rows.map((item) => item.job_id).filter((id): id is string => Boolean(id)),
    ),
  ];

  const { data: jobs } =
    jobIds.length > 0
      ? await supabase.from("jobs").select("id, title").in("id", jobIds)
      : { data: [] };

  const jobRows = (jobs ?? []) as JobRow[];

  const jobTitleById = new Map<string, string | null>(
    jobRows.map((job) => [job.id, job.title]),
  );

  return rows.map((item) => ({
    id: item.id,
    candidate_name: item.candidate_name,
    candidate_email: item.candidate_email,
    job_id: item.job_id,
    job_title: jobTitleById.get(item.job_id) ?? "Vaga não encontrada",
    score: item.score ?? 0,
    match: item.match ?? false,
    status: item.status ?? "pending",
    created_at: item.created_at,
  }));
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const supabase = await createServerClient();

  const sevenDaysAgo = getSevenDaysAgo();

  const { count: totalAnalyzed } = await supabase
    .from("candidate_analysis")
    .select("id", { count: "exact", head: true });

  const { count: highMatches } = await supabase
    .from("candidate_analysis")
    .select("id", { count: "exact", head: true })
    .gte("score", 70);

  const { count: belowProfile } = await supabase
    .from("candidate_analysis")
    .select("id", { count: "exact", head: true })
    .lt("score", 70);

  const { count: pending } = await supabase
    .from("candidate_analysis")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  const { data: recentData } = await supabase
    .from("candidate_analysis")
    .select(
      "id, candidate_name, candidate_email, job_id, score, match, status, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(20);

  const { data: pendingData } = await supabase
    .from("candidate_analysis")
    .select(
      "id, candidate_name, candidate_email, job_id, score, match, status, created_at",
    )
    .eq("status", "pending")
    .gte("created_at", sevenDaysAgo)
    .order("score", { ascending: false });

  const recentRows = (recentData ?? []) as CandidateAnalysisRow[];
  const pendingRows = (pendingData ?? []) as CandidateAnalysisRow[];

  const recentAnalyses = await hydrateWithJobs(recentRows);
  const pendingAnalyses = await hydrateWithJobs(pendingRows);

  const today = new Date();

  const lastSevenDays = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    return toDateOnly(date);
  });

  const weeklyFlow = lastSevenDays.map((day) => {
    return recentAnalyses.filter((item) => {
      if (!item.created_at) return false;
      return toDateOnly(new Date(item.created_at)) === day;
    }).length;
  });

  return {
    totalAnalyzed: totalAnalyzed ?? 0,
    highMatches: highMatches ?? 0,
    belowProfile: belowProfile ?? 0,
    pending: pending ?? 0,
    weeklyFlow,
    recentAnalyses: recentAnalyses.slice(0, 6),
    pendingAnalyses,
  };
}