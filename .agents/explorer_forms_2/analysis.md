# Analysis Report: Next.js Frontend & Custom Forms Structure

## 1. Executive Summary
This report analyzes the Next.js frontend pages, dashboard structures, UI patterns, and custom forms framework. Our investigation reveals that the custom forms framework is already partially implemented with corresponding database schemas, RLS policies, server actions, and frontend pages. However, they are not yet fully integrated into the sidebar navigation, mobile controls, overview dashboards, or page-level authorization checks. This report details the existing files, UI/UX systems, and specifies exactly how and where to integrate them.

---

## 2. Dashboard Pages & Navigation Structure

### Location of Dashboard Routes
The live, active dashboard views are located in:
*   `src/app/[lang]/dashboard/` (Next.js App Router with localization support)

> **Observation**: There is a duplicate folder structure at `src/app/[lang]/(dashboard)/` containing empty directories (e.g. `/forms`, `/analytics`). This is a leftover from a previous route-group refactoring. The empty subdirectories have no effect on routing but should be removed or ignored to avoid confusion.

### Sidebar Navigation & Layout
The main dashboard shell is defined in `src/app/[lang]/dashboard/layout.tsx`. It loads the sidebar navigation dynamically and checks organization-level capability flags to display specific sidebar items:
*   **NGO Views**: Shows "Donations" (`donations`) and "Volunteers" (`volunteers`).
*   **Student Union Views**: Shows "Campaigns" (`campaigns`) and "Student IDs" (`student_ids`).
*   **Workers Union Views**: Shows "Grievances" (`grievances`) and "Memberships" (`memberships` / pending).
*   **RWA (Resident Welfare Association) Views**: Shows "Complaints" (`complaints`) and "Maintenance" (`maintenance`).

These features map to database schemas and are gated using the `getOrgCapabilities(orgId)` function from `src/lib/capabilities.ts`.

### Organisation Types & Capability Gating
Organization maturity and type-based defaults are configured in the database (`supabase/migrations/20260615000000_org_types_and_security.sql`):
*   **`student_union`**: `basic_governance`, `campaigns`, `student_ids`, `events`
*   **`ngo`**: `basic_governance`, `donations`, `volunteers`, `events`
*   **`workers_union`**: `basic_governance`, `grievances`, `memberships`
*   **`rwa`**: `basic_governance`, `complaints`, `maintenance`
*   **`other`**: `basic_governance`

---

## 3. UI Component Patterns & Form Validation

### UI & Styling System
*   **Styling**: Uses Tailwind CSS with a standardized design language. Layout containers use CSS classes like `content-card`.
*   **UI Components**: Located in `src/components/ui/`. It is a Radix-based custom **Shadcn UI** library containing components like `button.tsx`, `card.tsx`, `dialog.tsx`, `input.tsx`, `label.tsx`, `select.tsx`, `table.tsx`, etc.
*   **Icons**: Uses `lucide-react`.

### Form Validation & Security Systems
The custom forms framework contains robust validation and security layers:
1.  **Client-Side Forms**:
    *   Dynamic rendering of fields based on database JSONB structure in `src/components/forms/public-form.tsx`.
    *   Form builder page (`src/app/[lang]/dashboard/forms/new/page.tsx`) allows adding `text`, `textarea`, `number`, `phone`, and `dropdown` fields, and toggle `required`.
    *   Standard HTML5 validation (e.g., `required`, `type="..."`) with state-based client-side dynamic error outputs (`fieldErrors`).
2.  **Server-Side Validation**:
    *   Uses **Zod** schema validation. The form builder and submission schemas are defined in `src/types/forms.ts` (`FormFieldSchema`) and `src/actions/forms/actions.ts` (`CreateFormSchema`, `SubmitFormSchema`).
3.  **Spam & Security Protection** (implemented in `submitFormResponse` in `src/actions/forms/actions.ts`):
    *   **CSRF Protection**: Signed cookie token verification (`csrfToken` using `verifySignedCookie` helper).
    *   **Spam Honeypot**: A hidden input field (`website_url`) is checked; submissions containing data in it are blocked.
    *   **Speed Checks**: Blocks submissions completed in under 2 seconds (indicating bot activity) and rejects forms after a 1-hour session expiry.
    *   **IP-Based Rate Limiting**: Limit of 5 submissions per IP per hour, registered in the `rate_limits` table.

