"use client";

import { useState } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ChevronRight, 
  UserSearch,
  ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";

import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/Pageheader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PipelinePage() {
  const router = useRouter();

  // Mock de dados para visualização das abas
  const analyses = [
    { id: "1", name: "João Silva", job: "Backend .NET", score: 82, status: "pending" },
    { id: "2", name: "Maria Souza", job: "Frontend React", score: 91, status: "approved" },
    { id: "3", name: "Carlos Oliveira", job: "DevOps", score: 65, status: "rejected" },
  ];

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
              className="text-zinc-500 hover:text-zinc-900 gap-2 font-bold uppercase text-[10px] tracking-widest"
            >
              <ArrowLeft size={16} />
              Voltar
            </Button>
          }
        />
      }
    >
      <div className="h-full flex flex-col overflow-hidden">
        
        {/* SISTEMA DE TABS PARA FILTRAGEM RÁPIDA */}
        <Tabs defaultValue="approved" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl h-12 w-fit mb-6">
            <TabsTrigger value="pending" className="rounded-lg px-8 font-black uppercase text-[10px] tracking-widest gap-2">
              <Clock size={14} /> Pendentes
            </TabsTrigger>
            <TabsTrigger value="approved" className="rounded-lg px-8 font-black uppercase text-[10px] tracking-widest gap-2 data-[state=active]:text-emerald-600">
              <CheckCircle2 size={14} /> Aprovados
            </TabsTrigger>
            <TabsTrigger value="rejected" className="rounded-lg px-8 font-black uppercase text-[10px] tracking-widest gap-2 data-[state=active]:text-red-600">
              <XCircle size={14} /> Reprovados
            </TabsTrigger>
          </TabsList>

          {/* CONTEÚDO DAS TABS - Renderização da Tabela */}
          {["pending", "approved", "rejected"].map((status) => (
            <TabsContent key={status} value={status} className="flex-1 overflow-hidden mt-0">
              <div className="h-full border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-y-auto flex-1 scrollbar-hide">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-zinc-50/90 dark:bg-zinc-800/90 backdrop-blur-md z-10">
                      <tr className="border-b border-zinc-100 dark:border-zinc-800">
                        <th className="p-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Candidato</th>
                        <th className="p-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Vaga</th>
                        <th className="p-5 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center">Score Match</th>
                        <th className="p-5 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800">
                      {analyses.filter(a => a.status === status).map((item) => (
                        <tr 
                          key={item.id} 
                          className={cn(
                            "transition-all hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30",
                            status === 'approved' && "bg-emerald-50/10",
                            status === 'rejected' && "bg-red-50/10"
                          )}
                        >
                          <td className="p-5">
                            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{item.name}</span>
                          </td>
                          <td className="p-5 text-sm text-zinc-600 dark:text-zinc-400">{item.job}</td>
                          <td className="p-5 text-center">
                            <span className={cn(
                              "text-sm font-black px-3 py-1 rounded-lg border",
                              status === 'approved' ? "text-emerald-600 border-emerald-100 bg-emerald-50" : 
                              status === 'rejected' ? "text-red-600 border-red-100 bg-red-50" : "text-zinc-500 border-zinc-100 bg-zinc-50"
                            )}>
                              {item.score}%
                            </span>
                          </td>
                          <td className="p-5 text-right">
                            <Button 
                              size="icon" 
                              variant="ghost"
                              onClick={() => router.push(`/dashboard/analyses/${item.id}`)}
                              className="h-9 w-9 text-zinc-400 hover:text-zinc-900 transition-all"
                            >
                              <ChevronRight size={20} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </PageLayout>
  );
}