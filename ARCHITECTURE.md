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

## 5. Future Extensibility

The architecture supports future growth via:
*   **API Layer**: Modular service functions in `src/lib/supabase/service.ts` can be exposed via API routes.
*   **Plugin Ecosystem**: The `capabilities` JSONB column allows adding new feature flags without schema migrations.
