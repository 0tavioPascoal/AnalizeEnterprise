"use client";

import { cn } from "@/lib/supabase/utils";
import Link from "next/link";


interface SidebarNavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  active: boolean;
  onNavigate?: () => void;
}

export function SidebarNavItem({
  href,
  icon,
  label,
  collapsed,
  active,
  onNavigate,
}: SidebarNavItemProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      className={cn(
        "group flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-bold outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/30",
        active
          ? "bg-indigo-50 text-indigo-700 shadow-sm dark:bg-indigo-500/10 dark:text-indigo-300"
          : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white",
        collapsed && "justify-center px-0",
      )}
    >
      <span className="shrink-0 transition-transform duration-200 group-hover:scale-105">
        {icon}
      </span>

      <span
        className={cn(
          "min-w-0 truncate transition-all duration-200",
          collapsed
            ? "pointer-events-none w-0 translate-x-2 overflow-hidden opacity-0"
            : "w-auto translate-x-0 opacity-100",
        )}
      >
        {label}
      </span>
    </Link>
  );
}
