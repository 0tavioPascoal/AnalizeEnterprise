"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";

export interface RegisterInput {
  companyName: string;
  name: string;
  email: string;
  password: string;
}

export async function registerCompany(data: RegisterInput) {
  const supabaseAdmin = createAdminClient();

  const { data: authUser, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });

  if (authError || !authUser?.user) {
    if (authError) {
      logger.error("auth.register.auth_user_failed", authError, {
        email: data.email,
      });
    }

    throw new Error("Erro ao criar conta.");
  }

  const userId = authUser.user.id;

  const { data: company, error: companyError } = await supabaseAdmin
    .from("companies")
    .insert({
      name: data.companyName,
    })
    .select("id")
    .single();

  if (companyError || !company) {
    await supabaseAdmin.auth.admin.deleteUser(userId);

    if (companyError) {
      logger.error("auth.register.company_failed", companyError, {
        userId,
      });
    }

    throw new Error("Erro ao criar empresa.");
  }

  const { error: profileError } = await supabaseAdmin.from("profiles").insert({
    id: userId,
    email: data.email,
    name: data.name,
    role: "admin",
    company_id: company.id,
  });

  if (profileError) {
    await supabaseAdmin.auth.admin.deleteUser(userId);

    logger.error("auth.register.profile_failed", profileError, {
      userId,
      companyId: company.id,
    });

    throw new Error("Erro ao criar perfil inicial.");
  }

  return {
    companyId: company.id,
    userId,
  };
}
