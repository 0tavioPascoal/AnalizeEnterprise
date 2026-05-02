"use client";

import { FileText, ChevronRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { useTable } from "@/hooks/useTable";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/Pageheader";
import { TablePagination } from "@/components/layout/TablePagination";
import { RowItem } from "@/components/layout/RowItem";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AnalysisFilters } from "@/components/analyses/AnalysisFilters";
import { cn } from "@/lib/utils";

// =========================
// TYPES (TypeScript Strict)
// =========================
export type Analysis = {
  id: string;
  name: string;
  job: string;
  score: number;
};

export default function AnalysesPage() {
  const router = useRouter();

  // MOCK DATA (8 itens)
  const data: Analysis[] = [
    { id: "1", name: "João Silva", job: "Backend", score: 92 },
    { id: "2", name: "Maria Souza", job: "Frontend", score: 88 },
    { id: "3", name: "Carlos Lima", job: "DevOps", score: 70 },
    { id: "4", name: "Ana Costa", job: "Backend", score: 60 },
    { id: "5", name: "Otávio Pascoal", job: "Backend", score: 98 },
    { id: "6", name: "Lucas Medeiros", job: "Data Scientist", score: 85 },
    { id: "7", name: "Ana Beatriz", job: "UX Designer", score: 72 },
    { id: "8", name: "Carlos Eduardo", job: "DevOps Engineer", score: 91 },
  ];

  const {
    data: tableData,
    search,
    setSearch,
    filters,
    setFilter,
    page,
    setPage,
    totalPages,
  } = useTable<Analysis>({
    data,
    itemsPerPage: 7, // Alterado para 7 para forçar a existência da página 2
    searchKey: "name",
  });

  return (
    <PageLayout
      header={
        <PageHeader
          title="Análises"
          description="Gerencie e consulte o histórico de currículos analisados pela IA"
          action={
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
                <Input
                  placeholder="Buscar candidato..."
                  className="w-64 h-9 pl-9 shadow-sm"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              
              <AnalysisFilters
                jobFilter={filters.job || ""}
                setJobFilter={(v: string) => setFilter("job", v)}
              />
            </div>
          }
        />
      }
      /* A PAGINAÇÃO AGORA APARECERÁ POIS TOTALPAGES SERÁ 2 */
      pagination={
        totalPages > 1 ? (
          <TablePagination
            page={page}
            totalPages={totalPages}
            setPage={setPage}
          />
        ) : null
      }
    >
      <div className="flex flex-col gap-3 pb-4">
        {tableData.length > 0 ? (
          tableData.map((analysis) => (
            <RowItem
              key={analysis.id}
              onClick={() => router.push(`/dashboard/analyses/${analysis.id}`)}
              left={
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                      {analysis.name}
                    </p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-tight font-medium">
                      Vaga: {analysis.job}
                    </p>
                  </div>
                </div>
              }
              right={
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "font-bold px-3 py-0.5 border-none shadow-sm",
                        analysis.score >= 80 
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" 
                          : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                      )}
                    >
                      {analysis.score}% Match
                    </Badge>
                  </div>
                  <ChevronRight size={16} className="text-zinc-300" />
                </div>
              }
            />
          ))
        ) : (
          <div className="h-32 flex items-center justify-center border-2 border-dashed rounded-xl text-zinc-400 text-sm italic">
            Nenhuma análise encontrada.
          </div>
        )}
      </div>
    </PageLayout>
  );
}