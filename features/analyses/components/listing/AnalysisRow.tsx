import Link from "next/link";
import { ChevronRight, FileText, Target } from "lucide-react";

import { RowItem } from "@/components/layout/RowItem";
import { StatusBadge } from "@/components/layout/filters/StatusBadge";

import { cn } from "@/lib/supabase/utils";
import type { AnalysisListItem } from "@/features/analyses/server/get-analyses";

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
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:rotate-2 sm:h-12 sm:w-12",
              analysis.match
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
            )}
          >
            <FileText size={20} />
          </div>

          <div className="min-w-0">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <p className="break-words text-base font-black text-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary">
                {analysis.candidate_name ?? "Candidato sem nome"}
              </p>

              <StatusBadge variant={analysis.match ? "success" : "warning"}>
                {analysis.match ? "Match" : "Atenção"}
              </StatusBadge>
            </div>

            <div className="mt-2 flex min-w-0 flex-wrap items-center gap-2">
              <span className="max-w-full break-all text-xs font-semibold text-muted-foreground/80 sm:max-w-55 sm:truncate">
                {analysis.candidate_email ?? "E-mail não identificado"}
              </span>

              <span className="hidden h-1 w-1 rounded-full bg-muted-foreground/35 sm:block" />

              <span className="max-w-55 truncate text-xs font-semibold text-muted-foreground/80">
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
              className="rounded-xl px-3 py-1.5 text-sm font-semibold"
            >
              <Target size={15} className="mr-1 inline" />
              {analysis.score}%
            </StatusBadge>

            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              {analysis.recommendation.replace("_", " ")}
            </p>
          </div>

          <Link
            href={`/dashboard/analyses/${analysis.id}`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-background/70 text-muted-foreground shadow-xs transition-all duration-300 hover:border-primary/25 hover:bg-primary/10 hover:text-primary group-hover:translate-x-0.5"
            aria-label={`Abrir análise de ${
              analysis.candidate_name ?? "candidato"
            }`}
          >
            <ChevronRight
              size={18}
              className="transition-transform group-hover:scale-110"
            />
          </Link>
        </div>
      }
    />
  );
}
