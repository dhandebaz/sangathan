# Sangathan Architecture Documentation

## System Overview

Sangathan is a civic infrastructure platform built for Indian grassroots organizers, NGOs, and collectives. It provides purpose-built digital tools for organizing, compliance, fundraising, and transparency.

### Core Philosophy

- **No fake data** - All metrics, goals, and counts come from real database records
- **Crisp, light, geometric design** - Canva × Figma aesthetic with `rounded-sm` radius system
- **Bilingual first** - Hindi and English throughout
- **Offline-first PWA** - Field tools work without connectivity
- **Zero vendor lock-in** - Data portability and sovereignty built-in

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 (CSS variables, geometric tokens) |
| Database | PostgreSQL (Supabase) |
| Auth | Supabase Auth (JWT + cookies) |
| Realtime | Supabase Realtime + Redis |
| Caching | Redis (Upstash) |
| Payments | Razorpay (UPI Autopay) |
| Email | Cloudflare Email Routing |
| Hosting | Cloudflare Workers / Vercel |

---

## Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [lang]/            # i18n routes (en, hi)
│   │   ├── (site)/        # Public marketing pages
│   │   │   ├── about/
│   │   │   ├── compare/
│   │   │   ├── features/
│   │   │   ├── solutions/
│   │   │   ├── transparency/
│   │   │   ├── verify/
│   │   │   └── ...
│   │   ├── (public)/      # Public org microsites
│   │   │   └── org/[slug]/
│   │   │       ├── petitions/
│   │   │       └── transparency/
│   │   ├── (auth)/        # Auth pages
│   │   └── dashboard/     # Protected dashboard
│   └── api/               # API routes
│       ├── billing/
│       ├── webhooks/
│       └── v1/
├── components/
│   ├── public/            # Public site components (Navbar, Footer, PageHeader, etc.)
│   ├── dashboard/         # Dashboard components
│   ├── ui/                # Base UI primitives (Button, Card, Skeleton, etc.)
│   ├── org/               # Org-specific components
│   └── ...
├── lib/                   # Shared libraries
│   ├── supabase/         # Supabase clients & middleware
│   ├── auth/             # Auth utilities
│   ├── i18n/             # i18n config
│   ├── billing/          # Razorpay integration
│   ├── forms/            # Form engines
│   └── ...
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript types
└── scripts/              # Build/generation scripts
```

---

## Key Architectural Decisions

### 1. Radius System (`rounded-sm` everywhere)
- **Decision**: Single `rounded-sm` radius for all cards, buttons, inputs
- **Rationale**: Geometric consistency, no `rounded-xl/2xl/3xl` mix
- **Impact**: Visual cohesion across public + dashboard

### 2. No Fake Data Policy
- **Decision**: Zero fallbacks for metrics (`|| 500`, `|| 96`, etc.)
- **Implementation**: Nullable fields, conditional rendering, "—" for missing
- **Files**: `Petition.signature_goal: number | null`, transparency computed metrics

### 3. i18n Middleware
- **Location**: `src/lib/supabase/middleware.ts`
- **Behavior**: Locale detection → redirect → auth guard → capability check
- **Locales**: `en` (default), `hi`

### 4. Public vs Dashboard Separation
- `(site)/` - Marketing pages, static generation
- `(public)/org/[slug]/` - Org microsites, dynamic
- `dashboard/` - Protected, capability-gated

### 5. Supabase Middleware (Single Source of Truth)
- Auth state, i18n redirect, capability enforcement
- Security headers (CSP, HSTS, COOP, CORP)
- Body size limits, mutation detection

---

## Data Flow

### Public Pages (SSG/ISR)
```
Request → Middleware (i18n redirect) → Page Component → Supabase (server client) → Static HTML
```

### Dashboard (SSR)
```
Request → Middleware (auth check + capability) → Page → Server Actions → Supabase → HTML
```

### Server Actions (Mutations)
```
Client → Server Action → Supabase Service Client → DB → Revalidate Path → Response
```

### Background Jobs
```
Cron (GitHub Actions/Vercel) → API Route → Supabase Service Client → DB
```

---

## Component Conventions

### Public Components (`src/components/public/`)
- **Navbar** - Responsive, language switcher, auth state
- **Footer** - Links, legal, social
- **PageHeader** - Consistent hero section
- **ContactForm** - Server action submission
- **PetitionView** - Real-time signatures, endorsements
- **NeutralInfrastructure** - Feature cards with dialogs

### Dashboard Components
- **Feature tiles** - `rounded-sm`, no scale effects
- **Cards** - `bg-white border border-slate-200 rounded-sm`
- **Buttons** - `bg-white hover:bg-slate-50 border` (primary: `bg-slate-900`)
- **Skeletons** - `@/components/ui/skeleton` for async sections

### UI Primitives (`src/components/ui/`)
- Button, Card, Dialog, Input, Select, Table, Skeleton, etc.
- All `rounded-sm`, geometric, light theme

---

## Database Schema Highlights

### Organisations
```sql
organisations (
  id uuid PK,
  slug text UNIQUE,
  name text,
  org_type text,           -- 'collective' | 'ngo' | 'federation' | 'platform'
  capabilities jsonb,      -- { donations, campaigns, volunteers, ... }
  settings jsonb,
  created_at timestamptz
)
```

### Petitions (Nullable Goal)
```sql
petitions (
  id uuid PK,
  organisation_id uuid FK,
  title text,
  slug text,
  description text,
  target_decision_maker text,
  signature_goal int NULL,        -- NULLABLE - no fake fallback
  current_signatures int DEFAULT 0,
  status text,                    -- 'draft' | 'published' | 'completed'
  created_at timestamptz
)
```

### Transparency (Computed)
```sql
-- No stored trust_score, total_funds, etc.
-- Computed at query time from:
--   - donations table (amount, status)
--   - expenditures table
--   - compliance_filings table
```

---

## Security

### Headers (Middleware)
- CSP: `default-src 'self'`, nonce-based scripts
- HSTS: `max-age=63072000; includeSubDomains; preload`
- COOP: `same-origin`, CORP: `same-origin`
- Referrer-Policy: `strict-origin-when-cross-origin`

### Auth
- Supabase Auth (JWT in httpOnly cookies)
- Middleware validates claims on every request
- Capability-based route protection

### Secrets
- `.env.local` for local, GitHub Secrets for CI
- `scripts/scan-secrets.mjs` in pre-commit + CI

---

## Build & Deploy

### Commands
```bash
npm run dev          # Turbopack dev server
npm run build        # Production build (89 routes)
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run test         # vitest run
npx playwright test  # E2E tests
npm run storybook    # Storybook dev server
npm run ci           # lint + build + audit
```

### CI Pipeline (`.github/workflows/ci.yml`)
1. **migration-guard** - Forbid deleted migration files
2. **quality** - lint, typecheck, audit, secrets scan
3. **build** - `npm run build`
4. **test** - `vitest run`
5. **e2e** - Playwright tests (needs build)

---

## Extending the System

### Adding a New Public Page
1. Create `src/app/[lang]/(site)/new-page/page.tsx`
2. Use `PageHeader`, `Footer`, geometric layout
3. Add metadata in `generateMetadata()`
4. Run `npm run build` to verify

### Adding a Dashboard Feature
1. Create component in `src/components/dashboard/`
2. Add route in `src/app/[lang]/dashboard/feature/page.tsx`
3. Add capability flag in `organisations.capabilities`
4. Middleware enforces capability check

### Adding an API Endpoint
1. Create `src/app/api/new-endpoint/route.ts`
2. Export `GET`/`POST` async functions
5. Run `node scripts/generate-openapi.cjs` to update spec

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 404 on `/en/*` | Check middleware i18n redirect logic |
| CSP errors | Check nonce propagation in middleware |
| Build fails on types | Run `npx tsc --noEmit` locally |
| Migration guard fails | Never delete `supabase/migrations/` files |
| Auth redirect loop | Check middleware `isProtectedPath` logic |

---

## Glossary

| Term | Meaning |
|------|---------|
| **BQF** | Bahujan Queer Foundation (parent org) |
| **FCRA** | Foreign Contribution Regulation Act |
| **80G/12A** | Indian tax exemption certificates |
| **Parcha** | Printable notice/petition sheet |
| **Metered Billing** | `(active - 5) × ₹11/month` UPI Autopay |
| **Capability** | Org feature flag (donations, campaigns, etc.) |

---

*Last updated: September 2026 | Version 1.67.2*