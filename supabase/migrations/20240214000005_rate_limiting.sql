-- Rate Limiting Table
create table if not exists rate_limits (
  id uuid primary key default gen_random_uuid(),
  key text not null, -- e.g. "form_submission:form_id:ip"
  created_at timestamptz default now()
);

create index if not exists idx_rate_limits_key_created_at on rate_limits(key, created_at);

-- RLS: Only service role can access (default is no access if RLS enabled, but we won't enable RLS for this internal table or we'll set it to false)
alter table rate_limits enable row level security;
-- No policies means no public access, which is what we want. Service role bypasses RLS.
