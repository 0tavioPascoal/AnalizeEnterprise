"use client";

import { useMemo, useState } from "react";
import { FileText } from "lucide-react";

import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/Pageheader";
import { TablePagination } from "@/components/layout/TablePagination";
import { SearchInput } from "@/components/layout/filters/SearchInput";
import { EmptyState } from "@/components/layout/filters/EmptyState";
import { FilterBar } from "@/components/layout/filters/FilterBar";
import { StatusFilterTabs } from "@/components/layout/filters/StatusFilterTabs";
import { FilterSelect } from "@/components/layout/filters/FilterSelect";

import { AnalysisRow } from "@/components/analyses/listing/AnalysisRow";

import type { AnalysisListItem } from "@/actions/analyzes/getAnalyzes";

interface AnalysesClientProps {
  analyses: AnalysisListItem[];
}

type MatchFilter = "all" | "match" | "no_match";
type ScoreFilter = "all" | "low" | "medium" | "high";

const ITEMS_PER_PAGE = 8;

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

export function AnalysesClient({ analyses }: AnalysesClientProps) {
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const [jobFilter, setJobFilter] = useState<string>("all");
  const [matchFilter, setMatchFilter] = useState<MatchFilter>("all");
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>("all");

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

    return analyses.filter((analysis) => {
      const matchesSearch =
        !term ||
        (analysis.candidate_name?.toLowerCase() ?? "").includes(term) ||
        (analysis.candidate_email?.toLowerCase() ?? "").includes(term) ||
        (analysis.job_title?.toLowerCase() ?? "").includes(term) ||
        analysis.recommendation.toLowerCase().includes(term);

      const matchesJob =
        jobFilter === "all" || analysis.job_title === jobFilter;

      const matchesMatch =
        matchFilter === "all" ||
        (matchFilter === "match" && analysis.match) ||
        (matchFilter === "no_match" && !analysis.match);

      const matchesScore =
        scoreFilter === "all" ||
        (scoreFilter === "low" && analysis.score <= 50) ||
        (scoreFilter === "medium" &&
          analysis.score > 50 &&
          analysis.score <= 70) ||
        (scoreFilter === "high" && analysis.score > 70);

      return matchesSearch && matchesJob && matchesMatch && matchesScore;
    });
  }, [analyses, search, jobFilter, matchFilter, scoreFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAnalyses.length / ITEMS_PER_PAGE),
  );

  const paginatedAnalyses = useMemo(() => {
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * ITEMS_PER_PAGE;

    return filteredAnalyses.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAnalyses, page, totalPages]);

  function resetPage(): void {
    setPage(1);
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
                value={matchFilter}
                options={matchOptions}
                onChange={(value) => {
                  setMatchFilter(value);
                  resetPage();
                }}
              />

              <SearchInput
                value={search}
                onChange={(value) => {
                  setSearch(value);
                  resetPage();
                }}
                placeholder="Buscar candidato..."
              />

              <FilterSelect
                value={jobFilter}
                onChange={(value) => {
                  setJobFilter(value);
                  resetPage();
                }}
                options={jobOptions}
                ariaLabel="Filtrar por vaga"
              />

              <FilterSelect
                value={scoreFilter}
                onChange={(value) => {
                  setScoreFilter(value as ScoreFilter);
                  resetPage();
                }}
                options={scoreOptions}
                ariaLabel="Filtrar por score"
              />
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
          paginatedAnalyses.map((analysis) => (
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
