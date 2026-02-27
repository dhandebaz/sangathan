-- Migration: Capability System for Plugin Ecosystem
-- Target: supabase/migrations/202602280002_capabilities_refactor.sql

-- We ensure the 'capabilities' column on 'organisations' is a robust JSONB field.
-- This allows us to store arbitrary plugin configurations without schema changes.

-- 1. Ensure column exists and is JSONB (Idempotent)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'organisations'
        AND column_name = 'capabilities'
    ) THEN
        ALTER TABLE public.organisations ADD COLUMN capabilities JSONB DEFAULT '{}'::jsonb;
    END IF;
END $$;

-- 2. Add Index for Performance
-- We often query specific capabilities (e.g. transparency_mode = true).
-- A GIN index on the JSONB column speeds up these lookups significantly.

CREATE INDEX IF NOT EXISTS idx_organisations_capabilities ON public.organisations USING GIN (capabilities);

-- 3. Add Validation Constraint (Optional but Recommended)
-- We can enforce that 'capabilities' is always an object, not an array or scalar.

ALTER TABLE public.organisations
DROP CONSTRAINT IF EXISTS capabilities_is_object;

ALTER TABLE public.organisations
ADD CONSTRAINT capabilities_is_object CHECK (jsonb_typeof(capabilities) = 'object');

-- 4. Comment / Documentation
COMMENT ON COLUMN public.organisations.capabilities IS 'Stores enabled features and plugin configurations (e.g., voting_engine, transparency_mode). Extensible JSONB schema.';
