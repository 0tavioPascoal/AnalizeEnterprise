"use server";

import { createServerClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import type { LoginInput } from "@/types/loginInput";

export interface LoginError {
  message: string;
  code?: string;
}

export async function login(data: LoginInput) {
  const supabase = await createServerClient();

  const { data: result, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error || !result.user) {
    if (error) {
      logger.warn("auth.login.failed", {
        email: data.email,
        reason: error.message,
      });
    }

    throw new Error("E-mail ou senha inválidos.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, status")
    .eq("id", result.user.id)
    .single();

  if (profileError || !profile) {
    if (profileError) {
      logger.error("auth.login.profile_failed", profileError, {
        userId: result.user.id,
      });
    }

    await supabase.auth.signOut();
    throw new Error("Perfil do usuário não encontrado.");
  }

  if (profile.status === "inactive") {
    logger.warn("auth.login.inactive_user", {
      userId: result.user.id,
    });

    await supabase.auth.signOut();
    throw new Error("Usuário inativo. Entre em contato com o administrador.");
  }

  return {
    userId: result.user.id,
    email: result.user.email ?? null,
  };
}
