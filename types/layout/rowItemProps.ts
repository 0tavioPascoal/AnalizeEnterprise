import type { ReactNode } from "react";

export interface RowItemProps {
  left?: ReactNode;
  right?: ReactNode;
  children?: ReactNode;
  onClick?: () => void;
  asChild?: boolean;
  className?: string;
  contentClassName?: string;
}