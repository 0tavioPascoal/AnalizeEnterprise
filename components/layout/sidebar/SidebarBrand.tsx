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
        "flex h-18 shrink-0 items-center border-b border-sidebar-border/80 px-4",
        collapsed ? "justify-center" : "justify-start",
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-primary/20 ring-1 ring-sidebar-primary/20">
          <Sparkles className="h-5 w-5" />
        </div>

        {!collapsed && (
          <div
            className={cn(
              "min-w-0 transition-opacity duration-200",
              collapsed ? "pointer-events-none opacity-0" : "opacity-100",
            )}
          >
            <span className="block truncate text-xl font-black tracking-tight text-sidebar-foreground">
              Analyzer
            </span>

            <span className="block truncate text-[11px] font-bold uppercase tracking-[0.2em] text-sidebar-primary">
              Enterprise AI
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
