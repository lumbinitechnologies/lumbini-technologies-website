-- Run this migration in the Supabase SQL Editor.
-- It creates authoritative certificate issuance and public verification.

create sequence if not exists public.certificate_number_seq;

alter table public.certificates
  add column if not exists issue_date date,
  add column if not exists period_start date,
  add column if not exists period_end date,
  add column if not exists role text not null default 'Software Engineer Intern',
  add column if not exists department text not null default 'Engineering & Product',
  add column if not exists status text not null default 'valid';

  update public.certificates
  set role = coalesce(nullif(trim(role), ''), 'Software Engineer Intern'),
     department = coalesce(nullif(trim(department), ''), 'Engineering & Product'),
     status = coalesce(nullif(trim(status), ''), 'valid')
  where role is null
    or trim(role) = ''
    or department is null
    or trim(department) = ''
    or status is null
    or trim(status) = '';

create unique index if not exists certificates_intern_id_unique
  on public.certificates (intern_id)
  where intern_id is not null;

-- The old regeneration flow could create duplicate document rows. Keep the newest row.
delete from public.documents older
using public.documents newer
where older.intern_id = newer.intern_id
  and older.document_type = newer.document_type
  and (
    older.created_at < newer.created_at
    or (older.created_at = newer.created_at and older.id < newer.id)
  );

create unique index if not exists documents_intern_type_unique
  on public.documents (intern_id, document_type);

drop function if exists public.issue_certificate(uuid, date, date, date);

create or replace function public.issue_certificate(
  p_intern_id uuid,
  p_issue_date date,
  p_period_start date,
  p_period_end date
)
returns table (
  id uuid,
  intern_id uuid,
  certificate_id text,
  issue_date date,
  period_start date,
  period_end date,
  role text,
  department text,
  status text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  certificate_row public.certificates;
  next_number bigint;
  current_year integer;
begin
  if auth.uid() is null or not exists (
    select 1 from public.admins where lower(email) = lower(auth.email())
  ) then
    raise exception 'Only administrators can issue certificates';
  end if;

  if p_intern_id is null or p_issue_date is null or p_period_start is null or p_period_end is null then
    raise exception 'Certificate dates and intern are required';
  end if;

  if p_period_end < p_period_start then
    raise exception 'Certificate period end cannot be before its start';
  end if;

  if not exists (select 1 from public.interns where public.interns.id = p_intern_id) then
    raise exception 'Intern not found';
  end if;

  select * into certificate_row
  from public.certificates
  where public.certificates.intern_id = p_intern_id
  for update;

  if certificate_row.id is null then
    current_year := extract(year from p_issue_date)::integer;
    loop
      next_number := nextval('public.certificate_number_seq');
      insert into public.certificates (
        intern_id, certificate_id, issued_at, issue_date, period_start, period_end, role, department, status
      ) values (
        p_intern_id,
        format('LT-IC-%s-%s', current_year, lpad(next_number::text, 6, '0')),
        now(), p_issue_date, p_period_start, p_period_end,
        'Software Engineer Intern', 'Engineering & Product', 'valid'
      ) on conflict do nothing returning * into certificate_row;

      if found then
        exit;
      end if;

      -- A concurrent request may have inserted this intern while we were issuing.
      select * into certificate_row
      from public.certificates
      where public.certificates.intern_id = p_intern_id;
      if certificate_row.id is not null then
        exit;
      end if;
    end loop;
  else
    update public.certificates
    set issue_date = p_issue_date,
        period_start = p_period_start,
        period_end = p_period_end,
        role = 'Software Engineer Intern',
        department = 'Engineering & Product',
        issued_at = now(),
        status = 'valid'
    where public.certificates.id = certificate_row.id
    returning * into certificate_row;
  end if;

  return query
    select certificate_row.id, certificate_row.intern_id, certificate_row.certificate_id,
           certificate_row.issue_date, certificate_row.period_start, certificate_row.period_end,
           certificate_row.role, certificate_row.department, certificate_row.status;
end;
$$;

grant execute on function public.issue_certificate(uuid, date, date, date) to authenticated;

drop function if exists public.verify_certificate(text);

create or replace function public.verify_certificate(p_certificate_id text)
returns table (
  certificate_id text,
  holder_name text,
  internship_start date,
  internship_end date,
  issue_date date,
  role text,
  department text,
  status text
)
language sql
security definer
stable
set search_path = public
as $$
  select c.certificate_id,
         i.name,
         c.period_start,
         c.period_end,
         c.issue_date,
         coalesce(nullif(trim(c.role), ''), 'Software Engineer Intern'),
         coalesce(nullif(trim(c.department), ''), 'Engineering & Product'),
         coalesce(nullif(trim(c.status), ''), 'valid')
  from public.certificates c
  join public.interns i on i.id = c.intern_id
  where upper(trim(c.certificate_id)) = upper(trim(p_certificate_id))
  limit 1;
$$;

revoke all on function public.verify_certificate(text) from public;
grant execute on function public.verify_certificate(text) to anon, authenticated;
