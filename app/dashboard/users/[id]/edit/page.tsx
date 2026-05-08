import { notFound, redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/Pageheader";
import { PageLayout } from "@/components/layout/PageLayout";
import { UserForm } from "@/components/user/UserForm";
import { UserTips } from "@/components/user/UserTips";

import { createServerClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/actions/auth/getCurrentProfile";

interface EditUserPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params;

  const supabase = await createServerClient();

  const currentProfile = await getCurrentProfile();

  if (!currentProfile) {
    redirect("/login");
  }

  if (!currentProfile.company_id) {
    redirect("/dashboard");
  }

  const { data: user, error } = await supabase
    .from("profiles")
    .select("id, name, email, role, company_id, status")
    .eq("id", id)
    .eq("company_id", currentProfile.company_id)
    .single();

  if (error || !user) {
    notFound();
  }

  return (
    <PageLayout
      header={
        <PageHeader
          title="Editar Usuário"
          description={`Editando: ${user.name ?? "Usuário sem nome"}`}
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
            companyName={
              currentProfile.company_name ?? "Organização não identificada"
            }
          />
        </div>

        <div className="hidden lg:block">
          <UserTips />
        </div>
      </div>
    </PageLayout>
  );
}