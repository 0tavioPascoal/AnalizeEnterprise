"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/features/auth/server/current-profile";
import { jobFormSchema } from "@/lib/validations";
import type { JobFormData } from "@/types/jobs/job";

export interface UpdateJobResponse {
  success: boolean;
  message?: string;
}

export async function updateJob(
  id: string,
  data: JobFormData
): Promise<UpdateJobResponse> {
  const supabase = await createServerClient();
  const currentProfile = await getCurrentProfile();

  if (!currentProfile) {
    return {
      success: false,
      message: "Usuário não autenticado.",
    };
  }

  const parsed = jobFormSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const { error } = await supabase
    .from("jobs")
    .update({
      title: parsed.data.title,
      context: parsed.data.context,
      score_min: parsed.data.score_min,
      seniority: parsed.data.seniority,
      contract_type: parsed.data.contract_type,
      skills: parsed.data.skills || null,
    })
    .eq("id", id)
    .eq("company_id", currentProfile.company_id);

  if (error) {
    return { success: false, message: "Erro ao atualizar vaga." };
  }

  revalidatePath("/dashboard/jobs");

  return { success: true };
}
