import { FileText } from "lucide-react";

export function AnalysisProfileCard({ analysis }: any) {
  return (
    <section className="p-8 border rounded-2xl bg-white dark:bg-zinc-900 shadow-sm">
      <div className="flex items-center gap-2 mb-6 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
        <FileText size={16} />
        Análise de Perfil
      </div>

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {analysis.summary}
      </p>

      <div className="grid gap-3 md:grid-cols-3 mt-6">
        <Info label="E-mail" value={analysis.candidate_email ?? "-"} />
        <Info label="Telefone" value={analysis.candidate_phone ?? "-"} />
        <Info label="Recomendação" value={analysis.recommendation} />
      </div>
    </section>
  );
}

function Info({ label, value }: any) {
  return (
    <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/50 p-4">
      <p className="text-[10px] uppercase text-zinc-400">{label}</p>
      <p className="text-xs font-bold">{value}</p>
    </div>
  );
}