"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Analysis = {
  id: string;
  name: string;
  job: string;
  score: number;
};

export default function AnalysesPage() {
  const [search, setSearch] = useState("");

  const data: Analysis[] = [
    { id: "1", name: "João Silva", job: "Backend", score: 92 },
    { id: "2", name: "Maria Souza", job: "Frontend", score: 88 },
    { id: "3", name: "Carlos Lima", job: "DevOps", score: 70 },
    { id: "4", name: "Ana Costa", job: "Backend", score: 60 },
  ];

  const filtered = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col gap-6 overflow-hidden">
      
      {/* HEADER */}
      <div className="shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Análises
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os currículos analisados
          </p>
        </div>

        <Input
          placeholder="Buscar candidato..."
          className="w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* LISTA */}
      <Card className="flex-1 overflow-hidden">
        <CardHeader className="shrink-0">
          <CardTitle>Lista de análises</CardTitle>
        </CardHeader>

        <CardContent className="flex-1 overflow-auto space-y-2">
          
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhum candidato encontrado.
            </p>
          )}

          {filtered.map((item) => (
            <Link
              key={item.id}
              href={`/dashboard/analyses/${item.id}`}
            >
              <Row {...item} />
            </Link>
          ))}

        </CardContent>
      </Card>
    </div>
  );
}

/* ROW */

function Row({
  name,
  job,
  score,
}: {
  name: string;
  job: string;
  score: number;
}) {
  return (
    <div className="flex items-center justify-between border p-4 mb-2 rounded-lg hover:bg-muted/40 transition cursor-pointer">
      
      {/* INFO */}
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-sm text-muted-foreground">{job}</p>
      </div>

      {/* SCORE */}
      <div className="flex items-center gap-4">

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
    </div>
  );
}
