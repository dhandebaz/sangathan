# Sangathan Platform Documentation

## Section 1: Getting Started

### 1.1 What is Sangathan?
Sangathan is an enterprise-grade governance infrastructure platform designed for NGOs, student unions, and community collectives. It provides a secure, structured environment to manage members, meetings, donations, and internal governance processes.

### 1.2 Platform Philosophy
Sangathan operates on an **infrastructure-first** philosophy. We provide neutral, reliable tools for governance without enforcing political or ideological constraints. The platform emphasizes:
*   **Data Sovereignty:** You own your data.
*   **Integrity:** Immutable audit logs ensure accountability.
*   **Resilience:** Built to withstand operational chaos.

### 1.3 Creating an Organisation
To start using Sangathan, you must create an organisation workspace.
1.  Navigate to the **Sign Up** page.
2.  Enter your **Email Address** and create a secure password.
3.  Complete the **Email Verification** process by clicking the link sent to your inbox.
4.  Enter your **Organisation Name** and **Slug** (a unique URL identifier).

### 1.4 Admin Verification
To prevent abuse and ensure accountability, all Organisation Administrators must verify their identity.
1.  After email verification, you will be prompted to enter your **Mobile Number**.
2.  An OTP (One-Time Password) will be sent via SMS.
3.  Enter the OTP to complete verification.
*   *Note:* This number is stored securely and used only for account recovery and security verification. It is never sold or used for marketing.

### 1.5 First Login & Dashboard
Upon logging in, you will see the **Admin Dashboard**. This is your command center.
*   **Overview Stats:** Total members, recent donations, and active forms.
*   **Quick Actions:** Shortcuts to add members or create meetings.
*   **System Status:** Indicators for platform health (e.g., "Operational" or "Degraded").

### 1.6 User Roles
Sangathan enforces Role-Based Access Control (RBAC):
*   **Admin:** Full access. Can manage settings, billing, and delete data.
*   **Editor:** Can manage members, forms, and meetings. Cannot access billing or delete the organisation.
*   **Viewer:** Read-only access to member lists and reports. Cannot edit data.

### 1.7 Security Overview
*   **Isolation:** Your data is physically isolated from other organisations using Row-Level Security (RLS).
*   **Encryption:** All data is encrypted at rest and in transit.
*   **Audit Logs:** All critical actions are recorded permanently.

---

## Section 2: Members Module

### 2.1 Adding a Member
1.  Navigate to **Members > Add Member**.
2.  Enter **Full Name**, **Phone Number**, and **Role**.
3.  Click **Save**.
*   *Note:* Phone numbers must be unique within your organisation to prevent duplicates.

### 2.2 Editing & Status
*   **Edit:** Click the "Edit" icon next to a member to update their details.
*   **Status:** Toggle a member's status between **Active** and **Inactive**. Inactive members are preserved in the database but cannot be added to meetings.

### 2.3 Search & Filter
*   Use the search bar to find members by **Name** or **Phone**.
*   Use filters to view only **Active** or **Inactive** members.
*   The list is paginated (20 members per page) for performance.

### 2.4 Exporting Data
1.  Navigate to **Members**.
2.  Click the **Export CSV** button.
3.  The file will download automatically. This ensures you always have a local backup of your registry.

### 2.5 Best Practices
*   Regularly audit your member list.
*   Mark members as "Inactive" rather than deleting them to preserve historical meeting attendance records.

---

## Section 3: Forms System

### 3.1 Creating a Form
1.  Navigate to **Forms > Create New**.
2.  Enter a **Title** and **Description**.
3.  Add fields using the drag-and-drop builder.
*   **Field Types:** Text, Number, Email, Phone, Checkbox, Dropdown.

### 3.2 Public Sharing
*   Once published, a form generates a unique **Public URL**.
*   Share this link via WhatsApp, Email, or Social Media.
*   Submissions are automatically linked to your organisation database.

### 3.3 Managing Submissions
*   **View:** Click on a form to see a table of all submissions.
*   **Filter:** Sort submissions by date or specific field values.
*   **Export:** Download all submissions as a CSV file for external analysis.

### 3.4 Spam Protection
*   Sangathan employs **Rate Limiting** to prevent automated bot attacks.
*   If a form receives an unusual spike in traffic, CAPTCHA challenges may be automatically enabled.

---

## Section 4: Meetings System

### 4.1 Creating a Meeting
1.  Navigate to **Meetings > Schedule**.
2.  Enter **Title**, **Date**, **Time**, and **Agenda**.
3.  **Video Link:** The system automatically generates a secure **Jitsi Meet** link. You may also paste a Zoom or Google Meet link manually.

### 4.2 Attendance Tracking
1.  During or after the meeting, open the meeting record.
2.  Search for members and mark them as **Present**, **Absent**, or **Excused**.
3.  This data updates the member's engagement history.

### 4.3 Meeting Notes
*   Use the **Minutes** section to record decisions and action items.
*   Notes are immutable after 24 hours to ensure the integrity of the record.

---

## Section 5: Donations System

### 5.1 Overview
The Donations module is a **Ledger**, not a payment processor. It tracks offline and online payments to maintain financial transparency.

