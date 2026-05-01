"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AnalysisDetailPage() {
  const { id } = useParams();

  // mock (depois vem do backend)
  const data = {
    name: "João Silva",
    job: "Backend",
    score: 82,
    status: "Aprovado",
    summary: "Desenvolvedor com 5 anos de experiência em Node.js...",
    strengths: ["Boa experiência com APIs", "Conhecimento em Docker"],
    weaknesses: ["Pouca experiência com testes", "Inglês intermediário"],
    interview: "Boa comunicação, respondeu bem às perguntas técnicas.",
  };

  return (
    <div className="h-full flex flex-col gap-6 overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-semibold">{data.name}</h1>
          <p className="text-muted-foreground text-sm">{data.job}</p>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold">{data.score}%</p>
          <p className="text-sm text-muted-foreground">{data.status}</p>
        </div>
      </div>

      {/* GRID */}
      <div className="grid gap-6 lg:grid-cols-3 flex-1 overflow-hidden">
        {/* COLUNA ESQUERDA */}
        <div className="lg:col-span-2 space-y-6 overflow-auto pr-2">
          {/* RESUMO */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo do candidato</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{data.summary}</p>
            </CardContent>
          </Card>

          {/* MATCH */}
          <Card>
            <CardHeader>
              <CardTitle>Match com a vaga</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Bar label="Hard Skills" value={85} />
              <Bar label="Experiência" value={75} />
              <Bar label="Aderência cultural" value={80} />
            </CardContent>
          </Card>

          {/* ENTREVISTA */}
          <Card>
            <CardHeader>
              <CardTitle>Entrevista</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{data.interview}</p>
            </CardContent>
          </Card>
        </div>

        {/* COLUNA DIREITA */}
        <div className="space-y-6">
          {/* PONTOS FORTES */}
          <Card>
            <CardHeader>
              <CardTitle>Pontos fortes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {data.strengths.map((item, i) => (
                <p key={i} className="text-sm">
                  ✔ {item}
                </p>
              ))}
            </CardContent>
          </Card>

          {/* PONTOS FRACOS */}
          <Card>
            <CardHeader>
              <CardTitle>Pontos de atenção</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {data.weaknesses.map((item, i) => (
                <p key={i} className="text-sm">
                  ⚠ {item}
                </p>
              ))}
            </CardContent>
          </Card>

          {/* AÇÕES */}
          <Card>
            <CardContent className="space-y-3 pt-6">
              <Button className="w-full">Aprovar candidato</Button>

              <Button variant="outline" className="w-full">
                Reprovar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* COMPONENTE DE BARRA */

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span>{label}</span>
        <span>{value}%</span>
      </div>

      <div className="w-full h-2 bg-muted rounded-full">
        <div
          className="h-2 bg-primary rounded-full"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
