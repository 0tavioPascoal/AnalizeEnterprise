"use server";

import { createServerClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import type { UserProfile } from "@/types/user/user";

export async function getUsers(): Promise<UserProfile[]> {
  const supabase = await createServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return [];
  }

  const { data: currentProfile, error: profileError } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", user.id)
    .single();

  if (profileError || !currentProfile?.company_id) {
    return [];
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, email, role, company_id, status")
    .eq("company_id", currentProfile.company_id)
    .order("name", { ascending: true });

  if (error) {
    logger.error("user.list.failed", error, {
      companyId: currentProfile.company_id,
      userId: user.id,
    });
    return [];
  }

  return (data ?? []) as UserProfile[];
}
