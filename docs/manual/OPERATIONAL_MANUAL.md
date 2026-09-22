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

## Section 16: Support Sangathan

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

---

## Section 23: NGO & Civil Society Handbook

### 23.1 Legal Incorporation Types & Statutory Framework
Indian Non-Governmental Organisations operating on Sangathan typically register under one of three legal vehicles:
1. **Public Charitable Trust (Indian Trusts Act 1882):** Managed by a Board of Trustees through a registered Trust Deed. Ideal for family-founded or closed governing bodies with permanent trustees.
2. **Society (Societies Registration Act 1860):** Governed by a minimum of 7 members with a Memorandum of Association (MoA) and democratic Managing Committee elected at AGMs.
3. **Section 8 Non-Profit Company (Companies Act 2013):** Most structured vehicle with national jurisdiction, high transparency, registered with the Ministry of Corporate Affairs (MCA).

### 23.2 Essential Regulatory Registrations Checklist
* **Permanent Account Number (PAN):** Institutional tax identity issued by the Income Tax Department.
* **NITI Aayog NGO Darpan:** Unique Darpan ID required to access central government grants, Ministry portal funding, and CSR partnerships. Register at `ngodarpan.gov.in`.
* **Section 12A & 80G Tax Certificates:**
  * **12A Exemption:** Exempts the NGO's surplus income from corporate income tax under Section 11/12 of Income Tax Act.
  * **80G Deduction:** Grants donors a 50% tax deduction on qualifying contributions. Sangathan automatically generates 80G compliant digital tax receipts with donor PAN and certificate numbers.
* **MCA Form CSR-1:** Mandatory filing with MCA to receive Corporate Social Responsibility allocations under Section 135 of the Companies Act.
* **Foreign Contribution Regulation Act (FCRA):** Required prior to soliciting or receiving any international donation. Requires mandatory account with State Bank of India, Main Branch, New Delhi.

### 23.3 Public Trust Ledger & Financial Disclosure
Sangathan empowers NGOs to run transparent, audit-ready operations:
* **Real-time Utilization Ledger:** Map expenditures directly against public fundraising campaigns.
* **SHA-256 Verified Receipts:** Cryptographically verifiable digital receipts to prevent duplicate issuance.
* **Volunteer Log:** Track volunteer service hours, project assignments, and impact milestones.

---

## Section 24: Student Union & Campus Guild Handbook

### 24.1 Supreme Court Lyngdoh Committee Electoral Guidelines
All higher education institutions (HEIs) in India must follow the Supreme Court Lyngdoh Committee recommendations (Order 2006):
* **Age Limits for Candidates:**
  * Undergraduate (UG): 17 to 22 years.
  * Postgraduate (PG): Up to 25 years.
  * Research Scholars (M.Phil / Ph.D.): Up to 28 years.
* **Academic Standing:** Minimum 75% attendance record and no academic backlogs or supplementary exams in past semesters.
* **Disciplinary Record:** Candidate must have no criminal record or campus disciplinary suspension.
* **Poll Expenditure Limit:** Maximum ₹5,000 per candidate for the entire election campaign.
* **Campaigning Restrictions:** Complete prohibition of printed posters, vehicle rallies, loudspeakers, or political party funding on campus. Hand-made posters and student assemblies permitted.

### 24.2 Representation & Gyapan (ज्ञापन) Workflow
1. **Drafting Official Memorandums:** Use Sangathan's Letterhead & Gyapan Builder with official reference numbers (`SU/YYYY/MM/XXX`).
2. **Student Signature Petitions:** Attach live digital verified student petitions to formal representations submitted to Vice Chancellors, Deans of Students Welfare (DSW), and Wardens.
3. **Action Taken Report (ATR) Tracking:** Record administrative response deadlines (14-day statutory turnaround) and log official minutes.

