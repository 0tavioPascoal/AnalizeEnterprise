"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { approveAnalysis, rejectAnalysis } from "@/actions/analyzes/action";

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
      toast.success(result.message);
      router.refresh();
    });
  }

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 bg-zinc-50/50 dark:bg-zinc-800/30 space-y-5">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
          Status
        </span>

        <span
          className={cn(
            "text-sm font-black px-2.5 py-1 rounded-lg",
            isApproved && "bg-emerald-50 text-emerald-700",
            isRejected && "bg-red-50 text-red-700",
            !isDecided && "bg-zinc-100 text-zinc-600",
          )}
        >
          {isApproved ? "Aprovado" : isRejected ? "Reprovado" : "Pendente"}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
          Match IA
        </span>

        <span
          className={cn(
            "text-sm font-black",
            analysis.match ? "text-emerald-600" : "text-amber-600",
          )}
        >
          {analysis.match ? "Compatível" : "Parcial / Fraco"}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
          Score
        </span>

        <span
          className={cn(
            "text-sm font-black",
            analysis.score >= 70
              ? "text-emerald-600"
              : analysis.score >= 50
                ? "text-amber-600"
                : "text-red-600",
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
            className="w-full bg-emerald-600 text-white font-bold uppercase text-[10px] tracking-widest"
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
            className="w-full border-red-200 text-red-600 font-bold uppercase text-[10px] tracking-widest"
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
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase text-[10px] tracking-widest"
            >
              <CheckCircle2 size={16} className="mr-2" />
              Aprovar candidato
            </Button>

            <Button
              type="button"
              disabled={loading}
              variant="outline"
              onClick={handleReject}
              className="w-full font-bold uppercase text-[10px] tracking-widest"
            >
              <XCircle size={16} className="mr-2" />
              Reprovar
            </Button>
          </>
        )}
      </div>
    </div>
  );
}