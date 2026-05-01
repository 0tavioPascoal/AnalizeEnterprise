export interface Job {
  id: string;
  title: string;
  context: string | null;
  score_min: number | null;
  created_at: string;
}

export interface CreateJobDTO {
  title: string;
  context: string;
  score_min: number;
}
