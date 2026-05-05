import type { DashboardAnalysisItem } from "@/actions/dashboard/getDashboadOverview";

interface RankingItemProps {
  rank: number;
  candidate: DashboardAnalysisItem;
}

export function RankingItem({ rank, candidate }: RankingItemProps) {
  const formattedRank = rank < 10 ? `0${rank}` : String(rank);

  return (
    <div className="flex items-center gap-4">
      <span className="w-6 shrink-0 text-xl font-black text-zinc-700">
        {formattedRank}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-bold text-zinc-100">
          {candidate.candidate_name ?? "Candidato sem nome"}
        </p>
        <p className="truncate text-[9px] uppercase tracking-tighter text-zinc-500">
          {candidate.job_title ?? "Vaga não encontrada"}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end">
        <span className="text-xs font-black text-indigo-400">
          {candidate.score}%
        </span>

        <div className="mt-1 h-1 w-10 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full bg-indigo-500"
            style={{ width: `${candidate.score}%` }}
          />
        </div>
      </div>
    </div>
  );
}