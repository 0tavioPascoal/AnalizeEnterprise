import { Target } from "lucide-react";

export function AnalysisScoreCard({ analysis }: any) {
  return (
    <section className="p-8 border rounded-2xl bg-white dark:bg-zinc-900 shadow-sm">
      <div className="flex items-center gap-2 mb-8 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
        <Target size={16} />
        Pontuação por Categoria
      </div>

      <div className="grid gap-6">
        <Bar label="Técnico" value={analysis.technical_score ?? 0} color="bg-indigo-600" />
        <Bar label="Experiência" value={analysis.experience_score ?? 0} color="bg-blue-500" />
        <Bar label="Senioridade" value={analysis.seniority_score ?? 0} color="bg-purple-500" />
        <Bar label="Contexto" value={analysis.context_fit_score ?? 0} color="bg-emerald-500" />
        <Bar label="Comunicação" value={analysis.communication_score ?? 0} color="bg-amber-500" />
      </div>
    </section>
  );
}

function Bar({ label, value, color }: any) {
  return (
    <div>
      <div className="flex justify-between text-xs">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 bg-zinc-200 rounded">
        <div className={`${color} h-2 rounded`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}