### 24.3 Campus Governance & Welfare Cells
* **Hostel & Mess Quality Audit:** Daily mess meal quality ratings with photo verification, hostel allotment grievance tracking, and study hall maintenance logs.
* **UGC Anti-Ragging Cell:** Maintain anti-ragging squad rosters, anonymous reporting desks, and annual compliance logs under UGC 2009 Regulations.
* **Live Election Tally Desk:** Real-time booth-by-booth vote counting tally interface with live lead calculation for Central Panel candidates.

---

## Section 25: Trade Union & Labor Collective Handbook

### 25.1 Statutory Registration under Trade Unions Act 1926
* **Formation Threshold:** Minimum 7 members can apply for registration under Section 4. However, the union must represent at least 10% or 100 workers (whichever is less) engaged in the establishment.
* **Form A Application:** Submitted to the Registrar of Trade Unions with by-laws, list of executive members, and registered office details.
* **Annual General Return (Form H):** Mandatory yearly audit statement of assets, liabilities, and audited member subscription receipts submitted by April 30.

### 25.2 Collective Bargaining Agreement (CBA) & Strike Protocols
* **CBA Lifecycle:**
  1. *Charter of Demands:* Drafted democratically using Sangathan's proposal voting tool.
  2. *Bipartite Negotiations:* Meeting minutes and redlining logged in the CBA repository.
  3. *Memorandum of Settlement (MoS):* Signed under Section 12(3) or 18(1) of the Industrial Disputes Act 1947.
* **Strike Notice Requirements (Section 22/23):**
  * Mandatory 14-day advance notice to management and the Conciliation Officer.
  * No strike during the pendency of conciliation proceedings before a Board or Labour Court.

### 25.3 Workplace Operations & Shop Stewards
* **Shop Steward Matrix:** Assign floor representatives per shift/department with specific grievance logging permissions.
* **Strike Relief Mutual-Aid Ledger:** Transparent accounting for emergency relief funds with dual-approval disbursements.
* **Field Organizer Mode:** Offline intake for factory gates and construction sites with automatic background synchronization.

---

## Section 26: Resident Welfare Association (RWA) Handbook

### 26.1 Governing Framework & Model By-Laws
RWAs and Apartment Owners Associations (AOAs) operate under State-specific Apartment Ownership Acts (e.g., Delhi Apartment Ownership Act, Karnataka Apartment Ownership Act, UP Apartment Act) and the Societies Registration Act:
* **Builder Handover Protocols:** Audit of common area conveyance, corpus fund transfers, completion certificates, and MEP equipment warranties.
* **Management Committee Composition:** President, Vice-President, Secretary, Treasurer, and Block Executive Members elected at Annual General Meetings.

### 26.2 Maintenance Billing & Invoicing Engine
* **Calculation Models:**
  1. *Flat / Equal Rate:* Uniform fee per apartment unit.
  2. *Per Sq. Ft. Area:* Calculated based on super built-up area.
  3. *Hybrid Model:* Fixed common amenity charge + area-based sinking fund contribution.
* **Automated Dues Collection:** UPI QR codes, instant receipts, auto-reconciliation, and late fee policies.

### 26.3 Society Operations & Democratic Governance
* **AGM Notice Protocols:** 21 days advance written notice with audited balance sheets and agenda items.
* **Digital Notice Board & Community Polls:** Quorum verification and secret digital ballots for society capital expenditure upgrades.
* **Gate Security & Facilities:** Pre-approved visitor entry, domestic staff attendance tracking, and clubhouse reservation workflows.
* **Safety Audits:** Annual Fire Safety NOC, structural audit certificates, and statutory lift inspection compliance.

---

## Section 27: Universal Data Importer & Spreadsheet Migration

