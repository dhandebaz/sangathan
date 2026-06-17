-- Organizational Growth Engine: Subgroups and Custom Roles
-- Allows organizations to create Committees, Chapters, Departments and Custom Roles

-- 1. Organizational Subgroups (Committees, Chapters, Departments)
CREATE TABLE IF NOT EXISTS public.org_subgroups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL DEFAULT 'department', -- 'department', 'committee', 'chapter', 'branch', 'team'
    parent_id UUID REFERENCES public.org_subgroups(id) ON DELETE CASCADE, -- For hierarchical structures
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for org_subgroups
ALTER TABLE public.org_subgroups ENABLE ROW LEVEL SECURITY;

-- Anyone in the org can view subgroups
CREATE POLICY "Users can view subgroups in their org" ON public.org_subgroups
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.organisation_id = org_subgroups.organisation_id
            AND profiles.id = auth.uid()
        )
    );

-- Only admins/executives can manage subgroups
CREATE POLICY "Admins can manage subgroups" ON public.org_subgroups
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.organisation_id = org_subgroups.organisation_id
            AND profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'executive', 'editor')
        )
    );


-- 2. Subgroup Members
CREATE TABLE IF NOT EXISTS public.org_subgroup_members (
    subgroup_id UUID NOT NULL REFERENCES public.org_subgroups(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member', -- 'lead', 'member'
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (subgroup_id, profile_id)
);

-- RLS for org_subgroup_members
ALTER TABLE public.org_subgroup_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view subgroup members in their org" ON public.org_subgroup_members
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.org_subgroups
            JOIN public.profiles ON profiles.organisation_id = org_subgroups.organisation_id
            WHERE org_subgroups.id = org_subgroup_members.subgroup_id
            AND profiles.id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage subgroup members" ON public.org_subgroup_members
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.org_subgroups
            JOIN public.profiles ON profiles.organisation_id = org_subgroups.organisation_id
            WHERE org_subgroups.id = org_subgroup_members.subgroup_id
            AND profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'executive', 'editor')
        )
    );


-- 3. Custom Roles
CREATE TABLE IF NOT EXISTS public.org_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g., 'Treasurer', 'Field Organizer'
    description TEXT,
    permissions JSONB NOT NULL DEFAULT '{}'::jsonb, -- e.g. {"can_manage_donations": true}
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for org_roles
ALTER TABLE public.org_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view roles in their org" ON public.org_roles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.organisation_id = org_roles.organisation_id
            AND profiles.id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage roles" ON public.org_roles
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.organisation_id = org_roles.organisation_id
            AND profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'executive')
        )
    );


-- 4. Profile Custom Roles (Many to Many)
CREATE TABLE IF NOT EXISTS public.profile_roles (
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.org_roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    PRIMARY KEY (profile_id, role_id)
);

-- RLS for profile_roles
ALTER TABLE public.profile_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view profile roles in their org" ON public.profile_roles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.org_roles
            JOIN public.profiles ON profiles.organisation_id = org_roles.organisation_id
            WHERE org_roles.id = profile_roles.role_id
            AND profiles.id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage profile roles" ON public.profile_roles
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.org_roles
            JOIN public.profiles ON profiles.organisation_id = org_roles.organisation_id
            WHERE org_roles.id = profile_roles.role_id
            AND profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'executive')
        )
    );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_org_subgroups_org_id ON public.org_subgroups(organisation_id);
CREATE INDEX IF NOT EXISTS idx_org_subgroup_members_subgroup_id ON public.org_subgroup_members(subgroup_id);
CREATE INDEX IF NOT EXISTS idx_org_subgroup_members_profile_id ON public.org_subgroup_members(profile_id);
CREATE INDEX IF NOT EXISTS idx_org_roles_org_id ON public.org_roles(organisation_id);
CREATE INDEX IF NOT EXISTS idx_profile_roles_profile_id ON public.profile_roles(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_roles_role_id ON public.profile_roles(role_id);
