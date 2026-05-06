"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  approveAnalysis,
  rejectAnalysis,
} from "@/actions/analyzes/action";

type AnalysisStatus =
  | "pending"
  | "approved"
  | "rejected";

interface AnalysisResultCardProps {
  analysis: {
    id: string;
    match: boolean;
    score: number;
    passed_minimum_score: boolean;
    status?: AnalysisStatus | null;
  };
}

export function AnalysisResultCard({
  analysis,
}: AnalysisResultCardProps) {
  const router = useRouter();

  const [loading, startTransition] =
    useTransition();

  const [status, setStatus] =
    useState<AnalysisStatus>(
      analysis.status ?? "pending",
    );

  const isApproved =
    status === "approved";

  const isRejected =
    status === "rejected";

  const isDecided =
    isApproved || isRejected;

  function handleApprove(): void {
    startTransition(async () => {
      const result =
        await approveAnalysis(
          analysis.id,
        );

      if (
        !result.success ||
        !result.status
      ) {
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
      const result =
        await rejectAnalysis(
          analysis.id,
        );

      if (
        !result.success ||
        !result.status
      ) {
        toast.error(result.message);
        return;
      }

      setStatus(result.status);

      toast.success(result.message);

      router.refresh();
    });
  }

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
      {/* STATUS */}
      <div className="flex items-center justify-between py-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          Status
        </span>

        <span
          className={cn(
            "rounded-lg px-2.5 py-1 text-sm font-black",

            isApproved &&
              "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",

            isRejected &&
              "bg-red-500/10 text-red-700 dark:text-red-300",

            !isDecided &&
              "bg-muted text-muted-foreground",
          )}
        >
          {isApproved
            ? "Aprovado"
            : isRejected
              ? "Reprovado"
              : "Pendente"}
        </span>
      </div>

      {/* MATCH */}
      <div className="flex items-center justify-between py-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
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
          {analysis.match
            ? "Compatível"
            : "Parcial / Fraco"}
        </span>
      </div>

      {/* SCORE */}
      <div className="flex items-center justify-between py-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          Score
        </span>

        <span
          className={cn(
            "text-sm font-black",

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

      {/* ACTIONS */}
      <div className="flex flex-col gap-3 pt-2">
        {isApproved && (
          <Button
            type="button"
            disabled
            className="
              h-11 w-full rounded-xl
              bg-emerald-600 text-white
              text-[10px] font-black uppercase tracking-widest
              opacity-100
            "
          >
            <CheckCircle2
              size={16}
              className="mr-2"
            />

            Candidato aprovado
          </Button>
        )}

        {isRejected && (
          <Button
            type="button"
            disabled
            variant="outline"
            className="
              h-11 w-full rounded-xl
              border-red-500/20
              bg-red-500/10
              text-red-600
              dark:text-red-400
              text-[10px]
              font-black
              uppercase
              tracking-widest
              opacity-100
            "
          >
            <XCircle
              size={16}
              className="mr-2"
            />

            Candidato reprovado
          </Button>
        )}

        {!isDecided && (
          <>
            <Button
              type="button"
              disabled={loading}
              onClick={handleApprove}
              className="
                h-11 w-full rounded-xl
                bg-emerald-600 hover:bg-emerald-700
                text-white
                text-[10px]
                font-black
                uppercase
                tracking-widest
                shadow-lg
                shadow-emerald-500/20
              "
            >
              <CheckCircle2
                size={16}
                className="mr-2"
              />

              Aprovar candidato
            </Button>

            <Button
              type="button"
              disabled={loading}
              variant="outline"
              onClick={handleReject}
              className="
                h-11 w-full rounded-xl
                border-red-500/20
                bg-red-500/10
                text-red-600
                dark:text-red-400
                text-[10px]
                font-black
                uppercase
                tracking-widest
                transition-all
                hover:bg-red-500/15
                hover:text-red-700
              "
            >
              <XCircle
                size={16}
                className="mr-2"
              />

              Reprovar
            </Button>
          </>
        )}
      </div>
    </div>
  );
}