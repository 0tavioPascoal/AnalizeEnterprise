import Link from "next/link";
import { ChevronRight, FileText, Target } from "lucide-react";

import { RowItem } from "@/components/layout/RowItem";
import { StatusBadge } from "@/components/layout/filters/StatusBadge";

import { cn } from "@/lib/supabase/utils";
import type { AnalysisListItem } from "@/actions/analyzes/getAnalyzes";

interface AnalysisRowProps {
  analysis: AnalysisListItem;
}

function getScoreVariant(score: number) {
  if (score >= 70) return "success";
  if (score >= 50) return "warning";
  return "danger";
}

export function AnalysisRow({ analysis }: AnalysisRowProps) {
  const scoreVariant = getScoreVariant(analysis.score);

  return (
    <RowItem
      left={
        <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border shadow-sm sm:h-12 sm:w-12",
              analysis.match
                ? "border-emerald-500/20 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                : "border-amber-500/20 bg-amber-500/15 text-amber-700 dark:text-amber-300",
            )}
          >
            <FileText size={22} />
          </div>

          <div className="min-w-0">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <p className="break-words text-base font-bold text-foreground">
                {analysis.candidate_name ?? "Candidato sem nome"}
              </p>

              <StatusBadge variant={analysis.match ? "success" : "warning"}>
                {analysis.match ? "Match" : "Atenção"}
              </StatusBadge>
            </div>

            <div className="mt-2 flex min-w-0 flex-wrap items-center gap-2">
              <span className="max-w-full break-all text-sm font-medium text-muted-foreground sm:max-w-55 sm:truncate">
                {analysis.candidate_email ?? "E-mail não identificado"}
              </span>

              <span className="text-sm text-muted-foreground/60">•</span>

              <span className="max-w-55 truncate text-sm font-medium text-muted-foreground">
                {analysis.job_title ?? "Vaga não identificada"}
              </span>
            </div>
          </div>
        </div>
      }
      right={
        <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
          <div className="text-left sm:min-w-28 sm:text-right">
            <StatusBadge
              variant={scoreVariant}
              className="px-3 py-1.5 text-sm font-semibold"
            >
              <Target size={15} className="mr-1 inline" />
              {analysis.score}%
            </StatusBadge>

            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {analysis.recommendation.replace("_", " ")}
            </p>
          </div>

          <Link
            href={`/dashboard/analyses/${analysis.id}`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
            aria-label={`Abrir análise de ${
              analysis.candidate_name ?? "candidato"
            }`}
          >
            <ChevronRight size={20} />
          </Link>
        </div>
      }
    />
  );
}
