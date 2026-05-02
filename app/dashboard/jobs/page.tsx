"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Search, Briefcase, Target, ChevronRight } from "lucide-react";

import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/Pageheader";
import { TablePagination } from "@/components/layout/TablePagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RowItem } from "@/components/layout/RowItem";
import { useRouter } from "next/navigation";

// =========================
// TYPES (TypeScript Strict)
// =========================
export interface Job {
  id: string;
  title: string;
  seniority: string;
  contract_type: string;
  score_min: number;
}

// =========================
// MOCK DATA
// =========================
const mockJobs: Job[] = [
  { id: "1", title: "Desenvolvedor Backend", seniority: "Pleno", contract_type: "CLT", score_min: 75 },
  { id: "2", title: "Frontend React", seniority: "Sênior", contract_type: "PJ", score_min: 80 },
  { id: "3", title: "DevOps", seniority: "Pleno", contract_type: "CLT", score_min: 70 },
  { id: "4", title: "QA", seniority: "Júnior", contract_type: "CLT", score_min: 60 },
];

export default function JobsPage() {
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const router = useRouter();
  const pageSize: number = 7;

  // =========================
  // FILTER LOGIC
  // =========================
  const filteredJobs = useMemo(() => {
    return mockJobs.filter((job) =>
      job.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  // =========================
  // PAGINATION LOGIC
  // =========================
  const totalPages = Math.ceil(filteredJobs.length / pageSize);
  const paginatedJobs = useMemo(() => {
    return filteredJobs.slice((page - 1) * pageSize, page * pageSize);
  }, [filteredJobs, page]);

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

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
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              <Link href="/dashboard/jobs/new">
                <Button className="bg-indigo-600 hover:bg-indigo-700 h-9 font-bold transition-all shadow-md shadow-indigo-500/10">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Vaga
                </Button>
              </Link>
            </div>
          }
        />
      }
      pagination={
        totalPages > 1 && (
          <TablePagination
            page={page}
            totalPages={totalPages}
            setPage={setPage}
          />
        )
      }
    >
      <div className="flex flex-col gap-3 pb-4">
        {paginatedJobs.length > 0 ? (
          paginatedJobs.map((job) => (
            <RowItem
              key={job.id}
              onClick={() => router.push(`/dashboard/jobs/${job.id}/edit`)}
              left={
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                      {job.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-[10px] font-medium py-0 px-2 bg-zinc-100 dark:bg-zinc-800">
                        {job.seniority}
                      </Badge>
                      <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-tight">
                        {job.contract_type}
                      </span>
                    </div>
                  </div>
                </div>
              }
              right={
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 justify-end">
                      <Target size={14} />
                      {job.score_min}%
                    </div>
                    <p className="text-[10px] text-zinc-400 font-medium leading-none">Match Mínimo</p>
                  </div>
                  <ChevronRight size={16} className="text-zinc-300" />
                </div>
              }
            />
          ))
        ) : (
          <div className="h-32 flex items-center justify-center border-2 border-dashed rounded-xl text-zinc-400 text-sm italic">
            Nenhuma vaga encontrada.
          </div>
        )}
      </div>
    </PageLayout>
  );
}