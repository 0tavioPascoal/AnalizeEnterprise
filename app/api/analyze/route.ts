import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getOptionalEnv } from "@/lib/env";
import { fetchWithTimeout } from "@/lib/http";
import { analysisRequestSchema } from "@/lib/validations";

const RESUME_BUCKET = "candidate-cvs";
const MAX_RESUME_SIZE_BYTES = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClient();
    const n8nWebhookUrl = getOptionalEnv("N8N_ANALYZE_WEBHOOK_URL");

    if (!n8nWebhookUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Webhook do n8n não configurado.",
        },
        { status: 500 },
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Usuário não autenticado.",
        },
        { status: 401 },
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("company_id")
      .eq("id", user.id)
      .single();

    if (!profile?.company_id) {
      return NextResponse.json(
        {
          success: false,
          message: "Empresa do usuário não encontrada.",
        },
        { status: 403 },
      );
    }

    const formData = await req.formData();

    const file = formData.get("file");
    const parsedBody = analysisRequestSchema.safeParse({
      job_id: formData.get("job_id"),
    });

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "Arquivo inválido.",
        },
        { status: 400 },
      );
    }

    const safeFileName = file.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9._-]/g, "-")
      .toLowerCase();

    if (file.type !== "application/pdf" || !safeFileName.endsWith(".pdf")) {
      return NextResponse.json(
        {
          success: false,
          message: "Apenas arquivos PDF são permitidos.",
        },
        { status: 400 },
      );
    }

    if (file.size > MAX_RESUME_SIZE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          message: "O arquivo deve ter no máximo 10MB.",
        },
        { status: 400 },
      );
    }

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsedBody.error.issues[0]?.message ?? "Vaga inválida.",
        },
        { status: 400 },
      );
    }

    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("id, title, context, score_min, seniority, contract_type, skills")
      .eq("id", parsedBody.data.job_id)
      .eq("company_id", profile.company_id)
      .single();

    if (jobError || !job) {
      return NextResponse.json(
        {
          success: false,
          message: "Vaga não encontrada.",
        },
        { status: 404 },
      );
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
      return NextResponse.json(
        {
          success: false,
              message: "Erro ao enviar currículo.",
        },
        { status: 500 },
      );
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

    let response: Response;

    try {
      response = await fetchWithTimeout(n8nWebhookUrl, {
        method: "POST",
        body: n8nFormData,
      });
    } catch {
      await supabase.storage.from(RESUME_BUCKET).remove([filePath]);

      return NextResponse.json(
        {
          success: false,
          message: "Erro de conexão com o serviço de análise.",
        },
        { status: 500 },
      );
    }

    if (!response.ok) {
      await supabase.storage.from(RESUME_BUCKET).remove([filePath]);

      return NextResponse.json(
        {
          success: false,
          message: "Serviço de análise retornou erro.",
        },
        { status: 500 },
      );
    }

    const result = await response.json().catch(() => null);

    return NextResponse.json({
      success: true,
      data: result,
      resume: {
        analysis_id: analysisId,
        file_path: filePath,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
      },
    });
  } catch (error) {
    console.error("Analyze API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erro interno do servidor.",
      },
      { status: 500 },
    );
  }
}
