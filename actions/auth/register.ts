"use server";

import { createAdminClient } from "@/lib/supabase/admin";

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
    throw new Error(authError?.message || "Erro ao criar usuário auth");
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
    throw new Error(companyError?.message ?? "Erro ao criar empresa");
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
    throw new Error(profileError.message);
  }

  return {
    companyId: company.id,
    userId,
  };
}
