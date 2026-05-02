"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { BriefcaseBusiness, ArrowLeft, UserCog } from "lucide-react";

import { JobForm, JobFormData } from "@/components/jobs/JobForm";
import { JobTips } from "@/components/jobs/JobTips";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/Pageheader";
import { Button } from "@/components/ui/button";

// MOCK - Mantendo sua lógica de dados
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
      console.log("EDIT ID:", id, data);
      toast.success("Vaga atualizada com sucesso!");
      router.push("/dashboard/jobs");
    } catch {
      toast.error("Erro ao salvar vaga");
    }
  }

  // Tratamento de erro respeitando as props obrigatórias do PageLayout
  if (!job) {
    return (
      <PageLayout
        header={
          <PageHeader
            title="Vaga não encontrada"
            description="O identificador fornecido não corresponde a nenhum registro ativo."
            action={
              <Button 
                variant="ghost" 
                onClick={() => router.push("/dashboard/jobs")}
                className="text-zinc-500 hover:text-zinc-900 gap-2 font-bold uppercase text-[10px] tracking-widest"
              >
                <ArrowLeft size={16} />
                Voltar para Listagem
              </Button>
            }
          />
        }
      >
        <div className="h-full flex items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/30">
          <p className="text-sm font-medium text-zinc-500">Não foi possível carregar os dados para edição.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      header={
        <PageHeader
          title="Editar Vaga"
          description={`Atualize os parâmetros de análise técnica para a vaga #${id}`}
          action={
            <div className="flex items-center gap-3">
              {/* Badge de Modo Edição (Igual ao de User) */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg border border-indigo-100 dark:border-indigo-500/20">
                <UserCog className="w-4 h-4 text-indigo-600" />
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                  Modo Edição
                </span>
              </div>
            </div>
          }
        />
      }
    >
      {/* Grid simétrico 2/3 e 1/3 com items-stretch para travar a altura */}
      <div className="grid gap-6 lg:grid-cols-3 items-stretch h-full">
        <div className="lg:col-span-2">
          <JobForm 
            initialData={job} 
            onSubmit={handleSubmit} 
            isEdit 
          />
        </div>

        <div className="hidden lg:block lg:col-span-1">
          <JobTips />
        </div>
      </div>
    </PageLayout>
  );
}