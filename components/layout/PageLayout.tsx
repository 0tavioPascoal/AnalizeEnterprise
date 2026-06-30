import { cn } from "@/lib/supabase/utils";
import { PageLayoutProps } from "@/types/layout/pageLayoutProps";

export function PageLayout({
  header,
  filters,
  children,
  pagination,
  className,
  contentClassName,
}: PageLayoutProps) {
  return (
    <div
      className={cn(
        "box-border flex h-full w-full flex-col gap-4 overflow-hidden bg-transparent p-4 pt-18 sm:gap-5 md:gap-6 md:p-6 md:pt-6",
        className,
      )}
    >
      <div className="shrink-0 rounded-2xl border border-border/70 bg-background/70 p-4 shadow-sm backdrop-blur-sm md:p-5">
        {header}
      </div>

      {filters && (
        <div className="shrink-0 border-b border-border pb-4">
          <div className="w-full">{filters}</div>
        </div>
      )}

      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-0 md:pr-1">
        <div
          className={cn(
            "min-h-full w-full animate-in fade-in slide-in-from-bottom-2 duration-500",
            contentClassName,
          )}
        >
          {children}
        </div>
      </div>

      {pagination && (
        <div className="shrink-0 rounded-2xl border border-border/70 bg-background/70 p-3 shadow-sm backdrop-blur-sm">
          {pagination}
        </div>
      )}
    </div>
  );
}
