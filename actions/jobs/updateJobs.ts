"use server";

import { createClient } from "@/lib/supabase/client";
import { revalidatePath } from "next/cache";
import { JobFormData } from "@/components/jobs/JobForm";

export interface UpdateJobResponse {
  success: boolean;
  message?: string;
}

export async function updateJob(
  id: string,
  data: JobFormData
): Promise<UpdateJobResponse> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("jobs")
    .update({
      title: data.title,
      context: data.context,
      score_min: Number(data.score_min ?? 0),
      seniority: data.seniority,
      contract_type: data.contract_type,
      skills: data.skills || null,
    })
    .eq("id", id);

  if (error) {
    console.error("UPDATE ERROR:", error);

    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/dashboard/jobs");

  return { success: true };
}
