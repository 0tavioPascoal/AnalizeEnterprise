"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserFormData {
  name: string;
  email: string;
  job?: string;
}

interface UserFormProps {
  onSubmit: (data: UserFormData) => void;
  initialData?: UserFormData;
  isEdit?: boolean;
}

export function UserForm({ onSubmit, initialData, isEdit }: UserFormProps) {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: UserFormData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      job: formData.get("job") as string,
    };

    onSubmit(data);
  };

  return (
    /* 
       BORDA DE DELIMITAÇÃO: 
       Adicionamos 'border', 'border-zinc-200' e 'rounded-2xl' para criar o container.
       O 'p-8' garante um respiro interno profissional.
    */
    <form 
      onSubmit={handleSubmit} 
      className="h-full flex flex-col justify-between p-8 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white/50 dark:bg-zinc-900/50 shadow-sm transition-all"
    >
      {/* CORPO DO FORMULÁRIO */}
      <div className="space-y-8">
        <div className="space-y-3">
          <Label htmlFor="name" className="text-[11px] font-black uppercase tracking-widest text-zinc-400 ml-1">
            Nome Completo
          </Label>
          <Input 
            id="name"
            name="name"
            defaultValue={initialData?.name}
            placeholder="Ex: Otávio Augusto Pascoal" 
            className="h-12 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            required
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="email" className="text-[11px] font-black uppercase tracking-widest text-zinc-400 ml-1">
            E-mail Institucional
          </Label>
          <Input 
            id="email"
            name="email"
            type="email"
            defaultValue={initialData?.email}
            placeholder="usuario@empresa.com" 
            className="h-12 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            required
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="job" className="text-[11px] font-black uppercase tracking-widest text-zinc-400 ml-1">
            Cargo / Departamento
          </Label>
          <div className="relative">
            <select 
              id="job"
              name="job"
              defaultValue={initialData?.job}
              className="w-full h-12 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 bg-white dark:bg-zinc-950 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none appearance-none cursor-pointer"
            >
              <option value="">Selecione o cargo</option>
              <option value="Admin">Administrador</option>
              <option value="RH">Recrutador (RH)</option>
              <option value="Manager">Gestor de Área</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* AÇÕES - ANCORADAS NA BASE */}
      <div className="flex items-center justify-end gap-4 pt-8 mt-10 border-t border-zinc-100 dark:border-zinc-800 shrink-0">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/users")}
          className="h-12 px-8 rounded-xl text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all font-bold uppercase text-[10px] tracking-widest"
        >
          Cancelar
        </Button>

        <Button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 px-10 rounded-xl shadow-lg shadow-indigo-500/20 active:scale-95 transition-all uppercase text-[10px] tracking-widest"
        >
          {isEdit ? "Salvar Alterações" : "Concluir Cadastro"}
        </Button>
      </div>
    </form>
  );
}