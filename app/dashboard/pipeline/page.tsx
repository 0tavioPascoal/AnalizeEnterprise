import { PipelineClient } from "@/features/pipeline/components/PipelineClient";
import {
  getPipelineAnalyses,
  getPipelineKanban,
  type PipelineStage,
  type PipelineView,
} from "@/features/pipeline/server/pipeline";

interface PipelinePageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    job?: string;
    stage?: string;
    view?: string;
  }>;
}

const stageFilters: PipelineStage[] = [
  "screening",
  "interview",
  "approved",
  "rejected",
];
const viewOptions: PipelineView[] = ["list", "kanban"];

export default async function PipelinePage({
  searchParams,
}: PipelinePageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const stage = stageFilters.includes(params.stage as PipelineStage)
    ? (params.stage as PipelineStage)
    : "screening";
  const view = viewOptions.includes(params.view as PipelineView)
    ? (params.view as PipelineView)
    : "kanban";

  const pipeline =
    view === "kanban"
      ? await getPipelineKanban({
          search: params.search ?? "",
          jobId: params.job ?? "all",
        })
      : await getPipelineAnalyses({
          page: Number.isFinite(page) ? page : 1,
          search: params.search ?? "",
          jobId: params.job ?? "all",
          stage,
        });

  return <PipelineClient pipeline={pipeline} view={view} />;
}
