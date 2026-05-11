"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Target,
  BrainCircuit,
  FileText,
  Info,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export function JobTips() {
  return (
    <Card className="hidden h-full flex-col overflow-hidden border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 lg:flex">
      <CardHeader className="shrink-0 border-b border-zinc-100 py-5 dark:border-zinc-800">
        <CardTitle className="flex items-center gap-2 text-base font-extrabold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
          <Info className="h-5 w-5" />
          Guia de Configuração
        </CardTitle>
      </CardHeader>

      <CardContent className="scrollbar-hide flex-1 space-y-8 overflow-y-auto p-8">
        <div className="space-y-5">
          <h4 className="text-sm font-extrabold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Parâmetros da IA
          </h4>

          <div className="space-y-6">
            <TipItem
              icon={<Target className="text-indigo-600 dark:text-indigo-400" size={22} />}
              title="Objetividade Técnica"
              desc="Liste as Hard Skills essenciais de forma clara para que o scanner identifique as palavras-chave no currículo."
            />

            <TipItem
              icon={<BrainCircuit className="text-blue-600 dark:text-blue-400" size={22} />}
              title="Score Mínimo Realista"
              desc="Defina uma nota de corte que equilibre a exigência técnica com a realidade do mercado atual."
            />

            <TipItem
              icon={<FileText className="text-amber-500 dark:text-amber-400" size={22} />}
              title="Contexto da Vaga"
              desc="Use este campo para detalhes culturais ou diferenciais que a IA deve considerar na análise subjetiva."
            />
          </div>
        </div>

        <div className="space-y-5 border-t border-zinc-100 pt-6 dark:border-zinc-800">
          <h4 className="text-sm font-extrabold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Dicas Práticas
          </h4>

          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
              <span>
                Evite termos genéricos; prefira tecnologias e frameworks
                específicos (ex: .NET 8, React 19).
              </span>
            </li>

            <li className="flex items-start gap-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-indigo-500 dark:text-indigo-400" />
              <span>
                O contexto ajuda a IA a entender se a vaga é para um perfil
                mais focado em produto ou infraestrutura.
              </span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

interface TipItemProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

function TipItem({ icon, title, desc }: TipItemProps) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 shrink-0">{icon}</div>

      <div className="space-y-1">
        <p className="text-base font-bold text-zinc-900 dark:text-zinc-100">
          {title}
        </p>

        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          {desc}
        </p>
      </div>
    </div>
  );
}