"use client";

import { useState, useTransition } from "react";
import { ChevronLeft, ChevronDown, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { logout } from "@/actions/auth/logout";

import { SidebarBrand } from "./SidebarBrand";
import { SidebarFooter } from "./SidebarFooter";
import { SidebarNavItem } from "./sidebarNavItem";
import { SidebarSection } from "./SidebarSection";

import { mainItems, managementItems, settingsItems } from "./sidebarConfig";

import type { SidebarUser } from "@/types/layout/sidebar/sidebar";
import { cn } from "@/lib/supabase/utils";

interface SidebarProps {
  user: SidebarUser;
}

export function Sidebar({ user }: SidebarProps) {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(true);
  const [isPending, startTransition] = useTransition();

  const pathname = usePathname();
  const router = useRouter();

  function handleLogout(): void {
    startTransition(async () => {
      await logout();
      router.push("/login");
      router.refresh();
    });
  }

  return (
    <aside
      className={cn(
        "relative flex h-screen shrink-0 flex-col overflow-hidden border-r bg-zinc-50/50 backdrop-blur-xl",
        "transition-[width] duration-300 ease-in-out dark:bg-zinc-950/50",
        collapsed ? "w-18" : "w-64",
      )}
    >
      <button
        type="button"
        onClick={() => setCollapsed((value) => !value)}
        className="absolute -right-3 top-12 z-50 flex h-7 w-7 items-center justify-center rounded-full border bg-background shadow-md transition-all duration-200 hover:scale-105 hover:bg-muted active:scale-95"
        aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
      >
        <ChevronLeft
          className={cn(
            "h-5 w-5 transition-transform duration-300 ease-in-out",
            collapsed && "rotate-180",
          )}
        />
      </button>

      <SidebarBrand collapsed={collapsed} />

      <nav className="mt-4 min-h-0 flex-1 space-y-6 overflow-hidden px-3">
        <SidebarSection title="Menu Principal" collapsed={collapsed}>
          {mainItems.map((item) => (
            <SidebarNavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              collapsed={collapsed}
              active={item.active(pathname)}
            />
          ))}
        </SidebarSection>

        <SidebarSection title="Gerenciamento" collapsed={collapsed}>
          {managementItems.map((item) => (
            <SidebarNavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              collapsed={collapsed}
              active={item.active(pathname)}
            />
          ))}

          <button
            type="button"
            onClick={() => setSettingsOpen((value) => !value)}
            className={cn(
              "group flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-bold transition-all duration-200",
              "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white",
              collapsed && "justify-center px-0",
            )}
          >
            <Settings size={20} className="shrink-0" />

            <span
              className={cn(
                "min-w-0 flex-1 text-left transition-all duration-200",
                collapsed
                  ? "pointer-events-none w-0 translate-x-2 overflow-hidden opacity-0"
                  : "w-auto translate-x-0 opacity-100",
              )}
            >
              Configurações
            </span>

            {!collapsed && (
              <ChevronDown
                size={17}
                className={cn(
                  "shrink-0 transition-transform duration-300",
                  settingsOpen && "rotate-180",
                )}
              />
            )}
          </button>

          <div
            className={cn(
              "grid transition-all duration-300 ease-in-out",
              !collapsed && settingsOpen
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0",
            )}
          >
            <div className="overflow-hidden">
              <div className="ml-4 mt-1 space-y-1 border-l border-zinc-200 pl-3 dark:border-zinc-800">
                {settingsItems.map((item) => (
                  <SidebarNavItem
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    collapsed={false}
                    active={item.active(pathname)}
                  />
                ))}
              </div>
            </div>
          </div>
        </SidebarSection>
      </nav>

      <SidebarFooter
        user={user}
        collapsed={collapsed}
        isPending={isPending}
        onLogout={handleLogout}
      />
    </aside>
  );
}