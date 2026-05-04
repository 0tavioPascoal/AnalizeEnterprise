"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";
import type { ActionResponse, UserFormData } from "@/types/user/user";

export async function updateUser(
  id: string,
  data: UserFormData,
): Promise<ActionResponse> {
  const supabase = await createServerClient();

  if (!id) {
    return {
      success: false,
      message: "ID do usuário não informado.",
    };
  }

  const { data: updatedUser, error } = await supabase
    .from("profiles")
    .update({
      name: data.name,
      role: data.role,
    })
    .eq("id", id)
    .select("id, name, role")
    .single();

  if (error) {
    console.error("Erro ao atualizar usuário:", error);

    return {
      success: false,
      message: error.message,
    };
  }

  if (!updatedUser) {
    return {
      success: false,
      message: "Nenhum usuário foi atualizado.",
    };
  }

  revalidatePath("/dashboard/users");

  return {
    success: true,
    message: "Usuário atualizado com sucesso!",
  };
}