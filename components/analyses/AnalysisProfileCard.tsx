import {
  BriefcaseBusiness,
  FileText,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/supabase/utils";

interface AnalysisProfileCardProps {
  analysis: {
    summary?: string | null;
    candidate_name?: string | null;
    candidate_email?: string | null;
    candidate_phone?: string | null;
    candidate_city?: string | null;
    candidate_state?: string | null;
    candidate_country?: string | null;
    job_title?: string | null;
    job_seniority?: string | null;
    job_contract_type?: string | null;
    recommendation?: string | null;
  };
}

export function AnalysisProfileCard({ analysis }: AnalysisProfileCardProps) {
  const summary = analysis.summary?.trim();
  const location = formatLocation({
    city: analysis.candidate_city,
    state: analysis.candidate_state,
    country: analysis.candidate_country,
  });

  return (
    <section className="relative h-full overflow-hidden rounded-[28px] border border-zinc-200/80 bg-white shadow-xl shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900/90">
      <div className="absolute inset-x-0 top-0 h-36 bg-linear-to-b from-indigo-500/10 via-violet-500/5 to-transparent" />
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative z-10 p-6">
        <div className="mb-6 flex flex-col gap-5 border-b border-zinc-200/80 pb-6 dark:border-zinc-800 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 via-violet-500 to-purple-600 text-xl font-black text-white shadow-xl shadow-indigo-500/20">
              {getInitials(analysis.candidate_name ?? "Candidato")}
            </div>

            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge
                  label={formatRecommendation(analysis.recommendation ?? "-")}
                  icon={Sparkles}
                  tone={getRecommendationTone(analysis.recommendation)}
                />
              </div>

              <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
                {analysis.candidate_name ?? "Candidato sem nome"}
              </h2>

              <p className="mt-2 max-w-3xl text-[15px] font-medium leading-7 text-zinc-500 dark:text-zinc-400">
                Perfil analisado pela IA com base na aderência entre currículo,
                vaga, senioridade, skills e contexto de contratação.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 lg:justify-end">
            <InfoPill
              icon={BriefcaseBusiness}
              label={analysis.job_title ?? "Vaga não identificada"}
            />

            <InfoPill
              icon={ShieldCheck}
              label={analysis.job_seniority ?? "Senioridade não informada"}
            />
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-[24px] border border-zinc-200/80 bg-zinc-50/80 p-5 dark:border-zinc-800 dark:bg-zinc-950/40">
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/[0.08] text-violet-600 dark:bg-violet-500/[0.12] dark:text-violet-300">
                <FileText size={19} />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                  Resumo executivo
                </p>

                <h3 className="mt-1 text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                  Análise de perfil
                </h3>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200/70 bg-white/80 p-5 dark:border-zinc-800 dark:bg-zinc-950/40">
              <p className="text-[16px] font-medium leading-8 text-zinc-700 dark:text-zinc-300">
                {summary || "Nenhum resumo gerado."}
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            <InfoCard
              label="E-mail"
              value={analysis.candidate_email ?? "-"}
              icon={Mail}
            />

            <InfoCard
              label="Telefone"
              value={analysis.candidate_phone ?? "-"}
              icon={Phone}
            />

            <InfoCard
              label="Localização"
              value={location}
              icon={MapPin}
            />

            <InfoCard
              label="Contrato"
              value={analysis.job_contract_type ?? "Não informado"}
              icon={UserRound}
              highlight
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoPill({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <div className="inline-flex max-w-full items-center gap-2 rounded-xl border border-zinc-200/80 bg-white/80 px-3.5 py-2 text-sm font-bold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-300">
      <Icon size={15} className="shrink-0" />
      <span className="truncate">{label}</span>
    </div>
  );
}

function InfoCard({
  label,
  value,
  icon: Icon,
  highlight,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        `
        rounded-2xl border p-4
        transition-all duration-200
        hover:-translate-y-0.5 hover:shadow-lg hover:shadow-zinc-900/5
        `,
        highlight
          ? "border-violet-500/20 bg-violet-500/[0.08]"
          : "border-zinc-200/80 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-950/40",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            highlight
              ? "bg-violet-500/[0.12] text-violet-700 dark:text-violet-300"
              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300",
          )}
        >
          <Icon size={17} />
        </div>

        <div className="min-w-0">
          <p
            className={cn(
              "text-xs font-black uppercase tracking-[0.14em]",
              highlight
                ? "text-violet-700 dark:text-violet-300"
                : "text-zinc-500 dark:text-zinc-400",
            )}
          >
            {label}
          </p>

          <p
            className={cn(
              "mt-1 break-words text-[15px] font-bold leading-6",
              highlight
                ? "text-violet-800 dark:text-violet-200"
                : "text-zinc-800 dark:text-zinc-200",
            )}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function Badge({
  label,
  icon: Icon,
  tone,
}: {
  label: string;
  icon: LucideIcon;
  tone: "emerald" | "indigo" | "amber" | "rose" | "zinc";
}) {
  const styles = {
    emerald:
      "border-emerald-500/20 bg-emerald-500/[0.10] text-emerald-700 dark:text-emerald-300",
    indigo:
      "border-indigo-500/20 bg-indigo-500/[0.10] text-indigo-700 dark:text-indigo-300",
    amber:
      "border-amber-500/20 bg-amber-500/[0.10] text-amber-700 dark:text-amber-300",
    rose:
      "border-rose-500/20 bg-rose-500/[0.10] text-rose-700 dark:text-rose-300",
    zinc:
      "border-zinc-500/20 bg-zinc-500/[0.10] text-zinc-700 dark:text-zinc-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em]",
        styles[tone],
      )}
    >
      <Icon size={13} />
      {label}
    </span>
  );
}

function formatLocation({
  city,
  state,
  country,
}: {
  city?: string | null;
  state?: string | null;
  country?: string | null;
}) {
  const parts = [city, state, country]
    .map((item) => item?.trim())
    .filter(Boolean);

  return parts.length > 0 ? parts.join(" - ") : "Localização não informada";
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getRecommendationTone(
  value?: string | null,
): "emerald" | "indigo" | "amber" | "rose" | "zinc" {
  const normalized = value?.toLowerCase();

  if (normalized === "strong_match") {
    return "emerald";
  }

  if (normalized === "match") {
    return "indigo";
  }

  if (normalized === "partial_match") {
    return "amber";
  }

  if (normalized === "no_match") {
    return "rose";
  }

  return "zinc";
}

function formatRecommendation(value: string): string {
  const normalized = value.toLowerCase();

  const labels: Record<string, string> = {
    strong_match: "Match Forte",
    match: "Match",
    partial_match: "Match Parcial",
    no_match: "Sem Match",
    approved: "Aprovado",
    rejected: "Reprovado",
    pending: "Pendente",
    recommended: "Recomendado",
    not_recommended: "Não Recomendado",
  };

  return (
    labels[normalized] ??
    value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
  );
}