import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { StatusBadgeProps, StatusVariant } from "@/types/layout/filters/StatusBadgeProps";

const variantClasses: Record<StatusVariant, string> = {
  success:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300",
  warning:
    "border-amber-500/20 bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 dark:text-amber-300",
  danger:
    "border-red-500/20 bg-red-500/10 text-red-700 hover:bg-red-500/10 dark:text-red-300",
  info:
    "border-indigo-500/20 bg-indigo-500/10 text-indigo-700 hover:bg-indigo-500/10 dark:text-indigo-300",
  muted:
    "border-slate-500/20 bg-slate-500/10 text-slate-700 hover:bg-slate-500/10 dark:text-slate-300",
};

export function StatusBadge({
  children,
  variant = "muted",
  className,
}: StatusBadgeProps) {
  return (
    <Badge
      className={cn(
        "rounded-lg border px-2 py-0.5 text-[10px] font-semibold shadow-none",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </Badge>
  );
}