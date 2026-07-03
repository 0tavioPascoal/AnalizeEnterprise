"use client";

import { useTransition } from "react";
import { FileText } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { TablePagination } from "@/components/layout/TablePagination";
import { SearchInput } from "@/components/layout/filters/SearchInput";
import { EmptyState } from "@/components/layout/filters/EmptyState";
import { FilterBar } from "@/components/layout/filters/FilterBar";
import { StatusFilterTabs } from "@/components/layout/filters/StatusFilterTabs";
import { FilterSelect } from "@/components/layout/filters/FilterSelect";

import { AnalysisRow } from "@/features/analyses/components/listing/AnalysisRow";

import type {
  AnalysisJobOption,
  AnalysisListItem,
  MatchFilter,
  ScoreFilter,
} from "@/features/analyses/server/get-analyses";

interface AnalysesClientProps {
  analyses: AnalysisListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  jobOptions: AnalysisJobOption[];
  filters: {
    search: string;
    job: string;
    match: MatchFilter;
    score: ScoreFilter;
  };
}

const matchOptions: Array<{ label: string; value: MatchFilter }> = [
  { label: "Todos", value: "all" },
  { label: "Match", value: "match" },
  { label: "Atenção", value: "no_match" },
];

const scoreOptions: Array<{ label: string; value: ScoreFilter }> = [
  { label: "Todos os scores", value: "all" },
  { label: "Baixo", value: "low" },
  { label: "Médio", value: "medium" },
  { label: "Alto", value: "high" },
];

export function AnalysesClient({
  analyses,
  total,
  page,
  pageSize,
  totalPages,
  jobOptions,
  filters,
}: AnalysesClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const allJobOptions = [
    { label: "Todas as vagas", value: "all" },
    ...jobOptions,
  ];

  function updateFilter(key: string, value: string, resetPage = true): void {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    if (resetPage) {
      params.delete("page");
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <PageLayout
      header={
        <PageHeader
          title="Análises em Triagem"
          description="Histórico de currículos analisados pela IA"
          action={
            <FilterBar className="xl:flex-nowrap">
              <StatusFilterTabs
                value={filters.match}
                options={matchOptions}
                onChange={(value) => {
                  updateFilter("match", value);
                }}
              />

              <SearchInput
                value={filters.search}
                onChange={(value) => {
                  updateFilter("search", value);
                }}
                placeholder="Buscar candidato..."
              />

              <FilterSelect
                value={filters.job}
                onChange={(value) => {
                  updateFilter("job", value);
                }}
                options={allJobOptions}
                ariaLabel="Filtrar por vaga"
              />

              <FilterSelect
                value={filters.score}
                onChange={(value) => {
                  updateFilter("score", value);
                }}
                options={scoreOptions}
                ariaLabel="Filtrar por score"
              />
            </FilterBar>
          }
        />
      }
      pagination={
        total > pageSize && (
          <TablePagination
            page={page}
            totalPages={totalPages}
            setPage={(nextPage) => updateFilter("page", String(nextPage), false)}
            totalItems={total}
            pageSize={pageSize}
            itemLabel="análises"
          />
        )
      }
    >
      <div
        className="flex flex-col gap-3 pb-4 opacity-100 transition-opacity data-[pending=true]:opacity-60"
        data-pending={isPending}
      >
        {analyses.length > 0 ? (
          analyses.map((analysis) => (
            <AnalysisRow key={analysis.id} analysis={analysis} />
          ))
        ) : (
          <EmptyState
            icon={FileText}
            title="Nenhuma análise encontrada."
            description="Faça uma análise de currículo ou ajuste os filtros para visualizar resultados."
          />
        )}
      </div>
    </PageLayout>
  );
}
