import type { ElementType, ReactNode } from "react";

import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  Lightbulb,
  ShieldAlert,
  ThumbsDown,
  ThumbsUp,
  XCircle,
} from "lucide-react";

import { cn } from "@/lib/supabase/utils";

import type { InterviewGuideDetail } from "@/features/interviews/server/get-interview-by-id";

type InterviewContent = InterviewGuideDetail["content"];

type ScorecardItem = {
  title?: string | null;
  name?: string | null;
  criterion?: string | null;
  description?: string | null;
  score?: number | null;
  weight?: number | null;
};

type ContentWithInsights = InterviewContent & {
  strengths?: string[] | null;
  weaknesses?: string[] | null;
  matched_skills?: string[] | null;
  missing_skills?: string[] | null;
  risks?: string[] | null;
  scorecard?: ScorecardItem[] | null;
};

interface InterviewInsightsGridProps {
  content: InterviewContent;
}

export function InterviewInsightsGrid({ content }: InterviewInsightsGridProps) {
  const data = content as ContentWithInsights;

  const matchedSkills = normalizeList(data.matched_skills);
  const missingSkills = normalizeList(data.missing_skills);
  const strengths = normalizeList(data.strengths);
  const weaknesses = normalizeList(data.weaknesses);
  const risks = normalizeList(data.risks);
  const scorecard = normalizeScorecard(data.scorecard);

  return (
    <section className="space-y-8">
      <div className="overflow-hidden rounded-[28px] border border-zinc-200/80 bg-white shadow-xl shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900/90">
        <div className="border-b border-zinc-200/80 bg-zinc-50/80 p-6 dark:border-zinc-800 dark:bg-zinc-950/40">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              Diagnóstico do candidato
            </p>

            <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
              Skills, forças e pontos de atenção
            </h2>

            <p className="max-w-3xl text-[15px] font-medium leading-7 text-zinc-500 dark:text-zinc-400">
              Use estes pontos para direcionar a entrevista, validar aderência à
              vaga e confirmar lacunas antes da decisão final.
            </p>
          </div>
        </div>

        <div className="grid gap-0 divide-y divide-zinc-200/80 dark:divide-zinc-800 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
          <InsightBlock
            title="Skills identificadas"
            description="Competências encontradas no perfil."
            icon={CheckCircle2}
            tone="emerald"
          >
            <SkillList
              items={matchedSkills}
              empty="Nenhuma skill identificada foi retornada pela IA."
              tone="emerald"
            />
          </InsightBlock>

          <InsightBlock
            title="Skills ausentes"
            description="Competências que precisam ser investigadas."
            icon={XCircle}
            tone="rose"
          >
            <SkillList
              items={missingSkills}
              empty="Nenhuma skill ausente foi retornada pela IA."
              tone="rose"
            />
          </InsightBlock>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <InsightCard
          title="Pontos fortes"
          description="Aspectos positivos para validar durante a conversa."
          icon={ThumbsUp}
          tone="indigo"
        >
          <BulletList
            items={strengths}
            empty="Nenhum ponto forte foi retornado pela IA."
            tone="indigo"
          />
        </InsightCard>

        <InsightCard
          title="Pontos fracos"
          description="Pontos de atenção que podem impactar a aderência."
          icon={ThumbsDown}
          tone="amber"
        >
          <BulletList
            items={weaknesses}
            empty="Nenhum ponto fraco foi retornado pela IA."
            tone="amber"
          />
        </InsightCard>
      </div>

      {risks.length > 0 && (
        <InsightCard
          title="Riscos e observações"
          description="Sinais que exigem validação antes da decisão final."
          icon={ShieldAlert}
          tone="rose"
        >
          <BulletList
            items={risks}
            empty="Nenhum risco foi identificado."
            tone="rose"
          />
        </InsightCard>
      )}

      {scorecard.length > 0 && (
        <InsightCard
          title="Scorecard sugerido"
          description="Critérios objetivos para avaliar o candidato durante a entrevista."
          icon={ClipboardCheck}
          tone="violet"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {scorecard.map((item, index) => (
              <ScorecardMiniCard
                key={`${getScorecardTitle(item, index)}-${index}`}
                item={item}
                index={index}
              />
            ))}
          </div>
        </InsightCard>
      )}
    </section>
  );
}

