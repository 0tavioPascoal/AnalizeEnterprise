"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createJob } from "@/actions/jobs";
import { toast } from "sonner";

// =========================
// TYPES
// =========================
export interface JobFormData {
  title: string;
  seniority?: string;
  contract_type?: string;
  score_min: number;
  skills?: string;
  languages?: string;
  context: string;
}

export default function JobsPage() {
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  const form = e.currentTarget; // 👈 salva referência segura

  const formData = new FormData(form);

  const payload = {
    title: String(formData.get("title") || ""),
    context: String(formData.get("context") || ""),
    score_min: Number(formData.get("score_min") || 0),
  };

  try {
    setLoading(true);

    await createJob(payload);

    toast.success("Vaga criada com sucesso!");

    form.reset(); // 👈 usa a referência salva (seguro)
  } catch (err) {
    console.error(err);
    toast.error("Erro ao criar vaga. Tente novamente.");
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="w-full space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Cadastro de vaga</h1>
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
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Cargo */}
              <div className="space-y-2">
                <Label>Cargo</Label>
                <Input name="title" placeholder="Ex: Desenvolvedor Backend" required />
              </div>

              {/* Senioridade + Tipo */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Senioridade</Label>
                  <Input name="seniority" placeholder="Júnior / Pleno / Sênior" />
                </div>

                <div className="space-y-2">
                  <Label>Tipo de contratação</Label>
                  <Input name="contract_type" placeholder="CLT / PJ / Estágio" />
                </div>
              </div>

              {/* Score mínimo */}
              <div className="space-y-2">
                <Label>Score mínimo para aprovação</Label>
                <Input name="score_min" type="number" placeholder="Ex: 70" required />
              </div>

              {/* Hard Skills */}
              <div className="space-y-2">
                <Label>Hard skills obrigatórias</Label>
                <Textarea
                  name="skills"
                  placeholder="Ex: Node.js, APIs REST, Docker..."
                  className="min-h-25"
                />
              </div>

              {/* Idiomas */}
              <div className="space-y-2">
                <Label>Idiomas</Label>
                <Input name="languages" placeholder="Inglês avançado..." />
              </div>

              {/* Contexto */}
              <div className="space-y-2">
                <Label>Contexto da vaga</Label>
                <Textarea
                  name="context"
                  placeholder="Descreva responsabilidades, cultura, diferenciais, expectativas..."
                  className="min-h-35"
                  required
                />
              </div>

              {/* BOTÃO */}
              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
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
