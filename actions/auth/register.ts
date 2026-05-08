"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export interface RegisterInput {
  companyName: string;
  name: string;
  email: string;
  password: string;
}

export async function registerCompany(data: RegisterInput) {
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
    throw new Error(companyError.message);
  }

  const { error: profileError } = await supabaseAdmin.from("profiles").insert({
    id: userId,
    email: data.email,
    name: data.name,
    role: "admin",
    company_id: company.id,
  });

  if (profileError) {
    throw new Error(profileError.message);
  }

  return {
    companyId: company.id,
    userId,
  };
}
