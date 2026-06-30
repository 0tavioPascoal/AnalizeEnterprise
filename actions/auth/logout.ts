"use server";

import { createServerClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

export async function logout() {
  const supabase = await createServerClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    logger.error("auth.logout.failed", error);
    throw new Error("Erro ao sair da sessão.");
  }

  return { success: true };
}
