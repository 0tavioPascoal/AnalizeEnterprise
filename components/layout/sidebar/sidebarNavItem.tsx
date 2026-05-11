"use client";

import Link from "next/link";

import { cn } from "@/lib/supabase/utils";

interface SidebarNavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  active: boolean;
}

export function SidebarNavItem({
  href,
  icon,
  label,
  collapsed,
  active,
}: SidebarNavItemProps) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={cn(
        "group flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-bold transition-all",
        active
          ? "bg-indigo-50 text-indigo-700 shadow-sm dark:bg-indigo-500/10 dark:text-indigo-300"
          : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white",
        collapsed && "justify-center px-0",
      )}
    >
      <span className="shrink-0">{icon}</span>

      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );
}
