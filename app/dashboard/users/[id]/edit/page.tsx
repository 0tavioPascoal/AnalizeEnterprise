"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserForm } from "@/components/user/UserForm";

const FIXED_COMPANY = "ACME Ltda";

const mockUsers = [
  { id: "1", name: "João Silva", email: "joao@empresa.com", company: FIXED_COMPANY },
];

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const user = useMemo(() => {
    return mockUsers.find((u) => u.id === id);
  }, [id]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleEdit(data: any) {
    console.log("EDIT:", data);

    toast.success("Usuário atualizado com sucesso!");

    router.push("/dashboard/users");
  }

  return (
    <div className="w-full space-y-6">

      <div>
        <h1 className="text-2xl font-semibold">Editar usuário</h1>
        <p className="text-muted-foreground text-sm">
          Atualize os dados do usuário
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <UserForm
          initialData={user}
          onSubmit={handleEdit}
          isEdit
        />
      </div>

    </div>
  );
}
