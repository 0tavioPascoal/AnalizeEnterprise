"use server";

import { cache } from "react";

import { createServerClient } from "@/lib/supabase/server";
import type { UserRole, UserStatus } from "@/types/user/user";
import type { CurrentProfile } from "@/types/profile/currentProfile";



export const getCurrentProfile = cache(
  async (): Promise<CurrentProfile | null> => {
    const supabase = await createServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
      .from("profiles")
      .select(
        `
        id,
        role,
        status,
        company_id,
        name,
        email,
        company:companies (
          name
        )
      `,
      )
      .eq("id", user.id)
      .single();

    if (error || !data) {
      console.error("Erro profile:", error);
      return null;
    }

    const company = Array.isArray(data.company)
      ? data.company[0]
      : data.company;

    return {
      id: data.id,
      role: data.role as UserRole,
      status: (data.status ?? "active") as UserStatus,
      company_id: data.company_id,
      name: data.name,
      email: data.email,
      company_name: company?.name ?? null,
    };
  },
);