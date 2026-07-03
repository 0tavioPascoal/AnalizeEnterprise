"use client";

import type { FilterSelectProps } from "@/types/layout/filters/filterSelect";

export function FilterSelect({
  value,
  onChange,
  options,
  ariaLabel,
}: FilterSelectProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label={ariaLabel}
      className="
        h-10 w-full min-w-0 rounded-xl sm:h-11
        border border-border

        bg-card
        px-4

        text-sm
        font-bold
        text-foreground

        shadow-sm
        outline-none
        transition-all

        hover:border-primary/30

        focus:border-primary/40
        focus:ring-2
        focus:ring-primary/20

        sm:w-auto sm:min-w-40 xl:min-w-44
      "
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
