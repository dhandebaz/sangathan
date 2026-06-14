## 2026-06-15T03:53:20Z
Identify your working directory: c:\Users\hudav\Documents\trae_projects\sangathan\.agents\teamwork_preview_worker_m2_1

Your task is to implement Milestone 2: Tickets CRUD.

DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Detailed Instructions:
1. Create a server action file `src/actions/tickets/actions.ts`:
   - Import necessary libraries, Zod, and security context/client helpers.
   - Define Zod schemas for inputs:
     - `CreateTicketSchema`: `title` (min 3 chars), `description` (min 10 chars), `type` (enum 'grievance', 'complaint', 'maintenance'), `priority` (enum 'low', 'medium', 'high').
     - `UpdateTicketSchema`: `ticketId` (uuid), `status` (enum 'open', 'in_progress', 'resolved').
     - `DeleteTicketSchema`: `ticketId` (uuid).
   - Define server actions using `createSafeAction`:
     - `createTicket` (roles: any authenticated user):
       * Get organisation ID from context.
       * Insert into `public.tickets` table setting `organisation_id`, `created_by` (context.user.id), `title`, `description`, `type`, `priority`, `status` ('open').
       * Log action `TICKET_CREATED`.
       * Revalidate path: depending on the type, revalidate `/dashboard/complaints`, `/dashboard/grievances`, or `/dashboard/maintenance`.
     - `updateTicketStatus` (roles: ['admin', 'editor']):
       * Update `public.tickets` set `status = input.status` where `id = input.ticketId` and `organisation_id = context.organizationId`.
       * Log action `TICKET_STATUS_UPDATED`.
       * Revalidate appropriate paths.
     - `deleteTicket` (roles: ['admin', 'editor']):
       * Delete from `public.tickets` where `id = input.ticketId` and `organisation_id = context.organizationId`.
       * Log action `TICKET_DELETED`.
       * Revalidate appropriate paths.

2. Modify `src/components/dashboard/ticket-manager.tsx`:
   - Import Dialog, Button, Input, Label, Textarea, Select, etc.
   - Add a creation dialog/modal that opens when clicking the "New..." button.
     - Form fields: Title, Description, Priority (select dropdown: low, medium, high).
     - Wire up form submission to call `createTicket`. On success, show toast, close dialog, and refresh the router.
   - Pass the user's role or an `isAdminOrEditor` flag from the parent page components to `TicketManager`.
   - Update parent pages `src/app/[lang]/dashboard/complaints/page.tsx`, `/grievances/page.tsx`, `/maintenance/page.tsx` to pass the `role` or `isAdminOrEditor` boolean based on `ctx.role`.
   - In the `TicketManager` table, add an "Actions" column or update the existing UI.
     - If the user is an admin or editor, display buttons/actions to:
       * Update status (e.g. show "Start" or "Resolve" button depending on current status).
       * Delete the ticket (show a Delete button/icon with confirmation).
     - If not an admin/editor, they can only view and create.

3. Run `npm run build` using the run_command tool to verify everything compiles cleanly with no typescript errors.

Update progress.md and write a handoff.md in your working directory when done.
