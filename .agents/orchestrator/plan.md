# Plan - Sangathan Feature Completion and Polish

## 1. Objectives
- Implement remaining specialized features for NGOs, Student Unions, Workers Unions, and RWAs.
- Polish frontend (error handling, loading states, form validation).
- Remove all mock data and development bypasses.
- Ensure proper RLS policies and capabilities-based middleware checks are enforced.
- Write a programmatic verification script (`verify_features.js`) verifying Supabase persistence.
- Ensure `npm run build` completes with 0 type errors.

## 2. Approach
- **Decompose**: We will delegate exploration to an Explorer agent to map out existing mock data, files, and database schemas.
- **Milestones**: Based on the Explorer's findings, we will decompose the work into specific milestones for:
  - NGO / Donations features
  - Student Union / Student IDs features
  - Workers Union / Grievances & Campaigns features
  - RWA / Maintenance & Complaints features
  - Security, bypass removal, and frontend polish
  - E2E Testing Track (dual track: building the E2E verification suite)
- **Execution**: Run Explorer -> Worker -> Reviewer -> Challenger -> Auditor iteration loops for the milestones.

## 3. Immediate Next Steps
1. Spawn an Explorer agent to scan the codebase for mock data, bypasses, schema details, and specialized features.
2. Formulate the official `PROJECT.md` scope document.
3. Define the milestones and start execution.
