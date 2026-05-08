import { PipelineClient } from "@/components/pipeline/pipelineClient";
import { getPipelineAnalyses } from "@/actions/pipeline/pipeline";

export default async function PipelinePage() {
  const analyses = await getPipelineAnalyses();

  return <PipelineClient analyses={analyses} />;
}