import {
  BriefcaseBusiness,
  MessageCircle,
  Target,
  TrendingUp,
  UserCheck,
} from "lucide-react";

import { cn } from "@/lib/supabase/utils";

interface AnalysisScoreCardProps {
  analysis: {
    technical_score?: number | null;
    experience_score?: number | null;
    seniority_score?: number | null;
    context_fit_score?: number | null;
    communication_score?: number | null;
  };
}

export function AnalysisScoreCard({ analysis }: AnalysisScoreCardProps) {
  const scores = [
    {
      label: "Técnico",
      description: "Aderência às skills técnicas da vaga.",
      value: analysis.technical_score,
      max: 30,
      icon: Target,
      tone: "indigo" as const,
    },
    {
      label: "Experiência",
      description: "Evidência prática relacionada à vaga.",
      value: analysis.experience_score,
      max: 25,
      icon: BriefcaseBusiness,
      tone: "blue" as const,
    },
    {
      label: "Senioridade",
      description: "Compatibilidade com o nível esperado.",
      value: analysis.seniority_score,
      max: 20,
      icon: UserCheck,
      tone: "purple" as const,
    },
    {
      label: "Contexto",
      description: "Fit com responsabilidades e cenário da vaga.",
      value: analysis.context_fit_score,
      max: 15,
      icon: TrendingUp,
      tone: "emerald" as const,
    },
    {
      label: "Comunicação",
      description: "Clareza e qualidade das informações do currículo.",
      value: analysis.communication_score,
      max: 10,
      icon: MessageCircle,
      tone: "amber" as const,
    },
  ];

  const total = scores.reduce(
    (sum, item) => sum + normalizeScore(item.value, item.max),
    0,
  );

  return (
    <section className="overflow-hidden rounded-3xl border border-border/60 bg-card/80 shadow-md transition-all duration-300 hover:border-primary/20 hover:shadow-lg">
      <div className="border-b border-border/50 bg-muted/15 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/[0.08] text-indigo-600 dark:bg-indigo-500/[0.12] dark:text-indigo-300">
              <Target size={21} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground/80">
                Pontuação por categoria
              </p>

              <h2 className="mt-1 text-2xl font-black tracking-tight text-foreground">
                Distribuição da avaliação
              </h2>

              <p className="mt-1.5 text-xs font-semibold leading-relaxed text-muted-foreground">
                Breakdown da pontuação usada pela IA para compor o score final
                da triagem.
              </p>
            </div>
          </div>

          <div className="hidden shrink-0 rounded-2xl border border-indigo-500/15 bg-indigo-500/[0.08] px-4 py-3 text-right text-indigo-700 dark:text-indigo-300 sm:block">
            <p className="text-2xl font-black leading-none">{total}</p>
            <p className="mt-1 text-[10px] font-black uppercase tracking-[0.16em]">
              de 100
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid gap-4">
          {scores.map((item) => (
            <ScoreBar
              key={item.label}
              label={item.label}
              description={item.description}
              value={item.value}
              max={item.max}
              icon={item.icon}
              tone={item.tone}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ScoreBar({
  label,
  description,
  value,
  max,
  icon: Icon,
  tone,
}: {
  label: string;
  description: string;
  value?: number | null;
  max: number;
  icon: React.ElementType;
  tone: "indigo" | "blue" | "purple" | "emerald" | "amber";
}) {
  const safeValue = normalizeScore(value, max);
  const percentage = max > 0 ? Math.round((safeValue / max) * 100) : 0;
  const style = toneStyles[tone];

  return (
    <div className="rounded-2xl border border-border/50 bg-muted/15 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
              style.iconBox,
            )}
          >
            <Icon size={19} />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-black leading-6 text-foreground">
              {label}
            </p>

            <p className="mt-1 text-xs font-semibold leading-relaxed text-muted-foreground/80">
              {description}
            </p>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p className={cn("text-xl font-black leading-none", style.text)}>
            {safeValue}/{max}
          </p>

          <p className="mt-1 text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground/80">
            {percentage}%
          </p>
        </div>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            style.bar,
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function normalizeScore(value: number | null | undefined, max: number) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }

  if (value < 0) {
    return 0;
  }

  if (value > max) {
    return max;
  }

  return Math.round(value);
}

const toneStyles = {
  indigo: {
    bar: "bg-indigo-500",
    text: "text-indigo-700 dark:text-indigo-300",
    iconBox:
      "bg-indigo-500/[0.08] text-indigo-600 dark:bg-indigo-500/[0.12] dark:text-indigo-300",
  },
  blue: {
    bar: "bg-blue-500",
    text: "text-blue-700 dark:text-blue-300",
    iconBox:
      "bg-blue-500/[0.08] text-blue-600 dark:bg-blue-500/[0.12] dark:text-blue-300",
  },
  purple: {
    bar: "bg-purple-500",
    text: "text-purple-700 dark:text-purple-300",
    iconBox:
      "bg-purple-500/[0.08] text-purple-600 dark:bg-purple-500/[0.12] dark:text-purple-300",
  },
  emerald: {
    bar: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-300",
    iconBox:
      "bg-emerald-500/[0.08] text-emerald-600 dark:bg-emerald-500/[0.12] dark:text-emerald-300",
  },
  amber: {
    bar: "bg-amber-500",
    text: "text-amber-700 dark:text-amber-300",
    iconBox:
      "bg-amber-500/[0.08] text-amber-600 dark:bg-amber-500/[0.12] dark:text-amber-300",
  },
};