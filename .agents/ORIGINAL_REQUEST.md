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
