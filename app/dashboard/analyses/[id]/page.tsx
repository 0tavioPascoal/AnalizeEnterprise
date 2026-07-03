import Link from "next/link";
import { notFound } from "next/navigation";

import { ArrowLeft, Sparkles } from "lucide-react";

import { getAnalysisById } from "@/features/analyses/server/get-analysis-by-id";
import { getInterviewByAnalysisId } from "@/features/interviews/server/get-interview-by-analysis-id";

import { PageHeader } from "@/components/layout/PageHeader";
import { PageLayout } from "@/components/layout/PageLayout";

import { Button } from "@/components/ui/button";

import { AnalysisListCard } from "@/features/analyses/components/AnalysisListCard";
import { AnalysisProfileCard } from "@/features/analyses/components/AnalysisProfileCard";
import { AnalysisResultCard } from "@/features/analyses/components/AnalysisResultCard";
import { AnalysisScoreCard } from "@/features/analyses/components/AnalysisScoreCard";

import { DownloadResumeButton } from "@/features/analyses/components/DownloadResumeButton";
import { GenerateInterviewButton } from "@/features/analyses/components/GenerateInterviewButton";

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

  const interview = await getInterviewByAnalysisId(analysis.id);

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
            <div className="flex flex-wrap items-center justify-end gap-3">
              {interview ? (
                <Button
                  asChild
                  className="h-11 rounded-xl px-4 text-sm font-black shadow-lg shadow-primary/20"
                >
                  <Link href={`/dashboard/interviews/${interview.id}`}>
                    Ver entrevista
                  </Link>
                </Button>
              ) : (
                <GenerateInterviewButton
                  analysisId={analysis.id}
                  disabled={analysis.status !== "approved"}
                />
              )}

              <DownloadResumeButton
                analysisId={analysis.id}
                disabled={!analysis.resume_file_path}
              />

              <Button
                asChild
                variant="outline"
                className="h-11 rounded-xl px-4 text-sm font-semibold"
              >
                <Link href="/dashboard/analyses">
                  <ArrowLeft size={17} />
                  Voltar
                </Link>
              </Button>
            </div>
          }
        />
      }
    >
      <div className="flex w-full flex-col gap-8">
        <section className="grid w-full items-stretch gap-8 xl:grid-cols-[minmax(0,1fr)_420px] 2xl:grid-cols-[minmax(0,1fr)_460px]">
          <div className="min-w-0 [&>section]:h-full">
            <AnalysisProfileCard analysis={analysis} />
          </div>

          <div className="min-w-0 [&>section]:h-full">
            <AnalysisResultCard analysis={analysis} />
          </div>
        </section>

        <section className="grid w-full items-start gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(420px,480px)] 2xl:grid-cols-[minmax(0,1fr)_520px]">
          <main className="min-w-0 space-y-8">
            <AnalysisScoreCard analysis={analysis} />

            <FinalOpinionCard text={analysis.final_opinion} />
          </main>

          <aside
            className="
              min-w-0 space-y-4
              xl:sticky xl:top-8 xl:self-start
              xl:max-h-[calc(100vh-8rem)]
              xl:overflow-y-auto
              xl:pr-2
            "
          >
            <AnalysisListCard
              title="Skills encontradas"
              items={analysis.matched_skills}
              type="success"
            />

            <AnalysisListCard
              title="Skills ausentes"
              items={analysis.missing_skills}
              type="warning"
            />

            <AnalysisListCard
              title="Destaques"
              items={analysis.strengths}
              type="success"
            />

            <AnalysisListCard
              title="Pontos de atenção"
              items={analysis.weaknesses}
              type="warning"
            />

            <AnalysisListCard
              title="Riscos"
              items={analysis.risks}
              type="warning"
            />

            <AnalysisListCard
              title="Perguntas iniciais"
              items={analysis.interview_questions}
              type="question"
            />
          </aside>
        </section>
      </div>
    </PageLayout>
  );
}

function FinalOpinionCard({ text }: { text?: string | null }) {
  const formattedText = text?.trim();

  return (
    <section className="overflow-hidden rounded-3xl border border-border/60 bg-card/80 shadow-md transition-all duration-300 hover:border-primary/20 hover:shadow-lg">
      <div className="border-b border-border/50 bg-muted/15 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/[0.08] text-violet-600 dark:bg-violet-500/[0.12] dark:text-violet-300">
            <Sparkles size={21} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground/80">
              Parecer da IA
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-tight text-foreground">
              Parecer final
            </h2>

            <p className="mt-1.5 text-xs font-semibold leading-relaxed text-muted-foreground">
              Conclusão consolidada da triagem sobre aderência, senioridade,
              riscos e próximos passos.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="rounded-2xl border border-border/50 bg-muted/10 p-5">
          <p className="text-sm font-medium leading-7 text-foreground/90">
            {formattedText || "Parecer final não disponível."}
          </p>
        </div>
      </div>
    </section>
  );
}