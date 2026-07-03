"use server";

import "server-only";

import { createServerClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import type {
  CandidateEmailTemplate,
  CandidateEmailTemplateType,
  UpsertCandidateEmailTemplateDTO,
} from "@/types/email/email-template";

async function getCurrentUserCompanyId(): Promise<string> {
  const supabase = await createServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Usuário não autenticado.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile?.company_id) {
    throw new Error("Empresa do usuário não encontrada.");
  }

  return profile.company_id as string;
}

export async function getEmailTemplates(): Promise<CandidateEmailTemplate[]> {
  const supabase = await createServerClient();
  const companyId = await getCurrentUserCompanyId();

  const { data, error } = await supabase
    .from("candidate_email_templates")
    .select("id, company_id, type, subject, body, is_active, created_at, updated_at")
    .eq("company_id", companyId)
    .order("type", { ascending: true });

  if (error) {
    logger.error("email_template.list.failed", error, {
      companyId,
    });
    throw new Error("Erro ao buscar templates de e-mail.");
  }

  return (data ?? []) as CandidateEmailTemplate[];
}

export async function upsertEmailTemplate(
  payload: UpsertCandidateEmailTemplateDTO,
): Promise<CandidateEmailTemplate> {
  const supabase = await createServerClient();
  const companyId = await getCurrentUserCompanyId();

  if (!payload.subject.trim()) {
    throw new Error("O assunto do e-mail é obrigatório.");
  }

  if (!payload.body.trim()) {
    throw new Error("O corpo da mensagem é obrigatório.");
  }

  const { data, error } = await supabase
    .from("candidate_email_templates")
    .upsert(
      {
        company_id: companyId,
        type: payload.type,
        subject: payload.subject,
        body: payload.body,
        is_active: true,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "company_id,type",
      },
    )
    .select("id, company_id, type, subject, body, is_active, created_at, updated_at")
    .single();

  if (error) {
    logger.error("email_template.upsert.failed", error, {
      companyId,
      type: payload.type,
    });
    throw new Error("Erro ao salvar template de e-mail.");
  }

  return data as CandidateEmailTemplate;
}

export async function getEmailTemplateByType(
  type: CandidateEmailTemplateType,
): Promise<CandidateEmailTemplate | null> {
  const supabase = await createServerClient();
  const companyId = await getCurrentUserCompanyId();

  const { data, error } = await supabase
    .from("candidate_email_templates")
    .select("id, company_id, type, subject, body, is_active, created_at, updated_at")
    .eq("company_id", companyId)
    .eq("type", type)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    logger.error("email_template.lookup.failed", error, {
      companyId,
      type,
    });
    throw new Error("Erro ao buscar template de e-mail.");
  }

  return data as CandidateEmailTemplate | null;
}
