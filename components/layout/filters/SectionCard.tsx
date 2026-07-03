import { cn } from "@/lib/supabase/utils";
import type { SectionCardProps } from "@/types/layout/filters/sectionCardProps";

export function SectionCard({ children, className }: SectionCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5 shadow-sm sm:p-7",
        className,
      )}
    >
      {children}
    </div>
  );
}
