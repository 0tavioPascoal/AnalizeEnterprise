import {
  FileText,
  Mail,
  Phone,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface AnalysisProfileCardProps {
  analysis: {
    summary?: string | null;
    candidate_email?: string | null;
    candidate_phone?: string | null;
    recommendation?: string | null;
  };
}

export function AnalysisProfileCard({
  analysis,
}: AnalysisProfileCardProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      {/* HEADER */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <FileText size={18} />
        </div>

        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-primary">
            Análise de Perfil
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Resumo interpretado pela IA
          </p>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="rounded-2xl border border-border bg-muted/30 p-5">
        <p className="text-sm leading-relaxed text-foreground/90">
          {analysis.summary ?? "Nenhum resumo gerado."}
        </p>
      </div>

      {/* INFO GRID */}
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <Info
          label="E-mail"
          value={analysis.candidate_email ?? "-"}
          icon={Mail}
        />

        <Info
          label="Telefone"
          value={analysis.candidate_phone ?? "-"}
          icon={Phone}
        />

        <Info
          label="Recomendação"
          value={formatRecommendation(
            analysis.recommendation ?? "-",
          )}
          icon={Sparkles}
          highlight
        />
      </div>
    </section>
  );
}

function Info({
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
        "rounded-2xl border p-4 shadow-sm transition-all",
        "hover:-translate-y-0.5 hover:shadow-md",

        highlight
          ? "border-primary/20 bg-primary/6"
          : "border-border bg-muted/30",
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            highlight
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground",
          )}
        >
          <Icon size={15} />
        </div>

        <p
          className={cn(
            "text-[10px] font-black uppercase tracking-widest",
            highlight
              ? "text-primary"
              : "text-muted-foreground",
          )}
        >
          {label}
        </p>
      </div>

      <p
        className={cn(
          "wrap-break-word text-sm font-semibold",
          highlight
            ? "text-primary"
            : "text-foreground",
        )}
      >
        {value}
      </p>
    </div>
  );
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
    value
      .replaceAll("_", " ")
      .replace(/\b\w/g, (l) => l.toUpperCase())
  );
}