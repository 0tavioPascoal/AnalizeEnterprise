import Link from "next/link";
import { Sparkles } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="flex shrink-0 flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
          <Sparkles className="h-6 w-6 text-white" />
        </div>

        <div className="min-w-0">
          <h1 className="break-words text-2xl font-black tracking-tight text-foreground md:text-3xl">
            Insights Operacionais
          </h1>

          <p className="text-sm font-medium text-muted-foreground md:text-base">
            Aqui está o pulso do seu RH hoje.
          </p>
        </div>
      </div>

      <div className="flex w-full shrink-0 items-center gap-3 sm:w-auto">
        <div className="hidden items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 shadow-sm lg:flex">
          <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />

          <span className="text-sm font-bold text-foreground">
            Sistema Online
          </span>
        </div>

        <Link
          href="/dashboard/analyze"
          className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary px-6 text-sm font-extrabold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95 sm:w-auto"
        >
          Nova Análise
        </Link>
      </div>
    </header>
  );
}
