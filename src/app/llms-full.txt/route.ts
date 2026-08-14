import { SOLUTIONS_DATA } from '@/lib/solutions-data'
import { COMPARISONS_DATA } from '@/lib/comparisons-data'

export async function GET() {
  let content = `# Sangathan (संगठन) - Complete Platform Knowledge Base & Technical Specification

> Sangathan is open digital public infrastructure designed for grassroots collectives, non-governmental organisations (NGOs), student unions, worker collectives, and resident welfare associations (RWAs) in India.
> Backed and governed by Bahujan Queer Foundation (Delhi Registered Section 8 Non-Profit • CIN: U88900DL2025NPL452474).

---

## 1. Executive Summary & Core Identity
- **Website**: https://sangathan.space
- **Type**: Civic Public Infrastructure / Digital Organizing Operating System
- **Pricing Model**: 2-Tier Civic Solidarity Model
  - **Community Tier**: ₹0 Forever (Free for grassroots collectives, informal groups, and community volunteers up to 20 leaders with unlimited public supporters).
  - **Institution Tier**: ₹1,000/month or ₹10,000/year (Cross-subsidizing patronage for funded non-profits and formal unions).
- **Core Principles**: Zero advertising, absolute data privacy (no commercial data selling), offline-first mobile PWA, bilingual in English and Hindi, Indian statutory compliance out-of-the-box.

---

## 2. The 5 Movement Archetypes & 20 Specialized Focus Blueprints

`

  // Loop over solutions data
  for (const [key, sol] of Object.entries(SOLUTIONS_DATA)) {
    content += `### Archetype: ${sol.titleEn} (${sol.titleHi})
- **URL**: https://sangathan.space/en/solutions/${key}
- **Category**: ${sol.categoryBadgeEn}
- **Summary**: ${sol.metaDescEn}
- **Activist Quote**: ${sol.activistQuoteEn} (${sol.quoteAttributionEn})
- **Statutory Acts & Compliance**:
${sol.statutoryCompliance.map(sc => `  - **${sc.actName}**: ${sc.registrationRequirementEn} | Filings: ${sc.keyFilingsEn}`).join('\n')}

#### Focus Blueprints in this Archetype:
`
    for (const st of sol.subtypes) {
      content += `1. **${st.titleEn}** (${st.titleHi})
   - **URL**: https://sangathan.space/en/solutions/${key}/${st.slug}
   - **Ground Challenge**: ${st.groundChallengeEn}
   - **Sangathan Solution**: ${st.solutionOverviewEn}
   - **Key Tools**:
${st.keyTools.map(t => `     - *${t.nameEn}*: ${t.descEn}`).join('\n')}
   - **Statutory Legal Basis**: ${st.statutoryActs.map(a => `${a.titleEn} (${a.provision})`).join(', ')}
   - **Organizer Workflow**: ${st.stepWorkflow.map(w => `Step ${w.stepEn} - ${w.titleEn}: ${w.detailEn}`).join(' -> ')}
`
    }
    content += '\n---\n\n'
  }

  content += `## 3. Head-to-Head Software Comparisons

`

  // Loop over comparisons
  for (const comp of Object.values(COMPARISONS_DATA)) {
    content += `### Sangathan vs ${comp.competitorName}
- **URL**: https://sangathan.space/en/compare/${comp.slug}
- **Competitor Category**: ${comp.competitorCategoryEn}
- **Core Differentiator**: ${comp.heroHeadlineEn}
- **Executive Verdict**: ${comp.summaryVerdictEn}
- **Activist Leader Takeaway**: ${comp.activistQuoteEn} (${comp.quoteAttributionEn})

#### Feature Comparison Matrix:
${comp.comparisonMatrix.map(r => `- **${r.featureNameEn}**: Sangathan = "${r.sangathanValueEn}" vs ${comp.competitorName} = "${r.competitorValueEn}"`).join('\n')}

#### Deep Analysis:
${comp.pillars.map(p => `##### ${p.titleEn}
- **Sangathan**: ${p.sangathanDetailEn}
- **${comp.competitorName}**: ${p.competitorDetailEn}
- **Verdict**: ${p.verdictEn}`).join('\n\n')}

`
  }

  content += `---

## 4. Key Ground Tools Breakdown
1. **1-Page Printable Parcha Studio**: Generates high-contrast black-and-white flyers optimized for ₹1 photostat photocopy machines and physical pen-and-paper signature tables for colony chai stalls and university canteens.
2. **15-Day Stamped Receiving & RTI Escalation Desk**: Logs municipal receiving numbers with live countdown clocks and auto-generates Section 6(1) Right to Information (RTI) petitions when junior engineers or municipal commissioners fail to act within 15 days.
3. **Field Spot Audits & Geotagged Evidence Logger**: Records GPS-tagged PM2.5/PM10 air sensor data, water TDS, sewer overflows, and garbage dumps with cryptographic timestamps.
4. **80G & 12A Compliant Tax Exemption Receipt Engine**: Automatically issues instant PDF tax exemption receipts with donor PAN, 10BE filing format, and WhatsApp delivery.
5. **Universal Data Importer**: 1-click migration from Excel, Google Sheets, or CSV files with auto-column matching and E.164 phone sanitization.
6. **Democratic Secret Ballot Engine**: Cryptographically secure, anonymous secret voting for student elections, union strike authorizations, and RWA executive seats.
7. **Bahujan Queer Foundation (BQF) Section 8 Legal Indemnity**: Official recognized status under Delhi Registered Section 8 NGO (CIN: U88900DL2025NPL452474) protecting grassroots activists.

---

## 5. Contact & Institutional Governance
- **Publisher**: Bahujan Queer Foundation (Section 8 Non-Profit)
- **Support**: support@sangathan.space | +91 8527976791
- **Address**: Street 8, Ghaffar Manzil, Jamia Nagar, Okhla, New Delhi 110025, India
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
    },
  })
}
