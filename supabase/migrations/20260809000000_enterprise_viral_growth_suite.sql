-- 20260809000000_enterprise_viral_growth_suite.sql
-- Comprehensive schema for 4-Pillar Enterprise Civic OS & Viral Growth Engine

-- 1. PETITIONS & CAMPAIGN STUDIO
CREATE TABLE IF NOT EXISTS public.petitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT NOT NULL,
    target_decision_maker TEXT NOT NULL,
    signature_goal INTEGER NOT NULL DEFAULT 500,
    current_signatures INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'closed', 'won')),
    volunteer_prompt_enabled BOOLEAN DEFAULT true,
    volunteer_cta_text TEXT DEFAULT 'Join the Movement & Volunteer for this cause',
    cover_image_url TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_petition_slug_per_org UNIQUE (organisation_id, slug)
);

CREATE TABLE IF NOT EXISTS public.petition_signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    petition_id UUID NOT NULL REFERENCES public.petitions(id) ON DELETE CASCADE,
    supporter_name TEXT NOT NULL,
    supporter_email TEXT NOT NULL,
    supporter_phone TEXT,
    supporter_locality TEXT,
    comment TEXT,
    wants_to_volunteer BOOLEAN DEFAULT false,
    is_converted_to_member BOOLEAN DEFAULT false,
    converted_member_id UUID REFERENCES public.members(id) ON DELETE SET NULL,
    ip_hash TEXT,
    signed_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_signature_per_petition UNIQUE (petition_id, supporter_email)
);

-- 2. SOLIDARITY & FEDERATION ENDORSEMENTS
CREATE TABLE IF NOT EXISTS public.petition_endorsements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    petition_id UUID NOT NULL REFERENCES public.petitions(id) ON DELETE CASCADE,
    endorsing_organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    endorsed_by_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    statement TEXT,
    status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_petition_endorsement UNIQUE (petition_id, endorsing_organisation_id)
);

-- 3. WHATSAPP & TELEGRAM CONVERSATIONAL INTERFACE LOGS
CREATE TABLE IF NOT EXISTS public.bot_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    channel TEXT NOT NULL CHECK (channel IN ('whatsapp', 'telegram', 'simulator')),
    sender_id TEXT NOT NULL,
    sender_name TEXT,
    member_id UUID REFERENCES public.members(id) ON DELETE SET NULL,
    last_command TEXT,
    last_state TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bot_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.bot_conversations(id) ON DELETE CASCADE,
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    channel TEXT NOT NULL,
    direction TEXT NOT NULL CHECK (direction IN ('incoming', 'outgoing')),
    message_text TEXT NOT NULL,
    command_recognized TEXT,
    status TEXT NOT NULL DEFAULT 'processed' CHECK (status IN ('received', 'processed', 'failed', 'ignored')),
    payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. EMERGENCY SOS & RAPID-RESPONSE NETWORK
CREATE TABLE IF NOT EXISTS public.emergency_sos_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    triggered_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    activist_name TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    location_name TEXT NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    police_station TEXT,
    detainee_count INTEGER DEFAULT 1,
    situation_details TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'critical' CHECK (severity IN ('moderate', 'urgent', 'critical', 'life_safety')),
    status TEXT NOT NULL DEFAULT 'alerted' CHECK (status IN ('alerted', 'legal_dispatched', 'advocate_at_thana', 'bail_secured', 'resolved')),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.emergency_advocate_dispatches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_id UUID NOT NULL REFERENCES public.emergency_sos_alerts(id) ON DELETE CASCADE,
    advocate_name TEXT NOT NULL,
    advocate_phone TEXT NOT NULL,
    bar_council_no TEXT,
    status TEXT NOT NULL DEFAULT 'en_route' CHECK (status IN ('assigned', 'en_route', 'on_scene', 'completed')),
    notes TEXT,
    dispatched_at TIMESTAMPTZ DEFAULT NOW(),
    arrived_at TIMESTAMPTZ
);

-- 5. PUBLIC TRUST & TRANSPARENCY LEDGER
CREATE TABLE IF NOT EXISTS public.transparency_ledger_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('programs', 'legal_aid', 'student_welfare', 'labor_relief', 'community_action', 'operations', 'campaigns')),
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    recipient_vendor TEXT NOT NULL,
    description TEXT,
    receipt_url TEXT,
    receipt_sha256_hash TEXT NOT NULL,
    verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    is_publicly_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.transparency_audit_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    fiscal_quarter TEXT NOT NULL, -- e.g. 'Q2-2026'
    total_inflow NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_outflow NUMERIC(12, 2) NOT NULL DEFAULT 0,
    programmatic_ratio NUMERIC(5, 2) NOT NULL DEFAULT 85.0,
    transparency_score INTEGER NOT NULL DEFAULT 96,
    auditor_notes TEXT,
    verified_status TEXT NOT NULL DEFAULT 'verified' CHECK (status IN ('draft', 'under_audit', 'verified', 'published')),
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. AI GRANT & CSR OPPORTUNITY MATCHER
CREATE TABLE IF NOT EXISTS public.grant_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    funder_name TEXT NOT NULL,
    funder_type TEXT NOT NULL CHECK (funder_type IN ('government', 'csr_corporate', 'philanthropic_trust', 'international_agency')),
    focus_areas TEXT[] NOT NULL DEFAULT '{}',
    eligible_org_types TEXT[] NOT NULL DEFAULT '{"ngo"}',
    target_regions TEXT[] NOT NULL DEFAULT '{"Pan-India"}',
    max_funding_amount NUMERIC(12, 2),
    application_deadline DATE,
    portal_url TEXT,
    guidelines_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.grant_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    grant_opportunity_id UUID REFERENCES public.grant_opportunities(id) ON DELETE SET NULL,
    project_title TEXT NOT NULL,
    requested_amount NUMERIC(12, 2) NOT NULL,
    match_score_percentage INTEGER DEFAULT 92,
    proposal_draft JSONB NOT NULL DEFAULT '{}'::jsonb, -- { executive_summary, problem_statement, objectives, methodology, budget, impact_kpis }
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'ai_generated', 'internal_review', 'submitted', 'awarded', 'rejected')),
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. NO-CODE WORKFLOW AUTOMATIONS
CREATE TABLE IF NOT EXISTS public.workflow_automations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    trigger_event TEXT NOT NULL CHECK (trigger_event IN (
        'member_joined',
        'donation_received',
        'grievance_filed',
        'emergency_sos_triggered',
        'petition_signed',
        'event_rsvp_submitted'
    )),
    conditions JSONB NOT NULL DEFAULT '[]'::jsonb, -- e.g. [{"field": "role", "operator": "equals", "value": "student"}]
    actions JSONB NOT NULL DEFAULT '[]'::jsonb, -- e.g. [{"action": "issue_digital_id"}, {"action": "send_welcome_sms"}]
    execution_count INTEGER DEFAULT 0,
    last_triggered_at TIMESTAMPTZ,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.workflow_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    automation_id UUID NOT NULL REFERENCES public.workflow_automations(id) ON DELETE CASCADE,
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    trigger_event TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'failed', 'partial')),
    logs JSONB NOT NULL DEFAULT '[]'::jsonb,
    executed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. DEFENSIVE PERMISSION GUARDS & DUAL-APPROVAL WORKFLOW
