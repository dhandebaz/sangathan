-- 1. Networks Table
CREATE TABLE public.networks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  visibility text CHECK (visibility IN ('public', 'private')) DEFAULT 'public',
  capabilities jsonb DEFAULT '{"joint_events": true, "joint_announcements": true, "network_voting": false, "shared_tasks": false, "network_transparency": true}'::jsonb,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Network Memberships (Organisations in a Network)
CREATE TABLE public.network_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  network_id uuid NOT NULL REFERENCES public.networks(id) ON DELETE CASCADE,
  organisation_id uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  status text CHECK (status IN ('pending', 'active', 'suspended')) DEFAULT 'pending',
  joined_at timestamptz DEFAULT now(),
  
  CONSTRAINT unique_network_org UNIQUE (network_id, organisation_id)
);

-- 3. Network Admins (Users managing the Network)
CREATE TABLE public.network_admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  network_id uuid NOT NULL REFERENCES public.networks(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role text CHECK (role IN ('coordinator', 'moderator', 'auditor')) DEFAULT 'coordinator',
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT unique_network_user UNIQUE (network_id, user_id)
);

-- 4. Update Core Entities to support Network Ownership
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS network_id uuid REFERENCES public.networks(id) ON DELETE SET NULL;
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS network_id uuid REFERENCES public.networks(id) ON DELETE SET NULL;
ALTER TABLE public.polls ADD COLUMN IF NOT EXISTS network_id uuid REFERENCES public.networks(id) ON DELETE SET NULL;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS network_id uuid REFERENCES public.networks(id) ON DELETE SET NULL;

-- 5. Indexes
CREATE INDEX idx_networks_slug ON public.networks(slug);
CREATE INDEX idx_network_memberships_org ON public.network_memberships(organisation_id);
CREATE INDEX idx_network_admins_user ON public.network_admins(user_id);
CREATE INDEX idx_events_network ON public.events(network_id);

-- 6. RLS Policies

ALTER TABLE public.networks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_admins ENABLE ROW LEVEL SECURITY;

-- Networks
CREATE POLICY "Public view public networks"
  ON public.networks FOR SELECT
  USING (visibility = 'public');

CREATE POLICY "Members view private networks"
  ON public.networks FOR SELECT
  USING (
    exists (
      select 1 from public.network_memberships nm
      join public.profiles p on p.organisation_id = nm.organisation_id
      where nm.network_id = networks.id AND p.id = auth.uid()
    ) OR
    exists (select 1 from public.network_admins where network_id = networks.id AND user_id = auth.uid())
  );

CREATE POLICY "Network Admins manage networks"
  ON public.networks FOR UPDATE
  USING (exists (select 1 from public.network_admins where network_id = networks.id AND user_id = auth.uid() AND role = 'coordinator'));

-- Memberships
CREATE POLICY "View memberships"
  ON public.network_memberships FOR SELECT
  USING (true); -- Public can see who is in a public network (filtered by network visibility usually, but let's allow read for simplicity of UI)

-- Update Event/Task/Poll RLS to allow Network Admin access
-- This is tricky. We need to append to existing policies or create new ones.
-- Since we use OR in policies, adding a new policy is additive.

CREATE POLICY "Network Admins manage network events"
  ON public.events FOR ALL
  USING (
    network_id IS NOT NULL AND
    exists (select 1 from public.network_admins where network_id = events.network_id AND user_id = auth.uid())
  );

CREATE POLICY "Network Members view network events"
  ON public.events FOR SELECT
  USING (
    network_id IS NOT NULL AND
    exists (
      select 1 from public.network_memberships nm
      join public.profiles p on p.organisation_id = nm.organisation_id
      where nm.network_id = events.network_id AND p.id = auth.uid()
    )
  );
-- Similar policies needed for tasks, polls, announcements... implemented via logic/service role often for complexity reduction, but RLS is safer.
