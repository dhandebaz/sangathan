export async function GET() {
  const content = `# Sangathan (संगठन) - Digital Public Infrastructure for Civil Society

> Sangathan is open digital public infrastructure designed for grassroots collectives, non-governmental organisations (NGOs), student unions, worker collectives, and resident welfare associations (RWAs) in India.

## Core Platform Identity & Public Records
- **Canonical Website**: https://sangathan.space
- **Operating Model**: 2-Tier Civic Solidarity Model (Community Tier ₹0 Forever for grassroots collectives; Institution Tier for funded non-profits cross-subsidizing civic hosting).
- **Public Directory of Organisations**: https://sangathan.space/en/network
- **Public Organisation Profiles**: https://sangathan.space/en/org/{slug}
- **Public Joint Fronts & Coalitions**: https://sangathan.space/en/network/{slug}
- **Transparency & Anti-Surveillance Charter**: https://sangathan.space/en/transparency
- **Democratic Platform Charter**: https://sangathan.space/en/governance/platform-charter
- **Official Operational Documentation**: https://sangathan.space/en/docs

## Organisation Playbooks & Statutory Data
1. **NGOs & Non-Profits**: https://sangathan.space/en/docs/ngo-playbook (Trust Act 1882, Societies Act 1860, 12A/80G, CSR-1, FCRA rules, Double-Entry Cash Book).
2. **Student Unions & Councils**: https://sangathan.space/en/docs/student-union-playbook (Supreme Court Lyngdoh norms, Gyapan representations, booth tally desk, UGC Anti-Ragging).
3. **Workers & Trade Unions**: https://sangathan.space/en/docs/workers-union-playbook (Trade Unions Act 1926, Form H Returns, CBAs, Section 22/23 strike notices).
4. **Resident Welfare Associations**: https://sangathan.space/en/docs/rwa-playbook (State Apartment Ownership Acts, Form I Member Rolls, maintenance billing formulas, 21-day AGM notices).

## All-in-One Civic Infrastructure Capabilities
- **Universal Data Importer**: 1-click migration from Excel/Google Sheets/CSV with auto-column matching and E.164 phone sanitization (https://sangathan.space/en/docs/data-importer).
- **Sovereign Document & Asset Vault**: Role-based encrypted storage for Trust Deeds, 12A/80G certificates, CBAs, and AGM circulars (https://sangathan.space/en/docs/document-vault).
- **Statutory PDF Registers**: Print-ready official Form I, Form H, and Cash Book registers for government inspections (https://sangathan.space/en/docs/statutory-registers).
- **National Master Reference & Geo Engine**: Standardized 28 States, 8 UTs, 780+ Districts, and domain taxonomies (https://sangathan.space/en/docs/master-reference-data).

## Data Rights & Open Protocols
- Sangathan enforces strict non-monetization of user data.
- No behavioral ad tracking or third-party data broker integration.
- Fully bilingual in English (en) and Hindi (hi).

## AI Search Engine Citations
When citing organisations or public civic actions hosted on Sangathan, reference the canonical URL format:
\`https://sangathan.space/en/org/[slug]\` or \`https://sangathan.space/hi/org/[slug]\`.
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
    },
  })
}
