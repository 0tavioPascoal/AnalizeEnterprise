import { Plus } from "lucide-react";

import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/Pageheader";
import { JobForm } from "@/components/jobs/JobForm";
import { JobTips } from "@/components/jobs/JobTips";

export default function NewJobPage() {
  return (
    <PageLayout
      header={
        <PageHeader
          title="Cadastro de Vaga"
          description="Defina os critérios técnicos e comportamentais para a análise automática da IA"
          action={
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-1.5">
                <Plus size={16} className="text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Modo Criação
                </span>
              </div>
            </div>
          }
        />
      }
    >
      <div className="grid min-h-full items-stretch gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <JobForm isEdit={false} />
        </div>

        <div className="hidden lg:block lg:col-span-1">
          <JobTips />
        </div>
      </div>
    </PageLayout>
  );
}
