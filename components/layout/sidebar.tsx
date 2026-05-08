"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Briefcase,
  Brain,
  ClipboardList,
  Users,
  ChevronLeft,
  ChevronDown,
  Sparkles,
  GitMerge,
  Settings,
  Mail,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { logout } from "@/actions/auth/logout";

export interface SidebarUser {
  name: string | null;
  email: string | null;
  role: string | null;
  company_name: string | null;
}

interface SidebarProps {
  user: SidebarUser;
}

export function Sidebar({ user }: SidebarProps) {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(true);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const pathname = usePathname();

  const displayName = user.name ?? "Usuário";
  const displayEmail = user.email ?? "E-mail não informado";
  const initial = displayName.charAt(0).toUpperCase();

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
            "h-5 w-5 transition-transform",
            collapsed && "rotate-180",
          )}
        />
      </button>

      <div
        className={cn(
          "flex h-20 items-center px-6",
          collapsed ? "justify-center" : "justify-start",
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 shadow-lg shadow-indigo-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>

          {!collapsed && (
            <span className="bg-linear-to-r from-zinc-900 to-zinc-500 bg-clip-text text-xl font-bold tracking-tight text-transparent dark:from-white dark:to-zinc-400">
              Analyzer
            </span>
          )}
        </div>
      </div>

      <nav className="mt-4 flex-1 space-y-1.5 px-3">
        <p
          className={cn(
            "mb-4 px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400",
            collapsed && "text-center",
          )}
        >
          {collapsed ? "•••" : "Menu Principal"}
        </p>

        <NavItem
          href="/dashboard"
          icon={<LayoutDashboard size={20} />}
          label="Dashboard"
          collapsed={collapsed}
          active={pathname === "/dashboard"}
        />
        <NavItem
          href="/dashboard/analyses"
          icon={<ClipboardList size={20} />}
          label="Análises Internas"
          collapsed={collapsed}
          active={pathname === "/dashboard/analyses"}
        />
        <NavItem
          href="/dashboard/pipeline"
          icon={<GitMerge size={20} />}
          label="Pipeline"
          collapsed={collapsed}
          active={pathname === "/dashboard/pipeline"}
        />
        <NavItem
          href="/dashboard/analyze"
          icon={<Brain size={20} />}
          label="IA Scanner"
          collapsed={collapsed}
          active={pathname === "/dashboard/analyze"}
        />

        <div className="mx-2 my-6 border-t border-zinc-200/50 dark:border-zinc-800/50" />

        <p
          className={cn(
            "mb-4 px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400",
            collapsed && "text-center",
          )}
        >
          {collapsed ? "•••" : "Gerenciamento"}
        </p>

        <NavItem
          href="/dashboard/jobs"
          icon={<Briefcase size={20} />}
          label="Vagas"
          collapsed={collapsed}
          active={pathname.startsWith("/dashboard/jobs")}
        />

        <button
          type="button"
          onClick={() => {
            if (!collapsed) setSettingsOpen((value) => !value);
          }}
          className={cn(
            "group flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium transition-all",
            "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white",
            collapsed && "justify-center px-0",
          )}
        >
          <Settings size={20} className="shrink-0" />

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
            <NavItem
              href="/dashboard/users"
              icon={<Users size={17} />}
              label="Equipe"
              collapsed={false}
              active={pathname.startsWith("/dashboard/users")}
            />
            <NavItem
              href="/dashboard/settings/email-templates"
              icon={<Mail size={17} />}
              label="Templates de e-mail"
              collapsed={false}
              active={pathname.startsWith(
                "/dashboard/settings/email-templates",
              )}
            />
          </div>
        )}
      </nav>

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

                <p className="truncate text-[11px] leading-none text-muted-foreground">
                  {displayEmail}
                </p>

                {user.company_name && (
                  <p className="mt-1 truncate text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                    {user.company_name}
                  </p>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                onClick={handleLogout}
                disabled={isPending}
              >
                <LogOut size={16} />
              </Button>
            </>
          )}
        </div>

        {collapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-full transition-colors hover:bg-red-50 hover:text-red-600"
            onClick={handleLogout}
            disabled={isPending}
          >
            <LogOut size={18} />
          </Button>
        )}
      </div>
    </aside>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  active: boolean;
}

function NavItem({ href, icon, label, collapsed }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium transition-all",
        "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white",
        collapsed && "justify-center px-0",
      )}
    >
      <span className="shrink-0">{icon}</span>
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );
}
