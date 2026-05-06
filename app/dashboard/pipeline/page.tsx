"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  ArrowLeft,
  Search,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/Pageheader";
import { TablePagination } from "@/components/layout/TablePagination";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import {
  getPipelineAnalyses,
  type PipelineAnalysis,
} from "@/actions/pipeline/pipeline";

import type { AnalysisStatus } from "@/actions/analyzes/getAnalysisById";

type PipelineStatus = AnalysisStatus;

const statuses: PipelineStatus[] = ["pending", "approved", "rejected"];

const statusLabels: Record<PipelineStatus, string> = {
  pending: "Pendentes",
  approved: "Aprovados",
  rejected: "Reprovados",
};

const ITEMS_PER_PAGE = 8;

export default function PipelinePage() {
  const router = useRouter();

  const [analyses, setAnalyses] = useState<PipelineAnalysis[]>([]);
  const [activeStatus, setActiveStatus] = useState<PipelineStatus>("approved");
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    async function loadPipeline(): Promise<void> {
      try {
        const data = await getPipelineAnalyses();
        setAnalyses(data);
      } finally {
        setLoading(false);
      }
    }

    loadPipeline();
  }, []);

  function handleStatusChange(value: string): void {
    setActiveStatus(value as PipelineStatus);
    setPage(1);
  }

  function handleSearchChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ): void {
    setSearch(event.target.value);
    setPage(1);
  }

  const filteredAnalyses = useMemo(() => {
    const term = search.toLowerCase().trim();

    return analyses.filter((item) => {
      const matchesStatus = item.status === activeStatus;

      if (!term) {
        return matchesStatus;
      }

      const matchesSearch =
        item.candidate_name?.toLowerCase().includes(term) ||
        item.candidate_email?.toLowerCase().includes(term) ||
        item.job_title?.toLowerCase().includes(term);

      return matchesStatus && matchesSearch;
    });
  }, [analyses, activeStatus, search]);

  const totalPages = Math.ceil(filteredAnalyses.length / ITEMS_PER_PAGE);

  const paginatedAnalyses = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    return filteredAnalyses.slice(start, end);
  }, [filteredAnalyses, page]);

  return (
    <PageLayout
      header={
        <PageHeader
          title="Pipeline de Talentos"
          description="Consulte o histórico de decisões e o banco de talentos aprovados."
          action={
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="gap-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
            >
              <ArrowLeft size={16} />
              Voltar
            </Button>
          }
        />
      }
    >
      <div className="flex h-full flex-col overflow-hidden">
        <Tabs
          value={activeStatus}
          onValueChange={handleStatusChange}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <TabsList className="h-15 rounded-2xl border border-border bg-card p-2 shadow-sm">
              <TabsTrigger
                value="pending"
                className="
      h-5 rounded-xl px-4
      text-[10px] font-black uppercase tracking-widest
      text-muted-foreground
      transition-all duration-200

      hover:bg-amber-500/10
      hover:text-amber-600

      data-[state=active]:bg-amber-500/15
      data-[state=active]:text-amber-600
      data-[state=active]:shadow-sm

      dark:data-[state=active]:bg-amber-400/15
      dark:data-[state=active]:text-amber-300
    "
              >
                <Clock size={14} className="mx-3" />
                Pendentes
              </TabsTrigger>

              <TabsTrigger
                value="approved"
                className="
      h-5 rounded-xl px-4
      text-[10px] font-black uppercase tracking-widest
      text-muted-foreground
      transition-all duration-200

      hover:bg-emerald-500/10
      hover:text-emerald-600

      data-[state=active]:bg-emerald-500/15
      data-[state=active]:text-emerald-600
      data-[state=active]:shadow-sm

      dark:data-[state=active]:bg-emerald-400/15
      dark:data-[state=active]:text-emerald-300
    "
              >
                <CheckCircle2 size={14} className="mr-2" />
                Aprovados
              </TabsTrigger>

              <TabsTrigger
                value="rejected"
                className="
      h-5 rounded-xl px-4
      text-[10px] font-black uppercase tracking-widest
      text-muted-foreground
      transition-all duration-200

      hover:bg-rose-500/10
      hover:text-rose-600

      data-[state=active]:bg-rose-500/15
      data-[state=active]:text-rose-600
      data-[state=active]:shadow-sm

      dark:data-[state=active]:bg-rose-400/15
      dark:data-[state=active]:text-rose-300
    "
              >
                <XCircle size={14} className="mr-2" />
                Reprovados
              </TabsTrigger>
            </TabsList>

            <div className="relative w-full lg:max-w-sm">
              <Search
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <Input
                value={search}
                onChange={handleSearchChange}
                placeholder="Buscar candidato, e-mail ou vaga..."
                className="h-11 rounded-xl border-border bg-card pl-10 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/30"
              />
            </div>
          </div>

          {statuses.map((status) => (
            <TabsContent
              key={status}
              value={status}
              className="mt-0 flex-1 overflow-hidden"
            >
              <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                {loading ? (
                  <div className="flex flex-1 flex-col items-center justify-center gap-3">
                    <Loader2 className="h-7 w-7 animate-spin text-primary" />
                    <p className="text-xs font-medium text-muted-foreground">
                      Carregando pipeline...
                    </p>
                  </div>
                ) : filteredAnalyses.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                    <div
                      className={cn(
                        "flex h-14 w-14 items-center justify-center rounded-2xl border",
                        status === "pending" &&
                          "border-amber-500/20 bg-amber-500/15 text-amber-600 dark:text-amber-300",
                        status === "approved" &&
                          "border-emerald-500/20 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
                        status === "rejected" &&
                          "border-rose-500/20 bg-rose-500/15 text-rose-600 dark:text-rose-300",
                      )}
                    >
                      {status === "pending" && <Clock size={24} />}
                      {status === "approved" && <CheckCircle2 size={24} />}
                      {status === "rejected" && <XCircle size={24} />}
                    </div>

                    <p className="text-sm font-bold text-foreground">
                      Nenhum candidato encontrado
                    </p>

                    <p className="max-w-sm text-sm text-muted-foreground">
                      Não existem análises em “{statusLabels[status]}” para o
                      filtro atual.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                      <table className="w-full border-collapse text-left">
                        <thead className="sticky top-0 z-10 border-b border-border bg-muted/80 backdrop-blur-md">
                          <tr>
                            <th className="p-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                              Candidato
                            </th>
                            <th className="p-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                              Vaga
                            </th>
                            <th className="p-5 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                              Score Match
                            </th>
                            <th className="p-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                              Ação
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-border">
                          {paginatedAnalyses.map((item) => (
                            <tr
                              key={item.id}
                              className={cn(
                                "group transition-all hover:bg-muted/60",

                                status === "pending" &&
                                  "bg-amber-500/5 dark:bg-amber-500/5",

                                status === "approved" &&
                                  "bg-emerald-500/5 dark:bg-emerald-500/5",

                                status === "rejected" &&
                                  "bg-rose-500/5 dark:bg-rose-500/5",
                              )}
                            >
                              <td className="p-5">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={cn(
                                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border text-xs font-black",
                                      status === "pending" &&
                                        "border-amber-500/20 bg-amber-500/15 text-amber-600 dark:text-amber-300",
                                      status === "approved" &&
                                        "border-emerald-500/20 bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
                                      status === "rejected" &&
                                        "border-rose-500/20 bg-rose-500/15 text-rose-600 dark:text-rose-300",
                                    )}
                                  >
                                    {(item.candidate_name ?? "?")
                                      .slice(0, 1)
                                      .toUpperCase()}
                                  </div>

                                  <div className="flex min-w-0 flex-col">
                                    <span className="truncate text-sm font-bold text-foreground">
                                      {item.candidate_name ??
                                        "Candidato sem nome"}
                                    </span>

                                    {item.candidate_email && (
                                      <span className="truncate text-xs text-muted-foreground">
                                        {item.candidate_email}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>

                              <td className="p-5 text-sm font-medium text-muted-foreground">
                                {item.job_title ?? "Vaga não informada"}
                              </td>

                              <td className="p-5 text-center">
                                <span
                                  className={cn(
                                    "inline-flex min-w-16 items-center justify-center rounded-xl border px-3 py-1.5 text-sm font-black shadow-sm",
                                    status === "approved" &&
                                      "border-emerald-500/20 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
                                    status === "rejected" &&
                                      "border-rose-500/20 bg-rose-500/15 text-rose-700 dark:text-rose-300",
                                    status === "pending" &&
                                      "border-amber-500/20 bg-amber-500/15 text-amber-700 dark:text-amber-300",
                                  )}
                                >
                                  {item.score}%
                                </span>
                              </td>

                              <td className="p-5 text-right">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() =>
                                    router.push(
                                      `/dashboard/analyses/${item.id}`,
                                    )
                                  }
                                  className="h-9 w-9 rounded-xl border border-border bg-card text-muted-foreground shadow-sm transition-all group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:text-primary"
                                >
                                  <ChevronRight size={20} />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {totalPages > 1 && (
                      <div className="shrink-0 border-t border-border bg-muted/30 px-4 py-3">
                        <TablePagination
                          page={page}
                          totalPages={totalPages}
                          setPage={setPage}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </PageLayout>
  );
}
