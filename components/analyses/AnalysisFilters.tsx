"use client";

// Removidas as propriedades search e setSearch que agora ficam no PageHeader
interface Props {
  jobFilter: string;
  setJobFilter: (v: string) => void;
}

export function AnalysisFilters({
  jobFilter,
  setJobFilter,
}: Props) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-full md:w-56 text-zinc-900 dark:text-zinc-100">
        <select
          value={jobFilter}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setJobFilter(e.target.value)}
          className="h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 text-xs shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all cursor-pointer font-medium"
        >
          <option value="">Todas as vagas</option>
          <option value="Backend">Backend</option>
          <option value="Frontend">Frontend</option>
          <option value="DevOps">DevOps</option>
        </select>
      </div>
    </div>
  );
}