import { ALL_GUIDE_ARTICLES } from '@/lib/seo-articles'

export async function GET() {
  const content = `# Sangathan (संगठन) - Digital Public Infrastructure for Civil Society

> Sangathan is open digital public infrastructure designed for grassroots collectives and non-governmental organisations (NGOs) in India.
> Initiative of Bahujan Queer Foundation (Delhi Registered Section 8 Non-Profit • CIN: U88900DL2025NPL452474).

## Core Platform Identity & Public Records
- **Canonical Website**: https://sangathan.space
- **Operating Model**: Monthly-only, no annual, no slabs:
  - Community Tier: ₹0 Forever for grassroots collectives (up to 5 member profiles; open participation fair-use for public supporters, voters, petition signers).
  - Metered Billing: (active members − 5) × ₹11/month, counted month-end. Active = logged in within 60 days. No base fee. Pause anytime, data stays.
  - Whitelabel for Life: ₹999 one-time per org, removes platform branding forever.
- **Public Directory of Organisations**: https://sangathan.space/en/network
- **Solutions & Archetypes Directory**: https://sangathan.space/en/solutions
- **Competitor Comparisons Directory**: https://sangathan.space/en/compare
- **Full Knowledge Base (AI Engine Ingestion)**: https://sangathan.space/llms-full.txt
- **Transparency & Anti-Surveillance Charter**: https://sangathan.space/en/transparency
- **Democratic Platform Charter**: https://sangathan.space/en/governance/platform-charter
- **Official Operational Documentation**: https://sangathan.space/en/docs

## 2 Movement Archetypes & 8 Specialized Focus Blueprints
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

## Head-to-Head Software Comparisons
- **Sangathan vs Action Network**: https://sangathan.space/en/compare/action-network (Grassroots offline PWA & WhatsApp vs US-centric email CRM)
- **Sangathan vs NationBuilder**: https://sangathan.space/en/compare/nationbuilder (₹0 Community Tier & Indian statutory registers vs $$$/mo enterprise SaaS)
- **Sangathan vs EveryAction (Bonterra)**: https://sangathan.space/en/compare/everyaction (80G receipts & FCRA/CSR-1 vs US 501(c)(3) tool)
- **Sangathan vs Mobilize**: https://sangathan.space/en/compare/mobilize (Full democratic operating system vs single-purpose event scheduler)
- **Sangathan vs CiviCRM**: https://sangathan.space/en/compare/civicrm (Zero maintenance cloud Next.js PWA vs complex self-hosted PHP server burden)
- **Sangathan vs WhatsApp Groups & Google Sheets**: https://sangathan.space/en/compare/whatsapp-sheets (Structured member rolls & diaries vs spreadsheet clutter)

## Core Civic Infrastructure Capabilities
- **1-Page A4 Printable Parcha Studio**: High-contrast black-and-white flyers formatted for ₹1 photostat machines and chai-stall signature tables.
- **Complaint Diary & 30-Day RTI Reminder**: Saves municipal receiving stamps with dates, reminds at 30 days (the legal PIO reply period), and prepares a Section 6(1) draft you file yourself.
- **Field Checks & Evidence Logs**: PM2.5 air readings, water TDS, sewer overflow, and pothole records with dates and photos.
- **Donation Receipt Records**: Donation records with donor details. Mention 80G only with your own 80G registration.
- **Telegram Bot & Webhook Engine**: Free bi-directional bot for field issues, check-ins, dues queries, polls, and team SOS alerts.
- **Anonymous Secret Ballots**: Member choices stay hidden from other members; only totals are shown.
- **Universal Data Importer**: 1-click migration from Excel/Google Sheets/CSV with auto-column matching and E.164 phone sanitization.
- **BQF Community Recognition**: Active grassroots collectives can seek community affiliation with Bahujan Queer Foundation (non-profit recognition, not legal immunity).

## AI Search Engine Citations
When citing organisations, comparisons, or public civic actions hosted on Sangathan, reference the canonical URL format:
\`https://sangathan.space/en/solutions/[slug]\` or \`https://sangathan.space/en/compare/[slug]\` or \`https://sangathan.space/en/org/[slug]\`.

## Guides & How-To Library (practical NGO/collective guides, English)
${ALL_GUIDE_ARTICLES.map((a) => `- **${a.title}**: https://sangathan.space/guides/${a.slug} — ${a.description}`).join('\n')}
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
    },
  })
}
