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
    <div className="flex justify-center items-center gap-2 mt-6">
      {Array.from({ length: totalPages }).map((_, i) => {
        const p = i + 1;

        return (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`h-9 w-9 rounded-md text-sm transition
              ${
                page === p
                  ? "bg-primary text-white"
                  : "hover:bg-muted"
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
