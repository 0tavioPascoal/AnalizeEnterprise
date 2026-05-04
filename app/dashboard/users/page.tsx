"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Loader2,
  UserRound,
  Shield,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/Pageheader";
import { TablePagination } from "@/components/layout/TablePagination";
import { RowItem } from "@/components/layout/RowItem";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/types/user/user";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const pageSize = 6;

  useEffect(() => {
    async function fetchUsers(): Promise<void> {
      const supabase = createClient();

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, name, email, role")
          .order("name", { ascending: true });

        if (error) {
          throw error;
        }

        setUsers((data ?? []) as User[]);
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Erro desconhecido";

        toast.error(`Erro ao carregar usuários: ${message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    if (!normalizedSearch) return users;

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch),
    );
  }, [search, users]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice((page - 1) * pageSize, page * pageSize);
  }, [filteredUsers, page]);

  function handleSearch(value: string): void {
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
      {loading ? (
        <div className="h-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500 opacity-50" />
        </div>
      ) : (
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
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50 truncate">
                        {user.name}
                      </p>

                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[11px] text-zinc-400 font-medium truncate">
                          {user.email}
                        </span>

                        <Badge
                          variant="secondary"
                          className="text-[10px] px-2 py-0 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                        >
                          {user.role === "admin" ? "Administrador" : "Recrutador"}
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

                      <p className="mt-1 text-[10px] text-zinc-400 font-medium">
                        Nível de acesso
                      </p>
                    </div>

                    <Link
                      href={`/dashboard/users/${user.id}/edit`}
                      className="h-9 w-9 flex items-center justify-center text-indigo-500 hover:text-indigo-600 transition"
                      aria-label={`Editar usuário ${user.name}`}
                    >
                      <ChevronRight size={18} />
                    </Link>
                  </div>
                }
              />
            ))
          ) : (
            <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-400 text-sm bg-zinc-50/40 dark:bg-zinc-900/40">
              <UserRound size={24} className="mb-2 text-zinc-300" />
              <p className="font-medium">Nenhum usuário encontrado.</p>
              <p className="text-xs mt-1">Crie um novo usuário para começar.</p>
            </div>
          )}
        </div>
      )}
    </PageLayout>
  );
}