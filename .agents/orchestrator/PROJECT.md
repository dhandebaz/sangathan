# Project: Dynamic Form Builder and Public Survey System

## Architecture
- **Tenant Isolation**: Forms and submissions must link to `organisation_id` or `profile_id` and enforce RLS policies based on auth user and organisation roles.
- **Form Schema & Submissions**:
  - `forms` table: `id`, `organisation_id`, `title`, `description`, `fields` (JSONB representing fields like type, label, choices, required, conditional logic rules), `is_active` (boolean), `visibility` (text check in `'public', 'members', 'private'`), `created_by` (uuid), `created_at` (timestamptz), `updated_at` (timestamptz), `deleted_at` (timestamptz).
  - `form_submissions` table: `id`, `organisation_id`, `form_id`, `user_id` (uuid references auth.users), `data` (JSONB of answers), `created_at` (timestamptz).
- **Public & Private Access controls**:
  - Public forms: Allow anonymous reading and anonymous insertion.
  - Member forms: Require authenticated session, check if member of the organisation.
  - Private forms: Require organisation staff (Admins, Editors, Executives) role.
  - Viewing submissions: Admin / Editor / Executive role of organization only.

## Code Layout
- **Dashboard Navigation Layout**: `src/app/[lang]/dashboard/layout.tsx` (links sidebar for admins)
- **Mobile Action Button**: `src/components/mobile/contextual-fab.tsx` (exposes create forms button)
- **Form Builder UI**: `src/app/[lang]/dashboard/forms/new/page.tsx` (visual builder interface for admins)
- **Submissions Detail UI**: `src/app/[lang]/dashboard/forms/[id]/page.tsx` (review list of submissions, CSV export)
- **Forms List UI**: `src/app/[lang]/dashboard/forms/page.tsx` (admin list of custom forms)
- **Public Form Render Page**: `src/app/(public)/f/[formId]/page.tsx` (public answering page with CSRF/honeypot)
- **Server Actions**: `src/actions/forms/actions.ts` (actions for CRUD and submissions)
- **Database Migrations**: `supabase/migrations/`
- **Types**: `src/types/dashboard.ts` and `src/types/database.ts`

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | DB Schema & RLS Policies | Create SQL migration to add `visibility` and `deleted_at` to `forms`, and `user_id` and rename `submitted_at` to `created_at` in `form_submissions`. Recreate RLS policies for granular access. | None | PLANNED |
| 2 | Admin Navigation & Gating | Integrate forms into dashboard sidebar navigation (`layout.tsx`) and mobile FAB (`contextual-fab.tsx`). Implement server-side role gating on admin forms page routes. | M1 | PLANNED |
| 3 | Access Controls & Submissions | Update builder page (`new/page.tsx`) to support choosing visibility. Update public page (`f/[formId]/page.tsx`) to enforce visibility checks on standard client. Update server action `submitFormResponse` to record authenticated submitter `user_id` and respect visibility constraints. | M2 | PLANNED |
| 4 | Verification & Build Validation | Write programmatic E2E testing script `scripts/verify_forms.js`. Validate types via `npx tsc --noEmit` and build project using `npm run build`. | M3 | PLANNED |

## Interface Contracts
### Forms Actions (`src/actions/forms/actions.ts`)
- `createForm(input: { title: string, description?: string, visibility: 'public' | 'members' | 'private', fields: FormField[] })`
- `updateForm(input: { formId: string, title?: string, description?: string, visibility?: 'public' | 'members' | 'private', fields?: FormField[] })`
- `submitFormResponse(input: { formId: string, data: Record<string, any>, honeypot?: string, csrfToken?: string })`
