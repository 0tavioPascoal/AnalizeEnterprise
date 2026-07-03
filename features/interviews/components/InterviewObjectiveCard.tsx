import { Target } from "lucide-react";

export interface InterviewObjectiveCardProps {
  objective?: string | null;
}

export function InterviewObjectiveCard({
  objective,
}: InterviewObjectiveCardProps) {
  const formattedObjective = objective?.trim();

  return (
    <section className="overflow-hidden rounded-[28px] border border-zinc-200/80 bg-white shadow-xl shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900/90">
      <div className="border-b border-zinc-200/80 bg-zinc-50/80 p-6 dark:border-zinc-800 dark:bg-zinc-950/40">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/8 text-violet-600 dark:bg-violet-500/12 dark:text-violet-300">
            <Target size={21} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              Direcionamento
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
              Objetivo da entrevista
            </h2>

            <p className="mt-1.5 text-[15px] leading-7 text-zinc-500 dark:text-zinc-400">
              Use este objetivo como guia para conduzir a conversa com foco nos
              pontos mais relevantes da análise.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="rounded-2xl border border-zinc-200/70 bg-zinc-50/70 p-5 dark:border-zinc-800 dark:bg-zinc-950/40">
          <p className="text-[16px] font-medium leading-8 text-zinc-700 dark:text-zinc-300">
            {formattedObjective || "Objetivo da entrevista não disponível."}
          </p>
        </div>
      </div>
    </section>
  );
}