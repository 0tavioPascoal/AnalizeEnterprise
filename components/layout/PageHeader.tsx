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
        "flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-3 sm:items-center sm:gap-4">
          {Icon && (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary shadow-sm sm:h-12 sm:w-12">
              <Icon size={24} />
            </div>
          )}

          <div className="min-w-0">
            <h1 className="break-words text-2xl font-black text-foreground md:text-3xl">
              {title}
            </h1>

            {description && (
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground md:text-base">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      {action && (
        <div className="flex w-full min-w-0 flex-wrap items-center gap-3 lg:w-auto lg:justify-end">
          {action}
        </div>
      )}
    </div>
  );
}
