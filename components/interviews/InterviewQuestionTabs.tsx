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

type InterviewContent = InterviewGuideDetail["content"];

type QuestionTone = "indigo" | "emerald" | "amber" | "rose";

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

const triggerTones: Record<QuestionTone, string> = {
  indigo:
    "data-[state=active]:border-violet-500/25 data-[state=active]:bg-violet-500/10 data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-300",
  emerald:
    "data-[state=active]:border-emerald-500/25 data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-700 dark:data-[state=active]:text-emerald-300",
  amber:
    "data-[state=active]:border-amber-500/25 data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-700 dark:data-[state=active]:text-amber-300",
  rose:
    "data-[state=active]:border-rose-500/25 data-[state=active]:bg-rose-500/10 data-[state=active]:text-rose-700 dark:data-[state=active]:text-rose-300",
};

const iconTones: Record<QuestionTone, string> = {
  indigo:
    "bg-violet-500/[0.08] text-violet-700 dark:bg-violet-500/[0.12] dark:text-violet-300",
  emerald:
    "bg-emerald-500/[0.08] text-emerald-700 dark:bg-emerald-500/[0.12] dark:text-emerald-300",
  amber:
    "bg-amber-500/[0.08] text-amber-700 dark:bg-amber-500/[0.12] dark:text-amber-300",
  rose:
    "bg-rose-500/[0.08] text-rose-700 dark:bg-rose-500/[0.12] dark:text-rose-300",
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
    <section className="overflow-hidden rounded-[28px] border border-zinc-200/80 bg-white shadow-xl shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900/90">
      <div className="border-b border-zinc-200/80 bg-zinc-50/80 p-6 dark:border-zinc-800 dark:bg-zinc-950/40">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              Roteiro da entrevista
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
              Perguntas por seção
            </h2>

            <p className="mt-2 text-[15px] font-medium leading-6 text-zinc-500 dark:text-zinc-400">
              Selecione uma aba para visualizar somente o grupo de perguntas
              desejado.
            </p>
          </div>

          <div className="shrink-0 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm font-black text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
            {totalQuestions}
          </div>
        </div>
      </div>

      <Tabs defaultValue={defaultValue} className="flex flex-col p-6">
        <TabsList
          className={cn(
            `
            grid! h-auto! w-full! grid-cols-1!
            items-stretch! gap-2.5
            rounded-2xl bg-zinc-100/80 p-2
            dark:bg-zinc-950/70
            sm:grid-cols-2!
            `,
          )}
        >
          {groups.map((group) => {
            const Icon = group.icon;

            return (
              <TabsTrigger
                key={group.value}
                value={group.value}
                className={cn(
                  `
                  h-auto! min-h-21 whitespace-normal!
                  justify-start gap-3 rounded-xl
                  border border-transparent px-4 py-4
                  text-left text-zinc-600 shadow-none
                  transition-all
                  hover:bg-white/70
                  data-[state=active]:shadow-sm
                  dark:text-zinc-400
                  dark:hover:bg-zinc-900/70
                  `,
                  triggerTones[group.tone],
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                    iconTones[group.tone],
                  )}
                >
                  <Icon size={18} />
                </div>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-black leading-5">
                    {group.shortTitle}
                  </span>

                  <span className="mt-1 block text-xs font-bold opacity-75">
                    {group.items.length} perguntas
                  </span>
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <div className="mt-7 min-h-0">
          {groups.map((group) => (
            <TabsContent
              key={group.value}
              value={group.value}
              className="m-0 focus-visible:outline-none"
            >
              <QuestionPanel group={group} />
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </section>
  );
}

function QuestionPanel({ group }: { group: QuestionGroup }) {
  const Icon = group.icon;

  return (
    <div className="min-h-0">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3.5">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
              iconTones[group.tone],
            )}
          >
            <Icon size={21} />
          </div>

          <div className="min-w-0">
            <h3 className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
              {group.title}
            </h3>

            <p className="mt-1.5 text-[15px] leading-7 text-zinc-500 dark:text-zinc-400">
              {group.description}
            </p>
          </div>
        </div>

        <div className="shrink-0 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-black text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
          {group.items.length}
        </div>
      </div>

      {group.items.length > 0 ? (
        <div className="max-h-170 space-y-4 overflow-y-auto pr-1.5">
          {group.items.map((item, index) => (
            <div
              key={`${group.value}-${item}-${index}`}
              className="
                relative overflow-hidden rounded-2xl
                border border-zinc-200/70 bg-white
                px-5 py-5
                transition-all duration-200
                hover:-translate-y-0.5
                hover:border-zinc-300
                hover:shadow-lg hover:shadow-zinc-900/5
                dark:border-zinc-800 dark:bg-zinc-950/40
                dark:hover:border-zinc-700
              "
            >
              <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-700" />

              <div
                className={cn(
                  `
                  mb-4 inline-flex items-center rounded-lg
                  px-3 py-1.5
                  text-[11px] font-black uppercase tracking-[0.15em]
                  `,
                  iconTones[group.tone],
                )}
              >
                Pergunta {String(index + 1).padStart(2, "0")}
              </div>

              <p className="text-[17px] font-semibold leading-8 tracking-[-0.01em] text-zinc-900 dark:text-zinc-100">
                {item}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-300 p-7 text-center dark:border-zinc-700">
          <p className="text-[15px] font-semibold text-zinc-600 dark:text-zinc-300">
            Nenhuma pergunta gerada nesta seção.
          </p>

          <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            Essa aba ficará disponível quando a IA retornar perguntas para esta
            categoria.
          </p>
        </div>
      )}
    </div>
  );
}