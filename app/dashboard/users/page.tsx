import { createServerClient } from "@/lib/supabase/server";
import { UsersClient } from "@/components/user/UsersClient";

import type { UserRole } from "@/types/user/user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export default async function UsersPage() {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, email, role")
    .order("name", { ascending: true });

  if (error) {
    console.error("Erro ao buscar usuários:", error);
    return <UsersClient users={[]} />;
  }

  return <UsersClient users={(data ?? []) as User[]} />;
}