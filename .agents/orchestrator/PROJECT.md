# Project: Sangathan Feature Completion and Polish

## Architecture
- **Tenant Isolation**: Row-Level Security (RLS) policies based on `public.profiles(id)` linking to `auth.users(id)` and matching `organisation_id`.
- **Specialized Org Modules**: Gated via `org_capabilities` in the `public.organisations` table.
  - **NGO**: Donations, Volunteers, Events
  - **Student Union**: Campaigns, Student IDs, Events
  - **Workers Union**: Grievances, Memberships
  - **RWA**: Complaints, Maintenance
- **Backend Services**: Next.js Server Actions using Supabase JS client client-side authentication.

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | DB Schema & Security Fixes | Add missing columns to `public.members`; fix RLS policies for `tickets` and `campaigns`; remove `as never` in member actions. | None | DONE |
| 2 | Tickets CRUD | Implement server actions for tickets; update `TicketManager` component with a functional creation form/modal and edit capability. | M1 | DONE |
| 3 | Campaigns CRUD | Implement server actions for campaigns; update Campaigns page with a creation form/modal and management features. | M1 | DONE |
| 4 | UI Polish & Feature Polish | Polish frontend layouts, error handling, and loading states. Ensure Volunteers, Student IDs, and Donations page function end-to-end. | M2, M3 | DONE |
| 5 | E2E Testing & Build Verification | Create programmatic verification script `scripts/verify_features.js`; run verification, check linters, and ensure `npm run build` compiles with 0 errors. | M4 | IN_PROGRESS |

## Interface Contracts
### Tickets Actions
- `createTicket(input: { title: string, description: string, type: 'grievance' | 'complaint' | 'maintenance', priority: 'low' | 'medium' | 'high' })`
- `updateTicketStatus(input: { ticketId: string, status: 'open' | 'in_progress' | 'resolved' })`

### Campaigns Actions
- `createCampaign(input: { title: string, goal_description: string })`
- `updateCampaignStatus(input: { campaignId: string, status: 'draft' | 'active' | 'completed' })`
