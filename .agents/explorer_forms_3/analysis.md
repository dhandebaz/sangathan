# Server Actions, Authentication, and Middleware Analysis

This report documents the exploration of the server actions, authentication patterns, and middleware setup in the Sangathan codebase, along with security recommendations for form creation and public submissions.

---

## 1. Supabase JS Client Initialization

The codebase uses three main entry points for initializing Supabase clients, depending on the context:

| Context | Client Initialization Helper | Package/Method | Features & Configurations |
|---|---|---|---|
| **Client-side** (React Client Components) | `createClient()` in `src/lib/supabase/client.ts` | `@supabase/ssr` -> `createBrowserClient` | Initialized with public environment variables: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. |
| **Server-side** (Server Components, Middleware, Server Actions, Route Handlers) | `createClient()` in `src/lib/supabase/server.ts` | `@supabase/ssr` -> `createServerClient` | Reads cookies using `next/headers` (supporting Next.js 15 async cookies). Integrates a custom `resilientFetch` wrapper implementing a **Circuit Breaker** (`withCircuitBreaker('supabase', ...)`) and a **15-second abort timeout** to prevent hanging DB calls. |
| **Service Role** (Cron jobs, Webhooks, RLS-bypass admin operations) | `createServiceClient()` in `src/lib/supabase/service.ts` | `@supabase/supabase-js` -> `createClient` | Uses `SUPABASE_SERVICE_ROLE_KEY` to bypass Row Level Security. Configured with `autoRefreshToken: false` and `persistSession: false`. Should ONLY be used in system/restricted scopes. |

---

## 2. User Authentication Patterns

Authentication in Sangathan is managed using a combination of Supabase Auth, middleware route guards, and custom server action wrappers.

### A. Session Checks
* **Middleware**: In `src/lib/supabase/middleware.ts`, `supabase.auth.getUser()` is invoked for every request. This securely validates the JWT on the server-side to check if the user is authenticated.
* **Server Actions**: Server actions use the helper `createSafeAction()` (in `src/lib/auth/actions.ts`), which wraps input validation (via Zod) and authenticates the user context via `getSelectedOrganisationId()` and `getUserContext()`.

### B. Profiles Fetching
* To avoid calling the database on every middleware request, Sangathan caches the user's profile metadata in a signed cookie called `user-metadata` (valid for 10 minutes).
* This cookie is signed and verified using custom HMAC-SHA-256 functions in `src/lib/auth/cookie.ts` (`createSignedCookie` and `verifySignedCookie`), using the `COOKIE_SIGNING_SECRET` or `SUPABASE_SERVICE_ROLE_KEY`.
* On a cache miss, the middleware fetches the profile:
  ```typescript
  const { data: fetchedProfile } = await supabase
    .from('profiles')
    .select('role, phone_verified, organisations(capabilities)')
    .eq('id', user.id)
    .single()
  ```

### C. Organisation Checks
* Tenant isolation is enforced dynamically.
* The organisation ID is stored in the `sangathan_org_id` cookie.
* On Server Actions, the wrapper calls `getSelectedOrganisationId()` which retrieves the cookie. If the cookie is not found, it queries `getUserMemberships(user.id)` to discover the user's organisation and redirects to onboarding or selection pages.
* The user context is loaded with `getUserContext(organisationId)` which verifies that the user has an active membership (`status = 'active'`) in that organisation.

---

## 3. Capabilities-based Gating & RLS Checks

### A. Gating in Middleware
The middleware gates dashboard features based on the organisation capabilities stored in the user's profile:
* If a path includes `/dashboard/donations` and `capabilities.donations` is false, the user is redirected to `/dashboard`.
* Similar checks gate networks (`federation_mode`), campaigns, grievances, complaints, maintenance, volunteers, and student IDs.

### B. Capabilities Allocation & Unlocking
* **Default Setup**: During organization creation (via PostgreSQL function `create_organisation_and_admin`), strict capabilities are assigned based on `org_type`:
  - `student_union`: basic_governance, campaigns, student_ids, events
  - `ngo`: basic_governance, donations, volunteers, events
  - `workers_union`: basic_governance, grievances, memberships
  - `rwa`: basic_governance, complaints, maintenance
* **Dynamic Unlocking**: The helper function `unlockCapabilities(orgId)` (in `src/lib/capabilities.ts`) programmatically updates capabilities based on metrics:
  - 10+ active members unlocks `voting_engine` and `volunteer_engine`.
  - 1+ completed event unlocks `advanced_analytics`.

### C. Row Level Security (RLS) Checks
* **Helper Function**: `public.get_auth_org_id()` is a SQL function that retrieves the `organisation_id` of the currently logged-in user from the `profiles` table:
  ```sql
  create or replace function public.get_auth_org_id()
  returns uuid language sql security definer stable as $$
    select organisation_id from public.profiles where id = auth.uid()
  $$;
  ```
* **Tenant Isolation**: Policies enforce that users can only select rows where the table's `organisation_id` matches the user's organisation:
  `using (organisation_id = public.get_auth_org_id())`
