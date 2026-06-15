# Handoff Report: Forms & Submissions Schema Design

This report outlines findings and recommendations from the read-only investigation of the database schema for the Sangathan project, focusing on the `forms` and `form_submissions` tables.

---

## 1. Observation
- `supabase/schema.sql` (lines 42-62) defines the baseline `forms` and `form_submissions` tables:
  ```sql
  create table public.forms (
    id uuid primary key default gen_random_uuid(),
    organisation_id uuid not null references public.organisations(id) on delete cascade,
    title text not null,
    description text,
    fields jsonb not null default '[]',
    is_active boolean default true,
    created_by uuid references public.profiles(id) on delete set null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
  );

  create table public.form_submissions (
    id uuid primary key default gen_random_uuid(),
    organisation_id uuid not null references public.organisations(id) on delete cascade,
    form_id uuid not null references public.forms(id) on delete cascade,
    data jsonb not null,
    submitted_at timestamptz default now()
  );
  ```
- `supabase/migrations/20240214000003_performance_tuning.sql` (lines 13-15) references a different column name for form submissions:
  ```sql
  CREATE INDEX IF NOT EXISTS idx_submissions_form_date ON form_submissions(form_id, created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_submissions_org ON form_submissions(organisation_id);
  ```
- `src/actions/forms/actions.ts` (lines 271-280) inserts submissions with a `user_id` field:
  ```typescript
  const { error: submissionError } = await supabase
    .from('form_submissions')
    .insert({
      form_id: form.id,
      organisation_id: form.organisation_id,
      user_id: null,
      data: safeInput.data,
    })
  ```
- `src/app/(public)/f/[formId]/page.tsx` (lines 16-23) fetches form details using the high-privilege service client to bypass RLS:
  ```typescript
  const supabase = createServiceClient()
  const { data: form, error } = await supabase
    .from('forms')
    .select('id, title, description, fields, is_active, organisation_id')
    ...
  ```
- `supabase/schema.sql` (lines 206-225) configures RLS policies as:
  ```sql
  create policy "View forms in organisation"
    on public.forms for select
    using (organisation_id = public.get_auth_org_id());

  create policy "Public can submit forms"
    on public.form_submissions for insert
    with check (true);
  ```

---

## 2. Logic Chain
1. **RLS Bypass Risk**: The current `forms` SELECT policy restricts visibility to authenticated members of the organisation (`public.get_auth_org_id()`). Since anonymous public users cannot read form details, the application bypasses RLS using `createServiceClient()` in Next.js page loads.
2. **Visibility Controls**: By introducing a `visibility` column (`public`, `members`, `private`) to the `forms` table, we can update the select policies to allow public users to query public forms without bypassing RLS.
3. **Submission Spam Risk**: The current insert policy for `form_submissions` (`with check (true)`) allows any unauthenticated user to submit data to any form ID, even if that form is inactive or private. By checking form status and visibility inside the `form_submissions` insert check, we can block unauthorized submissions.
4. **Column Mismatch (Datetime)**: The performance index uses `created_at DESC` on `form_submissions`, but the baseline schema uses `submitted_at`. Standardizing this column to `created_at` removes this inconsistency.
5. **Missing Columns**: The server action attempts to log `user_id` for form submissions. Adding a `user_id` column (referencing `auth.users(id)`) allows tracking authenticated form submitters while remaining nullable for anonymous submissions.

---

## 3. Caveats
- No live database was queried or mutated. All observations and logic chains are constructed based on codebase code reviews and static analysis.
- Assumes that the `createServiceClient()` client uses the Supabase service role key, which is standard for this codebase.

---

## 4. Conclusion
The existing database schema for forms features has discrepancies that cause inconsistencies (mismatched datetime columns, missing `user_id` column) and security concerns (RLS bypasses, open insert policies).
Applying a new migration that introduces `visibility` and `deleted_at` for forms, maps `user_id` and renames `submitted_at` to `created_at` on form submissions, and establishes structured RLS rules will make the system consistent and secure.

---

## 5. Verification Method
- **Database Schema Verification**: Check table schemas in Supabase Studio or via pgAdmin to confirm that:
  - `forms` contains `visibility` and `deleted_at`.
  - `form_submissions` contains `user_id` and `created_at` (not `submitted_at`).
- **RLS Policy Verification**:
  - Run SQL selects as an unauthenticated user to verify that public forms are readable, while private/member-only forms return 0 results.
  - Attempt to insert submissions into an inactive or private form as an unauthenticated user; the database should reject the insert under RLS checks.
