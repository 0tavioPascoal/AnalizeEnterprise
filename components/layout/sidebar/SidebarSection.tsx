"use client";

import { cn } from "@/lib/utils";

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
    <div className="space-y-1.5">
      <p
        className={cn(
          "mb-4 px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400",
          collapsed && "text-center",
        )}
      >
        {collapsed ? "•••" : title}
      </p>

      {children}
    </div>
  );
}