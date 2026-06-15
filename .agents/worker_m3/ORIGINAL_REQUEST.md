## 2026-06-15T06:36:02Z
You are worker_m3. Your working directory is c:\Users\hudav\Documents\trae_projects\sangathan\.agents\worker_m3.
Your task is to implement Milestone 3: Access Controls & Submissions for the Dynamic Form Builder and Public Survey system.

Here are the specific requirements:
1. Update Form Builder UI (`src/components/forms/new-form-client.tsx`):
   - Add a state `visibility` with default value `'public'`.
   - Render a select dropdown in the form builder card allowing admins to select form visibility:
     * `'public'` (Public - Anyone can submit)
     * `'members'` (Members Only - Requires organization member login)
     * `'private'` (Private - Only admins/editors can submit)
   - Style the dropdown using Tailwind to match the input/textarea styling.
   - Update `handleSubmit` to include the `visibility` field when calling `createForm`.

2. Update Server Actions (`src/actions/forms/actions.ts`):
   - In `CreateFormSchema`, add `visibility: z.enum(['public', 'members', 'private']).default('public')`.
   - In `UpdateFormSchema`, add `visibility: z.enum(['public', 'members', 'private']).optional()`.
   - In `createForm`, write `visibility: input.visibility` to the `forms` table insert.
   - In `updateForm`, add `visibility: input.visibility` to the `forms` table update logic.
   - Refactor `submitFormResponse` to check form visibility and auth context:
     * Retrieve the user session (if any) using standard `createClient()` from `@/lib/supabase/server`.
     * If the form's visibility is `'members'`:
       - If there is no authenticated user, return `{ success: false, error: 'Authentication required. Please log in to fill this form.' }`.
       - Query the `profiles` table: check if the user is active (`status = 'active'`) and belongs to the form's organisation (`organisation_id = form.organisation_id`). If not, return `{ success: false, error: 'Only active members of this organization can fill this form.' }`.
     * If the form's visibility is `'private'`:
       - If there is no authenticated user, return `{ success: false, error: 'Access denied. You must be logged in.' }`.
       - Query the `profiles` table: check if the user is active (`status = 'active'`), belongs to the form's organisation (`organisation_id = form.organisation_id`), and has a role in `['admin', 'editor', 'executive']`. If not, return `{ success: false, error: 'Access denied. Only staff can submit responses to this form.' }`.
     * In the `form_submissions` insert logic:
       - Populate `user_id: user?.id || null` using the authenticated user's ID, rather than hardcoding it to `null`.

3. Refactor Public Survey Page (`src/app/(public)/f/[formId]/page.tsx`):
   - Query the form details first using `createServiceClient()` to determine its visibility.
   - If the form is not found, is inactive, or has `deleted_at IS NOT NULL`, call `notFound()`.
   - Initialize standard client `createClient()` from `@/lib/supabase/server` to fetch the authenticated user session.
   - Perform the visibility validation gates:
     * If `'members'`:
       - If user is not logged in, redirect to `/en/login?redirect=/f/${formId}`.
       - If logged in, fetch the user's profile. If the user is not active or belongs to a different organisation, return a styled "Access Denied" page/message.
     * If `'private'`:
       - If user is not logged in, redirect to `/en/login?redirect=/f/${formId}`.
       - If logged in, fetch the user's profile. If not active, role is not in `['admin', 'editor', 'executive']`, or organisation does not match, return a styled "Access Denied" page/message.
     * If `'public'`:
       - Render the form.
   - For allowed users, render `<PublicForm>` and generate the CSRF token.

4. Verify compilation correctness using `npx tsc --noEmit` and `npm run build`. Ensure there are no type errors.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Write your results to c:\Users\hudav\Documents\trae_projects\sangathan\.agents\worker_m3\handoff.md and notify the main orchestrator when complete.
