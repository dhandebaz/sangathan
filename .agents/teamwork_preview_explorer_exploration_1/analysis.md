# Detailed Codebase Exploration Report — Sangathan App

This report outlines the findings from the investigation of specialized features for NGOs, Student Unions, Workers Unions, and RWAs in the Sangathan app.

## 1. Feature Map & Routing

The Sangathan app determines layout visibility and enforces route permissions using a dynamic **capabilities** system stored in the database.

### Organization Capabilities
An organization's capabilities are initialized when the organization is registered via the PL/pgSQL function `create_organisation_and_admin` (in `supabase/migrations/20260615000000_org_types_and_security.sql`). The enabled features are mapped as follows:

| Org Type (`org_type`) | Enabled Capabilities JSON | Target Sidebar Menu Items | Specialized Pages |
| :--- | :--- | :--- | :--- |
| **NGO** | `basic_governance`, `donations`, `volunteers`, `events` | Donations, Volunteers, Events | `/dashboard/donations`, `/dashboard/volunteers` |
| **Student Union** | `basic_governance`, `campaigns`, `student_ids`, `events` | Campaigns, Student IDs, Events | `/dashboard/campaigns`, `/dashboard/student-ids` |
| **Workers Union** | `basic_governance`, `grievances`, `memberships` | Grievances | `/dashboard/grievances` |
| **RWA** | `basic_governance`, `complaints`, `maintenance` | Complaints, Maintenance | `/dashboard/complaints`, `/dashboard/maintenance` |
| **Other** | `basic_governance` | General settings | *None* |

### Pages & Routing Structure
Specialized pages are nested under the Next.js locale route group in `src/app/[lang]/dashboard/`:
- `/dashboard/donations` — NGO Donations tracking page.
- `/dashboard/volunteers` — NGO Volunteers roster.
- `/dashboard/campaigns` — Student Union Campaigns & Movements overview.
- `/dashboard/student-ids` — Student Union Verifiable IDs issuer.
- `/dashboard/grievances` — Workers Union labor disputes/grievances tracking.
- `/dashboard/complaints` — RWA Resident complaints management.
- `/dashboard/maintenance` — RWA Facility/property maintenance requests.

---

## 2. Facades, Bypasses, and Missing Implementations

A key finding is that several of these specialized features are **viewer facades** with incomplete backend support or database schema bypasses:

1. **Missing CRUD Backend Actions for Tickets & Campaigns**:
   - The pages `/complaints`, `/grievances`, and `/maintenance` delegate rendering to the `TicketManager` component (`src/components/dashboard/ticket-manager.tsx`).
   - The page `/campaigns` renders a campaign list table.
   - **Discrepancy**: There are **no backend operations** (insert, update, delete queries) targeting the `tickets` or `campaigns` tables anywhere in the `src/` codebase. The "New Complaint", "New Grievance", "New Request", and "New Campaign" buttons on these pages are static and do not trigger any click/form handler, rendering them non-functional placeholders.
2. **Volunteer Network Facade**:
   - `/volunteers/page.tsx` does not query a dedicated `volunteers` table. Instead, it queries the `members` table for active members:
     ```typescript
     const { data: volunteers } = await supabase.from('members').select('*').eq('organisation_id', ctx.organizationId).eq('status', 'active')
     ```
     This bypasses maintaining a volunteer-specific database relation by labelling general active members as volunteers.
3. **Student ID Batch Issuer Facade**:
   - `/student-ids/page.tsx` is a read-only list of active members. The "Print Batch" and "View ID" buttons have no actual click behaviors or backend actions attached to them.
4. **TypeScript compilation bypasses (`as never`)**:
   - In `src/actions/members/actions.ts` (lines 54, 99, 133), input payloads are cast `as never` (e.g., `.insert({ ... } as never)`) to silence the TypeScript compiler.
   - **Reason**: The developer added fields like `status`, `designation`, `area`, `joining_date`, and `notes` to the frontend Member type and server action validation schemas. However, these columns **do not exist** in the database schema for the `members` table, nor do they exist in the generated TypeScript definitions. Running these actions will fail at the database level with a column-not-found error.
