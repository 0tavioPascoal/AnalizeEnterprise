import {
  BriefcaseBusiness,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";

import { InterviewStatusBadge } from "./InterviewStatusBadge";
import { InterviewScorecard } from "./InterviewScorecard";

import type { InterviewGuideDetail } from "@/actions/interviews/getInterviewById";

interface InterviewHeroCardProps {
  interview: InterviewGuideDetail;
}

export function InterviewHeroCard({ interview }: InterviewHeroCardProps) {
  const initials = getInitials(interview.candidate_name ?? "Candidato");
  const scorecardCount = interview.content?.scorecard?.length ?? 0;

  return (
    <section className="relative overflow-hidden rounded-[26px] border border-zinc-200/80 bg-white shadow-xl shadow-zinc-900/4 dark:border-zinc-800 dark:bg-zinc-900/90">
      <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-indigo-500/10 via-indigo-500/3 to-transparent" />
      <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-indigo-500/5 blur-3xl" />

      <div className="relative z-10 p-5">
        <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <div className="flex min-w-0 items-center gap-4">
            <div className="relative flex h-18 w-18 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 via-violet-500 to-purple-600 text-xl font-black text-white shadow-xl shadow-indigo-500/20">
              <div className="absolute inset-0 rounded-2xl ring-1 ring-white/20" />
              {initials}
            </div>

            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <InterviewStatusBadge status={interview.status} />

                {interview.analysis_score !== null && (
                  <div className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-[11px] font-black text-indigo-700 dark:text-indigo-300">
                    <Star size={11} />
                    Match {interview.analysis_score}%
                  </div>
                )}

                <div className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-black text-emerald-700 dark:text-emerald-300">
                  <Sparkles size={11} />
                  IA Interview
                </div>
              </div>

              <h2 className="truncate text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                {interview.candidate_name ?? "Candidato sem nome"}
              </h2>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-xl border border-zinc-200/80 bg-zinc-50/80 px-3 py-1.5 text-sm font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-300">
                  <BriefcaseBusiness size={14} />
                  {interview.job_title ?? "Vaga não identificada"}
                </div>

                <div className="inline-flex items-center gap-2 rounded-xl border border-zinc-200/80 bg-zinc-50/80 px-3 py-1.5 text-sm font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-300">
                  <ShieldCheck size={14} />
                  {interview.job_seniority ?? "Senioridade não informada"}
                </div>
              </div>
            </div>
          </div>

          <div className="min-w-0">
            <div className="rounded-3xl border border-zinc-200/70 bg-zinc-50/80 p-3 shadow-inner shadow-zinc-900/3 dark:border-zinc-800 dark:bg-zinc-950/40">
              <div className="mb-3 flex items-center justify-between gap-3 px-1">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                    Scorecard
                  </p>

                  <p className="mt-1 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    Critérios sugeridos pela IA
                  </p>
                </div>

                <div className="rounded-xl border border-violet-500/15 bg-violet-500/10 px-3 py-1.5 text-xs font-black text-violet-700 dark:text-violet-300">
                  {scorecardCount} critérios
                </div>
              </div>

              <InterviewScorecard
                items={interview.content?.scorecard ?? []}
                compact
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}