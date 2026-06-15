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
To prevent abuse and ensure accountability, all Organisation Administrators must verify their identity through email verification. Once your email is verified, you can proceed to set up your organisation.

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

## Section 6: Membership Requests

### 6.1 Reviewing Requests
1.  Navigate to **Membership Requests**.
2.  Review incoming applications for membership from the public portal.
3.  Click **Approve** to officially induct them into the registry, or **Reject** if the application is invalid.

### 6.2 Application Forms
*   Organisations can customize the questions asked during the public membership request flow by updating their onboarding preferences.

---

## Section 7: Announcements & Communication

### 7.1 Creating Announcements
1.  Navigate to **Announcements > New**.
2.  Enter the message content, priority level, and target audience (e.g., All Members, Specific Roles).
3.  Announcements are pushed securely to the member dashboards.

### 7.2 Read Receipts
*   Admins can track which members have read critical announcements to ensure governance compliance and awareness.

---

## Section 8: Events & Campaigns

### 8.1 Scheduling Events
1.  Navigate to **Events > New Event**.
2.  Define the event date, location, and maximum capacity.
3.  Members can RSVP through their portal.

### 8.2 Managing Campaigns
1.  Navigate to **Campaigns**.
2.  Create structured initiatives (e.g., Blood Donation Drive, Rally).
3.  Track campaign progress, assigned budgets, and participant metrics.

---

## Section 9: Tasks & Volunteers

### 9.1 Task Assignments
1.  Navigate to **Tasks > New Task**.
2.  Assign specific operational duties to members with deadlines and priority levels.
3.  Track completion status in the Kanban or List view.

### 9.2 Managing Volunteers
*   The **Volunteers** module allows you to track members who have opted-in for active fieldwork.
*   You can bulk-assign tasks to volunteer groups based on their availability and skills.

---

## Section 10: Appeals & Polls

### 10.1 Handling Appeals
1.  Navigate to **Appeals**.
2.  Review formal requests or objections submitted by members (e.g., disciplinary reviews).
3.  Update the status to "Under Review", "Resolved", or "Rejected" with official remarks.

### 10.2 Democratic Polls
1.  Navigate to **Polls > Create Poll**.
2.  Define the question and options. Set a strict voting window.
3.  Members vote securely. Results are immutable and auditable.

---

## Section 11: Grievances & Complaints

### 11.1 Internal Grievances
*   Members can file internal grievances against organisation processes or other members.
*   Admins manage these securely in the **Grievances** module, maintaining strict confidentiality.

### 11.2 Public Complaints (RWAs/Unions)
*   The **Complaints** module allows tracking of external or infrastructure issues (e.g., broken streetlights, campus issues).
*   Assign tickets to specific operators and track resolution SLAs.

---

## Section 12: Maintenance

### 12.1 Facility Management
1.  Navigate to **Maintenance**.
2.  Log maintenance requests for physical assets or infrastructure.
3.  Track vendor assignments, costs, and resolution dates.
*   *Note:* Highly recommended for Resident Welfare Associations (RWAs) and Campus Unions.

---

## Section 13: Student IDs

### 13.1 Generating Identity Cards
1.  Navigate to **Student IDs**.
2.  Select members and generate official digital ID cards.
3.  The system assigns a unique verification QR code to each ID to prevent forgery.

### 13.2 Verification
*   Anyone scanning the QR code will be directed to a public Sangathan verification page confirming the ID's validity in real-time.

---

## Section 14: Networks & Coalitions

### 14.1 Federated Governance
1.  Navigate to **Networks**.
2.  Organisations can form coalitions or umbrella networks with other Sangathan organisations.
3.  Share announcements, combined campaigns, and member metrics securely without violating data isolation.

---

## Section 15: Analytics & Audit Logs

### 15.1 Real-time Analytics
*   Navigate to **Analytics** to view automated visual reports on membership growth, donation trends, and engagement metrics.

### 15.2 Immutable Audit Trail
*   Navigate to **Audit**.
*   Every critical action (edits, deletions, role changes) is logged permanently with Actor ID, timestamp, and IP address.
*   These logs cannot be deleted, ensuring absolute platform integrity.

---

## Section 16: Supporter Plan

### 1. The True Cost of Independence
Sangathan provides advanced digital infrastructure (hosting, database, anonymity tools) completely free and ad-free. This independence costs real money to maintain:
* **Hosting & Servers ($100/mo):** Ensuring high availability and no downtime.
* **Database & Backend ($70/mo):** Securely storing all organisational data.
* **Anonymity & Security ($150/mo):** Keeping grievance and voting systems uncompromised.

