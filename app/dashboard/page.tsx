import { Clock, FileText, Target, XCircle } from "lucide-react";

import { getDashboardOverview } from "@/actions/dashboard/getDashboadOverview";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { WeeklyFlowCard } from "@/components/dashboard/WeeklyFlowCard";
import { RecentActivityCard } from "@/components/dashboard/RecentActivityCard";
import { DecisionQueueCard } from "@/components/dashboard/EliteRankingCard";

export default async function DashboardPage() {
  const overview = await getDashboardOverview();

  return (
    <div className="custom-scrollbar flex h-full w-full flex-col gap-5 overflow-y-auto bg-muted/40 p-4 pt-20 md:gap-6 md:p-6">
      <DashboardHeader />

      <section className="grid shrink-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Analisado"
          value={overview.totalAnalyzed}
          description="Currículos processados"
          icon={FileText}
          color="indigo"
        />

        <StatCard
          title="Match Alto"
          value={overview.highMatches}
          description="Score acima de 70%"
          icon={Target}
          color="emerald"
        />

        <StatCard
          title="Abaixo do Perfil"
          value={overview.belowProfile}
          description="Score abaixo de 70%"
          icon={XCircle}
          color="rose"
        />

        <StatCard
          title="Pendentes"
          value={overview.pending}
          description="Aguardando decisão"
          icon={Clock}
          color="amber"
        />
      </section>

      <main className="grid min-h-0 flex-1 grid-cols-12 gap-6">
        <div className="col-span-12 flex min-h-0 flex-col gap-6 xl:col-span-8">
          <WeeklyFlowCard data={overview.weeklyFlow} />
          <RecentActivityCard analyses={overview.recentAnalyses} />
        </div>

        <DecisionQueueCard candidates={overview.pendingAnalyses} />
      </main>
    </div>
  );
}
