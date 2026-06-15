# Handoff Report — explorer_forms_3

## 1. Observation

Direct observations from source code and database configuration:
* **Supabase Client (Browser)**: In `src/lib/supabase/client.ts`:
  ```typescript
  import { createBrowserClient } from '@supabase/ssr'
  // ...
  export function createClient() {
    return createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  ```
* **Supabase Client (Server)**: In `src/lib/supabase/server.ts`:
  ```typescript
  import { createServerClient } from '@supabase/ssr'
  import { cookies } from 'next/headers'
  // ...
  export async function createClient() {
    const cookieStore = await cookies()
    // ...
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) { ... }
        },
        global: { fetch: resilientFetch } // uses circuit breaker & 15s timeout
      }
    )
  }
  ```
* **Supabase Client (Service Role Bypass)**: In `src/lib/supabase/service.ts`:
  ```typescript
  import { createClient as createSupabaseClient } from '@supabase/supabase-js'
  export function createServiceClient() {
    // ...
    return createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })
  }
  ```
* **Authentication Gating & Session Caching**: In `src/lib/supabase/middleware.ts` (lines 90-114 and 183-215):
  It calls `verifySignedCookie(cached)` to extract cached profile information. On cache miss, it runs:
  ```typescript
  const { data: fetchedProfile } = await supabase
    .from('profiles')
    .select('role, phone_verified, organisations(capabilities)')
    .eq('id', user.id)
    .single()
  ```
  And writes it to a signed cookie using HMAC (`createSignedCookie(profile)`).
* **Capabilities Gating**: In `src/lib/supabase/middleware.ts` (lines 304-328):
  Checks dashboard sub-routes based on the capability JSON (e.g., checks `caps.donations` for `/dashboard/donations` and redirects to `/dashboard` on failure).
* **RLS Tenant Isolation**: In `supabase/schema.sql`:
  ```sql
  create or replace function public.get_auth_org_id()
  returns uuid language sql security definer stable as $$
    select organisation_id from public.profiles where id = auth.uid()
  $$;

  create policy "View forms in organisation" on public.forms for select
    using (organisation_id = public.get_auth_org_id());
  ```
* **Form Action (Dashboard)**: In `src/actions/forms/actions.ts`:
  Uses `createSafeAction()` to validate inputs using Zod and secure the user context based on active role/selected organisation.
* **Form Submission Action**: In `src/actions/forms/actions.ts` (lines 171-175):
  `submitFormResponse` is an open server action that fetches form definitions using `createServiceClient()` (bypassing RLS) and inserts records into `form_submissions`.

---

## 2. Logic Chain

1. **Client Initialization**: The observations show that all client/server boundary client creations are modularized. React Server Components and Route Handlers use async Next.js 15 cookies in `server.ts`. To avoid API latency overhead, the fetch client is wrapped with a circuit breaker.
2. **Session Security**:
   * The middleware intercepts incoming requests to enforce session state via `supabase.auth.getUser()`.
   * DB queries are minimized in the middleware flow by caching signed profile payloads (role, verification status, and capabilities) in client cookies. This is verified by checking `verifySignedCookie` call paths.
3. **Feature Gating and RLS**:
   * Feature gating is checked at two levels: in middleware (using cached JSONB capabilities to block page transitions) and in Postgres RLS (using `get_auth_org_id()` which identifies user tenant associations).
   * Forms and submissions access control relies entirely on the logged-in user context.
4. **Forms Security Deficiencies**:
   * Currently, the `forms` table definition in `schema.sql` doesn't have an `is_public` or `visibility` column. All forms are treated as public.
   * `submitFormResponse` in `actions.ts` uses `createServiceClient()` (which bypasses RLS) to load form specifications and write submissions. An attacker could query or submit to any form if they guess or harvest the UUID.
   * The `form_submissions` table in the database schema does not have a `user_id` column to reference authenticated users.
5. **Mitigation Path**:
   * Introducing a `visibility` column (`public` vs `private`) to the `forms` table allows us to differentiate public and private forms.
   * Modifying `PublicFormPage` to check visibility: if it's `private`, verify authentication and profile matching on the server component before rendering.
   * Modifying `submitFormResponse` action to query the user session when the target form is private, and write the authenticated user's ID to `form_submissions.user_id` (leaving it null for public forms).

---

## 3. Caveats

* **Schema Discrepancies**:
  - `src/types/database.ts` lists `is_published: boolean` on the `forms` table, but the SQL migration files and `schema.sql` define no such column (only `is_active` exists).
  - `src/types/database.ts` lists `user_id`, `ip_address`, and `user_agent` on `form_submissions`, but the SQL table schema definition in `supabase/schema.sql` only has `id`, `organisation_id`, `form_id`, `data`, and `submitted_at`.
  - In `supabase/migrations/20240214000003_performance_tuning.sql`, the index `idx_submissions_form_date` references `created_at`, but `schema.sql` specifies `submitted_at`.
  - These database/type discrepancies must be synchronized during implementation.
* **Network Restrictions**: Since we are in CODE_ONLY mode, we did not verify live database structures or trigger local builds.

---

## 4. Conclusion

The authentication patterns and middleware gating in Sangathan are robust and leverage signed cookie caches to prevent tenant lookup overhead. However, the Forms module currently lacks private form visibility protections. Adding a `visibility` column on the `forms` table and checking user session memberships for private forms in both the server component page and the submission action is necessary to ensure security while maintaining anonymous submissions for public forms.

---

## 5. Verification Method

To verify these findings and check any future implementation:
1. **Lint/Build Check**: Run `npm run lint` or `npm run build` to verify there are no compilation errors after correcting schemas.
2. **Schema Verification**: Check database table columns using the Supabase studio or by running a SQL command:
   ```sql
   SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'forms';
   SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'form_submissions';
   ```
3. **Integration Test**:
   * Attempt to access a public form anonymously at `/f/[formId]` -> should render.
   * Attempt to access a private form anonymously at `/f/[formId]` -> should redirect to `/login`.
   * Attempt to submit a private form anonymously via the server action `submitFormResponse` directly -> should return `{ success: false, error: 'Authentication required...' }`.
   * Submit a private form as an authenticated user -> check that the record in `form_submissions` stores the correct `user_id`.
