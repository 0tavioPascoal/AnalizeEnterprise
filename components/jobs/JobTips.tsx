"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Target, 
  BrainCircuit, 
  FileText, 
  Info,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

/**
 * Componente JobTips refatorado para manter a consistência visual
 * com o padrão de Viewport Rígido do RH Analyzer.
 */
export function JobTips() {
  return (
    <Card className="hidden lg:flex flex-col h-full border border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
      <CardHeader className="border-b border-zinc-50 dark:border-zinc-800 shrink-0 py-5">
        <CardTitle className="text-base font-bold flex items-center gap-2 text-indigo-600 uppercase tracking-wider">
          <Info className="w-5 h-5" />
          Guia de Configuração
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
        {/* SEÇÃO: CRITÉRIOS TÉCNICOS */}
        <div className="space-y-5">
          <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400">Parâmetros da IA</h4>
          <div className="space-y-6">
            <TipItem 
              icon={<Target className="text-indigo-600" size={20} />} 
              title="Objetividade Técnica" 
              desc="Liste as Hard Skills essenciais de forma clara para que o scanner identifique as palavras-chave no currículo." 
            />
            <TipItem 
              icon={<BrainCircuit className="text-blue-500" size={20} />} 
              title="Score Mínimo Realista" 
              desc="Defina uma nota de corte que equilibre a exigência técnica com a realidade do mercado atual." 
            />
            <TipItem 
              icon={<FileText className="text-amber-500" size={20} />} 
              title="Contexto da Vaga" 
              desc="Use este campo para detalhes culturais ou diferenciais que a IA deve considerar na análise subjetiva." 
            />
          </div>
        </div>

        {/* SEÇÃO: DICAS DE ENGENHARIA */}
        <div className="space-y-5 pt-6 border-t border-zinc-100 dark:border-zinc-800">
          <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400">Dicas Práticas</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span>Evite termos genéricos; prefira tecnologias e frameworks específicos (ex: .NET 8, React 19).</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
              <AlertCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <span>O contexto ajuda a IA a entender se a vaga é para um perfil mais focado em produto ou infraestrutura.</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Item de dica padronizado com a nova escala tipográfica
 */
function TipItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 mt-1">{icon}</div>
      <div>
        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{title}</p>
        <p className="text-sm text-zinc-500 leading-relaxed mt-1">{desc}</p>
      </div>
    </div>
  );
}