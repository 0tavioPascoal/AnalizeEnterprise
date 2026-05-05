import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type StatColor = "indigo" | "emerald" | "rose" | "amber";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  color: StatColor;
}

const colors: Record<StatColor, string> = {
  indigo: "text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400",
  emerald: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400",
  rose: "text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400",
  amber: "text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400",
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color,
}: StatCardProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-transparent bg-white p-4 shadow-sm transition-all hover:border-zinc-200 dark:bg-zinc-900 dark:hover:border-zinc-800">
      <div className="min-w-0">
        <p className="mb-2 truncate text-[9px] font-bold uppercase leading-none tracking-widest text-zinc-400">
          {title}
        </p>

        <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50">
          {value}
        </h2>

        <p className="mt-1 truncate text-[10px] font-medium text-zinc-400">
          {description}
        </p>
      </div>

      <div className={cn("shrink-0 rounded-lg p-2", colors[color])}>
        <Icon size={18} />
      </div>
    </div>
  );
}