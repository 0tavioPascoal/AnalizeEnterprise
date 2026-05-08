"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

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
        "group flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium transition-all",
        active
          ? "text-zinc-900 dark:text-white"
          : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white",
        collapsed && "justify-center px-0",
      )}
    >
      <span className="shrink-0">{icon}</span>

      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );
}