# Analysis: Database Schema & Forms Design

This report contains details on the existing database schema for the Sangathan project and provides a robust database schema design for the `forms` and `form_submissions` features, complete with Row Level Security (RLS) policies that support public vs. member-only vs. private access.

---

## 1. Summary of Findings

1. **Baseline and Migrations**: The database baseline is defined in `supabase/schema.sql`. Schema improvements, moderation tooling, and new features are managed as migrations under `supabase/migrations/`.
2. **Current Forms Implementation**: The project has partial implementations of `forms` and `form_submissions` in both `schema.sql` and the Next.js frontend (actions, pages, and components).
3. **Critical Security & Schema Inconsistencies**:
   - **RLS Bypass**: The existing RLS select policy for `forms` prevents any public (non-organisation-member) access. The Next.js public forms page currently uses a high-privilege Service Client (`createServiceClient()`) to bypass RLS and read form details.
   - **Overly Permissive Submissions**: The `form_submissions` insert policy allows *anyone* to insert submissions into any form (without checking if the form exists, is active, or belongs to their organisation).
   - **Missing/Mismatched Fields**:
     - `schema.sql` defines `form_submissions.submitted_at` but migrations (`20240214000003_performance_tuning.sql`) index `form_submissions.created_at`.
     - The server action `actions.ts` inserts `user_id` into `form_submissions`, but the `form_submissions` table in `schema.sql` does not contain this column.

---

## 2. Existing Schema Analysis

Below is an analysis of the core tables, their relationships, and how they evolve across migrations.

### 2.1. Organisations Table (`public.organisations`)
* **Baseline definition** (`schema.sql`):
  - `id` (UUID, Primary Key, Default: random)
  - `name` (TEXT, Not Null)
  - `slug` (TEXT, Not Null, Unique)
  - `remove_branding` (BOOLEAN, Default: false)
  - `is_suspended` (BOOLEAN, Default: false)
  - `created_at` / `updated_at` (TIMESTAMPTZ)
* **Migration additions**:
  - `deleted_at` (TIMESTAMPTZ, `20240214000002`)
  - `legal_hold` / `legal_hold_reason` / `deletion_requested_at` (`20240214000002`)
  - `membership_policy` (TEXT, check in `('open_auto', 'admin_approval', 'invite_only')`, `20240214000006`)
  - `public_transparency_enabled` (BOOLEAN, Default: false, `20240214000010`)
  - `capabilities` (JSONB, Default: `'{}'::jsonb`, with object validation constraint, `20240214000015` & `202602280002`)
  - `org_type` (TEXT, check in `('student_union', 'ngo', 'workers_union', 'rwa', 'other')`, `20260615000000`)
* **Key Indexes**:
  - `idx_orgs_active` ON `organisations(id) WHERE deleted_at IS NULL`
  - `idx_organisations_capabilities` GIN index on `capabilities`

### 2.2. Profiles Table (`public.profiles`)
Maps authenticating users (`auth.users`) to their respective organisations and roles.
* **Baseline definition** (`schema.sql`):
  - `id` (UUID, Primary Key, References `auth.users(id)` ON DELETE CASCADE)
  - `organisation_id` (UUID, References `public.organisations(id)` ON DELETE CASCADE)
  - `full_name` (TEXT)
  - `email` (TEXT, Not Null)
  - `role` (TEXT, Check in `('admin', 'editor', 'viewer')`)
  - `is_platform_admin` (BOOLEAN, Default: false)
  - `created_at` / `updated_at` (TIMESTAMPTZ)
* **Migration additions**:
  - `phone` (TEXT, Unique) / `phone_verified` (BOOLEAN) / `firebase_uid` (TEXT, Unique) (`20240213000000`)
  - `status` (TEXT, check in `('active', 'pending', 'rejected', 'removed')`, Default: `'active'`) (`20240214000006`)
  - `approved_at` (TIMESTAMPTZ) (`20240214000006`)
  - **Expanded Roles**: The role constraint is updated to: `role IN ('admin', 'editor', 'viewer', 'general', 'volunteer', 'core', 'executive')` (`20240214000006`).
* **Key Indexes**:
  - `idx_profiles_org` ON `profiles(organisation_id)`
  - `idx_profiles_phone` ON `profiles(phone)`
  - `idx_profiles_firebase_uid` ON `profiles(firebase_uid)`
  - `idx_profiles_status` ON `profiles(status)`

