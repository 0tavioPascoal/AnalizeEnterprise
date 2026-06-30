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
    <Card className="hidden h-full flex-col overflow-hidden border border-border bg-card shadow-sm lg:flex">
      <CardHeader className="shrink-0 border-b border-border py-5">
        <CardTitle className="flex items-center gap-2 text-base font-extrabold uppercase tracking-wide text-primary">
          <Lightbulb className="h-5 w-5" />
          Guia de Práticas
        </CardTitle>
      </CardHeader>

      <CardContent className="custom-scrollbar flex-1 space-y-8 overflow-y-auto p-6 xl:p-8">
        <div className="space-y-5">
          <h4 className="text-sm font-extrabold uppercase tracking-wide text-muted-foreground">
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

        <div className="space-y-5 border-t border-border pt-6">
          <h4 className="text-sm font-extrabold uppercase tracking-wide text-muted-foreground">
            Precisão
          </h4>

          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-sm leading-relaxed text-foreground/80">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
              <span>Evite imagens escaneadas (OCR reduz a precisão).</span>
            </li>

            <li className="flex items-start gap-3 text-sm leading-relaxed text-foreground/80">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-indigo-500 dark:text-indigo-400" />
              <span>A validação humana final é sempre essencial.</span>
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-muted/40 p-4">
          <div className="flex gap-3">
            <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />

            <p className="text-sm leading-relaxed text-foreground/80">
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
        <p className="text-base font-bold leading-tight text-foreground">
          {title}
        </p>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {desc}
        </p>
      </div>
    </div>
  );
}
