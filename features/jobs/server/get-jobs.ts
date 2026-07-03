"use server";

import "server-only";

import { createServerClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/features/auth/server/current-profile";
import { logger } from "@/lib/logger";
import type { Job } from "@/types/jobs/job";

export async function getJobs(): Promise<Job[]> {
  const supabase = await createServerClient();
  const currentProfile = await getCurrentProfile();

  if (!currentProfile) return [];

  const { data, error } = await supabase
    .from("jobs")
    .select(
      "id, title, context, score_min, created_at, company_id, contract_type, seniority, skills",
    )
    .eq("company_id", currentProfile.company_id)
    .order("created_at", { ascending: false });

  if (error) {
    logger.error("job.list.failed", error, {
      companyId: currentProfile.company_id,
      userId: currentProfile.id,
    });
    return [];
  }

  return data as Job[];
}