function InsightCard({
  title,
  description,
  icon: Icon,
  tone,
  children,
}: {
  title: string;
  description: string;
  icon: ElementType;
  tone: InsightTone;
  children: ReactNode;
}) {
  const style = toneStyles[tone];

  return (
    <section className="overflow-hidden rounded-[28px] border border-zinc-200/80 bg-white shadow-xl shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900/90">
      <div className="border-b border-zinc-200/80 bg-zinc-50/80 p-6 dark:border-zinc-800 dark:bg-zinc-950/40">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
              style.iconBox,
            )}
          >
            <Icon size={21} />
          </div>

          <div className="min-w-0">
            <h3 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
              {title}
            </h3>

            <p className="mt-1.5 text-[15px] leading-7 text-zinc-500 dark:text-zinc-400">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">{children}</div>
    </section>
  );
}

function InsightBlock({
  title,
  description,
  icon: Icon,
  tone,
  children,
}: {
  title: string;
  description: string;
  icon: ElementType;
  tone: InsightTone;
  children: ReactNode;
}) {
  const style = toneStyles[tone];

  return (
    <div className="p-6">
      <div className="mb-5 flex items-start gap-4">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
            style.iconBox,
          )}
        >
          <Icon size={21} />
        </div>

        <div className="min-w-0">
          <h3 className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
            {title}
          </h3>

          <p className="mt-1 text-[15px] leading-6 text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        </div>
      </div>

      {children}
    </div>
  );
}

function SkillList({
  items,
  empty,
  tone,
}: {
  items: string[];
  empty: string;
  tone: "emerald" | "rose";
}) {
  if (items.length === 0) {
    return <EmptyState text={empty} />;
  }

  return (
    <div className="flex flex-wrap gap-2.5">
      {items.map((item) => (
        <span
          key={item}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-[15px] font-black",
            tone === "emerald" &&
              "border-emerald-500/15 bg-emerald-500/8 text-emerald-700 dark:text-emerald-300",
            tone === "rose" &&
              "border-rose-500/15 bg-rose-500/8 text-rose-700 dark:text-rose-300",
          )}
        >
          {tone === "emerald" ? (
            <CheckCircle2 size={16} />
          ) : (
            <AlertTriangle size={16} />
          )}

          {item}
        </span>
      ))}
    </div>
  );
}

