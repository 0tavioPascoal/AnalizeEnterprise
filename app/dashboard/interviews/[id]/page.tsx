import Link from "next/link";
import { notFound } from "next/navigation";

import {
  AlertTriangle,
  ArrowLeft,
  BrainCircuit,
  ClipboardList,
  MessageCircle,
  Target,
} from "lucide-react";

import { getInterviewById } from "@/actions/interviews/getInterviewById";

import { PageHeader } from "@/components/layout/Pageheader";
import { PageLayout } from "@/components/layout/PageLayout";

import { Button } from "@/components/ui/button";

import { InterviewHeroCard } from "@/components/interviews/InterviewHeroCard";
import { InterviewObjectiveCard } from "@/components/interviews/InterviewObjectiveCard";
import { InterviewSummaryCard } from "@/components/interviews/InterviewSummaryCard";
import { InterviewScorecard } from "@/components/interviews/InterviewScorecard";
import { InterviewQuestionSection } from "@/components/interviews/InterviewQuestionSection";
import { InterviewFinalCriteriaCard } from "@/components/interviews/InterviewFinalCriteriaCard";

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
              <Button
                asChild
                variant="outline"
                className="h-10 rounded-xl text-sm font-semibold"
              >
                <Link href={`/dashboard/analyses/${interview.analysis_id}`}>
                  <ArrowLeft size={17} />
                  Voltar para análise
                </Link>
              </Button>
            </div>
          }
        />
      }
    >
      <div className="flex h-full min-h-0 flex-col gap-6 overflow-hidden">
        <InterviewHeroCard interview={interview} />

        <div className="grid min-h-0 flex-1 gap-6 overflow-hidden xl:grid-cols-[minmax(0,0.95fr)_minmax(480px,0.75fr)] 2xl:grid-cols-[minmax(0,1fr)_560px]">
          <div className="min-h-0 space-y-6 overflow-y-auto pr-2 scrollbar-hide">
            <InterviewObjectiveCard objective={content.interview_objective} />

            <InterviewSummaryCard summary={content.summary} />

            <InterviewScorecard items={content.scorecard ?? []} />

            <InterviewFinalCriteriaCard
              text={content.final_recommendation_criteria}
            />
          </div>

          <div className="min-h-0 space-y-6 overflow-y-auto pr-1 scrollbar-hide">
            <InterviewQuestionSection
              title="Perguntas Técnicas"
              icon={Target}
              items={content.technical_questions ?? []}
              tone="indigo"
            />

            <InterviewQuestionSection
              title="Perguntas Comportamentais"
              icon={MessageCircle}
              items={content.behavioral_questions ?? []}
              tone="emerald"
            />

            <InterviewQuestionSection
              title="Perguntas de Risco"
              icon={AlertTriangle}
              items={content.risk_questions ?? []}
              tone="amber"
            />

            <InterviewQuestionSection
              title="Skills Ausentes"
              icon={ClipboardList}
              items={content.missing_skill_questions ?? []}
              tone="rose"
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
