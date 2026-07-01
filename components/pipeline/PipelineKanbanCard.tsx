import Link from "next/link";
import {
  CheckCircle2,
  ChevronRight,
  CircleDot,
  ExternalLink,
  MessageCircle,
  SearchCheck,
  XCircle,
} from "lucide-react";

import { StatusBadge } from "@/components/layout/filters/StatusBadge";
import { cn } from "@/lib/supabase/utils";

import type {
  PipelineAnalysis,
  PipelineStage,
} from "@/actions/pipeline/pipeline";

interface PipelineKanbanCardProps {
  item: PipelineAnalysis;
}

const stageConfig: Record<
  PipelineStage,
  {
    label: string;
    icon: typeof CircleDot;
    variant: "success" | "danger" | "warning";
    className: string;
  }
> = {
  new: {
    label: "Novo",
    icon: CircleDot,
    variant: "warning",
    className:
      "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  },
  screening: {
    label: "Triagem",
    icon: SearchCheck,
    variant: "warning",
    className:
      "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  interview: {
    label: "Entrevista",
    icon: MessageCircle,
    variant: "warning",
    className:
      "border-violet-500/20 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  },
  approved: {
    label: "Aprovado",
    icon: CheckCircle2,
    variant: "success",
    className:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  rejected: {
    label: "Reprovado",
    icon: XCircle,
    variant: "danger",
    className:
      "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300",
  },
};

export function PipelineKanbanCard({ item }: PipelineKanbanCardProps) {
  const stage = item.pipeline_stage ?? "screening";
  const config = stageConfig[stage];
  const Icon = config.icon;
  const shouldOpenInterview = stage === "interview" && item.interview_id;
  const href = shouldOpenInterview
    ? `/dashboard/interviews/${item.interview_id}`
    : `/dashboard/analyses/${item.id}`;
  const ActionIcon = shouldOpenInterview ? ExternalLink : ChevronRight;

  return (
    <Link
      href={href}
      className="group block rounded-xl border border-border bg-card p-4 shadow-sm transition hover:border-primary/25 hover:bg-muted/35 active:scale-[0.995]"
      aria-label={`Abrir ${shouldOpenInterview ? "entrevista" : "análise"} de ${
        item.candidate_name ?? "candidato"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
            config.className,
          )}
        >
          <Icon size={19} />
        </div>

        <StatusBadge
          variant={item.match ? "success" : "warning"}
          className="px-2.5 py-1 text-xs font-bold"
        >
          {item.score}%
        </StatusBadge>
      </div>

      <div className="mt-3 min-w-0">
        <p className="line-clamp-2 text-sm font-black leading-snug text-foreground transition group-hover:text-primary">
          {item.candidate_name ?? "Candidato sem nome"}
        </p>

        <p className="mt-1 truncate text-xs font-medium text-muted-foreground">
          {item.candidate_email ?? "E-mail não informado"}
        </p>
      </div>

      <div className="mt-3 flex min-w-0 items-center justify-between gap-3 border-t border-border/70 pt-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-bold text-foreground">
            {item.job_title ?? "Vaga não informada"}
          </p>

          <p className="mt-0.5 text-[11px] font-semibold uppercase text-muted-foreground">
            {config.label}
          </p>
        </div>

        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:text-primary">
          <ActionIcon size={16} />
        </span>
      </div>
    </Link>
  );
}
