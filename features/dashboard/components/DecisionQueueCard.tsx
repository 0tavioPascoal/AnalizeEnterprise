import { AlertTriangle, CheckCircle2, Clock, Target } from "lucide-react";

import type { DashboardAnalysisItem } from "@/features/dashboard/server/get-dashboard-overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/supabase/utils";

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
  const pending = candidates.filter(
    (candidate) => candidate.status === "pending",
  );

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
      percentage:
        totalPending > 0 ? Math.round((highScore / totalPending) * 100) : 0,
      className: "bg-emerald-500",
    },
    {
      label: "Avaliação média",
      description: "Score entre 50% e 69%",
      total: mediumScore,
      percentage:
        totalPending > 0 ? Math.round((mediumScore / totalPending) * 100) : 0,
      className: "bg-amber-500",
    },
    {
      label: "Baixa aderência",
      description: "Score abaixo de 50%",
      total: lowScore,
      percentage:
        totalPending > 0 ? Math.round((lowScore / totalPending) * 100) : 0,
      className: "bg-red-500",
    },
  ];

  return (
    <Card className="col-span-12 flex min-h-80 flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/85 py-0 shadow-sm transition-all duration-300 hover:border-primary/20 hover:bg-card hover:shadow-md xl:col-span-4 xl:min-h-0">
      <CardHeader className="shrink-0 border-b border-border/40 bg-muted/10 px-4 py-3 md:px-5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-xs font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
              Fila Pendente
            </CardTitle>

            <p className="mt-1 truncate text-sm font-medium text-foreground">
              Resumo das análises que ainda aguardam decisão
            </p>
          </div>

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-primary/10 text-primary">
            <Clock size={18} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="custom-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto p-4 md:p-5">
        {totalPending > 0 ? (
          <>
            <div className="grid grid-cols-3 gap-2">
              <MetricBox label="Pendentes" value={totalPending} icon={Clock} />
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

            <div className="mt-5 space-y-3.5">
              {ranges.map((range) => (
                <div key={range.label}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-foreground">
                        {range.label}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        {range.description}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-black text-foreground">
                        {range.total}
                      </p>

                      <p className="text-xs font-medium text-muted-foreground">
                        {range.percentage}%
                      </p>
                    </div>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn("h-full rounded-full", range.className)}
                      style={{ width: `${range.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-5">
              <div className="rounded-xl border border-border/50 bg-muted/25 p-3">
                <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                  <AlertTriangle size={16} />

                  <span className="text-[11px] font-extrabold uppercase">
                    Leitura rápida
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {highScore > 0
                    ? `${highScore} candidato(s) pendente(s) estão acima de 70% de aderência.`
                    : "Nenhum candidato pendente está acima de 70% de aderência no momento."}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <CheckCircle2 size={20} />
            </div>

            <p className="text-sm font-bold text-foreground">
              Fila limpa
            </p>

            <p className="mt-1 max-w-48 text-sm leading-relaxed text-muted-foreground">
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
    <div className="rounded-xl border border-border/45 bg-muted/15 p-3 transition-colors hover:bg-muted/25">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="truncate text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </span>

        <Icon size={14} className="shrink-0 text-muted-foreground" />
      </div>

      <p className="truncate text-xl font-black text-foreground">{value}</p>
    </div>
  );
}
