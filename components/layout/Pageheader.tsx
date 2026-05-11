import { cn } from "@/lib/supabase/utils";
import { PageHeaderProps } from "@/types/layout/pageHeaderProps";

export function PageHeader({
  title,
  description,
  action,
  icon: Icon,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-4">
          {Icon && (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/10 bg-primary/10 text-primary shadow-sm">
              <Icon size={24} />
            </div>
          )}

          <div className="min-w-0">
            <h1 className="truncate text-3xl font-black tracking-tight text-foreground">
              {title}
            </h1>

            {description && (
              <p className="mt-1 text-base leading-relaxed text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      {action && (
        <div className="flex flex-wrap items-center gap-3">{action}</div>
      )}
    </div>
  );
}
