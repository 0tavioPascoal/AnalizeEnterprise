"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, Briefcase, Target, ChevronRight } from "lucide-react";

import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/Pageheader";
import { TablePagination } from "@/components/layout/TablePagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RowItem } from "@/components/layout/RowItem";

import type { Job } from "@/types/jobs/job";

interface JobsClientProps {
  jobs: Job[];
}

const ITEMS_PER_PAGE = 8;

export function JobsClient({ jobs }: JobsClientProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filteredJobs = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return jobs;

    return jobs.filter((job) =>
      job.title?.toLowerCase().includes(term),
    );
  }, [jobs, search]);

  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);

  const paginatedJobs = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    return filteredJobs.slice(start, end);
  }, [filteredJobs, page]);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
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
                  onChange={handleSearchChange}
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
              left={
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                    <Briefcase size={20} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">
                      {job.title}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5">
                      {job.seniority && (
                        <Badge className="text-[10px] px-2 py-0 rounded-md bg-zinc-100 dark:bg-zinc-800">
                          {job.seniority}
                        </Badge>
                      )}

                      {job.contract_type && (
                        <Badge className="text-[10px] px-2 py-0 rounded-md uppercase">
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

                    <p className="mt-1 text-[10px] text-zinc-400">
                      Match mínimo
                    </p>
                  </div>

                  <Link
                    href={`/dashboard/jobs/${job.id}/edit`}
                    className="h-9 w-9 flex items-center justify-center text-indigo-500 hover:text-indigo-600 transition"
                  >
                    <ChevronRight size={18} />
                  </Link>
                </div>
              }
            />
          ))
        ) : (
          <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl text-zinc-400 text-sm">
            <Briefcase size={24} className="mb-2 text-zinc-300" />
            <p className="font-medium">Nenhuma vaga encontrada.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}