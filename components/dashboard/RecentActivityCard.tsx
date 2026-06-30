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
    <Card className="flex min-h-80 flex-col overflow-hidden border border-border bg-card shadow-sm xl:min-h-0 xl:flex-[0.55]">
      <CardHeader className="shrink-0 border-b border-border px-5 py-4">
        <CardTitle className="text-sm font-extrabold uppercase tracking-wide text-muted-foreground">
          Atividade Recente
        </CardTitle>
      </CardHeader>

      <CardContent className="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-0">
        {analyses.length > 0 ? (
          <div className="divide-y divide-border">
            {analyses.map((analysis) => (
              <ActivityRow key={analysis.id} analysis={analysis} />
            ))}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 py-8 text-center text-muted-foreground">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
              <FileText size={24} />
            </div>

            <p className="text-base font-bold text-foreground">
              Nenhuma atividade recente.
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              As novas análises aparecerão aqui automaticamente.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
