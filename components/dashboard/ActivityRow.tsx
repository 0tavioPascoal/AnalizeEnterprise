"use client";

import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";

import type { DashboardAnalysisItem } from "@/actions/dashboard/getDashboadOverview";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/supabase/utils";

interface ActivityRowProps {
  analysis: DashboardAnalysisItem;
}

export function ActivityRow({ analysis }: ActivityRowProps) {
  const router = useRouter();

  const isHighScore = analysis.score >= 70;

  function handleClick() {
    router.push(`/dashboard/analyses/${analysis.id}`);
  }

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleClick();
      }}
      className="group flex cursor-pointer items-center justify-between gap-3 px-4 py-3 transition hover:bg-muted/45 md:px-5"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-muted/55 text-muted-foreground transition group-hover:border-primary/20 group-hover:bg-primary/10 group-hover:text-primary">
          <FileText size={17} />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-foreground transition group-hover:text-primary">
            {analysis.candidate_name ?? "Candidato sem nome"}
          </p>

          <p className="truncate text-xs font-medium text-muted-foreground">
            {analysis.job_title ?? "Vaga não encontrada"}
          </p>
        </div>
      </div>

      <Badge
        variant="outline"
        className={cn(
          "shrink-0 rounded-md px-2.5 py-1 text-xs font-extrabold transition",
          isHighScore
            ? "border-emerald-100 bg-emerald-50 text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
            : "border-amber-100 bg-amber-50 text-amber-600 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300",
        )}
      >
        {analysis.score}%
      </Badge>
    </div>
  );
}