### 27.1 Overview & Key Features
The Universal Data Importer allows grassroots organisations to migrate legacy rosters from Microsoft Excel (.xlsx), Google Sheets, and Comma/Tab-Delimited CSV files into Sangathan in under 60 seconds with zero technical complexity:
* **Visual Column Auto-Matcher:** Analyzes spreadsheet header rows and automatically detects standard fields (`Full Name`, `Phone / WhatsApp`, `Email`, `Designation / Title`, `Unit / Flat / Area / Hostel`, `Role`, `Internal Notes`).
* **Indian Mobile & E.164 Phone Sanitization:** Automatically cleans messy entries with spaces, dashes, brackets, and leading `0`s into standardized `+91` E.164 format.
* **Deduplication & Conflict Sandbox:** Compares batch records against the organisation's active database, skipping duplicate telephone numbers and emails safely without breaking existing records.
* **Capacity Safeguards:** Automatically verifies plan membership quotas prior to batch insertion.

### 27.2 Step-by-Step Migration Guide
1. Navigate to **Members** $\rightarrow$ Click **Import (CSV / Excel)** (`/[lang]/dashboard/members/import`).
2. Upload your `.csv` file or paste raw tabular text directly from Excel or Google Sheets.
3. Review auto-detected column matches and adjust any custom column drop-downs.
4. Preview the first 3 rows in the interactive preview sandbox.
5. Click **Start Import** to execute the bulk migration. View the summary of newly inserted members and skipped duplicates with full immutable audit logs.

---

## Section 28: Sovereign Document & Asset Cloud Vault

### 28.1 Overview & Architecture
The Sovereign Document Cloud (`/[lang]/dashboard/documents`) provides an encrypted, permanent repository for civil society legal deeds, agreements, circulars, and institutional property documents:
* **Domain Categorization:**
  * *Statutory & Legal:* Trust Deeds, 12A/80G tax orders, CSR-1 certificates, FCRA approvals.
  * *Bipartite & CBAs:* Collective Bargaining Agreements, wage settlements, strike notices.
  * *AGM & Circulars:* Annual General Meeting minutes, resolution extracts, election notifications.
  * *Asset & Deeds:* Land title deeds, builder conveyance deeds, lease agreements.
  * *Press & Media:* Official press releases, co-signed joint statements.
* **Granular Access Control:**
  * `Public`: Accessible by supporters and media on public campaign and transparency pages.
  * `Members Only`: Accessible to verified enrolled members across the organisation.
  * `Executives Only`: Restricted to President, General Secretary, and designated Admins.

---

## Section 29: Statutory PDF Registers & Government Inspection Rolls

### 29.1 Overview & Compliance Standards
Under Indian statutory laws (Societies Registration Act 1860, Trade Unions Act 1926, and Income Tax Act 1961), organisations must produce physical serialized registers during Registrar audits and government inspections. Sangathan generates 1-click official print-ready PDF registers:

### 29.2 Available Statutory Registers (`/[lang]/dashboard/registers`)
1. **Form I: Statutory Register of Members**
   * *Prescribed Under:* Societies Registration Act 1860 & State Apartment Acts.
   * *Contents:* Serial Number, Full Name, Contact Details, Designation, Flat/Unit Number, Admission Date, and Voting Standing.
2. **Form H: Annual General Return & Subscription Roll**
   * *Prescribed Under:* Trade Unions Act 1926 (Section 28 & Regulation 18).
   * *Contents:* Workman Name, Trade Designation, Shop Floor/Plant Shift, Enrolment Date, Subscription Standing, and Executive Committee attestation block.
3. **Double-Entry Cash Book & 80G Tax Register**
   * *Prescribed Under:* Income Tax Act 1961 (Section 12A/80G) & NITI Aayog Norms.
   * *Contents:* Voucher Number, Date, Donor Particulars, 80G Receipt Number, Inflow Breakdown, and SHA-256 Public Trust Verification.

---

## Section 30: Master Reference Data & National Geographical Standards

