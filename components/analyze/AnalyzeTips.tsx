"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Lightbulb,
  CheckCircle2,
  BrainCircuit,
  FileCheck,
  ShieldCheck,
  Zap,
  AlertCircle,
} from "lucide-react";

export function AnalyzeTips() {
  return (
    <Card className="hidden h-full max-h-full flex-col overflow-hidden border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 lg:flex">
      <CardHeader className="shrink-0 border-b border-zinc-100 py-5 dark:border-zinc-800">
        <CardTitle className="flex items-center gap-2 text-base font-extrabold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
          <Lightbulb className="h-5 w-5" />
          Guia de Práticas
        </CardTitle>
      </CardHeader>

      <CardContent className="scrollbar-hide flex-1 space-y-8 overflow-y-auto p-8">
        <div className="space-y-5">
          <h4 className="text-sm font-extrabold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Fluxo de Análise
          </h4>

          <div className="space-y-6">
            <TipItem
              icon={<Zap className="text-amber-500 dark:text-amber-400" size={22} />}
              title="Seleção de Vaga"
              desc="A IA utiliza os requisitos da vaga selecionada como base de comparação."
            />

            <TipItem
              icon={<FileCheck className="text-blue-600 dark:text-blue-400" size={22} />}
              title="Formatos"
              desc="Prefira PDF ou DOCX com texto selecionável para evitar erros de leitura."
            />

            <TipItem
              icon={<BrainCircuit className="text-indigo-600 dark:text-indigo-400" size={22} />}
              title="Cálculo"
              desc="O Match cruza skills, experiência e o contexto da descrição."
            />
          </div>
        </div>

        <div className="space-y-5 border-t border-zinc-100 pt-6 dark:border-zinc-800">
          <h4 className="text-sm font-extrabold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Precisão
          </h4>

          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
              <span>Evite imagens escaneadas (OCR reduz a precisão).</span>
            </li>

            <li className="flex items-start gap-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-indigo-500 dark:text-indigo-400" />
              <span>A validação humana final é sempre essencial.</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
          <div className="flex gap-3">
            <ShieldCheck className="h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />

            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              Ambiente seguro. Dados não utilizados para treinamento público.
            </p>
          </div>
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
        <p className="text-base font-bold leading-tight text-zinc-900 dark:text-zinc-100">
          {title}
        </p>

        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          {desc}
        </p>
      </div>
    </div>
  );
}