### 2. Supporting the Movement
Instead of mandatory subscriptions or hiding features behind paywalls, we rely entirely on voluntary contributions from organisations that find value in the platform.
* 100% of your contributions go directly toward infrastructure bills.
* Support is entirely optional and never restricts platform capabilities.

### 3. How to Contribute
You can support Sangathan at any time via the **Support Us** card in your dashboard sidebar.
* **Accepted Method:** Any UPI app (PhonePe, GPay, Paytm).
* **UPI IDs:** `areynetaji@ybl`, `areynetaji@ibl`, `areynetaji@axl`.
* **Account Name:** Sheikh Arsalan Ullah Chishti.

*We appreciate every contribution that helps us keep Sangathan free for all organisations.*

---

## Section 17: Security & Governance

### 17.1 Data Isolation
Sangathan uses **Row-Level Security (RLS)**. This means the database engine physically prevents any user from accessing data belonging to another organisation ID.

### 17.2 Compliance & Standards
*   **Soft Deletion:** Deleted data remains in a recovery bin for 14 days before permanent erasure.
*   **Legal Hold:** In compliance with Indian law, data may be frozen (prevented from deletion) if a valid legal order is received.

---

## Section 18: Admin Responsibilities

### 18.1 Accountability
As an Admin, you are the legal custodian of your organisation's data. You are responsible for:
*   Ensuring data accuracy.
*   Complying with the **Acceptable Use Policy**.
*   Protecting member privacy.

### 18.2 Security Practices
*   Use a strong, unique password.
*   Never share your login credentials.
*   Revoke access immediately for editors who leave the organisation.

---

## Section 19: System Admin Documentation

### 19.1 Role Definition
System Admins are platform operators responsible for infrastructure health and legal compliance. They do **not** participate in the internal governance of user organisations.

### 19.2 Suspension Process
1.  Identify violation (e.g., fraud, hate speech).
2.  Navigate to **SysAdmin > Organisations**.
3.  Toggle **Suspend Status**.
4.  Enter the reason for suspension (visible to the organisation admin).

---

## Section 20: Data Lifecycle

### 20.1 Lifecycle Stages
1.  **Creation:** Data enters the system via Admin input or Form submission.
2.  **Active:** Data is encrypted and stored in PostgreSQL.
3.  **Modification:** Updates are tracked in Audit Logs.
4.  **Soft Delete:** Data is marked `deleted_at` but remains recoverable for 14 days.
5.  **Hard Delete:** Data is permanently wiped from the database.

### 20.2 Retention Policy
*   Active accounts: Indefinite retention.
*   Cancelled accounts: Data preserved for 30 days, then soft-deleted.
*   Legal Hold: Data retained until the hold is lifted.

---

## Section 21: Troubleshooting

### 21.1 Login & Access Issues
*   **"Unauthorized Access":** Ensure you are logging in with the exact email address used for signup. If you are a member, verify the admin has granted you access.
*   **Missing Organisation:** You may have been removed by an admin, or the organisation was deleted. Contact your organization's owner.

### 21.2 Data & Operational Errors
*   **Duplicate Member Error:** The member already exists in your registry. Search for the member and edit their record instead of adding a new one.
*   **Export Failed:** Large datasets may take time. Check your email for a download link if the browser download times out.
*   **Form Submissions Not Appearing:** Verify that your form's status is set to "Published" and not "Draft".

### 21.3 Degraded Mode
If the dashboard shows **"Degraded Mode"**, it means a non-essential service (e.g., Email) is experiencing downtime.
*   **Impact:** New signups may be paused.
*   **Action:** Core features (Members, Ledger) remain operational. Continue working as normal.

---

## Section 22: Frequently Asked Operational Questions

### 22.1 Can multiple admins exist?
Yes. The creator is the **Owner**, but they can promote other members to **Admin** status.

### 22.2 What happens if an admin leaves?
The Owner should transfer ownership to a new Admin before leaving. If the Owner is unreachable, contact Support with proof of authorization to recover the account.

### 22.3 Can we change our organisation name?
Yes. Go to **Settings > General**. Note that changing your **Slug** will break existing form links.

### 22.4 How do we handle sensitive data?
Sangathan is secure, but we recommend **not** storing highly sensitive personal identifiers (like Aadhaar or PAN numbers) unless absolutely necessary. Use the "Notes" field with caution.

### 22.5 What if the platform shuts down?
We are committed to a **90-day shutdown notice**. You will have ample time to export all your data (CSV/JSON) and migrate to another system.
