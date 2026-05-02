"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Lightbulb, 
  CheckCircle2, 
  BrainCircuit, 
  FileCheck, 
  ShieldCheck, 
  Zap,
  AlertCircle
} from "lucide-react";

export function AnalyzeTips() {
  return (
    /* 
       h-full + max-h-full + overflow-hidden: 
       Garante que o card respeite o limite do grid pai sem vazar.
    */
    <Card className="hidden lg:flex flex-col h-full max-h-full border border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
      <CardHeader className="border-b border-zinc-50 dark:border-zinc-800 shrink-0 py-4">
        <CardTitle className="text-base font-bold flex items-center gap-2 text-indigo-600 uppercase tracking-wider">
          <Lightbulb className="w-5 h-5" />
          Guia de Práticas
        </CardTitle>
      </CardHeader>

      {/* 
          flex-1 + overflow-y-auto: 
          Faz com que apenas o miolo role se o conteúdo for maior que a tela.
      */}
      <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {/* SEÇÃO: WORKFLOW */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Fluxo de Análise</h4>
          <div className="space-y-5">
            <TipItem 
              icon={<Zap className="text-amber-500" size={18} />} 
              title="Seleção de Vaga" 
              desc="A IA utiliza os requisitos da vaga selecionada como base de comparação." 
            />
            <TipItem 
              icon={<FileCheck className="text-blue-500" size={18} />} 
              title="Formatos" 
              desc="Prefira PDF ou DOCX com texto selecionável para evitar erros de leitura." 
            />
            <TipItem 
              icon={<BrainCircuit className="text-indigo-500" size={18} />} 
              title="Cálculo" 
              desc="O Match cruza skills, experiência e o contexto da descrição." 
            />
          </div>
        </div>

        {/* SEÇÃO: PRECISÃO */}
        <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Precisão</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Evite imagens escaneadas (OCR reduz a precisão).</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
              <AlertCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <span>A validação humana final é sempre essencial.</span>
            </li>
          </ul>
        </div>

        {/* SEGURANÇA - Compactado */}
        <div className="pt-2">
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 flex gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
            <p className="text-[11px] leading-snug text-zinc-500">
              Ambiente seguro. Dados não utilizados para treinamento público.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TipItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex gap-3">
      <div className="mt-1 shrink-0">{icon}</div>
      <div>
        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-tight mb-0.5">{title}</p>
        <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}