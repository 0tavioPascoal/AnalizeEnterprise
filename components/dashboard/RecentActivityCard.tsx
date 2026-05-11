import { FileText } from "lucide-react";

import type { DashboardAnalysisItem } from "@/actions/dashboard/getDashboadOverview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityRow } from "@/components/dashboard/ActivityRow";

interface RecentActivityCardProps {
  analyses: DashboardAnalysisItem[];
}

export function RecentActivityCard({
  analyses,
}: RecentActivityCardProps) {
  return (
    <Card className="flex min-h-0 flex-[0.55] flex-col overflow-hidden border-none bg-white shadow-sm dark:bg-zinc-900">
      <CardHeader className="shrink-0 border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
        <CardTitle className="text-sm font-extrabold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Atividade Recente
        </CardTitle>
      </CardHeader>

      <CardContent className="min-h-0 flex-1 overflow-y-auto p-0">
        {analyses.length > 0 ? (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {analyses.map((analysis) => (
              <ActivityRow key={analysis.id} analysis={analysis} />
            ))}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center text-zinc-400">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
              <FileText size={24} />
            </div>

            <p className="text-base font-bold text-zinc-700 dark:text-zinc-200">
              Nenhuma atividade recente.
            </p>

            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              As novas análises aparecerão aqui automaticamente.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}