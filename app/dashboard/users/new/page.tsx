"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserForm } from "@/components/user/UserForm";

export default function NewUserPage() {
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleCreate(data: any) {
    console.log("CREATE:", data);

    toast.success("Usuário criado com sucesso!");

    router.push("/dashboard/users");
  }

  return (
    <div className="w-full space-y-6">

      <div>
        <h1 className="text-2xl font-semibold">Cadastro de usuário</h1>
        <p className="text-muted-foreground text-sm">
          Crie novos usuários para o sistema
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <UserForm onSubmit={handleCreate} />
      </div>

    </div>
  );
}