---

## 4. Custom Forms Framework File Index

| Page / Component | File Path | Current Status / Details |
| :--- | :--- | :--- |
| **Admin Create Form Page** | `src/app/[lang]/dashboard/forms/new/page.tsx` | UI page to dynamically create custom form configurations. Calls `createForm` Server Action. |
| **Admin List/Review Page** | `src/app/[lang]/dashboard/forms/page.tsx` | Lists all forms in the organisation with toggles for status and submission counts. |
| **Admin Submissions Detail Page** | `src/app/[lang]/dashboard/forms/[id]/page.tsx` | Lists recent submissions in a table, has CSV export functionality, and delete form action. |
| **Public Answering Page** | `src/app/(public)/f/[formId]/page.tsx` | Publicly accessible form render page. Generates CSRF tokens and loads `PublicForm`. |
| **CSV Export Component** | `src/components/forms/csv-export-button.tsx` | Utility component to flatten and export submissions as a downloadable `.csv` file. |
| **Public Form Component** | `src/components/forms/public-form.tsx` | Dynamically renders forms based on schema fields and submits data to `submitFormResponse`. |
| **Server Actions** | `src/actions/forms/actions.ts` | Contains `createForm`, `updateForm`, `toggleFormStatus`, `deleteForm`, and `submitFormResponse`. |
| **Database Schema** | `supabase/schema.sql` (lines 43-62) | Defines `public.forms` and `public.form_submissions` tables with foreign keys and cascade rules. |
| **Row Level Security (RLS)** | `supabase/schema.sql` (lines 205-226) | Gated so only Admins/Editors can manage forms and view submissions, but public can insert. |

---

## 5. Integration Recommendations

### A. Sidebar Navigation Integration
To expose forms to administrators in the sidebar navigation:
Add the following link in the **System** or **Operations** section of `src/app/[lang]/dashboard/layout.tsx` (lines 142-151):
```tsx
{isAdmin && (
  <SidebarLink href={`/${lang}/dashboard/forms`} icon={FileText} label="Forms" />
)}
```
*Make sure to import `FileText` from `lucide-react` at the top of the file.*

### B. Contextual Floating Action Button (FAB) Integration
For mobile admin productivity, add the forms action to `src/components/mobile/contextual-fab.tsx` (lines 47-53):
```tsx
else if (pathname.endsWith('/dashboard/forms') && isAdmin) {
  action = {
    href: `/${lang}/dashboard/forms/new`,
    icon: Plus,
    label: 'Create Form'
  }
}
```

### C. Page-Level Gating & Role Authorization Check
Currently, while server actions are secure, the page routes `forms/page.tsx` and `forms/[id]/page.tsx` do not check the user's role on the server-side, which allows standard members to navigate to the pages (even if RLS hides details).
**Action**: Add the following check at the top of `FormsPage` and `FormDetailsPage` server components (similar to `src/app/[lang]/dashboard/analytics/page.tsx`):
```typescript
const { data: profileData } = await supabase
  .from('profiles')
  .select('role, organisation_id')
  .eq('id', user.id)
  .single()

const profile = profileData as { role: string; organisation_id: string | null } | null

if (!profile || !profile.organisation_id || !['admin', 'editor', 'executive'].includes(profile.role)) {
  return <AccessDenied lang={lang} /> // Import from '@/components/dashboard/access-denied'
}
```

### D. Admin Dashboard Metric Cards
Display custom forms metrics in the admin dashboard overview (`src/app/[lang]/dashboard/page.tsx` and `src/components/dashboard/admin-view.tsx`).
1.  **Count active forms**: Retrieve active forms count using:
    ```typescript
    const activeFormsRes = await supabase
      .from('forms')
      .select('*', { count: 'exact', head: true })
      .eq('organisation_id', profile.organisation_id)
      .eq('is_active', true)
    ```
2.  **Pass to `<AdminDashboard>`**: Add `formsCount` to `stats` prop in `admin-view.tsx` and display a `MetricCard` for "Active Surveys".
