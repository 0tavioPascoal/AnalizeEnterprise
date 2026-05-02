"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FileUpload } from "./FileUpload";
import { cn } from "@/lib/utils";

export function AnalyzeForm() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    // Simulação do processamento da IA Jarvis
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
  }

  return (
    /* 
       A TRAVA: h-full garante que o card preencha toda a altura da coluna do grid, 
       casando perfeitamente com o AnalyzeTips.
    */
    <Card className="lg:col-span-2 h-full flex flex-col border-none shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
      <CardHeader className="border-b border-zinc-200 dark:border-zinc-800 shrink-0">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          Nova análise técnica
        </CardTitle>
      </CardHeader>

      {/* 
          flex-1 garante que o conteúdo cresça para ocupar todo o espaço entre o header e o footer.
          min-h-0 evita que o container "estoure" o tamanho fixo definido pelo pai.
      */}
      <CardContent className="flex-1 min-h-0 p-6">
        <form onSubmit={handleSubmit} className="h-full flex flex-col justify-between">
          
          <div className="space-y-8">
            {/* SELECT VAGA */}
            <div className="space-y-3">
              <Label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">
                Vaga de Referência
              </Label>
              <select className="w-full h-11 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 bg-transparent text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none appearance-none cursor-pointer">
                <option value="">Selecione uma vaga para comparar</option>
                <option value="node">Sênior Backend Node.js</option>
                <option value="react">Frontend React Engineer</option>
                <option value="devops">DevOps Specialist</option>
              </select>
            </div>

            {/* COMPONENTE DE UPLOAD ESPECIALIZADO */}
            <FileUpload file={file} setFile={setFile} />
          </div>

          {/* ACTION - FIXO NO RODAPÉ DO CARD */}
          <div className="pt-6 border-t border-zinc-50 dark:border-zinc-800 flex items-center justify-between shrink-0">
            <p className="text-[10px] text-zinc-400 italic">
              * A análise salva o resultado automaticamente no histórico.
            </p>
            <Button 
              type="submit"
              disabled={loading || !file}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 px-8 rounded-xl shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analisando...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Iniciar análise
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}