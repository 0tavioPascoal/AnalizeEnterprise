import type { ReactNode } from "react";

export interface PageLayoutProps {
  header: ReactNode;
  children: ReactNode;
  filters?: ReactNode;
  pagination?: ReactNode;
  className?: string;
  contentClassName?: string;
}