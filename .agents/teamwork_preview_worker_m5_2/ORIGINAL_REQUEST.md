## 2026-06-14T23:51:22Z

Identify your working directory: c:\Users\hudav\Documents\trae_projects\sangathan\.agents\teamwork_preview_worker_m5_2

Your task is to implement Milestone 5: E2E Testing & Build Verification.

DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Detailed Instructions:
1. Write a Node.js verification script: `scripts/verify_features.js`:
   - The script must read `.env.local` to parse `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
   - Import `createClient` from `@supabase/supabase-js`.
   - Implement the following programmatic check flow:
     * Create a test organisation with unique slug (e.g. `test-org-[timestamp]`) and insert it into `public.organisations`.
     * Insert a test record into `public.tickets` table:
       - `organisation_id` = test org ID
       - `type` = 'complaint'
       - `title` = 'Test Complaint Title'
       - `description` = 'This is a test complaint description with more than 10 characters'
       - `status` = 'open'
       - `priority` = 'medium'
     * Query the inserted ticket from the database and assert that it was persisted and matches the input fields.
     * Insert a test record into `public.campaigns` table:
       - `organisation_id` = test org ID
       - `title` = 'Test Campaign Title'
       - `goal_description` = 'This is a test campaign goal description with more than 10 characters'
       - `status` = 'draft'
     * Query the inserted campaign from the database and assert that it was persisted and matches the input fields.
     * Clean up: Delete the inserted ticket, campaign, and the test organisation from the database.
     * Log a clear message "VERIFICATION SUCCESSFUL: tickets and campaigns successfully persisted to the Supabase database." and exit with code 0 on success, or exit with code 1 and log the error on failure.

2. Run the verification script:
   - Run the script `node scripts/verify_features.js` using the run_command tool. Document the output.

3. Verify production compilation:
   - Run `npm run lint` and `npm run build` using the run_command tool to ensure everything compiles successfully with 0 type errors.

Update progress.md and write a handoff.md in your working directory when done.
