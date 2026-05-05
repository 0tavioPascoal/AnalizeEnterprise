import { FileText } from "lucide-react";

import type { DashboardAnalysisItem } from "@/actions/dashboard/getDashboadOverview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityRow } from "@/components/dashboard/ActivityRow";

interface RecentActivityCardProps {
  analyses: DashboardAnalysisItem[];
}

export function RecentActivityCard({ analyses }: RecentActivityCardProps) {
  return (
    <Card className="flex min-h-0 flex-[0.55] flex-col overflow-hidden border-none bg-white shadow-sm dark:bg-zinc-900">
      <CardHeader className="shrink-0 border-b border-zinc-50 px-4 py-3 dark:border-zinc-800">
        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          Atividade Recente
        </CardTitle>
      </CardHeader>

      <CardContent className="min-h-0 flex-1 overflow-y-auto p-0">
        {analyses.length > 0 ? (
          <div className="divide-y divide-zinc-50 dark:divide-zinc-800">
            {analyses.map((analysis) => (
              <ActivityRow key={analysis.id} analysis={analysis} />
            ))}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-zinc-400">
            <FileText size={22} className="mb-2" />
            <p className="text-sm font-medium">Nenhuma atividade recente.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}