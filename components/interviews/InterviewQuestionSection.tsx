"use client";

import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ClipboardList,
  MessageCircle,
  Target,
} from "lucide-react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { cn } from "@/lib/supabase/utils";

import type { InterviewGuideDetail } from "@/actions/interviews/getInterviewById";

type QuestionTone = "indigo" | "emerald" | "amber" | "rose";

type InterviewContent = InterviewGuideDetail["content"];

interface InterviewQuestionTabsProps {
  content: InterviewContent;
}

interface QuestionGroup {
  value: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: LucideIcon;
  items: string[];
  tone: QuestionTone;
}

const tones: Record<
  QuestionTone,
  {
    iconBox: string;
    badge: string;
    triggerActive: string;
    itemNumber: string;
    itemHover: string;
  }
> = {
  indigo: {
    iconBox:
      "bg-violet-500/[0.08] text-violet-600 dark:bg-violet-500/[0.12] dark:text-violet-300",
    badge:
      "border-violet-500/15 bg-violet-500/[0.06] text-violet-700 dark:text-violet-300",
    triggerActive:
      "data-[state=active]:border-violet-500/20 data-[state=active]:bg-violet-500/[0.08] data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-300",
    itemNumber:
      "bg-violet-500/[0.08] text-violet-700 dark:bg-violet-500/[0.12] dark:text-violet-300",
    itemHover: "hover:border-violet-500/20 hover:bg-violet-500/[0.035]",
  },
  emerald: {
    iconBox:
      "bg-emerald-500/[0.08] text-emerald-600 dark:bg-emerald-500/[0.12] dark:text-emerald-300",
    badge:
      "border-emerald-500/15 bg-emerald-500/[0.06] text-emerald-700 dark:text-emerald-300",
    triggerActive:
      "data-[state=active]:border-emerald-500/20 data-[state=active]:bg-emerald-500/[0.08] data-[state=active]:text-emerald-700 dark:data-[state=active]:text-emerald-300",
    itemNumber:
      "bg-emerald-500/[0.08] text-emerald-700 dark:bg-emerald-500/[0.12] dark:text-emerald-300",
    itemHover: "hover:border-emerald-500/20 hover:bg-emerald-500/[0.035]",
  },
  amber: {
    iconBox:
      "bg-amber-500/[0.08] text-amber-600 dark:bg-amber-500/[0.12] dark:text-amber-300",
    badge:
      "border-amber-500/15 bg-amber-500/[0.06] text-amber-700 dark:text-amber-300",
    triggerActive:
      "data-[state=active]:border-amber-500/20 data-[state=active]:bg-amber-500/[0.08] data-[state=active]:text-amber-700 dark:data-[state=active]:text-amber-300",
    itemNumber:
      "bg-amber-500/[0.08] text-amber-700 dark:bg-amber-500/[0.12] dark:text-amber-300",
    itemHover: "hover:border-amber-500/20 hover:bg-amber-500/[0.035]",
  },
  rose: {
    iconBox:
      "bg-rose-500/[0.08] text-rose-600 dark:bg-rose-500/[0.12] dark:text-rose-300",
    badge:
      "border-rose-500/15 bg-rose-500/[0.06] text-rose-700 dark:text-rose-300",
    triggerActive:
      "data-[state=active]:border-rose-500/20 data-[state=active]:bg-rose-500/[0.08] data-[state=active]:text-rose-700 dark:data-[state=active]:text-rose-300",
    itemNumber:
      "bg-rose-500/[0.08] text-rose-700 dark:bg-rose-500/[0.12] dark:text-rose-300",
    itemHover: "hover:border-rose-500/20 hover:bg-rose-500/[0.035]",
  },
};

