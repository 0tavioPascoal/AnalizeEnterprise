import { Target } from "lucide-react";

export interface InterviewObjectiveCardProps {
  objective?: string;
}

export function InterviewObjectiveCard({
  objective,
}: InterviewObjectiveCardProps) {
  return (
    <section
      className="
        rounded-xl
        border border-zinc-200/80

        bg-white
        p-6

        shadow-lg shadow-zinc-900/3

        dark:border-zinc-800
        dark:bg-zinc-900/90
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
          <Target size={18} />
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
            Objetivo da Entrevista
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
            {objective ??
              "Objetivo da entrevista não disponível."}
          </p>
        </div>
      </div>
    </section>
  );
}
