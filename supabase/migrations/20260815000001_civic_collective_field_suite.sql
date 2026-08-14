-- ==============================================================================
-- SANGATHAN CIVIC COLLECTIVE & CITIZEN SCIENCE FIELD SUITE
-- Date: 2026-08-15
-- ==============================================================================

-- 1. Table: field_spot_audits
-- Supports citizen science testing (PM2.5, Water TDS, Waste Burning, Noise, Civic infra)
CREATE TABLE IF NOT EXISTS field_spot_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    auditor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    auditor_name TEXT NOT NULL,
    audit_type TEXT NOT NULL CHECK (audit_type IN ('air_quality', 'water_quality', 'waste_burning', 'industrial_emissions', 'construction_dust', 'tree_felling', 'civic_infrastructure')),
    location_name TEXT NOT NULL,
    landmark TEXT,
    ward_no TEXT,
    district TEXT,
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    sensor_readings JSONB DEFAULT '{}'::jsonb,
    source_identified TEXT,
    severity TEXT NOT NULL DEFAULT 'moderate' CHECK (severity IN ('moderate', 'high', 'severe', 'hazardous')),
    status TEXT NOT NULL DEFAULT 'logged' CHECK (status IN ('logged', 'notice_dispatched', 'inspection_conducted', 'resolved', 'escalated_to_ngt')),
    photo_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
    statutory_notice_ref TEXT,
    public_bulletin_shared BOOLEAN DEFAULT false,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_field_audits_org ON field_spot_audits(organisation_id);
CREATE INDEX IF NOT EXISTS idx_field_audits_type ON field_spot_audits(audit_type);
CREATE INDEX IF NOT EXISTS idx_field_audits_status ON field_spot_audits(status);
CREATE INDEX IF NOT EXISTS idx_field_audits_created ON field_spot_audits(created_at DESC);

-- 2. Table: press_releases
-- Supports bilingual media releases with standard embargo headers and spokesperson blocks
CREATE TABLE IF NOT EXISTS press_releases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    title_en TEXT NOT NULL,
    title_hi TEXT,
    location_header TEXT NOT NULL DEFAULT 'NEW DELHI',
    embargo_type TEXT NOT NULL DEFAULT 'immediate' CHECK (embargo_type IN ('immediate', 'timed')),
    embargo_datetime TIMESTAMPTZ,
    body_en TEXT NOT NULL,
    body_hi TEXT,
    spokesperson_name TEXT NOT NULL,
    spokesperson_phone TEXT NOT NULL,
    spokesperson_designation TEXT NOT NULL,
    photo_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
    pdf_url TEXT,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_press_releases_org ON press_releases(organisation_id);
CREATE INDEX IF NOT EXISTS idx_press_releases_published ON press_releases(is_published);

-- 3. Table: civic_receiving_trackers
-- Supports physical stamped receiving copy photo tracking & 15-day RTI countdown
CREATE TABLE IF NOT EXISTS civic_receiving_trackers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    letter_ref_number TEXT NOT NULL,
    subject TEXT NOT NULL,
    authority_name TEXT NOT NULL,
    recipient_official TEXT,
    submission_date DATE NOT NULL DEFAULT CURRENT_DATE,
    receiving_photo_url TEXT,
    receiving_number TEXT,
    statutory_deadline_days INT NOT NULL DEFAULT 15,
    escalation_status TEXT NOT NULL DEFAULT 'pending_response' CHECK (escalation_status IN ('pending_response', 'overdue_escalate', 'rti_filed', 'hearing_scheduled', 'resolved')),
    rti_ref_number TEXT,
    rti_filed_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_civic_receiving_org ON civic_receiving_trackers(organisation_id);
CREATE INDEX IF NOT EXISTS idx_civic_receiving_status ON civic_receiving_trackers(escalation_status);

-- Enable Row Level Security (RLS)
ALTER TABLE field_spot_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE press_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE civic_receiving_trackers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Org members can read field audits"
    ON field_spot_audits FOR SELECT
    USING (organisation_id IN (
        SELECT organisation_id FROM profiles WHERE id = auth.uid()
    ));

CREATE POLICY "Org members can insert field audits"
    ON field_spot_audits FOR INSERT
    WITH CHECK (organisation_id IN (
        SELECT organisation_id FROM profiles WHERE id = auth.uid()
    ));

CREATE POLICY "Org members can update field audits"
    ON field_spot_audits FOR UPDATE
    USING (organisation_id IN (
        SELECT organisation_id FROM profiles WHERE id = auth.uid()
    ));

CREATE POLICY "Org members can read press releases"
    ON press_releases FOR SELECT
    USING (organisation_id IN (
        SELECT organisation_id FROM profiles WHERE id = auth.uid()
    ));

CREATE POLICY "Org members can insert press releases"
    ON press_releases FOR INSERT
    WITH CHECK (organisation_id IN (
        SELECT organisation_id FROM profiles WHERE id = auth.uid()
    ));

CREATE POLICY "Org members can update press releases"
    ON press_releases FOR UPDATE
    USING (organisation_id IN (
        SELECT organisation_id FROM profiles WHERE id = auth.uid()
    ));

CREATE POLICY "Org members can read receiving trackers"
    ON civic_receiving_trackers FOR SELECT
    USING (organisation_id IN (
        SELECT organisation_id FROM profiles WHERE id = auth.uid()
    ));

CREATE POLICY "Org members can insert receiving trackers"
    ON civic_receiving_trackers FOR INSERT
    WITH CHECK (organisation_id IN (
        SELECT organisation_id FROM profiles WHERE id = auth.uid()
    ));

CREATE POLICY "Org members can update receiving trackers"
    ON civic_receiving_trackers FOR UPDATE
    USING (organisation_id IN (
        SELECT organisation_id FROM profiles WHERE id = auth.uid()
    ));
