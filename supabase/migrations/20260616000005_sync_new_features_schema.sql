-- Sync missing features schema

-- 1. Announcements missing columns
ALTER TABLE public.announcements
ADD COLUMN IF NOT EXISTS scheduled_at timestamptz,
ADD COLUMN IF NOT EXISTS expires_at timestamptz,
ADD COLUMN IF NOT EXISTS email_sent_at timestamptz,
ADD COLUMN IF NOT EXISTS email_stats jsonb;

-- 2. Polls missing columns
ALTER TABLE public.polls
ADD COLUMN IF NOT EXISTS type text,
ADD COLUMN IF NOT EXISTS visibility_level text,
ADD COLUMN IF NOT EXISTS quorum_percentage numeric,
ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS final_results jsonb;

-- 3. Meetings table
CREATE TABLE IF NOT EXISTS public.meetings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    date timestamptz NOT NULL,
    end_time timestamptz,
    location text,
    visibility text DEFAULT 'members',
    meeting_link text,
    created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.meeting_attendance (
    meeting_id uuid NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
    member_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status text NOT NULL DEFAULT 'absent',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    PRIMARY KEY (meeting_id, member_id)
);

-- 4. Appeals table
CREATE TABLE IF NOT EXISTS public.appeals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    type text NOT NULL,
    reason text NOT NULL,
    status text NOT NULL DEFAULT 'pending',
    metadata jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 5. Organisation Links (Collaboration) table
CREATE TABLE IF NOT EXISTS public.organisation_links (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_org_id uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    responder_org_id uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    status text NOT NULL DEFAULT 'pending',
    created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE (requester_org_id, responder_org_id)
);

-- 6. Joint Events table
CREATE TABLE IF NOT EXISTS public.joint_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    organisation_id uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    UNIQUE (event_id, organisation_id)
);

-- RLS Policies

ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appeals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organisation_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.joint_events ENABLE ROW LEVEL SECURITY;

-- Meetings RLS
CREATE POLICY "Meetings are viewable by organisation members"
    ON public.meetings FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.organisation_id = meetings.organisation_id
            AND profiles.id = auth.uid()
        )
    );

CREATE POLICY "Meetings can be created by admins and editors"
    ON public.meetings FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.organisation_id = meetings.organisation_id
            AND profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'editor')
        )
    );

CREATE POLICY "Meetings can be updated by admins and editors"
    ON public.meetings FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.organisation_id = meetings.organisation_id
            AND profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'editor')
        )
    );

CREATE POLICY "Meetings can be deleted by admins"
    ON public.meetings FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.organisation_id = meetings.organisation_id
            AND profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Meeting Attendance RLS
CREATE POLICY "Meeting attendance is viewable by organisation members"
    ON public.meeting_attendance FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.meetings
            JOIN public.profiles ON profiles.organisation_id = meetings.organisation_id
            WHERE meetings.id = meeting_attendance.meeting_id
            AND profiles.id = auth.uid()
        )
    );

CREATE POLICY "Meeting attendance can be updated by admins and editors"
    ON public.meeting_attendance FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.meetings
            JOIN public.profiles ON profiles.organisation_id = meetings.organisation_id
            WHERE meetings.id = meeting_attendance.meeting_id
            AND profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'editor')
        )
    );

-- Appeals RLS
CREATE POLICY "Appeals are viewable by admins"
    ON public.appeals FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.organisation_id = appeals.organisation_id
            AND profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Appeals can be inserted by anyone"
    ON public.appeals FOR INSERT
    WITH CHECK (true); -- Public insertion allowed for suspended orgs

CREATE POLICY "Appeals can be updated by admins"
    ON public.appeals FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.organisation_id = appeals.organisation_id
            AND profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Organisation Links RLS
CREATE POLICY "Organisation links viewable by involved orgs"
    ON public.organisation_links FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE (profiles.organisation_id = organisation_links.requester_org_id 
               OR profiles.organisation_id = organisation_links.responder_org_id)
            AND profiles.id = auth.uid()
        )
    );

CREATE POLICY "Organisation links can be created by admins"
    ON public.organisation_links FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.organisation_id = organisation_links.requester_org_id
            AND profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'executive')
        )
    );

CREATE POLICY "Organisation links can be updated by involved admins"
    ON public.organisation_links FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE (profiles.organisation_id = organisation_links.requester_org_id 
               OR profiles.organisation_id = organisation_links.responder_org_id)
            AND profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'executive')
        )
    );

-- Joint Events RLS
CREATE POLICY "Joint events are viewable by public"
    ON public.joint_events FOR SELECT
    USING (true);

CREATE POLICY "Joint events can be created by admins"
    ON public.joint_events FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.events
            JOIN public.profiles ON profiles.organisation_id = events.organisation_id
            WHERE events.id = joint_events.event_id
            AND profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'editor')
        )
    );

CREATE POLICY "Joint events can be deleted by admins"
    ON public.joint_events FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.events
            JOIN public.profiles ON profiles.organisation_id = events.organisation_id
            WHERE events.id = joint_events.event_id
            AND profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'editor')
        )
    );

-- 7. Fix Foreign Keys referencing the obsolete 'members' table
ALTER TABLE public.announcements DROP CONSTRAINT IF EXISTS announcements_created_by_fkey;
ALTER TABLE public.announcements ADD CONSTRAINT announcements_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.audit_logs DROP CONSTRAINT IF EXISTS audit_logs_actor_member_id_fkey;
ALTER TABLE public.audit_logs ADD CONSTRAINT audit_logs_actor_member_id_fkey FOREIGN KEY (actor_member_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_created_by_fkey;
ALTER TABLE public.events ADD CONSTRAINT events_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.join_requests DROP CONSTRAINT IF EXISTS join_requests_reviewed_by_fkey;
ALTER TABLE public.join_requests ADD CONSTRAINT join_requests_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.notification_queue DROP CONSTRAINT IF EXISTS notification_queue_member_id_fkey;
ALTER TABLE public.notification_queue ADD CONSTRAINT notification_queue_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.org_invites DROP CONSTRAINT IF EXISTS org_invites_invited_by_fkey;
ALTER TABLE public.org_invites ADD CONSTRAINT org_invites_invited_by_fkey FOREIGN KEY (invited_by) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.polls DROP CONSTRAINT IF EXISTS polls_created_by_fkey;
ALTER TABLE public.polls ADD CONSTRAINT polls_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.task_assignments DROP CONSTRAINT IF EXISTS task_assignments_member_id_fkey;
ALTER TABLE public.task_assignments ADD CONSTRAINT task_assignments_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_created_by_fkey;
ALTER TABLE public.tasks ADD CONSTRAINT tasks_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Update poll_votes schema to match application logic
ALTER TABLE public.poll_votes RENAME COLUMN member_id TO user_id;
ALTER TABLE public.poll_votes DROP CONSTRAINT IF EXISTS poll_votes_member_id_fkey;
ALTER TABLE public.poll_votes ADD CONSTRAINT poll_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.poll_votes ADD COLUMN IF NOT EXISTS ip_hash text;

