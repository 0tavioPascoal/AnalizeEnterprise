import { NextRequest, NextResponse } from "next/server";

import { createServerClient } from "@/lib/supabase/server";
import { getOptionalEnv } from "@/lib/env";
import { interviewGenerateSchema } from "@/lib/validations";
import { apiError } from "@/lib/api-response";
import { logger } from "@/lib/logger";
import { postWebhook } from "@/lib/webhook";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClient();
    const n8nWebhookUrl = getOptionalEnv("N8N_INTERVIEW_WEBHOOK_URL");

    if (!n8nWebhookUrl) {
      logger.warn("interview.generate.webhook_missing");
      return apiError("Serviço de entrevista não configurado.", 500);
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return apiError("Usuário não autenticado.", 401);
    }

    const body = await req.json().catch(() => null);
    const parsedBody = interviewGenerateSchema.safeParse(body);

    if (!parsedBody.success) {
      return apiError(
        parsedBody.error.issues[0]?.message ?? "analysis_id inválido.",
        400,
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("company_id, name")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.company_id) {
      return apiError("Perfil não encontrado.", 403);
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
        candidate_phone,
        score,
        passed_minimum_score,
        match,
        recommendation,
        summary,
        status,
        strengths,
        weaknesses,
        matched_skills,
        missing_skills,
        risks,
        interview_questions,
        seniority_assessment,
        contract_fit,
        final_opinion,
        technical_score,
        experience_score,
        seniority_score,
        context_fit_score,
        communication_score,
        ai_feedback,
        pipeline_stage,
        created_at
        `,
      )
      .eq("id", parsedBody.data.analysis_id)
      .eq("company_id", profile.company_id)
      .single();

    if (analysisError || !analysis) {
      return apiError("Análise não encontrada.", 404);
    }

    const { data: job } = await supabase
      .from("jobs")
      .select("id, title, context, score_min, company_id, contract_type, seniority, skills")
      .eq("id", analysis.job_id)
      .eq("company_id", profile.company_id)
      .maybeSingle();

    const { data: existingInterview } = await supabase
      .from("interview_guides")
      .select("id, status")
      .eq("analysis_id", analysis.id)
      .eq("company_id", profile.company_id)
      .maybeSingle();

    if (existingInterview) {
      await supabase
        .from("candidate_analysis")
        .update({
          pipeline_stage: "interview",
        })
        .eq("id", analysis.id)
        .eq("company_id", profile.company_id);

      return NextResponse.json({
        success: true,
        interview_id: existingInterview.id,
        already_exists: true,
      });
    }

    const { data: interview, error: interviewError } = await supabase
      .from("interview_guides")
      .insert({
        company_id: profile.company_id,
        analysis_id: analysis.id,
        job_id: analysis.job_id,
        title: `Entrevista - ${analysis.candidate_name ?? "Candidato"}`,
        status: "generating",
        content: {},
        created_by: user.id,
      })
      .select()
      .single();

    if (interviewError || !interview) {
      logger.error("interview.generate.insert_failed", interviewError, {
        companyId: profile.company_id,
        userId: user.id,
        analysisId: analysis.id,
      });

      return apiError("Erro ao criar entrevista.", 500);
    }

    const { error: pipelineError } = await supabase
      .from("candidate_analysis")
      .update({
        pipeline_stage: "interview",
      })
      .eq("id", analysis.id)
      .eq("company_id", profile.company_id);

    if (pipelineError) {
      await supabase
        .from("interview_guides")
        .update({
          status: "failed",
        })
        .eq("id", interview.id);

      logger.error("interview.generate.pipeline_update_failed", pipelineError, {
        companyId: profile.company_id,
        userId: user.id,
        analysisId: analysis.id,
        interviewId: interview.id,
      });

      return apiError("Erro ao atualizar a pipeline da entrevista.", 500);
    }

    const webhookResult = await postWebhook({
      url: n8nWebhookUrl,
      operation: "interview.generate.webhook",
      headers: {
        "Content-Type": "application/json",
      },
      payload: {
        interview_id: interview.id,
        company_id: profile.company_id,
        analysis,
        job,
        generated_by: {
          id: user.id,
          name: profile.name,
        },
      },
      metadata: {
        companyId: profile.company_id,
        userId: user.id,
        analysisId: analysis.id,
        interviewId: interview.id,
      },
    });

    if (!webhookResult.ok) {
      await supabase
        .from("interview_guides")
        .update({
          status: "failed",
        })
        .eq("id", interview.id);

      return apiError("Serviço de entrevista indisponível. Tente novamente.", 500);
    }

    return NextResponse.json({
      success: true,
      interview_id: interview.id,
      already_exists: false,
    });
  } catch (error) {
    logger.error("interview.generate.unhandled", error);

    return apiError("Erro interno ao gerar entrevista.", 500);
  }
}
