import { CheckCircle2 } from "lucide-react";

interface InterviewFinalCriteriaCardProps {
  text?: string | null;
}

export function InterviewFinalCriteriaCard({
  text,
}: InterviewFinalCriteriaCardProps) {
  const formattedText = text?.trim();

  return (
    <section className="overflow-hidden rounded-3xl border border-border/60 bg-card/80 shadow-md transition-all duration-300 hover:border-primary/20 hover:shadow-lg">
      <div className="border-b border-border/50 bg-muted/15 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/8 text-emerald-600 dark:bg-emerald-500/12 dark:text-emerald-300">
            <CheckCircle2 size={21} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground/80">
              Decisão final
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-tight text-foreground">
              Critério final de avaliação
            </h2>

            <p className="mt-1.5 text-xs font-semibold leading-relaxed text-muted-foreground">
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