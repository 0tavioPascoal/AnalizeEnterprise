"use client";

import Link from "next/link";
import { AnalysisRow } from "./AnalysisRow";

interface Analysis {
  id: string;
  name: string;
  job: string;
  score: number;
}

interface Props {
  data: Analysis[];
}

export function AnalysisList({ data }: Props) {
  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum candidato encontrado.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <Link
          key={item.id}
          href={`/dashboard/analyses/${item.id}`}
          className="block"
        >
          <div className="rounded-xl hover:bg-muted/40 transition">
            <AnalysisRow {...item} />
          </div>
        </Link>
      ))}
    </div>
  );
}
