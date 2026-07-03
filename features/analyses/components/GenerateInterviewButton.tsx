"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { BrainCircuit, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface GenerateInterviewButtonProps {
  analysisId: string;
  disabled?: boolean;
}

interface GenerateInterviewResponse {
  success: boolean;
  interview_id?: string;
  already_exists?: boolean;
  message?: string;
}

export function GenerateInterviewButton({
  analysisId,
  disabled,
}: GenerateInterviewButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleGenerate(): void {
    startTransition(async () => {
      try {
        const response = await fetch("/api/interviews/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            analysis_id: analysisId,
          }),
        });

        const result = (await response.json()) as GenerateInterviewResponse;

        if (!response.ok || !result.success || !result.interview_id) {
          toast.error(result.message ?? "Erro ao gerar entrevista.");
          return;
        }

        toast.success(
          result.already_exists
            ? "Entrevista já existente encontrada."
            : "Entrevista gerada com sucesso.",
        );

        router.push(`/dashboard/interviews/${result.interview_id}`);
        router.refresh();
      } catch {
        toast.error("Erro inesperado ao gerar entrevista.");
      }
    });
  }

  return (
    <Button
      type="button"
      disabled={disabled || isPending}
      onClick={handleGenerate}
      className="h-10 gap-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <BrainCircuit className="h-4 w-4" />
      )}

      {isPending ? "Gerando..." : "Gerar entrevista"}
    </Button>
  );
}