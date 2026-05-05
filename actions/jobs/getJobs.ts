"use server";

import { createServerClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/actions/auth/getCurrentProfile";
import type { Job } from "@/types/jobs/job";

export async function getJobs(): Promise<Job[]> {
  const supabase = await createServerClient();
  const currentProfile = await getCurrentProfile();

  if (!currentProfile) return [];

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("company_id", currentProfile.company_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar vagas:", error);
    return [];
  }

  return data as Job[];
}