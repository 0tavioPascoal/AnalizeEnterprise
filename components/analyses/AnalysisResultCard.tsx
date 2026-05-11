"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/supabase/utils";

import { approveAnalysis } from "@/actions/analyzes/aproveAnalizys";
import { rejectAnalysis } from "@/actions/analyzes/rejectAnalizys";

type AnalysisStatus = "pending" | "approved" | "rejected";

interface AnalysisResultCardProps {
  analysis: {
    id: string;
    match: boolean;
    score: number;
    passed_minimum_score: boolean;
    status?: AnalysisStatus | null;
  };
}

export function AnalysisResultCard({ analysis }: AnalysisResultCardProps) {
  const router = useRouter();
  const [loading, startTransition] = useTransition();

  const [status, setStatus] = useState<AnalysisStatus>(
    analysis.status ?? "pending",
  );

  const isApproved = status === "approved";
  const isRejected = status === "rejected";
  const isDecided = isApproved || isRejected;

  function handleApprove(): void {
    startTransition(async () => {
      const result = await approveAnalysis(analysis.id);

      if (!result.success || !result.status) {
        toast.error(result.message);
        return;
      }

      setStatus(result.status);
      toast.success(result.message);
      router.refresh();
    });
  }

  function handleReject(): void {
    startTransition(async () => {
      const result = await rejectAnalysis(analysis.id);

      if (!result.success || !result.status) {
        toast.error(result.message);
        return;
      }

      setStatus(result.status);
      toast.info(result.message);
      router.refresh();
    });
  }

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4 py-1">
        <span className="text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
          Status
        </span>

        <span
          className={cn(
            "rounded-lg px-3 py-1.5 text-sm font-black",
            isApproved &&
              "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
            isRejected && "bg-red-500/10 text-red-700 dark:text-red-300",
            !isDecided && "bg-muted text-muted-foreground",
          )}
        >
          {isApproved ? "Aprovado" : isRejected ? "Reprovado" : "Pendente"}
        </span>
      </div>

      <div className="flex items-center justify-between gap-4 py-1">
        <span className="text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
          Match IA
        </span>

        <span
          className={cn(
            "text-sm font-black",
            analysis.match
              ? "text-emerald-600 dark:text-emerald-300"
              : "text-amber-600 dark:text-amber-300",
          )}
        >
          {analysis.match ? "Compatível" : "Parcial / Fraco"}
        </span>
      </div>

      <div className="flex items-center justify-between gap-4 py-1">
        <span className="text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
          Score
        </span>

        <span
          className={cn(
            "text-base font-black",
            analysis.score >= 70
              ? "text-emerald-600 dark:text-emerald-300"
              : analysis.score >= 50
                ? "text-amber-600 dark:text-amber-300"
                : "text-red-600 dark:text-red-300",
          )}
        >
          {analysis.score}%
        </span>
      </div>

      <div className="flex flex-col gap-3 pt-2">
        {isApproved && (
          <Button
            type="button"
            disabled
            className="h-11 w-full rounded-xl bg-emerald-600 text-xs font-extrabold uppercase tracking-wide text-white opacity-100"
          >
            <CheckCircle2 size={16} className="mr-2" />
            Candidato aprovado
          </Button>
        )}

        {isRejected && (
          <Button
            type="button"
            disabled
            variant="outline"
            className="h-11 w-full rounded-xl border-red-500/20 bg-red-500/10 text-xs font-extrabold uppercase tracking-wide text-red-600 opacity-100 dark:text-red-400"
          >
            <XCircle size={16} className="mr-2" />
            Candidato reprovado
          </Button>
        )}

        {!isDecided && (
          <>
            <Button
              type="button"
              disabled={loading}
              onClick={handleApprove}
              className="h-11 w-full rounded-xl bg-emerald-600 text-xs font-extrabold uppercase tracking-wide text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700"
            >
              {loading ? (
                <Loader2 size={16} className="mr-2 animate-spin" />
              ) : (
                <CheckCircle2 size={16} className="mr-2" />
              )}

              {loading ? "Aprovando..." : "Aprovar e enviar e-mail"}
            </Button>

            <Button
              type="button"
              disabled={loading}
              variant="outline"
              onClick={handleReject}
              className="h-11 w-full rounded-xl border-red-500/20 bg-red-500/10 text-xs font-extrabold uppercase tracking-wide text-red-600 transition-all hover:bg-red-500/15 hover:text-red-700 dark:text-red-400"
            >
              {loading ? (
                <Loader2 size={16} className="mr-2 animate-spin" />
              ) : (
                <XCircle size={16} className="mr-2" />
              )}

              {loading ? "Reprovando..." : "Reprovar e enviar e-mail"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