### 2.3. Members Table (`public.members`)
Maintains a list of organization members (which may or may not map directly to platform login accounts).
* **Baseline definition** (`schema.sql`):
  - `id` (UUID, Primary Key)
  - `organisation_id` (UUID, References `public.organisations(id)` ON DELETE CASCADE)
  - `full_name` (TEXT, Not Null)
  - `email` (TEXT)
  - `phone` (TEXT)
  - `role` (TEXT, Check in `('admin', 'editor', 'viewer', 'member')`, Default: `'member'`)
  - `joined_at` / `created_at` (TIMESTAMPTZ)
  - Unique Constraint: `unique_phone_per_org` (on `organisation_id, phone`)
* **Migration additions**:
  - `designation` (TEXT) (`20260615000002`)
  - `area` (TEXT) (`20260615000002`)
  - `joining_date` (TIMESTAMPTZ, Default: now()) (`20260615000002`)
  - `status` (TEXT, Check in `('active', 'inactive')`, Default: `'active'`) (`20260615000002`)
  - `notes` (TEXT) (`20260615000002`)
* **Key Indexes**:
  - `idx_members_org` ON `members(organisation_id)`
  - `idx_members_phone` ON `members(phone)`
  - `idx_members_active_org` ON `members(organisation_id) WHERE deleted_at IS NULL`
  - `idx_members_email` ON `members(email)`
  - `idx_members_role` ON `members(organisation_id, role)`

### 2.4. Existing Forms & Submissions Tables
* **Forms Table Baseline** (`schema.sql`):
  - `id` (UUID, Primary Key)
  - `organisation_id` (UUID, References `public.organisations(id)`)
  - `title` (TEXT, Not Null)
  - `description` (TEXT)
  - `fields` (JSONB, Default: `'[]'`)
  - `is_active` (BOOLEAN, Default: true)
  - `created_by` (UUID, References `public.profiles(id)`)
  - `created_at` / `updated_at` (TIMESTAMPTZ)
* **Form Submissions Table Baseline** (`schema.sql`):
  - `id` (UUID, Primary Key)
  - `organisation_id` (UUID, References `public.organisations(id)`)
  - `form_id` (UUID, References `public.forms(id)`)
  - `data` (JSONB, Not Null)
  - `submitted_at` (TIMESTAMPTZ, Default: now())

---

## 3. Proposed Schema Design & Migration

To solve the database inconsistencies, eliminate the security RLS-bypass in the Next.js frontend, and enforce granular access control for public vs. member-only vs. private forms, we propose the following schema updates and RLS redesign.

### 3.1. Database Design Changes
1. **Forms Table (`public.forms`)**:
   - Add `deleted_at` TIMESTAMPTZ to support soft-deletion (reconciling with index `idx_forms_active` and deletion server actions).
   - Add `visibility` TEXT (CHECK in `('public', 'members', 'private')`, Default: `'public'`) to define who can access and fill the form.
2. **Form Submissions Table (`public.form_submissions`)**:
   - Add `user_id` UUID referencing `auth.users(id)` ON DELETE SET NULL to track authenticated users submitting the form, while remaining NULLable for anonymous public submissions (reconciling with server action `actions.ts`).
   - Rename `submitted_at` to `created_at` to match performance indexes (`idx_submissions_form_date`) and standardize datetime column naming.

### 3.2. RLS Policies Design
* **For `public.forms`**:
  - **Select (Public Forms)**: Anyone (including anonymous users) can read if `visibility = 'public' AND is_active = true AND deleted_at IS NULL`.
  - **Select (Member Forms)**: Logged-in users can read if `visibility = 'members'`, their profile matches the organisation, and they are active (`status = 'active'`).
  - **Select (Private/All Forms)**: Organisation staff (Admins, Editors, Executives) can read all forms in their organisation.
  - **Write (Insert/Update/Delete)**: Managed exclusively by staff (Admins, Editors, Executives) belonging to the same organisation.
* **For `public.form_submissions`**:
  - **Insert (Public Forms)**: Allowed for anyone if the associated form is public, active, and not deleted.
  - **Insert (Member Forms)**: Allowed only for authenticated, active members of the same organisation if the form is member-only and active.
  - **Insert (Private Forms)**: Allowed only for organisation staff if the form is private and active.
  - **Select (View Submissions)**:
    - Logged-in users can view their own submissions (`user_id = auth.uid()`).
    - Organisation staff can view all submissions for forms belonging to their organisation.
  - **Delete (Manage Submissions)**: Managed exclusively by staff (Admins, Editors, Executives).

---

## 4. Proposed Migration Script

Create a new migration file `supabase/migrations/20260615000004_forms_visibilities_and_rls.sql`:

