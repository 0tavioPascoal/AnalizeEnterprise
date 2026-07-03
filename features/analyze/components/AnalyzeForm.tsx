"use client";

import { useState } from "react";
import {
  BriefcaseBusiness,
  ChevronDown,
  Loader2,
  Sparkles,
} from "lucide-react";

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
    <Card className="flex min-h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/85 shadow-sm transition-all duration-300 hover:border-primary/20 hover:bg-card hover:shadow-md">
      <CardHeader className="shrink-0 border-b border-border/40 bg-muted/10 p-5">
        <CardTitle className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary shadow-sm">
            <Sparkles size={20} />
          </div>

          <div>
            <p className="text-sm font-black uppercase tracking-[0.14em] text-foreground">
              Nova análise técnica
            </p>

            <p className="mt-0.5 text-xs font-semibold text-muted-foreground/80">
              Compare candidatos com IA
            </p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="min-h-0 flex-1 p-4 sm:p-6">
        <form
          onSubmit={handleSubmit}
          className="flex min-h-full flex-col justify-between"
        >
          <div className="space-y-8">
            <div className="space-y-3">
              <Label className="ml-1 text-xs font-extrabold uppercase tracking-[0.14em] text-foreground">
                Vaga de Referência
              </Label>

              <div className="relative">
                <BriefcaseBusiness
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary"
                />

                <ChevronDown
                  size={17}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <select
                  name="job_id"
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                  disabled={loading}
                  required
                  className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-border/60 bg-background/80 pl-11 pr-10 text-sm font-bold text-foreground shadow-sm outline-none transition-all hover:border-primary/30 focus:border-primary/45 focus:bg-background focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option
                    value=""
                    className="bg-background text-muted-foreground"
                  >
                    Selecione uma vaga para comparar
                  </option>

                  {jobs.map((job) => (
                    <option
                      key={job.id}
                      value={job.id}
                      className="bg-background text-foreground"
                    >
                      {job.title ?? "Vaga sem título"} —{" "}
                      {job.seniority ?? "Pleno"} / {job.contract_type ?? "CLT"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <FileUpload file={file} setFile={setFile} />
          </div>

          <div className="mt-8 flex shrink-0 flex-col gap-4 border-t border-border/50 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm italic leading-relaxed text-muted-foreground">
              * A análise salva o resultado automaticamente no histórico.
            </p>

            <Button
              type="submit"
              disabled={loading || !file || !jobId}
              className="h-11 w-full rounded-xl bg-primary px-8 text-xs font-extrabold uppercase tracking-[0.12em] text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95 sm:w-auto"
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
