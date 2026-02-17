-- Enable necessary extensions
create extension if not exists "pgcrypto";

-- 1. Organizations Table
create table public.organisations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  remove_branding boolean default false,
  is_suspended boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Profiles Table (Links Auth User to Organisation)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  full_name text,
  email text not null,
  role text not null check (role in ('admin', 'editor', 'viewer')),
  is_platform_admin boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Members Table (Beneficiaries/Staff/Volunteers)
create table public.members (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  full_name text not null,
  email text,
  phone text,
  role text check (role in ('admin', 'editor', 'viewer', 'member')) default 'member',
  joined_at timestamptz default now(),
  created_at timestamptz default now(),
  
  -- Unique phone per organisation constraint
  constraint unique_phone_per_org unique (organisation_id, phone)
);

-- 4. Forms Table
create table public.forms (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  title text not null,
  description text,
  fields jsonb not null default '[]',
  is_active boolean default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. Form Submissions Table
create table public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  form_id uuid not null references public.forms(id) on delete cascade,
  data jsonb not null,
  submitted_at timestamptz default now()
);

-- 6. Meetings Table
create table public.meetings (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  title text not null,
  description text,
  date timestamptz not null,
  end_time timestamptz,
  location text,
  visibility text not null default 'members' check (visibility in ('public', 'members', 'private')),
  meeting_link text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- 7. Meeting Attendance Table
create table public.meeting_attendance (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  meeting_id uuid not null references public.meetings(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,
  status text check (status in ('present', 'absent', 'excused')) default 'present',
  created_at timestamptz default now(),
  
  -- Prevent duplicate attendance records
  constraint unique_attendance unique (meeting_id, member_id)
);

-- 8. Donations Table
create table public.donations (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  donor_name text not null,
  amount numeric(10, 2) not null check (amount > 0),
  date timestamptz default now(),
  payment_method text,
  upi_reference text,
  notes text,
  verified_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  
  -- Unique UPI reference per organisation to prevent double counting
  constraint unique_upi_per_org unique (organisation_id, upi_reference)
);

-- 9. Supporter Subscriptions Table (Razorpay)
create table public.supporter_subscriptions (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  razorpay_subscription_id text unique not null,
  razorpay_plan_id text not null,
  status text not null,
  amount numeric(10, 2) not null,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 10. Audit Logs Table
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  resource_table text not null,
  resource_id uuid not null,
  details jsonb,
  created_at timestamptz default now()
);

-- Indexes for Performance
create index idx_profiles_org on public.profiles(organisation_id);
create index idx_members_org on public.members(organisation_id);
create index idx_members_phone on public.members(phone);
create index idx_forms_org on public.forms(organisation_id);
create index idx_submissions_form on public.form_submissions(form_id);
create index idx_meetings_org on public.meetings(organisation_id);
create index idx_attendance_meeting on public.meeting_attendance(meeting_id);
create index idx_donations_org on public.donations(organisation_id);
create index idx_donations_upi on public.donations(upi_reference);
create index idx_subscriptions_org on public.supporter_subscriptions(organisation_id);
create index idx_audit_org on public.audit_logs(organisation_id);

-- RLS Helper Function: Get Current User's Organisation ID
create or replace function public.get_auth_org_id()
returns uuid
language sql
security definer
stable
as $$
  select organisation_id
  from public.profiles
  where id = auth.uid()
$$;

-- Enable RLS on all tables
alter table public.organisations enable row level security;
alter table public.profiles enable row level security;
alter table public.members enable row level security;
alter table public.forms enable row level security;
alter table public.form_submissions enable row level security;
alter table public.meetings enable row level security;
alter table public.meeting_attendance enable row level security;
alter table public.donations enable row level security;
alter table public.supporter_subscriptions enable row level security;
alter table public.audit_logs enable row level security;

-- Policies

-- Organisations
create policy "Users can view their own organisation"
  on public.organisations for select
  using (id = public.get_auth_org_id());

create policy "Admins can update their own organisation"
  on public.organisations for update
  using (id = public.get_auth_org_id() and exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

-- Profiles
create policy "Users can view profiles in their organisation"
  on public.profiles for select
  using (organisation_id = public.get_auth_org_id());

create policy "Users can update their own profile"
  on public.profiles for update
  using (id = auth.uid());

-- Members
create policy "View members in organisation"
  on public.members for select
  using (organisation_id = public.get_auth_org_id());

create policy "Manage members (Admin/Editor)"
  on public.members for all
  using (organisation_id = public.get_auth_org_id() and exists (
    select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor')
  ));

-- Forms
create policy "View forms in organisation"
  on public.forms for select
  using (organisation_id = public.get_auth_org_id());

create policy "Manage forms (Admin/Editor)"
  on public.forms for all
  using (organisation_id = public.get_auth_org_id() and exists (
    select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor')
  ));

-- Form Submissions
create policy "Public can submit forms"
  on public.form_submissions for insert
  with check (true);

create policy "View submissions (Admin/Editor)"
  on public.form_submissions for select
  using (organisation_id = public.get_auth_org_id() and exists (
    select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor')
  ));

-- Meetings
create policy "View meetings in organisation"
  on public.meetings for select
  using (organisation_id = public.get_auth_org_id());

create policy "Manage meetings (Admin/Editor)"
  on public.meetings for all
  using (organisation_id = public.get_auth_org_id() and exists (
    select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor')
  ));

-- Meeting Attendance
create policy "View attendance in organisation"
  on public.meeting_attendance for select
  using (organisation_id = public.get_auth_org_id());

create policy "Manage attendance (Admin/Editor)"
  on public.meeting_attendance for all
  using (organisation_id = public.get_auth_org_id() and exists (
    select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor')
  ));

-- Donations
create policy "View donations in organisation"
  on public.donations for select
  using (organisation_id = public.get_auth_org_id());

create policy "Manage donations (Admin/Editor)"
  on public.donations for all
  using (organisation_id = public.get_auth_org_id() and exists (
    select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor')
  ));

-- Supporter Subscriptions
create policy "View subscriptions in organisation"
  on public.supporter_subscriptions for select
  using (organisation_id = public.get_auth_org_id());

-- Audit Logs
create policy "View logs (Admin only)"
  on public.audit_logs for select
  using (organisation_id = public.get_auth_org_id() and exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

create policy "System can insert logs"
  on public.audit_logs for insert
  with check (auth.uid() is not null); -- Ideally done via triggers/functions

-- Super Admin Bypass (Safety Hatch)
-- Note: This relies on a specific profile attribute or separate table.
-- Here we check the is_platform_admin flag on the profile.
-- However, since RLS is on profiles too, we need to be careful.
-- This is a simplified version. A true super-admin usually bypasses RLS via service key.
