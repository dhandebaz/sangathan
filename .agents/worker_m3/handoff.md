# Handoff Report — worker_m3

## 1. Observation
- Modified files:
  * `src/components/forms/new-form-client.tsx`:
    - Added `visibility` state with default `'public'`.
    - Added a dropdown selector for visibility (options: `'public'`, `'members'`, `'private'`) styled with Tailwind.
    - Updated `handleSubmit` to pass `visibility` to the `createForm` server action.
  * `src/actions/forms/actions.ts`:
    - Added `visibility` field in `CreateFormSchema` as `z.enum(['public', 'members', 'private']).default('public')`.
    - Added `visibility` field in `UpdateFormSchema` as `z.enum(['public', 'members', 'private']).optional()`.
    - Mapped `visibility` in `createForm` and `updateForm` Database insert/update statements.
    - Refactored `submitFormResponse`:
      * Fetched user session via `@/lib/supabase/server`.
      * Evaluated visibility gates (checking members and private constraints against active profiles associated with the organization).
      * Populated `user_id` using `user?.id || null` in the `form_submissions` insert logic.
  * `src/app/(public)/f/[formId]/page.tsx`:
    - Changed select statement to retrieve `visibility, deleted_at`.
    - Enforced `notFound()` if the form is missing, inactive, or soft-deleted (`deleted_at !== null`).
    - Used standard `@/lib/supabase/server` to retrieve the user session.
    - Implemented validation gates:
      * `'members'`: Redirects unauthenticated users to `/en/login?redirect=/f/${formId}`. Shows an styled Access Denied page/message if the user is inactive or belongs to a different organisation.
      * `'private'`: Redirects unauthenticated users to `/en/login?redirect=/f/${formId}`. Shows an styled Access Denied page/message if the user is inactive, role is not in `['admin', 'editor', 'executive']`, or organisation does not match.
      * `'public'`: Allows form rendering.

## 2. Logic Chain
- Visibility defaults to `'public'`, preserving backward compatibility.
- Visibility logic must be verified on the server-side to prevent unauthorized form submission via API calls directly to Server Actions.
  * In `submitFormResponse`, the database is queried for `visibility` and validation is enforced depending on the visibility value:
    - `'members'` checks that the user exists and has a profile record with `status = 'active'` and `organisation_id = form.organisation_id`.
    - `'private'` checks that the user exists, profile is active, belongs to organization, and role matches staff roles.
- On the Frontend, we redirect unauthenticated users to `/en/login?redirect=/f/${formId}` to ensure they have an opportunity to log in before receiving an Access Denied message.
- If a form is not active or is soft-deleted, we should return a 404 (`notFound()`) directly.

## 3. Caveats
- No caveats. The database schema already has `visibility` and `deleted_at` on `forms` and `user_id` on `form_submissions` via the migration `20260615000004_forms_visibilities_and_rls.sql`.

## 4. Conclusion
Milestone 3 is fully implemented. Access controls are enforced both on the public survey page and within form submission server actions.

## 5. Verification Method
- Verification commands:
  * `npx tsc --noEmit` checks for TypeScript compilation errors (passed).
  * `npm run build` verifies full project build (passed).
- Manual verification files to inspect:
  * `src/components/forms/new-form-client.tsx`
  * `src/actions/forms/actions.ts`
  * `src/app/(public)/f/[formId]/page.tsx`
