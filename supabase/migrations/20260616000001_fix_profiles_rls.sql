-- Fix missing RLS policies for profiles table and infinite recursion

-- Drop the old policy that caused infinite recursion
DROP POLICY IF EXISTS "Platform admins can view all profiles" ON public.profiles;

-- Create helper function to avoid recursion
CREATE OR REPLACE FUNCTION is_platform_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT is_platform_admin FROM profiles WHERE id = auth.uid();
$$;

-- Create helper function for org checks
CREATE OR REPLACE FUNCTION get_my_organisation_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organisation_id FROM profiles WHERE id = auth.uid();
$$;

-- Recreate policies
CREATE POLICY "Platform admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (is_platform_admin());

CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (id = auth.uid());

CREATE POLICY "Users can view profiles in their organisation"
  ON public.profiles
  FOR SELECT
  USING (
    organisation_id = get_my_organisation_id()
  );
