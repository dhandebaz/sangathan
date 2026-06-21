# Handoff Report — Features Page Analysis & Redesign Plan

## 1. Observation

- **Features Page File**: Located at `src/app/[lang]/(site)/features/page.tsx`. It contains 238 lines of code. It is an async Server Component page defined as:
  ```typescript
  export default async function FeaturesPage({ params }: { params: Promise<{ lang: string }> })
  ```
  And includes a data-driven static array `orgs` that maps four categories:
  - `ngo` (Non-Governmental Organisations / गैर सरकारी संगठन (NGO))
  - `student-union` (Student Unions / छात्र संघ)
  - `worker-union` (Workers Unions / श्रमिक संघ)
  - `rwa` (Resident Welfare Associations / रेजिडेंट वेलफेयर एसोसिएशन)
  Each category contains exactly 14 items inside its `features` array.
- **Site Layout Integration**: Located at `src/app/[lang]/(site)/layout.tsx`. It wraps all site pages inside `<Navbar lang={lang} isAuthenticated={Boolean(user)} />`, a `<main id="main-content" className="flex-grow pt-24" tabIndex={-1}>`, and a `<Footer lang={lang} />`. It also includes a fixed background mesh gradient/dot pattern overlay.
- **Playwright Configuration**: File `playwright.config.ts` specifies the test directory under `./tests/e2e` with a baseURL of `http://localhost:3000`.
- **E2E Test Directory**: Found `tests/e2e/auth.spec.ts` which imports `test, expect` from `@playwright/test` and runs assertions on `page.goto()`, `.toBeVisible()`, and page titles.

---

## 2. Logic Chain

- **Premise 1**: The current features page lists 4 categories sequentially with 14 feature cards each. This totals 56 feature cards rendering simultaneously on a single long scrolling page, creating scroll fatigue and high cognitive load.
- **Premise 2**: A client-side state (`useState`) can manage active category tabs (NGO, Student Union, Workers Union, RWA) and "click-to-reveal" selected features.
- **Premise 3**: Initializing the React state to a default static category (e.g., `'ngo'`) prevents differences between the server-rendered HTML and client-rendered initial state, eliminating Next.js hydration warnings.
- **Premise 4**: Performing anchor routing checks (reading URL hash values like `#student-union`) inside `useEffect` ensures that client-only APIs (like `window.location.hash`) are not executed during server rendering, preventing hydration mismatches.
- **Premise 5**: Storing custom styling parameters in a predefined lookup table of Tailwind CSS classes (like `orgStyles` mapping `text`, `bg`, `border`, `glow`, etc.) prevents the mixing of inline style attributes (`style={{ ... }}`) with Tailwind utility classes.
- **Premise 6**: E2E testing using Playwright under `tests/e2e/features.spec.ts` can verify the correct loading of active tab elements, user-click switching, deep linking via URL hash values, and bilingual Hindi/English switching.

---

## 3. Caveats

- **External Route Search Params**: If the redesign later utilizes route search queries (e.g., `?category=rwa`) instead of client-state/hash, the component must be wrapped in a Next.js `<Suspense>` boundary to prevent hydration warnings or static generation de-optimization during production builds.
- **CSS Transitions**: Performance of the click-to-reveal transitions (e.g. height expansions) was not benchmarked on mobile viewports.
- **Verification of Supabase Authentication in layout.tsx**: It is assumed that the `layout.tsx` file executes `supabase.auth.getUser()` correctly for all user requests, and the redesign of the features page will not interfere with this session state check.

---

## 4. Conclusion

- The features page (`src/app/[lang]/(site)/features/page.tsx`) can be refactored to support interactive tab navigation and click-to-reveal details without sacrificing SEO/metadata generation or causing Next.js hydration warnings.
- The redesign should delegate the interactive sections to a Client Component (`src/components/features/interactive-features.tsx`) while keeping the main page component as a Server Component for dynamic metadata.
- Custom colors should be statically mapped to Tailwind CSS configuration classes to prevent styling conflicts.
- A new Playwright test spec can be safely added under `tests/e2e/features.spec.ts` using standard Playwright testing conventions in the project.

---

## 5. Verification Method

To independently verify the features page layout, structure, and proposed test integration:
1. **Source Code Inspection**:
   - Inspect the features page at `src/app/[lang]/(site)/features/page.tsx` and confirm the existence and exact wording of the 14 features in each category.
   - Inspect the site layout at `src/app/[lang]/(site)/layout.tsx` to confirm main container styles and navbar/footer imports.
2. **Playwright Config Inspection**:
   - Inspect `playwright.config.ts` to confirm target folders and baseURL.
3. **E2E Test Execution (Post-implementation)**:
   - Run the E2E tests using Playwright command:
     `npx playwright test`
   - Run specific tests under the E2E features spec using:
     `npx playwright test tests/e2e/features.spec.ts`
