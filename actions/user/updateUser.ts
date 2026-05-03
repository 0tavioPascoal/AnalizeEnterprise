"use server";

import { createClient } from "@/lib/supabase/client";
import { UserFormData, ActionResponse } from "@/types/user/user";
import { revalidatePath } from "next/cache";

export async function updateUser(id: string, data: UserFormData): Promise<ActionResponse> {
  const supabase = createClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      name: data.name,
      role: data.role
    })
    .eq("id", id);

  if (error) return { success: false, message: error.message };

  revalidatePath("/dashboard/users");
  return { success: true, message: "Usuário atualizado com sucesso!" };
}