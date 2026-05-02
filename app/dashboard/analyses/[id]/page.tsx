"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, UserCheck, FileText, Target, AlertTriangle, CheckCircle2, XCircle, UserPlus } from "lucide-react";

// Importação dos componentes globais que garantem o layout unificado
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/Pageheader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalysisDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  // Mock de dados mantendo a paridade visual
  const data = {
    name: "João Silva",
    job: "Desenvolvedor Backend",
    score: 82,
    summary: "Desenvolvedor com 5 anos de experiência em Node.js, focado em arquiteturas escaláveis.",
    strengths: ["Boa experiência com APIs", "Conhecimento em Docker"],
    weaknesses: ["Pouca experiência com testes", "Inglês intermediário"],
    interview: "Boa comunicação, respondeu bem às perguntas técnicas.",
  };

  return (
    <PageLayout
      header={
        <PageHeader
          title={data.name}
          description={`Análise detalhada do candidato para a vaga de ${data.job}`}
          action={
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                onClick={() => router.back()}
                className="text-zinc-500 hover:text-zinc-900 gap-2 font-bold uppercase text-[10px] tracking-widest"
              >
                <ArrowLeft size={16} />
                Voltar
              </Button>

              {/* Badge de status/score seguindo o padrão de Users/Jobs */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg border border-indigo-100 dark:border-indigo-500/20">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                  Match: {data.score}%
                </span>
              </div>
            </div>
          }
        />
      }
    >
      {/* LAYOUT UNIFICADO: 
          Grid 3 colunas (2 para conteúdo, 1 para lateral/ações) 
          h-full + overflow-hidden para travar o scroll na 'gaiola'
      */}
      <div className="grid gap-6 lg:grid-cols-3 items-stretch h-full overflow-hidden">
        
        {/* COLUNA ESQUERDA: Detalhes Técnicos (Scroll Interno) */}
        <div className="lg:col-span-2 space-y-6 overflow-y-auto pr-2 scrollbar-hide">
          <section className="p-8 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-indigo-600 uppercase tracking-widest text-[10px] font-black">
              <FileText size={16} />
              Análise de Perfil
            </div>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{data.summary}</p>
          </section>

          <section className="p-8 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm">
            <div className="flex items-center gap-2 mb-8 text-indigo-600 uppercase tracking-widest text-[10px] font-black">
              <Target size={16} />
              Pontuação por Categoria
            </div>
            <div className="grid gap-8">
              <Bar label="Hard Skills" value={85} color="bg-indigo-600" />
              <Bar label="Experiência" value={75} color="bg-blue-500" />
              <Bar label="Aderência Cultural" value={80} color="bg-emerald-500" />
            </div>
          </section>
        </div>

        {/* COLUNA DIREITA: Ações e Observações (Scroll Interno) */}
        <div className="space-y-6 flex flex-col h-full overflow-y-auto pr-1 scrollbar-hide">
          
          {/* Card de Ação Principal (Igual ao de Cadastro/Edição) */}
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-md rounded-2xl bg-zinc-50/50 dark:bg-zinc-800/30 shrink-0">
            <CardHeader className="py-5 border-b border-zinc-100 dark:border-zinc-800">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-indigo-600">Concluir Análise</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              <Button className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase text-[10px] tracking-widest rounded-xl gap-2 shadow-lg shadow-indigo-500/20">
                <UserPlus size={16} />
                Aprovar
              </Button>
              <Button variant="outline" className="w-full h-11 border-zinc-200 dark:border-zinc-800 font-bold uppercase text-[10px] tracking-widest rounded-xl text-zinc-500 gap-2">
                <XCircle size={16} />
                Reprovar
              </Button>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl">
            <CardHeader className="py-5 border-b border-zinc-100 dark:border-zinc-800">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-zinc-400">Destaques</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {data.strengths.map((item, i) => (
                <div key={i} className="flex gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

      </div>
    </PageLayout>
  );
}

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{label}</span>
        <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">{value}%</span>
      </div>
      <div className="w-full h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}