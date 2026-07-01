"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  AlertTriangle,
  CheckCircle2,
  Gauge,
  Loader2,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { approveAnalysis } from "@/actions/analyzes/aproveAnalizys";
import { rejectAnalysis } from "@/actions/analyzes/rejectAnalizys";

import { cn } from "@/lib/supabase/utils";

type AnalysisStatus = "pending" | "approved" | "rejected";

type Recommendation =
  | "strong_match"
  | "match"
  | "partial_match"
  | "no_match"
  | string;

interface AnalysisResultCardProps {
  analysis: {
    id: string;
    match: boolean;
    score: number;
    passed_minimum_score: boolean;
    recommendation?: Recommendation | null;
    status?: AnalysisStatus | null;
  };
}

type ActionType = "approve" | "reject" | null;

export function AnalysisResultCard({ analysis }: AnalysisResultCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [status, setStatus] = useState<AnalysisStatus>(
    analysis.status ?? "pending",
  );

  const [currentAction, setCurrentAction] = useState<ActionType>(null);

  const isApproved = status === "approved";
  const isRejected = status === "rejected";
  const isDecided = isApproved || isRejected;

  const score = normalizeScore(analysis.score);
  const decision = getScoreDecision({
    score,
    match: analysis.match,
    passedMinimumScore: analysis.passed_minimum_score,
    recommendation: analysis.recommendation,
  });

  const statusInfo = getStatusInfo(status);

  function handleApprove(): void {
    setCurrentAction("approve");

    startTransition(async () => {
      try {
        const result = await approveAnalysis(analysis.id);

        if (!result.success || !result.status) {
          toast.error(result.message);
          return;
        }

        setStatus(result.status);
        toast.success(result.message);
        router.refresh();
      } catch {
        toast.error("Não foi possível aprovar o candidato.");
      } finally {
        setCurrentAction(null);
      }
    });
  }

  function handleReject(): void {
    setCurrentAction("reject");

    startTransition(async () => {
      try {
        const result = await rejectAnalysis(analysis.id);

        if (!result.success || !result.status) {
          toast.error(result.message);
          return;
        }

        setStatus(result.status);
        toast.info(result.message);
        router.refresh();
      } catch {
        toast.error("Não foi possível reprovar o candidato.");
      } finally {
        setCurrentAction(null);
      }
    });
  }

  const isLoading = isPending || currentAction !== null;

  return (
    <section className="relative h-full overflow-hidden rounded-[28px] border border-zinc-200/80 bg-white shadow-xl shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900/90">
      <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-violet-500/10 via-violet-500/5 to-transparent" />
      <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative z-10 flex h-full flex-col p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              Resultado da triagem
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
              Score e decisão
            </h2>

            <p className="mt-1.5 text-[15px] leading-7 text-zinc-500 dark:text-zinc-400">
              Avaliação consolidada da IA sobre aderência do candidato à vaga.
            </p>
          </div>

          <div className={decision.iconBoxClassName}>
            <decision.icon size={21} />
          </div>
        </div>

        <div className="flex flex-col items-center gap-5">
          <div className={decision.scoreCircleClassName}>
            <Gauge size={24} />

            <div className="text-center">
              <p className="text-6xl font-black leading-none">{score}</p>

              <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] opacity-75">
                Match
              </p>
            </div>
          </div>

          <div className="w-full text-center">
            <div className={decision.badgeClassName}>{decision.label}</div>

            <p className="mx-auto mt-4 max-w-sm text-[15px] font-medium leading-7 text-zinc-600 dark:text-zinc-400">
              {decision.description}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
            <span>Aderência</span>
            <span>{score}%</span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div
              className={decision.progressClassName}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          <InfoRow
            label="Status"
            value={statusInfo.label}
            className={statusInfo.className}
          />

          <InfoRow
            label="Match IA"
            value={analysis.match ? "Compatível" : "Parcial / Fraco"}
            className={
              analysis.match
                ? "text-emerald-700 dark:text-emerald-300"
                : "text-amber-700 dark:text-amber-300"
            }
          />

          <InfoRow
            label="Mínimo esperado"
            value={
              analysis.passed_minimum_score
                ? "Atingiu o mínimo"
                : "Abaixo do mínimo"
            }
            className={
              analysis.passed_minimum_score
                ? "text-emerald-700 dark:text-emerald-300"
                : "text-rose-700 dark:text-rose-300"
            }
          />
        </div>

        <div className="mt-auto flex flex-col gap-3 pt-6">
          {isApproved && (
            <Button
              type="button"
              disabled
              className="h-12 w-full rounded-xl bg-emerald-600 text-xs font-black uppercase tracking-[0.14em] text-white opacity-100"
            >
              <CheckCircle2 size={17} />
              Candidato aprovado
            </Button>
          )}

          {isRejected && (
            <Button
              type="button"
              disabled
              variant="outline"
              className="h-12 w-full rounded-xl border-rose-500/20 bg-rose-500/10 text-xs font-black uppercase tracking-[0.14em] text-rose-700 opacity-100 dark:text-rose-300"
            >
              <XCircle size={17} />
              Candidato reprovado
            </Button>
          )}

          {!isDecided && (
            <>
              <Button
                type="button"
                disabled={isLoading}
                onClick={handleApprove}
                className="h-12 w-full rounded-xl bg-emerald-600 text-xs font-black uppercase tracking-[0.14em] text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {currentAction === "approve" ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={17} />
                )}

                {currentAction === "approve"
                  ? "Aprovando..."
                  : "Aprovar e enviar e-mail"}
              </Button>

              <Button
                type="button"
                disabled={isLoading}
                variant="outline"
                onClick={handleReject}
                className="h-12 w-full rounded-xl border-rose-500/20 bg-rose-500/10 text-xs font-black uppercase tracking-[0.14em] text-rose-700 transition-all hover:bg-rose-500/15 hover:text-rose-800 disabled:cursor-not-allowed disabled:opacity-70 dark:text-rose-300 dark:hover:text-rose-200"
              >
                {currentAction === "reject" ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <XCircle size={17} />
                )}

                {currentAction === "reject"
                  ? "Reprovando..."
                  : "Reprovar e enviar e-mail"}
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function InfoRow({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-200/70 bg-zinc-50/70 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950/40">
      <span className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
        {label}
      </span>

      <span
        className={cn(
          "text-right text-sm font-black text-zinc-800 dark:text-zinc-200",
          className,
        )}
      >
        {value}
      </span>
    </div>
  );
}

