import { getJobs } from "@/features/jobs/server/get-jobs";
import { JobsClient } from "@/features/jobs/components/JobsClient";
import type { Job } from "@/types/jobs/job";

export default async function JobsPage() {
  const jobs: Job[] = await getJobs();

  return <JobsClient jobs={jobs} />;
}