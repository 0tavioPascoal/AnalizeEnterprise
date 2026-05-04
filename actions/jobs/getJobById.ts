"use server";

import { createClient } from "@/lib/supabase/client";

export async function getJobById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.log("GET JOB ERROR:", error);
    return null;
  }

  if (!data) return null;

  return {
    title: data.title ?? "",
    seniority: data.seniority ?? "Pleno",
    contract_type: data.contract_type ?? "CLT",
    score_min: data.score_min ?? 0,
    skills: data.skills ?? "",
    context: data.context ?? "",
  };
}
