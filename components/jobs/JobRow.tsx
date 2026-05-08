import Link from "next/link";

import {
  Briefcase,
  ChevronRight,
  Target,
} from "lucide-react";

import { RowItem } from "@/components/layout/RowItem";
import { StatusBadge } from "@/components/layout/filters/StatusBadge";

import type { Job } from "@/types/jobs/job";

interface JobRowProps {
  job: Job;
}

function getScoreVariant(score: number) {
  if (score >= 80) return "success";
  if (score >= 60) return "warning";
  return "danger";
}

export function JobRow({ job }: JobRowProps) {
  const scoreVariant = getScoreVariant(job.score_min ?? 0);

  return (
    <RowItem
      left={
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/10 bg-primary/10 text-primary shadow-sm">
            <Briefcase size={20} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {job.title}
            </p>

            <div className="mt-1.5 flex min-w-0 flex-wrap items-center gap-2">
              {job.seniority && (
                <StatusBadge variant="muted">
                  {job.seniority}
                </StatusBadge>
              )}

              {job.contract_type && (
                <StatusBadge variant="info">
                  {job.contract_type}
                </StatusBadge>
              )}
            </div>
          </div>
        </div>
      }
      right={
        <div className="flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <StatusBadge
              variant={scoreVariant}
              className="px-3 py-1.5 text-xs"
            >
              <Target size={14} className="mr-1 inline" />
              {job.score_min ?? 0}%
            </StatusBadge>

            <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Match mínimo
            </p>
          </div>

          <Link
            href={`/dashboard/jobs/${job.id}/edit`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
            aria-label={`Editar vaga ${job.title}`}
          >
            <ChevronRight size={18} />
          </Link>
        </div>
      }
    />
  );
}