CREATE TABLE IF NOT EXISTS public.pending_dual_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL CHECK (action_type IN (
        'broadcast_mass_announcement',
        'financial_ledger_adjustment',
        'admin_role_elevation',
        'bulk_member_purge'
    )),
    requested_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    action_payload JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
    approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    rejection_reason TEXT,
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '48 hours'),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);

-- 9. IMMUTABLE TAMPER-EVIDENT AUDIT CHAIN
CREATE TABLE IF NOT EXISTS public.immutable_audit_chain (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    sequence_number BIGSERIAL,
    event_type TEXT NOT NULL,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_email TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    target_resource TEXT NOT NULL,
    payload_snapshot JSONB NOT NULL,
    prev_block_hash TEXT NOT NULL,
    current_block_hash TEXT NOT NULL,
    tamper_verified BOOLEAN DEFAULT true,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.petitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.petition_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.petition_endorsements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_sos_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_advocate_dispatches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transparency_ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transparency_audit_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grant_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grant_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pending_dual_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.immutable_audit_chain ENABLE ROW LEVEL SECURITY;

-- Public can view published petitions
CREATE POLICY "Public can view published petitions" ON public.petitions
    FOR SELECT USING (status IN ('published', 'closed', 'won'));

-- Org members can view all their org petitions
CREATE POLICY "Org members can view their petitions" ON public.petitions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.organisation_id = petitions.organisation_id
            AND profiles.id = auth.uid()
        )
    );

-- Org admins can manage petitions
CREATE POLICY "Org admins can manage petitions" ON public.petitions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.organisation_id = petitions.organisation_id
            AND profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'editor', 'executive')
        )
    );

-- Anyone can sign published petitions
CREATE POLICY "Public can sign published petitions" ON public.petition_signatures
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.petitions
            WHERE petitions.id = petition_signatures.petition_id
            AND petitions.status = 'published'
        )
    );

-- Org members can view signatures for their petitions
CREATE POLICY "Org members can view petition signatures" ON public.petition_signatures
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.petitions
            JOIN public.profiles ON profiles.organisation_id = petitions.organisation_id
            WHERE petitions.id = petition_signatures.petition_id
            AND profiles.id = auth.uid()
        )
    );

-- Public can view endorsements on published petitions
CREATE POLICY "Public can view petition endorsements" ON public.petition_endorsements
    FOR SELECT USING (status = 'approved');

-- Emergency SOS policies: Org members can trigger and view alerts
CREATE POLICY "Org members can view and trigger SOS" ON public.emergency_sos_alerts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.organisation_id = emergency_sos_alerts.organisation_id
            AND profiles.id = auth.uid()
        )
    );

-- Transparency ledger: Public can view verified public entries
CREATE POLICY "Public can view public transparency entries" ON public.transparency_ledger_entries
    FOR SELECT USING (is_publicly_visible = true);

-- Org members can view and manage their transparency ledger
CREATE POLICY "Org admins can manage transparency ledger" ON public.transparency_ledger_entries
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.organisation_id = transparency_ledger_entries.organisation_id
            AND profiles.id = auth.uid()
        )
    );

-- Grants: Anyone authenticated can view open grant opportunities
CREATE POLICY "Authenticated users can view grant opportunities" ON public.grant_opportunities
    FOR SELECT USING (auth.role() = 'authenticated');

-- Org members can manage their grant applications
CREATE POLICY "Org members can manage grant applications" ON public.grant_applications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.organisation_id = grant_applications.organisation_id
            AND profiles.id = auth.uid()
        )
    );

-- Automations & Audit chain: Org members can view, admins can manage
CREATE POLICY "Org members can view automations" ON public.workflow_automations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.organisation_id = workflow_automations.organisation_id
            AND profiles.id = auth.uid()
        )
    );

CREATE POLICY "Org admins can manage automations" ON public.workflow_automations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.organisation_id = workflow_automations.organisation_id
            AND profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'editor', 'executive')
        )
    );

CREATE POLICY "Org members can view immutable audit chain" ON public.immutable_audit_chain
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.organisation_id = immutable_audit_chain.organisation_id
            AND profiles.id = auth.uid()
        )
    );
