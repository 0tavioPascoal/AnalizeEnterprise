"use client";

import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";

import type { DashboardAnalysisItem } from "@/features/dashboard/server/get-dashboard-overview";
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
      className="group flex cursor-pointer items-center justify-between gap-3 px-4 py-3 transition-all duration-200 hover:bg-muted/30 md:px-5"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-muted/30 text-muted-foreground transition-all duration-300 group-hover:scale-105 group-hover:border-primary/20 group-hover:bg-primary/10 group-hover:text-primary">
          <FileText size={18} />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-black text-foreground transition-all duration-200 group-hover:text-primary group-hover:translate-x-0.5">
            {analysis.candidate_name ?? "Candidato sem nome"}
          </p>

          <p className="truncate text-xs font-semibold text-muted-foreground/80">
            {analysis.job_title ?? "Vaga não encontrada"}
          </p>
        </div>
      </div>

      <Badge
        variant="outline"
        className={cn(
          "shrink-0 rounded-lg px-2.5 py-1 text-xs font-black transition-all duration-300 group-hover:scale-105",
          isHighScore
            ? "border-emerald-500/15 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
            : "border-amber-500/15 bg-amber-500/10 text-amber-700 dark:text-amber-300",
        )}
      >
        {analysis.score}%
      </Badge>
    </div>
  );
}
