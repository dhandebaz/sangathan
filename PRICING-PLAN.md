# Sangathan Pricing Plan v1.0 (FINAL — locked)

> Status: LOCKED. Iske baad pricing par bahas nahi, sirf implementation.
> Last updated: September 24, 2026 — Phase 1 IMPLEMENTED in v1.65.0 (config, pricing pages, all copy, tests, changelog green).
> Phase 2 + 3 IMPLEMENTED in v1.66.0 (subscriptions engine, meter cron, GST invoices, archive flows, plugins framework + Canva + gallery). Zero-DDL: runs on capabilities JSON + Auth API (Management API token lacked privileges — dedicated tables deferred, no functionality lost).

---

## 1. Usool (non-negotiable)

1. **Monthly only.** Annual billing kabhi nahi — kisi tier, kisi add-on par nahi.
2. **Ek payer = org organizer.** Personal UPI chalega; org treasury/bank account ki zaroorat nahi.
3. **Members join free, unlimited orgs.** Paisa sirf org chalane wale se.
4. **Democratic core kabhi paywall nahi:** voting, petition-signing, RTI drafting, RSVP, form responses.
5. **Headlines amar:** ₹0 / ₹11 / ₹999. Ye numbers kabhi nahi badlenge.
6. **"Unlimited" shabd banned** (history entries chhod kar). Har cheez mein number ya fair-use cap.
7. **Bheekh wali bhasha nahi:** no "pay-what-you-can", no discounting habit, no negotiation.

---

## 2. Tiers

### Community (Free, ₹0 forever)

- **5 profiles per org** (admin samet). 6th profile par billing prompt.
- Branding on ("Powered by Sangathan").
- **Saare features** (neeche poori list) — free tour nahi, poora weekly loop.
- Surveys: 3 active + 500 responses/mo/org. Storage: 2GB fair-use. Per-org monthly email quota. AI: zero. Plugins: locked. WhatsApp channel: nahi.
- Max **2 free orgs per account**. Hafte mein max **1 nayi org**.
- Support: community + docs + AI bot.

### Metered (billing on — koi "plan khareedna" nahi)

- Formula: **(active members − 5) × ₹11/month** (GST-inclusive).
- Active = pichhle **60 din mein login**. Ginti **month-end** par.
- Meter examples: 26 members = ₹11 · 30 = ₹55 · 50 = ₹495 · 100 = ₹1,045 · 500 actives ≈ ₹5,445.
- Surveys: 50 active + 50,000 responses/mo. AI quota samet. Plugins unlock. Priority support. Pause available.
- Billing on karne ka matlab: UPI autopay mandate lagana. Uske baad meter chalta hai.

### Sustainer (LEGACY — grandfathered only, nayi sale nahi)

- Maujooda paid orgs: **₹1,000 flat + 500 included**, jab tak lagataar subscribed.
- Annual buyers: expiry tak honour, phir metered.
- White-label plan/₹10k addon buyers: **lifetime whitelabel free.**

---

## 3. Add-ons

| Add-on | Price | Rule |
|---|---|---|
| Whitelabel (branding hatao) | **₹999 one-time per org, lifetime** | Dono tiers khareed sakte hain. Public pages, events, letters se badge + custom logo prominence |
| Paid ticketing | **KHATM** | Org apna UPI ID lagaye, paisa seedha uske paas. RSVP/entry-track free |
| WhatsApp/SMS packs, custom domain | FUTURE candidate | Tabhi jab channel on ho. Base plan mein kabhi nahi |

---

## 4. Free vs Paid — complete feature split

**Ginati mein:** sirf dashboard member profiles (admin samet). Public actors — voters, petition-signers, RSVP guests, form respondents, public supporters — **uncounted, unlimited fair-use, hamesha free.**

**Dono tiers mein SAME:** member rolls/registers, donation records + 80G-ready receipts, secret-ballot voting, complaint diary + 30-day RTI reminder, parcha studio, petitions, events, meeting minutes, announcements/polls/tasks, volunteer management, ID cards, transparency page, member import, roles/permissions, audit logs, files vault, Telegram bot, letterhead studio, press releases, municipal letters, helpdesk, induction desk, networks/federation, statutory checklists, 12A/80G/FCRA trackers, AGM records, cash-book/dues registers, surveys + field-data tools (caps §2), 4 free environmental templates (hawa log, paani TDS log, kachra report, tree census), CSV export (data-freedom).

