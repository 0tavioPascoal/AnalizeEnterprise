"use client";

import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
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
        "group flex w-full items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all",
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
            <div className="flex shrink-0 items-center justify-end">
              {right}
            </div>
          )}
        </>
      )}
    </Comp>
  );
}