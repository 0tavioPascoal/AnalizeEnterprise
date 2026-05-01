"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("KEY:", process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY?.slice(0, 10));

export interface RegisterInput {
  companyName: string;
  name: string;
  email: string;
  password: string;
}

export async function registerCompany(data: RegisterInput) {
  // 👤 1. CREATE AUTH USER FIRST
  const { data: authUser, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });

  if (authError || !authUser?.user) {
    console.error("AUTH ERROR:", authError);
    throw new Error(authError?.message || "Erro ao criar usuário auth");
  }

  const userId = authUser.user.id;

  // 🏢 2. CREATE COMPANY
  const { data: company, error: companyError } = await supabaseAdmin
    .from("companies")
    .insert({
      name: data.companyName,
    })
    .select("id")
    .single();

  if (companyError || !company) {
    console.error("COMPANY ERROR:", companyError);
    throw new Error(companyError.message);
  }

  // 👤 3. CREATE PROFILE (LINKED TO AUTH USER)
  const { error: profileError } = await supabaseAdmin.from("profiles").insert({
    id: userId,
    email: data.email,
    name: data.name,
    role: "admin",
    company_id: company.id,
  });

  if (profileError) {
    console.error("PROFILE ERROR:", profileError);
    throw new Error(profileError.message);
  }

  return {
    companyId: company.id,
    userId,
  };
}
