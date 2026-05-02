"use client";

interface Props {
  page: number;
  totalPages: number;
  setPage: (page: number) => void; // 👈 IMPORTANTE
}

export function TablePagination({
  page,
  totalPages,
  setPage,
}: Props) {
  return (
    <div className="flex items-center justify-center gap-2">
      
      {/* PREV */}
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="px-3 py-1 text-sm border rounded-md disabled:opacity-50"
      >
        ←
      </button>

      {/* PÁGINAS */}
      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }).map((_, i) => {
          const p = i + 1;

          return (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 text-sm rounded-md ${
                p === page
                  ? "bg-primary text-white"
                  : "border hover:bg-muted"
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* NEXT */}
      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className="px-3 py-1 text-sm border rounded-md disabled:opacity-50"
      >
        →
      </button>
    </div>
  );
}
