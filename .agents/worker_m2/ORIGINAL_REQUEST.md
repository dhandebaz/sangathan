## 2026-06-15T06:24:47Z
You are worker_m2. Your working directory is c:\Users\hudav\Documents\trae_projects\sangathan\.agents\worker_m2.
Your task is to implement Milestone 2: Admin Navigation & Gating for the Dynamic Form Builder and Public Survey system.

Here are the specific implementation details:
1. Sidebar Navigation Link (`src/app/[lang]/dashboard/layout.tsx`):
   - Import `FileText` from `lucide-react` at the top of the file.
   - Add the SidebarLink for custom forms under the "System" section (just above "Settings") so that any admin (`isAdmin`) can see it:
     ```tsx
     {isAdmin && (
       <SidebarLink href={`/${lang}/dashboard/forms`} icon={FileText} label="Forms" />
     )}
     ```

2. Mobile FAB Integration (`src/components/mobile/contextual-fab.tsx`):
   - In `ContextualFAB`, add the pathname conditional check so that when an admin is in `/dashboard/forms`, the contextual FAB displays a "Create Form" button pointing to `/${lang}/dashboard/forms/new`:
     ```typescript
     else if (pathname.endsWith('/dashboard/forms') && isAdmin) {
       action = {
         href: `/${lang}/dashboard/forms/new`,
         icon: Plus,
         label: 'Create Form'
       }
     }
     ```

3. Server-Side Page Role Gating:
   - For `src/app/[lang]/dashboard/forms/page.tsx`, `src/app/[lang]/dashboard/forms/[id]/page.tsx`, and `src/app/[lang]/dashboard/forms/new/page.tsx`:
     * Add server-side authentication and role-checking matching the pattern in `src/app/[lang]/dashboard/analytics/page.tsx`.
     * Check if `user` exists. If not, redirect to `/${lang}/login`.
     * Query the user's profile from the `profiles` table. If the profile doesn't exist, is missing `organisation_id`, or has a role that is NOT in `['admin', 'editor', 'executive']`, return `<AccessDenied lang={lang} />` (imported from `@/components/dashboard/access-denied`).
     * Use `profile.organisation_id` to query forms so they are scoped to the admin's organisation (note: `forms/page.tsx` and `forms/[id]/page.tsx` should use this org context).

4. Server Actions Gating Update (`src/actions/forms/actions.ts`):
   - For `createForm`, `updateForm`, `toggleFormStatus`, and `deleteForm`, change their `allowedRoles` from `['admin', 'editor']` to `['admin', 'editor', 'executive']` to align with the database RLS policies and dashboard layout.

5. Run `npx tsc --noEmit` and `npm run build` to verify that the project compiles cleanly after these gating integrations.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Write your results to c:\Users\hudav\Documents\trae_projects\sangathan\.agents\worker_m2\handoff.md and notify the main orchestrator when complete.
