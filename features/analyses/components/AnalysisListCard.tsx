import {
  AlertTriangle,
  CheckCircle2,
  MessageCircle,
  XCircle,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/supabase/utils";

interface AnalysisListCardProps {
  title: string;
  items?: string[] | null;
  type: "success" | "warning" | "question";
}

type ListTone = "emerald" | "amber" | "sky" | "rose";

const styles: Record<
  ListTone,
  {
    iconBox: string;
    badge: string;
    chip: string;
  }
> = {
  emerald: {
    iconBox:
      "bg-emerald-500/[0.08] text-emerald-600 dark:bg-emerald-500/[0.12] dark:text-emerald-300",
    badge:
      "border-emerald-500/15 bg-emerald-500/[0.08] text-emerald-700 dark:text-emerald-300",
    chip:
      "border-emerald-500/15 bg-emerald-500/[0.08] text-emerald-700 dark:text-emerald-300",
  },
  amber: {
    iconBox:
      "bg-amber-500/[0.08] text-amber-600 dark:bg-amber-500/[0.12] dark:text-amber-300",
    badge:
      "border-amber-500/15 bg-amber-500/[0.08] text-amber-700 dark:text-amber-300",
    chip:
      "border-amber-500/15 bg-amber-500/[0.08] text-amber-700 dark:text-amber-300",
  },
  sky: {
    iconBox:
      "bg-sky-500/[0.08] text-sky-600 dark:bg-sky-500/[0.12] dark:text-sky-300",
    badge:
      "border-sky-500/15 bg-sky-500/[0.08] text-sky-700 dark:text-sky-300",
    chip:
      "border-sky-500/15 bg-sky-500/[0.08] text-sky-700 dark:text-sky-300",
  },
  rose: {
    iconBox:
      "bg-rose-500/[0.08] text-rose-600 dark:bg-rose-500/[0.12] dark:text-rose-300",
    badge:
      "border-rose-500/15 bg-rose-500/[0.08] text-rose-700 dark:text-rose-300",
    chip:
      "border-rose-500/15 bg-rose-500/[0.08] text-rose-700 dark:text-rose-300",
  },
};

export function AnalysisListCard({
  title,
  items,
  type,
}: AnalysisListCardProps) {
  const normalizedItems = normalizeItems(items);
  const config = getCardConfig(title, type);
  const style = styles[config.tone];
  const Icon = config.icon;

  return (
    <section className="overflow-hidden rounded-2xl border border-border/50 bg-card/85 shadow-sm transition-all duration-300 hover:border-primary/20 hover:bg-card hover:shadow-md">
      <div className="border-b border-border/40 bg-muted/10 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                style.iconBox,
              )}
            >
              <Icon size={17} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground/80">
                {config.category}
              </p>

              <h3 className="mt-0.5 text-base font-black text-foreground">
                {title}
              </h3>

              <p className="mt-0.5 line-clamp-1 text-xs leading-5 text-muted-foreground">
                {config.description}
              </p>
            </div>
          </div>

          <div
            className={cn(
              "shrink-0 rounded-lg border px-2 py-0.5 text-[11px] font-black",
              style.badge,
            )}
          >
            {normalizedItems.length}
          </div>
        </div>
      </div>

      <div className="p-3.5">
        {normalizedItems.length > 0 ? (
          <CompactItems
            items={normalizedItems}
            icon={Icon}
            style={style}
            numbered={type === "question"}
          />
        ) : (
          <EmptyState message={config.emptyMessage} />
        )}
      </div>
    </section>
  );
}

function CompactItems({
  items,
  icon: Icon,
  style,
  numbered,
}: {
  items: string[];
  icon: LucideIcon;
  style: (typeof styles)[ListTone];
  numbered?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className={cn(
            `
            inline-flex max-w-full items-center gap-1.5
            rounded-xl border px-2.5 py-1.5
            text-xs font-black leading-5
            transition-all duration-200
            hover:-translate-y-0.5 hover:shadow-sm
            `,
            style.chip,
          )}
          title={item}
        >
          {numbered ? (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-md bg-white/60 px-1 text-[10px] font-black dark:bg-zinc-950/30">
              {index + 1}
            </span>
          ) : (
            <Icon size={13} className="shrink-0" />
          )}

          <span className="max-w-[220px] truncate">{item}</span>
        </span>
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border/60 bg-muted/15 p-4 text-center">
      <p className="text-xs font-semibold leading-5 text-muted-foreground/80">
        {message}
      </p>
    </div>
  );
}

function getCardConfig(
  title: string,
  type: AnalysisListCardProps["type"],
): {
  icon: LucideIcon;
  tone: ListTone;
  category: string;
  description: string;
  emptyMessage: string;
} {
  const normalizedTitle = title.toLowerCase();

  if (type === "question") {
    return {
      icon: MessageCircle,
      tone: "sky",
      category: "Entrevista",
      description: "Perguntas iniciais para validação.",
      emptyMessage: "Nenhuma pergunta inicial foi gerada.",
    };
  }

  if (normalizedTitle.includes("ausente")) {
    return {
      icon: XCircle,
      tone: "rose",
      category: "Gaps",
      description: "Competências não evidenciadas.",
      emptyMessage: "Nenhuma skill ausente foi identificada.",
    };
  }

  if (normalizedTitle.includes("risco")) {
    return {
      icon: AlertTriangle,
      tone: "rose",
      category: "Riscos",
      description: "Pontos que podem impactar a aderência.",
      emptyMessage: "Nenhum risco relevante foi identificado.",
    };
  }

  if (
    normalizedTitle.includes("atenção") ||
    normalizedTitle.includes("fraco") ||
    normalizedTitle.includes("fraqueza")
  ) {
    return {
      icon: AlertTriangle,
      tone: "amber",
      category: "Atenção",
      description: "Lacunas para validar com cuidado.",
      emptyMessage: "Nenhum ponto de atenção foi identificado.",
    };
  }

  if (type === "success") {
    return {
      icon: CheckCircle2,
      tone: "emerald",
      category: "Evidências",
      description: "Pontos positivos encontrados.",
      emptyMessage: "Nenhum item positivo foi identificado.",
    };
  }

  return {
    icon: AlertTriangle,
    tone: "amber",
    category: "Atenção",
    description: "Itens que exigem validação.",
    emptyMessage: "Nenhum item encontrado.",
  };
}

function normalizeItems(items?: string[] | null) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => item?.trim())
    .filter((item): item is string => Boolean(item));
}
