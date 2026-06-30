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

import { RowItem } from "@/components/layout/RowItem";
import { StatusBadge } from "@/components/layout/filters/StatusBadge";

import { cn } from "@/lib/supabase/utils";
import type {
  PipelineAnalysis,
  PipelineStage,
} from "@/actions/pipeline/pipeline";

interface PipelineRowProps {
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

export function PipelineRow({ item }: PipelineRowProps) {
  const stage = item.pipeline_stage ?? "screening";
  const config = stageConfig[stage];
  const Icon = config.icon;

  const shouldOpenInterview = stage === "interview" && item.interview_id;

  const href = shouldOpenInterview
    ? `/dashboard/interviews/${item.interview_id}`
    : `/dashboard/analyses/${item.id}`;

  const actionLabel = shouldOpenInterview ? "Abrir entrevista" : "Abrir análise";
  const ActionIcon = shouldOpenInterview ? ExternalLink : ChevronRight;

  return (
    <RowItem
      left={
        <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border shadow-sm sm:h-12 sm:w-12",
              config.className,
            )}
          >
            <Icon size={22} />
          </div>

          <div className="min-w-0">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <p className="break-words text-base font-bold text-foreground">
                {item.candidate_name ?? "Candidato sem nome"}
              </p>

              <StatusBadge variant={config.variant}>
                {config.label}
              </StatusBadge>
            </div>

            <div className="mt-2 flex min-w-0 flex-wrap items-center gap-2">
              <span className="max-w-full break-all text-sm font-medium text-muted-foreground sm:max-w-60 sm:truncate">
                {item.candidate_email ?? "E-mail não informado"}
              </span>

              <span className="text-sm text-muted-foreground">•</span>

              <span className="max-w-60 truncate text-sm font-medium text-muted-foreground">
                {item.job_title ?? "Vaga não informada"}
              </span>
            </div>
          </div>
        </div>
      }
      right={
        <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
          <div className="text-left sm:min-w-24 sm:text-right">
            <StatusBadge
              variant={item.match ? "success" : "warning"}
              className="px-3 py-1.5 text-sm font-semibold"
            >
              {item.score}%
            </StatusBadge>

            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Score Match
            </p>
          </div>

          <Link
            href={href}
            className={cn(
              "flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 text-sm font-bold text-muted-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary",
              shouldOpenInterview ? "w-auto" : "w-10 px-0",
            )}
            aria-label={`${actionLabel} de ${
              item.candidate_name ?? "candidato"
            }`}
          >
            {shouldOpenInterview && (
              <span className="hidden xl:inline">{actionLabel}</span>
            )}

            <ActionIcon size={18} />
          </Link>
        </div>
      }
    />
  );
}
