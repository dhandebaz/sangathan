## 2026-06-15T06:07:30Z

Your task is to implement Milestone 1: DB Schema & RLS Policies for the Dynamic Form Builder and Public Survey system.

Here is the plan for database changes and policies:
1. Create a migration file `supabase/migrations/20260615000004_forms_visibilities_and_rls.sql` with:
   - Alter `public.forms` to add `deleted_at TIMESTAMPTZ` and `visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'members', 'private'))`.
   - Alter `public.form_submissions` to add `user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL`.
   - Rename `submitted_at` to `created_at` in `public.form_submissions` table if it exists.
   - Drop old RLS policies on `public.forms` and `public.form_submissions`.
   - Recreate RLS policies for `public.forms`:
     * SELECT (Public): Allow anonymous select if `visibility = 'public' AND is_active = true AND deleted_at IS NULL`.
     * SELECT (Members): Allow select if `visibility = 'members'`, organisation matches user's active org, and status is active.
     * SELECT (Staff): Allow select if user is admin, editor, or executive in that organisation.
     * ALL (Staff): Allow management (insert, update, delete) if user is admin, editor, or executive in that organisation.
   - Recreate RLS policies for `public.form_submissions`:
     * INSERT (Public): Allow if form is public, active, and not deleted.
     * INSERT (Members): Allow if form is member-only, active, not deleted, organisation matches user's active org, and user is active member.
     * INSERT (Staff): Allow if form is private, active, and user is staff (admin/editor/executive).
     * SELECT (Staff): Allow view submissions for forms in their organisation.
     * SELECT (Users): Allow view own submissions (where user_id = auth.uid()).
     * DELETE (Staff): Allow deletion of submissions in their organisation.

2. Apply the migration.
   - Check if you can apply it using Supabase CLI: e.g. run `npx supabase db push` using the remote connection credentials if possible.
   - Alternatively, write a temporary Node.js execution script that connects to the database via postgres or an RPC call to apply these SQL modifications (since we have SENDER/service role credentials, check if you can run pg commands or if there is an existing database client to execute DDL). Let's see if the Supabase project supports pushing migrations.

3. Synchronize typescript definitions:
   - Check `src/types/database.ts` and update table definitions for `forms` and `form_submissions` to include `visibility`, `deleted_at`, and `user_id` and change `submitted_at` to `created_at` in `form_submissions`.
   - Check `src/types/dashboard.ts` and update `DashboardForm` to include `visibility?: 'public' | 'members' | 'private' | null;` and change `submitted_at` to `created_at` or verify references.
   - Fix any other typescript type errors in components or server actions resulting from these schema updates.

4. Run `npm run build` and `npx tsc --noEmit` to ensure everything compiles correctly.

## 2026-06-15T06:20:05Z

**Context**: Database schema and RLS policies migration.
**Content**: Checking in on your status. Your progress.md has not been updated in 12 minutes. Please update your progress.md and report back with your current state.
**Action**: Please respond with your status.
