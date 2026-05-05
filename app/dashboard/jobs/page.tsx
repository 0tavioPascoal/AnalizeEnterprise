import { getJobs } from "@/actions/jobs/getJobs";
import { JobsClient } from "@/components/jobs/JobsClient";
import type { Job } from "@/types/jobs/job";

export default async function JobsPage() {
  const jobs: Job[] = await getJobs();

  return <JobsClient jobs={jobs} />;
}