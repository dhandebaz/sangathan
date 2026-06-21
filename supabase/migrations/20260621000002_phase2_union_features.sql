-- ==============================================================================
-- PHASE 2 ROADMAP FEATURES: Core Union Features
-- Description: Adds Workers Union Dues Collection & Student Union Elections
-- ==============================================================================

-- ============================================================================
-- 1. WORKERS UNION: Dues Collection
-- ============================================================================

CREATE TYPE due_status AS ENUM ('pending', 'paid', 'overdue', 'waived');

-- Table: billing_plans
CREATE TABLE billing_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0),
    currency VARCHAR(3) DEFAULT 'INR',
    frequency recurring_frequency NOT NULL DEFAULT 'monthly',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_billing_plans_org ON billing_plans(organisation_id);

-- Table: membership_dues
CREATE TABLE membership_dues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    member_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    plan_id UUID REFERENCES billing_plans(id) ON DELETE SET NULL,
    amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0),
    due_date DATE NOT NULL,
    status due_status NOT NULL DEFAULT 'pending',
    transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_membership_dues_org ON membership_dues(organisation_id);
CREATE INDEX idx_membership_dues_member ON membership_dues(member_profile_id);
CREATE INDEX idx_membership_dues_status ON membership_dues(status, due_date);

-- ============================================================================
-- 2. STUDENT UNION: Elections
-- ============================================================================

CREATE TYPE election_status AS ENUM ('upcoming', 'active', 'completed', 'cancelled');

-- Table: elections
CREATE TABLE elections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status election_status NOT NULL DEFAULT 'upcoming',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK (end_time > start_time)
);
CREATE INDEX idx_elections_org ON elections(organisation_id);

-- Table: election_positions
CREATE TABLE election_positions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    election_id UUID NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL, -- e.g., "President", "Secretary"
    max_votes_per_voter INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_election_positions_election ON election_positions(election_id);

-- Table: candidates
CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    position_id UUID NOT NULL REFERENCES election_positions(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    manifesto_text TEXT,
    votes_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(position_id, profile_id)
);
CREATE INDEX idx_candidates_position ON candidates(position_id);

-- Table: election_voters (Tracks who has voted to prevent double voting, without linking to specific candidate)
CREATE TABLE election_voters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    election_id UUID NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    voted_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(election_id, profile_id)
);
CREATE INDEX idx_election_voters_election ON election_voters(election_id);

-- ============================================================================
-- 3. RLS POLICIES & TRIGGERS
-- ============================================================================

-- Triggers for updated_at
CREATE TRIGGER set_billing_plans_updated_at BEFORE UPDATE ON billing_plans FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER set_membership_dues_updated_at BEFORE UPDATE ON membership_dues FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER set_elections_updated_at BEFORE UPDATE ON elections FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Enable RLS
ALTER TABLE billing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_dues ENABLE ROW LEVEL SECURITY;
ALTER TABLE elections ENABLE ROW LEVEL SECURITY;
ALTER TABLE election_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE election_voters ENABLE ROW LEVEL SECURITY;

-- RLS: billing_plans
CREATE POLICY "Admins manage billing plans" ON billing_plans
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.organisation_id = billing_plans.organisation_id AND profiles.role IN ('admin', 'editor'))
    );
CREATE POLICY "Members view billing plans" ON billing_plans
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.organisation_id = billing_plans.organisation_id)
    );

-- RLS: membership_dues
CREATE POLICY "Members view their own dues" ON membership_dues
    FOR SELECT USING (member_profile_id = auth.uid());
CREATE POLICY "Admins manage dues" ON membership_dues
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.organisation_id = membership_dues.organisation_id AND profiles.role IN ('admin', 'editor', 'executive'))
    );

-- RLS: elections
CREATE POLICY "Members view elections" ON elections
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.organisation_id = elections.organisation_id)
    );
CREATE POLICY "Admins manage elections" ON elections
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.organisation_id = elections.organisation_id AND profiles.role IN ('admin', 'editor'))
    );

-- RLS: election_positions
CREATE POLICY "Members view positions" ON election_positions
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM elections e JOIN profiles p ON p.organisation_id = e.organisation_id WHERE e.id = election_positions.election_id AND p.id = auth.uid())
    );
CREATE POLICY "Admins manage positions" ON election_positions
    FOR ALL USING (
        EXISTS (SELECT 1 FROM elections e JOIN profiles p ON p.organisation_id = e.organisation_id WHERE e.id = election_positions.election_id AND p.id = auth.uid() AND p.role IN ('admin', 'editor'))
    );

-- RLS: candidates
CREATE POLICY "Members view candidates" ON candidates
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM election_positions ep JOIN elections e ON e.id = ep.election_id JOIN profiles p ON p.organisation_id = e.organisation_id WHERE ep.id = candidates.position_id AND p.id = auth.uid())
    );
CREATE POLICY "Admins manage candidates" ON candidates
    FOR ALL USING (
        EXISTS (SELECT 1 FROM election_positions ep JOIN elections e ON e.id = ep.election_id JOIN profiles p ON p.organisation_id = e.organisation_id WHERE ep.id = candidates.position_id AND p.id = auth.uid() AND p.role IN ('admin', 'editor'))
    );

-- RLS: election_voters
CREATE POLICY "Members view their vote record" ON election_voters
    FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "Members can record their vote" ON election_voters
    FOR INSERT WITH CHECK (profile_id = auth.uid());
