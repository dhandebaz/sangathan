-- 1. Organisation Links
CREATE TABLE public.organisation_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_org_id uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  responder_org_id uuid REFERENCES public.organisations(id) ON DELETE CASCADE,
  status text CHECK (status IN ('pending', 'active', 'rejected')) DEFAULT 'pending',
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT unique_link UNIQUE (requester_org_id, responder_org_id),
  CONSTRAINT no_self_link CHECK (requester_org_id != responder_org_id)
);

-- 2. Collaboration Roles (Configuration for the link)
CREATE TABLE public.collaboration_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id uuid NOT NULL REFERENCES public.organisation_links(id) ON DELETE CASCADE,
  org_id uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE, -- The org these permissions apply TO (or BY? usually 'settings for this org in this link')
  can_create_joint_events boolean DEFAULT true,
  can_send_joint_announcements boolean DEFAULT true,
  can_view_shared_volunteers boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT unique_role_config UNIQUE (link_id, org_id)
);

-- 3. Joint Events (Mapping)
CREATE TABLE public.joint_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  organisation_id uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE, -- The collaborating org that is NOT the owner
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT unique_joint_event UNIQUE (event_id, organisation_id)
);

-- 4. Joint Announcements (Mapping)
CREATE TABLE public.joint_announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id uuid NOT NULL REFERENCES public.announcements(id) ON DELETE CASCADE,
  organisation_id uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT unique_joint_announcement UNIQUE (announcement_id, organisation_id)
);

-- 5. Indexes
CREATE INDEX idx_links_requester ON public.organisation_links(requester_org_id);
CREATE INDEX idx_links_responder ON public.organisation_links(responder_org_id);
CREATE INDEX idx_joint_events_org ON public.joint_events(organisation_id);
CREATE INDEX idx_joint_announcements_org ON public.joint_announcements(organisation_id);

-- 6. RLS Policies

-- Enable RLS
ALTER TABLE public.organisation_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.joint_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.joint_announcements ENABLE ROW LEVEL SECURITY;

-- Organisation Links Policies
-- Admins of either org can view the link
CREATE POLICY "Admins view org links"
  ON public.organisation_links FOR SELECT
  USING (
    (requester_org_id = public.get_auth_org_id() OR responder_org_id = public.get_auth_org_id())
    AND exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'executive'))
  );

-- Admins of requester can insert
CREATE POLICY "Admins create org links"
  ON public.organisation_links FOR INSERT
  WITH CHECK (
    requester_org_id = public.get_auth_org_id()
    AND exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'executive'))
  );

-- Admins of responder can update status
CREATE POLICY "Admins update org links"
  ON public.organisation_links FOR UPDATE
  USING (
    (requester_org_id = public.get_auth_org_id() OR responder_org_id = public.get_auth_org_id())
    AND exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'executive'))
  );

-- Joint Events Policies
-- Public/Members can view if it belongs to their org via joint mapping
CREATE POLICY "View joint events"
  ON public.joint_events FOR SELECT
  USING (
    organisation_id = public.get_auth_org_id() -- For internal dashboard
    OR 
    exists (select 1 from public.events e where e.id = joint_events.event_id and e.event_type = 'public') -- Public
  );

-- Admins can create joint mappings
CREATE POLICY "Admins manage joint events"
  ON public.joint_events FOR ALL
  USING (
    exists (
      select 1 from public.events e 
      where e.id = joint_events.event_id 
      and e.organisation_id = public.get_auth_org_id()
      and exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor'))
    )
  );

-- Update Event Visibility RLS (Important!)
-- We need to update the existing policies on `events` table to allow viewing if in `joint_events`.
-- This is complex with just SQL if we don't want recursion.
-- Strategy: We'll keep the `events` RLS strict, but allow `select` if `id` is in `joint_events`.
-- Note: 'Members view org events' policy needs update.

CREATE OR REPLACE FUNCTION public.is_org_member(org_id uuid) RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND organisation_id = org_id 
    AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- We'll add a new policy to events
CREATE POLICY "Members view joint events"
  ON public.events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.joint_events je 
      WHERE je.event_id = id 
      AND je.organisation_id = public.get_auth_org_id()
    )
  );

-- Same for Announcements
CREATE POLICY "Members view joint announcements"
  ON public.announcements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.joint_announcements ja 
      WHERE ja.announcement_id = id 
      AND ja.organisation_id = public.get_auth_org_id()
    )
  );

-- Public transparency for joint events?
-- If event is public, it's already visible via 'Public view public events' policy (event_type='public').
-- But we want it to show up on the collaborator's page too.
