"use server";

import { createClient } from "@/lib/supabase/client";
import { Job } from "@/types/jobs/job";

export async function getJobs(): Promise<Job[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("Erro ao buscar vagas");
  }

  return data ?? [];
}
