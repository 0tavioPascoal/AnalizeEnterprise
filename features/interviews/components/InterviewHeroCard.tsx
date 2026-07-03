import {
  AlertTriangle,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  Gauge,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";

import { InterviewStatusBadge } from "./InterviewStatusBadge";

import type { InterviewGuideDetail } from "@/features/interviews/server/get-interview-by-id";

interface InterviewHeroCardProps {
  interview: InterviewGuideDetail;
}

export function InterviewHeroCard({ interview }: InterviewHeroCardProps) {
  const initials = getInitials(interview.candidate_name ?? "Candidato");

  const score =
    typeof interview.analysis_score === "number"
      ? Math.round(interview.analysis_score)
      : null;

  const decision = getDecision(score);
  const summary = interview.content?.summary?.trim();

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/85 shadow-sm transition-all duration-300 hover:border-primary/20 hover:bg-card hover:shadow-md">
      <div className="relative z-10 p-5 md:p-6 xl:p-7">
        <div className="mb-6 flex flex-col gap-5 border-b border-border/45 pb-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-2xl font-black text-primary shadow-sm transition-transform duration-300 hover:scale-105">
              {initials}
            </div>

            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <InterviewStatusBadge status={interview.status} />

                <div className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-50/10 px-2.5 py-1 text-xs font-black text-emerald-700 dark:text-emerald-300">
                  <Sparkles size={13} />
                  IA Interview
                </div>
              </div>

              <h2 className="text-2xl font-black text-foreground md:text-3xl">
                {interview.candidate_name ?? "Candidato sem nome"}
              </h2>

              <p className="mt-2 max-w-3xl text-sm font-semibold leading-relaxed text-muted-foreground/80">
                Roteiro inteligente gerado com base na análise do candidato,
                priorizando decisão, aderência e condução prática da entrevista.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 lg:justify-end">
            <InfoPill
              icon={BriefcaseBusiness}
              label={interview.job_title ?? "Vaga não identificada"}
            />

            <InfoPill
              icon={ShieldCheck}
              label={interview.job_seniority ?? "Senioridade não informada"}
            />
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(360px,440px)_minmax(0,1fr)]">
          <div className="rounded-2xl border border-border/45 bg-muted/10 p-5">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/80">
                  Score e decisão
                </p>

                <p className="mt-1 text-xs font-semibold leading-relaxed text-foreground">
                  Resultado principal da triagem
                </p>
              </div>

              <div className={decision.iconBoxClassName}>
                <decision.icon size={20} />
              </div>
            </div>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center xl:flex-col xl:items-start 2xl:flex-row 2xl:items-center">
              <div className={decision.scoreCircleClassName}>
                <Gauge size={22} />

                <div className="text-center">
                  <p className="text-5xl font-black leading-none">
                    {score ?? "--"}
                  </p>

                  <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] opacity-75">
                    Match
                  </p>
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className={decision.badgeClassName}>
                  {decision.label}
                </div>

                <p className="mt-4 text-xs font-semibold leading-relaxed text-muted-foreground">
                  {decision.description}
                </p>

                {score !== null && (
                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground/80">
                      <span>Aderência</span>
                      <span>{score}%</span>
                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className={decision.progressClassName}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/45 bg-muted/10 p-5">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/80">
                  Resumo executivo
                </p>

                <p className="mt-1 text-xs font-semibold leading-relaxed text-foreground">
                  Leitura rápida para apoiar a condução da entrevista
                </p>
              </div>

              <div className="rounded-2xl border border-indigo-500/15 bg-indigo-500/10 p-3 text-indigo-700 dark:text-indigo-300">
                <FileText size={18} />
              </div>
            </div>

            <div className="rounded-2xl border border-border/45 bg-background/50 p-5">
              <p className="text-sm font-medium leading-7 text-foreground/90">
                {summary ||
                  "Nenhum resumo executivo foi gerado para esta entrevista."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoPill({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <div className="inline-flex max-w-full animate-in items-center gap-2 rounded-xl border border-border/50 bg-background/50 px-3.5 py-2 text-xs font-bold text-foreground fade-in">
      <Icon size={14} className="shrink-0 text-muted-foreground" />
      <span className="truncate">{label}</span>
    </div>
  );
}

function getDecision(score: number | null) {
  if (score === null) {
    return {
      icon: Star,
      label: "Aguardando score",
      description:
        "A entrevista foi gerada, mas ainda não há uma pontuação consolidada para tomada de decisão.",
      iconBoxClassName:
        "rounded-2xl border border-zinc-300 bg-zinc-100 p-3 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300",
      scoreCircleClassName:
        "flex h-36 w-36 shrink-0 flex-col items-center justify-center gap-2 rounded-[28px] border border-zinc-300 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200",
      badgeClassName:
        "inline-flex rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-xs font-black uppercase tracking-[0.14em] text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200",
      progressClassName: "h-full rounded-full bg-zinc-500",
    };
  }

  if (score >= 80) {
    return {
      icon: CheckCircle2,
      label: "Forte recomendação",
      description:
        "Candidato com alta aderência ao perfil esperado. Priorize perguntas para validar profundidade técnica, senioridade e contexto real de atuação.",
      iconBoxClassName:
        "rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-700 dark:text-emerald-300",
      scoreCircleClassName:
        "flex h-36 w-36 shrink-0 flex-col items-center justify-center gap-2 rounded-[28px] border border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
      badgeClassName:
        "inline-flex rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-2 text-xs font-black uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300",
      progressClassName: "h-full rounded-full bg-emerald-500",
    };
  }

  if (score >= 70) {
    return {
      icon: CheckCircle2,
      label: "Recomendado",
      description:
        "Candidato aderente à vaga. A entrevista deve focar nos pontos de confirmação, lacunas identificadas e critérios finais de decisão.",
      iconBoxClassName:
        "rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-3 text-indigo-700 dark:text-indigo-300",
      scoreCircleClassName:
        "flex h-36 w-36 shrink-0 flex-col items-center justify-center gap-2 rounded-[28px] border border-indigo-500/25 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
      badgeClassName:
        "inline-flex rounded-xl border border-indigo-500/25 bg-indigo-500/10 px-3.5 py-2 text-xs font-black uppercase tracking-[0.14em] text-indigo-700 dark:text-indigo-300",
      progressClassName: "h-full rounded-full bg-indigo-500",
    };
  }

  if (score >= 50) {
    return {
      icon: AlertTriangle,
      label: "Avaliar com atenção",
      description:
        "Candidato parcialmente aderente. A entrevista deve validar riscos, lacunas técnicas e compatibilidade com o nível esperado para a vaga.",
      iconBoxClassName:
        "rounded-2xl border border-amber-500/25 bg-amber-500/10 p-3 text-amber-700 dark:text-amber-300",
      scoreCircleClassName:
        "flex h-36 w-36 shrink-0 flex-col items-center justify-center gap-2 rounded-[28px] border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
      badgeClassName:
        "inline-flex rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 text-xs font-black uppercase tracking-[0.14em] text-amber-700 dark:text-amber-300",
      progressClassName: "h-full rounded-full bg-amber-500",
    };
  }

  return {
    icon: AlertTriangle,
    label: "Não recomendado",
    description:
      "Candidato com baixa aderência ao perfil esperado. Use a entrevista apenas se houver contexto adicional que não apareceu na análise.",
    iconBoxClassName:
      "rounded-2xl border border-rose-500/25 bg-rose-500/10 p-3 text-rose-700 dark:text-rose-300",
    scoreCircleClassName:
      "flex h-36 w-36 shrink-0 flex-col items-center justify-center gap-2 rounded-[28px] border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
    badgeClassName:
      "inline-flex rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-black uppercase tracking-[0.14em] text-rose-700 dark:text-rose-300",
    progressClassName: "h-full rounded-full bg-rose-500",
  };
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
