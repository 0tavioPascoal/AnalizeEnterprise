"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function JobsPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1000));

    setLoading(false);
  }

  return (
    <div className="w-full space-y-6">
      
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">
          Cadastro de vaga
        </h1>
        <p className="text-muted-foreground text-sm">
          Defina os critérios para análise automática de candidatos
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* FORM */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Parâmetros da vaga</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Cargo */}
              <div className="space-y-2">
                <Label>Cargo</Label>
                <Input placeholder="Ex: Desenvolvedor Backend" required />
              </div>

              {/* Senioridade + Tipo */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Senioridade</Label>
                  <Input placeholder="Júnior / Pleno / Sênior" />
                </div>

                <div className="space-y-2">
                  <Label>Tipo de contratação</Label>
                  <Input placeholder="CLT / PJ / Estágio" />
                </div>
              </div>

              {/* Score mínimo */}
              <div className="space-y-2">
                <Label>Score mínimo para aprovação</Label>
                <Input type="number" placeholder="Ex: 70" />
              </div>

              {/* Hard Skills */}
              <div className="space-y-2">
                <Label>Hard skills obrigatórias</Label>
                <Textarea
                  placeholder="Ex: Node.js, APIs REST, Docker..."
                  className="min-h-[100px]"
                />
              </div>

              {/* Idiomas */}
              <div className="space-y-2">
                <Label>Idiomas</Label>
                <Input placeholder="Inglês avançado..." />
              </div>

              {/* Contexto */}
              <div className="space-y-2">
                <Label>Contexto da vaga</Label>
                <Textarea
                  placeholder="Descreva responsabilidades, cultura, diferenciais, expectativas..."
                  className="min-h-[140px]"
                />
              </div>

              {/* BOTÃO */}
              <div className="flex justify-end">
                <Button disabled={loading}>
                  {loading ? "Salvando..." : "Cadastrar vaga"}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>

        {/* INFO */}
        <Card className="hidden lg:block">
          <CardHeader>
            <CardTitle>Dicas</CardTitle>
          </CardHeader>

          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>✔ Seja objetivo nas hard skills</p>
            <p>✔ Defina um score mínimo realista</p>
            <p>✔ Use o contexto para detalhes importantes</p>

            <div className="pt-4 border-t">
              <p className="text-xs">
                O contexto será usado pela IA para complementar a análise do candidato.
              </p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
