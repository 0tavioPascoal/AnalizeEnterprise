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
    "border-indigo-500/15 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300",
  emerald:
    "border-emerald-500/15 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  rose: "border-rose-500/15 bg-rose-500/10 text-rose-600 dark:text-rose-300",
  amber: "border-amber-500/15 bg-amber-500/10 text-amber-600 dark:text-amber-300",
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color,
}: StatCardProps) {
  return (
    <div className="group flex min-h-28 items-center justify-between gap-4 rounded-2xl border border-border/50 bg-card/85 p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-card hover:shadow-md">
      <div className="min-w-0 space-y-1">
        <p className="truncate text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
          {title}
        </p>

        <h2 className="truncate text-3xl font-black text-foreground">
          {value}
        </h2>

        <p className="truncate text-xs font-semibold text-muted-foreground/80">
          {description}
        </p>
      </div>

      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-105 group-hover:rotate-3",
          colors[color],
        )}
      >
        <Icon size={20} />
      </div>
    </div>
  );
}
