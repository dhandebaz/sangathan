-- ==============================================================================
-- SANGATHAN OPERATIONAL SUITE MIGRATION FOR 4 ORG TYPES
-- Date: 2026-08-15
-- ==============================================================================

-- ============================================================================
-- 1. NGO / NON-PROFIT SUITE: Grant Accounting & Volunteer Certificates
-- ============================================================================

-- Table: grant_milestones
CREATE TABLE IF NOT EXISTS grant_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grant_id UUID NOT NULL REFERENCES grants(id) ON DELETE CASCADE,
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    tranche_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    target_date DATE,
    disbursed_at DATE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'verified')),
    deliverables TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_grant_milestones_grant ON grant_milestones(grant_id);
CREATE INDEX IF NOT EXISTS idx_grant_milestones_org ON grant_milestones(organisation_id);

-- Table: grant_expenses
CREATE TABLE IF NOT EXISTS grant_expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grant_id UUID NOT NULL REFERENCES grants(id) ON DELETE CASCADE,
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES grant_milestones(id) ON DELETE SET NULL,
    budget_line_item TEXT NOT NULL,
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    vendor_name TEXT,
    receipt_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_grant_expenses_grant ON grant_expenses(grant_id);
CREATE INDEX IF NOT EXISTS idx_grant_expenses_org ON grant_expenses(organisation_id);

-- Table: volunteer_certificates
CREATE TABLE IF NOT EXISTS volunteer_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    volunteer_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    certificate_number TEXT NOT NULL UNIQUE,
    service_hours_recognized INT NOT NULL DEFAULT 0,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    issued_by UUID REFERENCES profiles(id),
    citation_text TEXT,
    verification_hash TEXT NOT NULL,
    pdf_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vol_cert_org ON volunteer_certificates(organisation_id);
CREATE INDEX IF NOT EXISTS idx_vol_cert_volunteer ON volunteer_certificates(volunteer_profile_id);

-- ============================================================================
-- 2. STUDENT UNION SUITE: Tallies, Mess Audits, Candidate Expenses
-- ============================================================================

-- Table: election_booth_tallies
CREATE TABLE IF NOT EXISTS election_booth_tallies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    election_id UUID NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
    position_id UUID NOT NULL REFERENCES election_positions(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    booth_name TEXT NOT NULL,
    round_number INT NOT NULL DEFAULT 1,
    votes_count INT NOT NULL DEFAULT 0 CHECK (votes_count >= 0),
    recorded_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(election_id, position_id, candidate_id, booth_name, round_number)
);

CREATE INDEX IF NOT EXISTS idx_booth_tallies_election ON election_booth_tallies(election_id);
CREATE INDEX IF NOT EXISTS idx_booth_tallies_candidate ON election_booth_tallies(candidate_id);

-- Table: hostel_mess_audits
CREATE TABLE IF NOT EXISTS hostel_mess_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    hostel_name TEXT NOT NULL,
    inspection_type TEXT NOT NULL DEFAULT 'mess_quality' CHECK (inspection_type IN ('mess_quality', 'room_allotment', 'sanitation_hygiene', 'study_hall')),
    meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'snacks', 'dinner')),
    rating INT CHECK (rating BETWEEN 1 AND 5),
    student_name TEXT,
    roll_number TEXT,
    remarks TEXT,
    photo_url TEXT,
    action_taken TEXT,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'under_investigation', 'resolved', 'escalated_to_warden')),
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_hostel_mess_org ON hostel_mess_audits(organisation_id);
CREATE INDEX IF NOT EXISTS idx_hostel_mess_status ON hostel_mess_audits(status);

-- Table: candidate_expenses
CREATE TABLE IF NOT EXISTS candidate_expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    election_id UUID NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    item_description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    vendor_name TEXT,
    receipt_url TEXT,
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_lyngdoh_compliant BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cand_exp_candidate ON candidate_expenses(candidate_id);
CREATE INDEX IF NOT EXISTS idx_cand_exp_election ON candidate_expenses(election_id);

-- ============================================================================
-- 3. WORKERS UNION SUITE: Trade Disputes, CBA Clauses, Strike Roster
-- ============================================================================

