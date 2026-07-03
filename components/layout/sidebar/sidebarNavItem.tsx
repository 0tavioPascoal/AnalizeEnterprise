"use client";

import { cn } from "@/lib/supabase/utils";
import Link from "next/link";

interface SidebarNavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  description?: string;
  badge?: string;
  featured?: boolean;
  collapsed: boolean;
  active: boolean;
  onNavigate?: () => void;
}

export function SidebarNavItem({
  href,
  icon,
  label,
  description,
  badge,
  featured = false,
  collapsed,
  active,
  onNavigate,
}: SidebarNavItemProps) {
  if (featured && !collapsed) {
    return (
      <Link
        href={href}
        onClick={onNavigate}
        className={cn(
          "group relative flex w-full overflow-hidden rounded-2xl border p-3 text-left outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/30 active:scale-[0.99]",
          active
            ? "border-sidebar-primary/30 bg-sidebar-primary text-sidebar-primary-foreground shadow-md shadow-primary/15"
            : "border-sidebar-primary/20 bg-sidebar-primary/10 text-sidebar-foreground shadow-sm hover:border-sidebar-primary/35 hover:bg-sidebar-primary/15",
        )}
      >
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-transform duration-200 group-hover:scale-105",
            active
              ? "border-white/20 bg-white/15 text-sidebar-primary-foreground"
              : "border-sidebar-primary/15 bg-sidebar-primary text-sidebar-primary-foreground",
          )}
        >
          {icon}
        </div>

        <div className="ml-3 min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-sm font-black">{label}</span>

            {badge && (
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black uppercase",
                  active
                    ? "bg-white/20 text-sidebar-primary-foreground"
                    : "bg-sidebar-primary/15 text-sidebar-primary",
                )}
              >
                {badge}
              </span>
            )}
          </div>

          {description && (
            <p
              className={cn(
                "mt-1 truncate text-xs font-semibold",
                active
                  ? "text-sidebar-primary-foreground/75"
                  : "text-sidebar-foreground/55",
              )}
            >
              {description}
            </p>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      className={cn(
        "group relative flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-bold outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/30 active:scale-[0.99]",
        active
          ? "bg-sidebar-primary/10 text-sidebar-primary shadow-sm"
          : "text-sidebar-foreground/65 hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground",
        featured &&
          "border border-sidebar-primary/20 bg-sidebar-primary/10 text-sidebar-primary hover:bg-sidebar-primary/15",
        collapsed && "justify-center px-0",
      )}
    >
      <span
        className={cn(
          "absolute left-1 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-sidebar-primary opacity-0 transition-opacity duration-200",
          active && !collapsed && "opacity-100",
        )}
      />

      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center transition-transform duration-200 group-hover:scale-105",
          featured &&
            collapsed &&
            "rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm shadow-primary/20",
        )}
      >
        {icon}
      </span>

      <span
        className={cn(
          "min-w-0 truncate transition-all duration-200",
          collapsed
            ? "pointer-events-none w-0 translate-x-2 overflow-hidden opacity-0"
            : "w-auto translate-x-0 opacity-100 group-hover:translate-x-0.5",
        )}
      >
        {label}
      </span>
    </Link>
  );
}
