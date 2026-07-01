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
    <div className="flex min-h-28 items-center justify-between gap-3 rounded-xl border border-border/70 bg-card/95 p-4 shadow-sm transition hover:border-primary/25">
      <div className="min-w-0 space-y-1">
        <p className="truncate text-[11px] font-extrabold uppercase text-muted-foreground">
          {title}
        </p>

        <h2 className="truncate text-2xl font-black tracking-tight text-foreground md:text-3xl">
          {value}
        </h2>

        <p className="truncate text-sm font-medium text-muted-foreground">
          {description}
        </p>
      </div>

      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border",
          colors[color],
        )}
      >
        <Icon size={19} />
      </div>
    </div>
  );
}