function getStatusInfo(status: AnalysisStatus) {
  if (status === "approved") {
    return {
      label: "Aprovado",
      className: "text-emerald-700 dark:text-emerald-300",
    };
  }

  if (status === "rejected") {
    return {
      label: "Reprovado",
      className: "text-rose-700 dark:text-rose-300",
    };
  }

  return {
    label: "Pendente",
    className: "text-zinc-700 dark:text-zinc-300",
  };
}

function getScoreDecision({
  score,
  match,
  passedMinimumScore,
  recommendation,
}: {
  score: number;
  match: boolean;
  passedMinimumScore: boolean;
  recommendation?: Recommendation | null;
}) {
  if (recommendation === "strong_match" || score >= 85) {
    return {
      icon: CheckCircle2,
      label: "Forte aderência",
      description:
        "Candidato com alta aderência ao perfil esperado. Avance com prioridade se não houver restrições externas ao currículo.",
      iconBoxClassName:
        "rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-700 dark:text-emerald-300",
      scoreCircleClassName:
        "flex h-40 w-40 shrink-0 flex-col items-center justify-center gap-2 rounded-[32px] border border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
      badgeClassName:
        "inline-flex rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300",
      progressClassName: "h-full rounded-full bg-emerald-500",
    };
  }

  if (recommendation === "match" || (match && passedMinimumScore)) {
    return {
      icon: ShieldCheck,
      label: "Recomendado",
      description:
        "Candidato atingiu o mínimo esperado e apresenta boa compatibilidade com a vaga. Valide os pontos de atenção na entrevista.",
      iconBoxClassName:
        "rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-3 text-indigo-700 dark:text-indigo-300",
      scoreCircleClassName:
        "flex h-40 w-40 shrink-0 flex-col items-center justify-center gap-2 rounded-[32px] border border-indigo-500/25 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
      badgeClassName:
        "inline-flex rounded-xl border border-indigo-500/25 bg-indigo-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-indigo-700 dark:text-indigo-300",
      progressClassName: "h-full rounded-full bg-indigo-500",
    };
  }

  if (recommendation === "partial_match" || score >= 50) {
    return {
      icon: AlertTriangle,
      label: "Aderência parcial",
      description:
        "Candidato possui alguns sinais de compatibilidade, mas exige validação cuidadosa de gaps, riscos e senioridade.",
      iconBoxClassName:
        "rounded-2xl border border-amber-500/25 bg-amber-500/10 p-3 text-amber-700 dark:text-amber-300",
      scoreCircleClassName:
        "flex h-40 w-40 shrink-0 flex-col items-center justify-center gap-2 rounded-[32px] border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
      badgeClassName:
        "inline-flex rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-amber-700 dark:text-amber-300",
      progressClassName: "h-full rounded-full bg-amber-500",
    };
  }

  return {
    icon: XCircle,
    label: "Baixa aderência",
    description:
      "Candidato não demonstra aderência suficiente à vaga com base nas informações disponíveis no currículo.",
    iconBoxClassName:
      "rounded-2xl border border-rose-500/25 bg-rose-500/10 p-3 text-rose-700 dark:text-rose-300",
    scoreCircleClassName:
      "flex h-40 w-40 shrink-0 flex-col items-center justify-center gap-2 rounded-[32px] border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
    badgeClassName:
      "inline-flex rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-rose-700 dark:text-rose-300",
    progressClassName: "h-full rounded-full bg-rose-500",
  };
}

function normalizeScore(score: number) {
  if (!Number.isFinite(score)) {
    return 0;
  }

  if (score < 0) {
    return 0;
  }

  if (score > 100) {
    return 100;
  }

  return Math.round(score);
}