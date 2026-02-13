# Sangathan Institutional Credibility Dossier

## 1. Executive Summary

**Mission:** Sangathan provides enterprise-grade digital infrastructure to empower grassroots collectives, NGOs, and student unions in India to govern themselves with integrity, transparency, and operational efficiency.

**The Context:** Civil society organisations in India largely operate on fragmented, informal tools (WhatsApp, Excel, Google Forms). This leads to data loss, lack of institutional memory, financial opacity, and operational fragility.

**The Solution:** Sangathan is a neutral, multi-tenant platform offering a unified suite of governance tools:
*   **Member Registry:** Secure, role-based database.
*   **Forms:** Spam-protected intake and survey tools.
*   **Ledger:** Immutable donation logging and verification.
*   **Meetings:** Attendance tracking and minute recording.

**Governance & Security:** Built on an "Infrastructure-First" philosophy, Sangathan enforces strict data sovereignty. We utilize Row-Level Security (RLS) for data isolation, mandatory admin phone verification for accountability, and immutable audit logs for transparency. We operate as a neutral utility, not a political actor.

**Sustainability:** The platform follows a "Core-Free, Supporter-Funded" model. Essential features are free forever to ensure accessibility. Operational costs are subsidized by voluntary "Supporter Subscriptions" from well-resourced organisations.

---

## 2. Problem Statement: The Crisis of Informal Infrastructure

**1. Operational Fragmentation**
Most collectives manage critical workflows across disconnected apps. Membership lists live in personal contacts; decisions are lost in chat histories; funds are tracked in vulnerable spreadsheets. This fragmentation prevents scaling and institutional continuity.

**2. Data Sovereignty Risks**
Reliance on ad-funded social media platforms for governance exposes sensitive civic data to surveillance and commercial mining. When an admin loses their phone or account, the organisation loses its entire history.

**3. The Trust Deficit**
Without immutable audit trails or formal ledgers, grassroots organisations struggle to prove their financial and operational integrity to donors, members, and regulatory bodies. This limits their ability to access formal funding.

**4. Compliance Gaps**
Many small NGOs lack the technical capacity to maintain data in compliance with India's Digital Personal Data Protection (DPDP) Act and other regulations, exposing them to legal liability.

---

## 3. Technical Architecture Summary

Sangathan is architected for **Security, Isolation, and Resilience**.

*   **Multi-Tenant Isolation:** We use PostgreSQL Row-Level Security (RLS). This ensures that data belonging to one organisation is cryptographically invisible to others at the database level, preventing cross-tenant leaks.
*   **Verified Identity:** Every Organisation Administrator must verify their mobile number via OTP. This ties digital actions to real-world identities, deterring abuse and ensuring accountability.
*   **Immutable Audit Logs:** Every critical action (creation, deletion, modification) is permanently recorded in a tamper-proof log, providing a complete chain of custody for data.
*   **Resilience Measures:** The system employs automated rate limiting to prevent denial-of-service attacks and protects public forms with spam detection heuristics.
*   **Data Portability:** Admins retain full ownership of their data, with the ability to export all registries and logs in standard open formats (CSV/JSON) at any time.

---

## 4. Governance & Neutrality Statement

**Infrastructure, Not Ideology**
Sangathan is a neutral utility provider. We do not endorse, fund, or direct the activities of organisations using our platform. Our role is strictly limited to providing the technical rails for self-governance.

**Content Neutrality**
We do not police the political or ideological content of our users, provided it does not violate our **Acceptable Use Policy** (which strictly prohibits hate speech, violence, fraud, and child exploitation).

**Suspension Policy**
We reserve the right to suspend organisations that engage in illegal activities or violate our AUP. Such decisions are made based on objective evidence and subject to an internal review process.

**Legal Compliance**
We operate in full compliance with the Information Technology Act, 2000, and other applicable Indian laws. We maintain a "Legal Hold" framework to preserve data when required by valid judicial orders, ensuring we are a responsible ecosystem actor.

