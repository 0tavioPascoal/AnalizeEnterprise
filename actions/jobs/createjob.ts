"use server";

import { createClient } from "@/lib/supabase/client";
import { revalidatePath } from "next/cache";
import { JobFormData } from "@/components/jobs/JobForm";
import { getCurrentProfile } from "../auth/getCurrentProfile";

export interface CreateJobResponse {
  success: boolean;
  message?: string;
}

export async function createJob(
  data: JobFormData
): Promise<CreateJobResponse> {
  const supabase = await createClient();

  const currentProfile = await getCurrentProfile();

  if (!currentProfile) {
  throw new Error("Usuário não autenticado.");
}

  const payload = {
    title: data.title,
    context: data.context,
    score_min: Number(data.score_min ?? 0),
    company_id: currentProfile.company_id,
    seniority: data.seniority ?? "Pleno",
    contract_type: data.contract_type ?? "CLT",
    skills: data.skills?.trim() || null,
  };

  console.log("🚀 INSERT PAYLOAD:", payload);

  const { data: inserted, error } = await supabase
    .from("jobs")
    .insert(payload)
    .select()
    .single();

  console.log("📦 SUPABASE RESPONSE:", { inserted, error });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  if (!inserted) {
    return {
      success: false,
      message: "Nenhum dado retornado do insert",
    };
  }

  revalidatePath("/dashboard/jobs");

  return {
    success: true,
  };
}
