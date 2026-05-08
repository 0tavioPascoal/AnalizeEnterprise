"use client";

import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

interface SidebarBrandProps {
  collapsed: boolean;
}

export function SidebarBrand({ collapsed }: SidebarBrandProps) {
  return (
    <div
      className={cn(
        "flex h-20 items-center px-6",
        collapsed ? "justify-center" : "justify-start",
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 shadow-lg shadow-indigo-500/20">
          <Sparkles className="h-5 w-5 text-white" />
        </div>

        {!collapsed && (
          <span
            className={cn(
              "bg-linear-to-r from-zinc-900 to-zinc-500 bg-clip-text text-xl font-bold tracking-tight text-transparent transition-opacity duration-200 dark:from-white dark:to-zinc-400",
              collapsed ? "pointer-events-none opacity-0" : "opacity-100",
            )}
          >
            Analyzer
          </span>
        )}
      </div>
    </div>
  );
}
