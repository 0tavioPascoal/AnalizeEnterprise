"use server";

import { createClient } from "@supabase/supabase-js";
import { UserFormData, ActionResponse } from "@/types/user/user";
import { revalidatePath } from "next/cache";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export async function createUser(payload: UserFormData): Promise<ActionResponse> {
  try {
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: payload.email,
      password: payload.password,
      email_confirm: true,
      user_metadata: { 
        name: payload.name, 
        role: payload.role, 
        company_id: payload.company_id
      }
    });

    if (authError || !authData?.user) {
      return { success: false, message: authError?.message || "Erro no Auth." };
    }
    const { error: dbError } = await supabaseAdmin.from("profiles").insert({
      id: authData.user.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      company_id: payload.company_id,
    });

    if (dbError) {
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return { success: false, message: "Perfil não sincronizado: " + dbError.message };
    }

    revalidatePath("/dashboard/users");
    return { success: true, message: "Acesso criado com sucesso!" };

  } catch {
    return { success: false, message: "Erro no servidor." };
  }
}