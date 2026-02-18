create or replace function public.admin_list_users()
returns table (
  id uuid,
  email text,
  full_name text,
  is_platform_admin boolean,
  status text,
  organisation_count integer
)
language sql
security definer
set search_path = public
as $$
  select
    p.id,
    p.email,
    p.full_name,
    coalesce(p.is_platform_admin, false) as is_platform_admin,
    p.status,
    count(distinct m.organisation_id) as organisation_count
  from public.profiles p
  left join public.members m
    on m.email = p.email
       and m.deleted_at is null
  where exists (
    select 1
    from public.profiles ap
    where ap.id = auth.uid()
      and coalesce(ap.is_platform_admin, false) = true
  )
  group by p.id, p.email, p.full_name, p.is_platform_admin, p.status;
$$;
