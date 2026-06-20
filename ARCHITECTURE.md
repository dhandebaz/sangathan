# Platform Architecture & Governance Structure

## 1. Hybrid Platform Structure

Sangathan operates as a **Hybrid Civic Infrastructure Platform**, balancing three roles:
1.  **Neutral Infrastructure**: Providing tools for any organization without ideological bias.
2.  **Public-Good Civic Tool**: Enabling transparency and open data where appropriate.
3.  **Governance Backbone**: Enforcing structural integrity and legal compliance.

## 2. Modular Capability System

We use a **Feature Tiering System** to gate advanced capabilities. This ensures organizations only access tools they are ready for or have authorized.

### Capability Flags (`org_capabilities`)

| Capability | Description | Default |
| :--- | :--- | :--- |
| `basic_governance` | Core membership, simple announcements. | `true` |
| `advanced_analytics` | Deep insights into engagement and growth. | `false` |
| `federation_mode` | Cross-org linking, joint events, coalitions. | `false` |
| `voting_engine` | Formal and informal polling system. | `false` |
| `volunteer_engine` | Task management and hour logging. | `false` |
| `transparency_mode` | Public-facing stats and charter adherence badge. | `true` (Opt-in via Settings) |
| `coalition_tools` | Advanced network features (future). | `false` |

### Governance Firewall

*   **No Hidden Capabilities**: All features are controlled by explicit flags in the `organisations` table.
*   **No Silent Overrides**: System admins cannot enable features without an audit log entry in `platform_actions`.
*   **Equal Enforcement**: Logic checks (`checkCapability`) apply universally to all organizations.

## 3. Legal Separation Strategy

To maintain neutrality and trust, we prepare for structural separation:

*   **Operational Entity**: Manages servers, billing, and day-to-day uptime.
*   **Foundation / Governance Board**: Holds the "Platform Charter," manages appeals, and oversees the "Public-Good" mission.
*   **Data Stewardship**: Organizational data is legally owned by the organization, not the platform. The platform acts as a data processor.

## 4. System Admin Limitations

System Administrators are bound by code and policy:

1.  **Immutable Logs**: All administrative actions (suspensions, capability changes) are logged to `platform_actions`.
2.  **No Data Alteration**: Admins cannot modify vote results or financial logs.
3.  **Appeal Process**: Any severe action (suspension) must have a corresponding appeal route (`/dashboard/appeals`).

## 5. Unified Backend Action Pattern

Every server action MUST use the `createSafeAction` wrapper from `src/lib/auth/actions.ts`. This is the single canonical entry point for all authenticated server-side mutations.

### Standard Pattern

```typescript
'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const MySchema = z.object({
  // NEVER include organisation_id — it comes from the auth context
  name: z.string().min(1),
})

export const myAction = createSafeAction(
  MySchema,
  async (input, context) => {
    // context.user.id      — authenticated user
    // context.organizationId — resolved org from session cookie
    // context.role          — user's role in this org
    // context.logAction()   — helper to write audit logs

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('my_table')
      .insert({ organisation_id: context.organizationId, ...input })
      .select()
      .single()

    if (error) return { error: error.message }

    await context.logAction({
      action: 'MY_ACTION',
      resourceTable: 'my_table',
      resourceId: data.id,
    })

    revalidatePath('/', 'layout')
    return { success: true, id: data.id }
  },
  {
    allowedRoles: ['admin', 'editor'],          // optional role gate
    allowedCapabilities: ['voting_engine'],      // optional capability gate
    actionName: 'my_action',                     // rate-limit key
    rateLimit: { points: 30, duration: 60 },     // optional: default 60/min
    audit: {                                     // optional auto-audit
      action: 'MY_ACTION',
      resourceTable: 'my_table',
      getResourceId: (input, ctx) => ctx.organizationId,
    },
  },
)
```

### Rules

| Rule | Description |
|------|-------------|
| **No raw `try/catch`** | `createSafeAction` handles all error logging and consistent response format |
| **No manual auth checks** | Never call `getUser()`, `getAdminOrg()`, or profile queries yourself |
| **No `organisation_id` from client** | Always sourced from the auth context cookie, never from form input |
| **No inline rate limiting** | Use `createSafeAction` options; the wrapper uses centralized Upstash Redis |
| **Audit every mutation** | Call `context.logAction()` or use the `audit` option for every write operation |
| **Zod first** | Validate ALL inputs with Zod schemas; never trust raw `FormData` or params |
| **Return `{ success, data?, error? }`** | All actions return the standard `ActionResponse` shape |

### When NOT to use `createSafeAction`

- **Public/unauthenticated actions** (e.g., public form submission) — write a raw server action with explicit public intent
- **Internal utilities** (e.g., `generateQRData`) — keep as plain async functions with no server action wrapper
- **Actions with highly custom auth** (e.g., `rsvpToEvent` which handles both public and role-gated access) — use raw pattern but follow the same response contract

### Response Contract

```typescript
type ActionResponse<T = null> = {
  success: boolean
  data?: T
  error?: string       // user-safe message — never expose stack traces
}
```

Consumers always check `success` first. If `false`, display `error`. If `true`, use `data`.

## 6. Future Extensibility

The architecture supports future growth via:
*   **API Layer**: Modular service functions in `src/lib/supabase/service.ts` can be exposed via API routes.
*   **Plugin Ecosystem**: The `capabilities` JSONB column allows adding new feature flags without schema migrations.
