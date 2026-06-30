import Link from "next/link";

import { ExternalLink, Sparkles } from "lucide-react";

interface InterviewSummaryCardProps {
  summary?: string;
  analysisId?: string;
}

export function InterviewSummaryCard({
  summary,
  analysisId,
}: InterviewSummaryCardProps) {
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
          <Sparkles size={18} />
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
            Resumo do Candidato (IA)
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
            {summary ??
              "Resumo do candidato não disponível."}
          </p>

          {/* ACTION */}
          {analysisId && (
            <div className="mt-5">
              <Link
                href={`/dashboard/analyses/${analysisId}`}
                className="
                  inline-flex items-center gap-2

                  rounded-full

                  bg-violet-500/8
                  px-4 py-2

                  text-sm font-black

                  text-violet-700

                  transition-all

                  hover:bg-violet-500/12

                  dark:bg-violet-500/12
                  dark:text-violet-300
                  dark:hover:bg-violet-500/18
                "
              >
                Ver análise completa

                <ExternalLink size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
