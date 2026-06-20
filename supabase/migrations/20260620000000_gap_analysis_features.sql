-- Gap Analysis Features Migration
-- Adds tables for Grants (NGOs), CBA Documents (Workers Unions), and Visitors (RWAs)

-- 1. Grants Table
create table public.grants (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  title text not null,
  amount numeric(12, 2) not null,
  status text not null default 'draft' check (status in ('draft', 'applied', 'approved', 'rejected', 'completed')),
  deadline timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. CBA Documents Table
create table public.cba_documents (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  title text not null,
  file_url text not null,
  status text not null default 'active' check (status in ('draft', 'active', 'expired')),
  valid_from timestamptz,
  valid_until timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Visitors Table
create table public.visitors (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  name text not null,
  phone text,
  purpose text not null,
  expected_time timestamptz,
  status text not null default 'expected' check (status in ('expected', 'checked_in', 'checked_out', 'denied')),
  logged_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index idx_grants_org on public.grants(organisation_id);
create index idx_cba_org on public.cba_documents(organisation_id);
create index idx_visitors_org on public.visitors(organisation_id);

-- Enable RLS
alter table public.grants enable row level security;
alter table public.cba_documents enable row level security;
alter table public.visitors enable row level security;

-- Policies: Grants
create policy "View grants in organisation"
  on public.grants for select
  using (organisation_id = public.get_auth_org_id());

create policy "Manage grants in organisation"
  on public.grants for all
  using (organisation_id = public.get_auth_org_id());

-- Policies: CBA Documents
create policy "View CBA documents in organisation"
  on public.cba_documents for select
  using (organisation_id = public.get_auth_org_id());

create policy "Manage CBA documents in organisation"
  on public.cba_documents for all
  using (organisation_id = public.get_auth_org_id());

-- Policies: Visitors
create policy "View visitors in organisation"
  on public.visitors for select
  using (organisation_id = public.get_auth_org_id());

create policy "Manage visitors in organisation"
  on public.visitors for all
  using (organisation_id = public.get_auth_org_id());
