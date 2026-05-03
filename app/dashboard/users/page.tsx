"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/Pageheader";
import { TablePagination } from "@/components/layout/TablePagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { UsersTable } from "@/components/user/UsersTable";
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
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const pageSize: number = 6;

  const supabase = createClient();

  // Busca inicial de dados
  useEffect(() => {
    async function fetchUsers() {
      try {
        // 1. Pega o usuário logado no momento
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        // 2. Busca os perfis da mesma empresa do usuário logado
        // O RLS que configuramos com auth.jwt() já protege isso,
        // mas filtrar explicitamente é uma boa prática de Backend.
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .order("name", { ascending: true });

        if (error) throw error;
        setUsers(data || []);
      } catch (error: any) {
        toast.error("Erro ao carregar usuários: " + error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  // Filtro otimizado (Client-side para busca instantânea)
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, users]);

  // Paginação calculada
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice((page - 1) * pageSize, page * pageSize);
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
                <Input
                  placeholder="Buscar por nome ou e-mail..."
                  className="w-72 h-10 shadow-sm rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              <Link href="/dashboard/users/new">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-[10px] uppercase tracking-widest font-black h-10 px-6 rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95">
                  <Plus className="w-4 h-4 mr-2 stroke-[3px]" />
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
        <div className="min-h-0 overflow-y-auto custom-scrollbar pr-2">
          <UsersTable users={paginatedUsers} />
        </div>
      )}
    </PageLayout>
  );
}
