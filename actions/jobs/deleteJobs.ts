"use server";

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getCurrentProfile } from "@/actions/auth/getCurrentProfile";

export interface DeleteJobResponse {
  success: boolean;
  message: string;
}

export async function deleteJob(id: string): Promise<DeleteJobResponse> {
  const supabase = await createServerClient();
  const currentProfile = await getCurrentProfile();

  if (!currentProfile) {
    return {
      success: false,
      message: "Usuário não autenticado.",
    };
  }

  const { error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", id)
    .eq("company_id", currentProfile.company_id);

  if (error) {
    console.error("Erro ao excluir vaga:", error);

    return {
      success: false,
      message: "Erro ao excluir vaga.",
    };
  }

  revalidatePath("/dashboard/jobs");

  return {
    success: true,
    message: "Vaga excluída com sucesso!",
  };
}
