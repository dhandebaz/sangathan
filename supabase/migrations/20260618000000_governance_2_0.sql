-- Phase 1: Governance 2.0 & Ticket Upgrades

-- 1. Proposals Table
CREATE TABLE IF NOT EXISTS public.proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'discussion', 'voting', 'completed', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Proposal Comments (Discussion phase)
CREATE TABLE IF NOT EXISTS public.proposal_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Link Polls to Proposals
ALTER TABLE public.polls ADD COLUMN IF NOT EXISTS proposal_id UUID REFERENCES public.proposals(id) ON DELETE SET NULL;

-- 4. Ticket Upgrades (SLA & Assignment)
ALTER TABLE public.tickets
ADD COLUMN IF NOT EXISTS sla_due_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 5. RLS Policies for Proposals
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members view proposals" ON public.proposals
    FOR SELECT USING (organisation_id = (SELECT organisation_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Org members create proposals" ON public.proposals
    FOR INSERT WITH CHECK (organisation_id = (SELECT organisation_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Admins/Creators manage proposals" ON public.proposals
    FOR ALL USING (
        organisation_id = (SELECT organisation_id FROM public.profiles WHERE id = auth.uid()) AND
        (created_by = auth.uid() OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'executive', 'editor')
        ))
    );

-- 6. RLS Policies for Comments
CREATE POLICY "Org members view comments" ON public.proposal_comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.proposals
            WHERE proposals.id = proposal_comments.proposal_id
            AND proposals.organisation_id = (SELECT organisation_id FROM public.profiles WHERE id = auth.uid())
        )
    );

CREATE POLICY "Org members comment" ON public.proposal_comments
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.proposals
            WHERE proposals.id = proposal_comments.proposal_id
            AND proposals.organisation_id = (SELECT organisation_id FROM public.profiles WHERE id = auth.uid())
        )
    );

-- 7. Indexes
CREATE INDEX IF NOT EXISTS idx_proposals_org ON public.proposals(organisation_id);
CREATE INDEX IF NOT EXISTS idx_proposal_comments_proposal ON public.proposal_comments(proposal_id);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned_to ON public.tickets(assigned_to);
