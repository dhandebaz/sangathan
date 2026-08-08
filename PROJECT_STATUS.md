# Sangathan — Project Status & Roadmap

> **Sync Date:** August 9, 2026  
> **Current Version:** v1.20.0  
> **Status:** Production-Ready (Build passes cleanly: `npx next build`)

---

## 📌 Quick Overview for AI Agents & Vibecoders
If you are an AI assistant (Cursor, Windsurf, Trae, Claude Code, Cline, Roo Code, Copilot, Antigravity) continuing work on this project:

1. **What is Sangathan?**  
   Sangathan is a digital infrastructure platform for Indian civic collectives (NGOs, Student Unions, Workers Unions, and Resident Welfare Associations / RWAs).
2. **Current State:**  
   The platform is 100% production-functional with Supabase backend server actions, bilingual i18n (`en`/`hi`), India-targeted SEO (JSON-LD, 30+ sitemap routes, hreflang tags), dynamic landing page, interactive feature suite, and full dashboard governance tools.
3. **Core Rules to Respect:**  
   - **No dark rounded blob cards or pill badges** on site pages. Use crisp, light, geometric technical designs.
   - **Auto-update Changelog & Features pages** whenever modifying features or writing new updates (`src/app/[lang]/(site)/changelog/page.tsx`).
   - **Vanilla Tailwind CSS**: Responsive prefixes (`sm:`, `md:`, `lg:`), Server Components by default.

---

## 📑 Key File Locations
- **Active Context:** [`.cursor/active-context.md`](file:///c:/Users/hudav/Documents/trae_projects/sangathan/.cursor/active-context.md)
- **Agent Rules:** [`AGENTS.md`](file:///c:/Users/hudav/Documents/trae_projects/sangathan/AGENTS.md)
- **Architecture Spec:** [`ARCHITECTURE.md`](file:///c:/Users/hudav/Documents/trae_projects/sangathan/ARCHITECTURE.md)
- **Landing Page:** [`src/app/[lang]/(site)/page.tsx`](file:///c:/Users/hudav/Documents/trae_projects/sangathan/src/app/[lang]/(site)/page.tsx)
- **Features Page:** [`src/app/[lang]/(site)/features/page.tsx`](file:///c:/Users/hudav/Documents/trae_projects/sangathan/src/app/[lang]/(site)/features/page.tsx)
- **Changelog Page:** [`src/app/[lang]/(site)/changelog/page.tsx`](file:///c:/Users/hudav/Documents/trae_projects/sangathan/src/app/[lang]/(site)/changelog/page.tsx)
- **SEO Components:** [`src/components/seo/json-ld.tsx`](file:///c:/Users/hudav/Documents/trae_projects/sangathan/src/components/seo/json-ld.tsx), [`src/app/sitemap.ts`](file:///c:/Users/hudav/Documents/trae_projects/sangathan/src/app/sitemap.ts), [`src/app/robots.ts`](file:///c:/Users/hudav/Documents/trae_projects/sangathan/src/app/robots.ts)

---

## 🛠️ Verification Commands
- `npm run build` — Verify production build (Must pass with 0 errors).
- `npm run dev` — Run local dev server.
- `npm run test` — Run test suites.
