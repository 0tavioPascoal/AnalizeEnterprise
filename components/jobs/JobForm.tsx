"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, X } from "lucide-react";

export interface JobFormData {
  title: string;
  seniority?: string;
  contract_type?: string;
  score_min: number;
  skills?: string;
  languages?: string;
  context: string;
}

// Declaração da interface Props que estava faltando
interface Props {
  initialData?: JobFormData;
  onSubmit: (data: JobFormData) => Promise<void>;
  isEdit?: boolean;
}

export function JobForm({ initialData, onSubmit }: Props) {
  const router = useRouter();
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
    <form 
      onSubmit={handleSubmit} 
      className="h-full max-h-full flex flex-col border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm overflow-hidden"
    >
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            Parâmetros da Vaga
          </h2>
          <p className="text-xs text-zinc-500">
            Configure os requisitos técnicos para a análise.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
              Título do Cargo
            </Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="h-10 rounded-xl border-zinc-200 dark:border-zinc-800 text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
              Senioridade
            </Label>
            <Input
              value={form.seniority}
              onChange={(e) => setForm({ ...form, seniority: e.target.value })}
              className="h-10 rounded-xl border-zinc-200 dark:border-zinc-800 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
              Score (0-100)
            </Label>
            <Input
              type="number"
              value={form.score_min}
              onChange={(e) => setForm({ ...form, score_min: Number(e.target.value) })}
              className="h-10 rounded-xl border-zinc-200 dark:border-zinc-800 text-sm font-bold text-indigo-600"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
            Hard Skills
          </Label>
          <Textarea
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
            className="min-h-17.5 rounded-xl border-zinc-200 dark:border-zinc-800 text-sm resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
            Contexto para a IA
          </Label>
          <Textarea
            value={form.context}
            onChange={(e) => setForm({ ...form, context: e.target.value })}
            required
            className="min-h-22.5 rounded-xl border-zinc-200 dark:border-zinc-800 text-sm resize-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/30 shrink-0">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/jobs")}
          className="h-10 px-6 rounded-xl text-zinc-500 font-bold uppercase text-[10px] tracking-widest"
        >
          <X size={14} className="mr-2" />
          Cancelar
        </Button>

        <Button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10 px-8 rounded-xl shadow-lg shadow-indigo-500/20 uppercase text-[10px] tracking-widest"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Save size={14} className="mr-2" />
          )}
          Salvar
        </Button>
      </div>
    </form>
  );
}