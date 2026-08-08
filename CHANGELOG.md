# Changelog

All notable changes to the Sangathan project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
