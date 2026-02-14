-- 1. Update Organisations Table
ALTER TABLE public.organisations 
ADD COLUMN IF NOT EXISTS membership_policy TEXT DEFAULT 'open_auto' 
CHECK (membership_policy IN ('open_auto', 'admin_approval', 'invite_only'));

-- 2. Update Profiles Table (Membership Status)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' 
CHECK (status IN ('active', 'pending', 'rejected', 'removed'));

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

-- Backfill approved_at for existing active profiles
UPDATE public.profiles 
SET approved_at = created_at 
WHERE status = 'active' AND approved_at IS NULL;

-- 3. Update Profiles Roles (Adding new community roles)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('admin', 'editor', 'viewer', 'general', 'volunteer', 'core', 'executive'));

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
