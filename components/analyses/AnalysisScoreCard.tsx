import { Target } from "lucide-react";
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
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-7 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Target size={20} />
          </div>

          <div>
            <p className="text-sm font-extrabold uppercase tracking-wide text-primary">
              Pontuação por Categoria
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Distribuição da avaliação feita pela IA
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5">
        <Bar
          label="Técnico"
          value={analysis.technical_score ?? 0}
          tone="indigo"
        />
        <Bar
          label="Experiência"
          value={analysis.experience_score ?? 0}
          tone="blue"
        />
        <Bar
          label="Senioridade"
          value={analysis.seniority_score ?? 0}
          tone="purple"
        />
        <Bar
          label="Contexto"
          value={analysis.context_fit_score ?? 0}
          tone="emerald"
        />
        <Bar
          label="Comunicação"
          value={analysis.communication_score ?? 0}
          tone="amber"
        />
      </div>
    </section>
  );
}

function Bar({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "indigo" | "blue" | "purple" | "emerald" | "amber";
}) {
  const safeValue = Math.min(Math.max(value, 0), 100);

  const colors = {
    indigo: {
      bar: "bg-indigo-500",
      text: "text-indigo-600 dark:text-indigo-300",
    },
    blue: {
      bar: "bg-blue-500",
      text: "text-blue-600 dark:text-blue-300",
    },
    purple: {
      bar: "bg-purple-500",
      text: "text-purple-600 dark:text-purple-300",
    },
    emerald: {
      bar: "bg-emerald-500",
      text: "text-emerald-600 dark:text-emerald-300",
    },
    amber: {
      bar: "bg-amber-500",
      text: "text-amber-600 dark:text-amber-300",
    },
  };

  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-sm font-bold text-foreground">{label}</span>

        <span className={cn("text-sm font-black", colors[tone].text)}>
          {safeValue}%
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all", colors[tone].bar)}
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}
