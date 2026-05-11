"use client";

import {
  BriefcaseBusiness,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

interface Props {
  jobFilter: string;
  setJobFilter: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  scoreFilter: string;
  setScoreFilter: (v: string) => void;
  jobs: { id: string; title: string }[];
}

export function AnalysisFilters({
  jobFilter,
  setJobFilter,
  statusFilter,
  setStatusFilter,
  scoreFilter,
  setScoreFilter,
  jobs,
}: Props) {
  const selectBase =
    "h-10 rounded-xl border border-border bg-background/80 pl-9 pr-8 text-sm font-semibold text-foreground shadow-sm transition-all focus:outline-none focus:ring-2 dark:bg-zinc-950/50 dark:hover:bg-zinc-950/70";

  return (
    <div className="mr-6 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card/70 p-2 shadow-sm backdrop-blur-md dark:bg-zinc-900/60">
      <div className="relative">
        <BriefcaseBusiness
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-primary"
        />

        <select
          value={jobFilter}
          onChange={(e) => setJobFilter(e.target.value)}
          className={`${selectBase} min-w-44 hover:border-primary/30 hover:bg-background focus:border-primary/40 focus:ring-primary/20`}
        >
          <option value="">Todas vagas</option>

          {jobs.map((job) => (
            <option key={job.id} value={job.title}>
              {job.title}
            </option>
          ))}
        </select>
      </div>

      <div className="relative">
        <ShieldCheck
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`${selectBase} min-w-36 hover:border-emerald-500/30 hover:bg-background focus:border-emerald-500/40 focus:ring-emerald-500/20`}
        >
          <option value="">Status</option>
          <option value="match">Match</option>
          <option value="no_match">Sem match</option>
        </select>
      </div>

      <div className="relative">
        <BarChart3
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-amber-500"
        />

        <select
          value={scoreFilter}
          onChange={(e) => setScoreFilter(e.target.value)}
          className={`${selectBase} min-w-32 hover:border-amber-500/30 hover:bg-background focus:border-amber-500/40 focus:ring-amber-500/20`}
        >
          <option value="">Score</option>
          <option value="low">0–50</option>
          <option value="medium">50–70</option>
          <option value="high">70+</option>
        </select>
      </div>
    </div>
  );
}