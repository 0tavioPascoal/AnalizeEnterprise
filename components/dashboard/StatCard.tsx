import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/supabase/utils";

type StatColor = "indigo" | "emerald" | "rose" | "amber";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  color: StatColor;
}

const colors: Record<StatColor, string> = {
  indigo:
    "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
  emerald:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  rose: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color,
}: StatCardProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/70 bg-card p-5 shadow-sm transition-all hover:border-primary/20">
      <div className="min-w-0">
        <p className="mb-2 truncate text-xs font-extrabold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {title}
        </p>

        <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
          {value}
        </h2>

        <p className="mt-2 truncate text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      </div>

      <div className={cn("shrink-0 rounded-xl p-3 shadow-sm", colors[color])}>
        <Icon size={22} />
      </div>
    </div>
  );
}
