"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Save, Trash2, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { deleteJob } from "@/actions/jobs/deleteJobs";
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
  onSubmit: (data: JobFormData) => void;  
}

export function JobForm({ initialData, isEdit = false }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
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
        isEdit
          ? "Vaga atualizada com sucesso!"
          : "Vaga criada com sucesso!",
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

  async function handleDelete(): Promise<void> {
    if (!initialData?.id) return;

    if (!confirmDelete) {
      setConfirmDelete(true);

      setTimeout(() => {
        setConfirmDelete(false);
      }, 3000);

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
      className="
        flex h-full max-h-full flex-col overflow-hidden
        rounded-2xl border border-border
        bg-card shadow-sm
      "
    >
      {/* BODY */}
      <div className="flex-1 space-y-5 overflow-y-auto p-6 scrollbar-hide">
        {/* HEADER */}
        <div className="rounded-2xl border border-border bg-muted/30 px-4 py-3">
          <h2 className="text-base font-bold text-foreground">
            Parâmetros da Vaga
          </h2>

          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configure os requisitos técnicos para a análise.
          </p>
        </div>

        {/* FORM */}
        <div className="grid w-full gap-4">
          {/* TITLE */}
          <div className="space-y-2">
            <Label className="ml-1 text-[10px] font-black uppercase tracking-widest text-foreground">
              Título do Cargo
            </Label>

            <Input
              name="title"
              defaultValue={initialData?.title ?? ""}
              required
              disabled={loading}
              className="
                h-10 rounded-xl
                border-border

                bg-muted/40
                dark:bg-zinc-900/50

                text-sm font-semibold
                text-foreground

                shadow-sm
                transition-all

                placeholder:text-muted-foreground

                focus-visible:border-primary/30
                focus-visible:ring-2
                focus-visible:ring-primary/20
              "
            />
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* SENIORITY */}
            <div className="space-y-2">
              <Label className="ml-1 text-[10px] font-black uppercase tracking-widest text-foreground">
                Senioridade
              </Label>

              <select
                name="seniority"
                defaultValue={initialData?.seniority ?? "Pleno"}
                disabled={loading}
                className="
                  h-10 w-full rounded-xl
                  border border-border

                  bg-muted/40
                  dark:bg-zinc-900/50

                  px-3

                  text-sm font-semibold
                  text-foreground

                  shadow-sm
                  transition-all

                  focus:border-primary/30
                  focus:outline-none
                  focus:ring-2
                  focus:ring-primary/20
                "
              >
                <option value="Junior">Junior</option>
                <option value="Pleno">Pleno</option>
                <option value="Senior">Senior</option>
                <option value="Especialista">Especialista</option>
              </select>
            </div>

            {/* CONTRACT */}
            <div className="space-y-2">
              <Label className="ml-1 text-[10px] font-black uppercase tracking-widest text-foreground">
                Tipo de Contratação
              </Label>

              <select
                name="contract_type"
                defaultValue={initialData?.contract_type ?? "CLT"}
                disabled={loading}
                className="
                  h-10 w-full rounded-xl
                  border border-border

                  bg-muted/40
                  dark:bg-zinc-900/50

                  px-3

                  text-sm font-semibold
                  text-foreground

                  shadow-sm
                  transition-all

                  focus:border-primary/30
                  focus:outline-none
                  focus:ring-2
                  focus:ring-primary/20
                "
              >
                <option value="CLT">CLT</option>
                <option value="PJ">PJ</option>
                <option value="Estágio">Estágio</option>
                <option value="Freelancer">Freelancer</option>
              </select>
            </div>

            {/* SCORE */}
            <div className="space-y-2">
              <Label className="ml-1 text-[10px] font-black uppercase tracking-widest text-foreground">
                Score Mínimo
              </Label>

              <Input
                name="score_min"
                type="number"
                min={0}
                max={100}
                defaultValue={initialData?.score_min ?? 0}
                disabled={loading}
                className="
                  h-10 rounded-xl

                  border-primary/20

                  bg-primary/10
                  dark:bg-primary/15

                  text-center
                  text-sm font-black
                  text-primary

                  shadow-sm
                  transition-all

                  focus-visible:border-primary/40
                  focus-visible:ring-2
                  focus-visible:ring-primary/20
                "
              />
            </div>
          </div>
        </div>

        {/* SKILLS */}
        <div className="space-y-2">
          <Label className="ml-1 text-[10px] font-black uppercase tracking-widest text-foreground">
            Hard Skills
          </Label>

          <Textarea
            name="skills"
            defaultValue={initialData?.skills ?? ""}
            disabled={loading}
            className="
              min-h-20 rounded-xl

              border-border

              bg-muted/40
              dark:bg-zinc-900/50

              text-sm font-semibold
              text-foreground

              shadow-sm
              resize-none
              transition-all

              placeholder:text-muted-foreground

              focus-visible:border-primary/30
              focus-visible:ring-2
              focus-visible:ring-primary/20
            "
          />
        </div>

        {/* CONTEXT */}
        <div className="space-y-2">
          <Label className="ml-1 text-[10px] font-black uppercase tracking-widest text-foreground">
            Contexto para a IA
          </Label>

          <Textarea
            name="context"
            defaultValue={initialData?.context ?? ""}
            required
            disabled={loading}
            className="
              min-h-24 rounded-xl

              border-border

              bg-muted/40
              dark:bg-zinc-900/50

              text-sm font-semibold
              text-foreground

              shadow-sm
              resize-none
              transition-all

              placeholder:text-muted-foreground

              focus-visible:border-primary/30
              focus-visible:ring-2
              focus-visible:ring-primary/20
            "
          />
        </div>
      </div>

      {/* FOOTER */}
      <div
        className="
          flex shrink-0 flex-wrap items-center justify-end gap-3
          border-t border-border
          bg-muted/30
          p-4
          backdrop-blur-sm
        "
      >
        {/* DELETE */}
        {isEdit && initialData?.id && (
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={handleDelete}
            className={`
              h-10 rounded-xl px-6
              text-[10px] font-black uppercase tracking-widest
              transition-all

              ${
                confirmDelete
                  ? "border-destructive bg-destructive text-white hover:bg-destructive/90"
                  : `
                    border-red-500/20
                    bg-red-500/10
                    text-red-600

                    hover:bg-red-500/15
                    hover:text-red-700

                    dark:text-red-400
                  `
              }
            `}
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
          className="
            h-10 rounded-xl
            border-border
            bg-card

            px-6

            text-[10px]
            font-bold uppercase tracking-widest
            text-muted-foreground

            shadow-sm
            transition-all

            hover:bg-muted
            hover:text-foreground
          "
        >
          <X size={14} className="mr-2" />
          Cancelar
        </Button>

        {/* SAVE */}
        <Button
          type="submit"
          disabled={loading}
          className="
            h-10 rounded-xl
            bg-primary

            px-8

            text-[10px]
            font-black uppercase tracking-widest
            text-primary-foreground

            shadow-lg shadow-primary/20
            transition-all

            hover:bg-primary/90
          "
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save size={14} className="mr-2" />
          )}

          Salvar
        </Button>
      </div>
    </form>
  );
}