### 5.2 Logging a Donation
1.  Navigate to **Donations > Log Donation**.
2.  Enter **Donor Name**, **Amount**, **Date**, and **Payment Method** (Cash, UPI, Bank Transfer).
3.  **UPI Reference:** Enter the transaction ID for verification.

### 5.3 Verification Process
*   Editors should manually verify the funds have hit the bank account before marking a donation as **Verified**.
*   Unverified donations are flagged in the dashboard.

### 5.4 Transparency
*   Admins can generate a **Financial Report** (PDF/CSV) to share with members.
*   *Disclaimer:* Sangathan does not hold funds. The organisation is solely responsible for tax compliance and legal reporting.

---

## Section 6: Supporter Plan

### 6.1 Overview
The Supporter Plan is an optional, voluntary subscription (₹99/month) to support the platform's infrastructure costs. It does **not** unlock core governance features, which remain free.

### 6.2 Benefits
*   **Supporter Badge:** Displayed on your organisation profile.
*   **Branding Removal:** Option to hide "Powered by Sangathan" on public forms.

### 6.3 Management
*   **Subscribe:** Go to **Settings > Billing** and checkout via Razorpay.
*   **Cancel:** You may cancel at any time. Benefits persist until the end of the billing cycle.
*   **Refunds:** A 7-day money-back guarantee applies to the first month's payment.

---

## Section 7: Security & Governance

### 7.1 Data Isolation
Sangathan uses **Row-Level Security (RLS)**. This means the database engine physically prevents any user from accessing data belonging to another organisation ID.

### 7.2 Audit Logging
Every critical action is logged in the **Audit Trail**.
*   **Who:** The user (Actor ID).
*   **What:** The action (e.g., "Deleted Member").
*   **When:** Exact timestamp.
*   **IP Address:** Origin of the request.
*   *Note:* Audit logs cannot be deleted by Admins.

### 7.3 Compliance
*   **Soft Deletion:** Deleted data remains in a recovery bin for 14 days before permanent erasure.
*   **Legal Hold:** In compliance with Indian law, data may be frozen (prevented from deletion) if a valid legal order is received.

---

## Section 8: Admin Responsibilities

### 8.1 Accountability
As an Admin, you are the legal custodian of your organisation's data. You are responsible for:
*   Ensuring data accuracy.
*   Complying with the **Acceptable Use Policy**.
*   Protecting member privacy.

### 8.2 Security Practices
*   Use a strong, unique password.
*   Never share your OTP or login credentials.
*   Revoke access immediately for editors who leave the organisation.

---

## Section 9: System Admin Documentation

### 9.1 Role Definition
System Admins are platform operators responsible for infrastructure health and legal compliance. They do **not** participate in the internal governance of user organisations.

### 9.2 Suspension Process
1.  Identify violation (e.g., fraud, hate speech).
2.  Navigate to **SysAdmin > Organisations**.
3.  Toggle **Suspend Status**.
4.  Enter the reason for suspension (visible to the organisation admin).

### 9.3 Incident Review
System Admins monitor:
*   **Rate Limits:** Spikes in traffic indicating attacks.
*   **Error Logs:** System-wide failures.
*   **Abuse Reports:** Flags raised by users.

---

## Section 10: Data Lifecycle

### 10.1 Lifecycle Stages
1.  **Creation:** Data enters the system via Admin input or Form submission.
2.  **Active:** Data is encrypted and stored in PostgreSQL.
3.  **Modification:** Updates are tracked in Audit Logs.
4.  **Soft Delete:** Data is marked `deleted_at` but remains recoverable for 14 days.
5.  **Hard Delete:** Data is permanently wiped from the database.

### 10.2 Retention Policy
*   Active accounts: Indefinite retention.
*   Cancelled accounts: Data preserved for 30 days, then soft-deleted.
*   Legal Hold: Data retained until the hold is lifted.

---

## Section 11: Troubleshooting

### 11.1 Common Issues
*   **OTP Not Received:** Check network signal. Wait 60 seconds and retry. If persistent, contact support.
*   **Duplicate Member Error:** The phone number already exists in your registry. Search for the member and edit their record instead of adding a new one.
*   **Export Failed:** Large datasets may take time. Check your email for a download link if the browser download times out.

### 11.2 Degraded Mode
If the dashboard shows **"Degraded Mode"**, it means a non-essential service (e.g., Email or SMS) is experiencing downtime.
*   **Impact:** New signups may be paused.
*   **Action:** Core features (Members, Ledger) remain operational. Continue working as normal.

---

## Section 12: Frequently Asked Operational Questions

### 12.1 Can multiple admins exist?
Yes. The creator is the **Owner**, but they can promote other members to **Admin** status.

### 12.2 What happens if an admin leaves?
The Owner should transfer ownership to a new Admin before leaving. If the Owner is unreachable, contact Support with proof of authorization to recover the account.

### 12.3 Can we change our organisation name?
Yes. Go to **Settings > General**. Note that changing your **Slug** will break existing form links.

### 12.4 How do we handle sensitive data?
Sangathan is secure, but we recommend **not** storing highly sensitive personal identifiers (like Aadhaar or PAN numbers) unless absolutely necessary. Use the "Notes" field with caution.

### 12.5 What if the platform shuts down?
We are committed to a **90-day shutdown notice**. You will have ample time to export all your data (CSV/JSON) and migrate to another system.