5. **Supporter Subscription Database Bypass**:
   - UPI payments verification stores the manual transaction UPI UTR reference inside the `razorpay_subscription_id` column of the `supporter_subscriptions` table (`src/actions/supporter/actions.ts` line 49) to bypass migrating the database schema to support manual payment flows.
6. **Placeholder API Webhook Directories**:
   - The webhook directories `src/app/api/webhooks/razorpay` and `src/app/api/webhooks/sender` are empty folder skeletons containing no route code.

---

## 3. Database Schema Analysis

The schema modifications in `supabase/migrations/` introduce structural changes for these features, but reveal critical security and syntax errors.

### Schema Structure
- **`tickets` table** (in `20260615000001_org_features.sql`):
  - Stores complaints, grievances, and maintenance requests.
  - Columns: `id` (UUID, PK), `organisation_id` (UUID, FK), `created_by` (UUID, FK), `type` (text, check constraint for `'grievance'`, `'complaint'`, `'maintenance'`), `title` (text), `description` (text), `status` (text, check constraint for `'open'`, `'in_progress'`, `'resolved'`), `priority` (text, check constraint for `'low'`, `'medium'`, `'high'`), `created_at`, `updated_at`.
- **`campaigns` table** (in `20260615000001_org_features.sql`):
  - Stores student union movements.
  - Columns: `id` (UUID, PK), `organisation_id` (UUID, FK), `created_by` (UUID, FK), `title` (text), `goal_description` (text), `status` (text, check constraint for `'draft'`, `'active'`, `'completed'`), `created_at`, `updated_at`.
- **`donations` table** (in `supabase/schema.sql`):
  - Tracks payments made to organizations.
  - Columns: `id`, `organisation_id`, `donor_name`, `amount`, `date`, `payment_method`, `upi_reference`, `notes`, `verified_by`, `created_at`.
- **`supporter_subscriptions` table** (in `supabase/schema.sql`):
  - Tracks Razorpay subscription states.
  - Columns: `id`, `organisation_id`, `razorpay_subscription_id`, `razorpay_plan_id`, `status`, `amount`, `current_period_start`, `current_period_end`, `created_at`, `updated_at`.

---

## 4. Security Enforcement & RLS Analysis

### Middleware Path Checks
The Next.js middleware in `src/lib/supabase/middleware.ts` enforces capabilities-based routing security. It extracts the authenticated user profile (using signed cookies or falling back to a direct Supabase query) and validates if they have the specific capability before allowing access:
```typescript
if (p.includes('/dashboard/donations') && !caps.donations) { ... redirect ... }
if (p.includes('/dashboard/campaigns') && !caps.campaigns) { ... redirect ... }
if (p.includes('/dashboard/grievances') && !caps.grievances) { ... redirect ... }
if (p.includes('/dashboard/complaints') && !caps.complaints) { ... redirect ... }
if (p.includes('/dashboard/maintenance') && !caps.maintenance) { ... redirect ... }
if (p.includes('/dashboard/volunteers') && !caps.volunteers) { ... redirect ... }
if (p.includes('/dashboard/student-ids') && !caps.student_ids) { ... redirect ... }
```

### Broken Row Level Security (RLS) Policies
A severe database configuration bug is present in `supabase/migrations/20260615000001_org_features.sql`. The policies written to secure `tickets` and `campaigns` query `public.members` checking for `user_id` and `status` columns:
```sql
CREATE POLICY "Org members can view their tickets" ON public.tickets
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.members
      WHERE members.organisation_id = tickets.organisation_id
      AND members.user_id = auth.uid()
      AND members.status = 'active'
    )
  );
```
**The Bug**:
- The `public.members` table does **not** have a `user_id` or `status` column in either `supabase/schema.sql` or subsequent migrations.
- These fields (`id` [matching auth.uid()], `organisation_id`, and `status`) are located on the `public.profiles` table.
- Consequently, executing these RLS policies on Supabase will throw a database runtime error (e.g., `column members.user_id does not exist`), breaking all read and write queries for campaigns and tickets.
