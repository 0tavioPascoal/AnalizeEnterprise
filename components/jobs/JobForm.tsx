"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Save, X } from "lucide-react";
import { Trash2 } from "lucide-react";
import { deleteJob } from "@/actions/jobs/deleteJobs";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { createJob } from "@/actions/jobs/createjob";
import { updateJob } from "@/actions/jobs/updateJobs";

export interface JobFormData {
  title: string;
  seniority: string;
  contract_type: string;
  score_min: number;
  skills?: string;
  context: string;
}

interface Props {
  initialData?: JobFormData & { id?: string };
  isEdit?: boolean;
}

export function JobForm({ initialData, isEdit = false }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const payload: JobFormData = {
      title: String(formData.get("title") ?? ""),
      seniority: String(formData.get("seniority") ?? "Pleno"),
      contract_type: String(formData.get("contract_type") ?? "CLT"),
      score_min: Number(formData.get("score_min") ?? 70),
      skills: String(formData.get("skills") ?? ""),
      context: String(formData.get("context") ?? ""),
    };

    try {
      const result =
        isEdit && initialData?.id
          ? await updateJob(initialData.id, payload)
          : await createJob(payload);

      if (!result.success) {
        toast.error(result.message ?? "Erro ao salvar vaga");
        return;
      }

      toast.success(
        isEdit ? "Vaga atualizada com sucesso!" : "Vaga criada com sucesso!",
      );

      router.push("/dashboard/jobs");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!initialData?.id) return;

    // 🔥 primeiro clique só ativa confirmação
    if (!confirmDelete) {
      setConfirmDelete(true);

      // volta ao normal depois de 3s
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }

    try {
      setLoading(true);

      const result = await deleteJob(initialData.id);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success("Vaga excluída com sucesso!");
      router.push("/dashboard/jobs");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir vaga");
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
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
            Configure os requisitos técnicos para a análise.
          </p>
        </div>

        <div className="grid gap-4 w-full">
          {/* LINHA 1: TITLE */}
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-950 dark:text-zinc-50 ml-1">
              Título do Cargo
            </Label>
            <Input
              name="title"
              defaultValue={initialData?.title ?? ""}
              className="h-10 rounded-xl border-zinc-200 dark:border-zinc-800 text-sm font-bold text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-950"
              required
              disabled={loading}
            />
          </div>

          {/* LINHA 2: SENIORIDADE, CONTRATAÇÃO E SCORE */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-950 dark:text-zinc-50 ml-1">
                Senioridade
              </Label>
              <select
                name="seniority"
                defaultValue={initialData?.seniority ?? "Pleno"}
                disabled={loading}
                className="h-10 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 text-sm font-bold text-zinc-500 dark:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              >
                <option value="Junior">Junior</option>
                <option value="Pleno">Pleno</option>
                <option value="Senior">Senior</option>
                <option value="Especialista">Especialista</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-950 dark:text-zinc-50 ml-1">
                Tipo de Contratação
              </Label>
              <select
                name="contract_type"
                defaultValue={initialData?.contract_type ?? "CLT"}
                disabled={loading}
                className="h-10 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 text-sm font-bold text-zinc-500 dark:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              >
                <option value="CLT">CLT</option>
                <option value="PJ">PJ</option>
                <option value="Estágio">Estágio</option>
                <option value="Freelancer">Freelancer</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-950 dark:text-zinc-50 ml-1">
                Score Mínimo
              </Label>
              <Input
                name="score_min"
                type="number"
                min={0}
                max={100}
                defaultValue={initialData?.score_min ?? 0}
                disabled={loading}
                className="h-10 rounded-xl border-zinc-200 dark:border-zinc-800 text-sm font-bold text-indigo-400 dark:text-indigo-500/70 text-center bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>
        </div>

        {/* SKILLS */}
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-950 dark:text-zinc-50 ml-1">
            Hard Skills
          </Label>
          <Textarea
            name="skills"
            defaultValue={initialData?.skills ?? ""}
            className="min-h-20 rounded-xl border-zinc-200 dark:border-zinc-800 text-sm font-bold text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-950 resize-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            disabled={loading}
          />
        </div>

        {/* CONTEXT */}
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-950 dark:text-zinc-50 ml-1">
            Contexto para a IA
          </Label>
          <Textarea
            name="context"
            defaultValue={initialData?.context ?? ""}
            required
            className="min-h-24 rounded-xl border-zinc-200 dark:border-zinc-800 text-sm font-bold text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-950 resize-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            disabled={loading}
          />
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-end gap-3 p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/30 shrink-0">
        {/* DELETE */}
        {isEdit && initialData?.id && (
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={handleDelete}
            className={`h-10 px-6 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all
        ${
          confirmDelete
            ? "text-white bg-red-600 hover:bg-red-700 border-red-600"
            : "text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
        }`}
          >
            <Trash2 size={14} className="mr-2" />
            {confirmDelete ? "Confirmar?" : "Excluir"}
          </Button>
        )}

        {/* CANCEL */}
        <Button
          type="button"
          variant="outline"
          disabled={loading}
          onClick={() => router.push("/dashboard/jobs")}
          className="h-10 px-6 rounded-xl text-zinc-500 font-bold uppercase text-[10px] tracking-widest"
        >
          <X size={14} className="mr-2" />
          Cancelar
        </Button>

        {/* SAVE */}
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
