import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/PageHeader";

import { EmailTemplateForm } from "@/features/email/components/EmailTemplateForm";

import { getEmailTemplates } from "@/features/email/server/mail-templates";

export default async function EmailTemplatesPage() {
  const templates = await getEmailTemplates();

  return (
    <PageLayout
      header={
        <PageHeader
          title="Templates de e-mail"
          description="Configure as mensagens enviadas aos candidatos aprovados e reprovados."
        />
      }
    >
      <EmailTemplateForm initialTemplates={templates} />
    </PageLayout>
  );
}