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
  return (
    <div
      className="
        flex flex-wrap items-center gap-3

        rounded-2xl
        border border-border

        bg-card/70
        dark:bg-zinc-900/60

        backdrop-blur-md

        p-2.5

        shadow-sm
      "
    >
      {/* JOB */}
      <div className="relative">
        <BriefcaseBusiness
          size={14}
          className="
            pointer-events-none
            absolute left-3 top-1/2 -translate-y-1/2

            text-primary
          "
        />

        <select
          value={jobFilter}
          onChange={(e) =>
            setJobFilter(e.target.value)
          }
          className="
            h-10 min-w-45

            rounded-xl
            border border-border

            bg-background/80
            dark:bg-zinc-950/50

            pl-9 pr-8

            text-xs font-bold
            text-foreground

            shadow-sm
            transition-all

            hover:border-primary/30
            hover:bg-background

            dark:hover:bg-zinc-950/70

            focus:border-primary/40
            focus:outline-none
            focus:ring-2
            focus:ring-primary/20
          "
        >
          <option value="">
            Todas vagas
          </option>

          {jobs.map((job) => (
            <option
              key={job.id}
              value={job.title}
            >
              {job.title}
            </option>
          ))}
        </select>
      </div>

      {/* STATUS */}
      <div className="relative">
        <ShieldCheck
          size={14}
          className="
            pointer-events-none
            absolute left-3 top-1/2 -translate-y-1/2

            text-emerald-500
          "
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          className="
            h-10 min-w-37.5

            rounded-xl
            border border-border

            bg-background/80
            dark:bg-zinc-950/50

            pl-9 pr-8

            text-xs font-bold
            text-foreground

            shadow-sm
            transition-all

            hover:border-emerald-500/30
            hover:bg-background

            dark:hover:bg-zinc-950/70

            focus:border-emerald-500/40
            focus:outline-none
            focus:ring-2
            focus:ring-emerald-500/20
          "
        >
          <option value="">
            Status
          </option>

          <option value="match">
            Match
          </option>

          <option value="no_match">
            Sem match
          </option>
        </select>
      </div>

      {/* SCORE */}
      <div className="relative">
        <BarChart3
          size={14}
          className="
            pointer-events-none
            absolute left-3 top-1/2 -translate-y-1/2

            text-amber-500
          "
        />

        <select
          value={scoreFilter}
          onChange={(e) =>
            setScoreFilter(e.target.value)
          }
          className="
            h-10 min-w-35

            rounded-xl
            border border-border

            bg-background/80
            dark:bg-zinc-950/50

            pl-9 pr-8

            text-xs font-bold
            text-foreground

            shadow-sm
            transition-all

            hover:border-amber-500/30
            hover:bg-background

            dark:hover:bg-zinc-950/70

            focus:border-amber-500/40
            focus:outline-none
            focus:ring-2
            focus:ring-amber-500/20
          "
        >
          <option value="">
            Score
          </option>

          <option value="low">
            0–50
          </option>

          <option value="medium">
            50–70
          </option>

          <option value="high">
            70+
          </option>
        </select>
      </div>
    </div>
  );
}