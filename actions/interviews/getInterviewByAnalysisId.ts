"use server";

import { createServerClient } from "@/lib/supabase/server";

export async function getInterviewByAnalysisId(analysisId: string) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("interview_guides")
    .select("id, status")
    .eq("analysis_id", analysisId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar entrevista por análise:", error);
    return null;
  }

  return data;
}
