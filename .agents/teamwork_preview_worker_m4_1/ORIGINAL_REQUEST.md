## 2026-06-14T22:30:33Z
Identify your working directory: c:\Users\hudav\Documents\trae_projects\sangathan\.agents\teamwork_preview_worker_m4_1

Your task is to implement Milestone 4: UI Polish & Feature Polish for volunteers, student IDs, and donations.

DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Detailed Instructions:
1. Polish NGO Volunteers page (`src/app/[lang]/dashboard/volunteers/page.tsx`):
   - refactor the page to use a client component or client-side filtering component (e.g. create `src/components/dashboard/volunteers-client.tsx` or similar).
   - Implement dynamic client-side filtering based on name or email/phone using a search input.
   - Replace the static "Invite Volunteers" button with the existing `AddMemberDialog` component (imported from `@/components/members/add-member-dialog`). This makes the volunteer invite function work immediately, as volunteers are active members.

2. Polish Student Union IDs page (`src/app/[lang]/dashboard/student-ids/page.tsx`):
   - Refactor this page to support client-side interactive search (by name or membership ID).
   - Wire up the "View ID" button to trigger a Dialog/modal that displays a beautifully styled Student Identity Card using Tailwind CSS. The card should display:
     * Student's name, membership number/ID (e.g. `STU-...`), status (Active), issue date, and organisation name.
     * Photo placeholder (a styled user icon box), signature placeholder, official-looking layout.
     * Include a "Print Card" button inside the ID card viewer dialog which triggers window printing for that specific card container or redirects to the single print page.
   - Create a batch print page: `src/app/[lang]/dashboard/student-ids/print/page.tsx`.
     * This page should query active members/students using supabase.
     * Render a grid layout of Student ID Cards (e.g., 2 per row) using the `PrintLayout` component from `@/components/print/print-layout`.
     * Verify that when users go to `/${lang}/dashboard/student-ids/print`, they get a printable grid layout that automatically prompts the print dialog (PrintLayout does this via `window.print()`).
   - Wire up the "Print Batch" button on the student-ids page to open the print batch route in a new tab: `window.open('/' + lang + '/dashboard/student-ids/print', '_blank')`.

3. Ensure robust error handling, loading states, and styles across pages.
4. Run `npm run build` using the run_command tool to verify everything compiles cleanly with no typescript errors.

Update progress.md and write a handoff.md in your working directory when done.
