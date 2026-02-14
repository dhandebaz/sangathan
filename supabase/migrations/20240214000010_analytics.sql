-- 1. Enable Public Transparency
ALTER TABLE public.organisations 
ADD COLUMN IF NOT EXISTS public_transparency_enabled boolean DEFAULT false;

-- 2. Indexes for Analytics Performance
CREATE INDEX IF NOT EXISTS idx_members_created_at ON public.members(created_at);
CREATE INDEX IF NOT EXISTS idx_events_start_time ON public.events(start_time);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON public.tasks(created_at);
CREATE INDEX IF NOT EXISTS idx_task_logs_created_at ON public.task_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON public.donations(created_at);
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON public.announcements(created_at);

-- 3. Analytics View (Optional, but safer to use RLS-compliant queries in code)
-- We will use server-side aggregation in Next.js to respect RLS and logic flexibility.
