# Project: Features Page Interactive Redesign

## Architecture
- **Server Component Wrapper**: Keep `src/app/[lang]/(site)/features/page.tsx` as a Server Component to preserve dynamic SEO metadata generation and bilingual route parameter parsing.
- **Client Component Integration**: Extract the interactive feature exploration layout into a client component `src/components/features/interactive-features.tsx`.
- **Pure Tailwind Styling Map**: Map active tab states, category text colors, borders, and ambient glow styles to a structured typescript configuration dictionary of pure Tailwind CSS class names (avoiding dynamic style strings or inline styling).
- **Zero Hydration Mismatch**: Initialize default active category to `'ngo'` and perform dynamic hash/anchor checks (like `#student-union`) inside `useEffect` on the client. Wrap route search parameter checks (if any) in Next.js `<Suspense>` boundaries.
- **No forbidden design patterns**: Avoid dark 'square blob' CTA blocks, rounded AI-looking dark cards, and AI-like uppercase pill badges/tags above headings.

## Code Layout
- **Page Container (Server)**: `src/app/[lang]/(site)/features/page.tsx`
- **Interactive Component (Client)**: `src/components/features/interactive-features.tsx`
- **Playwright Test Spec**: `tests/e2e/features.spec.ts`

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Create Interactive Component | Develop `src/components/features/interactive-features.tsx` client component supporting tabs and click-to-reveal details. | None | PLANNED |
| 2 | Integrate Page and Component | Refactor `src/app/[lang]/(site)/features/page.tsx` to keep Server Component routing/metadata and mount the new client component with translated data. | M1 | PLANNED |
| 3 | E2E Testing with Playwright | Write Playwright test `tests/e2e/features.spec.ts` testing tabs switching, feature detail click expansion, deep links via hashes, and bilingual titles. | M2 | PLANNED |
| 4 | Verification & Audit | Validate Next.js compile build (`npm run build`), tsc check (`npx tsc --noEmit`), run Playwright tests, and run Forensic Integrity Audit. | M3 | PLANNED |

## Interface Contracts
### InteractiveFeatures Props
```typescript
interface InteractiveFeaturesProps {
  orgs: {
    id: string;
    title: string;
    icon: any;
    color: string;
    description: string;
    features: {
      icon: any;
      title: string;
      desc: string;
    }[];
  }[];
  isHindi: boolean;
  lang: string;
}
```
