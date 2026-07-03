import type { EmptyStateProps } from "@/types/layout/filters/emptyStateProps";

export function EmptyState({
  icon: Icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/70 px-5 py-8 text-center shadow-sm">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
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
