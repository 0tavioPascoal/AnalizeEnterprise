import Link from "next/link";
import { Sparkles } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="flex h-20 shrink-0 items-center justify-between border-b border-zinc-200 pb-6 dark:border-zinc-800">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/20">
          <Sparkles className="h-6 w-6 text-white" />
        </div>

        <div className="min-w-0">
          <h1 className="truncate text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Insights Operacionais
          </h1>
          <p className="truncate text-sm font-medium text-zinc-500">
            Aqui está o pulso do seu RH hoje.
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="hidden items-center gap-2 rounded-lg border bg-white px-4 py-2 shadow-sm dark:bg-zinc-900 lg:flex">
          <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">
            Sistema Online
          </span>
        </div>

        <Link
          href="/dashboard/analyze"
          className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-bold text-white shadow-md transition-all hover:bg-indigo-700 active:scale-95"
        >
          Nova Análise
        </Link>
      </div>
    </header>
  );
}