* **Role Enforcement**: Policies restrict insert/update/delete operations to users with appropriate roles:
  ```sql
  create policy "Manage forms (Admin/Editor)"
    on public.forms for all
    using (organisation_id = public.get_auth_org_id() and exists (
      select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor')
    ));
  ```

---

## 4. Secure Forms Architecture Recommendations

Currently, the `forms` table does not have an access control configuration (e.g., `is_public` or `visibility`), meaning all forms are publicly accessible via `/f/[formId]` and anonymous submissions are sent via the service role client.

To implement a secure form architecture where public forms can be submitted anonymously but private forms require authentication, we suggest the following changes:

### A. Database Migrations

1. **Add `visibility` Column to `forms` Table**:
   Add a visibility column to differentiate public vs. private forms.
   ```sql
   ALTER TABLE public.forms 
   ADD COLUMN IF NOT EXISTS visibility TEXT NOT NULL DEFAULT 'public' 
   CHECK (visibility IN ('public', 'private'));
   ```

2. **Add `user_id` to `form_submissions` Table**:
   Currently, the `form_submissions` table in `schema.sql` is missing the `user_id` column.
   ```sql
   ALTER TABLE public.form_submissions 
   ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
   ```

### B. Form Creation Actions (`src/actions/forms/actions.ts`)

Update the form schemas to allow selecting visibility and store it:

```typescript
// 1. Update Schema
const CreateFormSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  fields: z.array(FormFieldSchema).min(1, "At least one field is required"),
  visibility: z.enum(['public', 'private']).default('public'), // added
})

// 2. Save Visibility
export const createForm = createSafeAction(
  CreateFormSchema,
  async (input, context) => {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('forms')
      .insert({
        organisation_id: context.organizationId,
        title: input.title,
        description: input.description,
        fields: input.fields,
        visibility: input.visibility, // added
        is_active: true,
        created_by: context.user.id,
      })
      .select('id')
      .single()
    // ...
  },
  { allowedRoles: ['admin', 'editor'] }
)
```

### C. Public Form Page Routing (`src/app/(public)/f/[formId]/page.tsx`)

Enforce session checks for private forms:

```typescript
export default async function PublicFormPage({ params }: PageProps) {
  const { formId } = await params
  const serviceSupabase = createServiceClient()

  // 1. Fetch form visibility alongside details
  const { data: form, error } = await serviceSupabase
    .from('forms')
    .select('id, title, description, fields, is_active, organisation_id, visibility')
    .eq('id', formId)
    .single()

  if (error || !form) notFound()

  // 2. Enforce authentication if form is private
  if (form.visibility === 'private') {
    const userSupabase = await createClient() // Authenticated client
    const { data: { user } } = await userSupabase.auth.getUser()

    if (!user) {
      redirect(`/login?redirect=/f/${formId}`)
    }

    // Verify user belongs to the form's organisation
    const { data: profile } = await userSupabase
      .from('profiles')
      .select('organisation_id')
      .eq('id', user.id)
      .single()

    if (!profile || profile.organisation_id !== form.organisation_id) {
       // Hide private forms from unauthorized users
       notFound() 
    }
  }

  // 3. Render Form
  const csrfToken = await createSignedCookie({ formId })
  return (
     // ... render PublicForm component
  )
}
```

### D. Public Submission Server Action (`src/actions/forms/actions.ts`)

Enforce security checks and save the submitter's identity for private forms:

```typescript
export async function submitFormResponse(input: z.infer<typeof SubmitFormSchema>) {
  // ... Zod parsing, Honeypot checks, and CSRF token validation ...

  const serviceSupabase = createServiceClient()

  // 1. Fetch Form Definition
  const { data: form, error: formError } = await serviceSupabase
    .from('forms')
    .select('id, organisation_id, fields, is_active, visibility')
    .eq('id', safeInput.formId)
    .single()

  if (formError || !form || !form.is_active) {
    return { success: false, error: 'Form not found or inactive' }
  }

  let authenticatedUserId: string | null = null

  // 2. Validate Submission Access Type
  if (form.visibility === 'private') {
    const userSupabase = await createClient() // Standard client
    const { data: { user } } = await userSupabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Authentication required to submit this form.' }
    }

    // Verify membership
    const { data: profile } = await userSupabase
      .from('profiles')
      .select('organisation_id')
      .eq('id', user.id)
      .single()

    if (!profile || profile.organisation_id !== form.organisation_id) {
      return { success: false, error: 'Forbidden: Access denied to this organisation form.' }
    }

    authenticatedUserId = user.id
  }

  // ... dynamic field validation and rate limiting checks ...

  // 3. Insert Submission (recording user_id if authenticated)
  const { error: submissionError } = await serviceSupabase
    .from('form_submissions')
    .insert({
      form_id: form.id,
      organisation_id: form.organisation_id,
      user_id: authenticatedUserId, // null for public, user UUID for private
      data: safeInput.data,
    })

  if (submissionError) {
    return { success: false, error: 'Failed to submit form' }
  }

  return { success: true }
}
```
