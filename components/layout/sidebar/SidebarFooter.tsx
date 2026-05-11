"use client";

import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

import { cn } from "@/lib/supabase/utils";

import type { SidebarUser } from "@/types/layout/sidebar/sidebar";

interface SidebarFooterProps {
  user: SidebarUser;
  collapsed: boolean;
  isPending: boolean;
  onLogout: () => void;
}

export function SidebarFooter({
  user,
  collapsed,
  isPending,
  onLogout,
}: SidebarFooterProps) {
  const displayName = user.name ?? "Usuário";
  const displayEmail = user.email ?? "E-mail não informado";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="mt-auto flex flex-col gap-2 p-3">
      <ThemeToggle collapsed={collapsed} />

      <div
        className={cn(
          "flex items-center gap-2 rounded-xl border bg-white/50 p-2 transition-all dark:bg-zinc-900/50",
          collapsed ? "justify-center" : "px-3",
        )}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white">
          {initial}
        </div>

        {!collapsed && (
          <>
            <div className="min-w-0 flex-1">
              <p className="mb-1 truncate text-sm font-semibold leading-none">
                {displayName}
              </p>

              <p className="truncate text-xs leading-none text-muted-foreground">
                {displayEmail}
              </p>

              {user.company_name && (
                <p className="mt-1 truncate text-[11px] font-bold uppercase tracking-wider text-indigo-500">
                  {user.company_name}
                </p>
              )}
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
              onClick={onLogout}
              disabled={isPending}
            >
              <LogOut size={16} />
            </Button>
          </>
        )}
      </div>

      {collapsed && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-10 w-full transition-colors hover:bg-red-50 hover:text-red-600"
          onClick={onLogout}
          disabled={isPending}
        >
          <LogOut size={18} />
        </Button>
      )}
    </div>
  );
}
