import { PipelineClient } from "@/components/pipeline/pipelineClient";
import {
  getPipelineAnalyses,
  type PipelineStage,
} from "@/actions/pipeline/pipeline";

interface PipelinePageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    job?: string;
    stage?: string;
  }>;
}

const stageFilters: PipelineStage[] = [
  "screening",
  "interview",
  "approved",
  "rejected",
];

export default async function PipelinePage({
  searchParams,
}: PipelinePageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const stage = stageFilters.includes(params.stage as PipelineStage)
    ? (params.stage as PipelineStage)
    : "screening";

  const pipeline = await getPipelineAnalyses({
    page: Number.isFinite(page) ? page : 1,
    search: params.search ?? "",
    jobId: params.job ?? "all",
    stage,
  });

  return <PipelineClient pipeline={pipeline} />;
}
