import { PageHeader } from "@/components/layout/Pageheader";
import { PageLayout } from "@/components/layout/PageLayout";
import { UserForm } from "@/components/user/UserForm";
import { UserTips } from "@/components/user/UserTips";

import { createServerClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/actions/auth/getCurrentProfile";

import { notFound, redirect } from "next/navigation";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createServerClient();
  const { id } = await params;

  const currentProfile = await getCurrentProfile();

  if (!currentProfile) {
    redirect("/login");
  }

  const { data: user, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !user) {
    notFound();
  }

  return (
    <PageLayout
      header={
        <PageHeader
          title="Editar Usuário"
          description={`Editando: ${user.name}`}
        />
      }
    >
      <div className="grid h-full gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <UserForm
            initialData={user}
            isEdit
            currentUserId={currentProfile.id}
            currentUserRole={currentProfile.role}
            companyName={currentProfile.company_name ?? "Minha Empresa"}
          />
        </div>

        <div className="hidden lg:block">
          <UserTips />
        </div>
      </div>
    </PageLayout>
  );
}