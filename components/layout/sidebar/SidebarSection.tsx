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
    <div className="space-y-2.5">
      <p
        className={cn(
          "px-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/65",
          collapsed && "text-center",
        )}
      >
        {collapsed ? "•••" : title}
      </p>

      <div className="space-y-1.5">{children}</div>
    </div>
  );
}
