"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

import {
  Briefcase,
  Plus,
} from "lucide-react";

import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/Pageheader";
import { TablePagination } from "@/components/layout/TablePagination";

import { SearchInput } from "@/components/layout/filters/SearchInput";
import { EmptyState } from "@/components/layout/filters/EmptyState";
import { FilterBar } from "@/components/layout/filters/FilterBar";

import { Button } from "@/components/ui/button";

import { JobRow } from "@/components/jobs/JobRow";

import type { Job } from "@/types/jobs/job";

interface JobsClientProps {
  jobs: Job[];
}

const ITEMS_PER_PAGE = 8;

export function JobsClient({ jobs }: JobsClientProps) {
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const filteredJobs = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) {
      return jobs;
    }

    return jobs.filter((job) => {
      return (
        job.title?.toLowerCase().includes(term) ||
        job.seniority?.toLowerCase().includes(term) ||
        job.contract_type?.toLowerCase().includes(term)
      );
    });
  }, [jobs, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredJobs.length / ITEMS_PER_PAGE),
  );

  const paginatedJobs = useMemo(() => {
    const safePage = Math.min(page, totalPages);

    const start = (safePage - 1) * ITEMS_PER_PAGE;

    return filteredJobs.slice(
      start,
      start + ITEMS_PER_PAGE,
    );
  }, [filteredJobs, page, totalPages]);

  function handleSearchChange(value: string): void {
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
            <FilterBar className="xl:flex-nowrap">
              <SearchInput
                value={search}
                onChange={handleSearchChange}
                placeholder="Buscar vaga..."
              />

              <Link href="/dashboard/jobs/new">
                <Button className="h-10 w-full rounded-xl bg-primary px-4 font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition-all hover:bg-primary/90 sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Vaga
                </Button>
              </Link>
            </FilterBar>
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
      <div className="mr-5 flex flex-col gap-3 pb-4">
        {paginatedJobs.length > 0 ? (
          paginatedJobs.map((job) => (
            <JobRow
              key={job.id}
              job={job}
            />
          ))
        ) : (
          <EmptyState
            icon={Briefcase}
            title="Nenhuma vaga encontrada."
            description="Tente buscar por outro cargo, senioridade ou tipo de contrato."
          />
        )}
      </div>
    </PageLayout>
  );
}