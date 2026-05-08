"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { SearchInputProps } from "@/types/layout/filters/searchInputProps";


export function SearchInput({
  value,
  onChange,
  placeholder = "Buscar...",
  className,
}: SearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-xl border-border bg-card pl-9 pr-3 text-sm shadow-sm transition-all placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/30 sm:w-72"
      />
    </div>
  );
}