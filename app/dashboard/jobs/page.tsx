"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// =========================
// TYPES
// =========================
export interface Job {
  id: string;
  title: string;
  seniority: string;
  contract_type: string;
  score_min: number;
}

// =========================
// MOCK DATA
// =========================
const jobs: Job[] = [
  {
    id: "1",
    title: "Desenvolvedor Backend",
    seniority: "Pleno",
    contract_type: "CLT",
    score_min: 75,
  },
  {
    id: "2",
    title: "Frontend React",
    seniority: "Sênior",
    contract_type: "PJ",
    score_min: 80,
  },
];

export default function JobsPage() {
  return (
    <div className="w-full space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Vagas</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie vagas para análise automática de candidatos
          </p>
        </div>

        {/* BOTÃO NOVA VAGA */}
        <Link href="/dashboard/jobs/new">
          <Button>Nova vaga</Button>
        </Link>
      </div>

      {/* LISTAGEM */}
      <div className="grid gap-3">
        {jobs.map((job) => (
          <Link
            key={job.id}
            href={`/dashboard/jobs/${job.id}/edit`}
            className="block"
          >
            <Card className="hover:bg-muted transition cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between">

                <div>
                  <p className="font-medium">{job.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {job.seniority} • {job.contract_type}
                  </p>
                </div>

                <div className="text-sm text-muted-foreground">
                  Score: {job.score_min}
                </div>

              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

    </div>
  );
}