export function InterviewQuestionTabs({ content }: InterviewQuestionTabsProps) {
  const groups: QuestionGroup[] = [
    {
      value: "technical",
      title: "Perguntas Técnicas",
      shortTitle: "Técnicas",
      description: "Valide conhecimento técnico, stack, arquitetura e prática.",
      icon: Target,
      items: content?.technical_questions ?? [],
      tone: "indigo",
    },
    {
      value: "behavioral",
      title: "Perguntas Comportamentais",
      shortTitle: "Comport.",
      description: "Avalie comunicação, colaboração, maturidade e postura.",
      icon: MessageCircle,
      items: content?.behavioral_questions ?? [],
      tone: "emerald",
    },
    {
      value: "risk",
      title: "Perguntas de Risco",
      shortTitle: "Riscos",
      description: "Confirme pontos sensíveis, inconsistências e lacunas.",
      icon: AlertTriangle,
      items: content?.risk_questions ?? [],
      tone: "amber",
    },
    {
      value: "missing-skills",
      title: "Skills Ausentes",
      shortTitle: "Skills",
      description: "Investigue habilidades ausentes ou pouco evidentes.",
      icon: ClipboardList,
      items: content?.missing_skill_questions ?? [],
      tone: "rose",
    },
  ];

  const defaultValue =
    groups.find((group) => group.items.length > 0)?.value ?? groups[0].value;

  const totalQuestions = groups.reduce(
    (total, group) => total + group.items.length,
    0,
  );

  return (
    <section className="overflow-hidden rounded-[26px] border border-zinc-200/80 bg-white shadow-xl shadow-zinc-900/4 dark:border-zinc-800 dark:bg-zinc-900/90">
      <div className="border-b border-zinc-200/80 bg-zinc-50/80 p-5 dark:border-zinc-800 dark:bg-zinc-950/40">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              Roteiro da entrevista
            </p>

            <h2 className="mt-1 text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
              Perguntas por seção
            </h2>

            <p className="mt-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Selecione uma aba para visualizar somente aquele grupo de perguntas.
            </p>
          </div>

          <div className="shrink-0 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-black text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
            {totalQuestions} perguntas
          </div>
        </div>
      </div>

      <Tabs defaultValue={defaultValue} className="p-5">
        <TabsList className="grid h-auto grid-cols-2 gap-2 rounded-2xl bg-zinc-100/80 p-1.5 dark:bg-zinc-950/70">
          {groups.map((group) => {
            const style = tones[group.tone];
            const Icon = group.icon;

            return (
              <TabsTrigger
                key={group.value}
                value={group.value}
                className={cn(
                  `
                  h-auto justify-start gap-2 rounded-xl border border-transparent
                  px-3 py-3 text-left text-zinc-600 shadow-none
                  transition-all
                  data-[state=active]:shadow-sm
                  dark:text-zinc-400
                  `,
                  style.triggerActive,
                )}
              >
                <Icon size={15} className="shrink-0" />

                <span className="min-w-0">
                  <span className="block truncate text-xs font-black">
                    {group.shortTitle}
                  </span>

                  <span className="mt-0.5 block text-[10px] font-bold opacity-70">
                    {group.items.length}
                  </span>
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {groups.map((group) => (
          <TabsContent
            key={group.value}
            value={group.value}
            className="mt-5 focus-visible:outline-none"
          >
            <QuestionPanel group={group} />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}

function QuestionPanel({ group }: { group: QuestionGroup }) {
  const style = tones[group.tone];
  const Icon = group.icon;

  return (
    <div>
      <div className="mb-5 flex items-start justify-between gap-4">
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
            <h3 className="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-100">
              {group.title}
            </h3>

            <p className="mt-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              {group.description}
            </p>
          </div>
        </div>

        <div
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-black",
            style.badge,
          )}
        >
          {group.items.length}
        </div>
      </div>

      {group.items.length > 0 ? (
        <div className="max-h-155 space-y-3 overflow-y-auto pr-1">
          {group.items.map((item, index) => (
            <div
              key={`${group.value}-${item}-${index}`}
              className={cn(
                `
                group relative overflow-hidden rounded-xl
                border border-zinc-200/70 bg-white
                px-4 py-4
                transition-all duration-200
                hover:-translate-y-0.5
                hover:shadow-lg hover:shadow-zinc-900/5
                dark:border-zinc-800 dark:bg-zinc-950/40
                `,
                style.itemHover,
              )}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-700" />

              <div className="mb-3 flex items-center justify-between gap-3">
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

              <p className="text-[15px] font-semibold leading-7 tracking-[-0.01em] text-zinc-900 dark:text-zinc-100">
                {item}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-zinc-300 p-6 text-center dark:border-zinc-700">
          <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
            Nenhuma pergunta gerada nesta seção.
          </p>

          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Essa aba ficará disponível quando a IA retornar perguntas para esta categoria.
          </p>
        </div>
      )}
    </div>
  );
}