-- Table: trade_disputes
CREATE TABLE IF NOT EXISTS trade_disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    dispute_ref TEXT NOT NULL,
    employer_name TEXT NOT NULL,
    worker_count INT DEFAULT 1,
    dispute_nature TEXT NOT NULL CHECK (dispute_nature IN ('wage_theft', 'unlawful_termination', 'safety_hazard', 'cba_violation', 'lockout', 'pension_gratuity')),
    stage TEXT NOT NULL DEFAULT 'shop_floor' CHECK (stage IN ('shop_floor', 'works_committee', 'alc_conciliation', 'labour_court', 'industrial_tribunal', 'settled')),
    lead_shop_steward_id UUID REFERENCES profiles(id),
    next_hearing_date DATE,
    summary TEXT NOT NULL,
    settlement_terms TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending_hearing', 'settled', 'appealed', 'dismissed')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_trade_disputes_org ON trade_disputes(organisation_id);
CREATE INDEX IF NOT EXISTS idx_trade_disputes_stage ON trade_disputes(stage);

-- Table: cba_clauses
CREATE TABLE IF NOT EXISTS cba_clauses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cba_id UUID NOT NULL REFERENCES cba_documents(id) ON DELETE CASCADE,
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    clause_number TEXT NOT NULL,
    topic TEXT NOT NULL CHECK (topic IN ('basic_wages', 'da_allowances', 'working_hours', 'shift_timing', 'occupational_safety', 'overtime_rates', 'medical_insurance', 'bonus_gratuity', 'grievance_procedure')),
    current_clause_text TEXT NOT NULL,
    union_demand_text TEXT NOT NULL,
    management_counter_offer TEXT,
    status TEXT NOT NULL DEFAULT 'in_negotiation' CHECK (status IN ('in_negotiation', 'agreed', 'deadlocked', 'referred_to_arbitration')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cba_clauses_cba ON cba_clauses(cba_id);
CREATE INDEX IF NOT EXISTS idx_cba_clauses_org ON cba_clauses(organisation_id);

-- Table: strike_roster
CREATE TABLE IF NOT EXISTS strike_roster (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    strike_name TEXT NOT NULL,
    plant_location TEXT NOT NULL,
    picket_date DATE NOT NULL DEFAULT CURRENT_DATE,
    shift_name TEXT NOT NULL,
    steward_in_charge UUID REFERENCES profiles(id),
    workers_present INT DEFAULT 0,
    relief_disbursed DECIMAL(12,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_strike_roster_org ON strike_roster(organisation_id);

-- ============================================================================
-- 4. RWA SUITE: Domestic Staff Passes, Society Assets, Batch Maintenance
-- ============================================================================

-- Table: domestic_staff
CREATE TABLE IF NOT EXISTS domestic_staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('maid', 'cook', 'driver', 'gardener', 'car_cleaner', 'electrician', 'plumber', 'security_guard')),
    flat_units TEXT[] NOT NULL DEFAULT '{}',
    photo_url TEXT,
    police_verified BOOLEAN DEFAULT false,
    aadhar_last4 VARCHAR(4),
    pass_code TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'barred')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_domestic_staff_org ON domestic_staff(organisation_id);
CREATE INDEX IF NOT EXISTS idx_domestic_staff_status ON domestic_staff(status);

-- Table: society_assets
CREATE TABLE IF NOT EXISTS society_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    asset_name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('lift_elevator', 'dg_generator', 'fire_fighting', 'water_pumps', 'cctv_security', 'swimming_pool', 'gym_equipment', 'transformer')),
    location_block TEXT,
    vendor_name TEXT NOT NULL,
    vendor_phone TEXT,
    amc_start_date DATE,
    amc_expiry_date DATE NOT NULL,
    statutory_noc_expiry DATE,
    last_service_date DATE,
    next_service_due DATE NOT NULL,
    annual_amc_cost DECIMAL(10,2),
    status TEXT NOT NULL DEFAULT 'operational' CHECK (status IN ('operational', 'service_due', 'under_breakdown', 'noc_pending')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_society_assets_org ON society_assets(organisation_id);
CREATE INDEX IF NOT EXISTS idx_society_assets_status ON society_assets(status);

-- Table: batch_maintenance_runs
CREATE TABLE IF NOT EXISTS batch_maintenance_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    billing_month VARCHAR(7) NOT NULL,
    rate_type TEXT NOT NULL CHECK (rate_type IN ('per_sqft', 'flat_rate')),
    rate_amount DECIMAL(10,2) NOT NULL,
    total_units_billed INT NOT NULL,
    total_invoiced_amount DECIMAL(12,2) NOT NULL,
    due_date DATE NOT NULL,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_batch_runs_org ON batch_maintenance_runs(organisation_id);

-- ============================================================================
-- 5. RLS POLICIES & SECURITY
-- ============================================================================

ALTER TABLE grant_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE grant_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE election_booth_tallies ENABLE ROW LEVEL SECURITY;
ALTER TABLE hostel_mess_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cba_clauses ENABLE ROW LEVEL SECURITY;
ALTER TABLE strike_roster ENABLE ROW LEVEL SECURITY;
ALTER TABLE domestic_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE society_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_maintenance_runs ENABLE ROW LEVEL SECURITY;

-- Generic Org-scoped RLS policies
DO $$
DECLARE
    tbl TEXT;
    tables TEXT[] := ARRAY[
        'grant_milestones', 'grant_expenses', 'volunteer_certificates',
        'hostel_mess_audits', 'trade_disputes', 'cba_clauses',
        'strike_roster', 'domestic_staff', 'society_assets', 'batch_maintenance_runs'
    ];
BEGIN
    FOREACH tbl IN ARRAY tables
    LOOP
        EXECUTE format('
            DROP POLICY IF EXISTS "%1$s_org_select" ON %1$I;
            CREATE POLICY "%1$s_org_select" ON %1$I
                FOR SELECT USING (
                    organisation_id = public.get_auth_org_id()
                );
            
            DROP POLICY IF EXISTS "%1$s_org_all" ON %1$I;
            CREATE POLICY "%1$s_org_all" ON %1$I
                FOR ALL USING (
                    organisation_id IN (
                        SELECT organisation_id FROM profiles 
                        WHERE id = auth.uid() 
                        AND role IN (''admin'', ''executive'', ''can_manage'', ''second_admin'', ''editor'', ''owner'', ''convenor'', ''president'', ''general_secretary'')
                    )
                ) WITH CHECK (
                    organisation_id IN (
                        SELECT organisation_id FROM profiles 
                        WHERE id = auth.uid() 
                        AND role IN (''admin'', ''executive'', ''can_manage'', ''second_admin'', ''editor'', ''owner'', ''convenor'', ''president'', ''general_secretary'')
                    )
                );
        ', tbl);
    END LOOP;
END $$;

-- Policies for election_booth_tallies and candidate_expenses (linked via election_id)
DROP POLICY IF EXISTS "election_booth_tallies_select" ON election_booth_tallies;
CREATE POLICY "election_booth_tallies_select" ON election_booth_tallies
    FOR SELECT USING (
        election_id IN (
            SELECT id FROM elections WHERE organisation_id = public.get_auth_org_id()
        )
    );

DROP POLICY IF EXISTS "election_booth_tallies_manage" ON election_booth_tallies;
CREATE POLICY "election_booth_tallies_manage" ON election_booth_tallies
    FOR ALL USING (
        election_id IN (
            SELECT id FROM elections WHERE organisation_id IN (
                SELECT organisation_id FROM profiles 
                WHERE id = auth.uid() 
                AND role IN ('admin', 'executive', 'can_manage', 'second_admin', 'owner', 'convenor', 'president', 'general_secretary')
            )
        )
    );

DROP POLICY IF EXISTS "candidate_expenses_select" ON candidate_expenses;
CREATE POLICY "candidate_expenses_select" ON candidate_expenses
    FOR SELECT USING (
        election_id IN (
            SELECT id FROM elections WHERE organisation_id = public.get_auth_org_id()
        )
    );

DROP POLICY IF EXISTS "candidate_expenses_manage" ON candidate_expenses;
CREATE POLICY "candidate_expenses_manage" ON candidate_expenses
    FOR ALL USING (
        election_id IN (
            SELECT id FROM elections WHERE organisation_id IN (
                SELECT organisation_id FROM profiles 
                WHERE id = auth.uid() 
                AND role IN ('admin', 'executive', 'can_manage', 'second_admin', 'editor', 'owner', 'convenor', 'president', 'general_secretary')
            )
        )
    );