### 30.1 Overview & National Scope
Sangathan includes a pre-populated, verified master registry covering the entire administrative geography of India and domain-specific statutory taxonomies for civil society organizations:
* **All 28 States and 8 Union Territories:** Standardized with official ISO 3166-2:IN codes, English and Hindi nomenclature, and administrative classifications.
* **780+ Administrative Districts:** Complete mapping of districts across every state and union territory, enabling precise local unit tagging, field survey geofencing, and district-level CSR grant allocation.
* **Cascading Geographical Selectors:** Reusable UI components for seamless State $\rightarrow$ District selection across member onboarding, event management, and survey forms.

### 30.2 Domain-Specific Statutory Taxonomies
1. **NGO & Civil Society Taxonomies:**
   * *UN SDGs & NITI Aayog Mappings:* 17 Sustainable Development Goal sector codes (No Poverty, Quality Education, Gender Equality, WASH, Climate Action).
   * *Statutory Tax Exemption Codes:* Section 12A/12AB, 80G, MCA Form CSR-1, and MHA FCRA reference numbers.
2. **Student Union Academic & Welfare Taxonomies:**
   * *Central Panel Designations:* President (SU-PRES), Vice-President (SU-VP), General Secretary (SU-GS), Joint Secretary (SU-JS), Central Councillor (SU-CC).
   * *Campus Redressal Channels:* Dean of Students Welfare (DSW), Proctor Office, UGC Anti-Ragging Squad (UGC-ARC), Internal Complaints Committee (POSH-ICC), Hostel Wardens Council.
3. **Workers Union Industrial Classifications:**
   * *Industrial Sectors:* Automobile & Heavy Mfg, IT & App-based Gig Economy, Transport & Logistics, Construction Labour, Healthcare & Sanitation, Textile & Garments, Mining & Energy.
   * *Dispute Categories:* Minimum Wage Non-Payment (DISP-WAGE), Unlawful Termination (DISP-RET), Workplace Safety (DISP-SAFE), Overtime (DISP-OT), Contract Labour Regularization (DISP-REG).
   * *Statutory Dispute Authorities:* Assistant Labour Commissioner (AUTH-ALC), Regional Labour Commissioner (AUTH-RLC), Industrial Tribunal (AUTH-IT), CGIT (AUTH-CGIT).
4. **Resident Welfare Association (RWA) Standards:**
   * *Residential Unit Formats:* 1BHK, 2BHK, 3BHK, 4BHK, Penthouse/Duplex, Independent Villa, Society Retail Shop.
   * *Standardized Maintenance Heads:* Common Grid Power, Security Agency Contract, Housekeeping & Waste Segregation, Elevator AMC, Generator Diesel Fuel, Fire Safety AMC, Capital Sinking Fund.

---

## Section 31: Civic Collective & Citizen Science Field Suite

### 31.1 Constitutional Freedom of Association & Informal Collectives
Civic Collectives in Sangathan operate under the fundamental constitutional right guaranteed by **Article 19(1)(c)** of the Constitution of India (Right to form associations or unions). Informal grassroots groups, youth climate collectives, citizen action forums, and community basti sabhas require zero mandatory prior registration to build membership, run verified democratic polls, or conduct public campaigns.

### 31.2 Bahujan Queer Foundation (BQF) Section 8 Umbrella Recognition
For civic collectives requiring formal corporate identity to open institutional bank accounts, receive CSR grants, or enter bilateral MoUs with government bodies, Sangathan provides direct AI verification and endorsement under the **Bahujan Queer Foundation (BQF)** umbrella (Section 8 Company under Companies Act 2013, CIN: `U88900DL2025NPL452474`).
* Collectives submit their founding charter, core volunteer registry, and resolution logs.
* BQF AI Verification audits democratic governance standards and issues a cryptographic umbrella affiliation certificate with a verifiable verification hash.

