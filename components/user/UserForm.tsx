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
import { UserRole, type UserFormData } from "@/types/user/user";

interface UserFormProps {
  initialData?: UserFormData & { id?: string };
  isEdit?: boolean;
}

const DEFAULT_ORG_ID = "b79b3522-7176-4131-8426-287a26f79e22";
const COMPANY_NAME = "ZELLA";

export function UserForm({ initialData, isEdit = false }: UserFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    // Construção do Payload Tipado sem 'any'
    const payload: UserFormData = {
      name: String(formData.get("name")),
      email: String(formData.get("email")),
      role: formData.get("role") as UserRole,
      company_id: DEFAULT_ORG_ID,
    };

    try {
      let result;

      if (isEdit && initialData?.id) {
        // Fluxo de Edição
        result = await updateUser(initialData.id, payload);
      } else {
        // Fluxo de Criação
        payload.password = String(formData.get("password"));
        result = await createUser(payload);
      }

      if (result.success) {
        toast.success(result.message);
        router.push("/dashboard/users");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Erro na submissão:", error);
      toast.error("Erro crítico ao processar requisição.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="h-full flex flex-col justify-between p-8 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white/50 dark:bg-zinc-900/50 shadow-sm transition-all"
    >
      <div className="space-y-6">
        {/* ORGANIZAÇÃO (Somente leitura) */}
        <div className="space-y-2 opacity-70">
          <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
            Organização Vinculada
          </Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
            <Input
              value={COMPANY_NAME}
              disabled
              className="pl-10 h-11 rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/50 cursor-not-allowed font-medium text-zinc-600 dark:text-zinc-400"
            />
          </div>
        </div>

        {/* NOME COMPLETO */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
            Nome Completo
          </Label>
          <Input
            id="name"
            name="name"
            defaultValue={initialData?.name}
            placeholder="Ex: Otávio Augusto Pascoal"
            disabled={loading}
            className="h-11 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            required
          />
        </div>

        {/* E-MAIL (Desabilitado na edição por ser chave do Auth) */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
            E-mail Institucional
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={initialData?.email}
            disabled={loading || isEdit}
            placeholder="usuario@empresa.com"
            className="h-11 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            required
          />
        </div>

        {/* SENHA (Apenas na criação) */}
        {!isEdit && (
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
              Senha de Acesso
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                disabled={loading}
                className="pl-10 h-11 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                required
              />
            </div>
          </div>
        )}

        {/* NÍVEL DE ACESSO */}
        <div className="space-y-2">
          <Label htmlFor="role" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
            Nível de Acesso
          </Label>
          <select
            id="role"
            name="role"
            defaultValue={initialData?.role || "recruiter"}
            disabled={loading}
            className="w-full h-11 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 bg-white dark:bg-zinc-950 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none appearance-none cursor-pointer"
          >
            <option value="admin">Administrador</option>
            <option value="recruiter">Recrutador</option>
          </select>
        </div>
      </div>

      {/* FOOTER DE AÇÕES */}
      <div className="flex items-center justify-end gap-3 pt-6 mt-8 border-t border-zinc-100 dark:border-zinc-800 shrink-0">
        <Button
          type="button"
          variant="outline"
          disabled={loading}
          onClick={() => router.push("/dashboard/users")}
          className="h-11 px-6 rounded-xl text-zinc-500 border-zinc-200 dark:border-zinc-800 font-bold uppercase text-[10px] tracking-widest"
        >
          Cancelar
        </Button>

        <Button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 px-8 rounded-xl shadow-lg shadow-indigo-500/20 transition-all uppercase text-[10px] tracking-widest gap-2"
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