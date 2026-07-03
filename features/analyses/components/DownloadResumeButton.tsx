"use client";

import { useTransition } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

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

        if (!response.ok) {
          const result = (await response.json().catch(() => null)) as {
            message?: string;
          } | null;

          toast.error(result?.message ?? "Erro ao baixar currículo.");
          return;
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "curriculo.pdf";
        link.rel = "noopener noreferrer";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
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

      {isPending ? "Baixando..." : "Baixar currículo"}
    </Button>
  );
}
