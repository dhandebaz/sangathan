## 2026-06-15T03:50:35+05:30
Identify your working directory: c:\Users\hudav\Documents\trae_projects\sangathan\.agents\teamwork_preview_worker_m1_1

Your task is to implement Milestone 1: DB Schema & Security Fixes.

DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Detailed Instructions:
1. Database Schema Migration:
   - Add a new migration file `supabase/migrations/20260615000002_fix_members_and_rls.sql`.
   - In this migration, add the following missing columns to `public.members`:
     * `designation` (TEXT)
     * `area` (TEXT)
     * `joining_date` (TIMESTAMPTZ DEFAULT NOW())
     * `status` (TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')))
     * `notes` (TEXT)
   - Fix the RLS policies for `public.tickets` and `public.campaigns`. The existing policies in `supabase/migrations/20260615000001_org_features.sql` are broken because they check `members.user_id` and `members.status` (which do not exist on `public.members`).
   - You must:
     * Drop the old policies on `public.tickets` ("Org members can view their tickets", "Org members can create tickets", "Org admins can update tickets") and `public.campaigns` ("Org members can view campaigns", "Org admins can manage campaigns").
     * Recreate these policies checking the `public.profiles` table (where `profiles.id = auth.uid()` and `profiles.status = 'active'` and `profiles.role` are defined).
     * Specifically, check:
       - For `tickets` select/insert: `EXISTS (SELECT 1 FROM public.profiles WHERE profiles.organisation_id = tickets.organisation_id AND profiles.id = auth.uid() AND profiles.status = 'active')`
       - For `tickets` update: `EXISTS (SELECT 1 FROM public.profiles WHERE profiles.organisation_id = tickets.organisation_id AND profiles.id = auth.uid() AND profiles.role IN ('admin', 'executive', 'editor'))`
       - For `campaigns` select: `EXISTS (SELECT 1 FROM public.profiles WHERE profiles.organisation_id = campaigns.organisation_id AND profiles.id = auth.uid() AND profiles.status = 'active')`
       - For `campaigns` ALL/manage: `EXISTS (SELECT 1 FROM public.profiles WHERE profiles.organisation_id = campaigns.organisation_id AND profiles.id = auth.uid() AND profiles.role IN ('admin', 'executive', 'editor'))`

2. App Code Adjustment:
   - Inspect `src/actions/members/actions.ts`. Remove the `as never` type-casting for database inserts/updates, and align the TypeScript types/queries so it compiles properly without bypasses.

3. Run build:
   - Run `npm run build` using the run_command tool to verify the codebase compiles successfully with 0 type errors. (Make sure you are in the workspace directory when running the command).

Please output your progress to progress.md and write a handoff.md in your working directory when done.
