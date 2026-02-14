-- 1. Add Capabilities to Organisations
ALTER TABLE public.organisations 
ADD COLUMN IF NOT EXISTS capabilities jsonb DEFAULT '{"basic_governance": true}'::jsonb;

-- 2. Index for performance on capabilities (optional, but good for filtering)
CREATE INDEX IF NOT EXISTS idx_org_capabilities ON public.organisations USING gin (capabilities);

-- 3. Update RLS to ensure capabilities are readable by members
-- Existing policy "Org members view their own org" should cover it if it selects *.
-- Let's verify or explicitly allow if needed. usually 'select *' covers new columns.

-- 4. Audit Log for Capability Changes (Reuse platform_actions or create specific)
-- We'll use platform_actions with action_type 'update_capabilities'
ALTER TABLE public.platform_actions DROP CONSTRAINT IF EXISTS platform_actions_action_type_check;
ALTER TABLE public.platform_actions ADD CONSTRAINT platform_actions_action_type_check 
CHECK (action_type IN ('warning', 'restriction', 'suspension', 'legal_hold', 'termination', 'resolve_appeal', 'update_capabilities'));
