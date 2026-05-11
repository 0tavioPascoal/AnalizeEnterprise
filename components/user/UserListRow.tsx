import Link from "next/link";
import { ChevronRight, Shield, UserRound } from "lucide-react";

import { RowItem } from "@/components/layout/RowItem";
import { StatusBadge } from "@/components/layout/filters/StatusBadge";

import { cn } from "@/lib/supabase/utils";
import type { UserProfile } from "@/types/user/user";

interface UserListRowProps {
  user: UserProfile;
}

export function UserListRow({ user }: UserListRowProps) {
  const isAdmin = user.role === "admin";
  const isActive = user.status === "active";

  return (
    <RowItem
      left={
        <div className="flex min-w-0 items-center gap-4">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border shadow-sm",
              isActive
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
            )}
          >
            <UserRound size={22} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-base font-bold text-foreground">
              {user.name ?? "Usuário sem nome"}
            </p>

            <div className="mt-2 flex min-w-0 flex-wrap items-center gap-2">
              <span className="max-w-55 truncate text-sm font-medium text-muted-foreground">
                {user.email ?? "E-mail não informado"}
              </span>

              <StatusBadge variant={isAdmin ? "info" : "muted"}>
                {isAdmin ? "Administrador" : "Recrutador"}
              </StatusBadge>

              <StatusBadge variant={isActive ? "success" : "warning"}>
                {isActive ? "Ativo" : "Inativo"}
              </StatusBadge>
            </div>
          </div>
        </div>
      }
      right={
        <div className="flex items-center gap-4">
          <div className="hidden min-w-28 text-right sm:block">
            <div
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-sm font-semibold shadow-sm",
                isAdmin
                  ? "border-indigo-500/20 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300"
                  : "border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300",
              )}
            >
              <Shield size={15} />
              {isAdmin ? "Admin" : "Recruiter"}
            </div>

            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Nível de acesso
            </p>
          </div>

          <Link
            href={`/dashboard/users/${user.id}/edit`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
            aria-label={`Editar usuário ${user.name ?? ""}`}
          >
            <ChevronRight size={20} />
          </Link>
        </div>
      }
    />
  );
}
