import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/layout/filters/StatusBadge";

import { AnalyzeForm } from "@/features/analyze/components/AnalyzeForm";
import { AnalyzeTips } from "@/features/analyze/components/AnalyzeTips";

import { Sparkles } from "lucide-react";
import { getJobs } from "@/features/jobs/server/get-jobs";

export default async function AnalyzePage() {
  const jobs = await getJobs();

  return (
    <PageLayout
      header={
        <PageHeader
          title="Análise de Currículo"
          description="Compare candidatos com suas vagas automaticamente utilizando nossa IA"
          icon={Sparkles}
          action={
            <StatusBadge variant="info" className="px-3 py-1.5">
              IA Scanner Ativo
            </StatusBadge>
          }
        />
      }
    >
      <div className="grid min-h-full gap-6 lg:grid-cols-3">
        <div className="min-h-0 lg:col-span-2">
          <AnalyzeForm jobs={jobs} />
        </div>

        <div className="min-h-0 lg:col-span-1">
          <AnalyzeTips />
        </div>
      </div>
    </PageLayout>
  );
}