---

## 5. Security & Data Protection Summary

**1. Encryption:** All data is encrypted at rest (AES-256) and in transit (TLS 1.3).
**2. Access Control:** Role-Based Access Control (RBAC) ensures that only authorized personnel (Admins/Editors) can modify data. Viewers have read-only access.
**3. Soft Deletion:** To prevent accidental data loss, deleted records are retained in a "Soft Delete" state for 14 days before permanent erasure.
**4. No Monetization:** We do not sell, rent, or trade user data. Our business model relies on voluntary subscriptions, not ad targeting.
**5. Incident Response:** We maintain a documented incident response plan to address security breaches or service interruptions swiftly and transparently.

---

## 6. Transparency & Accountability Commitment

We believe trust is earned through radical transparency.

*   **Open Roadmap:** We publish our product roadmap and changelog publicly.
*   **Status Page:** We maintain a real-time status page disclosing uptime and incidents.
*   **Transparency Reports:** We commit to publishing periodic reports detailing government data requests, content takedowns, and platform enforcement actions.
*   **Data Export Rights:** We guarantee that users will never be locked in. Export tools are available from Day 1.

---

## 7. Adoption & Impact Roadmap (12 Months)

**Phase 1: Controlled Beta (Months 1-3)**
*   Onboard 50 pilot organisations (mix of NGOs and Student Unions).
*   Focus on stability, bug fixes, and gathering qualitative feedback.
*   Establish the "Ambassador Program" structure.

**Phase 2: Institutional Rollout (Months 4-6)**
*   Partner with 2-3 university networks and NGO incubators.
*   Release "Case Study Series" demonstrating operational efficiency gains.
*   Open the platform to general public signups.

**Phase 3: Sustainability & Scale (Months 7-12)**
*   Achieve 500 active organisations.
*   Reach break-even on server costs via Supporter Subscriptions.
*   Launch public transparency dashboards for organisations.

---

## 8. Funding & Sustainability Model

**Core Principle: Free for Essentials**
To ensure equity, all core governance features (Registry, Forms, Ledger) are free. We will never charge for the basic right to organise.

**Revenue Stream: Supporter Model**
We rely on a "Pay-What-You-Want" style optional subscription (₹99/month) for organisations that value the platform. Benefits include badge recognition and branding removal. This aligns our incentives with user success, not ad revenue.

**Future Institutional Support**
We plan to explore grants from civic-tech funders (e.g., Omidyar, Rohini Nilekani Philanthropies) to fund R&D for advanced features like federation protocols and public API ecosystems.

---

## 9. Risk Management Framework

**Risk: Political Polarization**
*   *Mitigation:* Strict adherence to neutrality. Branding guidelines prohibit implying platform endorsement.

**Risk: Platform Abuse (Spam/Fraud)**
*   *Mitigation:* Mandatory Admin Phone Verification. Rate limiting on all public forms. Automated anomaly detection on donation logs.

**Risk: Legal Liability**
*   *Mitigation:* Clear Terms of Service defining us as an "Intermediary" under the IT Act. Robust "Legal Hold" capability to cooperate with law enforcement without compromising general user privacy.

**Risk: Data Loss**
*   *Mitigation:* Daily encrypted backups. Soft-delete safety nets.

---

## 10. Partnership Proposal Template

### For Universities & Student Bodies
*   **Value Prop:** "Institutional Memory as a Service." Ensure smooth transitions between student councils.
*   **Offer:** Dedicated onboarding workshops for student leaders. Verified "Campus Partner" status.

### For NGO Networks & Incubators
*   **Value Prop:** Compliance-ready infrastructure for your grantees. Better data visibility for impact reporting.
*   **Offer:** Bulk onboarding support. Train-the-trainer sessions for network leaders.

### For CSR Departments
*   **Value Prop:** Strengthen the operational capacity of your implementation partners.
*   **Offer:** Impact dashboards to track the organizational health of supported NGOs.