**Sirf Metered (paying) mein:** AI suite (summaries, minutes, form analysis, triage, social drafts — per-org caps), plugins/integrations (Canva pehle, rolling out), WhatsApp channel (jab on ho), priority support.

---

## 5. Billing mechanics

- Razorpay Subscriptions + UPI Autopay (pause + retry/dunning built-in). **Build item:** abhi sirf one-time Orders API hai.
- Fail par 7-day grace + read-only. **Kick kabhi nahi.** Naya member add block ho sakta hai limit par — maujooda data chhoota nahi.
- Har cycle GST invoice. 14-day refund (policy exists).
- Billing date se pehle meter + estimate + "dormant archive karo" button.
- Trial nahi (free-5 hi trial hai). Mandate lagana = paying customer = plugins unlock.

---

## 6. Tax & entity (CA sign-off pending)

- GST **18%** (SAC 9983/9984), prices GST-inclusive. Gateway GST par ITC. Foreign SaaS par RCM (pay + ITC, net neutral).
- Day-one GST registration. E-invoice nahi (<₹5cr).
- BQF Section 8 se billing par: MoA objects check + alag books (11(4A)) + business-receipts cap — **CA confirm karega.**
- **Subscription ≠ donation:** fee par 80G receipt kabhi nahi; flows/books alag.
- Ticketing khatm hone se 194-O wala sar-dard bhi khatm.

---

## 7. Unit economics (rounded, ±)

- Per billable user: ₹11 → net ₹9.32 → gateway ~₹0.30 → **~₹9.00** → infra ~₹0.30 + support ~₹2.50 → **contribution ~₹6.20 (~69% margin).**
- Fixed base ~₹8,000/mo (Vercel $20 + Supabase $25 + email/AI/Upstash/Sentry/domain + CA amortized).
- Break-even ≈ 1,300 billable users.
- S1 (2k users, 200 billable): ~−₹7k/mo → whitelabel + contributions bridge.
- S2 (20k users, 2k billable): ~+₹4–8k/mo.
- S3 (100k users, 10k billable): ~+₹60–65k/mo (~57% margin).
- Free org cost ~₹4/mo infra. Game = **org-count**, subscriber-count nahi.

---

## 8. Stability architecture (price amar kaise rahega)

Badlega **kabhi nahi:** ₹0 / ₹11 / ₹999 headlines.
Badal **sakta hai:** free limits (5), active window (60 din), caps (surveys/storage/email/AI), naye add-ons, support tiers.
Review triggers (price chhede baghair): support/org >₹400/mo sustained; 10k payers.

---

## 9. "Unlimited" audit (Phase 1 mein fix)

`solutions-data.ts:380` · `comparisons-data.ts:169,276` · `community-management:66` · `llms.txt:12` · `llms-full.txt:17` → "open participation (fair-use)" + 20→5.
`refund-policy:44` · `json-ld.tsx:88` · `admin/billing:117` → meter wording.
`plan-usage-banner:66,72` → 5 + meter copy. `event-form:131` placeholder → "e.g. 200 (khaali = open entry)".
Changelog history (4 entries) — **haath nahi.**

---

## 10. Copy update hit-list (Phase 1)

1. `lib/plans/config.ts` — PLAN_TIERS rewrite (Community 5 · Metered · Sustainer-legacy · WL ₹999 · yearly mitao)
2. `lib/plans/limits.ts` — capacity messages + survey/response/storage/email caps
3. Pricing page + `public-pricing-grid.tsx` — **3-number design (₹0/₹11/₹999)**, toggle/yearly/calculator khatm, meter examples, plugins "rolling out soon" note
4. `refund-policy` plan table · `solutions-data.ts` ×2 · `comparisons-data.ts` ×3 · `ngo-management` line · `features` ₹11/cadre entry · `json-ld.tsx` offers · `llms.txt` + `llms-full.txt` operating lines
5. `billing-plan-selector.tsx` (annual + 500-slots hatao) · dashboard `billing` page (meter + estimate + WL CTA) · onboarding wizard plan-mentions check
6. `plans.test.ts` update · 4 free environmental templates seed · AI-free-off verify
7. Changelog **v1.65.0** + root CHANGELOG + status files · tsc + vitest green

