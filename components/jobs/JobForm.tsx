"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface JobFormData {
  title: string;
  seniority?: string;
  contract_type?: string;
  score_min: number;
  skills?: string;
  languages?: string;
  context: string;
}

interface Props {
  initialData?: JobFormData;
  onSubmit: (data: JobFormData) => Promise<void>;
  isEdit?: boolean;
}

export function JobForm({ initialData, onSubmit, isEdit }: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<JobFormData>(
    initialData || {
      title: "",
      seniority: "",
      contract_type: "",
      score_min: 0,
      skills: "",
      languages: "",
      context: "",
    }
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Parâmetros da vaga</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="space-y-2">
            <Label>Cargo</Label>
            <Input
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">

            <div className="space-y-2">
              <Label>Senioridade</Label>
              <Input
                value={form.seniority}
                onChange={(e) =>
                  setForm({ ...form, seniority: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo de contratação</Label>
              <Input
                value={form.contract_type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    contract_type: e.target.value,
                  })
                }
              />
            </div>

          </div>

          <div className="space-y-2">
            <Label>Score mínimo</Label>
            <Input
              type="number"
              value={form.score_min}
              onChange={(e) =>
                setForm({
                  ...form,
                  score_min: Number(e.target.value),
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Hard skills</Label>
            <Textarea
              value={form.skills}
              onChange={(e) =>
                setForm({ ...form, skills: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Idiomas</Label>
            <Input
              value={form.languages}
              onChange={(e) =>
                setForm({ ...form, languages: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Contexto</Label>
            <Textarea
              value={form.context}
              onChange={(e) =>
                setForm({ ...form, context: e.target.value })
              }
              className="min-h-28"
              required
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading
                ? "Salvando..."
                : isEdit
                ? "Salvar alterações"
                : "Cadastrar vaga"}
            </Button>
          </div>

        </form>
      </CardContent>
    </Card>
  );
}
