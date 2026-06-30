"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  CircleDot,
  MessageCircle,
  SearchCheck,
  XCircle,
} from "lucide-react";
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

import type {
  PipelineAnalysis,
  PipelineStage,
} from "@/actions/pipeline/pipeline";

interface PipelineClientProps {
  analyses: PipelineAnalysis[];
}

const ITEMS_PER_PAGE = 8;

const baseStageOptions: Array<{ label: string; value: PipelineStage }> = [
  { label: "Triagem", value: "screening" },
  { label: "Entrevista", value: "interview" },
  { label: "Aprovados", value: "approved" },
  { label: "Reprovados", value: "rejected" },
];

const emptyStateByStage: Record<
  PipelineStage,
  {
    icon: typeof CircleDot;
    title: string;
    description: string;
  }
> = {
  new: {
    icon: CircleDot,
    title: "Nenhum candidato novo.",
    description: "Não existem candidatos novos.",
  },
  screening: {
    icon: SearchCheck,
    title: "Nenhum candidato em triagem.",
    description: "Não existem candidatos em triagem para o filtro atual.",
  },
  interview: {
    icon: MessageCircle,
    title: "Nenhum candidato em entrevista.",
    description: "Não existem candidatos na etapa de entrevista.",
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
  const [activeStage, setActiveStage] =
    useState<PipelineStage>("screening");
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const stageOptions = useMemo(() => {
    return baseStageOptions.map((option) => {
      const total = analyses.filter(
        (analysis) => analysis.pipeline_stage === option.value,
      ).length;

      return {
        ...option,
        label: `${option.label} (${total})`,
      };
    });
  }, [analyses]);

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
      const matchesStage = item.pipeline_stage === activeStage;

      const matchesJob =
        jobFilter === "all" || item.job_title === jobFilter;

      const matchesSearch =
        !term ||
        (item.candidate_name?.toLowerCase() ?? "").includes(term) ||
        (item.candidate_email?.toLowerCase() ?? "").includes(term) ||
        (item.job_title?.toLowerCase() ?? "").includes(term);

      return matchesStage && matchesJob && matchesSearch;
    });
  }, [analyses, activeStage, jobFilter, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAnalyses.length / ITEMS_PER_PAGE),
  );

  const paginatedAnalyses = useMemo(() => {
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * ITEMS_PER_PAGE;

    return filteredAnalyses.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAnalyses, page, totalPages]);

  const emptyState = emptyStateByStage[activeStage];

  function handleStageChange(value: PipelineStage): void {
    setActiveStage(value);
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
          description="Acompanhe candidatos por etapa do processo seletivo."
          action={
            <FilterBar className="xl:flex-nowrap">
              <StatusFilterTabs
                value={activeStage}
                options={stageOptions}
                onChange={handleStageChange}
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
            totalItems={filteredAnalyses.length}
            pageSize={ITEMS_PER_PAGE}
            itemLabel="candidatos"
          />
        )
      }
    >
      <div className="flex flex-col gap-3 pb-4">
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
