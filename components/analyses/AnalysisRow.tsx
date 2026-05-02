"use client";

export function AnalysisRow({
  name,
  job,
  score,
}: {
  name: string;
  job: string;
  score: number;
}) {
  return (
    <div className="flex items-center justify-between border p-4 rounded-lg hover:bg-muted/40 transition cursor-pointer">
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-sm text-muted-foreground">{job}</p>
      </div>

      <span
        className={`text-sm font-semibold ${
          score > 80
            ? "text-green-500"
            : score > 60
            ? "text-yellow-500"
            : "text-red-500"
        }`}
      >
        {score}%
      </span>
    </div>
  );
}
