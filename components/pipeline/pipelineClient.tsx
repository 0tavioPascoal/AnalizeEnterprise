"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/Pageheader";
import { TablePagination } from "@/components/layout/TablePagination";
import { SearchInput } from "@/components/layout/filters/SearchInput";
import { EmptyState } from "@/components/layout/filters/EmptyState";
import { FilterBar } from "@/components/layout/filters/FilterBar";
import { StatusFilterTabs } from "@/components/layout/filters/StatusFilterTabs";
import { FilterSelect } from "@/components/layout/filters/FilterSelect";

import { Button } from "@/components/ui/button";

import { PipelineRow } from "@/components/pipeline/pipelineRow";

import type { PipelineAnalysis } from "@/actions/pipeline/pipeline";
import type { AnalysisStatus } from "@/actions/analyzes/getAnalysisById";

type PipelineStatus = AnalysisStatus;

interface PipelineClientProps {
  analyses: PipelineAnalysis[];
}

const ITEMS_PER_PAGE = 8;

const statusOptions: Array<{ label: string; value: PipelineStatus }> = [
  { label: "Pendentes", value: "pending" },
  { label: "Aprovados", value: "approved" },
  { label: "Reprovados", value: "rejected" },
];

const emptyStateByStatus: Record<
  PipelineStatus,
  {
    icon: typeof Clock;
    title: string;
    description: string;
  }
> = {
  pending: {
    icon: Clock,
    title: "Nenhum candidato pendente.",
    description: "Não existem análises pendentes para o filtro atual.",
  },
  approved: {
    icon: CheckCircle2,
    title: "Nenhum candidato aprovado.",
    description: "Não existem candidatos aprovados para o filtro atual.",
  },
  rejected: {
    icon: XCircle,
    title: "Nenhum candidato reprovado.",
    description: "Não existem candidatos reprovados para o filtro atual.",
  },
};

export function PipelineClient({ analyses }: PipelineClientProps) {
  const router = useRouter();

  const [jobFilter, setJobFilter] = useState<string>("all");
  const [activeStatus, setActiveStatus] =
    useState<PipelineStatus>("approved");
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const jobOptions = useMemo(() => {
    const uniqueJobs = Array.from(
      new Set(
        analyses
          .map((analysis) => analysis.job_title)
          .filter((title): title is string => Boolean(title)),
      ),
    );

    return [
      { label: "Todas as vagas", value: "all" },
      ...uniqueJobs.map((title) => ({
        label: title,
        value: title,
      })),
    ];
  }, [analyses]);

  const filteredAnalyses = useMemo(() => {
    const term = search.trim().toLowerCase();

    return analyses.filter((item) => {
      const matchesStatus = item.status === activeStatus;

      const matchesJob =
        jobFilter === "all" || item.job_title === jobFilter;

      const matchesSearch =
        !term ||
        (item.candidate_name?.toLowerCase() ?? "").includes(term) ||
        (item.candidate_email?.toLowerCase() ?? "").includes(term) ||
        (item.job_title?.toLowerCase() ?? "").includes(term);

      return matchesStatus && matchesJob && matchesSearch;
    });
  }, [analyses, activeStatus, jobFilter, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAnalyses.length / ITEMS_PER_PAGE),
  );

  const paginatedAnalyses = useMemo(() => {
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * ITEMS_PER_PAGE;

    return filteredAnalyses.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAnalyses, page, totalPages]);

  const emptyState = emptyStateByStatus[activeStatus];

  function handleStatusChange(value: PipelineStatus): void {
    setActiveStatus(value);
    setPage(1);
  }

  function handleSearchChange(value: string): void {
    setSearch(value);
    setPage(1);
  }

  function handleJobChange(value: string): void {
    setJobFilter(value);
    setPage(1);
  }

  return (
    <PageLayout
      header={
        <PageHeader
          title="Pipeline de Talentos"
          description="Consulte o histórico de decisões e o banco de talentos aprovados."
          action={
            <FilterBar className="xl:flex-nowrap">
              <StatusFilterTabs
                value={activeStatus}
                options={statusOptions}
                onChange={handleStatusChange}
              />

              <SearchInput
                value={search}
                onChange={handleSearchChange}
                placeholder="Buscar candidato, e-mail ou vaga..."
              />

              <FilterSelect
                value={jobFilter}
                onChange={handleJobChange}
                options={jobOptions}
                ariaLabel="Filtrar por vaga"
              />

              <Button
                variant="outline"
                onClick={() => router.back()}
                className="h-10 gap-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
              >
                <ArrowLeft size={16} />
                Voltar
              </Button>
            </FilterBar>
          }
        />
      }
      pagination={
        filteredAnalyses.length > ITEMS_PER_PAGE && (
          <TablePagination
            page={page}
            totalPages={totalPages}
            setPage={setPage}
          />
        )
      }
    >
      <div className="mr-5 flex flex-col gap-3 pb-4">
        {paginatedAnalyses.length > 0 ? (
          paginatedAnalyses.map((item) => (
            <PipelineRow key={item.id} item={item} />
          ))
        ) : (
          <EmptyState
            icon={emptyState.icon}
            title={emptyState.title}
            description={emptyState.description}
          />
        )}
      </div>
    </PageLayout>
  );
}