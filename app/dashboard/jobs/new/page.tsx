"use client";

import { JobForm, JobFormData } from "@/components/jobs/JobForm";
import { JobTips } from "@/components/jobs/JobTips";
import { createJob } from "@/actions/jobs";
import { toast } from "sonner";

export default function JobsPage() {
  async function handleSubmit(data: JobFormData) {
    try {
      await createJob(data);
      toast.success("Vaga criada com sucesso!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao criar vaga");
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Cadastro de vaga</h1>
        <p className="text-muted-foreground text-sm">
          Defina os critérios para análise automática de candidatos
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <JobForm onSubmit={handleSubmit} isEdit={false} />
        <JobTips />
      </div>
    </div>
  );
}
