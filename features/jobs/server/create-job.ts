"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";
import { jobFormSchema } from "@/lib/validations";
import { getCurrentProfile } from "@/features/auth/server/current-profile";
import type { JobFormData } from "@/types/jobs/job";

export interface CreateJobResponse {
  success: boolean;
  message?: string;
}

export async function createJob(
  data: JobFormData
): Promise<CreateJobResponse> {
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

  const payload = {
    title: parsed.data.title,
    context: parsed.data.context,
    score_min: parsed.data.score_min,
    company_id: currentProfile.company_id,
    seniority: parsed.data.seniority,
    contract_type: parsed.data.contract_type,
    skills: parsed.data.skills || null,
  };

  const { data: inserted, error } = await supabase
    .from("jobs")
    .insert(payload)
    .select()
    .single();

  if (error) {
    return { success: false, message: "Erro ao criar vaga." };
  }

  if (!inserted) {
    return {
      success: false,
      message: "Erro ao criar vaga.",
    };
  }

  revalidatePath("/dashboard/jobs");

  return {
    success: true,
  };
}
