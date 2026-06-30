"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/supabase/utils";

import type { SearchInputProps } from "@/types/layout/filters/searchInputProps";

export function SearchInput({
  value,
  onChange,
  placeholder = "Buscar...",
  className,
}: SearchInputProps) {
  return (
    <div className={cn("relative w-full sm:w-80", className)}>
      <Search
        className="
          pointer-events-none

          absolute left-4 top-1/2
          h-4 w-4
          -translate-y-1/2

          text-muted-foreground
        "
      />

      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="
          h-11 w-full rounded-xl

          border-border
          bg-card

          pl-11 pr-4

          text-sm
          font-medium
          text-foreground

          shadow-sm
          transition-all

          placeholder:text-muted-foreground

          hover:border-primary/20

          focus-visible:border-primary/30
          focus-visible:ring-2
          focus-visible:ring-primary/30
        "
      />
    </div>
  );
}
