import { AlertTriangle, CheckCircle2, Clock, Target } from "lucide-react";

import type { DashboardAnalysisItem } from "@/actions/dashboard/getDashboadOverview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DecisionQueueCardProps {
  candidates: DashboardAnalysisItem[];
}

interface ScoreRange {
  label: string;
  description: string;
  total: number;
  percentage: number;
  className: string;
}

export function DecisionQueueCard({ candidates }: DecisionQueueCardProps) {
  const pending = candidates.filter((candidate) => candidate.status === "pending");

  const totalPending = pending.length;

  const highScore = pending.filter((candidate) => candidate.score >= 70).length;
  const mediumScore = pending.filter(
    (candidate) => candidate.score >= 50 && candidate.score < 70,
  ).length;
  const lowScore = pending.filter((candidate) => candidate.score < 50).length;

  const averageScore =
    totalPending > 0
      ? Math.round(
          pending.reduce((sum, candidate) => sum + candidate.score, 0) /
            totalPending,
        )
      : 0;

  const highestScore =
    totalPending > 0
      ? Math.max(...pending.map((candidate) => candidate.score))
      : 0;

  const ranges: ScoreRange[] = [
    {
      label: "Alto potencial",
      description: "Score acima de 70%",
      total: highScore,
      percentage: totalPending > 0 ? Math.round((highScore / totalPending) * 100) : 0,
      className: "bg-emerald-500",
    },
    {
      label: "Avaliação média",
      description: "Score entre 50% e 69%",
      total: mediumScore,
      percentage: totalPending > 0 ? Math.round((mediumScore / totalPending) * 100) : 0,
      className: "bg-amber-500",
    },
    {
      label: "Baixa aderência",
      description: "Score abaixo de 50%",
      total: lowScore,
      percentage: totalPending > 0 ? Math.round((lowScore / totalPending) * 100) : 0,
      className: "bg-red-500",
    },
  ];

  return (
    <Card className="col-span-12 flex min-h-0 flex-col overflow-hidden border-none bg-white shadow-sm dark:bg-zinc-900 xl:col-span-4 mr-5">
      <CardHeader className="shrink-0 border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Fila Pendente
            </CardTitle>
            <p className="mt-1 text-[11px] text-zinc-500">
              Resumo das análises que ainda aguardam decisão
            </p>
          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <Clock size={18} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex min-h-0 flex-1 flex-col overflow-y-auto p-5">
        {totalPending > 0 ? (
          <>
            <div className="grid grid-cols-3 gap-3">
              <MetricBox
                label="Pendentes"
                value={totalPending}
                icon={Clock}
              />
              <MetricBox
                label="Média"
                value={`${averageScore}%`}
                icon={Target}
              />
              <MetricBox
                label="Maior"
                value={`${highestScore}%`}
                icon={CheckCircle2}
              />
            </div>

            <div className="mt-6 space-y-4">
              {ranges.map((range) => (
                <div key={range.label}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        {range.label}
                      </p>
                      <p className="truncate text-[10px] text-zinc-500">
                        {range.description}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-xs font-black text-zinc-900 dark:text-zinc-100">
                        {range.total}
                      </p>
                      <p className="text-[10px] text-zinc-400">
                        {range.percentage}%
                      </p>
                    </div>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className={cn("h-full rounded-full", range.className)}
                      style={{ width: `${range.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-6">
              <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-800/50">
                <div className="mb-2 flex items-center gap-2 text-zinc-500">
                  <AlertTriangle size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Leitura rápida
                  </span>
                </div>

                <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {highScore > 0
                    ? `${highScore} candidato(s) pendente(s) estão acima de 70% de aderência.`
                    : "Nenhum candidato pendente está acima de 70% de aderência no momento."}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
              <CheckCircle2 size={22} />
            </div>

            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Fila limpa
            </p>

            <p className="mt-1 max-w-48 text-xs text-zinc-500">
              Nenhuma análise pendente aguardando decisão.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface MetricBoxProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
}

function MetricBox({ label, value, icon: Icon }: MetricBoxProps) {
  return (
    <div className="rounded-2xl bg-zinc-50 p-3 dark:bg-zinc-800/50">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="truncate text-[9px] font-black uppercase tracking-widest text-zinc-400">
          {label}
        </span>
        <Icon size={13} className="shrink-0 text-zinc-400" />
      </div>

      <p className="text-lg font-black text-zinc-900 dark:text-zinc-100">
        {value}
      </p>
    </div>
  );
}