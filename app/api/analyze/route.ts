import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

const N8N_WEBHOOK_URL = process.env.N8N_ANALYZE_WEBHOOK_URL;

export async function POST(req: NextRequest) {
  const supabase = await createServerClient();

  const formData = await req.formData();

  const file = formData.get("file");
  const jobId = formData.get("job_id");

  if (!(file instanceof File)) {
    return NextResponse.json({ success: false, message: "Arquivo inválido" }, { status: 400 });
  }

  if (typeof jobId !== "string") {
    return NextResponse.json({ success: false, message: "Job inválido" }, { status: 400 });
  }

  const { data: job, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .single();

  if (error || !job) {
    return NextResponse.json({ success: false, message: "Vaga não encontrada" }, { status: 404 });
  }

  const n8nFormData = new FormData();
  n8nFormData.append("file", file);
  n8nFormData.append("job", JSON.stringify(job));

  const response = await fetch(N8N_WEBHOOK_URL!, {
    method: "POST",
    body: n8nFormData,
  });

  const result = await response.json().catch(() => null);

  return NextResponse.json({
    success: true,
    data: result,
  });
}