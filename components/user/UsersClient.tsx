"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, UserRound, Shield, ChevronRight } from "lucide-react";

import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/Pageheader";
import { TablePagination } from "@/components/layout/TablePagination";
import { RowItem } from "@/components/layout/RowItem";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import type { UserRole } from "@/types/user/user";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface UsersClientProps {
  users: User[];
}

const PAGE_SIZE = 6;

export function UsersClient({ users }: UsersClientProps) {
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return users;

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term),
    );
  }, [users, search]);

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredUsers.slice(start, end);
  }, [filteredUsers, page]);

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  return (
    <PageLayout
      header={
        <PageHeader
          title="Usuários"
          description="Gerencie recrutadores e permissões da RH Analyzer"
          action={
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  placeholder="Buscar usuário..."
                  className="h-10 w-full rounded-xl border-border bg-card pl-9 pr-3 text-sm shadow-sm transition-all placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/30 sm:w-72"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
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
        totalPages > 1 && (
          <TablePagination
            page={page}
            totalPages={totalPages}
            setPage={setPage}
          />
        )
      }
    >
      <div className="flex flex-col gap-3 pb-4">
        {paginatedUsers.length > 0 ? (
          paginatedUsers.map((user) => (
            <RowItem
              key={user.id}
              left={
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/10 bg-primary/10 text-primary shadow-sm">
                    <UserRound size={20} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {user.name}
                    </p>

                    <div className="mt-1.5 flex min-w-0 flex-wrap items-center gap-2">
                      <span className="max-w-55 truncate text-xs text-muted-foreground">
                        {user.email}
                      </span>

                      <Badge className="rounded-lg border border-border bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground shadow-none hover:bg-secondary">
                        {user.role === "admin" ? "Administrador" : "Recrutador"}
                      </Badge>
                    </div>
                  </div>
                </div>
              }
              right={
                <div className="flex items-center gap-4">
                  <div className="hidden text-right sm:block">
                    <div className="inline-flex items-center gap-1.5 rounded-xl border border-primary/10 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                      <Shield size={14} />
                      {user.role === "admin" ? "Admin" : "Recruiter"}
                    </div>

                    <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      Nível de acesso
                    </p>
                  </div>

                  <Link
                    href={`/dashboard/users/${user.id}/edit`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                    aria-label={`Editar usuário ${user.name}`}
                  >
                    <ChevronRight size={18} />
                  </Link>
                </div>
              }
            />
          ))
        ) : (
          <div className="flex h-44 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/60 px-6 text-center shadow-sm">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <UserRound size={22} />
            </div>

            <p className="text-sm font-semibold text-foreground">
              Nenhum usuário encontrado.
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Tente buscar por outro nome, e-mail ou permissão.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
