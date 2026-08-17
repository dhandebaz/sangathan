-- Migration: Member Credentials & Verified Badge Studio Infrastructure
-- Adds columns to profiles and creates member_credentials table for cryptographic verification

-- 1. Add credential fields to profiles table if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'avatar_url') THEN
        ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'blood_group') THEN
        ALTER TABLE profiles ADD COLUMN blood_group TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'emergency_contact') THEN
        ALTER TABLE profiles ADD COLUMN emergency_contact TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'member_id_ref') THEN
        ALTER TABLE profiles ADD COLUMN member_id_ref TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'chapter_city') THEN
        ALTER TABLE profiles ADD COLUMN chapter_city TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'badge_tier') THEN
        ALTER TABLE profiles ADD COLUMN badge_tier TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'badge_theme') THEN
        ALTER TABLE profiles ADD COLUMN badge_theme TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'badge_template') THEN
        ALTER TABLE profiles ADD COLUMN badge_template TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'custom_tagline') THEN
        ALTER TABLE profiles ADD COLUMN custom_tagline TEXT;
    END IF;
END $$;

-- 2. Create member_credentials table
CREATE TABLE IF NOT EXISTS member_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    credential_id TEXT UNIQUE NOT NULL,
    member_name TEXT NOT NULL,
    designation TEXT NOT NULL,
    badge_tier TEXT NOT NULL,
    badge_template TEXT NOT NULL DEFAULT 'executive_seal',
    theme_id TEXT NOT NULL DEFAULT 'sovereign_navy',
    symbol_id TEXT DEFAULT 'scales_of_justice',
    chapter_city TEXT,
    blood_group TEXT,
    joining_year TEXT DEFAULT '2026',
    custom_tagline TEXT,
    qr_token TEXT,
    verification_hash TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    is_public BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Create Indexes
CREATE INDEX IF NOT EXISTS idx_member_credentials_org ON member_credentials(organisation_id);
CREATE INDEX IF NOT EXISTS idx_member_credentials_cred_id ON member_credentials(credential_id);
CREATE INDEX IF NOT EXISTS idx_member_credentials_profile ON member_credentials(profile_id);

-- 4. Enable RLS
ALTER TABLE member_credentials ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies if any to prevent duplicate errors
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public read for active credentials" ON member_credentials;
    DROP POLICY IF EXISTS "Members manage own credentials" ON member_credentials;
END $$;

-- 6. Add RLS Policies
CREATE POLICY "Public read for active credentials" ON member_credentials
    FOR SELECT USING (is_public = true AND status = 'active');

CREATE POLICY "Members manage own credentials" ON member_credentials
    FOR ALL USING (
        auth.uid() = profile_id 
        OR auth.uid() IN (
            SELECT id FROM profiles 
            WHERE organisation_id = member_credentials.organisation_id 
            AND (role IN ('admin', 'president', 'general_secretary', 'leader') OR is_primary_admin = true)
        )
    );
