-- 1. Announcements Table
CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  visibility_level text CHECK (visibility_level IN ('public', 'members', 'volunteer', 'core', 'executive')) DEFAULT 'members',
  is_pinned boolean DEFAULT false,
  send_email boolean DEFAULT false,
  scheduled_at timestamptz,
  expires_at timestamptz,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  email_sent_at timestamptz, -- Track when email was actually sent
  email_stats jsonb DEFAULT '{}'::jsonb -- Store delivery stats (count, success, fail)
);

-- 2. Announcement Views Table
CREATE TABLE public.announcement_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id uuid NOT NULL REFERENCES public.announcements(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  viewed_at timestamptz DEFAULT now(),
  
  CONSTRAINT unique_view UNIQUE (announcement_id, user_id)
);

-- 3. Indexes
CREATE INDEX idx_announcements_org ON public.announcements(organisation_id);
CREATE INDEX idx_announcements_visibility ON public.announcements(visibility_level);
CREATE INDEX idx_views_announcement ON public.announcement_views(announcement_id);
CREATE INDEX idx_views_user ON public.announcement_views(user_id);

-- 4. RLS Policies

-- Enable RLS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_views ENABLE ROW LEVEL SECURITY;

-- Announcements Policies

-- Public View
CREATE POLICY "Public view public announcements"
  ON public.announcements FOR SELECT
  USING (visibility_level = 'public');

-- Members View (Filtered by Org and Role)
-- Note: Role hierarchy logic is complex in RLS. We'll simplify:
-- Members can see 'members' + 'public'
-- Volunteers can see 'volunteer' + 'members' + 'public'
-- etc.
-- Actually, it's easier to check if user belongs to org, and then filter in application query or use a more complex RLS.
-- For now, let's allow org members to SELECT all org announcements, but we must trust the application layer to filter by role OR implement strict RLS.
-- Strict RLS is better for security.

CREATE POLICY "Org members view eligible announcements"
  ON public.announcements FOR SELECT
  USING (
    organisation_id = public.get_auth_org_id() 
    AND (
      visibility_level = 'public' OR
      visibility_level = 'members' OR
      (visibility_level = 'volunteer' AND exists (select 1 from public.profiles where id = auth.uid() and role in ('volunteer', 'core', 'executive', 'admin', 'editor'))) OR
      (visibility_level = 'core' AND exists (select 1 from public.profiles where id = auth.uid() and role in ('core', 'executive', 'admin', 'editor'))) OR
      (visibility_level = 'executive' AND exists (select 1 from public.profiles where id = auth.uid() and role in ('executive', 'admin', 'editor'))) OR
      exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor')) -- Admins see all
    )
  );

-- Manage Announcements (Admin/Editor)
CREATE POLICY "Manage announcements (Admin/Editor)"
  ON public.announcements FOR ALL
  USING (organisation_id = public.get_auth_org_id() and exists (
    select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor')
  ));

-- Views Policies

-- Users can view their own view records
CREATE POLICY "Users view own views"
  ON public.announcement_views FOR SELECT
  USING (user_id = auth.uid());

-- Users can insert their own view records
CREATE POLICY "Users insert own views"
  ON public.announcement_views FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Admins can view all views for their org announcements
CREATE POLICY "Admins view org views"
  ON public.announcement_views FOR SELECT
  USING (exists (
    select 1 from public.announcements a
    where a.id = announcement_views.announcement_id
    and a.organisation_id = public.get_auth_org_id()
    and exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor'))
  ));
