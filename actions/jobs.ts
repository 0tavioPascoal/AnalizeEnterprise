"use server";

import { createServerClient } from "@/lib/supabase/server";
import type { CreateJobDTO, Job } from "@/types/database";

export async function createJob(data: CreateJobDTO): Promise<Job> {
  const supabase = createServerClient();

  const { data: job, error } = await supabase
    .from("jobs")
    .insert({
      title: data.title,
      context: data.context,
      score_min: data.score_min,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!job) {
    throw new Error("Job não retornado pelo Supabase");
  }

  return job;
}
