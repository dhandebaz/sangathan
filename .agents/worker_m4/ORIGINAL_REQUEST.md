## 2026-06-15T06:39:18Z

You are worker_m4. Your working directory is c:\Users\hudav\Documents\trae_projects\sangathan\.agents\worker_m4.
Your task is to implement Milestone 4: Verification & Build Validation for the Dynamic Form Builder and Public Survey system.

Here are the specific requirements:
1. Write the programmatic verification script `scripts/verify_forms.js`:
   - Follow the structure of `scripts/verify_features.js` to parse environment variables from `.env.local`.
   - Initialize two Supabase JS clients:
     * `supabaseAdmin`: using the `SUPABASE_SERVICE_ROLE_KEY` to act with admin bypass.
     * `supabaseAnon`: using the `NEXT_PUBLIC_SUPABASE_ANON_KEY` to act as an unauthenticated guest.
   - Implement the test sequence:
     * **Step 1: Setup**:
       - Create a temporary test organization.
       - Create a temporary test user via `supabaseAdmin.auth.admin.createUser()` with a unique email and password.
       - Create a profile in `public.profiles` linking to the auth user, assigning them to the test organization, status `'active'`, and role `'member'`.
       - Sign in the test user via `supabaseAnon.auth.signInWithPassword()` to retrieve a session and token.
       - Create `supabaseUser`: a Supabase client authenticated as the test user.
     * **Step 2: Form Creation**:
       - Using `supabaseAdmin`, create a private/member-only form definition with `visibility = 'members'`, containing multiple field types (e.g., text, number, dropdown) and conditional logic stored in `fields` JSONB (e.g. checking field dependencies).
     * **Step 3: Access Control Validation**:
       - Test unauthenticated access (using `supabaseAnon`):
         * Attempt to read the form details. It should return 0 results or fail (due to RLS select gate).
         * Attempt to insert a submission into this members-only form. It should fail (due to RLS insert gate or check policy).
       - Test authenticated member access (using `supabaseUser`):
         * Attempt to insert a submission into the members-only form. It should succeed!
     * **Step 4: Persistence Check**:
       - Query the inserted submission using `supabaseAdmin`.
       - Assert that the data was persisted accurately, matches the inputs, and the `user_id` column contains the test user's UUID.
     * **Step 5: Cleanup**:
       - Delete the test submissions, test forms, profiles, auth user, and test organization.
   - Output clear logging lines for each check. The script should exit with `0` on success, or `1` if any check/assertion fails.

2. Run the verification script:
   - Run `node scripts/verify_forms.js`.
   - Verify that all assertions pass and it completes with exit code 0. Record the console output.

3. Build checking:
   - Run type checking: `npx tsc --noEmit`.
   - Run Next.js production build: `npm run build`.
   - Confirm both complete successfully with 0 errors.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Write your results to c:\Users\hudav\Documents\trae_projects\sangathan\.agents\worker_m4\handoff.md and notify the main orchestrator when complete.
