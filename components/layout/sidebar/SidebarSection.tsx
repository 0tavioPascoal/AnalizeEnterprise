"use client";

import { cn } from "@/lib/supabase/utils";

interface SidebarSectionProps {
  title: string;
  collapsed: boolean;
  children: React.ReactNode;
}

export function SidebarSection({
  title,
  collapsed,
  children,
}: SidebarSectionProps) {
  return (
    <div className="space-y-2">
      <p
        className={cn(
          "px-3 text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground/70",
          collapsed && "text-center",
        )}
      >
        {collapsed ? "•••" : title}
      </p>

      <div className="space-y-1">{children}</div>
    </div>
  );
}
