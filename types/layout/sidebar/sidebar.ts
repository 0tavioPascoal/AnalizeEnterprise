import type { ReactNode } from "react";

export interface SidebarUser {
  name: string | null;
  email: string | null;
  role: string | null;
  company_name: string | null;
}

export interface SidebarNavItem {
  href: string;
  label: string;
  icon: ReactNode;
  active: (pathname: string) => boolean;
}