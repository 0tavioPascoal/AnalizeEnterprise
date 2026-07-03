"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, UserRound } from "lucide-react";

import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { TablePagination } from "@/components/layout/TablePagination";
import { SearchInput } from "@/components/layout/filters/SearchInput";
import { EmptyState } from "@/components/layout/filters/EmptyState";
import { FilterBar } from "@/components/layout/filters/FilterBar";
import { StatusFilterTabs } from "@/components/layout/filters/StatusFilterTabs";

import { Button } from "@/components/ui/button";

import { UserListRow } from "@/features/users/components/UserListRow";
import type { UserProfile, UserStatus } from "@/types/user/user";

type StatusFilter = UserStatus | "all";

interface UsersClientProps {
  users: UserProfile[];
}

const ITEMS_PER_PAGE = 10;

const statusOptions: Array<{ label: string; value: StatusFilter }> = [
  { label: "Ativos", value: "active" },
  { label: "Inativos", value: "inactive" },
  { label: "Todos", value: "all" },
];

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

  function handleSearchChange(value: string): void {
    setSearch(value);
    setPage(1);
  }

  function handleStatusChange(value: StatusFilter): void {
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
            <FilterBar className="xl:flex-nowrap">
              <StatusFilterTabs
                value={statusFilter}
                options={statusOptions}
                onChange={handleStatusChange}
              />

              <SearchInput
                value={search}
                onChange={handleSearchChange}
                placeholder="Buscar usuário..."
              />

              <Link href="/dashboard/users/new">
                <Button className="h-10 w-full rounded-xl bg-primary px-4 font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition-all hover:bg-primary/90 sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Usuário
                </Button>
              </Link>
            </FilterBar>
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
      <div className="flex flex-col gap-3 pb-4">
        {paginatedUsers.length > 0 ? (
          paginatedUsers.map((user) => (
            <UserListRow key={user.id} user={user} />
          ))
        ) : (
          <EmptyState
            icon={UserRound}
            title="Nenhum usuário encontrado."
            description="Tente buscar por outro nome, e-mail, permissão ou status."
          />
        )}
      </div>
    </PageLayout>
  );
}
