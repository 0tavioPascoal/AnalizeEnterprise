import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

const N8N_WEBHOOK_URL = process.env.N8N_ANALYZE_WEBHOOK_URL!;
const RESUME_BUCKET = "candidate-cvs";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClient();

    if (!N8N_WEBHOOK_URL) {
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
    const jobId = formData.get("job_id");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "Arquivo inválido.",
        },
        { status: 400 },
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        {
          success: false,
          message: "Apenas arquivos PDF são permitidos.",
        },
        { status: 400 },
      );
    }

    if (typeof jobId !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Job inválido.",
        },
        { status: 400 },
      );
    }

    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", jobId)
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

    const safeFileName = file.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9._-]/g, "-")
      .toLowerCase();

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
          message: uploadError.message,
        },
        { status: 500 },
      );
    }

    const n8nFormData = new FormData();

    n8nFormData.append("file", file);
    n8nFormData.append("job", JSON.stringify(job));
    n8nFormData.append("analysis_id", analysisId);
    n8nFormData.append("company_id", profile.company_id);
    n8nFormData.append("resume_file_path", filePath);
    n8nFormData.append("resume_file_name", file.name);
    n8nFormData.append("resume_file_size", String(file.size));
    n8nFormData.append("resume_mime_type", file.type);

    let response: Response;

    try {
      response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        body: n8nFormData,
      });
    } catch {
      await supabase.storage.from(RESUME_BUCKET).remove([filePath]);

      return NextResponse.json(
        {
          success: false,
          message: "Erro de conexão com o n8n.",
        },
        { status: 500 },
      );
    }

    if (!response.ok) {
      await supabase.storage.from(RESUME_BUCKET).remove([filePath]);

      return NextResponse.json(
        {
          success: false,
          message: `n8n retornou erro HTTP ${response.status}.`,
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
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Erro interno do servidor.",
      },
      { status: 500 },
    );
  }
}