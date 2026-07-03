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
} from "@/features/pipeline/server/pipeline";

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
      className="group block rounded-2xl border border-border/50 bg-card/85 p-4 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-card hover:shadow-sm active:scale-[0.997]"
      aria-label={`Abrir ${shouldOpenInterview ? "entrevista" : "análise"} de ${
        item.candidate_name ?? "candidato"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-105 group-hover:rotate-2",
            config.className,
          )}
        >
          <Icon size={18} />
        </div>

        <StatusBadge
          variant={item.match ? "success" : "warning"}
          className="rounded-xl px-2.5 py-1 text-xs font-black"
        >
          {item.score}%
        </StatusBadge>
      </div>

      <div className="mt-4 min-w-0">
        <p className="line-clamp-2 text-sm font-black leading-snug text-foreground transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary">
          {item.candidate_name ?? "Candidato sem nome"}
        </p>

        <p className="mt-1 truncate text-xs font-semibold text-muted-foreground/80">
          {item.candidate_email ?? "E-mail não informado"}
        </p>
      </div>

      <div className="mt-4 flex min-w-0 items-center justify-between gap-3 border-t border-border/45 pt-4">
        <div className="min-w-0">
          <p className="truncate text-xs font-black text-foreground">
            {item.job_title ?? "Vaga não informada"}
          </p>

          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/80">
            {config.label}
          </p>
        </div>

        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background/70 text-muted-foreground transition duration-300 group-hover:translate-x-0.5 group-hover:border-primary/25 group-hover:bg-primary/10 group-hover:text-primary">
          <ActionIcon
            size={14}
            className="transition-transform group-hover:scale-110"
          />
        </span>
      </div>
    </Link>
  );
}
