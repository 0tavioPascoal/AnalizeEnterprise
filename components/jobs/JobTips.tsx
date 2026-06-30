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
    <Card className="hidden h-full flex-col overflow-hidden border border-border bg-card shadow-sm lg:flex">
      <CardHeader className="shrink-0 border-b border-border py-5">
        <CardTitle className="flex items-center gap-2 text-base font-extrabold uppercase tracking-wide text-primary">
          <Info className="h-5 w-5" />
          Guia de Configuração
        </CardTitle>
      </CardHeader>

      <CardContent className="custom-scrollbar flex-1 space-y-8 overflow-y-auto p-6 xl:p-8">
        <div className="space-y-5">
          <h4 className="text-sm font-extrabold uppercase tracking-wide text-muted-foreground">
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

        <div className="space-y-5 border-t border-border pt-6">
          <h4 className="text-sm font-extrabold uppercase tracking-wide text-muted-foreground">
            Dicas Práticas
          </h4>

          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-sm leading-relaxed text-foreground/80">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
              <span>
                Evite termos genéricos; prefira tecnologias e frameworks
                específicos (ex: .NET 8, React 19).
              </span>
            </li>

            <li className="flex items-start gap-3 text-sm leading-relaxed text-foreground/80">
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
        <p className="text-base font-bold text-foreground">
          {title}
        </p>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {desc}
        </p>
      </div>
    </div>
  );
}
