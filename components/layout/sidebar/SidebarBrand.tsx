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
        "flex h-18 shrink-0 items-center border-b border-sidebar-border px-5",
        collapsed ? "justify-center" : "justify-start",
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-primary/20">
          <Sparkles className="h-5 w-5" />
        </div>

        {!collapsed && (
          <span
            className={cn(
              "text-2xl font-black tracking-tight text-sidebar-foreground transition-opacity duration-200",
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
