"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/supabase/utils";

interface TablePaginationProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

export function TablePagination({
  page,
  totalPages,
  setPage,
}: TablePaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = generatePages(page, totalPages);

  return (
    <div className="flex items-center justify-center gap-2">
      <PaginationButton
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        ariaLabel="Página anterior"
      >
        <ChevronLeft size={18} />
      </PaginationButton>

      <div className="flex items-center gap-1.5">
        {pages.map((item, index) => {
          if (item === "...") {
            return (
              <div
                key={`ellipsis-${index}`}
                className="flex h-10 min-w-10 items-center justify-center px-1 text-base font-bold text-muted-foreground"
              >
                ...
              </div>
            );
          }

          const isActive = item === page;

          return (
            <button
              key={item}
              type="button"
              onClick={() => setPage(item)}
              className={cn(
                "flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-bold transition-all",
                isActive
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-background text-foreground hover:bg-muted",
              )}
            >
              {item}
            </button>
          );
        })}
      </div>

      <PaginationButton
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        ariaLabel="Próxima página"
      >
        <ChevronRight size={18} />
      </PaginationButton>
    </div>
  );
}

interface PaginationButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
  ariaLabel: string;
}

function PaginationButton({
  children,
  disabled,
  onClick,
  ariaLabel,
}: PaginationButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-foreground transition-all",
        "hover:bg-muted",
        "disabled:pointer-events-none disabled:opacity-40",
      )}
    >
      {children}
    </button>
  );
}

function generatePages(
  currentPage: number,
  totalPages: number,
): Array<number | "..."> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: Array<number | "..."> = [];

  pages.push(1);

  if (currentPage > 3) {
    pages.push("...");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) {
    pages.push("...");
  }

  pages.push(totalPages);

  return pages;
}
