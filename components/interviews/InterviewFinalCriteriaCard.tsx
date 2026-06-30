import { CheckCircle2 } from "lucide-react";

interface InterviewFinalCriteriaCardProps {
  text?: string;
}

export function InterviewFinalCriteriaCard({
  text,
}: InterviewFinalCriteriaCardProps) {
  return (
    <section
      className="
    rounded-xl
    border border-emerald-500/10

    bg-emerald-500/4.5
    p-6

    shadow-lg shadow-zinc-900/3

    dark:border-emerald-500/10
    dark:bg-emerald-500/6
  "
    >
      <div className="flex items-start gap-4">
        {/* ICON */}
        <div
          className="
            flex h-11 w-11 shrink-0
            items-center justify-center

            rounded-xl

            bg-violet-500/8

            text-violet-600

            dark:bg-violet-500/12
            dark:text-violet-300
          "
        >
          <CheckCircle2 size={18} />
        </div>

        {/* CONTENT */}
        <div className="min-w-0 flex-1">
          {/* TITLE */}
          <p
            className="
              text-xl font-black
              tracking-tight

              text-zinc-900
              dark:text-zinc-100
            "
          >
            Critério Final
          </p>

          {/* SUBTITLE */}
          <p
            className="
              mt-1 text-sm

              text-zinc-500
              dark:text-zinc-400
            "
          >
            Como decidir após a entrevista
          </p>

          {/* TEXT */}
          <p
            className="
              mt-3

              text-[16px]
              leading-8

              text-zinc-700
              dark:text-zinc-300
            "
          >
            {text ?? "Critério final não disponível."}
          </p>
        </div>
      </div>
    </section>
  );
}
