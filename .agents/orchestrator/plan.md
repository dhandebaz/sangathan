# Plan - Features Page Interactive Redesign

## 1. Objectives
- Redesign the features page (`src/app/[lang]/(site)/features/page.tsx`) to be highly interactive using tabs for organization types and click-to-reveal / split-pane exploration mechanics.
- Preserve 100% of the bilingual page text, descriptions, features, and meta information (including English and Hindi translations).
- Ensure styling conforms to the existing design system and Tailwind CSS theme of Sangathan (crisp, light, geometric technical designs; no Tailwind/inline styles mixing; avoid dark cards and small uppercase pill badges).
- Write a Playwright E2E test suite under `tests/e2e/features.spec.ts` verifying tab clicking, feature detail click expansion, deep linking via URL hash values, and bilingual English/Hindi rendering.
- Verify that there are no React hydration errors or Next.js build compilation errors.

## 2. Approach & Architecture
We will use the **Project Pattern**:
- **Phase 1: Exploration**:
  - Spawned `explorer_exploration_1` to analyze the features page layout, structure, translation setup, and Playwright configuration. (Completed)
- **Phase 2: Component Development (Milestone 1)**:
  - Create the interactive client component `src/components/features/interactive-features.tsx` supporting tabs navigation, feature lists, details panels, responsive accordion mode for mobile, and pure Tailwind styling mapping.
- **Phase 3: Integration (Milestone 2)**:
  - Modify `src/app/[lang]/(site)/features/page.tsx` to remain a Server Component, load routing parameters, and pass data down to the client component.
- **Phase 4: Playwright Test Implementation (Milestone 3)**:
  - Add `tests/e2e/features.spec.ts` asserting features page E2E functionality.
- **Phase 5: Verification & Audit (Milestone 4)**:
  - Run TypeScript compiler checks and Next.js build production compile.
  - Run Playwright test suite to confirm E2E success.
  - Run Forensic Integrity Audit to ensure zero cheating/hardcoding.

## 3. Team Roster & Dispatch
- `explorer_exploration_1`: Codebase and features page analysis. (Completed)
- `worker_redesign_1`: Implement the interactive features component and integrate it with the page.
- `worker_test_1`: Implement Playwright E2E tests.
- `reviewer_review_1`: Review the correctness, code quality, and styling guidelines.
- `auditor_features`: Perform forensic integrity audit verification.
