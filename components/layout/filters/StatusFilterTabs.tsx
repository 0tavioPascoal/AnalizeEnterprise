"use client";

import { Button } from "@/components/ui/button";

import type { StatusFilterTabsProps } from "@/types/layout/filters/statusFilterProps";

export function StatusFilterTabs<T extends string>({
  value,
  options,
  onChange,
}: StatusFilterTabsProps<T>) {
  return (
    <div className="flex rounded-xl border border-border bg-card p-1 shadow-sm">
      {options.map((option) => (
        <Button
          key={option.value}
          type="button"
          variant={value === option.value ? "default" : "ghost"}
          size="sm"
          onClick={() => onChange(option.value)}
          className="
            h-9 rounded-lg px-4

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