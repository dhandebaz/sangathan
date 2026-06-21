-- ==============================================================================
-- PHASE 3 ROADMAP FEATURES: Secondary Features
-- Description: Adds RWA Facility Booking & Workers Union Dispatch System
-- ==============================================================================

-- ============================================================================
-- 1. RWA: Facility Booking
-- ============================================================================

CREATE TYPE facility_status AS ENUM ('available', 'maintenance', 'closed');
CREATE TYPE booking_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');

-- Table: facilities
CREATE TABLE facilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    capacity INT,
    hourly_rate DECIMAL(12,2) DEFAULT 0,
    status facility_status NOT NULL DEFAULT 'available',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_facilities_org ON facilities(organisation_id);

-- Table: facility_bookings
CREATE TABLE facility_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status booking_status NOT NULL DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK (end_time > start_time)
);
CREATE INDEX idx_facility_bookings_org ON facility_bookings(organisation_id);
CREATE INDEX idx_facility_bookings_facility ON facility_bookings(facility_id);

-- ============================================================================
-- 2. WORKERS UNION: Worker Dispatch System
-- ============================================================================

CREATE TYPE job_status AS ENUM ('open', 'filled', 'cancelled', 'completed');
CREATE TYPE application_status AS ENUM ('applied', 'dispatched', 'rejected', 'completed');

-- Table: job_postings
CREATE TABLE job_postings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    employer_name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    description TEXT,
    skills_required TEXT[],
    wage_rate VARCHAR(255),
    positions_available INT NOT NULL DEFAULT 1,
    start_date DATE,
    status job_status NOT NULL DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_job_postings_org ON job_postings(organisation_id);

-- Table: job_applications
CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    status application_status NOT NULL DEFAULT 'applied',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(job_id, profile_id)
);
CREATE INDEX idx_job_applications_job ON job_applications(job_id);

-- ============================================================================
-- 3. RLS POLICIES & TRIGGERS
-- ============================================================================

-- Triggers for updated_at
CREATE TRIGGER set_facilities_updated_at BEFORE UPDATE ON facilities FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER set_facility_bookings_updated_at BEFORE UPDATE ON facility_bookings FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER set_job_postings_updated_at BEFORE UPDATE ON job_postings FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER set_job_applications_updated_at BEFORE UPDATE ON job_applications FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Enable RLS
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE facility_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- RLS: facilities
CREATE POLICY "Anyone can view facilities" ON facilities
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.organisation_id = facilities.organisation_id)
    );
CREATE POLICY "Admins manage facilities" ON facilities
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.organisation_id = facilities.organisation_id AND profiles.role IN ('admin', 'editor'))
    );

-- RLS: facility_bookings
CREATE POLICY "Members view own bookings" ON facility_bookings
    FOR SELECT USING (profile_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.organisation_id = facility_bookings.organisation_id AND profiles.role IN ('admin', 'editor')));
CREATE POLICY "Members can insert bookings" ON facility_bookings
    FOR INSERT WITH CHECK (profile_id = auth.uid());
CREATE POLICY "Admins manage bookings" ON facility_bookings
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.organisation_id = facility_bookings.organisation_id AND profiles.role IN ('admin', 'editor'))
    );

-- RLS: job_postings
CREATE POLICY "Anyone can view job_postings" ON job_postings
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.organisation_id = job_postings.organisation_id)
    );
CREATE POLICY "Admins manage job_postings" ON job_postings
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.organisation_id = job_postings.organisation_id AND profiles.role IN ('admin', 'editor', 'executive'))
    );

-- RLS: job_applications
CREATE POLICY "Members view own applications" ON job_applications
    FOR SELECT USING (profile_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.organisation_id = (SELECT organisation_id FROM job_postings WHERE id = job_applications.job_id) AND profiles.role IN ('admin', 'editor', 'executive')));
CREATE POLICY "Members can apply" ON job_applications
    FOR INSERT WITH CHECK (profile_id = auth.uid());
CREATE POLICY "Admins manage applications" ON job_applications
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.organisation_id = (SELECT organisation_id FROM job_postings WHERE id = job_applications.job_id) AND profiles.role IN ('admin', 'editor', 'executive'))
    );
