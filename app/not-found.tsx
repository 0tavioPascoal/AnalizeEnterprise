import Link from "next/link";

import {
  ArrowLeft,
  FileSearch,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div
      className="
        relative flex min-h-screen items-center justify-center
        overflow-hidden

        bg-linear-to-b
        from-background
        via-background
        to-muted/40

        px-6
      "
    >
      {/* BACKGROUND GLOW */}
      <div
        className="
          absolute inset-0
          bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.12),transparent_45%)]
        "
      />

      <div
        className="
          relative z-10

          w-full max-w-lg

          rounded-3xl
          border border-border/60

          bg-card/80
          backdrop-blur-xl

          p-10

          shadow-2xl
          shadow-black/5
        "
      >
        {/* ICON */}
        <div
          className="
            mx-auto mb-6

            flex h-20 w-20 items-center justify-center

            rounded-3xl

            border border-indigo-500/20
            bg-indigo-500/10

            text-indigo-600
            dark:text-indigo-400
          "
        >
          <FileSearch size={38} />
        </div>

        {/* BADGE */}
        <div className="mb-5 flex justify-center">
          <div
            className="
              inline-flex items-center gap-2

              rounded-full
              border border-indigo-500/20

              bg-indigo-500/10

              px-4 py-1.5

              text-[10px]
              font-black
              uppercase
              tracking-[0.22em]

              text-indigo-600
              dark:text-indigo-300
            "
          >
            <Sparkles size={12} />
            RH Analyzer
          </div>
        </div>

        {/* CONTENT */}
        <div className="text-center">
          <h1
            className="
              bg-linear-to-r
              from-zinc-900
              to-zinc-500

              bg-clip-text

              text-7xl
              font-black
              tracking-tight

              text-transparent

              dark:from-white
              dark:to-zinc-500
            "
          >
            404
          </h1>

          <h2
            className="
              mt-4

              text-2xl
              font-bold
              tracking-tight

              text-foreground
            "
          >
            Página não encontrada
          </h2>

          <p
            className="
              mx-auto mt-4 max-w-sm

              text-sm
              leading-relaxed

              text-muted-foreground
            "
          >
            O recurso que você tentou acessar não existe,
            foi movido ou não está mais disponível.
          </p>
        </div>

        {/* ACTIONS */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            className="
              h-11 flex-1 rounded-xl

              bg-primary

              text-[11px]
              font-black
              uppercase
              tracking-widest

              shadow-lg
              shadow-primary/20

              transition-all
              hover:scale-[1.01]
              hover:bg-primary/90
            "
          >
            <Link href="/dashboard">
              <ArrowLeft size={16} className="mr-2" />
              Voltar ao Dashboard
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="
              h-11 flex-1 rounded-xl

              border-border
              bg-background/60

              text-[11px]
              font-black
              uppercase
              tracking-widest

              backdrop-blur-sm
            "
          >
            <Link href="/dashboard/analyze">
              Nova análise
            </Link>
          </Button>
        </div>

        {/* FOOTER */}
        <div
          className="
            mt-8 border-t border-border/60 pt-5 text-center
          "
        >
          <p
            className="
              text-[11px]
              font-medium
              text-muted-foreground
            "
          >
            RH Analyzer Enterprise • Smart Hiring Platform
          </p>
        </div>
      </div>
    </div>
  );
}