```sql
-- 1. Alter Forms Table
ALTER TABLE public.forms 
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS visibility TEXT NOT NULL DEFAULT 'public' 
    CHECK (visibility IN ('public', 'members', 'private'));

-- 2. Alter Form Submissions Table
ALTER TABLE public.form_submissions 
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Rename submitted_at to created_at if not already done, ensuring compatibility with indexes
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'form_submissions' AND column_name = 'submitted_at'
  ) THEN
    ALTER TABLE public.form_submissions RENAME COLUMN submitted_at TO created_at;
  END IF;
END $$;

-- 3. Drop Old RLS Policies on Forms and Form Submissions
DROP POLICY IF EXISTS "View forms in organisation" ON public.forms;
DROP POLICY IF EXISTS "Manage forms (Admin/Editor)" ON public.forms;
DROP POLICY IF EXISTS "Public can submit forms" ON public.form_submissions;
DROP POLICY IF EXISTS "View submissions (Admin/Editor)" ON public.form_submissions;

-- 4. Recreate RLS Policies on Forms

-- SELECT: Public can see active, non-deleted public forms
CREATE POLICY "Allow public select for active public forms" ON public.forms
  FOR SELECT
  USING (
    visibility = 'public' 
    AND is_active = true 
    AND deleted_at IS NULL
  );

-- SELECT: Members can see active, non-deleted member-only forms
CREATE POLICY "Allow member select for active member-only forms" ON public.forms
  FOR SELECT
  USING (
    visibility = 'members'
    AND is_active = true
    AND deleted_at IS NULL
    AND organisation_id = public.get_auth_org_id()
    AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND status = 'active'
    )
  );

-- SELECT: Admins/editors/executives can see all forms in their organization
CREATE POLICY "Allow staff select for all forms" ON public.forms
  FOR SELECT
  USING (
    organisation_id = public.get_auth_org_id()
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'editor', 'executive')
    )
  );

-- ALL: Admins/editors/executives can manage forms (insert, update, delete)
CREATE POLICY "Allow staff to manage forms" ON public.forms
  FOR ALL
  USING (
    organisation_id = public.get_auth_org_id()
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'editor', 'executive')
    )
  )
  WITH CHECK (
    organisation_id = public.get_auth_org_id()
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'editor', 'executive')
    )
  );

-- 5. Recreate RLS Policies on Form Submissions

-- INSERT: Public can submit to active, public forms
CREATE POLICY "Allow public submission to public forms" ON public.form_submissions
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

-- INSERT: Active members can submit to active, member-only forms
CREATE POLICY "Allow member submission to member-only forms" ON public.form_submissions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.forms
      WHERE forms.id = form_submissions.form_id
      AND forms.visibility = 'members'
      AND forms.is_active = true
      AND forms.deleted_at IS NULL
      AND forms.organisation_id = public.get_auth_org_id()
    )
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND status = 'active'
    )
  );

-- INSERT: Staff can submit to active, private forms (e.g., manual data logging)
CREATE POLICY "Allow staff submission to private forms" ON public.form_submissions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.forms
      WHERE forms.id = form_submissions.form_id
      AND forms.visibility = 'private'
      AND forms.is_active = true
      AND forms.deleted_at IS NULL
      AND forms.organisation_id = public.get_auth_org_id()
    )
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'editor', 'executive')
    )
  );

-- SELECT: Staff can view submissions for forms in their organisation
CREATE POLICY "Allow staff to view submissions" ON public.form_submissions
  FOR SELECT
  USING (
    organisation_id = public.get_auth_org_id()
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'editor', 'executive')
    )
  );

-- SELECT: Users can view their own logged-in submissions
CREATE POLICY "Allow users to view own submissions" ON public.form_submissions
  FOR SELECT
  USING (user_id = auth.uid());

-- DELETE: Staff can delete submissions (GDPR, spam cleanup, etc.)
CREATE POLICY "Allow staff to delete submissions" ON public.form_submissions
  FOR DELETE
  USING (
    organisation_id = public.get_auth_org_id()
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'editor', 'executive')
    )
  );
```

---

## 5. Security Architecture Improvement

By introducing these policies, the Next.js codebase can be updated to:
1. Fetch form metadata on the public page `src/app/(public)/f/[formId]/page.tsx` using a standard, unprivileged client (`createClient()`) instead of the high-privilege `createServiceClient()`. This guarantees that if a form is set to `'private'` or `'members'`, the client-side/anonymous user simply receives a `404 Not Found` or `403 Forbidden` from the database directly, enforcing RLS at the data layer.
2. In `src/actions/forms/actions.ts`, standard Supabase clients can be used for inserting submissions, ensuring that rate limits, active flags, and visibility restrictions are checked directly at the database level rather than entirely relying on application-level checks.
