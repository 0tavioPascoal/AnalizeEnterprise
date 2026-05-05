import { getAnalyses } from "@/actions/analyzes/getAnalyzes";
import { AnalysesClient } from "@/components/analyses/AnalysesClient";

export const dynamic = "force-dynamic";

export default async function AnalysesPage() {
  const analyses = await getAnalyses();

  return <AnalysesClient analyses={analyses} />;
}