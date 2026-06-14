## 2026-06-14T22:26:48Z

Identify your working directory: c:\Users\hudav\Documents\trae_projects\sangathan\.agents\teamwork_preview_worker_m3_1

Your task is to implement Milestone 3: Campaigns CRUD.

DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Detailed Instructions:
1. Create a server action file `src/actions/campaigns/actions.ts`:
   - Use `createSafeAction` to implement the following actions:
     - `createCampaign` (roles: any authenticated user):
       * Input schema: `title` (min 3 chars), `goal_description` (min 10 chars).
       * Insert into `public.campaigns` setting `organisation_id`, `created_by` (context.user.id), `title`, `goal_description`, `status` ('draft').
       * Log action `CAMPAIGN_CREATED`.
       * Revalidate `/dashboard/campaigns`.
     - `updateCampaignStatus` (roles: ['admin', 'editor']):
       * Input schema: `campaignId` (uuid), `status` (enum 'draft', 'active', 'completed').
       * Update `public.campaigns` set `status = input.status` where `id = input.campaignId` and `organisation_id = context.organizationId`.
       * Log action `CAMPAIGN_STATUS_UPDATED`.
       * Revalidate `/dashboard/campaigns`.
     - `deleteCampaign` (roles: ['admin', 'editor']):
       * Input schema: `campaignId` (uuid).
       * Delete from `public.campaigns` where `id = input.campaignId` and `organisation_id = context.organizationId`.
       * Log action `CAMPAIGN_DELETED`.
       * Revalidate `/dashboard/campaigns`.

2. Make the Campaigns frontend functional:
   - Check `src/app/[lang]/dashboard/campaigns/page.tsx`. Currently it queries the database and renders a static table and button.
   - Refactor this page to use a client component or import client-side dialogs/tables to handle:
     * A Dialog/modal to create a new campaign (asking for Title and Goal Description).
     * Search filtering by title or goal description.
     * Actions in the table for admins/editors:
       - If status is `draft`, show an "Activate" button.
       - If status is `active`, show a "Complete" button.
       - Show a "Delete" button (trash icon or text with confirm) to delete the campaign.
     * You can either refactor the page itself, or create a client component (e.g. `src/components/dashboard/campaign-manager.tsx` or similar) and import it, similar to `TicketManager`.
     * Note: make sure to handle `getUserContext` properly by passing the organizationId (like you did in Milestone 2: retrieve orgId with `getSelectedOrganisationId()`, then `getUserContext(orgId)`).

3. Verify Next.js compiles with no errors by running `npm run build`.

Update progress.md and write a handoff.md in your working directory when done.
