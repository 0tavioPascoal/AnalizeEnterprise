import { NextRequest, NextResponse } from "next/server";

import { createServerClient } from "@/lib/supabase/server";
import { getOptionalEnv } from "@/lib/env";
import { fetchWithTimeout } from "@/lib/http";
import { interviewGenerateSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClient();
    const n8nWebhookUrl = getOptionalEnv("N8N_INTERVIEW_WEBHOOK_URL");

    if (!n8nWebhookUrl) {
      return NextResponse.json(
        { success: false, message: "Webhook do n8n não configurado." },
        { status: 500 },
      );
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, message: "Usuário não autenticado." },
        { status: 401 },
      );
    }

    const body = await req.json().catch(() => null);
    const parsedBody = interviewGenerateSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsedBody.error.issues[0]?.message ?? "analysis_id inválido.",
        },
        { status: 400 },
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("company_id, name")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.company_id) {
      return NextResponse.json(
        { success: false, message: "Perfil não encontrado." },
        { status: 403 },
      );
    }

    const { data: analysis, error: analysisError } = await supabase
      .from("candidate_analysis")
      .select("*")
      .eq("id", parsedBody.data.analysis_id)
      .eq("company_id", profile.company_id)
      .single();

    if (analysisError || !analysis) {
      return NextResponse.json(
        { success: false, message: "Análise não encontrada." },
        { status: 404 },
      );
    }

    const { data: job } = await supabase
      .from("jobs")
      .select("*")
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
      return NextResponse.json(
        { success: false, message: "Erro ao criar entrevista." },
        { status: 500 },
      );
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

      return NextResponse.json(
        {
          success: false,
          message: "Entrevista criada, mas houve erro ao atualizar a pipeline.",
        },
        { status: 500 },
      );
    }

    const webhookResponse = await fetchWithTimeout(n8nWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        interview_id: interview.id,
        company_id: profile.company_id,
        analysis,
        job,
        generated_by: {
          id: user.id,
          name: profile.name,
        },
      }),
    });

    if (!webhookResponse.ok) {
      await supabase
        .from("interview_guides")
        .update({
          status: "failed",
        })
        .eq("id", interview.id);

      return NextResponse.json(
        {
          success: false,
          message: "Serviço de entrevista retornou erro.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      interview_id: interview.id,
      already_exists: false,
    });
  } catch (error) {
    console.error("Generate interview API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erro interno ao gerar entrevista.",
      },
      { status: 500 },
    );
  }
}
