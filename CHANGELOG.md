# Changelog

All notable changes to the Sangathan project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.66.0] - 2026-09-24
### Added
- **Razorpay Subscriptions Engine**: Quantity-based metered billing (`lib/billing/subscriptions.ts`) — one ₹11/monthly plan, quantity = billable actives. `POST /api/billing/subscribe` (org-admin only, billable ≥ 1 enforced), status/pause/resume/cancel endpoint, `SubscribeButton` with mandate checkout + activation polling wired into the billing UI. HMAC-verified `POST /api/webhooks/razorpay` handles authenticated/charged/halted/paused/resumed/cancelled/failed (built-in dunning via provider retries; 30-day past-due soft-reverts to Community, data intact).
- **Monthly Meter Cron + Auto-Downgrade**: `GET /api/cron/meter-billing` counts 60-day-login actives via Auth API, syncs subscription quantity, emails admins, auto-downgrades to Community at zero billable, archives nothing (separate action).
- **GST Invoices**: Derived from `billing_transactions` + org (SAC 9983, CGST/SGST vs IGST by buyer state, `SANG-YYYY-XXXXXXXX` numbers), printable page at dashboard billing invoices, linked from the transactions table. Seller block via `BILLING_*` env (GSTIN awaited from CA).
- **Dormant Archive Flow**: `archiveDormantMembers` (90d, self-safe, audited) + billing dashboard button.
- **Plugins Framework + Canva + Gallery**: Minimal-scope OAuth registry, AES-256-GCM token envelopes (fail-closed key), capabilities-backed store with audit, PKCE connect/callback routes, meter-gated, disconnect purge, dashboard `/integrations` gallery + sidebar link, daily token-refresh cron with error surfacing.
### Changed
- **Zero-DDL Delivery**: Supabase Management API token lost privileges (403), so Phase 2/3 run on capabilities JSON + Auth API + derived invoices — no migration needed, no functionality lost. Dedicated tables deferred.
> Note: v1.26.0 → v1.65.0 history is tracked in the in-app changelog (`src/app/[lang]/(site)/changelog/page.tsx`), which is the canonical source.

## [1.65.0] - 2026-09-24
### Changed
- **Pricing v1.0 Locked (₹0 / ₹11 / ₹999)**: Monthly-only metered billing — free up to 5 member profiles (admin included), then (active members − 5) × ₹11/month counted month-end (active = login within 60 days). No base fee, no slabs, no annual, no trial (free tier is the trial). Whitelabel is a ₹999 one-time lifetime purchase on both tiers. Paid event ticketing retired (orgs collect on their own UPI ID). Sustainer/annual/White-label-plan language removed across pricing page, plan selector, billing dashboard, refund policy, solutions/comparisons data, features, JSON-LD, llms.txt/llms-full.txt; legacy Sustainer orgs grandfathered (₹1,000 + 500 while subscribed).
### Added
- **Free Environmental Survey Templates**: 4 ready templates (air quality log, water TDS log, garbage dump report, tree census) in `lib/forms/templates.ts`, visible to every org type. Survey caps codified (free 3 active + 500 responses/mo; metered 50 + 50k/mo). AI suite verified gated to paying tiers (`Metered` added to `nvidia.ts` checks + admin billing capabilities).
> Note: v1.26.0 → v1.64.0 history is tracked in the in-app changelog (`src/app/[lang]/(site)/changelog/page.tsx`), which is the canonical source.

## [1.64.0] - 2026-09-24
### Added
- **52-Guide SEO Library (`/guides/[slug]`)**: 52 English how-to guides (~46,000 words) across 6 categories — NGO registration, compliance & filings, donations & fundraising, governance & operations, RTI & civic action, collectives & movements. Every article carries key takeaways, TOC anchors, figures/tables, 4-6 FAQs, Article + FAQ + Breadcrumb JSON-LD, OG/Twitter cards via the new `guide` OG theme, and canonical URLs. Content validated by `tests/seo-articles.test.ts` (lengths, structure, banned-claim scan).
- **Admin SEO Posts Registry (`/admin/seo-posts`)**: Internal table of all guides with word counts, reading time, FAQ counts, view + copy-link actions. Guides are sitemap-listed and cross-linked via related-article cards but intentionally absent from all public navigation (`/admin/*` is robots-disallowed).
- **AI-Search Wiring**: Guides index appended to `llms.txt` and full per-guide summaries to `llms-full.txt`; robots already allow AI crawlers (GPTBot, ClaudeBot, PerplexityBot, etc.).
> Note: v1.26.0 → v1.63.0 history is tracked in the in-app changelog (`src/app/[lang]/(site)/changelog/page.tsx`), which is the canonical source.

## [1.63.0] - 2026-09-24
### Removed
- **Retired Union-Only Dashboard Modules**: Deleted the orphaned, unlinked `posts` (Union Posts registry), `legal-aid` (Anti-Ragging Cell), `induction` (induction desk) and `collaboration` (alliance hub) routes, components, and their dedicated server actions, plus the now-unused `lib/posts`, `types/posts`, default-union-posts seed, dead institution reference data (`lib/institutions`, `types/institutions`, `indian-institutions.json`) and the unused regional union-terms dictionary (`lib/i18n/regional`). Shared `actions/collaboration` (used by events, settings, and the public org profile) is kept.
### Changed
- **Letterhead Uses Your Organisation's Name & Logo**: The letterhead studio now loads the signed-up organisation's own `name` and `logo_url`, renders the logo (or name initials) on the printed sheet, and exposes editable heading, tagline, and logo-URL fields. Removed "Union" wording, the student-union fallback name, and the "Recognized" tagline claim.
- **Neutral Copy in Reachable UI**: Admin-hub Hindi letterhead card no longer mentions the university registrar; calendar location placeholder is now "Community Hall / Online"; petition, emergency-SOS, broadcast, admin-billing, and OG-image copy de-unionized.
> Note: v1.26.0 → v1.62.0 history is tracked in the in-app changelog (`src/app/[lang]/(site)/changelog/page.tsx`), which is the canonical source.

