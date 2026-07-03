"use client";

import { useEffect, useState, useTransition } from "react";
import { ChevronDown, ChevronLeft, Menu, Settings, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { logout } from "@/features/auth/server/logout";

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
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setCollapsed(
        window.localStorage.getItem("dashboard-sidebar-collapsed") === "true",
      );
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  function handleCollapsedChange(): void {
    setCollapsed((value) => {
      const nextValue = !value;

      window.localStorage.setItem(
        "dashboard-sidebar-collapsed",
        String(nextValue),
      );

      return nextValue;
    });
  }

  function handleLogout(): void {
    startTransition(async () => {
      await logout();
      router.push("/login");
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-background/90 shadow-sm backdrop-blur-xl md:hidden"
        aria-label="Abrir menu"
      >
        <Menu size={21} />
      </button>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/45 md:hidden"
          aria-label="Fechar menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-dvh w-64 shrink-0 flex-col overflow-hidden border-r border-sidebar-border/70 bg-sidebar/95 text-sidebar-foreground shadow-xl shadow-black/5 backdrop-blur-xl",
          "transition-[transform,width] duration-300 ease-out md:relative md:z-auto md:translate-x-0 md:bg-sidebar/90 md:shadow-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          collapsed ? "md:w-18" : "md:w-64",
        )}
      >
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-3 z-50 flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-background/90 shadow-sm backdrop-blur-xl md:hidden"
          aria-label="Fechar menu"
        >
          <X size={19} />
        </button>

        <button
          type="button"
          onClick={handleCollapsedChange}
          className="absolute -right-3 top-12 z-50 hidden h-7 w-7 items-center justify-center rounded-full border border-border/60 bg-background/95 shadow-md backdrop-blur transition-all duration-200 hover:scale-105 hover:bg-muted active:scale-95 md:flex"
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

        <nav className="custom-scrollbar mt-3 min-h-0 flex-1 space-y-5 overflow-y-auto px-3 pb-4">
          <SidebarSection title="Menu Principal" collapsed={collapsed}>
            {mainItems.map((item) => (
              <SidebarNavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                description={item.description}
                badge={item.badge}
                featured={item.featured}
                collapsed={collapsed}
                active={item.active(pathname)}
                onNavigate={() => setMobileOpen(false)}
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
                description={item.description}
                badge={item.badge}
                featured={item.featured}
                collapsed={collapsed}
                active={item.active(pathname)}
                onNavigate={() => setMobileOpen(false)}
              />
            ))}
          </SidebarSection>

          <SidebarSection title="Configurações" collapsed={collapsed}>
            <button
              type="button"
              onClick={() => {
                if (!collapsed) {
                  setSettingsOpen((value) => !value);
                }
              }}
              title={collapsed ? "Configurações" : undefined}
              className={cn(
                "group flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-bold transition-all duration-200",
                "text-sidebar-foreground/65 hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground",
                collapsed && "justify-center px-0",
              )}
              aria-label="Configurações"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center transition-transform duration-200 group-hover:scale-105">
                <Settings size={20} />
              </span>

              <span
                className={cn(
                  "min-w-0 truncate transition-all duration-200",
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
                    "ml-auto shrink-0 transition-transform duration-300",
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
                <div className="ml-4 mt-1 space-y-1 border-l border-sidebar-border/70 pl-3">
                  {settingsItems.map((item) => (
                    <SidebarNavItem
                      key={item.href}
                      href={item.href}
                      icon={item.icon}
                      label={item.label}
                      description={item.description}
                      badge={item.badge}
                      featured={item.featured}
                      collapsed={false}
                      active={item.active(pathname)}
                      onNavigate={() => setMobileOpen(false)}
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
    </>
  );
}
