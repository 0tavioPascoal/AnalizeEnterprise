"use client";

interface Props {
  jobFilter: string;
  setJobFilter: (v: string) => void;

  statusFilter: string;
  setStatusFilter: (v: string) => void;

  scoreFilter: string;
  setScoreFilter: (v: string) => void;

  jobs: { id: string; title: string }[];
}

export function AnalysisFilters({
  jobFilter,
  setJobFilter,
  statusFilter,
  setStatusFilter,
  scoreFilter,
  setScoreFilter,
  jobs,
}: Props) {
  return (
    <div className="flex items-center gap-3">

      {/* JOB */}
      <select
        value={jobFilter}
        onChange={(e) => setJobFilter(e.target.value)}
        className="h-9 rounded-md border px-3 text-xs"
      >
        <option value="">Todas vagas</option>
        {jobs.map((job) => (
          <option key={job.id} value={job.title}>
            {job.title}
          </option>
        ))}
      </select>

      {/* STATUS */}
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="h-9 rounded-md border px-3 text-xs"
      >
        <option value="">Status</option>
        <option value="match">Match</option>
        <option value="no_match">Sem match</option>
      </select>

      {/* SCORE */}
      <select
        value={scoreFilter}
        onChange={(e) => setScoreFilter(e.target.value)}
        className="h-9 rounded-md border px-3 text-xs"
      >
        <option value="">Score</option>
        <option value="low">0–50</option>
        <option value="medium">50–70</option>
        <option value="high">70+</option>
      </select>
    </div>
  );
}