## 11. Phase 2 — billing infra (IMPLEMENTED v1.66.0)

Razorpay quantity-subscriptions (`lib/billing/subscriptions.ts`): one ₹11/monthly plan (`RAZORPAY_METER_PLAN_ID`), quantity = billable actives, total_count 120.
- `POST /api/billing/subscribe` (org-admin only): reuses customer, enforces billable ≥ 1, creates subscription → client completes UPI mandate via checkout `subscription_id` → polls status.
- `POST /api/billing/subscription-action` (status|pause|resume|cancel) + `SubscribeButton` wired in billing UI (replaced mailto).
- `POST /api/webhooks/razorpay` (HMAC-verified): authenticated → Metered live; charged → ledger row; halted → past-due (grace); paused/resumed/cancelled tracked; failed logged (provider retries = dunning).
- Monthly `GET /api/cron/meter-billing` (CRON_SECRET): login-based actives via Auth API (60-day rule), quantity sync, auto-downgrade to Community at zero, past-due >30d soft-revert, admin emails.
- GST invoices derived from `billing_transactions` + org (no new table): `SANG-YYYY-XXXXXXXX` numbers, SAC 9983, CGST/SGST vs IGST by buyer state; printable page at dashboard billing invoices.
- Dormant archive action (90d, self-safe, audited) + billing button.
- `last_active_at` column deferred (Management API 403) — Auth `last_sign_in_at` is the source of truth; status counts until then (can only lower future bills).

## 12. Phase 3 — plugins (IMPLEMENTED v1.66.0, provider credentials pending)

- `lib/integrations/{providers,store,crypto}`: registry (Canva first, minimal scopes), AES-256-GCM token envelopes in capabilities (fail-closed key), RLS-free service-only access, audit on connect/disconnect.
- `GET /api/integrations/[provider]/connect` (admin + paying-plan gate, PKCE, signed short cookie) → provider → `GET .../callback` (state/PKCE verify, code exchange, encrypt+save, redirect gallery).
- Gallery at dashboard `/integrations` (+ sidebar link): connect/disconnect, locked state for Community, error surfacing. Disconnect purges tokens.
- Daily `GET /api/cron/refresh-integrations`: refresh expiring tokens, mark failures (no silent breakage).

## 13. Go-live checklist (human steps, ~1 hour)

1. Razorpay Dashboard → Subscriptions → create quantity Plan ₹11/monthly → set `RAZORPAY_METER_PLAN_ID`. Enable Subscriptions + UPI Autopay on the account.
2. Razorpay Dashboard → Webhooks → add `https://sangathan.space/api/webhooks/razorpay` (subscription + payment events) → set `RAZORPAY_WEBHOOK_SECRET`.
3. `openssl rand -hex 32` → `INTEGRATION_TOKEN_KEY`. CA → `BILLING_SELLER_GSTIN`.
4. Canva Developers → create app → redirect URI `https://sangathan.space/api/integrations/canva/callback` → submit for review → set `CANVA_CLIENT_ID/SECRET`.
5. Cron provider → monthly `GET /api/cron/meter-billing` + daily `GET /api/cron/refresh-integrations` with `x-cron-secret: CRON_SECRET`.
6. Test: free org → 6th member → subscribe → ₹1 mandate → webhook → Metered → invoice page → pause/resume.

## 14. Killed list (record)

Annual billing · individual plans · slabs/tiers · per-event whitelabel · paid ticketing · trial · pay-what-you-can language · "unlimited" claims · base+overage combo.

## 15. Open items (user/CA)

- CA sign-off: entity structure, RCM filing, MoA objects.
- Razorpay: Subscriptions + UPI Autopay enabled? Account review.
- UPI autopay live end-to-end test before launch.
