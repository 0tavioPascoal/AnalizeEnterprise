import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/Pageheader";
import { PageLayout } from "@/components/layout/PageLayout";
import { JobForm } from "@/components/jobs/JobForm";
import { JobTips } from "@/components/jobs/JobTips";
import { getJobById } from "@/actions/jobs/getJobById";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const job = await getJobById(id);

  if (!job) {
    notFound();
  }

  return (
    <PageLayout
      header={
        <PageHeader
          title="Editar Vaga"
          description={`Editando: ${job.title}`}
        />
      }
    >
      <div className="grid min-h-full items-stretch gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <JobForm initialData={{ ...job, id }} isEdit />
        </div>

        <div className="hidden lg:block lg:col-span-1">
          <JobTips />
        </div>
      </div>
    </PageLayout>
  );
}
