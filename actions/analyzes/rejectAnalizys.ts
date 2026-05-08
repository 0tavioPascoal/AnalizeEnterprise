"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";
import { getEmailTemplateByType } from "@/actions/email/mail-templates";

interface RejectAnalysisResult {
  success: boolean;
  message: string;
  status?: "rejected";
}

interface N8nResponse {
  success?: boolean;
  message?: string;
}

function renderTemplate(
  value: string,
  variables: Record<string, string>,
): string {
  return value.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (_, key: string) => {
    return variables[key] ?? `{{${key}}}`;
  });
}

export async function rejectAnalysis(
  id: string,
): Promise<RejectAnalysisResult> {
  try {
    const supabase = await createServerClient();

    const webhookUrl = process.env.N8N_CANDIDATE_EMAIL_WEBHOOK_URL;

    if (!webhookUrl) {
      return {
        success: false,
        message: "Webhook do n8n não configurado.",
      };
    }

    const { data: analysis, error: analysisError } = await supabase
      .from("candidate_analysis")
      .select(
        `
        id,
        company_id,
        job_id,
        candidate_name,
        candidate_email,
        score,
        recommendation,
        status,
        jobs (
          id,
          title
        )
      `,
      )
      .eq("id", id)
      .single();

    if (analysisError || !analysis) {
      return {
        success: false,
        message: analysisError?.message ?? "Análise não encontrada.",
      };
    }

    if (analysis.status === "rejected") {
      return {
        success: false,
        message: "Este candidato já está reprovado.",
      };
    }

    if (!analysis.candidate_email) {
      return {
        success: false,
        message: "Candidato sem e-mail cadastrado.",
      };
    }

    const job = Array.isArray(analysis.jobs) ? analysis.jobs[0] : analysis.jobs;

    if (!job?.id || !job?.title) {
      return {
        success: false,
        message: "Vaga não encontrada para esta análise.",
      };
    }

    const template = await getEmailTemplateByType("rejected");

    if (!template) {
      return {
        success: false,
        message: "Template de reprovação não configurado.",
      };
    }

    const { data: company } = await supabase
      .from("companies")
      .select("name")
      .eq("id", analysis.company_id)
      .maybeSingle();

    const variables: Record<string, string> = {
      candidate_name: analysis.candidate_name ?? "Candidato",
      candidate_email: analysis.candidate_email,
      job_title: job.title,
      company_name: company?.name ?? "Empresa",
      score: String(analysis.score ?? ""),
      recommendation: analysis.recommendation ?? "",
    };

    const subject = renderTemplate(template.subject, variables);
    const body = renderTemplate(template.body, variables);

    const payload = {
      event: "candidate.rejected",
      candidate: {
        id: analysis.id,
        name: analysis.candidate_name,
        email: analysis.candidate_email,
        score: analysis.score,
        recommendation: analysis.recommendation,
      },
      job: {
        id: job.id,
        title: job.title,
      },
      email: {
        to: analysis.candidate_email,
        subject,
        body,
      },
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return {
        success: false,
        message: `Erro ao enviar para o n8n. Status HTTP ${response.status}.`,
      };
    }

    const n8nResult = (await response
      .json()
      .catch(() => null)) as N8nResponse | null;

    if (!n8nResult?.success) {
      return {
        success: false,
        message:
          n8nResult?.message ??
          "n8n não confirmou o envio do e-mail. Candidato não foi reprovado.",
      };
    }

    const { data, error } = await supabase
      .from("candidate_analysis")
      .update({
        status: "rejected",
      })
      .eq("id", id)
      .select("id, status")
      .single();

    if (error || !data) {
      return {
        success: false,
        message: error?.message ?? "Nenhuma análise foi atualizada.",
      };
    }

    revalidatePath("/dashboard/analyses");
    revalidatePath(`/dashboard/analyses/${id}`);
    revalidatePath("/dashboard/pipeline");

    return {
      success: true,
      message: "E-mail enviado e candidato reprovado com sucesso.",
      status: "rejected",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Erro ao reprovar candidato.",
    };
  }
}
