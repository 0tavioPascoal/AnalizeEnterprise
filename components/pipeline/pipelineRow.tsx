import Link from "next/link";
import { ChevronRight, Clock, CheckCircle2, XCircle } from "lucide-react";

import { RowItem } from "@/components/layout/RowItem";
import { StatusBadge } from "@/components/layout/filters/StatusBadge";

import { cn } from "@/lib/utils";
import type { PipelineAnalysis } from "@/actions/pipeline/pipeline";

interface PipelineRowProps {
  item: PipelineAnalysis;
}

export function PipelineRow({ item }: PipelineRowProps) {
  const status = item.status;

  const statusLabel =
    status === "approved"
      ? "Aprovado"
      : status === "rejected"
        ? "Reprovado"
        : "Pendente";

  const statusVariant =
    status === "approved"
      ? "success"
      : status === "rejected"
        ? "danger"
        : "warning";

  const Icon =
    status === "approved"
      ? CheckCircle2
      : status === "rejected"
        ? XCircle
        : Clock;

  return (
    <RowItem
      left={
        <div className="flex min-w-0 items-center gap-4">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border shadow-sm",
              status === "approved" &&
                "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
              status === "rejected" &&
                "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300",
              status === "pending" &&
                "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
            )}
          >
            <Icon size={20} />
          </div>

          <div className="min-w-0">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <p className="truncate text-sm font-semibold text-foreground">
                {item.candidate_name ?? "Candidato sem nome"}
              </p>

              <StatusBadge variant={statusVariant}>
                {statusLabel}
              </StatusBadge>
            </div>

            <div className="mt-2 flex min-w-0 flex-wrap items-center gap-2">
              <span className="max-w-60 truncate text-xs text-muted-foreground">
                {item.candidate_email ?? "E-mail não informado"}
              </span>

              <span className="text-xs text-muted-foreground">•</span>

              <span className="max-w-60 truncate text-xs font-medium text-muted-foreground">
                {item.job_title ?? "Vaga não informada"}
              </span>
            </div>
          </div>
        </div>
      }
      right={
        <div className="flex items-center gap-4">
          <div className="hidden min-w-24 text-right sm:block">
            <StatusBadge variant={statusVariant} className="px-3 py-1.5 text-xs">
              {item.score}%
            </StatusBadge>

            <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Score Match
            </p>
          </div>

          <Link
            href={`/dashboard/analyses/${item.id}`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
            aria-label={`Abrir análise de ${item.candidate_name ?? "candidato"}`}
          >
            <ChevronRight size={18} />
          </Link>
        </div>
      }
    />
  );
}