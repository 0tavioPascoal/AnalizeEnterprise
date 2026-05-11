// components/layout/sidebar/sidebar.config.tsx

import {
  LayoutDashboard,
  Briefcase,
  Brain,
  ClipboardList,
  Users,
  GitMerge,
  Mail,
} from "lucide-react";

import type { SidebarNavItem } from "@/types/layout/sidebar/sidebar";

export const mainItems: SidebarNavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={21} />,
    active: (pathname) => pathname === "/dashboard",
  },

  {
    href: "/dashboard/analyses",
    label: "Análises Internas",
    icon: <ClipboardList size={21} />,
    active: (pathname) => pathname === "/dashboard/analyses",
  },

  {
    href: "/dashboard/pipeline",
    label: "Pipeline",
    icon: <GitMerge size={21} />,
    active: (pathname) => pathname === "/dashboard/pipeline",
  },

  {
    href: "/dashboard/analyze",
    label: "IA Scanner",
    icon: <Brain size={21} />,
    active: (pathname) => pathname === "/dashboard/analyze",
  },
];

export const managementItems: SidebarNavItem[] = [
  {
    href: "/dashboard/jobs",
    label: "Vagas",
    icon: <Briefcase size={21} />,
    active: (pathname) => pathname.startsWith("/dashboard/jobs"),
  },
];

export const settingsItems: SidebarNavItem[] = [
  {
    href: "/dashboard/users",
    label: "Equipe",
    icon: <Users size={19} />,
    active: (pathname) => pathname.startsWith("/dashboard/users"),
  },

  {
    href: "/dashboard/settings/email-templates",
    label: "Templates de E-mail",
    icon: <Mail size={19} />,
    active: (pathname) =>
      pathname.startsWith("/dashboard/settings/email-templates"),
  },
];