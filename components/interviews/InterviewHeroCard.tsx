import {
  BriefcaseBusiness,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";

import { cn } from "@/lib/supabase/utils";

import { InterviewStatusBadge } from "./InterviewStatusBadge";

import type { InterviewGuideDetail } from "@/actions/interviews/getInterviewById";

interface InterviewHeroCardProps {
  interview: InterviewGuideDetail;
}

export function InterviewHeroCard({
  interview,
}: InterviewHeroCardProps) {
  const initials = getInitials(
    interview.candidate_name ?? "Candidato",
  );

  return (
    <section
      className="
        relative overflow-hidden

        rounded-[26px]
        border border-zinc-200/80

        bg-white
        shadow-xl shadow-zinc-900/4

        dark:border-zinc-800
        dark:bg-zinc-900/90
      "
    >
      {/* FX */}
      <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-indigo-500/10 via-indigo-500/3 to-transparent" />

      <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-indigo-500/5 blur-3xl" />

      <div className="relative z-10 p-5">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          
          {/* LEFT */}
          <div className="flex min-w-0 items-center gap-4">
            {/* AVATAR */}
            <div
              className="
                relative flex h-18 w-18 shrink-0 items-center justify-center

                rounded-2xl

                bg-linear-to-br
                from-indigo-500
                via-violet-500
                to-purple-600

                text-xl font-black text-white

                shadow-xl shadow-indigo-500/20
              "
            >
              <div className="absolute inset-0 rounded-2xl ring-1 ring-white/20" />

              {initials}
            </div>

            {/* INFO */}
            <div className="min-w-0">
              {/* BADGES */}
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <InterviewStatusBadge
                  status={interview.status}
                />

                {interview.analysis_score !== null && (
                  <div
                    className="
                      inline-flex items-center gap-1.5

                      rounded-lg
                      border border-indigo-500/20

                      bg-indigo-500/10
                      px-2.5 py-1

                      text-[11px] font-black
                      text-indigo-700

                      dark:text-indigo-300
                    "
                  >
                    <Star size={11} />

                    Match {interview.analysis_score}%
                  </div>
                )}

                <div
                  className="
                    inline-flex items-center gap-1.5

                    rounded-lg
                    border border-emerald-500/20

                    bg-emerald-500/10
                    px-2.5 py-1

                    text-[11px] font-black
                    text-emerald-700

                    dark:text-emerald-300
                  "
                >
                  <Sparkles size={11} />

                  IA Interview
                </div>
              </div>

              {/* NAME */}
              <h2
                className="
                  truncate

                  text-2xl font-black
                  tracking-tight

                  text-zinc-900
                  dark:text-zinc-100
                "
              >
                {interview.candidate_name ??
                  "Candidato sem nome"}
              </h2>

              {/* JOB */}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <div
                  className="
                    inline-flex items-center gap-2

                    rounded-xl
                    border border-zinc-200/80

                    bg-zinc-50/80
                    px-3 py-1.5

                    text-sm font-semibold
                    text-zinc-700

                    dark:border-zinc-800
                    dark:bg-zinc-950/40
                    dark:text-zinc-300
                  "
                >
                  <BriefcaseBusiness size={14} />

                  {interview.job_title ??
                    "Vaga não identificada"}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="grid gap-2 sm:grid-cols-2 xl:min-w-100">
            <HeroInfo
              icon={ShieldCheck}
              label="Senioridade"
              value={interview.job_seniority ?? "-"}
              tone="indigo"
            />

            <HeroInfo
              icon={BriefcaseBusiness}
              label="Contrato"
              value={
                interview.job_contract_type ?? "-"
              }
              tone="emerald"
            />

            <HeroInfo
              icon={Mail}
              label="E-mail"
              value={interview.candidate_email ?? "-"}
              tone="sky"
            />

            <HeroInfo
              icon={Phone}
              label="Telefone"
              value={interview.candidate_phone ?? "-"}
              tone="amber"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

type HeroTone =
  | "indigo"
  | "emerald"
  | "sky"
  | "amber";

function HeroInfo({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  tone: HeroTone;
}) {
  const styles = {
    indigo: {
      glow: "from-indigo-500/10",
      icon: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300",
      border:
        "hover:border-indigo-200 dark:hover:border-indigo-500/20",
    },

    emerald: {
      glow: "from-emerald-500/10",
      icon: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
      border:
        "hover:border-emerald-200 dark:hover:border-emerald-500/20",
    },

    sky: {
      glow: "from-sky-500/10",
      icon: "bg-sky-500/10 text-sky-600 dark:text-sky-300",
      border:
        "hover:border-sky-200 dark:hover:border-sky-500/20",
    },

    amber: {
      glow: "from-amber-500/10",
      icon: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
      border:
        "hover:border-amber-200 dark:hover:border-amber-500/20",
    },
  };

  const style = styles[tone];

  return (
    <div
      className={cn(
        `
          group relative overflow-hidden

          rounded-2xl
          border border-zinc-200/80

          bg-zinc-50/70
          p-3

          shadow-sm
          transition-all

          hover:-translate-y-0.5
          hover:bg-white
          hover:shadow-lg

          dark:border-zinc-800
          dark:bg-zinc-950/40
          dark:hover:bg-zinc-900
        `,
        style.border,
      )}
    >
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-12 bg-linear-to-b to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          style.glow,
        )}
      />

      <div className="relative z-10">
        <div className="mb-2 flex items-center gap-2">
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-lg",
              style.icon,
            )}
          >
            <Icon size={13} />
          </div>

          <span
            className="
              text-[10px] font-black
              uppercase tracking-[0.15em]

              text-zinc-500
              dark:text-zinc-400
            "
          >
            {label}
          </span>
        </div>

        <p
          className="
            truncate

            text-sm font-bold

            text-zinc-800
            dark:text-zinc-100
          "
        >
          {value}
        </p>
      </div>
    </div>
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