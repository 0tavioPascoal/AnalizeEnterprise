import {
  CheckCircle2,
  AlertTriangle,
  MessageCircle,
} from "lucide-react";

export function AnalysisListCard({
  title,
  items,
  type,
}: {
  title: string;
  items: string[];
  type: "success" | "warning" | "question";
}) {
  const Icon =
    type === "success"
      ? CheckCircle2
      : type === "warning"
      ? AlertTriangle
      : MessageCircle;

  return (
    <div className="border rounded-2xl p-6 bg-white dark:bg-zinc-900">
      <p className="text-xs uppercase text-zinc-400 mb-4">{title}</p>

      {items.length > 0 ? (
        items.map((item, i) => (
          <div key={i} className="flex gap-2 text-sm mb-2">
            <Icon size={16} />
            {item}
          </div>
        ))
      ) : (
        <p className="text-xs text-zinc-400">Nenhum item</p>
      )}
    </div>
  );
}