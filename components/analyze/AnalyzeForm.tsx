"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FileUpload } from "./FileUpload";

import type { Job } from "@/types/jobs/job";

interface AnalyzeFormProps {
  jobs: Job[];
}

export function AnalyzeForm({ jobs }: AnalyzeFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [jobId, setJobId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  if (!file || !jobId) return;

  setLoading(true);

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_id", jobId);

    const response = await fetch("/api/analyze", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message ?? "Erro ao analisar currículo");
    }

    console.log("Resultado:", result.data);
  } finally {
    setLoading(false);
  }
}

  return (
    <Card className="lg:col-span-2 h-full flex flex-col border-none shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
      <CardHeader className="border-b border-zinc-200 dark:border-zinc-800 shrink-0">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          Nova análise técnica
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 min-h-0 p-6">
        <form
          onSubmit={handleSubmit}
          className="h-full flex flex-col justify-between"
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
                className="w-full h-11 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 bg-transparent text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none appearance-none cursor-pointer"
                required
              >
                <option value="">Selecione uma vaga para comparar</option>

                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title ?? "Vaga sem título"} —{" "}
                    {job.seniority ?? "Pleno"} / {job.contract_type ?? "CLT"}
                  </option>
                ))}
              </select>
            </div>

            <FileUpload file={file} setFile={setFile} />
          </div>

          <div className="pt-6 border-t border-zinc-50 dark:border-zinc-800 flex items-center justify-between shrink-0">
            <p className="text-[10px] text-zinc-400 italic">
              * A análise salva o resultado automaticamente no histórico.
            </p>

            <Button
              type="submit"
              disabled={loading || !file || !jobId}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 px-8 rounded-xl shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
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