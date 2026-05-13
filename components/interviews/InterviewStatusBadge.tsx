import { cn } from "@/lib/supabase/utils";

interface InterviewStatusBadgeProps {
  status: string;
}

export function InterviewStatusBadge({ status }: InterviewStatusBadgeProps) {
  const normalized = status.toLowerCase();

  const label =
    normalized === "ready"
      ? "Pronta"
      : normalized === "generating"
        ? "Gerando"
        : normalized === "failed"
          ? "Falhou"
          : "Rascunho";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg border px-3 py-1 text-xs font-extrabold uppercase tracking-wide",
        normalized === "ready" &&
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        normalized === "generating" &&
          "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
        normalized === "failed" &&
          "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300",
        !["ready", "generating", "failed"].includes(normalized) &&
          "border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300",
      )}
    >
      {label}
    </span>
  );
}