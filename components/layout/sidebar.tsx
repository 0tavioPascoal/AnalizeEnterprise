"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation"; // Pathname para o estado ativo
import {
  LayoutDashboard, Menu,
  LogOut,
  Briefcase,
  Brain,
  ClipboardList,
  Users,
  ChevronLeft,
  Sparkles,
  GitMerge
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { logout } from "@/actions/logout";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  const user = {
    name: "Otavio Pascoal",
    email: "otavio@email.com",
  };

  function handleLogout() {
    startTransition(async () => {
      await logout();
      router.push("/login");
      router.refresh();
    });
  }

  return (
    <aside
      className={cn(
        "h-screen border-r bg-zinc-50/50 dark:bg-zinc-950/50 backdrop-blur-xl transition-all duration-300 flex flex-col relative",
        collapsed ? "w-17.5" : "w-64",
      )}
    >
      {/* Botão de Collapse Flutuante - Mais moderno que o no topo */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-12 bg-background border shadow-md rounded-full p-1 hover:bg-muted transition-all z-50"
      >
        <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
      </button>

      {/* Header / Logo */}
      <div className={cn("flex items-center h-20 px-6", collapsed ? "justify-center" : "justify-start")}>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
            <Sparkles className="text-white h-5 w-5" />
          </div>
          {!collapsed && (
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-linear-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-400">
              Analyzer
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1.5 mt-4">
        <p className={cn("text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-4 px-3", collapsed && "text-center")}>
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
          label="Histórico"
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
        
        <div className="my-6 border-t border-zinc-200/50 dark:border-zinc-800/50 mx-2" />
        
        <p className={cn("text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-4 px-3", collapsed && "text-center")}>
          {collapsed ? "•••" : "Gerenciamento"}
        </p>

        <NavItem
          href="/dashboard/jobs"
          icon={<Briefcase size={20} />}
          label="Vagas"
          collapsed={collapsed}
          active={pathname === "/dashboard/jobs"}
        />
        <NavItem
          href="/dashboard/users"
          icon={<Users size={20} />}
          label="Equipe"
          collapsed={collapsed}
          active={pathname === "/dashboard/users"}
        />
      </nav>

      {/* Footer / User */}
      <div className="mt-auto flex flex-col gap-2 p-3">
        <ThemeToggle collapsed={collapsed} />
        
        <div className={cn(
          "flex items-center gap-2 p-2 rounded-xl border bg-white/50 dark:bg-zinc-900/50 transition-all",
          collapsed ? "justify-center" : "px-3"
        )}>
          <div className="h-8 w-8 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user.name.charAt(0)}
          </div>

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate leading-none mb-1">{user.name}</p>
              <p className="text-[11px] text-muted-foreground truncate leading-none">{user.email}</p>
            </div>
          )}

          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 transition-colors"
              onClick={handleLogout}
              disabled={isPending}
            >
              <LogOut size={16} />
            </Button>
          )}
        </div>
        {collapsed && (
           <Button
           variant="ghost"
           size="icon"
           className="w-full h-10 hover:bg-red-50 hover:text-red-600 transition-colors"
           onClick={handleLogout}
         >
           <LogOut size={18} />
         </Button>
        )}
      </div>
    </aside>
  );
}

function NavItem({
  href,
  icon,
  label,
  collapsed,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
        active 
          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 font-semibold" 
          : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100",
      )}
    >
      <span className={cn(
        "transition-transform duration-200 group-hover:scale-110",
        active && "text-indigo-600 dark:text-indigo-400"
      )}>
        {icon}
      </span>
      {!collapsed && <span className="text-sm">{label}</span>}
      
      {/* Indicador Ativo Lateral */}
      {active && (
        <div className="absolute left-0 w-1 h-6 bg-indigo-600 rounded-r-full" />
      )}
    </Link>
  );
}