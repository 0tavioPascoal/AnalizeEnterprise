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
            <div className="flex items-center gap-3">
              {/* SEARCH */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
                <Input
                  placeholder="Buscar candidato..."
                  className="w-64 h-9 pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* FILTERS */}
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
      <div className="flex flex-col gap-3 pb-4">
        {tableData.length > 0 ? (
          tableData.map((analysis) => (
            <RowItem
              key={analysis.id}
              left={
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className={cn(
                      "h-11 w-11 rounded-xl flex items-center justify-center shrink-0",
                      analysis.match
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
                    )}
                  >
                    <FileText size={20} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50 truncate">
                        {analysis.candidate_name ?? "Candidato sem nome"}
                      </p>

                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] px-2 py-0 rounded-md border-none",
                          analysis.match
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
                        )}
                      >
                        {analysis.match ? "Match" : "Atenção"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 mt-1.5 min-w-0">
                      <span className="text-[11px] text-zinc-400 truncate">
                        {analysis.candidate_email ?? "E-mail não identificado"}
                      </span>

                      <span className="text-zinc-300">•</span>

                      <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 truncate">
                        {analysis.job_title ?? "Vaga não identificada"}
                      </span>
                    </div>
                  </div>
                </div>
              }
              right={
                <div className="flex items-center gap-5">
                  <div className="text-right min-w-24">
                    <div
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-black",
                        analysis.score >= 70
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                          : analysis.score >= 50
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                            : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
                      )}
                    >
                      <Target size={14} />
                      {analysis.score}%
                    </div>

                    <p className="mt-1 text-[10px] text-zinc-400 font-medium uppercase">
                      {analysis.recommendation.replace("_", " ")}
                    </p>
                  </div>

                  <Link
                    href={`/dashboard/analyses/${analysis.id}`}
                    className="h-9 w-9 flex items-center justify-center text-indigo-500 hover:text-indigo-600 transition"
                    aria-label={`Abrir análise de ${analysis.candidate_name ?? "candidato"}`}
                  >
                    <ChevronRight size={18} />
                  </Link>
                </div>
              }
            />
          ))
        ) : (
          <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-400 text-sm bg-zinc-50/40 dark:bg-zinc-900/40">
            <FileText size={24} className="mb-2 text-zinc-300" />
            <p className="font-medium">Nenhuma análise encontrada.</p>
            <p className="text-xs mt-1">
              Faça uma análise de currículo para começar.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
