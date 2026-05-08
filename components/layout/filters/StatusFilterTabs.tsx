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
          className="h-8 rounded-lg px-3 text-xs"
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}