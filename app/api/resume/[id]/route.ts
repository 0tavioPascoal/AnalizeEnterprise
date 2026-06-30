import { NextRequest, NextResponse } from "next/server";

import { createServerClient } from "@/lib/supabase/server";

const RESUME_BUCKET = "candidate-cvs";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;

    const supabase = await createServerClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          message: "Usuário não autenticado.",
        },
        { status: 401 },
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("company_id")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.company_id) {
      return NextResponse.json(
        {
          success: false,
          message: "Empresa do usuário não encontrada.",
        },
        { status: 403 },
      );
    }

    const { data: analysis, error: analysisError } = await supabase
      .from("candidate_analysis")
      .select("id, company_id, resume_file_path")
      .eq("id", id)
      .eq("company_id", profile.company_id)
      .single();

    if (analysisError || !analysis) {
      return NextResponse.json(
        {
          success: false,
          message: "Análise não encontrada.",
        },
        { status: 404 },
      );
    }

    if (!analysis.resume_file_path) {
      return NextResponse.json(
        {
          success: false,
          message: "Currículo não encontrado para esta análise.",
        },
        { status: 404 },
      );
    }

    const { data, error: signedUrlError } = await supabase.storage
      .from(RESUME_BUCKET)
      .createSignedUrl(analysis.resume_file_path, 60);

    if (signedUrlError || !data?.signedUrl) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Erro ao gerar link do currículo.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      url: data.signedUrl,
    });
  } catch (error) {
    console.error("Resume API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erro interno ao gerar download.",
      },
      { status: 500 },
    );
  }
}
