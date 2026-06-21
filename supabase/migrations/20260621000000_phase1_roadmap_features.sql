-- ==============================================================================
-- PHASE 1 ROADMAP FEATURES: NGO Financials & RWA Billing
-- Description: Adds Recurring Donations, Tax Receipts, Units, and Invoices
-- ==============================================================================

-- ============================================================================
-- 1. ENUMS
-- ============================================================================
CREATE TYPE recurring_frequency AS ENUM ('monthly', 'quarterly', 'annual');
CREATE TYPE subscription_status AS ENUM ('active', 'paused', 'cancelled', 'past_due');
CREATE TYPE unit_status AS ENUM ('occupied', 'vacant', 'under_construction');
CREATE TYPE invoice_type AS ENUM ('maintenance', 'special_levy', 'penalty');
CREATE TYPE invoice_status AS ENUM ('draft', 'pending', 'paid', 'partially_paid', 'overdue', 'cancelled');

-- ============================================================================
-- 2. NGO FEATURES: Recurring Donations & Tax Receipts
-- ============================================================================

-- Table: donation_subscriptions (Recurring Donations)
CREATE TABLE donation_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    donor_id UUID NOT NULL REFERENCES donors(id) ON DELETE RESTRICT,
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) DEFAULT 'INR',
    frequency recurring_frequency NOT NULL,
    status subscription_status NOT NULL DEFAULT 'active',
    next_payment_date DATE NOT NULL,
    payment_method_details JSONB,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_donation_subs_org ON donation_subscriptions(organisation_id);
CREATE INDEX idx_donation_subs_donor ON donation_subscriptions(donor_id);
CREATE INDEX idx_donation_subs_status ON donation_subscriptions(status, next_payment_date);

-- Table: tax_receipts
CREATE TABLE tax_receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    donation_id UUID NOT NULL REFERENCES donations(id) ON DELETE RESTRICT,
    donor_id UUID NOT NULL REFERENCES donors(id) ON DELETE RESTRICT,
    receipt_number VARCHAR(100) NOT NULL,
    receipt_date DATE NOT NULL DEFAULT CURRENT_DATE,
    financial_year VARCHAR(9) NOT NULL, -- e.g. "2026-2027"
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    donor_pan VARCHAR(20),
    pdf_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organisation_id, receipt_number),
    UNIQUE(donation_id) -- One receipt per donation
);
CREATE INDEX idx_tax_receipts_org ON tax_receipts(organisation_id);
CREATE INDEX idx_tax_receipts_donor ON tax_receipts(donor_id);

-- ============================================================================
-- 3. RWA FEATURES: Maintenance Billing
-- ============================================================================

-- Table: units (Flats/Apartments/Shops)
CREATE TABLE units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    unit_number VARCHAR(50) NOT NULL,
    block_building VARCHAR(100),
    owner_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    tenant_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    area_sqft DECIMAL(10,2),
    status unit_status NOT NULL DEFAULT 'occupied',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organisation_id, block_building, unit_number)
);
CREATE INDEX idx_units_org ON units(organisation_id);
CREATE INDEX idx_units_owner ON units(owner_profile_id);

-- Table: invoices (Maintenance Bills)
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE RESTRICT,
    type invoice_type NOT NULL DEFAULT 'maintenance',
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    billing_period_start DATE,
    billing_period_end DATE,
    due_date DATE NOT NULL,
    status invoice_status NOT NULL DEFAULT 'pending',
    transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_invoices_org ON invoices(organisation_id);
CREATE INDEX idx_invoices_unit ON invoices(unit_id);
CREATE INDEX idx_invoices_status ON invoices(status, due_date);

-- ============================================================================
-- 4. RLS POLICIES & TRIGGERS
-- ============================================================================

-- Triggers for updated_at
CREATE TRIGGER set_donation_subscriptions_updated_at BEFORE UPDATE ON donation_subscriptions FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER set_tax_receipts_updated_at BEFORE UPDATE ON tax_receipts FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER set_units_updated_at BEFORE UPDATE ON units FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER set_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Enable RLS
ALTER TABLE donation_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- RLS: donation_subscriptions (Admins/Editors)
CREATE POLICY "Admins and editors can manage donation subscriptions" ON donation_subscriptions
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.organisation_id = donation_subscriptions.organisation_id 
            AND profiles.role IN ('admin', 'editor', 'executive')
        )
    );

-- RLS: tax_receipts
CREATE POLICY "Org staff can manage tax receipts" ON tax_receipts
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.organisation_id = tax_receipts.organisation_id 
            AND profiles.role IN ('admin', 'editor', 'executive')
        )
    );

-- RLS: units
CREATE POLICY "Org members can view units" ON units
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.organisation_id = units.organisation_id
        )
    );

CREATE POLICY "Admins and editors can manage units" ON units
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.organisation_id = units.organisation_id 
            AND profiles.role IN ('admin', 'editor', 'executive')
        )
    );

-- RLS: invoices
CREATE POLICY "Unit owners/tenants can view their invoices" ON invoices
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM units 
            WHERE units.id = invoices.unit_id 
            AND (units.owner_profile_id = auth.uid() OR units.tenant_profile_id = auth.uid())
        )
        OR EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.organisation_id = invoices.organisation_id 
            AND profiles.role IN ('admin', 'editor', 'executive')
        )
    );

CREATE POLICY "Admins and editors can manage invoices" ON invoices
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.organisation_id = invoices.organisation_id 
            AND profiles.role IN ('admin', 'editor', 'executive')
        )
    );
