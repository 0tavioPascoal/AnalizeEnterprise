import { cn } from "@/lib/supabase/utils";
import type { FilterBarProps } from "@/types/layout/filters/filterBarProps";

export function FilterBar({ children, className }: FilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center",
        className,
      )}
    >
      {children}
    </div>
  );
}
