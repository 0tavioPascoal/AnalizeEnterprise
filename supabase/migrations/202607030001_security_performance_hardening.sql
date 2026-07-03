create or replace function public.current_company_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select company_id
  from public.profiles
  where id = auth.uid()
  limit 1
$$;

alter table if exists public.companies enable row level security;
alter table if exists public.profiles enable row level security;
alter table if exists public.jobs enable row level security;
alter table if exists public.candidate_analysis enable row level security;
alter table if exists public.interview_guides enable row level security;
alter table if exists public.candidate_email_templates enable row level security;

create index if not exists idx_profiles_company_id
  on public.profiles (company_id);

create index if not exists idx_jobs_company_title
  on public.jobs (company_id, title);

create index if not exists idx_candidate_analysis_company_status_created
  on public.candidate_analysis (company_id, status, created_at desc);

create index if not exists idx_candidate_analysis_company_pipeline_created
  on public.candidate_analysis (company_id, pipeline_stage, created_at desc);

create index if not exists idx_candidate_analysis_company_job
  on public.candidate_analysis (company_id, job_id);

create index if not exists idx_interview_guides_company_analysis
  on public.interview_guides (company_id, analysis_id);

do $$
begin
  if to_regclass('public.candidate_email_templates') is not null then
    create index if not exists idx_candidate_email_templates_company_type
      on public.candidate_email_templates (company_id, type);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'companies'
      and policyname = 'companies_select_own_company'
  ) then
    create policy companies_select_own_company
      on public.companies
      for select
      to authenticated
      using (id = public.current_company_id());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'profiles_select_own_company'
  ) then
    create policy profiles_select_own_company
      on public.profiles
      for select
      to authenticated
      using (company_id = public.current_company_id());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'profiles_update_self'
  ) then
    create policy profiles_update_self
      on public.profiles
      for update
      to authenticated
      using (id = auth.uid() and company_id = public.current_company_id())
      with check (id = auth.uid() and company_id = public.current_company_id());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'jobs'
      and policyname = 'jobs_crud_own_company'
  ) then
    create policy jobs_crud_own_company
      on public.jobs
      for all
      to authenticated
      using (company_id = public.current_company_id())
      with check (company_id = public.current_company_id());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'candidate_analysis'
      and policyname = 'candidate_analysis_crud_own_company'
  ) then
    create policy candidate_analysis_crud_own_company
      on public.candidate_analysis
      for all
      to authenticated
      using (company_id = public.current_company_id())
      with check (company_id = public.current_company_id());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'interview_guides'
      and policyname = 'interview_guides_crud_own_company'
  ) then
    create policy interview_guides_crud_own_company
      on public.interview_guides
      for all
      to authenticated
      using (company_id = public.current_company_id())
      with check (company_id = public.current_company_id());
  end if;
end
$$;

do $$
begin
  if to_regclass('public.candidate_email_templates') is not null
    and not exists (
      select 1 from pg_policies
      where schemaname = 'public'
        and tablename = 'candidate_email_templates'
        and policyname = 'candidate_email_templates_crud_own_company'
    )
  then
    create policy candidate_email_templates_crud_own_company
      on public.candidate_email_templates
      for all
      to authenticated
      using (company_id = public.current_company_id())
      with check (company_id = public.current_company_id());
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'candidate_cvs_select_own_company'
  ) then
    create policy candidate_cvs_select_own_company
      on storage.objects
      for select
      to authenticated
      using (
        bucket_id = 'candidate-cvs'
        and (storage.foldername(name))[1] = public.current_company_id()::text
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'candidate_cvs_insert_own_company'
  ) then
    create policy candidate_cvs_insert_own_company
      on storage.objects
      for insert
      to authenticated
      with check (
        bucket_id = 'candidate-cvs'
        and (storage.foldername(name))[1] = public.current_company_id()::text
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'candidate_cvs_delete_own_company'
  ) then
    create policy candidate_cvs_delete_own_company
      on storage.objects
      for delete
      to authenticated
      using (
        bucket_id = 'candidate-cvs'
        and (storage.foldername(name))[1] = public.current_company_id()::text
      );
  end if;
end
$$;