function BulletList({
  items,
  empty,
  tone,
}: {
  items: string[];
  empty: string;
  tone: "indigo" | "amber" | "rose";
}) {
  if (items.length === 0) {
    return <EmptyState text={empty} />;
  }

  const style = toneStyles[tone];

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={`${item}-${index}`}
          className={cn(
            `
            rounded-2xl border border-zinc-200/70 bg-white p-5
            transition-all duration-200
            hover:-translate-y-0.5 hover:shadow-lg hover:shadow-zinc-900/5
            dark:border-zinc-800 dark:bg-zinc-950/40
            `,
            style.itemHover,
          )}
        >
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-black",
                style.numberBox,
              )}
            >
              {index + 1}
            </div>

            <p className="text-[16px] font-semibold leading-8 text-zinc-700 dark:text-zinc-300">
              {item}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ScorecardMiniCard({
  item,
  index,
}: {
  item: ScorecardItem;
  index: number;
}) {
  const title = getScorecardTitle(item, index);
  const description = item.description?.trim();

  return (
    <div className="rounded-2xl border border-zinc-200/70 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-950/40">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/8 text-sm font-black text-violet-700 dark:bg-violet-500/12 dark:text-violet-300">
            {index + 1}
          </div>

          <div className="min-w-0">
            <p className="text-[15px] font-black leading-6 text-zinc-900 dark:text-zinc-100">
              {title}
            </p>

            {description && (
              <p className="mt-2 text-sm font-medium leading-6 text-zinc-500 dark:text-zinc-400">
                {description}
              </p>
            )}
          </div>
        </div>

        {typeof item.score === "number" && (
          <div className="shrink-0 rounded-lg border border-violet-500/15 bg-violet-500/8 px-2.5 py-1.5 text-xs font-black text-violet-700 dark:text-violet-300">
            {item.score}
          </div>
        )}
      </div>

      {typeof item.weight === "number" && (
        <div className="mt-4 flex items-center gap-2 text-sm font-bold text-zinc-500 dark:text-zinc-400">
          <Lightbulb size={15} />
          Peso do critério: {item.weight}
        </div>
      )}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/70 p-6 text-center dark:border-zinc-700 dark:bg-zinc-950/40">
      <p className="text-[15px] font-semibold leading-6 text-zinc-500 dark:text-zinc-400">
        {text}
      </p>
    </div>
  );
}

function normalizeList(items?: string[] | null) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => item?.trim())
    .filter((item): item is string => Boolean(item));
}

function normalizeScorecard(items?: ScorecardItem[] | null) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.filter(Boolean);
}

function getScorecardTitle(item: ScorecardItem, index: number) {
  return (
    item.title?.trim() ||
    item.name?.trim() ||
    item.criterion?.trim() ||
    `Critério ${index + 1}`
  );
}

type InsightTone = "emerald" | "rose" | "indigo" | "amber" | "violet";

const toneStyles: Record<
  InsightTone,
  {
    iconBox: string;
    numberBox: string;
    itemHover: string;
  }
> = {
  emerald: {
    iconBox:
      "bg-emerald-500/[0.08] text-emerald-600 dark:bg-emerald-500/[0.12] dark:text-emerald-300",
    numberBox:
      "bg-emerald-500/[0.08] text-emerald-700 dark:bg-emerald-500/[0.12] dark:text-emerald-300",
    itemHover: "hover:border-emerald-500/20 hover:bg-emerald-500/[0.035]",
  },
  rose: {
    iconBox:
      "bg-rose-500/[0.08] text-rose-600 dark:bg-rose-500/[0.12] dark:text-rose-300",
    numberBox:
      "bg-rose-500/[0.08] text-rose-700 dark:bg-rose-500/[0.12] dark:text-rose-300",
    itemHover: "hover:border-rose-500/20 hover:bg-rose-500/[0.035]",
  },
  indigo: {
    iconBox:
      "bg-violet-500/[0.08] text-violet-600 dark:bg-violet-500/[0.12] dark:text-violet-300",
    numberBox:
      "bg-violet-500/[0.08] text-violet-700 dark:bg-violet-500/[0.12] dark:text-violet-300",
    itemHover: "hover:border-violet-500/20 hover:bg-violet-500/[0.035]",
  },
  amber: {
    iconBox:
      "bg-amber-500/[0.08] text-amber-600 dark:bg-amber-500/[0.12] dark:text-amber-300",
    numberBox:
      "bg-amber-500/[0.08] text-amber-700 dark:bg-amber-500/[0.12] dark:text-amber-300",
    itemHover: "hover:border-amber-500/20 hover:bg-amber-500/[0.035]",
  },
  violet: {
    iconBox:
      "bg-violet-500/[0.08] text-violet-600 dark:bg-violet-500/[0.12] dark:text-violet-300",
    numberBox:
      "bg-violet-500/[0.08] text-violet-700 dark:bg-violet-500/[0.12] dark:text-violet-300",
    itemHover: "hover:border-violet-500/20 hover:bg-violet-500/[0.035]",
  },
};