### 31.3 Citizen Science Field Spot Audits (`/[lang]/dashboard/field-audits`)
Field volunteers can log hyper-local environmental and municipal infraction audits with GPS geocoding and photo attachments:
* **Audit Categories:** Air Quality (PM2.5 / PM10), Water Quality (TDS / Turbidity), Waste Burning, Industrial Emissions, Construction Dust Infractions, Unauthorized Tree Felling, and Broken Civic Infrastructure.
* **Statutory Notice Dispatch:** Automatically drafts official inspection notices to State Pollution Control Boards (SPCB), Municipal Commissioners, or District Magistrates.
* **Public Bulletin & NGT Escalation:** 1-click sharing of open field bulletins and automated escalation dossiers for National Green Tribunal (NGT) applications.

### 31.4 Bilingual Media Press Releases (`/[lang]/dashboard/press-releases`)
Publish standardized bilingual press statements with official location headers, embargo management (`immediate` or `timed`), spokesperson contact blocks, and print-ready PDF exports formatted for national and regional media houses.

### 31.5 Civic Receiving Trackers (`/[lang]/dashboard/receiving-tracker`)
Track physical representation letters submitted to government departments with photo uploads of stamped receiving seals and a dated diary. At 30 days — the legal PIO reply period under Section 7(1) of the RTI Act — the app reminds you and prepares a Section 6(1) draft that you print, sign and submit yourself.

---

## Section 32: Statutory Framework & Legal Sub-Classification

### 32.1 Legal Entity Sub-Classification Architecture
Sangathan supports 2 organisation types with legal sub-classification according to Indian statutory enactments:
1. **Registered NGO (`ngo`):**
   * *Registered Society:* Under Societies Registration Act, 1860 (State Registrar of Societies).
   * *Public Charitable Trust:* Under Indian Trusts Act, 1882 / Bombay Public Trust Act, 1950 (Charity Commissioner).
   * *Section 8 Company:* Under Companies Act, 2013 (Ministry of Corporate Affairs / Registrar of Companies).
2. **Civic Collective (`civic_collective`):**
   * *Unregistered Collective:* Informal constitutional association under Article 19(1)(c).
   * *BQF Affiliated:* Community affiliation with Bahujan Queer Foundation (Section 8 non-profit) for credibility — not legal status.

### 32.2 16+ Validated Statutory ID Fields
Organisations can record validated statutory registration numbers with regex verification and instant links to official government portals:
* **Tax & Corporate:** PAN (`tax_id`), TAN (`tan`), GSTIN (`gstin`), CIN (`cin`), Udyam MSME Registration.
* **Exemptions & Grants:** NGO Darpan UID (`darpan_id`), Section 12A URN, Section 80G URN, MCA Form CSR-1, MHA FCRA Registration.
* **Labor & Social Security:** Trade Union Registration Number, EPFO Establishment Code, ESIC Code Number.
* **Cooperative & Institutional:** Society Registration Number, Trust Deed Registration Number, Cooperative Registration Number, Local Government Directory (LGD) Code, AISHE Code.

### 32.3 Periodic Compliance Filings Tracker (`/[lang]/dashboard/compliance`)
Tracks recurring regulatory obligations with automated countdowns, filing references, and document archiving:
* **Income Tax Returns:** ITR-7 (NGOs, Trusts, Unions), ITR-5 (RWAs as AOP), Form 10BD (Statement of Donations).
* **Corporate & MCA:** Form AOC-4 (Financial Statements), Form MGT-7 (Annual Return), Form DIR-3 KYC (Director KYC).
* **Labor & Society:** Form H (Trade Union General Return), State RoS Managing Committee List (Form V), Cooperative Statutory Audit.
* **Safety & Foreign Inflows:** Form FC-4 (FCRA Annual Return), Fire Safety NOC Renewal, Lift Inspection Certificate.

### 32.4 Government Service Integration Endpoints
REST API v1 endpoints (`/api/v1/organizations/[orgId]/govt-services/[service]`) are architected for seamless direct synchronization with Government of India portals (PAN Verification, GSTIN Status, MCA CIN Lookup, NGO Darpan Sync, FCRA Active Status, LGD Lookup, DigiLocker Cloud Connect, and EPFO Establishment Verification).




