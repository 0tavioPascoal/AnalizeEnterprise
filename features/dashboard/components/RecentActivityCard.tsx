import { FileText } from "lucide-react";

import type { DashboardAnalysisItem } from "@/features/dashboard/server/get-dashboard-overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityRow } from "@/features/dashboard/components/ActivityRow";

interface RecentActivityCardProps {
  analyses: DashboardAnalysisItem[];
}

export function RecentActivityCard({
  analyses,
}: RecentActivityCardProps) {
  return (
    <Card className="flex min-h-72 flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/85 py-0 shadow-sm transition-all duration-300 hover:border-primary/20 hover:bg-card hover:shadow-md xl:min-h-0 xl:flex-[0.52]">
      <CardHeader className="shrink-0 border-b border-border/40 bg-muted/10 px-4 py-3 md:px-5">
        <CardTitle className="text-xs font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
          Atividade Recente
        </CardTitle>
      </CardHeader>

      <CardContent className="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-0">
        {analyses.length > 0 ? (
          <div className="divide-y divide-border/50">
            {analyses.map((analysis) => (
              <ActivityRow key={analysis.id} analysis={analysis} />
            ))}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 py-8 text-center text-muted-foreground">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <FileText size={20} />
            </div>

            <p className="text-sm font-bold text-foreground">
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
