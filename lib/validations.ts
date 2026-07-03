import { z } from "zod";

export const jobFormSchema = z.object({
  title: z.string().trim().min(1, "Título obrigatório."),
  seniority: z.string().trim().min(1).default("Pleno"),
  contract_type: z.string().trim().min(1).default("CLT"),
  score_min: z.coerce.number().min(0).max(100).default(70),
  skills: z.string().trim().optional(),
  context: z.string().trim().min(1, "Contexto obrigatório."),
});

export const analysisRequestSchema = z.object({
  job_id: z.string().uuid("Vaga inválida."),
});

export const interviewGenerateSchema = z.object({
  analysis_id: z.string().uuid("Análise inválida."),
});

export type JobFormValues = z.infer<typeof jobFormSchema>;
