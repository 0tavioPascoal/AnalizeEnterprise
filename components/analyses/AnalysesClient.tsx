"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FileText, ChevronRight, Search, Target } from "lucide-react";

import { useTable } from "@/hooks/useTable";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/Pageheader";
import { TablePagination } from "@/components/layout/TablePagination";
import { RowItem } from "@/components/layout/RowItem";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AnalysisFilters } from "@/components/analyses/AnalysisFilters";
import { cn } from "@/lib/utils";

import type { AnalysisListItem } from "@/actions/analyzes/getAnalyzes";

interface AnalysesClientProps {
  analyses: AnalysisListItem[];
}

export function AnalysesClient({ analyses }: AnalysesClientProps) {
  // =========================
  // FILTER STATES
  // =========================
  const [jobFilter, setJobFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [scoreFilter, setScoreFilter] = useState("");

  // =========================
  // FILTRO PERFORMÁTICO (🔥 sem useEffect)
  // =========================
  const filteredAnalyses = useMemo(() => {
    return analyses.filter((item) => {
      // job
      if (jobFilter && item.job_title !== jobFilter) return false;

      // status
      if (statusFilter === "match" && !item.match) return false;
      if (statusFilter === "no_match" && item.match) return false;

      // score
      if (scoreFilter === "low" && item.score > 50) return false;
      if (scoreFilter === "medium" && (item.score <= 50 || item.score > 70))
        return false;
      if (scoreFilter === "high" && item.score <= 70) return false;

      return true;
    });
  }, [analyses, jobFilter, statusFilter, scoreFilter]);

  // =========================
  // TABLE (agora usa dado filtrado)
  // =========================
  const {
    data: tableData,
    search,
    setSearch,
    page,
    setPage,
    totalPages,
  } = useTable<AnalysisListItem>({
    data: filteredAnalyses,
    itemsPerPage: 7,
    searchKey: "candidate_name",
  });

  // =========================
  // JOBS DINÂMICO
  // =========================
  const jobs = useMemo(() => {
    const unique = Array.from(
      new Set(
        analyses.map((a) => a.job_title).filter((j): j is string => Boolean(j)),
      ),
    );

    return unique.map((title) => ({
      id: title,
      title,
    }));
  }, [analyses]);

  return (
    <PageLayout
      header={
        <PageHeader
          title="Análises"
          description="Histórico de currículos analisados pela IA"
          action={
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  placeholder="Buscar candidato..."
                  className="h-10 w-full rounded-xl border-border bg-card pl-9 pr-3 text-sm shadow-sm transition-all placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/30 lg:w-72"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <AnalysisFilters
                jobFilter={jobFilter}
                setJobFilter={setJobFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                scoreFilter={scoreFilter}
                setScoreFilter={setScoreFilter}
                jobs={jobs}
              />
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
      <div className="flex flex-col gap-3 pb-4 mr-5">
        {tableData.length > 0 ? (
          tableData.map((analysis) => (
            <RowItem
              key={analysis.id}
              left={
                <div className="flex min-w-0 items-center gap-4">
                  <div
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border shadow-sm",
                      analysis.match
                        ? "border-emerald-500/20 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                        : "border-amber-500/20 bg-amber-500/15 text-amber-700 dark:text-amber-300",
                    )}
                  >
                    <FileText size={20} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {analysis.candidate_name ?? "Candidato sem nome"}
                      </p>

                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-lg border px-2 py-0.5 text-[10px] font-semibold shadow-none",
                          analysis.match
                            ? "border-emerald-500/20 bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15 dark:text-emerald-300"
                            : "border-amber-500/20 bg-amber-500/15 text-amber-700 hover:bg-amber-500/15 dark:text-amber-300",
                        )}
                      >
                        {analysis.match ? "Match" : "Atenção"}
                      </Badge>
                    </div>

                    <div className="mt-1.5 flex min-w-0 flex-wrap items-center gap-2">
                      <span className="max-w-55 truncate text-xs text-muted-foreground">
                        {analysis.candidate_email ?? "E-mail não identificado"}
                      </span>

                      <span className="text-muted-foreground/50">•</span>

                      <span className="max-w-55 truncate text-xs font-medium text-muted-foreground">
                        {analysis.job_title ?? "Vaga não identificada"}
                      </span>
                    </div>
                  </div>
                </div>
              }
              right={
                <div className="flex items-center gap-4">
                  <div className="hidden min-w-24 text-right sm:block">
                    <div
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-black shadow-sm",
                        analysis.score >= 70
                          ? "border-emerald-500/20 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                          : analysis.score >= 50
                            ? "border-amber-500/20 bg-amber-500/15 text-amber-700 dark:text-amber-300"
                            : "border-rose-500/20 bg-rose-500/15 text-rose-700 dark:text-rose-300",
                      )}
                    >
                      <Target size={14} />
                      {analysis.score}%
                    </div>

                    <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      {analysis.recommendation.replace("_", " ")}
                    </p>
                  </div>

                  <Link
                    href={`/dashboard/analyses/${analysis.id}`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                    aria-label={`Abrir análise de ${
                      analysis.candidate_name ?? "candidato"
                    }`}
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
              <FileText size={22} />
            </div>

            <p className="text-sm font-semibold text-foreground">
              Nenhuma análise encontrada.
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Faça uma análise de currículo para começar.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
