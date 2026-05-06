"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/Pageheader";
import { JobForm, JobFormData } from "@/components/jobs/JobForm";
import { JobTips } from "@/components/jobs/JobTips";
import { createJob } from "@/actions/jobs/createjob";

export default function NewJobPage() {
  const router = useRouter();

  async function handleSubmit(data: JobFormData) {
    try {
      await createJob(data);
      toast.success("Vaga criada com sucesso!");
      router.push("/dashboard/jobs");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao criar vaga");
    }
  }

  return (
    <PageLayout
      header={
        <PageHeader
          title="Cadastro de Vaga"
          description="Defina os critérios técnicos e comportamentais para a análise automática da IA"
          action={
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
                <Plus size={16} className="text-indigo-600" />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Modo Criação
                </span>
              </div>
            </div>
          }
        />
      }
    >
      {/* 
          Grid 2/3 e 1/3 com items-stretch para garantir o Viewport Rígido 
          e simetria entre o formulário e as dicas.
      */}
      <div className="grid gap-6 lg:grid-cols-3 items-stretch h-full">
        <div className="lg:col-span-2">
          <JobForm onSubmit={handleSubmit} isEdit={false} />
        </div>

        <div className="hidden lg:block lg:col-span-1">
          <JobTips />
        </div>
      </div>
    </PageLayout>
  );
}
