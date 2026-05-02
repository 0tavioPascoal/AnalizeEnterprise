"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserList, User } from "@/components/user/UserList";

const FIXED_COMPANY = "ACME Ltda";

const users: User[] = [
  { id: "1", name: "João Silva", email: "joao@empresa.com", company: FIXED_COMPANY },
  { id: "2", name: "Maria Souza", email: "maria@empresa.com", company: FIXED_COMPANY },
];

export default function UsersPage() {
  return (
    <div className="w-full space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Usuários</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os usuários do sistema
          </p>
        </div>

        <Link href="/dashboard/users/new">
          <Button>Novo usuário</Button>
        </Link>
      </div>

      <UserList users={users} />

    </div>
  );
}
