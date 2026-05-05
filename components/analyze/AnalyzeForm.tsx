"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FileUpload } from "./FileUpload";

import type { Job } from "@/types/jobs/job";

interface AnalyzeFormProps {
  jobs: Job[];
}

interface AnalyzeApiResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

export function AnalyzeForm({ jobs }: AnalyzeFormProps) {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [jobId, setJobId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!file) {
      toast.error("Selecione um currículo para análise.");
      return;
    }

    if (!jobId) {
      toast.error("Selecione uma vaga de referência.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("job_id", jobId);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as AnalyzeApiResponse;

      if (!response.ok || !result.success) {
        throw new Error(result.message ?? "Erro ao analisar currículo.");
      }

      toast.success("Análise realizada com sucesso!");

      setFile(null);
      setJobId("");

      router.refresh();

      setTimeout(() => {
        router.push("/dashboard/analyses");
      }, 600);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro inesperado ao analisar currículo.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="flex h-full flex-col overflow-hidden border-none bg-white shadow-sm dark:bg-zinc-900">
      <CardHeader className="shrink-0 border-b border-zinc-200 dark:border-zinc-800">
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          Nova análise técnica
        </CardTitle>
      </CardHeader>

      <CardContent className="min-h-0 flex-1 p-6">
        <form
          onSubmit={handleSubmit}
          className="flex h-full flex-col justify-between"
        >
          <div className="space-y-8">
            <div className="space-y-3">
              <Label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">
                Vaga de Referência
              </Label>

              <select
                name="job_id"
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
                disabled={loading}
                className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-900 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                required
              >
                <option
                  value=""
                  className="bg-white text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400"
                >
                  Selecione uma vaga para comparar
                </option>

                {jobs.map((job) => (
                  <option
                    key={job.id}
                    value={job.id}
                    className="bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100"
                  >
                    {job.title ?? "Vaga sem título"} —{" "}
                    {job.seniority ?? "Pleno"} / {job.contract_type ?? "CLT"}
                  </option>
                ))}
              </select>
            </div>

            <FileUpload file={file} setFile={setFile} />
          </div>

          <div className="flex shrink-0 items-center justify-between border-t border-zinc-50 pt-6 dark:border-zinc-800">
            <p className="text-[10px] italic text-zinc-400">
              * A análise salva o resultado automaticamente no histórico.
            </p>

            <Button
              type="submit"
              disabled={loading || !file || !jobId}
              className="h-11 rounded-xl bg-indigo-600 px-8 font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700 active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analisando...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Iniciar análise
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}