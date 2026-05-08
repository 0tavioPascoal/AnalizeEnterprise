import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

const N8N_WEBHOOK_URL = process.env.N8N_ANALYZE_WEBHOOK_URL!;

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

    if (typeof jobId !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Job inválido.",
        },
        { status: 400 },
      );
    }

    const { data: job, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", jobId)
      .single();

    if (error || !job) {
      return NextResponse.json(
        {
          success: false,
          message: "Vaga não encontrada.",
        },
        { status: 404 },
      );
    }

    const n8nFormData = new FormData();

    n8nFormData.append("file", file);
    n8nFormData.append("job", JSON.stringify(job));

    let response: Response;

    try {
      response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        body: n8nFormData,
      });
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Erro de conexão com o n8n.",
        },
        { status: 500 },
      );
    }

    if (!response.ok) {
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