# Plan - Dynamic Form Builder and Public Survey System

## 1. Objectives
- Implement a Dynamic Form Builder and Public Survey system.
- Build visual builder interface for organization admins in the dashboard with support for text, file uploads, date pickers, and conditional logic.
- Support both public and member-only forms with secure URLs.
- Provide a dashboard view for admins to view/review submissions.
- Persist forms and submissions to database with appropriate RLS.
- Write and execute programmatic verification script `verify_forms.js` verifying access controls and database persistence.
- Complete Next.js build with 0 TypeScript/compilation errors.

## 2. Approach & Architecture
We will use the **Project Pattern**:
- **Phase 1: Exploration**:
  - Spawn an Explorer agent to analyze the current codebase: directory layout, Supabase schema (existing tables), middleware, auth setup, and where to integrate the dashboard views and public survey routes.
- **Phase 2: Database Schema & RLS Policies (Milestone 1)**:
  - Define schema for `forms` (including configuration/schema JSON with conditional logic rules) and `form_submissions` (with data JSON and metadata).
  - Add RLS policies: public submissions should be insertable anonymously or via logged-in users depending on access config; reading submissions is restricted to org admins.
- **Phase 3: Form Builder Interface & Admin Dash (Milestone 2)**:
  - Build server actions/API endpoints to create, update, delete, and fetch forms.
  - Implement form builder component with fields: text, date picker, file upload, conditional logic editor.
- **Phase 4: Public Survey & Submission system (Milestone 3)**:
  - Implement public survey page (e.g. `/survey/[formId]` or `/forms/[formId]`) that loads the form schema dynamically, handles conditional logic client-side, allows file uploads (persisted to Supabase storage if necessary), and handles submission.
  - Support member-only access verification (redirect/auth check).
- **Phase 5: Programmatic Verification & Audit (Milestone 4)**:
  - Create and run `verify_forms.js`.
  - Validate TypeScript compilation (`npx tsc --noEmit`) and project build (`npm run build`).
  - Run the Forensic Integrity Auditor to verify no hardcoded responses or bypasses are used.

## 3. Team Roster & Dispatch
- `explorer_forms`: Codebase analysis and DB recommendations.
- `worker_m1`: Implement DB schema migrations and RLS policies.
- `worker_m2`: Implement server actions and admin UI components.
- `worker_m3`: Implement public submission page and access controls.
- `worker_m4`: Write verification script and run builds.
- `auditor_forms`: Forensic integrity audit.
