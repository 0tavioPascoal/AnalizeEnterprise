"use server";

import { createClient } from "@/lib/supabase/client";

export async function rejectAnalysis(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("candidate_analysis")
    .update({ status: "rejected" })
    .eq("id", id);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Reprovado com sucesso",
  };
}