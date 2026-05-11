"use client";

import { Sparkles } from "lucide-react";

import { cn } from "@/lib/supabase/utils";

interface SidebarBrandProps {
  collapsed: boolean;
}

export function SidebarBrand({ collapsed }: SidebarBrandProps) {
  return (
    <div
      className={cn(
        "flex h-20 shrink-0 items-center border-b border-zinc-200/80 px-6 dark:border-zinc-800",
        collapsed ? "justify-center" : "justify-start",
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/20">
          <Sparkles className="h-5 w-5 text-white" />
        </div>

        {!collapsed && (
          <span
            className={cn(
              "bg-linear-to-r from-zinc-900 to-zinc-500 bg-clip-text text-2xl font-black tracking-tight text-transparent transition-opacity duration-200 dark:from-white dark:to-zinc-400",
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
