"use client";

import type { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  icon?: LucideIcon
}

export function PageHeader({ title, description, action }: Props) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap mr-10">
      
      {/* LEFT */}
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {/* RIGHT (ACTIONS) */}
      {action && (
        <div className="flex items-center gap-3 flex-wrap">
          {action}
        </div>
      )}
    </div>
  );
}
