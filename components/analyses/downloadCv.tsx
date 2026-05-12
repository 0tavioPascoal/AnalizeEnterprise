"use client";

import { useTransition } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface DownloadResumeResponse {
  success: boolean;
  url?: string;
  message?: string;
}

interface DownloadResumeButtonProps {
  analysisId: string;
  disabled?: boolean;
}

export function DownloadResumeButton({
  analysisId,
  disabled,
}: DownloadResumeButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDownload(): void {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/resume/${analysisId}`, {
          method: "GET",
        });

        const result = (await response.json()) as DownloadResumeResponse;

        if (!response.ok || !result.success || !result.url) {
          toast.error(result.message ?? "Erro ao baixar currículo.");
          return;
        }

        window.open(result.url, "_blank", "noopener,noreferrer");
      } catch {
        toast.error("Erro inesperado ao baixar currículo.");
      }
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      disabled={disabled || isPending}
      onClick={handleDownload}
      className="h-10 gap-2 rounded-xl text-sm font-bold"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}

      {isPending ? "Gerando link..." : "Baixar currículo"}
    </Button>
  );
}