"use client";

import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/Pageheader";
import { AnalyzeForm } from "@/components/analyze/AnalyzeForm";
import { AnalyzeTips } from "@/components/analyze/AnalyzeTips";
import { Sparkles } from "lucide-react";

export default function AnalyzePage() {
  return (
    <PageLayout
      header={
        <PageHeader
          title="Análise de Currículo"
          description="Compare candidatos com suas vagas automaticamente utilizando nossa IA"
          // Slot de action vazio ou com um ícone decorativo para manter o padrão visual
          action={
            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                IA Scanner Ativo
              </span>
            </div>
          }
        />
      }
    >
      {/* 
        Utilizamos um grid que se adapta: 
        No desktop, o formulário ocupa 2 colunas e as dicas 1.
        O h-full garante que o conteúdo preencha o espaço disponível no PageLayout.
      */}
      <div className="grid gap-6 lg:grid-cols-3 h-full items-start">
        <div className="lg:col-span-2">
          <AnalyzeForm />
        </div>
        
        <div className="lg:col-span-1">
          <AnalyzeTips />
        </div>
      </div>
    </PageLayout>
  );
}