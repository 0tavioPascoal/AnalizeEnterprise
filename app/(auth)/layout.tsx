import type { ReactNode } from "react";
import {
  BarChart3,
  Brain,
  Briefcase,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-screen bg-zinc-100 dark:bg-zinc-950 lg:grid-cols-[60%_40%]">
      <section className="relative hidden overflow-hidden border-r border-zinc-800 bg-zinc-950 text-white lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(79,70,229,0.22)_0%,rgba(9,9,11,1)_42%,rgba(9,9,11,1)_100%)]" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

        <div className="relative z-10 flex w-full flex-col justify-between p-14">
          <div>
            <div className="mb-10 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 shadow-lg shadow-indigo-500/10">
                <Briefcase className="h-7 w-7 text-indigo-400" />
              </div>

              <div>
                <h1 className="text-3xl font-black tracking-tight">
                  RH Analyzer
                </h1>
                <p className="text-sm text-zinc-400">
                  Inteligência aplicada ao recrutamento
                </p>
              </div>
            </div>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">
              <Sparkles className="h-3.5 w-3.5" />
              Plataforma Enterprise
            </div>

            <h2 className="max-w-2xl text-5xl font-black leading-tight tracking-tight">
              A nova era do recrutamento{" "}
              <span className="text-indigo-400">inteligente.</span>
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
              Poupe horas de triagem manual. Deixe nossa IA analisar currículos,
              comparar requisitos e organizar seu pipeline de talentos.
            </p>
          </div>

          <div className="grid max-w-4xl grid-cols-2 gap-5">
            <FeatureCard
              icon={Brain}
              title="Análise de CVs"
              description="Score automático de aderência técnica com IA."
            />

            <FeatureCard
              icon={Sparkles}
              title="IA Generativa"
              description="Resumo, riscos e perguntas de entrevista."
            />

            <FeatureCard
              icon={ShieldCheck}
              title="Controle de Acesso"
              description="Usuários, permissões e empresas com segurança."
            />

            <FeatureCard
              icon={BarChart3}
              title="Pipeline e KPIs"
              description="Histórico de decisões e gestão de candidatos."
            />
          </div>

          <div className="flex items-center justify-between border-t border-zinc-800 pt-6 mt-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                RH Analyzer Enterprise
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                Desenvolvido por Otávio Pascoal
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-5 gap-y-2 text-sm font-medium text-zinc-400">
              <FeatureCheck label="Matching real-time" />
              <FeatureCheck label="Dashboard de KPIs" />
              <FeatureCheck label="Multi-tenant" />
              <FeatureCheck label="Automação n8n" />
            </div>
          </div>
        </div>
      </section>

      <section className="col-span-full flex min-h-screen items-center justify-center bg-zinc-50 p-6 dark:bg-zinc-950 lg:col-auto">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white">
              <Briefcase className="h-6 w-6" />
            </div>
            <span className="text-2xl font-black tracking-tight">
              RH Analyzer
            </span>
          </div>

          {children}
        </div>
      </section>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-white/3 p-5 shadow-sm backdrop-blur-sm">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="text-sm font-bold text-zinc-100">{title}</h3>

      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
        {description}
      </p>
    </div>
  );
}

function FeatureCheck({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle2 className="h-4 w-4 text-indigo-400" />
      {label}
    </div>
  );
}