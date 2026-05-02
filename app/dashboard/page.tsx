"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText, XCircle, Sparkles, Zap, Target, BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();

  return (
    /* 
      A TRAVA MESTRE: h-full herda o h-screen do layout. 
      overflow-hidden impede que qualquer elemento interno force um scroll na página.
    */
    <div className="h-full w-full overflow-hidden flex flex-col p-6 gap-6 bg-zinc-50/50 dark:bg-zinc-950/50 box-border">
      
      {/* HEADER - ALTURA FIXA */}
      <header className="flex shrink-0 items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-6 h-20">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="text-white h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              Insights Operacionais
            </h1>
            <p className="text-zinc-500 text-sm font-medium">Bem-vindo, Otávio. Aqui está o pulso do seu RH hoje.</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border rounded-lg shadow-sm">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-zinc-600">Sistema Online</span>
          </div>
          <button 
            onClick={() => router.push("/dashboard/analyze")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 shadow-md"
          >
            Nova Análise
          </button>
        </div>
      </header>

      {/* KPI GRID - ALTURA FIXA */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0 h-25">
        <StatCard title="Total Analisado" value="1,284" trend="+12%" icon={<FileText size={18} />} color="indigo" />
        <StatCard title="Match Alto" value="422" trend="+5.2%" icon={<Target size={18} />} color="emerald" />
        <StatCard title="Abaixo do Perfil" value="862" trend="-2%" icon={<XCircle size={18} />} color="rose" />
        <StatCard title="Eficiência IA" value="98.2%" trend="Estável" icon={<Zap size={18} />} color="amber" />
      </section>

      {/* MAIN CONTENT AREA - OCUPA 100% DA SOBRA */}
      <main className="flex-1 min-h-0 grid grid-cols-12 gap-6 overflow-hidden">
        
        {/* COLUNA DA ESQUERDA: PERFORMANCE (Ocupa 8 colunas) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 min-h-0 overflow-hidden">
          
          {/* GRÁFICO (Ocupa aproximadamente 40% da altura da coluna) */}
          <Card className="h-[40%] min-h-0 flex flex-col border-none shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between py-3 px-4 shrink-0 border-b border-zinc-50 dark:border-zinc-800">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Fluxo Semanal</CardTitle>
              <BarChart3 size={14} className="text-zinc-300" />
            </CardHeader>
            <CardContent className="flex-1 flex items-end justify-between p-6 gap-2 min-h-0">
               {[60, 40, 95, 70, 50, 85, 35, 60, 90, 45, 70, 55].map((h, i) => (
                 <div key={i} className="flex-1 group relative flex flex-col items-center justify-end h-full">
                    <div 
                      className="w-full bg-zinc-100 dark:bg-zinc-800 group-hover:bg-indigo-500 rounded-t-sm transition-all duration-300" 
                      style={{ height: `${h}%` }} 
                    />
                 </div>
               ))}
            </CardContent>
          </Card>

          {/* ÚLTIMAS ANÁLISES (Ocupa 60% da altura da coluna) */}
          <Card className="h-[60%] min-h-0 flex flex-col border-none shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
            <CardHeader className="py-3 px-4 shrink-0 border-b border-zinc-50 dark:border-zinc-800">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-0 scrollbar-hide">
               <div className="divide-y divide-zinc-50 dark:divide-zinc-800">
                 <ActivityRow name="Otávio Pascoal" role="Sênior Fullstack" score={98} time="Há 2 min" />
                 <ActivityRow name="Lucas Medeiros" role="Data Scientist" score={85} time="Há 15 min" />
                 <ActivityRow name="Ana Beatriz" role="UX Designer" score={72} time="Há 1 hora" />
                 <ActivityRow name="Carlos Eduardo" role="DevOps Engineer" score={91} time="Há 2 horas" />
                 <ActivityRow name="Mariana Luz" role="Product Manager" score={64} time="Ontem" />
                 <ActivityRow name="Roberto Carlos" role="Backend Java" score={88} time="Ontem" />
               </div>
            </CardContent>
          </Card>
        </div>

        {/* COLUNA DA DIREITA: RANKING (Altura Total da Sobra) */}
        <Card className="col-span-12 lg:col-span-4 flex flex-col border-none shadow-xl bg-zinc-900 dark:bg-zinc-900 text-white overflow-hidden">
          <CardHeader className="py-6 px-6 shrink-0 bg-zinc-800/50">
            <div className="flex items-center justify-between">
               <CardTitle className="text-xs font-bold uppercase tracking-widest text-indigo-400">Elite Squad</CardTitle>
               <Badge className="bg-indigo-500 hover:bg-indigo-500 border-none">TOP 1%</Badge>
            </div>
            <p className="text-[10px] text-zinc-400 mt-2 italic">Candidatos acima de 90 pontos no match de IA.</p>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
            {Array.from({ length: 12 }).map((_, i) => (
              <RankingItem key={i} rank={i + 1} name="Candidato de Elite" score={99 - i} job="Software Engineer" />
            ))}
          </CardContent>
        </Card>

      </main>
    </div>
  );
}

/* COMPONENTES DE SUPORTE */

function StatCard({ title, value, trend, icon, color }: any) {
  const colors: any = {
    indigo: "text-indigo-600 bg-indigo-50",
    emerald: "text-emerald-600 bg-emerald-50",
    rose: "text-rose-600 bg-rose-50",
    amber: "text-amber-600 bg-amber-50",
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-transparent hover:border-zinc-200 transition-all flex items-center justify-between group">
      <div className="min-w-0">
        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-2">{title}</p>
        <div className="flex items-baseline gap-2">
          <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50">{value}</h2>
          <span className="text-[9px] font-bold text-emerald-500">{trend}</span>
        </div>
      </div>
      <div className={cn("p-2 rounded-lg shrink-0", colors[color])}>
        {icon}
      </div>
    </div>
  );
}

function ActivityRow({ name, role, score, time }: any) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
      <div className="flex items-center gap-4 min-w-0">
        <div className="h-9 w-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 shrink-0">
          <FileText size={16} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50 truncate">{name}</p>
          <p className="text-[10px] text-zinc-500 truncate">{role} • {time}</p>
        </div>
      </div>
      <Badge variant="outline" className={cn(
        "text-[10px] font-black px-2 py-0.5",
        score > 85 ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-amber-600 bg-amber-50 border-amber-100"
      )}>
        {score}%
      </Badge>
    </div>
  );
}

function RankingItem({ rank, name, score, job }: any) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-xl font-black text-zinc-700 w-6 shrink-0">{rank < 10 ? `0${rank}` : rank}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-zinc-100 truncate">{name}</p>
        <p className="text-[9px] text-zinc-500 uppercase tracking-tighter">{job}</p>
      </div>
      <div className="flex flex-col items-end shrink-0">
        <span className="text-xs font-black text-indigo-400">{score}%</span>
        <div className="w-10 h-1 bg-zinc-800 rounded-full mt-1 overflow-hidden">
          <div className="h-full bg-indigo-500" style={{ width: `${score}%` }} />
        </div>
      </div>
    </div>
  );
}