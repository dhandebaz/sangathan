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

## 2026-06-21T01:24:34Z

# Teamwork Project Prompt — Draft

> Status: Launched
> Goal: Craft prompt → get user approval → delegate to teamwork_preview

Redesign the features page (`src/app/[lang]/(site)/features/page.tsx`) to make it highly interactive and visually appealing using a click-driven exploration approach, while preserving all existing information and matching the current design theme. 

Working directory: c:\Users\hudav\Documents\trae_projects\sangathan
Integrity mode: demo

## Requirements

### R1. Interactive Features Presentation
Build a click-driven interactive experience to present the features, rather than a long scrolling static list. The presentation should organize information intuitively (e.g., interactive tabs for each organization type like NGOs, Student Unions, Workers Unions, RWAs) and use interactive elements (like expandable cards or "click to reveal" mechanics) to display individual feature details.

### R2. Responsive and Themed Design
Ensure the new layout is fully responsive, looking great on both mobile and desktop screens. It must strictly adhere to the existing design system and Tailwind CSS theme of the Sangathan application, without introducing conflicting visual styles. 

### R3. Playwright Verification
Write a Playwright test to verify the interactive elements of the redesigned features page. The test must programmatically click through the interactive components to ensure they function as expected.

## Acceptance Criteria

### Interaction and Layout
- [ ] Playwright test successfully clicks an organization category tab and verifies the relevant features for that category are displayed.
- [ ] Playwright test successfully interacts with a feature item (e.g., clicks to expand) and verifies the detailed information is revealed.
- [ ] The page renders without React hydration errors or browser console warnings.
- [ ] The design uses existing Tailwind CSS utility classes and maintains visual consistency with the rest of the application.
