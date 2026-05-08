"use client";

import { useState, useTransition } from "react";

import { ChevronLeft, ChevronDown, Settings } from "lucide-react";

import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

import { logout } from "@/actions/auth/logout";

import { SidebarBrand } from "./SidebarBrand";
import { SidebarFooter } from "./SidebarFooter";
import { SidebarNavItem } from "./sidebarNavItem";
import { SidebarSection } from "./SidebarSection";

import { mainItems, managementItems, settingsItems } from "./sidebarConfig";

import type { SidebarUser } from "@/types/layout/sidebar/sidebar";

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
        "relative flex h-screen flex-col border-r bg-zinc-50/50 backdrop-blur-xl transition-all duration-300 dark:bg-zinc-950/50",
        collapsed ? "w-17.5" : "w-64",
      )}
    >
      <button
        type="button"
        onClick={() => setCollapsed((value) => !value)}
        className="absolute -right-3 top-12 z-50 rounded-full border bg-background p-1 shadow-md transition-all hover:bg-muted"
      >
        <ChevronLeft
          className={cn(
            "h-5 w-5 transition-transform duration-300 ease-in-out",
            collapsed && "rotate-180",
          )}
        />
      </button>

      <SidebarBrand collapsed={collapsed} />

      <nav className="mt-4 flex-1 space-y-6 px-3">
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
              "group flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium transition-all",
              "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white",
              collapsed && "justify-center px-0",
            )}
          >
            <Settings size={20} />

            {!collapsed && (
              <>
                <span className="flex-1 text-left">Configurações</span>

                <ChevronDown
                  size={16}
                  className={cn(
                    "transition-transform",
                    settingsOpen && "rotate-180",
                  )}
                />
              </>
            )}
          </button>

          {!collapsed && settingsOpen && (
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
          )}
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
