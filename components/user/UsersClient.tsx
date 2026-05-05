"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  UserRound,
  Shield,
  ChevronRight,
} from "lucide-react";

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
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
                <Input
                  placeholder="Buscar usuário..."
                  className="w-64 h-9 pl-9 shadow-sm"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              <Link href="/dashboard/users/new">
                <Button className="bg-indigo-600 hover:bg-indigo-700 h-9 font-bold shadow-md shadow-indigo-500/10">
                  <Plus className="w-4 h-4 mr-2" />
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
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                    <UserRound size={20} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">
                      {user.name}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[11px] text-zinc-400 truncate">
                        {user.email}
                      </span>

                      <Badge className="text-[10px] px-2 py-0 rounded-md bg-zinc-100 dark:bg-zinc-800">
                        {user.role === "admin"
                          ? "Administrador"
                          : "Recrutador"}
                      </Badge>
                    </div>
                  </div>
                </div>
              }
              right={
                <div className="flex items-center gap-5">
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 text-xs font-bold text-indigo-600">
                      <Shield size={14} />
                      {user.role}
                    </div>

                    <p className="mt-1 text-[10px] text-zinc-400">
                      Nível de acesso
                    </p>
                  </div>

                  <Link
                    href={`/dashboard/users/${user.id}/edit`}
                    className="h-9 w-9 flex items-center justify-center text-indigo-500 hover:text-indigo-600 transition"
                  >
                    <ChevronRight size={18} />
                  </Link>
                </div>
              }
            />
          ))
        ) : (
          <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl text-zinc-400 text-sm">
            <UserRound size={24} className="mb-2 text-zinc-300" />
            <p className="font-medium">Nenhum usuário encontrado.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}