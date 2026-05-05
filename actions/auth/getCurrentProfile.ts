"use server";

import { createServerClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/user/user";

export interface CurrentProfile {
  id: string;
  company_id: string;
  company_name: string | null;
  role: UserRole;
  name: string | null;
  email: string | null;
}

export async function getCurrentProfile(): Promise<CurrentProfile | null> {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select(`
      id,
      role,
      company_id,
      name,
      email,
      company:companies (
        name
      )
    `)
    .eq("id", user.id)
    .single();

  if (error || !data) {
    console.error("Erro profile:", error);
    return null;
  }

 return {
  id: data.id,
  role: data.role,
  company_id: data.company_id,
  name: data.name,
  email: data.email,
  company_name: data.company?.[0]?.name ?? null,
};
}