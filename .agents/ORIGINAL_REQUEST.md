# Original User Request

## 2026-06-14T22:15:27Z

# Teamwork Project Prompt — Draft

> Status: Launched
> Goal: Craft prompt → get user approval → delegate to teamwork_preview

Build out the remaining specialized features for NGOs, Student Unions, Workers Unions, and RWAs in the Sangathan app. Polish the frontend, remove all mock data/bypasses, and ensure every flow relies on real database persistence and functional implementations.

Working directory: c:\Users\hudav\Documents\trae_projects\sangathan
Integrity mode: demo

## Requirements

### R1. Feature Completion for All Org Types
Ensure all modules (Campaigns, Volunteers, Grievances, Complaints, Maintenance, Student IDs, Donations) have fully functional end-to-end flows. Users must be able to create, read, update, and delete (CRUD) records securely using real data connected to Supabase, with absolutely no mocked constants.

### R2. Frontend Polish
Enhance the user interface across the dashboard for the new pages. Ensure error handling, loading states, and form validations are robust and visually consistent with the existing layout system.

### R3. Security and Bypass Removal
Remove any existing development bypasses or hardcoded data flows in the newly built sections. Ensure all actions enforce Row Level Security (RLS) policies and capabilities-based middleware checks.

## Acceptance Criteria

### Programmatic Verification
- [ ] A testing script (e.g., `verify_features.js` or via Jest if configured) must be written and executed.
- [ ] The script must programmatically insert records into `tickets` and `campaigns` tables, verifying that data persists to the actual Supabase database.
- [ ] The script must pass successfully, proving that no fake data or bypasses are used in the core data pathways.
- [ ] `npm run build` must complete successfully with 0 type errors after all frontend code is polished.

## 2026-06-15T06:01:42Z

# Teamwork Project Prompt — Draft

> Status: Launched
> Goal: Craft prompt → get user approval → delegate to teamwork_preview

Implement a Dynamic Form Builder and Public Survey system that allows organizations to create custom data collection forms and securely receive submissions from the public or members.

Working directory: c:\Users\hudav\Documents\trae_projects\sangathan

Integrity mode: demo

## Requirements

### R1. Advanced Form Builder Interface
The dashboard must include a visual form builder allowing organization admins to construct forms with complex fields (text, file uploads, date pickers) and define conditional logic.

### R2. Configurable Form Access & Submissions
The system must allow forms to be configured as either fully public or restricted to logged-in members. It must provide a secure URL for users to submit data and a dashboard view for admins to review submissions.

### R3. Data Integrity & Storage
All form definitions and submissions must persist securely to the database with appropriate Row Level Security enforcing the public vs private access controls.

## Acceptance Criteria

### Programmatic Verification
- [ ] A verification script (`verify_forms.js`) must be written and executed successfully.
- [ ] The script must programmatically create a form definition with multiple field types and conditional logic.
- [ ] The script must test access controls by attempting to submit data to a private form without auth (which must fail) and with auth (which must succeed).
- [ ] The script must verify that the submitted data accurately persists to the database.

### Build Verification
- [ ] `npm run build` must complete with zero errors.
- [ ] TypeScript compiler (`npx tsc --noEmit`) must complete with zero errors.
