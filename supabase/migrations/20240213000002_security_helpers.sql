-- Function to check verification status without exposing full profile
-- This is useful for middleware to quickly check status via RPC if needed, 
-- though middleware usually queries tables directly.
CREATE OR REPLACE FUNCTION get_verification_status(user_id UUID)
RETURNS JSON
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT json_build_object(
    'role', role,
    'phone_verified', phone_verified
  )
  FROM profiles
  WHERE id = user_id;
$$;

-- Function to clean up orphan users (users without profiles > 24h)
-- Can be scheduled via pg_cron extension if available
CREATE OR REPLACE FUNCTION cleanup_orphan_users()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM auth.users
  WHERE id NOT IN (SELECT id FROM public.profiles)
  AND created_at < NOW() - INTERVAL '24 hours';
END;
$$;
