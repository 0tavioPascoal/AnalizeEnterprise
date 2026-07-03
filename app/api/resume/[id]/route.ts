import { NextRequest, NextResponse } from "next/server";

import { createServerClient } from "@/lib/supabase/server";
import { apiError } from "@/lib/api-response";
import { logger } from "@/lib/logger";
import { fetchWithTimeout } from "@/lib/http";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";

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

    const rateLimit = checkRateLimit({
      key: `resume:download:${user.id}:${getRequestIp(_req)}`,
      limit: 60,
      windowMs: 60 * 60 * 1000,
    });

    if (!rateLimit.success) {
      logger.warn("resume.download.rate_limited", {
        userId: user.id,
      });

      return apiError("Muitos downloads em sequência. Tente novamente mais tarde.", 429);
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
      .select("id, company_id, resume_file_path, resume_file_name, resume_mime_type")
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

    const response = await fetchWithTimeout(data.signedUrl, {}, 30000);

    if (!response.ok) {
      logger.warn("resume.download.fetch_failed", {
        companyId: profile.company_id,
        userId: user.id,
        analysisId: analysis.id,
        status: response.status,
      });

      return apiError("Erro ao baixar currículo.", 500);
    }

    const fileBuffer = await response.arrayBuffer();
    const fileName = sanitizeDownloadFileName(
      analysis.resume_file_name ?? "curriculo.pdf",
    );

    return new NextResponse(fileBuffer, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Type": analysis.resume_mime_type ?? "application/pdf",
      },
    });
  } catch (error) {
    logger.error("resume.download.unhandled", error);

    return apiError("Erro interno ao gerar download.", 500);
  }
}

function sanitizeDownloadFileName(fileName: string): string {
  const sanitized = fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .toLowerCase();

  return sanitized.endsWith(".pdf") ? sanitized : `${sanitized}.pdf`;
}
