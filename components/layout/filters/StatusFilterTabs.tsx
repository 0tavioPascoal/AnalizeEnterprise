"use client";

import { Button } from "@/components/ui/button";

import type { StatusFilterTabsProps } from "@/types/layout/filters/statusFilterProps";

export function StatusFilterTabs<T extends string>({
  value,
  options,
  onChange,
}: StatusFilterTabsProps<T>) {
  return (
    <div className="flex w-full overflow-x-auto rounded-xl border border-border bg-card p-1 shadow-sm sm:w-auto">
      {options.map((option) => (
        <Button
          key={option.value}
          type="button"
          variant={value === option.value ? "default" : "ghost"}
          size="sm"
          onClick={() => onChange(option.value)}
          className="
            h-9 min-w-max flex-1 rounded-lg px-3 sm:flex-none sm:px-4

            text-sm
            font-bold

            transition-all
          "
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
