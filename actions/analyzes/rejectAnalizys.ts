"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";
import { getEmailTemplateByType } from "@/actions/email/mail-templates";
import { getOptionalEnv } from "@/lib/env";
import { logger } from "@/lib/logger";
import { postWebhook } from "@/lib/webhook";

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

    const webhookUrl = getOptionalEnv("N8N_CANDIDATE_EMAIL_WEBHOOK_URL");

    if (!webhookUrl) {
      logger.warn("candidate.reject.webhook_missing", {
        analysisId: id,
      });

      return {
        success: false,
        message: "Serviço de e-mail não configurado.",
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
      if (analysisError) {
        logger.error("candidate.reject.analysis_lookup_failed", analysisError, {
          analysisId: id,
        });
      }

      return {
        success: false,
        message: "Análise não encontrada.",
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

    const webhookResult = await postWebhook<N8nResponse>({
      url: webhookUrl,
      operation: "candidate.reject.webhook",
      headers: {
        "Content-Type": "application/json",
      },
      payload,
      metadata: {
        analysisId: analysis.id,
        companyId: analysis.company_id,
        jobId: job.id,
      },
    });

    if (!webhookResult.ok) {
      return {
        success: false,
        message: "Não foi possível concluir o envio. Tente novamente.",
      };
    }

    if (!webhookResult.data?.success) {
      logger.warn("candidate.reject.webhook_unconfirmed", {
        analysisId: analysis.id,
        companyId: analysis.company_id,
        jobId: job.id,
        webhookMessage: webhookResult.data?.message,
      });

      return {
        success: false,
        message: "Não foi possível confirmar o envio. Tente novamente.",
      };
    }

    const { data, error } = await supabase
      .from("candidate_analysis")
      .update({
        status: "rejected",
        pipeline_stage: "rejected",
      })
      .eq("id", id)
      .select(
        `
        id,
        status,
        pipeline_stage
      `,
      )
      .single();

    if (error || !data) {
      if (error) {
        logger.error("candidate.reject.update_failed", error, {
          analysisId: id,
          companyId: analysis.company_id,
        });
      }

      return {
        success: false,
        message: "Nenhuma análise foi atualizada.",
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
    logger.error("candidate.reject.unhandled", error, {
      analysisId: id,
    });

    return {
      success: false,
      message: "Erro ao reprovar candidato.",
    };
  }
}
