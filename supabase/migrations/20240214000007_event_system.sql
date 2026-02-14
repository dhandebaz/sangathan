-- Rename tables
ALTER TABLE public.meetings RENAME TO events;
ALTER TABLE public.meeting_attendance RENAME TO event_rsvps;

-- Update events table
ALTER TABLE public.events 
  RENAME COLUMN date TO start_time;

ALTER TABLE public.events
  ADD COLUMN end_time timestamptz,
  ADD COLUMN event_type text CHECK (event_type IN ('public', 'members', 'volunteer', 'core', 'executive')) DEFAULT 'members',
  ADD COLUMN rsvp_enabled boolean DEFAULT false,
  ADD COLUMN capacity integer;

-- Update event_rsvps table
ALTER TABLE public.event_rsvps
  RENAME COLUMN meeting_id TO event_id;

ALTER TABLE public.event_rsvps
  ADD COLUMN user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN guest_name text,
  ADD COLUMN guest_email text,
  ADD COLUMN checked_in_at timestamptz;

-- Update status constraint
ALTER TABLE public.event_rsvps DROP CONSTRAINT IF EXISTS meeting_attendance_status_check;
ALTER TABLE public.event_rsvps 
  ADD CONSTRAINT event_rsvps_status_check 
  CHECK (status IN ('registered', 'attended', 'cancelled'));

-- Add Indexes
CREATE INDEX IF NOT EXISTS idx_events_type ON public.events(event_type);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_event ON public.event_rsvps(event_id);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_user ON public.event_rsvps(user_id);

-- Update RLS Policies for Events
DROP POLICY IF EXISTS "View meetings in organisation" ON public.events;
DROP POLICY IF EXISTS "Manage meetings (Admin/Editor)" ON public.events;

CREATE POLICY "Public view public events"
  ON public.events FOR SELECT
  USING (event_type = 'public');

CREATE POLICY "Members view org events"
  ON public.events FOR SELECT
  USING (organisation_id = public.get_auth_org_id());

CREATE POLICY "Manage events (Admin/Editor)"
  ON public.events FOR ALL
  USING (organisation_id = public.get_auth_org_id() and exists (
    select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor')
  ));

-- Update RLS Policies for RSVPs
DROP POLICY IF EXISTS "View attendance in organisation" ON public.event_rsvps;
DROP POLICY IF EXISTS "Manage attendance (Admin/Editor)" ON public.event_rsvps;

CREATE POLICY "Public can rsvp"
  ON public.event_rsvps FOR INSERT
  WITH CHECK (true); -- Allow guests to insert? Ideally validated via action/function but RLS needs to be open or use service role for guests.
  -- Actually, for guest RSVP we usually use a server action with service role to verify constraints, so we can keep RLS strict if we want.
  -- But logged in users should be able to see their own RSVPs.

CREATE POLICY "Users view own rsvps"
  ON public.event_rsvps FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Org members view rsvps"
  ON public.event_rsvps FOR SELECT
  USING (exists (
    select 1 from public.events e 
    where e.id = event_rsvps.event_id 
    and e.organisation_id = public.get_auth_org_id()
  ));

CREATE POLICY "Manage rsvps (Admin/Editor)"
  ON public.event_rsvps FOR ALL
  USING (exists (
    select 1 from public.events e 
    where e.id = event_rsvps.event_id 
    and e.organisation_id = public.get_auth_org_id()
    and exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor'))
  ));
