import { cn } from "@/lib/utils";
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
        "box-border flex h-full w-full flex-col gap-6 overflow-hidden bg-transparent p-6",
        className,
      )}
    >
      <div className="shrink-0">
        {header}
      </div>

      {filters && (
        <div className="shrink-0 border-b border-border pb-4">
          <div className="w-full">{filters}</div>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div
          className={cn(
            "h-full w-full animate-in fade-in slide-in-from-bottom-2 duration-500",
            contentClassName,
          )}
        >
          {children}
        </div>
      </div>

      {pagination && (
        <div className="shrink-0 border-t border-border pt-4">
          {pagination}
        </div>
      )}
    </div>
  );
}