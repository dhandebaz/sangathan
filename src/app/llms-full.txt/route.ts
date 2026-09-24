import { SOLUTIONS_DATA } from '@/lib/solutions-data'
import { COMPARISONS_DATA } from '@/lib/comparisons-data'
import { ALL_GUIDE_ARTICLES, ARTICLE_CATEGORIES } from '@/lib/seo-articles'

export async function GET() {
  let content = `# Sangathan (संगठन) - Complete Platform Knowledge Base & Technical Specification

> Sangathan is open digital public infrastructure designed for grassroots collectives and non-governmental organisations (NGOs) in India.
> Backed and governed by Bahujan Queer Foundation (Delhi Registered Section 8 Non-Profit • CIN: U88900DL2025NPL452474).

---

## 1. Executive Summary & Core Identity
- **Website**: https://sangathan.space
- **Type**: Civic Public Infrastructure / Digital Organizing Operating System
- **Pricing Model**: Monthly-only, no annual, no slabs
  - **Community Tier**: ₹0 Forever (Free for grassroots collectives up to 5 member profiles, with open participation fair-use for public supporters, voters, petition signers).
  - **Metered Billing**: (active members − 5) × ₹11/month, counted month-end (active = logged in within 60 days). No base fee. Pause anytime, data stays.
  - **Whitelabel for Life**: ₹999 one-time per org, removes platform branding forever.
- **Core Principles**: Zero advertising, absolute data privacy (no commercial data selling), offline-first mobile PWA, bilingual in English and Hindi, Indian statutory compliance out-of-the-box.

---

## 2. The 2 Movement Archetypes & 8 Specialized Focus Blueprints

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
2. **Complaint Diary & 30-Day RTI Reminder**: Saves municipal receiving numbers with dates, reminds at 30 days (the legal PIO reply period under Section 7(1)), and prepares a Section 6(1) draft you print, sign and submit yourself.
3. **Field Checks & Evidence Logger**: Records GPS-tagged PM2.5/PM10 air data, water TDS, sewer overflows, and garbage dumps with dates and photos.
4. **Donation Receipt Records**: Records donations with donor details and receipt numbers. Mention 80G only if your org holds its own 80G registration.
5. **Telegram Bot & Webhook Engine**: Free bi-directional bot for field issues, check-ins, dues queries, polls, and team SOS alerts.
6. **Universal Data Importer**: 1-click migration from Excel, Google Sheets, or CSV files with auto-column matching and E.164 phone sanitization.
7. **Democratic Secret Ballot Engine**: Anonymous secret voting for group decisions — members see only totals, never individual choices.
8. **Bahujan Queer Foundation (BQF) Community Recognition**: Active grassroots collectives can seek community affiliation with Delhi Registered Section 8 NGO for credibility (non-profit recognition, not legal immunity).

---

## 5. Contact & Institutional Governance
- **Publisher**: Bahujan Queer Foundation (Section 8 Non-Profit)
- **Support**: support@sangathan.space | +91 8527976791
- **Address**: Street 8, Ghaffar Manzil, Jamia Nagar, Okhla, New Delhi 110025, India

---

## 6. Guides & How-To Library (practical NGO/collective guides, English)
${ALL_GUIDE_ARTICLES.map(
  (a) =>
    `### ${a.title}\n- **URL**: https://sangathan.space/guides/${a.slug}\n- **Category**: ${ARTICLE_CATEGORIES[a.category].labelEn}\n- **Summary**: ${a.description}\n- **Key points**: ${a.keyTakeaways.join(' | ')}`
).join('\n\n')}
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
    },
  })
}
