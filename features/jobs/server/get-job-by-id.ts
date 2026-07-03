"use server";

import "server-only";

import { createServerClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/features/auth/server/current-profile";

export async function getJobById(id: string) {
  const supabase = await createServerClient();
  const currentProfile = await getCurrentProfile();

  if (!currentProfile) return null;

  const { data, error } = await supabase
    .from("jobs")
    .select("title, seniority, contract_type, score_min, skills, context")
    .eq("id", id)
    .eq("company_id", currentProfile.company_id)
    .single();

  if (error) {
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
