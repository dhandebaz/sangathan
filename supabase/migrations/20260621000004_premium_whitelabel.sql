-- Migration: Add premium plan and whitelabel to organisations

ALTER TABLE public.organisations 
ADD COLUMN IF NOT EXISTS plan_name TEXT DEFAULT 'Community',
ADD COLUMN IF NOT EXISTS whitelabel_enabled BOOLEAN DEFAULT false;

-- Add a comment for documentation
COMMENT ON COLUMN public.organisations.plan_name IS 'The current billing plan of the organisation (e.g., Community, Institution)';
COMMENT ON COLUMN public.organisations.whitelabel_enabled IS 'Whether whitelabeling features are unlocked for this organisation';
