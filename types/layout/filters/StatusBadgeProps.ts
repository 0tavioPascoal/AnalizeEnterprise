export type StatusVariant = "success" | "warning" | "danger" | "info" | "muted";

export interface StatusBadgeProps {
  children: React.ReactNode;
  variant?: StatusVariant;
  className?: string;
}

