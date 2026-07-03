"use server";

import "server-only";

import { createServerClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/features/auth/server/current-profile";
import { logger } from "@/lib/logger";

export async function getInterviewByAnalysisId(analysisId: string) {
  const supabase = await createServerClient();
  const currentProfile = await getCurrentProfile();

  if (!currentProfile) {
    return null;
  }

  const { data, error } = await supabase
    .from("interview_guides")
    .select("id, status")
    .eq("analysis_id", analysisId)
    .eq("company_id", currentProfile.company_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    logger.error("interview.lookup_by_analysis.failed", error, {
      analysisId,
    });
    return null;
  }

  return data;
}
