"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, UserPlus, Save, Lock, Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { createUser } from "@/actions/user/createUser";
import { updateUser } from "@/actions/user/updateUser";
import type { UserRole, UserFormData, ActionResponse } from "@/types/user/user";

interface UserFormProps {
  initialData?: UserFormData & { id?: string };
  isEdit?: boolean;
  currentUserId?: string;
  currentUserRole?: UserRole;
  companyName?: string;
}

export function UserForm({
  initialData,
  isEdit = false,
  currentUserId,
  currentUserRole,
  companyName = "Organização não identificada",
}: UserFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const isEditingSelf = Boolean(
    isEdit && initialData?.id && currentUserId === initialData.id,
  );

  const isCurrentUserAdmin = currentUserRole === "admin";
  const isTargetAdmin = initialData?.role === "admin";

  const canEditRole = isCurrentUserAdmin && !isEditingSelf;
  const canEditForm = isCurrentUserAdmin || !isTargetAdmin;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!canEditForm) {
      toast.error("Você não tem permissão para editar este usuário.");
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const selectedRole = formData.get("role") as UserRole | null;

    const payload: UserFormData = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? initialData?.email ?? ""),
      role: canEditRole
        ? selectedRole ?? initialData?.role ?? "recruiter"
        : initialData?.role ?? "recruiter",
    };

    try {
      let result: ActionResponse;

      if (isEdit && initialData?.id) {
        result = await updateUser(initialData.id, payload);
      } else {
        result = await createUser({
          ...payload,
          password: String(formData.get("password") ?? ""),
        });
      }

      if (result.success) {
        toast.success(result.message);
        router.push("/dashboard/users");
        router.refresh();
        return;
      }

      toast.error(result.message);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro crítico ao processar requisição.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full flex-col justify-between rounded-2xl border border-zinc-200 bg-white/50 p-8 shadow-sm transition-all dark:border-zinc-800 dark:bg-zinc-900/50"
    >
      <div className="space-y-6">
        <div className="space-y-2 opacity-80">
          <Label className="ml-1 text-[10px] font-black uppercase tracking-widest text-zinc-950 dark:text-zinc-50">
            Organização Vinculada
          </Label>

          <div className="relative">
            <Building2 className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400" />
            <Input
              value={companyName}
              disabled
              className="h-11 cursor-not-allowed rounded-xl border-zinc-200 bg-zinc-100 pl-10 font-bold text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="name"
            className="ml-1 text-[10px] font-black uppercase tracking-widest text-zinc-950 dark:text-zinc-50"
          >
            Nome Completo
          </Label>

          <Input
            id="name"
            name="name"
            defaultValue={initialData?.name}
            placeholder="Ex: Otávio Augusto Pascoal"
            disabled={loading || !canEditForm}
            className="h-11 rounded-xl border-zinc-200 bg-white font-bold text-zinc-500 transition-all focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400"
            required
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="ml-1 text-[10px] font-black uppercase tracking-widest text-zinc-950 dark:text-zinc-50"
          >
            E-mail Institucional
          </Label>

          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={initialData?.email}
            disabled={loading || isEdit || !canEditForm}
            placeholder="usuario@empresa.com"
            className="h-11 rounded-xl border-zinc-200 bg-white font-bold text-zinc-500 transition-all focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400"
            required
          />
        </div>

        {!isEdit && (
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="ml-1 text-[10px] font-black uppercase tracking-widest text-zinc-950 dark:text-zinc-50"
            >
              Senha de Acesso
            </Label>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                disabled={loading || !canEditForm}
                className="h-11 rounded-xl border-zinc-200 bg-white pl-10 font-bold text-zinc-500 transition-all focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400"
                required
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label
            htmlFor="role"
            className="ml-1 text-[10px] font-black uppercase tracking-widest text-zinc-950 dark:text-zinc-50"
          >
            Nível de Acesso
          </Label>

          <select
            id="role"
            name="role"
            defaultValue={initialData?.role || "recruiter"}
            disabled={loading || !canEditRole}
            className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-zinc-200 bg-white px-4 text-sm font-bold text-zinc-500 outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400"
          >
            <option
              value="admin"
              className="bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100"
            >
              Administrador
            </option>
            <option
              value="recruiter"
              className="bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100"
            >
              Recrutador
            </option>
          </select>

          {!canEditRole && (
            <p className="ml-1 text-[10px] font-medium text-zinc-400">
              {isEditingSelf
                ? "Você não pode alterar sua própria permissão."
                : "Apenas administradores podem alterar permissões."}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 flex shrink-0 items-center justify-end gap-3 border-t border-zinc-100 pt-6 dark:border-zinc-800">
        <Button
          type="button"
          variant="outline"
          disabled={loading}
          onClick={() => router.push("/dashboard/users")}
          className="h-11 rounded-xl border-zinc-200 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-500 transition-all active:scale-95 dark:border-zinc-800"
        >
          Cancelar
        </Button>

        <Button
          type="submit"
          disabled={loading || !canEditForm}
          className="h-11 gap-2 rounded-xl bg-indigo-600 px-8 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700 active:scale-95"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : isEdit ? (
            <Save size={16} />
          ) : (
            <UserPlus size={16} />
          )}

          {isEdit ? "Salvar Alterações" : "Criar Acesso"}
        </Button>
      </div>
    </form>
  );
}