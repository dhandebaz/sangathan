# Active Context & Project Status

> **Last Updated:** September 24, 2026  
> **Current Version:** v1.66.0  
> **Status:** Production-Ready (Build status: Clean, `npx next build` verified with 0 errors; `npx vitest run` 28/28 passing)

---

## 🧭 Active Context Overview
**Sangathan** is a production-grade digital infrastructure platform for Indian civic collectives and registered non-profits (NGOs). The platform serves two organisation types: `civic_collective` and `ngo` (plus legacy `other`). Student Union, Workers Union and RWA modes were retired end-to-end (database check-constraint, code, tests, and public pages).

- **Live Domain:** `https://sangathan.space`
- **Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS, Supabase (Server Actions), i18n (`en` and `hi`), Lucide Icons.
- **Database enforcement:** `organisations.org_type` CHECK constraint allows only `('civic_collective','ngo','other')`. Migration: `supabase/migrations/20260922000000_remove_discontinued_org_types.sql`.

---

## ⚡ Recent Accomplishments (v1.66.0)

### 0. Billing Engine + Plugins Live (zero-DDL)
- Razorpay quantity-subscriptions meter (subscribe/status/pause/resume/cancel APIs, HMAC webhook, SubscribeButton, past-due grace + auto-downgrade), monthly login-based meter cron with admin emails, derived GST invoices + print page, dormant archive flow.
- Plugins framework (Canva OAuth PKCE, AES-256-GCM tokens, gating, gallery + sidebar, disconnect purge, refresh cron). Mgmt API 403 → capabilities/Auth-API architecture, no migration needed.

## ⚡ Recent Accomplishments (v1.65.0)

### 0. Pricing v1.0 Locked (₹0 / ₹11 / ₹999) + Free Env Surveys
- Metered monthly-only billing: free 5 profiles/org, then (actives−5)×₹11/mo month-end (60-day login active). No base/slabs/annual/trial. Whitelabel ₹999 one-time lifetime; paid ticketing retired.
- plans/config+limits rewritten (Community/Metered/Institution-legacy), pricing page + grid 3-number redesign, billing dashboard meter card, all copy synced (refund, solutions, comparisons, features, json-ld, llms), legacy Sustainer grandfathered.
- 4 free environmental form templates seeded; AI verified gated to paying tiers.

## ⚡ Recent Accomplishments (v1.64.0)

### 0. 52-Guide SEO Library + AI-Search Wiring
- 52 English how-to guides (~46k words) at `/guides/[slug]` across 6 categories, each with key takeaways, TOC, figures/tables, 4-6 FAQs, Article+FAQ+Breadcrumb JSON-LD, OG cards, canonical URLs. Validated by `tests/seo-articles.test.ts`.
- Guides are sitemap-listed + cross-linked via related cards but absent from all public nav; managed from `/admin/seo-posts` (robots-disallowed). Guides index in `llms.txt`/`llms-full.txt`.
- Site-wide metadata verified complete on all (site) pages; org public page already carries full OG/Twitter/canonical/robots + OrgProfile schema.

## ⚡ Recent Accomplishments (v1.63.0)

### 0. Retired Union-Only Dashboard Modules Removed + Per-Org Letterhead
- Deleted orphaned, unlinked `posts`, `legal-aid`, `induction` and `collaboration` routes/components/dedicated actions (shared `actions/collaboration` kept for events/settings/public profile).
- Letterhead studio now loads the signed-up organisation's own name + `logo_url`, with editable heading/tagline/logo fields and neutral defaults. Removed "Union" wording and the student-union fallback name.
- Neutral copy in reachable UI: admin-hub Hindi letterhead card, calendar location placeholder.

## ⚡ Recent Accomplishments (v1.62.0)

### 1. Trust & Reliability Upgrades
- Logins degrade gracefully instead of locking out when the rate-limit service is unreachable.
- Password resets are safer, lockouts are fairer, and Hindi users get translated login/OTP/messages.
- Task assignment alerts email assignees with a direct link.
- AI usage is capped per organisation; weekly digests fall back to plain statistics when AI is unavailable.

### 2. Two-Type Model Enforced End-to-End
- Removed discontinued org modes (student union, workers union, RWA) from the DB constraint, RPC functions, compliance seeders, marketing/policy copy, and tests.
- All public pages, `solutions-data.ts`, `focus-blueprints.ts`, `comparisons-data.ts`, `llms-full.txt` and FAQ content describe only Civic Collectives and NGOs.

### 3. Honest 80G/12A Receipt Wording
- Marketing and policy pages describe receipts as **80G/12A-ready**, only labelled as 80G receipts when the organisation holds its own registration.
- Removed the US `501c3` label and "auto-generate / instant / compliant" overclaims.
- Donation receipts now open as print-ready pages via `/api/tax-receipts/[orgId]/[number].pdf` instead of a broken placeholder URL.

---

## 🛡️ Strict Architecture & Design Rules
1. **No Dark Blob CTAs or Pill Tags**: Use clean, light, geometric technical card designs. Do NOT use uppercase rounded AI decorative pill tags.
2. **Auto-update Changelog & Features Pages**: Whenever code changes or new features are added, update `changelog/page.tsx` and `features/page.tsx`.
3. **Clean Tailwind CSS**: Use responsive utility classes (`sm:`, `md:`, `lg:`). Do NOT mix inline styles with Tailwind.
4. **Server Components First**: Use Server Components by default. Add `"use client"` only for interactive UI components.
5. **No `useEffect` Data Fetching**: Use Server Actions or loader functions.
6. **No new org types beyond civic_collective/ngo** without explicit user approval.

---

## 🔍 Verification & Next Steps
- **Build Command:** `npx next build` — Successfully verified.
- **TypeCheck:** `npx tsc --noEmit --skipLibCheck` — clean.
- **Tests:** `npx vitest run` — 7 files, 28/28 passing.
- **Blocked items:** `supabase db push` needs the DB password (Management API used instead); production env vars (`CRON_SECRET`, `ALLOWED_SERVICE_IPS`, AI keys, `ADMIN_EMAIL`, `AGENTMAIL_API_KEY`) pending on deploy.