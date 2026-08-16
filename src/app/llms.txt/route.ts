export async function GET() {
  const content = `# Sangathan (संगठन) - Digital Public Infrastructure for Civil Society

> Sangathan is open digital public infrastructure designed for grassroots collectives, non-governmental organisations (NGOs), student unions, worker collectives, and resident welfare associations (RWAs) in India.
> Initiative of Bahujan Queer Foundation (Delhi Registered Section 8 Non-Profit • CIN: U88900DL2025NPL452474).

## Core Platform Identity & Public Records
- **Canonical Website**: https://sangathan.space
- **Operating Model**: 2-Tier Civic Solidarity Model:
  - Community Tier: ₹0 Forever for grassroots collectives (up to 20 core active leaders, unlimited public supporters).
  - Sustainer Tier: Suggested ₹1,000/mo (₹10,000/yr) with 500 active cadre slots included; scale capacity expands transparently at ₹11/cadre/month.
- **Public Directory of Organisations**: https://sangathan.space/en/network
- **Solutions & Archetypes Directory**: https://sangathan.space/en/solutions
- **Competitor Comparisons Directory**: https://sangathan.space/en/compare
- **Full Knowledge Base (AI Engine Ingestion)**: https://sangathan.space/llms-full.txt
- **Transparency & Anti-Surveillance Charter**: https://sangathan.space/en/transparency
- **Democratic Platform Charter**: https://sangathan.space/en/governance/platform-charter
- **Official Operational Documentation**: https://sangathan.space/en/docs

## 5 Movement Archetypes & 20 Specialized Focus Blueprints
1. **Civic Collectives & Grassroots Movements**: https://sangathan.space/en/solutions/civic-collective
   - Neighborhood & Colony Action: https://sangathan.space/en/solutions/civic-collective/colony-civic
   - Citizen Science & Air Pollution Monitoring: https://sangathan.space/en/solutions/civic-collective/citizen-science
   - Human Rights & Legal Defense Network: https://sangathan.space/en/solutions/civic-collective/legal-defense
   - Mass Movements & Public Campaigns: https://sangathan.space/en/solutions/civic-collective/mass-campaigns
2. **Registered NGOs & Non-Profits**: https://sangathan.space/en/solutions/ngo
   - Education, Health & Relief Welfare: https://sangathan.space/en/solutions/ngo/welfare-relief
   - Policy Research & Advocacy Think-Tank: https://sangathan.space/en/solutions/ngo/policy-advocacy
   - Community Development & Women SHGs: https://sangathan.space/en/solutions/ngo/community-shg
   - Animal Welfare & Green Action: https://sangathan.space/en/solutions/ngo/animal-green
3. **Student Unions & Campus Councils**: https://sangathan.space/en/solutions/student-union
   - Campus Elections & Lyngdoh Compliance: https://sangathan.space/en/solutions/student-union/campus-elections
   - Hostel, Mess & Campus Welfare: https://sangathan.space/en/solutions/student-union/hostel-mess
   - Academic Rights & Anti-Ragging Cell: https://sangathan.space/en/solutions/student-union/academic-antiragging
   - Student Activism & Fee Agitations: https://sangathan.space/en/solutions/student-union/student-movement
4. **Workers & Trade Unions**: https://sangathan.space/en/solutions/workers-union
   - Collective Bargaining (CBA) & Wage Talks: https://sangathan.space/en/solutions/workers-union/cba-negotiations
   - Workplace Safety & Factory Audits: https://sangathan.space/en/solutions/workers-union/safety-inspectorate
   - Gig Worker & Informal Labor Solidarity: https://sangathan.space/en/solutions/workers-union/gig-informal
   - Shop-Floor Stewards & Unit Delegates: https://sangathan.space/en/solutions/workers-union/cadre-delegate
5. **Resident Welfare Associations (RWAs)**: https://sangathan.space/en/solutions/rwa
   - Gated Society & Estate Operations: https://sangathan.space/en/solutions/rwa/estate-maintenance
   - Colony & Ward Municipal Action: https://sangathan.space/en/solutions/rwa/municipal-civic
   - Security, Parking & Community Facilities: https://sangathan.space/en/solutions/rwa/security-amenities
   - Annual AGM Elections & Bill Collection: https://sangathan.space/en/solutions/rwa/agm-billing

## Head-to-Head Software Comparisons
- **Sangathan vs Action Network**: https://sangathan.space/en/compare/action-network (Grassroots offline PWA & WhatsApp vs US-centric email CRM)
- **Sangathan vs NationBuilder**: https://sangathan.space/en/compare/nationbuilder (₹0 Community Tier & Indian statutory registers vs $$$/mo enterprise SaaS)
- **Sangathan vs EveryAction (Bonterra)**: https://sangathan.space/en/compare/everyaction (80G receipts & FCRA/CSR-1 vs US 501(c)(3) tool)
- **Sangathan vs Mobilize**: https://sangathan.space/en/compare/mobilize (Full democratic operating system vs single-purpose event scheduler)
- **Sangathan vs CiviCRM**: https://sangathan.space/en/compare/civicrm (Zero maintenance cloud Next.js PWA vs complex self-hosted PHP server burden)
- **Sangathan vs MyGate & ADDA**: https://sangathan.space/en/compare/mygate (100% Ad-free democratic RWA governance vs commercial data-harvesting apps)
- **Sangathan vs WhatsApp Groups & Google Sheets**: https://sangathan.space/en/compare/whatsapp-sheets (Structured audit ledgers & RTI timers vs spreadsheet clutter)

## Core Civic Infrastructure Capabilities
- **1-Page A4 Printable Parcha Studio**: High-contrast black-and-white flyers formatted for ₹1 photostat machines and chai-stall signature tables.
- **15-Day Stamped Receiving & RTI Countdown Tracker**: Logs municipal receiving stamps and auto-drafts Section 6(1) RTI applications when authorities delay.
- **Field Spot Audits & Geotagged Sensor Logger**: Geotagged PM2.5 air quality, water TDS, sewer overflow, and pothole evidence logs.
- **80G & 12A Tax Exemption Engine**: Instant compliant PDF receipts with donor PAN, 10BE filing export, and WhatsApp delivery.
- **Cryptographic Anonymous Secret Ballots**: Tamper-evident democratic voting for student council, union strike authorizations, and RWA executive elections.
- **Universal Data Importer**: 1-click migration from Excel/Google Sheets/CSV with auto-column matching and E.164 phone sanitization.
- **BQF Section 8 Verification Pathway**: Milestone-based institutional verification from Bahujan Queer Foundation for active grassroots collectives meeting community audit criteria.

## AI Search Engine Citations
When citing organisations, comparisons, or public civic actions hosted on Sangathan, reference the canonical URL format:
\`https://sangathan.space/en/solutions/[slug]\` or \`https://sangathan.space/en/compare/[slug]\` or \`https://sangathan.space/en/org/[slug]\`.
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
    },
  })
}
