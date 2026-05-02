"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ShieldCheck, 
  Users, 
  Key, 
  Info,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export function UserTips() {
  return (
    <Card className="hidden lg:flex flex-col h-full border border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
      <CardHeader className="border-b border-zinc-50 dark:border-zinc-800 shrink-0 py-5">
        <CardTitle className="text-base font-bold flex items-center gap-2 text-indigo-600 uppercase tracking-wider">
          <Info className="w-5 h-5" />
          Gestão de Acessos
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
        {/* SEÇÃO: PERMISSÕES */}
        <div className="space-y-5">
          <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400">Níveis de Permissão</h4>
          <div className="space-y-6">
            <TipItem 
              icon={<ShieldCheck className="text-indigo-600" size={20} />} 
              title="Administrador" 
              desc="Controle total sobre usuários, configurações e faturamento do sistema." 
            />
            <TipItem 
              icon={<Users className="text-blue-500" size={20} />} 
              title="Recrutador (RH)" 
              desc="Acesso completo ao scanner de IA, gestão de vagas e análise de candidatos." 
            />
            <TipItem 
              icon={<Key className="text-amber-500" size={20} />} 
              title="Gestor de Área" 
              desc="Visualiza apenas as análises e candidatos das vagas sob sua responsabilidade." 
            />
          </div>
        </div>

        {/* SEÇÃO: SEGURANÇA */}
        <div className="space-y-5 pt-6 border-t border-zinc-100 dark:border-zinc-800">
          <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400">Segurança de Dados</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span>Utilize preferencialmente e-mails corporativos (@empresa.com).</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
              <AlertCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <span>Novos usuários receberão um link de ativação por e-mail para definir a senha.</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function TipItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 mt-1">{icon}</div>
      <div>
        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{title}</p>
        <p className="text-sm text-zinc-500 leading-relaxed mt-1">{desc}</p>
      </div>
    </div>
  );
}