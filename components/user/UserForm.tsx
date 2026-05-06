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
      className="flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-8 shadow-sm transition-all"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="ml-1 text-[10px] font-black uppercase tracking-widest text-foreground">
            Organização Vinculada
          </Label>

          <div className="relative">
            <Building2 className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

            <Input
              value={companyName}
              disabled
              className="h-11 cursor-not-allowed rounded-xl border-border bg-zinc-100 pl-10 font-bold text-zinc-700 shadow-sm disabled:opacity-100 dark:bg-zinc-900 dark:text-zinc-200"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="name"
            className="ml-1 text-[10px] font-black uppercase tracking-widest text-foreground"
          >
            Nome Completo
          </Label>

          <Input
            id="name"
            name="name"
            defaultValue={initialData?.name}
            placeholder="Ex: Otávio Augusto Pascoal"
            disabled={loading || !canEditForm}
            className="h-11 rounded-xl border-border bg-zinc-50 font-semibold text-zinc-900 shadow-sm transition-all placeholder:text-muted-foreground hover:border-primary/20 focus-visible:border-primary/30 focus-visible:ring-2 focus-visible:ring-primary/20 dark:bg-zinc-900/60 dark:text-zinc-100"
            required
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="ml-1 text-[10px] font-black uppercase tracking-widest text-foreground"
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
            className="h-11 rounded-xl border-border bg-zinc-50 font-semibold text-zinc-900 shadow-sm transition-all placeholder:text-muted-foreground hover:border-primary/20 focus-visible:border-primary/30 focus-visible:ring-2 focus-visible:ring-primary/20 dark:bg-zinc-900/60 dark:text-zinc-100"
            required
          />
        </div>

        {!isEdit && (
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="ml-1 text-[10px] font-black uppercase tracking-widest text-foreground"
            >
              Senha de Acesso
            </Label>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                disabled={loading || !canEditForm}
                className="h-11 rounded-xl border-border bg-zinc-50 pl-10 font-semibold text-zinc-900 shadow-sm transition-all placeholder:text-muted-foreground hover:border-primary/20 focus-visible:border-primary/30 focus-visible:ring-2 focus-visible:ring-primary/20 dark:bg-zinc-900/60 dark:text-zinc-100"
                required
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label
            htmlFor="role"
            className="ml-1 text-[10px] font-black uppercase tracking-widest text-foreground"
          >
            Nível de Acesso
          </Label>

          <select
            id="role"
            name="role"
            defaultValue={initialData?.role || "recruiter"}
            disabled={loading || !canEditRole}
            className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-border bg-zinc-50 px-4 text-sm font-semibold text-zinc-900 shadow-sm outline-none transition-all hover:border-primary/20 focus:border-primary/30 focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-900 dark:text-zinc-100"
          >
            <option
              value="admin"
              className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100"
            >
              Administrador
            </option>

            <option
              value="recruiter"
              className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100"
            >
              Recrutador
            </option>
          </select>

          {!canEditRole && (
            <p className="ml-1 text-[10px] font-medium text-muted-foreground">
              {isEditingSelf
                ? "Você não pode alterar sua própria permissão."
                : "Apenas administradores podem alterar permissões."}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 flex shrink-0 items-center justify-end gap-3 border-t border-border pt-6">
        <Button
          type="button"
          variant="outline"
          disabled={loading}
          onClick={() => router.push("/dashboard/users")}
          className="h-11 rounded-xl border-border bg-card px-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground shadow-sm transition-all hover:bg-muted hover:text-foreground active:scale-95"
        >
          Cancelar
        </Button>

        <Button
          type="submit"
          disabled={loading || !canEditForm}
          className="h-11 gap-2 rounded-xl bg-primary px-8 text-[10px] font-black uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95"
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