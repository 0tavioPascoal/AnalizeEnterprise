"use client";

import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/supabase/utils";
import type { RowItemProps } from "@/types/layout/rowItemProps";

export function RowItem({
  left,
  right,
  children,
  onClick,
  asChild = false,
  className,
  contentClassName,
}: RowItemProps) {
  const Comp = asChild ? Slot : "div";
  const isClickable = Boolean(onClick || asChild);

  return (
    <Comp
      onClick={onClick}
      className={cn(
        "group flex w-full flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-all sm:flex-row sm:items-center sm:justify-between sm:p-5",
        "hover:border-primary/20 hover:bg-muted/40",
        isClickable && "cursor-pointer active:scale-[0.995]",
        className,
      )}
    >
      {children ? (
        children
      ) : (
        <>
          <div className={cn("min-w-0 flex-1", contentClassName)}>{left}</div>

          {right && (
            <div className="flex w-full shrink-0 items-center justify-end border-t border-border/70 pt-3 sm:w-auto sm:border-t-0 sm:pt-0">
              {right}
            </div>
          )}
        </>
      )}
    </Comp>
  );
}
