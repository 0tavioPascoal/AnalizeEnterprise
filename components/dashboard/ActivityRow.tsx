"use client";

import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";

import type { DashboardAnalysisItem } from "@/actions/dashboard/getDashboadOverview";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
      className="group flex cursor-pointer items-center justify-between gap-4 p-4 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
    >
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:bg-zinc-800 dark:group-hover:bg-indigo-500/10 dark:group-hover:text-indigo-400">
          <FileText size={16} />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-zinc-900 group-hover:text-indigo-600 dark:text-zinc-50 dark:group-hover:text-indigo-400">
            {analysis.candidate_name ?? "Candidato sem nome"}
          </p>

          <p className="truncate text-[10px] text-zinc-500">
            {analysis.job_title ?? "Vaga não encontrada"}
          </p>
        </div>
      </div>

      <Badge
        variant="outline"
        className={cn(
          "shrink-0 px-2 py-0.5 text-[10px] font-black transition",
          isHighScore
            ? "border-emerald-100 bg-emerald-50 text-emerald-600"
            : "border-amber-100 bg-amber-50 text-amber-600",
        )}
      >
        {analysis.score}%
      </Badge>
    </div>
  );
}