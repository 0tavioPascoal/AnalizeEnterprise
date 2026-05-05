import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getAnalysisById } from "@/actions/analyzes/getAnalysisById";

import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/Pageheader";
import { Button } from "@/components/ui/button";


// COMPONENTS
import { AnalysisListCard } from "@/components/analyses/AnalysisListCard";
import { AnalysisProfileCard } from "@/components/analyses/AnalysisProfileCard";
import { AnalysisResultCard } from "@/components/analyses/AnalysisResultCard";
import { AnalysisScoreCard } from "@/components/analyses/AnalysisScoreCard";

interface Props {
  params: Promise<{ id: string }>;
}

// evita cache zoado
export const dynamic = "force-dynamic";

export default async function AnalysisDetailPage({ params }: Props) {
  const { id } = await params;

  const analysis = await getAnalysisById(id);

  if (!analysis) {
    notFound();
  }

  return (
    <PageLayout
      header={
        <PageHeader
          title={analysis.candidate_name ?? "Candidato"}
          description={`Análise para a vaga de ${
            analysis.job_title ?? "vaga não identificada"
          }`}
          action={
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost">
                <Link href="/dashboard/analyses">
                  <ArrowLeft size={16} />
                  Voltar
                </Link>
              </Button>

              <div className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
                <span className="text-[10px] font-bold text-indigo-600 uppercase">
                  Match: {analysis.score}%
                </span>
              </div>
            </div>
          }
        />
      }
    >
      <div className="grid gap-6 lg:grid-cols-3 h-full overflow-hidden">
        
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6 overflow-y-auto pr-2 scrollbar-hide">
          <AnalysisProfileCard analysis={analysis} />
          <AnalysisScoreCard analysis={analysis} />

          {/* Parecer final (pode virar componente depois) */}
          <section className="p-8 border rounded-2xl bg-white dark:bg-zinc-900 shadow-sm">
            <p className="text-xs uppercase text-zinc-400 mb-4">
              Parecer Final
            </p>

            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {analysis.final_opinion ?? "-"}
            </p>
          </section>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-6 overflow-y-auto pr-1 min-h-0 scrollbar-hide">
          <AnalysisResultCard analysis={analysis} />

          <AnalysisListCard
            title="Destaques"
            items={analysis.strengths}
            type="success"
          />

          <AnalysisListCard
            title="Pontos de Atenção"
            items={analysis.weaknesses}
            type="warning"
          />

          <AnalysisListCard
            title="Skills Encontradas"
            items={analysis.matched_skills}
            type="success"
          />

          <AnalysisListCard
            title="Skills Ausentes"
            items={analysis.missing_skills}
            type="warning"
          />

          <AnalysisListCard
            title="Riscos"
            items={analysis.risks}
            type="warning"
          />

          <AnalysisListCard
            title="Perguntas para Entrevista"
            items={analysis.interview_questions}
            type="question"
          />
        </div>
      </div>
    </PageLayout>
  );
}