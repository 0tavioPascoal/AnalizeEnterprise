"use server";

import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentProfile } from "@/features/auth/server/current-profile";
import { logger } from "@/lib/logger";
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
    if (authError) {
      logger.error("user.create.auth_failed", authError, {
        companyId: currentProfile.company_id,
        createdBy: currentProfile.id,
      });
    }

    return {
      success: false,
      message: "Erro ao criar usuário.",
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
    logger.error("user.create.profile_failed", profileError, {
      companyId: currentProfile.company_id,
      createdBy: currentProfile.id,
      targetUserId: authData.user.id,
    });

    return {
      success: false,
      message: "Erro ao criar perfil do usuário.",
    };
  }

  return {
    success: true,
    message: "Usuário criado com sucesso.",
  };
}