## [1.62.0] - 2026-09-24
### Added
- **Honest 80G/12A Receipt Wording**: Marketing, FAQ and policy pages now describe receipts as "*80G/12A-ready*" and only as 80G receipts when the organisation holds its own registration. Removed the US 501c3 label and "auto/instant/compliant" overclaims across `features`, `ngo-management`, `solutions-data`, `focus-blueprints`, `comparisons-data`, `privacy`, `press`, `refund-policy`, and `llms-full.txt`.
- **Working Donation Receipt Page**: Generated donation receipts now resolve to a real, print-ready page at `/api/tax-receipts/[orgId]/[number].pdf` instead of a broken placeholder URL. The page states the 80G/12A-ready disclaimer.
### Changed
- **Two-Type Model Enforced End-to-End**: Student Union, Workers Union and RWA modes retired at the database level (org_type CHECK constraint via `20260922000000_remove_discontinued_org_types.sql`), in RPC functions, compliance seeders, code, tests, and public copy. Only `civic_collective` and `ngo` (plus legacy `other`) remain.
- **Legal Statutory Fields Cleanup**: Removed the retired `trade_union_registration` reference from `legal-entity-types.ts`, the legal API route, and the statutory-registration action.
> Note: v1.26.0 → v1.61.0 history is tracked in the in-app changelog (`src/app/[lang]/(site)/changelog/page.tsx`), which is the canonical source.

## [1.25.0] - 2026-08-09
### Added
- **Public Org Portal Polish & Events Feed**: Enhanced the public organization landing page (`/org/[slug]`) with upcoming public events feeds, direct RSVP integration, localized Hindi translations, and streamlined membership applications.
- **Features Page Accuracy Audit**: Conducted a comprehensive verification audit of every feature listed on the Features page across all organization types (NGO, Student Union, Workers Union, RWA). Confirmed that all claimed dashboard modules map directly to implemented routes under `src/app/[lang]/dashboard/`.
- **Network Directory Page**: Created the `/network` index page to list all public networks with direct links to detail profiles.
### Changed
- **Mobile Navigation Polish**: Updated mobile navigation tabs with dynamic language prefixing (`/${lang}/...`) and haptic feedback triggers for responsive mobile app feel.
- Updated landing page "What's New" section to reflect v1.25.0 features.
- Expanded `src/app/sitemap.ts` with missing bilingual (/en and /hi) routes for Features, About, Changelog, Network, and Status.
- Synced version references in `.cursor/active-context.md` and `PROJECT_STATUS.md` to v1.25.0.

## [1.20.0] - 2026-08-09
### Added
- **India-Targeted SEO Infrastructure**: Expanded `sitemap.ts` to 30+ routes with hreflang alternates (`en`/`hi`), updated `robots.ts` for `https://sangathan.space`, added `json-ld.tsx` server components (Organization, WebSite, SoftwareApplication, Breadcrumb, FAQ), and injected 30+ India-specific keywords into site layout metadata.
- **Frontend & Landing Page Enhancements**: Added 3 new sections to `src/app/[lang]/(site)/page.tsx` ("Who Uses Sangathan", "Built for India", "What's New") with full Hindi translations (`isHindi`).
- **Standardized UI Pages**: Standardized `security/page.tsx` using `PageHeader` and Tailwind CSS utilities. Enhanced `pricing/page.tsx`, `about/page.tsx`, `contact/page.tsx` with JSON-LD, breadcrumbs, and `PageHeader`.
- **Navigation & Footer Updates**: Added links for About, Changelog, Roadmap, Status, Network, Community Guidelines, and Refund Policy.
- **Dynamic Icons**: Added missing Lucide icon mappings and dynamic feature counter to `interactive-features.tsx`.

### Added
- **Feature Gap Analysis**: Conducted a thorough feature gap analysis for the 4 organization types (NGOs, Unions, RWAs/Housing Societies, Student Groups).
- **CBA & Grants Management**: Added database tables and dashboard UI for Unions to manage Collective Bargaining Agreements, and for NGOs to track grant proposals and compliance deadlines directly from their dashboards.
- **RWA Visitor Management**: Added schema and interfaces for Resident Welfare Associations to manage and log visitor entries.
- **Dynamic Dashboard Architecture**: Refactored the dashboard sidebar to intelligently display modules and links tailored specifically to the organization's type (e.g. Grants only for NGOs, CBA only for Unions, Visitors only for RWAs).
- **Public Navigation Overhaul**: Added `?tab=signup` logic to the centralized `/[lang]/login` authentication page to handle both sign-in and sign-up flows seamlessly. Updated the primary navigation bar and homepage CTAs to properly point to the correct authentication routes.
- **Site Layout Fixes**: Wrapped the authentication page with `<Suspense>` boundaries to securely support Next.js `useSearchParams()` behavior without breaking static build rendering.

### Changed
- Refined the "Create Organisation" CTA to ensure a streamlined onboarding experience.
- Cleaned up the public-facing landing page layout.

### Fixed
- Fixed the Sign Up and Login buttons on the primary navigation bar which were routing to a non-existent standalone `/signup` page.
