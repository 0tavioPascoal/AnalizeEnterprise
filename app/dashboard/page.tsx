"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="h-full flex flex-col gap-6 overflow-hidden">
      
      {/* HEADER */}
      <div className="shrink-0">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Visão geral das análises de currículos
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 shrink-0">
        <Kpi title="Currículos" value="128" />
        <Kpi title="Aprovados" value="42" />
        <Kpi title="Reprovados" value="86" />
        <Kpi title="Score médio" value="74%" />
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 grid gap-6 lg:grid-cols-3 overflow-hidden">
        
        {/* GRÁFICO */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader className="shrink-0">
            <CardTitle>Análises por dia</CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex items-center justify-center text-muted-foreground">
            (Gráfico)
          </CardContent>
        </Card>

        {/* TOP CANDIDATOS */}
        <Card className="flex flex-col">
          <CardHeader className="shrink-0">
            <CardTitle>Top candidatos</CardTitle>
          </CardHeader>

          <CardContent className="flex-1 overflow-auto space-y-3">
            <Candidate name="João Silva" score={92} />
            <Candidate name="Maria Souza" score={88} />
            <Candidate name="Carlos Lima" score={85} />
            <Candidate name="Ana Costa" score={83} />
          </CardContent>
        </Card>
      </div>

      {/* LISTA */}
      <Card className="flex flex-col overflow-hidden">
        <CardHeader className="shrink-0">
          <CardTitle>Últimas análises</CardTitle>
        </CardHeader>

        <CardContent className="flex-1 overflow-auto space-y-3">
          <Row name="João Silva" job="Backend" score={92} />
          <Row name="Maria Souza" job="Frontend" score={88} />
          <Row name="Carlos Lima" job="DevOps" score={70} />
          <Row name="Ana Costa" job="Backend" score={60} />
        </CardContent>
      </Card>

    </div>
  );
}

/* COMPONENTES */

function Kpi({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">{title}</p>
        <h2 className="text-xl font-semibold">{value}</h2>
      </CardContent>
    </Card>
  );
}

function Candidate({ name, score }: { name: string; score: number }) {
  return (
    <div className="flex justify-between text-sm">
      <span>{name}</span>
      <span className="font-medium">{score}%</span>
    </div>
  );
}

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
    <div className="flex items-center justify-between border p-3 rounded-md">
      <div>
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">{job}</p>
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
