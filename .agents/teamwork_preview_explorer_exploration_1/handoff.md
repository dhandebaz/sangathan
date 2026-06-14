# Handoff Report — Codebase Mapping of Org-Specific Features

## 1. Observation

- **Database Migrations for Org Features**:
  - `supabase/migrations/20260615000000_org_types_and_security.sql` adds the `org_type` column to `public.organisations` (line 3) and updates `create_organisation_and_admin` to configure default capabilities JSON (lines 27-37):
    ```sql
    IF p_org_type = 'student_union' THEN
      v_capabilities := '{"basic_governance": true, "campaigns": true, "student_ids": true, "events": true}'::jsonb;
    ELSIF p_org_type = 'ngo' THEN
      v_capabilities := '{"basic_governance": true, "donations": true, "volunteers": true, "events": true}'::jsonb;
    ELSIF p_org_type = 'workers_union' THEN
      v_capabilities := '{"basic_governance": true, "grievances": true, "memberships": true}'::jsonb;
    ELSIF p_org_type = 'rwa' THEN
      v_capabilities := '{"basic_governance": true, "complaints": true, "maintenance": true}'::jsonb;
    ```
  - `supabase/migrations/20260615000001_org_features.sql` creates tables `tickets` (line 2) and `campaigns` (line 55). It defines RLS policies for `tickets` and `campaigns` referencing `public.members.user_id` and `public.members.status` (lines 25-28, 36-39, 47-50, 76-79, 87-90):
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
- **Members Table Schema**:
  - `supabase/schema.sql` (lines 28-40) creates `public.members` with columns: `id`, `organisation_id`, `full_name`, `email`, `phone`, `role`, `joined_at`, `created_at`.
  - There are no migrations adding `user_id` or `status` to `public.members`. Instead, `public.profiles` has `id` (references `auth.users(id)`), `organisation_id`, and `status` (added in `20240214000006_membership_governance.sql` lines 7-9).
- **TypeScript and Database Bypasses (`as never`)**:
  - In `src/actions/members/actions.ts` lines 41-56 and lines 88-101, member operations cast inputs to `as never` to bypass compilation:
    ```typescript
    const { data, error } = await supabase
      .from('members')
      .insert({
        organisation_id: context.organizationId,
        full_name: input.full_name,
        email: input.email || null,
        phone: input.phone,
        designation: input.designation,
        area: input.area,
        joining_date: input.joining_date,
        status: input.status,
        notes: input.notes,
        role: input.role,
      } as never)
    ```
  - `designation`, `area`, `joining_date`, `status`, and `notes` do not exist in the database table `public.members` definition.
- **Next.js Middleware Enforcement**:
  - `src/lib/supabase/middleware.ts` lines 304-328 check paths against `caps` (capabilities):
    ```typescript
    if (p.includes('/dashboard/donations') && !caps.donations) {
      return NextResponse.redirect(new URL(`/${hasLocale ? pathname.split('/')[1] : i18n.defaultLocale}/dashboard`, request.url))
    }
    ```
- **Lack of Backend Actions for Tickets and Campaigns**:
  - A regex search for `.from('tickets')` and `.from('campaigns')` across `src/` revealed only four select queries in:
    - `src/app/[lang]/dashboard/campaigns/page.tsx` line 14
    - `src/app/[lang]/dashboard/complaints/page.tsx` line 11
    - `src/app/[lang]/dashboard/grievances/page.tsx` line 11
    - `src/app/[lang]/dashboard/maintenance/page.tsx` line 11
  - No insert/update/delete operations exist in any `src/` actions file for `tickets` or `campaigns`.
- **Empty Webhook Skeletons**:
  - `src/app/api/webhooks/razorpay/` and `src/app/api/webhooks/sender/` contain no files.

---

## 2. Logic Chain

1. **Routing and Menu Enforcement**: The capabilities object returned from `getOrgCapabilities` is checked in `src/app/[lang]/dashboard/layout.tsx` to conditionally render sidebar navigation links (e.g., `capabilities.donations`, `capabilities.campaigns`). Middleware in `src/lib/supabase/middleware.ts` performs matching path redirections to `/dashboard` if capabilities are not enabled for the user's organisation.
2. **Missing Backend Actions**: Since no CRUD server actions or API endpoints exist for the `tickets` and `campaigns` tables, community complaints, union grievances, maintenance requests, and student union campaigns are strictly read-only pages. Their create forms/dialogs are not wired up to any handler, confirming they are non-functional frontend placeholders.
3. **Broken Database Constraints**: Because the RLS policies in `supabase/migrations/20260615000001_org_features.sql` reference `members.user_id` and `members.status` columns (which do not exist on `public.members`), any attempt by an authenticated user to select or insert into `tickets` or `campaigns` will fail at the database level with a column-not-found error.
4. **TypeScript and App-Layer Discrepancies**: Casting objects `as never` in `src/actions/members/actions.ts` allows compilation of inserts/updates containing fields like `designation`, `area`, `status` on `members`. Since these columns do not exist in the database schema, this server action will crash on database execution.

---

## 3. Caveats

- **Verification Constraints**: We operated under a read-only restriction and could not verify runtime database behaviors or execute migrations.
- **Client Capabilities**: We assume the database has successfully executed migration scripts up to `20260615000001_org_features.sql`, meaning tables exist, but RLS policies are broken.

---

## 4. Conclusion

The specialized features for NGOs, Student Unions, Workers Unions, and RWAs in the Sangathan app are largely **UI facades** with missing server actions and critical backend defects:
1. **Volunteers and Student IDs** are frontend mockups mapping onto the generic `members` table.
2. **Complaints, Grievances, Maintenance (Tickets), and Campaigns** lack any backend CRUD logic or actions.
3. **The database schema is broken**: The newly added RLS policies reference non-existent columns (`members.user_id` and `members.status`), and member actions attempt to write columns (`designation`, `area`, `status`) that are missing from the `members` database table.

---

## 5. Verification Method

1. **Verify Middleware Redirects**: Review `src/lib/supabase/middleware.ts` lines 294-329 to inspect path capability validations.
2. **Verify Missing RLS Columns**: Inspect `supabase/schema.sql` (lines 28-40) and `supabase/migrations/20260615000001_org_features.sql` (lines 27-28) to confirm `public.members` lacks `user_id` and `status` columns.
3. **Verify TypeScript Compile Bypasses**: Inspect `src/actions/members/actions.ts` lines 54 and 99 to confirm the usage of `as never` for missing table properties.
