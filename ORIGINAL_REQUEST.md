# Original User Request

## Initial Request — 2026-06-21T07:17:37+05:30

# Teamwork Project Prompt — Draft

Audit all features across different organization types to ensure they are fully functional based on the documented features matrix, and fix all dashboards which are currently stuck in an infinite loading state.

Working directory: c:\Users\hudav\Documents\trae_projects\sangathan
Integrity mode: demo

## Requirements

### R1. Dashboard Fixes
Investigate and resolve the infinite loading issue affecting all dashboards (global and organization-specific). The fix must ensure data fetches correctly and the UI successfully transitions from a loading state to a ready state.

### R2. Feature Audit & Implementation
Read the feature definitions (e.g., `src/app/[lang]/(site)/features/page.tsx` or related constants files) to understand the expected features for each organization type. Audit the codebase to verify implementation. If any features are missing or broken for a specific organization type, build or repair them so the application perfectly matches the advertised feature set.

## Acceptance Criteria

### Dashboard Loading
- [ ] Dashboards render their primary content within an acceptable timeframe (no infinite spinners).
- [ ] No unhandled promise rejections or infinite `useEffect` loops related to data fetching on the dashboards.

### Feature Completeness
- [ ] An automated test script, Playwright test, or a verifiable agent-generated report confirms that every feature listed for each organization type is accessible and functioning.
- [ ] The application throws no 404s or 500s when accessing the expected feature routes for any defined organization type.
