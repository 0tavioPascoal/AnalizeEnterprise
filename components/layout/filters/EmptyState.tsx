import type { EmptyStateProps } from "@/types/layout/filters/emptyStateProps";

export function EmptyState({
  icon: Icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex h-48 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/60 px-6 text-center shadow-sm">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <Icon size={24} />
      </div>

      <p className="text-base font-bold text-foreground">
        {title}
      </p>

      {description && (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}