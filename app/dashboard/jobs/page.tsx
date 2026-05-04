import Link from "next/link";
import { Plus, Search, Briefcase, Target, ChevronRight } from "lucide-react";

import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/Pageheader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RowItem } from "@/components/layout/RowItem";

import { getJobs } from "@/actions/jobs/getJobs";
import { Job } from "@/types/jobs/job";

export default async function JobsPage() {
  const jobs: Job[] = await getJobs();

  return (
    <PageLayout
      header={
        <PageHeader
          title="Vagas"
          description="Gerencie as oportunidades e critérios de pontuação da IA"
          action={
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
                <Input
                  placeholder="Buscar vaga..."
                  className="w-64 h-9 pl-9 shadow-sm"
                />
              </div>

              <Link href="/dashboard/jobs/new">
                <Button className="bg-indigo-600 hover:bg-indigo-700 h-9 font-bold shadow-md shadow-indigo-500/10">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Vaga
                </Button>
              </Link>
            </div>
          }
        />
      }
    >
      <div className="flex flex-col gap-3 pb-4">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <RowItem
              key={job.id}
              left={
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                    <Briefcase size={20} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50 truncate">
                      {job.title}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5">
                      {job.seniority && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-2 py-0 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                        >
                          {job.seniority}
                        </Badge>
                      )}

                      {job.contract_type && (
                        <Badge
                          variant="outline"
                          className="text-[10px] px-2 py-0 rounded-md uppercase text-zinc-500 border-zinc-200 dark:border-zinc-700"
                        >
                          {job.contract_type}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              }
              right={
                <div className="flex items-center gap-5">
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 text-xs font-bold text-indigo-600">
                      <Target size={14} />
                      {job.score_min ?? 0}%
                    </div>

                    <p className="mt-1 text-[10px] text-zinc-400 font-medium">
                      Match mínimo
                    </p>
                  </div>

                  <Link
                    href={`/dashboard/jobs/${job.id}/edit`}
                    className="h-9 w-9 flex items-center justify-center text-indigo-500 hover:text-indigo-600 transition"
                    aria-label={`Editar vaga ${job.title}`}
                  >
                    <ChevronRight size={18} />
                  </Link>
                </div>
              }
            />
          ))
        ) : (
          <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-400 text-sm bg-zinc-50/40 dark:bg-zinc-900/40">
            <Briefcase size={24} className="mb-2 text-zinc-300" />
            <p className="font-medium">Nenhuma vaga encontrada.</p>
            <p className="text-xs mt-1">Crie uma nova vaga para começar.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
