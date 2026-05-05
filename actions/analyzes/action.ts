"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";

export interface ActionResponse {
  success: boolean;
  message: string;
  status?: "approved" | "rejected";
}

export async function approveAnalysis(id: string): Promise<ActionResponse> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("candidate_analysis")
    .update({ status: "approved" })
    .eq("id", id)
    .select("id, status")
    .single();

  if (error || !data) {
    return {
      success: false,
      message: error?.message ?? "Nenhuma análise foi atualizada.",
    };
  }

  revalidatePath("/dashboard/analyses");
  revalidatePath(`/dashboard/analyses/${id}`);
  revalidatePath("/dashboard/pipeline");

  return {
    success: true,
    message: "Candidato aprovado com sucesso!",
    status: "approved",
  };
}

export async function rejectAnalysis(id: string): Promise<ActionResponse> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("candidate_analysis")
    .update({ status: "rejected" })
    .eq("id", id)
    .select("id, status")
    .single();

  if (error || !data) {
    return {
      success: false,
      message: error?.message ?? "Nenhuma análise foi atualizada.",
    };
  }

  revalidatePath("/dashboard/analyses");
  revalidatePath(`/dashboard/analyses/${id}`);
  revalidatePath("/dashboard/pipeline");

  return {
    success: true,
    message: "Candidato reprovado com sucesso!",
    status: "rejected",
  };
}