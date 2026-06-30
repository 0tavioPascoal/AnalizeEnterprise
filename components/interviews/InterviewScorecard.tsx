import type { ElementType } from "react";

import {
  BriefcaseBusiness,
  ClipboardList,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Star,
  UsersRound,
} from "lucide-react";

import type { InterviewGuideContent } from "@/actions/interviews/getInterviewById";

interface InterviewScorecardProps {
  items: NonNullable<InterviewGuideContent["scorecard"]>;
  compact?: boolean;
}

const icons = [
  BriefcaseBusiness,
  UsersRound,
  MessageCircle,
  Sparkles,
  ShieldCheck,
];

export function InterviewScorecard({
  items,
  compact = false,
}: InterviewScorecardProps) {
  const weights = getWeights(items.length);
  const total = weights.reduce((sum, value) => sum + value, 0);

  return (
    <section
      className={
        compact
          ? "rounded-xl border border-border bg-muted/40 p-2"
          : "rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6"
      }
    >
      {!compact && (
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/8 text-violet-600 dark:bg-violet-500/12 dark:text-violet-300">
            <Star size={18} />
          </div>

          <div>
            <p className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
              Scorecard Sugerido
            </p>

            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Peso recomendado para avaliação da entrevista
            </p>
          </div>
        </div>
      )}

      {items.length > 0 ? (
        <>
          <div
            className={
              compact
                ? "flex w-full min-w-0 items-stretch gap-2 overflow-x-auto xl:overflow-visible"
                : "grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6"
            }
          >
            {items.map((item, index) => {
              const Icon = icons[index % icons.length];

              return (
                <ScoreBox
                  key={`${item.title}-${index}`}
                  icon={Icon}
                  label={formatTitle(item.title)}
                  value={`${weights[index] ?? 0}%`}
                  compact={compact}
                />
              );
            })}

            <ScoreBox
              icon={ClipboardList}
              label={compact ? "Total" : "Pontuação Total"}
              value={`${total}%`}
              highlight
              compact={compact}
            />
          </div>

          {!compact && (
            <div className="mt-4 rounded-xl border border-sky-500/15 bg-sky-500/6 px-4 py-3">
              <p className="text-sm leading-relaxed text-sky-700 dark:text-sky-300">
                Use este scorecard para avaliar o candidato durante e após a
                entrevista.
              </p>
            </div>
          )}
        </>
      ) : (
        <div
          className={
            compact
              ? "flex min-h-20 items-center justify-center rounded-xl border border-dashed border-zinc-300 px-5 text-center text-sm font-semibold text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"
              : "rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground"
          }
        >
          Nenhum critério gerado.
        </div>
      )}
    </section>
  );
}

function ScoreBox({
  icon: Icon,
  label,
  value,
  highlight,
  compact,
}: {
  icon: ElementType;
  label: string;
  value: string;
  highlight?: boolean;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div
        className={
          highlight
            ? "flex min-h-20 min-w-24 flex-col justify-between rounded-xl border border-violet-500/20 bg-violet-500/10 px-3 py-2 shadow-sm"
            : "flex min-h-20 min-w-24 flex-col justify-between rounded-xl border border-zinc-200/80 bg-white px-3 py-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70"
        }
      >
        <div className="flex items-center justify-between gap-2">
          <div
            className={
              highlight
                ? "flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-300"
                : "flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-300"
            }
          >
            <Icon size={14} />
          </div>

          <p className="text-base font-black text-zinc-900 dark:text-zinc-100">
            {value}
          </p>
        </div>

        <span className="mt-2 line-clamp-2 text-[9px] font-black uppercase leading-tight tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
          {label}
        </span>
      </div>
    );
  }

  return (
    <div
      className={
        highlight
          ? "flex flex-col justify-between rounded-xl border border-violet-500/10 bg-violet-500/5 p-4"
          : "flex flex-col justify-between rounded-xl border border-zinc-200/80 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/60"
      }
    >
      <div
        className={
          highlight
            ? "mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/8 text-violet-600 dark:bg-violet-500/12 dark:text-violet-300"
            : "mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/8 text-sky-600 dark:bg-sky-500/12 dark:text-sky-300"
        }
      >
        <Icon size={17} />
      </div>

      <p className="line-clamp-2 min-h-10 text-xs font-black leading-tight text-zinc-700 dark:text-zinc-200">
        {label}
      </p>

      <p
        className={
          highlight
            ? "mt-3 text-3xl font-black text-violet-600 dark:text-violet-300"
            : "mt-3 text-xl font-black text-zinc-900 dark:text-zinc-100"
        }
      >
        {value}
      </p>
    </div>
  );
}

function getWeights(totalItems: number): number[] {
  if (totalItems <= 0) return [];

  const base = Math.floor(100 / totalItems);
  const remainder = 100 - base * totalItems;

  return Array.from({ length: totalItems }, (_, index) =>
    index === 0 ? base + remainder : base,
  );
}

function formatTitle(value: string): string {
  return value
    .replace("Conhecimento Técnico", "Técnico")
    .replace("Experiência Prática", "Experiência")
    .replace("Comunicação e Colaboração", "Comunicação")
    .replace("Problema Solving e Análise", "Resolução de Problemas")
    .replace("Aprendizado e Adaptação", "Adaptação");
}
