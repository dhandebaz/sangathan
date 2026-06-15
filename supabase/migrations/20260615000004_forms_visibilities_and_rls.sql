-- Migration: Forms Visibilities and RLS Policies
-- Created: 2026-06-15

-- 1. Create public.forms table if not exists
CREATE TABLE IF NOT EXISTS public.forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  fields JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create public.form_submissions table if not exists
CREATE TABLE IF NOT EXISTS public.form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  form_id UUID NOT NULL REFERENCES public.forms(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Alter public.forms to add deleted_at and visibility columns if not exists
ALTER TABLE public.forms ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE public.forms ADD COLUMN IF NOT EXISTS visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'members', 'private'));

-- 4. Alter public.form_submissions to add user_id referencing auth.users if not exists
ALTER TABLE public.form_submissions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 5. Rename submitted_at to created_at in public.form_submissions table if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'form_submissions' 
      AND column_name = 'submitted_at'
  ) THEN
    ALTER TABLE public.form_submissions RENAME COLUMN submitted_at TO created_at;
  END IF;
END $$;

-- Ensure RLS is enabled
ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

-- 6. Indexes
CREATE INDEX IF NOT EXISTS idx_forms_org ON public.forms(organisation_id);
CREATE INDEX IF NOT EXISTS idx_submissions_form_date ON public.form_submissions(form_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_org ON public.form_submissions(organisation_id);

-- Drop old RLS policies on public.forms and public.form_submissions
DROP POLICY IF EXISTS "View forms in organisation" ON public.forms;
DROP POLICY IF EXISTS "Manage forms (Admin/Editor)" ON public.forms;
DROP POLICY IF EXISTS "Public can submit forms" ON public.form_submissions;
DROP POLICY IF EXISTS "View submissions (Admin/Editor)" ON public.form_submissions;

-- Drop new policies if they already exist (to support clean reapplies/idempotency)
DROP POLICY IF EXISTS "allow_public_select" ON public.forms;
DROP POLICY IF EXISTS "allow_members_select" ON public.forms;
DROP POLICY IF EXISTS "allow_staff_select" ON public.forms;
DROP POLICY IF EXISTS "allow_staff_all" ON public.forms;
DROP POLICY IF EXISTS "allow_public_insert_submissions" ON public.form_submissions;
DROP POLICY IF EXISTS "allow_members_insert_submissions" ON public.form_submissions;
DROP POLICY IF EXISTS "allow_staff_insert_submissions" ON public.form_submissions;
DROP POLICY IF EXISTS "allow_staff_select_submissions" ON public.form_submissions;
DROP POLICY IF EXISTS "allow_users_select_own_submissions" ON public.form_submissions;
DROP POLICY IF EXISTS "allow_staff_delete_submissions" ON public.form_submissions;

-- 7. Recreate RLS policies for public.forms
-- SELECT (Public): Allow anonymous select if visibility = 'public' AND is_active = true AND deleted_at IS NULL
CREATE POLICY "allow_public_select" ON public.forms
  FOR SELECT
  USING (visibility = 'public' AND is_active = true AND deleted_at IS NULL);

-- SELECT (Members): Allow select if visibility = 'members', organisation matches user's active org, and status is active
CREATE POLICY "allow_members_select" ON public.forms
  FOR SELECT
  USING (
    visibility = 'members'
    AND is_active = true
    AND deleted_at IS NULL
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.organisation_id = forms.organisation_id
      AND profiles.id = auth.uid()
      AND profiles.status = 'active'
    )
  );

-- SELECT (Staff): Allow select if user is admin, editor, or executive in that organisation
CREATE POLICY "allow_staff_select" ON public.forms
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.organisation_id = forms.organisation_id
      AND profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'executive', 'editor')
      AND profiles.status = 'active'
    )
  );

-- ALL (Staff): Allow management (insert, update, delete) if user is admin, editor, or executive in that organisation
CREATE POLICY "allow_staff_all" ON public.forms
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.organisation_id = forms.organisation_id
      AND profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'executive', 'editor')
      AND profiles.status = 'active'
    )
  );

-- 8. Recreate RLS policies for public.form_submissions
-- INSERT (Public): Allow if form is public, active, and not deleted
CREATE POLICY "allow_public_insert_submissions" ON public.form_submissions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.forms
      WHERE forms.id = form_submissions.form_id
      AND forms.visibility = 'public'
      AND forms.is_active = true
      AND forms.deleted_at IS NULL
    )
  );

-- INSERT (Members): Allow if form is member-only, active, not deleted, organisation matches user's active org, and user is active member
CREATE POLICY "allow_members_insert_submissions" ON public.form_submissions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.forms
      WHERE forms.id = form_submissions.form_id
      AND forms.visibility = 'members'
      AND forms.is_active = true
      AND forms.deleted_at IS NULL
    )
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.organisation_id = form_submissions.organisation_id
      AND profiles.id = auth.uid()
      AND profiles.status = 'active'
      AND EXISTS (
        SELECT 1 FROM public.forms
        WHERE forms.id = form_submissions.form_id
        AND forms.organisation_id = profiles.organisation_id
      )
    )
  );

-- INSERT (Staff): Allow if form is private, active, and user is staff (admin/editor/executive)
CREATE POLICY "allow_staff_insert_submissions" ON public.form_submissions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.forms
      WHERE forms.id = form_submissions.form_id
      AND forms.visibility = 'private'
      AND forms.is_active = true
      AND forms.deleted_at IS NULL
    )
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.organisation_id = form_submissions.organisation_id
      AND profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'executive', 'editor')
      AND profiles.status = 'active'
      AND EXISTS (
        SELECT 1 FROM public.forms
        WHERE forms.id = form_submissions.form_id
        AND forms.organisation_id = profiles.organisation_id
      )
    )
  );

-- SELECT (Staff): Allow view submissions for forms in their organisation
CREATE POLICY "allow_staff_select_submissions" ON public.form_submissions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.organisation_id = form_submissions.organisation_id
      AND profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'executive', 'editor')
      AND profiles.status = 'active'
    )
  );

-- SELECT (Users): Allow view own submissions (where user_id = auth.uid())
CREATE POLICY "allow_users_select_own_submissions" ON public.form_submissions
  FOR SELECT
  USING (
    user_id = auth.uid()
  );

-- DELETE (Staff): Allow deletion of submissions in their organisation
CREATE POLICY "allow_staff_delete_submissions" ON public.form_submissions
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.organisation_id = form_submissions.organisation_id
      AND profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'executive', 'editor')
      AND profiles.status = 'active'
    )
  );
