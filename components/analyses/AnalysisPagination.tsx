"use client";

interface Props {
  page: number;
  totalPages: number;
  setPage: (p: number) => void;
}

export function AnalysisPagination({
  page,
  totalPages,
  setPage,
}: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      {Array.from({ length: totalPages }).map((_, i) => {
        const p = i + 1;

        return (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`
              flex h-10 w-10 items-center justify-center
              rounded-xl
              text-sm font-bold
              transition-all

              ${
                page === p
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : `
                    border border-border
                    bg-card
                    text-muted-foreground

                    hover:bg-muted
                    hover:text-foreground
                  `
              }
            `}
          >
            {p}
          </button>
        );
      })}
    </div>
  );
}