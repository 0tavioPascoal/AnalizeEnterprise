import Link from "next/link";
import { notFound } from "next/navigation";

import { ArrowLeft, BrainCircuit } from "lucide-react";

import { getInterviewById } from "@/features/interviews/server/get-interview-by-id";

import { PageHeader } from "@/components/layout/PageHeader";
import { PageLayout } from "@/components/layout/PageLayout";

import { Button } from "@/components/ui/button";

import { ExportInterviewPdfButton } from "@/features/interviews/components/ExportInterviewPdfButton";
import { InterviewFinalCriteriaCard } from "@/features/interviews/components/InterviewFinalCriteriaCard";
import { InterviewHeroCard } from "@/features/interviews/components/InterviewHeroCard";
import { InterviewInsightsGrid } from "@/features/interviews/components/InterviewInsightsGrid";
import { InterviewObjectiveCard } from "@/features/interviews/components/InterviewObjectiveCard";
import { InterviewQuestionTabs } from "@/features/interviews/components/InterviewQuestionTabs";

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function InterviewDetailPage({ params }: Props) {
  const { id } = await params;

  const interview = await getInterviewById(id);

  if (!interview) {
    notFound();
  }

  const content = interview.content;

  return (
    <PageLayout
      header={
        <PageHeader
          icon={BrainCircuit}
          title={interview.title}
          description={
            <>
              Roteiro inteligente para{" "}
              <span className="font-bold text-primary">
                {interview.job_title ?? "vaga não identificada"}
              </span>
            </>
          }
          action={
            <div className="flex flex-wrap items-center gap-3">
              <ExportInterviewPdfButton interview={interview} />

              <Button
                asChild
                variant="outline"
                className="h-10 rounded-xl px-4 text-sm font-semibold"
              >
                <Link href="/dashboard/pipeline">
                  <ArrowLeft size={17} />
                  Voltar para Pipeline
                </Link>
              </Button>
            </div>
          }
        />
      }
    >
      <div className="flex w-full flex-col gap-8">
        <InterviewHeroCard interview={interview} />

        <section className="grid w-full items-start gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(460px,520px)] 2xl:grid-cols-[minmax(0,1fr)_560px]">
          <div className="min-w-0 space-y-8">
            <InterviewObjectiveCard objective={content.interview_objective} />

            <InterviewInsightsGrid content={content} />

            <InterviewFinalCriteriaCard
              text={content.final_recommendation_criteria}
            />
          </div>

          <aside className="min-w-0 xl:sticky xl:top-8 xl:self-start">
            <InterviewQuestionTabs content={content} />
          </aside>
        </section>
      </div>
    </PageLayout>
  );
}