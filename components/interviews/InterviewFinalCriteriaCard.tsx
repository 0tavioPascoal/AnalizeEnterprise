import { CheckCircle2 } from "lucide-react";

interface InterviewFinalCriteriaCardProps {
  text?: string | null;
}

export function InterviewFinalCriteriaCard({
  text,
}: InterviewFinalCriteriaCardProps) {
  const formattedText = text?.trim();

  return (
    <section className="overflow-hidden rounded-[28px] border border-zinc-200/80 bg-white shadow-xl shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900/90">
      <div className="border-b border-zinc-200/80 bg-zinc-50/80 p-6 dark:border-zinc-800 dark:bg-zinc-950/40">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/8 text-emerald-600 dark:bg-emerald-500/12 dark:text-emerald-300">
            <CheckCircle2 size={21} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              Decisão final
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
              Critério final de avaliação
            </h2>

            <p className="mt-1.5 text-[15px] leading-7 text-zinc-500 dark:text-zinc-400">
              Use este critério para consolidar a decisão após validar as
              respostas, riscos e lacunas durante a entrevista.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/6 p-5 dark:bg-emerald-500/8">
          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/12 text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 size={17} />
            </div>

            <p className="text-[16px] font-medium leading-8 text-zinc-700 dark:text-zinc-300">
              {formattedText || "Critério final não disponível."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}