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

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>): void {
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

  const counts = useMemo(() => {
    return statuses.reduce<Record<PipelineStatus, number>>(
      (acc, status) => {
        acc[status] = analyses.filter((item) => item.status === status).length;
        return acc;
      },
      {
        pending: 0,
        approved: 0,
        rejected: 0,
      },
    );
  }, [analyses]);

  return (
    <PageLayout
      header={
        <PageHeader
          title="Pipeline de Talentos"
          description="Consulte o histórico de decisões e o banco de talentos aprovados."
          action={
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900"
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
            <TabsList className="h-12 w-fit rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
              <TabsTrigger
                value="pending"
                className="gap-2 rounded-lg px-6 text-[10px] font-black uppercase tracking-widest"
              >
                <Clock size={14} />
                Pendentes
                <span className="rounded-md bg-zinc-200 px-2 py-0.5 text-[10px] dark:bg-zinc-700">
                  {counts.pending}
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="approved"
                className="gap-2 rounded-lg px-6 text-[10px] font-black uppercase tracking-widest data-[state=active]:text-emerald-600"
              >
                <CheckCircle2 size={14} />
                Aprovados
                <span className="rounded-md bg-zinc-200 px-2 py-0.5 text-[10px] dark:bg-zinc-700">
                  {counts.approved}
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="rejected"
                className="gap-2 rounded-lg px-6 text-[10px] font-black uppercase tracking-widest data-[state=active]:text-red-600"
              >
                <XCircle size={14} />
                Reprovados
                <span className="rounded-md bg-zinc-200 px-2 py-0.5 text-[10px] dark:bg-zinc-700">
                  {counts.rejected}
                </span>
              </TabsTrigger>
            </TabsList>

            <div className="relative w-full lg:max-w-sm">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              />

              <Input
                value={search}
                onChange={handleSearchChange}
                placeholder="Buscar candidato, e-mail ou vaga..."
                className="h-11 rounded-xl pl-10 text-sm"
              />
            </div>
          </div>

          {statuses.map((status) => (
            <TabsContent
              key={status}
              value={status}
              className="mt-0 flex-1 overflow-hidden"
            >
              <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                {loading ? (
                  <div className="flex flex-1 items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                  </div>
                ) : filteredAnalyses.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      Nenhum candidato encontrado
                    </p>

                    <p className="max-w-sm text-sm text-zinc-500">
                      Não existem análises em “{statusLabels[status]}” para o
                      filtro atual.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto">
                      <table className="w-full border-collapse text-left">
                        <thead className="sticky top-0 z-10 bg-zinc-50/90 backdrop-blur-md dark:bg-zinc-800/90">
                          <tr className="border-b border-zinc-100 dark:border-zinc-800">
                            <th className="p-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                              Candidato
                            </th>
                            <th className="p-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                              Vaga
                            </th>
                            <th className="p-5 text-center text-[10px] font-black uppercase tracking-widest text-zinc-400">
                              Score Match
                            </th>
                            <th className="p-5 text-right text-[10px] font-black uppercase tracking-widest text-zinc-400">
                              Ação
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800">
                          {paginatedAnalyses.map((item) => (
                            <tr
                              key={item.id}
                              className={cn(
                                "transition-all hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40",
                                status === "approved" && "bg-emerald-50/10",
                                status === "rejected" && "bg-red-50/10",
                              )}
                            >
                              <td className="p-5">
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                    {item.candidate_name ??
                                      "Candidato sem nome"}
                                  </span>

                                  {item.candidate_email && (
                                    <span className="text-xs text-zinc-400">
                                      {item.candidate_email}
                                    </span>
                                  )}
                                </div>
                              </td>

                              <td className="p-5 text-sm text-zinc-600 dark:text-zinc-400">
                                {item.job_title ?? "Vaga não informada"}
                              </td>

                              <td className="p-5 text-center">
                                <span
                                  className={cn(
                                    "rounded-lg border px-3 py-1 text-sm font-black",
                                    status === "approved" &&
                                      "border-emerald-100 bg-emerald-50 text-emerald-600",
                                    status === "rejected" &&
                                      "border-red-100 bg-red-50 text-red-600",
                                    status === "pending" &&
                                      "border-zinc-100 bg-zinc-50 text-zinc-500",
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
                                  className="h-9 w-9 text-zinc-400 transition-all hover:text-zinc-900 dark:hover:text-zinc-100"
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
                      <div className="shrink-0 border-t border-zinc-100 px-4 py-3 dark:border-zinc-800">
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