import { cn } from "@/lib/supabase/utils";
import type { FilterBarProps } from "@/types/layout/filters/filterBarProps";

export function FilterBar({ children, className }: FilterBarProps) {
  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end",
        className,
      )}
    >
      {children}
    </div>
  );
}
