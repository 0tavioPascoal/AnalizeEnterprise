import { UserRound, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AnalysisResultCard({ analysis }: any) {
  return (
    <div className="border rounded-2xl p-6 bg-zinc-50/50 dark:bg-zinc-800/30 space-y-4">
      <div className="flex justify-between">
        <span className="text-xs text-zinc-400">Status</span>
        <span className="font-bold">{analysis.match ? "Match" : "Sem match"}</span>
      </div>

      <div className="flex justify-between">
        <span className="text-xs text-zinc-400">Score mínimo</span>
        <span className="font-bold">
          {analysis.passed_minimum_score ? "Aprovado" : "Abaixo"}
        </span>
      </div>

      <Button className="w-full bg-indigo-600 text-white">
        <UserRound size={16} />
        Entrevistar
      </Button>

      <Button variant="outline" className="w-full">
        <XCircle size={16} />
        Reprovar
      </Button>
    </div>
  );
}