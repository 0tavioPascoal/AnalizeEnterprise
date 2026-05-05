"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentProfile } from "@/actions/auth/getCurrentProfile";
import type { ActionResponse, UserFormData } from "@/types/user/user";

export async function createUser(
  data: UserFormData,
): Promise<ActionResponse> {
  const currentProfile = await getCurrentProfile();

  if (!currentProfile) {
    return {
      success: false,
      message: "Usuário não autenticado.",
    };
  }

  if (currentProfile.role !== "admin") {
    return {
      success: false,
      message: "Apenas administradores podem criar usuários.",
    };
  }

  if (!data.password) {
    return {
      success: false,
      message: "Senha obrigatória.",
    };
  }

  const adminSupabase = createAdminClient();

  const { data: authData, error: authError } =
    await adminSupabase.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        name: data.name,
      },
    });

  if (authError || !authData.user) {
    return {
      success: false,
      message: authError?.message ?? "Erro ao criar usuário.",
    };
  }

  const { error: profileError } = await adminSupabase.from("profiles").insert({
    id: authData.user.id,
    name: data.name,
    email: data.email,
    role: data.role,
    company_id: currentProfile.company_id,
  });

  if (profileError) {
    return {
      success: false,
      message: profileError.message,
    };
  }

  return {
    success: true,
    message: "Usuário criado com sucesso.",
  };
}