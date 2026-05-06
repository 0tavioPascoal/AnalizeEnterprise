import { CheckCircle2, AlertTriangle, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalysisListCardProps {
  title: string;
  items: string[];
  type: "success" | "warning" | "question";
}

const styles = {
  success: {
    card: "border-emerald-500/20 bg-emerald-500/[0.04] dark:bg-emerald-500/[0.06]",
    iconBox: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
    title: "text-emerald-700 dark:text-emerald-300",
    itemIcon: "text-emerald-600 dark:text-emerald-400",
  },
  warning: {
    card: "border-amber-500/20 bg-amber-500/[0.05] dark:bg-amber-500/[0.06]",
    iconBox: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
    title: "text-amber-700 dark:text-amber-300",
    itemIcon: "text-amber-600 dark:text-amber-400",
  },
  question: {
    card: "border-sky-500/20 bg-sky-500/[0.05] dark:bg-sky-500/[0.06]",
    iconBox: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
    title: "text-sky-700 dark:text-sky-300",
    itemIcon: "text-sky-600 dark:text-sky-400",
  },
};

export function AnalysisListCard({
  title,
  items,
  type,
}: AnalysisListCardProps) {
  const Icon =
    type === "success"
      ? CheckCircle2
      : type === "warning"
        ? AlertTriangle
        : MessageCircle;

  const style = styles[type];

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 shadow-sm transition-all",
        "hover:-translate-y-0.5 hover:shadow-md",
        style.card,
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl",
              style.iconBox,
            )}
          >
            <Icon size={18} />
          </div>

          <div>
            <p
              className={cn(
                "text-[10px] font-black uppercase tracking-widest",
                style.title,
              )}
            >
              {title}
            </p>

            <p className="mt-0.5 text-xs text-muted-foreground">
              {items.length} {items.length === 1 ? "item" : "itens"}
            </p>
          </div>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex gap-3 rounded-xl border border-border/60 bg-card/70 p-3 text-sm text-foreground"
            >
              <Icon size={16} className={cn("mt-0.5 shrink-0", style.itemIcon)} />
              <span className="leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-card/60 p-4 text-center">
          <p className="text-xs font-medium text-muted-foreground">
            Nenhum item encontrado.
          </p>
        </div>
      )}
    </div>
  );
}