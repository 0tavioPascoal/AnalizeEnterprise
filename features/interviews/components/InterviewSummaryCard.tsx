import {
  CheckCircle2,
  FileText,
  Loader2,
  XCircle,
} from "lucide-react";

import { cn } from "@/lib/supabase/utils";

interface InterviewStatusBadgeProps {
  status?: string | null;
}

type StatusVariant = "ready" | "generating" | "failed" | "draft";

const statusConfig: Record<
  StatusVariant,
  {
    label: string;
    icon: typeof CheckCircle2;
    className: string;
  }
> = {
  ready: {
    label: "Pronta",
    icon: CheckCircle2,
    className:
      "border-emerald-500/20 bg-emerald-500/[0.10] text-emerald-700 dark:text-emerald-300",
  },
  generating: {
    label: "Gerando",
    icon: Loader2,
    className:
      "border-amber-500/20 bg-amber-500/[0.10] text-amber-700 dark:text-amber-300",
  },
  failed: {
    label: "Falhou",
    icon: XCircle,
    className:
      "border-rose-500/20 bg-rose-500/[0.10] text-rose-700 dark:text-rose-300",
  },
  draft: {
    label: "Rascunho",
    icon: FileText,
    className:
      "border-zinc-500/20 bg-zinc-500/[0.10] text-zinc-700 dark:text-zinc-300",
  },
};

export function InterviewStatusBadge({ status }: InterviewStatusBadgeProps) {
  const variant = getStatusVariant(status);
  const config = statusConfig[variant];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        `
        inline-flex items-center gap-1.5 rounded-xl border
        px-3 py-1.5
        text-xs font-black uppercase tracking-[0.12em]
        `,
        config.className,
      )}
    >
      <Icon
        size={13}
        className={cn(variant === "generating" && "animate-spin")}
      />

      {config.label}
    </span>
  );
}

function getStatusVariant(status?: string | null): StatusVariant {
  const normalized = status?.trim().toLowerCase();

  if (normalized === "ready") {
    return "ready";
  }

  if (normalized === "generating") {
    return "generating";
  }

  if (normalized === "failed") {
    return "failed";
  }

  return "draft";
}
