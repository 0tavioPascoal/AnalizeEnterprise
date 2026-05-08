"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";
import type { UserFormData, UserRole, UserStatus } from "@/types/user/user";

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
    .select("id, role, company_id")
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
    .select("id, role, company_id, status")
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
  const isSameCompany = currentProfile.company_id === targetProfile.company_id;

  if (!isSameCompany) {
    return {
      success: false,
      message: "Você não pode alterar usuários de outra empresa.",
    };
  }

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
    .eq("id", id)
    .eq("company_id", currentProfile.company_id);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/dashboard/users");
  revalidatePath(`/dashboard/users/${id}`);

  return {
    success: true,
    message: "Usuário atualizado com sucesso.",
  };
}

export async function updateUserStatus(
  id: string,
  status: UserStatus,
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
    .select("id, role, company_id")
    .eq("id", authUser.id)
    .single();

  if (currentProfileError || !currentProfile) {
    return {
      success: false,
      message: "Perfil do usuário logado não encontrado.",
    };
  }

  if (currentProfile.role !== "admin") {
    return {
      success: false,
      message: "Apenas administradores podem inativar ou reativar usuários.",
    };
  }

  if (currentProfile.id === id) {
    return {
      success: false,
      message: "Você não pode alterar o status do próprio usuário.",
    };
  }

  const { data: targetProfile, error: targetProfileError } = await supabase
    .from("profiles")
    .select("id, role, company_id, status")
    .eq("id", id)
    .single();

  if (targetProfileError || !targetProfile) {
    return {
      success: false,
      message: "Usuário não encontrado.",
    };
  }

  if (targetProfile.company_id !== currentProfile.company_id) {
    return {
      success: false,
      message: "Você não pode alterar usuários de outra empresa.",
    };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("company_id", currentProfile.company_id);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/dashboard/users");
  revalidatePath(`/dashboard/users/${id}`);

  return {
    success: true,
    message:
      status === "inactive"
        ? "Usuário inativado com sucesso."
        : "Usuário reativado com sucesso.",
  };
}