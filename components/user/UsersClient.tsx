"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Plus,
  Search,
  Shield,
  UserRound,
} from "lucide-react";

import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/Pageheader";
import { RowItem } from "@/components/layout/RowItem";
import { TablePagination } from "@/components/layout/TablePagination";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";
import type { UserProfile } from "@/types/user/user";

interface UsersClientProps {
  users: UserProfile[];
}

type StatusFilter = "active" | "inactive" | "all";

const ITEMS_PER_PAGE = 10;

export function UsersClient({ users }: UsersClientProps) {
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("active");

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;

      const matchesSearch =
        !term ||
        (user.name?.toLowerCase() ?? "").includes(term) ||
        (user.email?.toLowerCase() ?? "").includes(term) ||
        user.role.toLowerCase().includes(term) ||
        user.status.toLowerCase().includes(term);

      return matchesStatus && matchesSearch;
    });
  }, [users, search, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / ITEMS_PER_PAGE),
  );

  const paginatedUsers = useMemo(() => {
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * ITEMS_PER_PAGE;

    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, page, totalPages]);

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value);
    setPage(1);
  }

  function handleStatusFilterChange(value: StatusFilter) {
    setStatusFilter(value);
    setPage(1);
  }

  return (
    <PageLayout
      header={
        <PageHeader
          title="Usuários"
          description="Gerencie recrutadores, permissões e acessos da RH Analyzer"
          action={
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
              <div className="flex rounded-xl border border-border bg-card p-1 shadow-sm">
                <Button
                  type="button"
                  variant={statusFilter === "active" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleStatusFilterChange("active")}
                  className="h-8 rounded-lg px-3 text-xs"
                >
                  Ativos
                </Button>

                <Button
                  type="button"
                  variant={statusFilter === "inactive" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleStatusFilterChange("inactive")}
                  className="h-8 rounded-lg px-3 text-xs"
                >
                  Inativos
                </Button>

                <Button
                  type="button"
                  variant={statusFilter === "all" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleStatusFilterChange("all")}
                  className="h-8 rounded-lg px-3 text-xs"
                >
                  Todos
                </Button>
              </div>

              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="Buscar usuário..."
                  className="h-10 w-full rounded-xl border-border bg-card pl-9 pr-3 text-sm shadow-sm transition-all placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/30 sm:w-72"
                />
              </div>

              <Link href="/dashboard/users/new">
                <Button className="h-10 w-full rounded-xl bg-primary px-4 font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition-all hover:bg-primary/90 sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Usuário
                </Button>
              </Link>
            </div>
          }
        />
      }
      pagination={
        filteredUsers.length > ITEMS_PER_PAGE && (
          <TablePagination
            page={page}
            totalPages={totalPages}
            setPage={setPage}
          />
        )
      }
    >
      <div className="mr-5 flex flex-col gap-3 pb-4">
        {paginatedUsers.length > 0 ? (
          paginatedUsers.map((user) => {
            const isAdmin = user.role === "admin";
            const isActive = user.status === "active";

            return (
              <RowItem
                key={user.id}
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
                      <UserRound size={20} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {user.name ?? "Usuário sem nome"}
                      </p>

                      <div className="mt-2 flex min-w-0 flex-wrap items-center gap-2">
                        <span className="max-w-55 truncate text-xs text-muted-foreground">
                          {user.email ?? "E-mail não informado"}
                        </span>

                        <Badge
                          className={cn(
                            "rounded-lg border px-2 py-0.5 text-[10px] font-semibold shadow-none",
                            isAdmin
                              ? "border-indigo-500/20 bg-indigo-500/10 text-indigo-700 hover:bg-indigo-500/10 dark:text-indigo-300"
                              : "border-slate-500/20 bg-slate-500/10 text-slate-700 hover:bg-slate-500/10 dark:text-slate-300",
                          )}
                        >
                          {isAdmin ? "Administrador" : "Recrutador"}
                        </Badge>

                        <Badge
                          className={cn(
                            "rounded-lg border px-2 py-0.5 text-[10px] font-semibold shadow-none",
                            isActive
                              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300"
                              : "border-amber-500/20 bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 dark:text-amber-300",
                          )}
                        >
                          {isActive ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                }
                right={
                  <div className="flex items-center gap-4">
                    <div className="hidden min-w-24 text-right sm:block">
                      <div
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold shadow-sm",
                          isAdmin
                            ? "border-indigo-500/20 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300"
                            : "border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300",
                        )}
                      >
                        <Shield size={14} />
                        {isAdmin ? "Admin" : "Recruiter"}
                      </div>

                      <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                        Nível de acesso
                      </p>
                    </div>

                    <Link
                      href={`/dashboard/users/${user.id}/edit`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                      aria-label={`Editar usuário ${user.name ?? ""}`}
                    >
                      <ChevronRight size={18} />
                    </Link>
                  </div>
                }
              />
            );
          })
        ) : (
          <div className="flex h-44 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/60 px-6 text-center shadow-sm">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <UserRound size={22} />
            </div>

            <p className="text-sm font-semibold text-foreground">
              Nenhum usuário encontrado.
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Tente buscar por outro nome, e-mail, permissão ou status.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}