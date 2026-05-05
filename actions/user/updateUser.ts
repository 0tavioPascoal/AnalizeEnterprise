"use server";

import { createServerClient } from "@/lib/supabase/server";
import type { UserFormData, UserRole } from "@/types/user/user";

export interface ActionResponse {
  success: boolean;
  message: string;
}

export async function updateUser(
  id: string,
  data: UserFormData,
): Promise<ActionResponse> {
  const supabase = await createServerClient();

  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !authUser) {
    return {
      success: false,
      message: "Usuário não autenticado.",
    };
  }

  const { data: currentProfile, error: currentProfileError } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", authUser.id)
    .single();

  if (currentProfileError || !currentProfile) {
    return {
      success: false,
      message: "Perfil do usuário logado não encontrado.",
    };
  }

  const { data: targetProfile, error: targetProfileError } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", id)
    .single();

  if (targetProfileError || !targetProfile) {
    return {
      success: false,
      message: "Usuário não encontrado.",
    };
  }

  const isCurrentUserAdmin = currentProfile.role === "admin";
  const isEditingSelf = currentProfile.id === targetProfile.id;
  const isTargetAdmin = targetProfile.role === "admin";

  if (!isCurrentUserAdmin && isTargetAdmin) {
    return {
      success: false,
      message: "Recrutadores não podem alterar dados de administradores.",
    };
  }

  const payload: {
    name: string;
    email?: string;
    role?: UserRole;
  } = {
    name: data.name,
  };

  if (data.email) {
    payload.email = data.email;
  }

  if (!isEditingSelf && isCurrentUserAdmin) {
    payload.role = data.role;
  }

  const { error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", id);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Usuário atualizado com sucesso.",
  };
}