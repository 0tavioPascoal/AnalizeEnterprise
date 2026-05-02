"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserCog } from "lucide-react";

import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/Pageheader";
import { UserForm } from "@/components/user/UserForm";
import { UserTips } from "@/components/user/UserTips";

const FIXED_COMPANY = "ACME Ltda";

const mockUsers = [
  { id: "1", name: "João Silva", email: "joao@empresa.com", job: "RH" },
];

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const user = useMemo(() => {
    return mockUsers.find((u) => u.id === id);
  }, [id]);

  async function handleEdit(data: any) {
    console.log("EDIT ID:", id, data);
    toast.success("Usuário atualizado com sucesso!");
    router.push("/dashboard/users");
  }

  return (
    <PageLayout
      header={
        <PageHeader
          title="Editar Usuário"
          description={`Atualize as permissões e dados cadastrais do perfil #${id}`}
          action={
            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
              <UserCog className="w-4 h-4 text-indigo-600" />
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                Modo Edição
              </span>
            </div>
          }
        />
      }
    >
      <div className="grid gap-6 lg:grid-cols-3 items-stretch h-full">
        <div className="lg:col-span-2">
          <UserForm
            initialData={user}
            onSubmit={handleEdit}
            isEdit
          />
        </div>

        <div className="hidden lg:block lg:col-span-1">
          <UserTips />
        </div>
      </div>
    </PageLayout>
  );
}