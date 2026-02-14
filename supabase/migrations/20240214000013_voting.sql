-- 1. Polls Table
CREATE TABLE public.polls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  type text CHECK (type IN ('informal', 'formal')) DEFAULT 'informal',
  visibility_level text CHECK (visibility_level IN ('members', 'volunteer', 'core', 'executive')) DEFAULT 'members',
  voting_method text CHECK (voting_method IN ('anonymous', 'identifiable')) DEFAULT 'anonymous',
  quorum_percentage integer,
  start_time timestamptz DEFAULT now(),
  end_time timestamptz,
  status text CHECK (status IN ('draft', 'active', 'closed', 'archived')) DEFAULT 'draft',
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Result Caching (for performance and locking)
  final_results jsonb, -- { option_id: count, total: N, passed: boolean }
  is_public boolean DEFAULT false -- For transparency mode
);

-- 2. Poll Options
CREATE TABLE public.poll_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id uuid NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
  label text NOT NULL,
  display_order integer DEFAULT 0
);

-- 3. Poll Votes
CREATE TABLE public.poll_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id uuid NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
  option_id uuid NOT NULL REFERENCES public.poll_options(id) ON DELETE CASCADE,
  member_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL, -- Nullable if anonymous
  hashed_identifier text, -- Unique hash of (poll_id + user_id + secret) for anonymous duplicate check
  voted_at timestamptz DEFAULT now(),
  
  -- Constraint: Either member_id OR hashed_identifier must be present
  CONSTRAINT vote_identifier_check CHECK (member_id IS NOT NULL OR hashed_identifier IS NOT NULL),
  
  -- Unique constraints to prevent double voting
  CONSTRAINT unique_vote_member UNIQUE (poll_id, member_id),
  CONSTRAINT unique_vote_hash UNIQUE (poll_id, hashed_identifier)
);

-- 4. Indexes
CREATE INDEX idx_polls_org ON public.polls(organisation_id);
CREATE INDEX idx_polls_status ON public.polls(status);
CREATE INDEX idx_poll_votes_poll ON public.poll_votes(poll_id);
CREATE INDEX idx_poll_options_poll ON public.poll_options(poll_id);

-- 5. RLS Policies

ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;

-- Polls Policies
CREATE POLICY "Org members view eligible polls"
  ON public.polls FOR SELECT
  USING (
    organisation_id = public.get_auth_org_id() 
    AND (
      visibility_level = 'members' OR
      (visibility_level = 'volunteer' AND exists (select 1 from public.profiles where id = auth.uid() and role in ('volunteer', 'core', 'executive', 'admin', 'editor'))) OR
      (visibility_level = 'core' AND exists (select 1 from public.profiles where id = auth.uid() and role in ('core', 'executive', 'admin', 'editor'))) OR
      (visibility_level = 'executive' AND exists (select 1 from public.profiles where id = auth.uid() and role in ('executive', 'admin', 'editor'))) OR
      exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor')) -- Admins see all
    )
  );
  
CREATE POLICY "Manage polls (Admin/Editor)"
  ON public.polls FOR ALL
  USING (organisation_id = public.get_auth_org_id() and exists (
    select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor')
  ));

-- Options Policies (Public view if poll is visible)
CREATE POLICY "View poll options"
  ON public.poll_options FOR SELECT
  USING (exists (
    select 1 from public.polls p
    where p.id = poll_options.poll_id
    and p.organisation_id = public.get_auth_org_id()
    -- Add visibility check logic here if needed, or rely on application logic + poll visibility
  ));
  
CREATE POLICY "Manage poll options"
  ON public.poll_options FOR ALL
  USING (exists (
    select 1 from public.polls p
    where p.id = poll_options.poll_id
    and p.organisation_id = public.get_auth_org_id()
    and exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor'))
  ));

-- Votes Policies
-- Users can insert their own vote
CREATE POLICY "Cast vote"
  ON public.poll_votes FOR INSERT
  WITH CHECK (
    exists (
       select 1 from public.polls p
       where p.id = poll_votes.poll_id
       and p.organisation_id = public.get_auth_org_id()
       and p.status = 'active'
    )
    -- Additional logic for anonymous hash check handled in Action
  );

-- Users view their own vote (if identifiable)
CREATE POLICY "View own vote"
  ON public.poll_votes FOR SELECT
  USING (member_id = auth.uid());

-- Admins view all votes (if identifiable) or counts (via aggregation)
-- Note: Anonymous votes have null member_id, so admins can see row but not who.
CREATE POLICY "Admins view votes"
  ON public.poll_votes FOR SELECT
  USING (exists (
    select 1 from public.polls p
    where p.id = poll_votes.poll_id
    and p.organisation_id = public.get_auth_org_id()
    and exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor'))
  ));
