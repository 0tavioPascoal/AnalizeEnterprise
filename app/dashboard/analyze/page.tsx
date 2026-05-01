"use client";

import { useState } from "react";
import { UploadCloud, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);

    await new Promise((r) => setTimeout(r, 1200));

    setLoading(false);
  }

  return (
    <div className="w-full space-y-6">
      
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">
          Análise de Currículo
        </h1>
        <p className="text-muted-foreground text-sm">
          Compare candidatos com suas vagas automaticamente
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* FORM */}
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

              {/* UPLOAD AREA */}
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

              {/* FILE PREVIEW */}
              {file && (
                <div className="flex items-center gap-3 p-3 border rounded-md bg-muted/30">
                  <FileText size={18} />
                  <span className="text-sm truncate">
                    {file.name}
                  </span>
                </div>
              )}

              {/* BOTÃO */}
              <div className="flex justify-end">
                <Button disabled={loading}>
                  {loading ? "Analisando..." : "Iniciar análise"}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>

        {/* INFO / UX */}
        <Card className="hidden lg:block">
          <CardHeader>
            <CardTitle>Como funciona</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>✔ Escolha uma vaga cadastrada</p>
            <p>✔ Envie o currículo do candidato</p>
            <p>✔ IA analisa compatibilidade</p>
            <p>✔ Resultado salvo automaticamente</p>

            <div className="pt-4 border-t">
              <p className="text-xs">
                O sistema compara habilidades, experiência e contexto da vaga.
              </p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
