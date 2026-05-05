import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/Pageheader";
import { AnalyzeForm } from "@/components/analyze/AnalyzeForm";
import { AnalyzeTips } from "@/components/analyze/AnalyzeTips";
import { Sparkles } from "lucide-react";
import { getJobs } from "@/actions/jobs/getJobs";

export default async function AnalyzePage() {
  const jobs = await getJobs();

  return (
    <PageLayout
      header={
        <PageHeader
          title="Análise de Currículo"
          description="Compare candidatos com suas vagas automaticamente utilizando nossa IA"
          action={
            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-700 dark:bg-indigo-500/10 rounded-lg">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                IA Scanner Ativo
              </span>
            </div>
          }
        />
      }
    >
      <div className="grid gap-6 lg:grid-cols-3 h-full items-start">
        <div className="lg:col-span-2">
          <AnalyzeForm jobs={jobs} />
        </div>

        <div className="lg:col-span-1">
          <AnalyzeTips />
        </div>
      </div>
    </PageLayout>
  );
}