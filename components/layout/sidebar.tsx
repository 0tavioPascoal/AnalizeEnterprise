"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, User, Settings, Menu, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { Briefcase } from "lucide-react";
import { Brain } from "lucide-react";
import { List } from "lucide-react";


export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const user = {
    name: "Otavio Pascoal",
    email: "otavio@email.com",
  };

  function handleLogout() {
    router.push("/login");
  }

  return (
    <aside
      className={cn(
        "h-screen border-r bg-background transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <span className="font-semibold text-lg">RH Analyzer</span>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
        >
          <Menu size={18} />
        </Button>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-2 space-y-1">
        <NavItem
          href="/dashboard"
          icon={<Home size={18} />}
          label="Dashboard"
          collapsed={collapsed}
        />

        <NavItem
          href="/dashboard/analyses"
          icon={<List size={18} />}
          label="Análises"
          collapsed={collapsed}
        />

        <NavItem
          href="/dashboard/analyze"
          icon={<Brain size={18} />}
          label="Análise"
          collapsed={collapsed}
        />

        <NavItem
          href="/dashboard/jobs"
          icon={<Briefcase size={18} />}
          label="Vagas"
          collapsed={collapsed}
        />

        <NavItem
          href="/dashboard/profile"
          icon={<User size={18} />}
          label="Perfil"
          collapsed={collapsed}
        />

        <NavItem
          href="/dashboard/settings"
          icon={<Settings size={18} />}
          label="Configurações"
          collapsed={collapsed}
        />
      </nav>

      {/* THEME */}
      <div className="px-2 pb-2">
        <ThemeToggle collapsed={collapsed} />
      </div>

      {/* USER FOOTER */}
      <div className="border-t p-3">
        {collapsed ? (
          // 🔒 COLAPSADO → só logout
          <div className="flex justify-center">
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut size={18} />
            </Button>
          </div>
        ) : (
          // 🔓 EXPANDIDO → tudo
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              {/* Avatar */}
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                {user.name.charAt(0)}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Logout */}
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut size={18} />
            </Button>
          </div>
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
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
    >
      {icon}
      {!collapsed && <span className="text-sm">{label}</span>}
    </Link>
  );
}
