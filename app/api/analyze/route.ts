import { NextRequest, NextResponse } from "next/server";

import { createServerClient } from "@/lib/supabase/server";
import { getOptionalEnv } from "@/lib/env";
import { analysisRequestSchema } from "@/lib/validations";
import { apiError } from "@/lib/api-response";
import { logger } from "@/lib/logger";
import { postWebhook } from "@/lib/webhook";

const RESUME_BUCKET = "candidate-cvs";
const MAX_RESUME_SIZE_BYTES = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClient();
    const n8nWebhookUrl = getOptionalEnv("N8N_ANALYZE_WEBHOOK_URL");

    if (!n8nWebhookUrl) {
      logger.warn("analysis.create.webhook_missing");
      return apiError("Serviço de análise não configurado.", 500);
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return apiError("Usuário não autenticado.", 401);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("company_id")
      .eq("id", user.id)
      .single();

    if (!profile?.company_id) {
      return apiError("Empresa do usuário não encontrada.", 403);
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const parsedBody = analysisRequestSchema.safeParse({
      job_id: formData.get("job_id"),
    });

    if (!(file instanceof File)) {
      return apiError("Arquivo inválido.", 400);
    }

    const safeFileName = file.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9._-]/g, "-")
      .toLowerCase();

    if (file.type !== "application/pdf" || !safeFileName.endsWith(".pdf")) {
      return apiError("Apenas arquivos PDF são permitidos.", 400);
    }

    if (file.size > MAX_RESUME_SIZE_BYTES) {
      return apiError("O arquivo deve ter no máximo 10MB.", 400);
    }

    if (!parsedBody.success) {
      return apiError(
        parsedBody.error.issues[0]?.message ?? "Vaga inválida.",
        400,
      );
    }

    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("id, title, context, score_min, seniority, contract_type, skills")
      .eq("id", parsedBody.data.job_id)
      .eq("company_id", profile.company_id)
      .single();

    if (jobError || !job) {
      return apiError("Vaga não encontrada.", 404);
    }

    const analysisId = crypto.randomUUID();
    const filePath = `${profile.company_id}/${analysisId}/${Date.now()}-${safeFileName}`;

    const { error: uploadError } = await supabase.storage
      .from(RESUME_BUCKET)
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      logger.error("analysis.create.upload_failed", uploadError, {
        companyId: profile.company_id,
        userId: user.id,
        analysisId,
        filePath,
      });

      return apiError("Erro ao enviar currículo.", 500);
    }

    const n8nFormData = new FormData();

    n8nFormData.append("file", file);
    n8nFormData.append("job", JSON.stringify(job));
    n8nFormData.append("analysis_id", analysisId);
    n8nFormData.append("company_id", profile.company_id);
    n8nFormData.append("pipeline_stage", "screening");
    n8nFormData.append("resume_file_path", filePath);
    n8nFormData.append("resume_file_name", file.name);
    n8nFormData.append("resume_file_size", String(file.size));
    n8nFormData.append("resume_mime_type", file.type);

    const webhookResult = await postWebhook({
      url: n8nWebhookUrl,
      operation: "analysis.create.webhook",
      body: n8nFormData,
      metadata: {
        companyId: profile.company_id,
        userId: user.id,
        analysisId,
      },
    });

    if (!webhookResult.ok) {
      const { error: cleanupError } = await supabase.storage
        .from(RESUME_BUCKET)
        .remove([filePath]);

      if (cleanupError) {
        logger.error("analysis.create.cleanup_failed", cleanupError, {
          companyId: profile.company_id,
          userId: user.id,
          analysisId,
          filePath,
        });
      }

      return apiError("Serviço de análise indisponível. Tente novamente.", 500);
    }

    return NextResponse.json({
      success: true,
      data: webhookResult.data,
      resume: {
        analysis_id: analysisId,
        file_path: filePath,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
      },
    });
  } catch (error) {
    logger.error("analysis.create.unhandled", error);

    return apiError("Erro interno do servidor.", 500);
  }
}
