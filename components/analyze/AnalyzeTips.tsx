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

/**
 * Componente AnalyzeTips refatorado para ocupar a altura total (h-full)
 * e fornecer diretrizes detalhadas para a análise de IA.
 */
export function AnalyzeTips() {
  return (
    <Card className="hidden lg:flex flex-col h-full border-none shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
      <CardHeader className="border-b border-zinc-50 dark:border-zinc-800 shrink-0">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-indigo-600">
          <Lightbulb className="w-4 h-4" />
          Guia de Melhores Práticas
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {/* SEÇÃO: WORKFLOW OPERACIONAL */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Fluxo de Análise</h4>
          <div className="space-y-3">
            <TipItem 
              icon={<Zap className="text-amber-500" />} 
              title="Seleção de Vaga" 
              desc="Escolha a vaga correta para que a IA utilize os requisitos e score mínimo cadastrados como base." 
            />
            <TipItem 
              icon={<FileCheck className="text-blue-500" />} 
              title="Formatos Suportados" 
              desc="Utilize arquivos PDF ou DOCX com texto selecionável para garantir a precisão da extração de dados." 
            />
            <TipItem 
              icon={<BrainCircuit className="text-indigo-500" />} 
              title="Cálculo de Match" 
              desc="A IA cruza hard skills, tempo de experiência e palavras-chave contextuais da descrição da vaga." 
            />
          </div>
        </div>

        {/* SEÇÃO: DICAS DE PRECISÃO */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Dicas para Resultados Melhores</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-xs text-zinc-600 dark:text-zinc-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Evite currículos que sejam apenas imagens escaneadas (o OCR pode reduzir a precisão).</span>
            </li>
            <li className="flex items-start gap-3 text-xs text-zinc-600 dark:text-zinc-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Verifique se o arquivo não possui proteções de leitura ou senhas.</span>
            </li>
            <li className="flex items-start gap-3 text-xs text-zinc-600 dark:text-zinc-400">
              <AlertCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <span>O score gerado é uma recomendação técnica; a validação humana final é essencial.</span>
            </li>
          </ul>
        </div>

        {/* FOOTER: SEGURANÇA */}
        <div className="pt-6 border-t border-zinc-50 dark:border-zinc-800">
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 flex gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
            <p className="text-[10px] leading-relaxed text-zinc-500">
              Os dados dos candidatos são processados em ambiente seguro e não são utilizados para treinamento público de modelos de linguagem.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Sub-componente interno para itens de dica
 */
function TipItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div>
        <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-none mb-1">{title}</p>
        <p className="text-[11px] text-zinc-500 leading-normal">{desc}</p>
      </div>
    </div>
  );
}