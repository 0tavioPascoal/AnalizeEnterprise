import {
  BriefcaseBusiness,
  Gauge,
  KanbanSquare,
  MailCheck,
  ScanSearch,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import type { SidebarNavItem } from "@/types/layout/sidebar/sidebar";

export const mainItems: SidebarNavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <Gauge size={21} />,
    active: (pathname) => pathname === "/dashboard",
  },

  {
    href: "/dashboard/analyze",
    label: "IA Scanner",
    description: "Analisar currículo",
    badge: "IA",
    featured: true,
    icon: <ScanSearch size={21} />,
    active: (pathname) => pathname === "/dashboard/analyze",
  },

  {
    href: "/dashboard/analyses",
    label: "Triagem",
    icon: <ShieldCheck size={21} />,
    active: (pathname) => pathname === "/dashboard/analyses",
  },

  {
    href: "/dashboard/pipeline",
    label: "Pipeline",
    icon: <KanbanSquare size={21} />,
    active: (pathname) => pathname === "/dashboard/pipeline",
  },
];

export const managementItems: SidebarNavItem[] = [
  {
    href: "/dashboard/jobs",
    label: "Vagas",
    icon: <BriefcaseBusiness size={21} />,
    active: (pathname) => pathname.startsWith("/dashboard/jobs"),
  },
];

export const settingsItems: SidebarNavItem[] = [
  {
    href: "/dashboard/users",
    label: "Equipe",
    icon: <UsersRound size={19} />,
    active: (pathname) => pathname.startsWith("/dashboard/users"),
  },

  {
    href: "/dashboard/settings/email-templates",
    label: "Templates de E-mail",
    icon: <MailCheck size={19} />,
    active: (pathname) =>
      pathname.startsWith("/dashboard/settings/email-templates"),
  },
];
