import Link from "next/link";
import { Activity, Plus, Sparkles } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="flex shrink-0 flex-col gap-3 rounded-xl border border-border/70 bg-background/85 px-4 py-3 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between md:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-primary/10 text-primary">
          <Sparkles className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <h1 className="truncate text-xl font-black tracking-tight text-foreground md:text-2xl">
            Insights Operacionais
          </h1>

          <p className="truncate text-sm font-medium text-muted-foreground">
            Aqui está o pulso do seu RH hoje.
          </p>
        </div>
      </div>

      <div className="flex w-full shrink-0 items-center gap-3 sm:w-auto">
        <div className="hidden h-10 items-center gap-2 rounded-lg border border-border/80 bg-card/80 px-3 text-sm font-bold text-foreground shadow-xs lg:flex">
          <Activity className="h-4 w-4 text-emerald-500" />

          <span>Sistema Online</span>
        </div>

        <Link
          href="/dashboard/analyze"
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-extrabold text-primary-foreground shadow-sm shadow-primary/15 transition hover:bg-primary/90 active:scale-95 sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Nova Análise
        </Link>
      </div>
    </header>
  );
}
