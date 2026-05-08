"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { LoginInput } from "@/types/loginInput";

export interface LoginError {
  message: string;
  code?: string;
}

export async function login(data: LoginInput) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    },
  );

  const { data: result, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error || !result.user) {
    throw new Error(error?.message ?? "Erro ao realizar login.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, status")
    .eq("id", result.user.id)
    .single();

  if (profileError || !profile) {
    await supabase.auth.signOut();
    throw new Error("Perfil do usuário não encontrado.");
  }

  if (profile.status === "inactive") {
    await supabase.auth.signOut();
    throw new Error("Usuário inativo. Entre em contato com o administrador.");
  }

  return {
    userId: result.user.id,
    email: result.user.email ?? null,
  };
}