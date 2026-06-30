import type { LucideIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/supabase/utils";

type QuestionTone = "indigo" | "emerald" | "amber" | "rose";

interface InterviewQuestionSectionProps {
  title: string;
  icon: LucideIcon;
  items: string[];
  tone?: QuestionTone;
}

const tones: Record<
  QuestionTone,
  {
    iconBox: string;
    badge: string;
    button: string;
    itemNumber: string;
    itemHover: string;
  }
> = {
  indigo: {
    iconBox:
      "bg-violet-500/[0.08] text-violet-600 dark:bg-violet-500/[0.12] dark:text-violet-300",
    badge:
      "border-violet-500/15 bg-violet-500/[0.06] text-violet-700 dark:text-violet-300",
    button: "text-violet-700 hover:text-violet-800 dark:text-violet-300",
    itemNumber:
      "bg-violet-500/[0.08] text-violet-700 dark:bg-violet-500/[0.12] dark:text-violet-300",
    itemHover: "hover:border-violet-500/20 hover:bg-violet-500/[0.035]",
  },
  emerald: {
    iconBox:
      "bg-emerald-500/[0.08] text-emerald-600 dark:bg-emerald-500/[0.12] dark:text-emerald-300",
    badge:
      "border-emerald-500/15 bg-emerald-500/[0.06] text-emerald-700 dark:text-emerald-300",
    button: "text-emerald-700 hover:text-emerald-800 dark:text-emerald-300",
    itemNumber:
      "bg-emerald-500/[0.08] text-emerald-700 dark:bg-emerald-500/[0.12] dark:text-emerald-300",
    itemHover: "hover:border-emerald-500/20 hover:bg-emerald-500/[0.035]",
  },
  amber: {
    iconBox:
      "bg-amber-500/[0.08] text-amber-600 dark:bg-amber-500/[0.12] dark:text-amber-300",
    badge:
      "border-amber-500/15 bg-amber-500/[0.06] text-amber-700 dark:text-amber-300",
    button: "text-amber-700 hover:text-amber-800 dark:text-amber-300",
    itemNumber:
      "bg-amber-500/[0.08] text-amber-700 dark:bg-amber-500/[0.12] dark:text-amber-300",
    itemHover: "hover:border-amber-500/20 hover:bg-amber-500/[0.035]",
  },
  rose: {
    iconBox:
      "bg-rose-500/[0.08] text-rose-600 dark:bg-rose-500/[0.12] dark:text-rose-300",
    badge:
      "border-rose-500/15 bg-rose-500/[0.06] text-rose-700 dark:text-rose-300",
    button: "text-rose-700 hover:text-rose-800 dark:text-rose-300",
    itemNumber:
      "bg-rose-500/[0.08] text-rose-700 dark:bg-rose-500/[0.12] dark:text-rose-300",
    itemHover: "hover:border-rose-500/20 hover:bg-rose-500/[0.035]",
  },
};

export function InterviewQuestionSection({
  title,
  icon: Icon,
  items,
  tone = "indigo",
}: InterviewQuestionSectionProps) {
  const style = tones[tone];
  const visibleItems = items.slice(0, 5);

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
              style.iconBox,
            )}
          >
            <Icon size={18} />
          </div>

          <div className="min-w-0">
            <p className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
              {title}
            </p>

            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Roteiro sugerido pela IA para conduzir a entrevista
            </p>
          </div>
        </div>

        <div
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-black",
            style.badge,
          )}
        >
          {items.length} perguntas
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {items.length > 0 ? (
          <>
            {visibleItems.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className={cn(
                  `
                  group relative overflow-hidden rounded-xl
                  border border-zinc-200/70 bg-white
                  px-5 py-5
                  transition-all duration-200
                  hover:-translate-y-0.5
                  hover:shadow-lg hover:shadow-zinc-900/5
                  dark:border-zinc-800 dark:bg-zinc-950/40
                  `,
                  style.itemHover,
                )}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-700" />

                <div className="mb-4 flex items-center justify-between gap-3">
                  <div
                    className={cn(
                      `
                      inline-flex items-center rounded-lg
                      px-2.5 py-1
                      text-[10px] font-black uppercase tracking-[0.15em]
                      `,
                      style.itemNumber,
                    )}
                  >
                    Pergunta {String(index + 1).padStart(2, "0")}
                  </div>
                </div>

                <p className="text-[17px] font-semibold leading-8 tracking-[-0.01em] text-zinc-900 dark:text-zinc-100">
                  {item}
                </p>
              </div>
            ))}

            {items.length > 5 && (
              <button
                type="button"
                className={cn(
                  "mt-2 inline-flex items-center gap-1.5 text-sm font-black transition-colors",
                  style.button,
                )}
              >
                Ver todas as perguntas
                <ChevronDown size={15} />
              </button>
            )}
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-zinc-300 p-5 text-center dark:border-zinc-700">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Nenhuma pergunta gerada.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
