import { cn } from "@/lib/supabase/utils";
import type { SectionCardProps } from "@/types/layout/filters/sectionCardProps";

export function SectionCard({ children, className }: SectionCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-7 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
