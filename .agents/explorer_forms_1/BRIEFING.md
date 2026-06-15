# BRIEFING — 2026-06-15T11:45:00+05:30

## Mission
Explore the Sangathan database schema and design a forms + submissions schema.

## 🔒 My Identity
- Archetype: explorer
- Roles: Read-only investigator, analyzer
- Working directory: c:\Users\hudav\Documents\trae_projects\sangathan\.agents\explorer_forms_1
- Original parent: 87ad626f-854b-4367-8c5c-e9f88492ee17
- Milestone: Explorer Forms Schema

## 🔒 Key Constraints
- Read-only investigation — do NOT implement
- CODE_ONLY network mode: No external access, no curl/wget to external services

## Current Parent
- Conversation ID: 87ad626f-854b-4367-8c5c-e9f88492ee17
- Updated: 2026-06-15T11:45:00+05:30

## Investigation State
- **Explored paths**:
  - `supabase/schema.sql` (baseline schema definitions)
  - `supabase/migrations/` (history of schema upgrades and policies)
  - `src/types/forms.ts` (Zod schemas for form fields)
  - `src/actions/forms/actions.ts` (Server actions for forms CRUD and submissions)
  - `src/app/(public)/f/[formId]/page.tsx` (Public form details display page)
  - `src/components/forms/public-form.tsx` (Public form client-side component)
  - `src/app/[lang]/dashboard/forms/page.tsx` (Forms dashboard list)
  - `src/app/[lang]/dashboard/forms/[id]/page.tsx` (Forms dashboard submissions view)
- **Key findings**:
  - Existing database schema contains baseline definitions for `organisations`, `profiles`, `members`, `forms`, and `form_submissions`.
  - Migrations append columns such as `membership_policy`, `org_type`, and `capabilities` to `organisations`, and add columns like `status` and `phone` to `profiles`.
  - There are critical inconsistencies in the existing database schema vs application code:
    1. Inconsistency in datetime columns: `schema.sql` defines `form_submissions.submitted_at` but migrations and code use `form_submissions.created_at`.
    2. Missing columns: `actions.ts` attempts to insert `user_id` into `form_submissions`, but the baseline schema is missing `user_id`.
    3. RLS Bypassing: The current `forms` SELECT policy restricts visibility to authenticated organisation members. As a workaround, the Next.js server code uses the high-privilege Service Client (`createServiceClient()`) to query the form details for public users, bypassing RLS entirely.
    4. Overly Permissive Insertion: The current `form_submissions` INSERT policy allows anyone to insert entries without verifying if the target form is active, public, or exists.
- **Unexplored areas**: None.

## Key Decisions Made
- Suggested a comprehensive schema refactoring that introduces a `visibility` column (`public`, `members`, `private`) on `forms` and a `user_id` column on `form_submissions`.
- Created robust RLS policies matching form visibility levels for both tables.
- Standardized timestamps on `created_at` for form submissions to resolve indexing inconsistencies.

## Artifact Index
- c:\Users\hudav\Documents\trae_projects\sangathan\.agents\explorer_forms_1\analysis.md — Main findings and schema design proposals.
