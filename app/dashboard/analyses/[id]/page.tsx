import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";

import { getAnalysisById } from "@/actions/analyzes/getAnalysisById";

import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/Pageheader";
import { Button } from "@/components/ui/button";

import { AnalysisListCard } from "@/components/analyses/AnalysisListCard";
import { AnalysisProfileCard } from "@/components/analyses/AnalysisProfileCard";
import { AnalysisResultCard } from "@/components/analyses/AnalysisResultCard";
import { AnalysisScoreCard } from "@/components/analyses/AnalysisScoreCard";

interface Props {
  params: Promise<{ id: string }>;
}

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
          description={
            <>
              Análise para a vaga{" "}
              <span className="font-bold text-primary">
                {analysis.job_title ?? "não identificada"}
              </span>
            </>
          }
          action={
            <div className="flex items-center gap-3">
              <Button asChild variant="outline" className="h-10 rounded-xl text-sm font-semibold">
                <Link href="/dashboard/analyses">
                  <ArrowLeft size={17} />
                  Voltar
                </Link>
              </Button>

              <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-2 dark:border-indigo-500/20 dark:bg-indigo-500/10">
                <span className="text-xs font-extrabold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
                  Match: {analysis.score}%
                </span>
              </div>
            </div>
          }
        />
      }
    >
      <div className="grid h-full gap-6 overflow-hidden lg:grid-cols-3">
        <div className="space-y-6 overflow-y-auto pr-2 scrollbar-hide lg:col-span-2">
          <AnalysisProfileCard analysis={analysis} />
          <AnalysisScoreCard analysis={analysis} />

          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Sparkles size={20} />
              </div>

              <div>
                <p className="text-sm font-extrabold uppercase tracking-wide text-primary">
                  Parecer Final
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Conclusão consolidada da IA sobre o candidato
                </p>
              </div>
            </div>

            <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
              {analysis.final_opinion ?? "-"}
            </p>
          </section>
        </div>

        <div className="flex min-h-0 flex-col gap-6 overflow-y-auto pr-1 scrollbar-hide">
          <AnalysisResultCard analysis={analysis} />

          <AnalysisListCard title="Destaques" items={analysis.strengths} type="success" />
          <AnalysisListCard title="Pontos de Atenção" items={analysis.weaknesses} type="warning" />
          <AnalysisListCard title="Skills Encontradas" items={analysis.matched_skills} type="success" />
          <AnalysisListCard title="Skills Ausentes" items={analysis.missing_skills} type="warning" />
          <AnalysisListCard title="Riscos" items={analysis.risks} type="warning" />
          <AnalysisListCard title="Perguntas para Entrevista" items={analysis.interview_questions} type="question" />
        </div>
      </div>
    </PageLayout>
  );
}