"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { JobForm, JobFormData } from "@/components/jobs/JobForm";
import { JobTips } from "@/components/jobs/JobTips";

// MOCK
const mockJobs = [
  {
    id: "1",
    title: "Desenvolvedor Backend",
    seniority: "Pleno",
    contract_type: "CLT",
    score_min: 75,
    skills: "Node.js",
    languages: "Inglês",
    context: "Time de plataforma",
  },
];

export default function EditJobPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const job = useMemo(() => {
    return mockJobs.find((j) => j.id === id);
  }, [id]);

  async function handleSubmit(data: JobFormData) {
    try {
      console.log("EDIT:", data);

      toast.success("Vaga atualizada com sucesso!");

      router.push("/dashboard/jobs");
    } catch {
      toast.error("Erro ao salvar vaga");
    }
  }

  if (!job) {
    return <p className="p-6">Vaga não encontrada</p>;
  }

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Editar vaga</h1>
        <p className="text-muted-foreground text-sm">
          Atualize os critérios da vaga
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <JobForm initialData={job} onSubmit={handleSubmit} isEdit />

        <JobTips />
      </div>
    </div>
  );
}
