import {
  getAnalyses,
  getAnalysisJobOptions,
  type MatchFilter,
  type ScoreFilter,
} from "@/actions/analyzes/getAnalyzes";
import { AnalysesClient } from "@/components/analyses/listing/AnalysesClient";

export const dynamic = "force-dynamic";

interface AnalysesPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    job?: string;
    match?: string;
    score?: string;
  }>;
}

const matchFilters: MatchFilter[] = ["all", "match", "no_match"];
const scoreFilters: ScoreFilter[] = ["all", "low", "medium", "high"];

export default async function AnalysesPage({
  searchParams,
}: AnalysesPageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const match = matchFilters.includes(params.match as MatchFilter)
    ? (params.match as MatchFilter)
    : "all";
  const score = scoreFilters.includes(params.score as ScoreFilter)
    ? (params.score as ScoreFilter)
    : "all";

  const [analyses, jobOptions] = await Promise.all([
    getAnalyses({
      page: Number.isFinite(page) ? page : 1,
      search: params.search ?? "",
      jobId: params.job ?? "all",
      match,
      score,
    }),
    getAnalysisJobOptions(),
  ]);

  return (
    <AnalysesClient
      analyses={analyses.items}
      total={analyses.total}
      page={analyses.page}
      pageSize={analyses.pageSize}
      totalPages={analyses.totalPages}
      jobOptions={jobOptions}
      filters={{
        search: params.search ?? "",
        job: params.job ?? "all",
        match,
        score,
      }}
    />
  );
}
