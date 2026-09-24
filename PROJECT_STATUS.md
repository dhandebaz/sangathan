# Sangathan — Project Status & Roadmap

> **Sync Date:** September 24, 2026  
> **Current Version:** v1.66.0  
> **Status:** Production-Ready (Build passes cleanly: `npx next build`; `npx tsc --noEmit` clean; `npx vitest run` 28/28)

---

## 📌 Quick Overview for AI Agents & Vibecoders
If you are an AI assistant (Cursor, Windsurf, Trae, Claude Code, Cline, Roo Code, Copilot, Antigravity) continuing work on this project:

1. **What is Sangathan?**  
   Sangathan is a digital infrastructure platform for two Indian organisation types: **Civic Collectives** (`civic_collective`) and **registered non-profits / NGOs** (`ngo`). Student Union, Workers Union and RWA modes were retired end-to-end and are enforced at the database level (`org_type` CHECK constraint), in code, tests and public copy.
2. **Current State:**  
   The platform is production-functional with Supabase backend server actions, bilingual i18n (`en`/`hi`), India-targeted SEO (JSON-LD, 30+ sitemap routes, hreflang tags), dynamic landing page, interactive feature suite, and full dashboard governance tools.
3. **Core Rules to Respect:**  
   - **No dark rounded blob cards or pill badges** on site pages. Use crisp, light, geometric technical designs.
   - **Auto-update Changelog & Features pages** whenever modifying features or writing new updates (`src/app/[lang]/(site)/changelog/page.tsx`).
   - **Vanilla Tailwind CSS**: Responsive prefixes (`sm:`, `md:`, `lg:`), Server Components by default.
   - **Do not reintroduce** student/worker union, RWA, or US `501c3` claims; receipts are 80G/12A-ready and only 80G receipts when the organisation holds its own registration.

---

## 📑 Key File Locations
- **Active Context:** [`.cursor/active-context.md`](file:///c:/Users/hudav/Documents/trae_projects/sangathan/.cursor/active-context.md)
- **Agent Rules:** [`AGENTS.md`](file:///c:/Users/hudav/Documents/trae_projects/sangathan/AGENTS.md)
- **Org-Type Migration:** [`supabase/migrations/20260922000000_remove_discontinued_org_types.sql`](file:///c:/Users/hudav/Documents/trae_projects/sangathan/supabase/migrations/20260922000000_remove_discontinued_org_types.sql)
- **Landing Page:** [`src/app/[lang]/(site)/page.tsx`](file:///c:/Users/hudav/Documents/trae_projects/sangathan/src/app/[lang]/(site)/page.tsx)
- **Features Page:** [`src/app/[lang]/(site)/features/page.tsx`](file:///c:/Users/hudav/Documents/trae_projects/sangathan/src/app/[lang]/(site)/features/page.tsx)
- **Changelog Page:** [`src/app/[lang]/(site)/changelog/page.tsx`](file:///c:/Users/hudav/Documents/trae_projects/sangathan/src/app/[lang]/(site)/changelog/page.tsx)
- **SEO Components:** [`src/components/seo/json-ld.tsx`](file:///c:/Users/hudav/Documents/trae_projects/sangathan/src/components/seo/json-ld.tsx), [`src/app/sitemap.ts`](file:///c:/Users/hudav/Documents/trae_projects/sangathan/src/app/sitemap.ts), [`src/app/robots.ts`](file:///c:/Users/hudav/Documents/trae_projects/sangathan/src/app/robots.ts)

---

## 🛠️ Verification Commands
- `npm run build` — Verify production build (Must pass with 0 errors).
- `npm run typecheck` — TypeScript check (`tsc --noEmit`).
- `npm run test` — Run test suites (vitest).
- `npm run lint` — ESLint.
- `npm run secrets:scan` — Secret leak scan.
- Supabase migration CLI needs the DB password; otherwise use the Management API (keyring token `Supabase CLI:supabase`).