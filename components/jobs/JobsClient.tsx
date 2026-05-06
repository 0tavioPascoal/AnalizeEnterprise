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

    return jobs.filter((job) => job.title?.toLowerCase().includes(term));
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
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  placeholder="Buscar vaga..."
                  className="h-10 w-full rounded-xl border-border bg-card pl-9 pr-3 text-sm shadow-sm transition-all placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/30 sm:w-72"
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>

              <Link href="/dashboard/jobs/new">
                <Button className="h-10 w-full rounded-xl bg-primary px-4 font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition-all hover:bg-primary/90 sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
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
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/10 bg-primary/10 text-primary shadow-sm">
                    <Briefcase size={20} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {job.title}
                    </p>

                    <div className="mt-1.5 flex min-w-0 flex-wrap items-center gap-2">
                      {job.seniority && (
                        <Badge className="rounded-lg border border-border bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground shadow-none hover:bg-secondary">
                          {job.seniority}
                        </Badge>
                      )}

                      {job.contract_type && (
                        <Badge className="rounded-lg border border-primary/10 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary shadow-none hover:bg-primary/10">
                          {job.contract_type}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              }
              right={
                <div className="flex items-center gap-4">
                  <div className="hidden text-right sm:block">
                    <div className="inline-flex items-center gap-1.5 rounded-xl border border-primary/10 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                      <Target size={14} />
                      {job.score_min ?? 0}%
                    </div>

                    <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      Match mínimo
                    </p>
                  </div>

                  <Link
                    href={`/dashboard/jobs/${job.id}/edit`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                    aria-label={`Editar vaga ${job.title}`}
                  >
                    <ChevronRight size={18} />
                  </Link>
                </div>
              }
            />
          ))
        ) : (
          <div className="flex h-44 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/60 px-6 text-center shadow-sm">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <Briefcase size={22} />
            </div>

            <p className="text-sm font-semibold text-foreground">
              Nenhuma vaga encontrada.
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Tente buscar por outro cargo, senioridade ou tipo de contrato.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
