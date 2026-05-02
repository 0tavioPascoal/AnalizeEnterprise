"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus } from "lucide-react"; // Adicionando ícones para UI/UX superior

import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/Pageheader";
import { TablePagination } from "@/components/layout/TablePagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { UserList } from "@/components/user/UserList";
import type { User } from "@/components/user/UserRow";

// =========================
// MOCK DATA (Tipado)
// =========================
const mockUsers: User[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@empresa.com",
    company: "ACME Ltda",
  },
  {
    id: "2",
    name: "Maria Souza",
    email: "maria@empresa.com",
    company: "ACME Ltda",
  },
  {
    id: "3",
    name: "Carlos Lima",
    email: "carlos@empresa.com",
    company: "ACME Ltda",
  },
  {
    id: "4",
    name: "Ana Costa",
    email: "ana@empresa.com",
    company: "ACME Ltda",
  },
];

export default function UsersPage() {
  const [search, setSearch] = useState<string>(""); // Tipagem explícita
  const [page, setPage] = useState<number>(1);
  const pageSize: number = 3;

  // Filtro otimizado
  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

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
          description="Gerencie usuários e permissões da sua organização"
          action={
            <div className="flex items-center gap-3">
              <Input
                placeholder="Buscar por nome..."
                className="w-64 h-9 shadow-sm"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />

              <Link href="/dashboard/users/new">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-xs font-bold h-9">
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
      {/* O UserList recebe o min-h-0 do PageLayout para scrollar internamente */}
      <UserList data={paginatedUsers} />
    </PageLayout>
  );
}
