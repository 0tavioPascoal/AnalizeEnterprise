import { redirect } from "next/navigation";
import { UserPlus } from "lucide-react";

import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/Pageheader";
import { UserForm } from "@/components/user/UserForm";
import { UserTips } from "@/components/user/UserTips";
import { getCurrentProfile } from "@/actions/auth/getCurrentProfile";

export default async function NewUserPage() {
  const currentProfile = await getCurrentProfile();

  if (!currentProfile) {
    redirect("/login");
  }

  return (
    <PageLayout
      header={
        <PageHeader
          title="Cadastro de Usuário"
          description="Adicione novos membros com permissões específicas ao sistema"
          action={
            <div className="flex items-center gap-2 rounded-lg bg-zinc-100 px-3 py-1.5 dark:bg-zinc-800">
              <UserPlus className="h-4 w-4 text-zinc-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Novo Registro
              </span>
            </div>
          }
        />
      }
    >
      <div className="grid h-full items-stretch gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <UserForm
            currentUserId={currentProfile.id}
            currentUserRole={currentProfile.role}
            companyName={currentProfile.company_name ?? "Minha empresa"}
          />
        </div>

        <div className="hidden lg:col-span-1 lg:block">
          <UserTips />
        </div>
      </div>
    </PageLayout>
  );
}
