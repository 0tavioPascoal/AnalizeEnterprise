"use client";

import { useState } from "react";
import { UploadCloud, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function AnalyzeForm() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);

    // simulação
    await new Promise((r) => setTimeout(r, 1200));

    setLoading(false);
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Nova análise</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SELECT VAGA */}
          <div className="space-y-2">
            <Label>Vaga</Label>
            <select className="w-full h-10 border rounded-md px-3 bg-background">
              <option>Selecione uma vaga</option>
              <option>Backend Node</option>
              <option>Frontend React</option>
            </select>
          </div>

          {/* UPLOAD */}
          <div className="space-y-2">
            <Label>Currículo</Label>

            <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg h-40 cursor-pointer hover:bg-muted/40 transition">
              <UploadCloud className="mb-2" size={28} />

              <span className="text-sm text-muted-foreground">
                Clique ou arraste um PDF aqui
              </span>

              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) =>
                  setFile(e.target.files?.[0] || null)
                }
              />
            </label>
          </div>

          {/* PREVIEW */}
          {file && (
            <div className="flex items-center gap-3 p-3 border rounded-md bg-muted/30">
              <FileText size={18} />
              <span className="text-sm truncate">{file.name}</span>
            </div>
          )}

          {/* ACTION */}
          <div className="flex justify-end">
            <Button disabled={loading}>
              {loading ? "Analisando..." : "Iniciar análise"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
