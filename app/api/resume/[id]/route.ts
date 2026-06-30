import { NextRequest, NextResponse } from "next/server";

import { createServerClient } from "@/lib/supabase/server";
import { apiError } from "@/lib/api-response";
import { logger } from "@/lib/logger";

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
      return apiError("Usuário não autenticado.", 401);
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("company_id")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.company_id) {
      return apiError("Empresa do usuário não encontrada.", 403);
    }

    const { data: analysis, error: analysisError } = await supabase
      .from("candidate_analysis")
      .select("id, company_id, resume_file_path")
      .eq("id", id)
      .eq("company_id", profile.company_id)
      .single();

    if (analysisError || !analysis) {
      return apiError("Análise não encontrada.", 404);
    }

    if (!analysis.resume_file_path) {
      return apiError("Currículo não encontrado para esta análise.", 404);
    }

    const { data, error: signedUrlError } = await supabase.storage
      .from(RESUME_BUCKET)
      .createSignedUrl(analysis.resume_file_path, 60);

    if (signedUrlError || !data?.signedUrl) {
      logger.error("resume.signed_url_failed", signedUrlError, {
        companyId: profile.company_id,
        userId: user.id,
        analysisId: analysis.id,
      });

      return apiError("Erro ao gerar link do currículo.", 500);
    }

    return NextResponse.json({
      success: true,
      url: data.signedUrl,
    });
  } catch (error) {
    logger.error("resume.download.unhandled", error);

    return apiError("Erro interno ao gerar download.", 500);
  }
}
