"use client";

import { cn } from "@/lib/utils";

export function PageLayout({
  header,
  filters,
  children,
  pagination,
}: {
  header: React.ReactNode;
  filters?: React.ReactNode;
  children: React.ReactNode;
  pagination?: React.ReactNode;
}) {
  return (
    /* 
      h-full herda o h-screen do DashboardLayout.
      overflow-hidden mata o scroll da página inteira.
      p-6 substitui o mx/my-5 para um espaçamento mais consistente com o Dashboard.
    */
    <div className="h-full w-full flex flex-col overflow-hidden p-6 gap-6 bg-transparent box-border">
      
      {/* HEADER - Altura fixa baseada no conteúdo */}
      <div className="shrink-0 flex flex-col gap-4">
        {header}
      </div>

      {/* FILTERS - Posicionamento estratégico */}
      {filters && (
        <div className="shrink-0 flex items-center justify-end border-b border-zinc-200/50 dark:border-zinc-800 pb-4">
          <div className="w-full md:w-auto">
            {filters}
          </div>
        </div>
      )}

      {/* CONTENT/LIST - Ocupa 100% da sobra e gerencia o scroll local */}
      {/* O min-h-0 é o "segredo" para o flex-1 não estourar o container pai */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div className="h-full w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
          {children}
        </div>
      </div>

      {/* PAGINATION - Fixo no rodapé */}
      {pagination && (
        <div className="shrink-0 pt-4 border-t border-zinc-200/50 dark:border-zinc-800">
          {pagination}
        </div>
      )}
    </div>
  );
}