import type { SeoArticle } from './types'

/**
 * REFERENCE EXAMPLE ONLY — never imported by the registry.
 * Copy this shape exactly when writing batch files.
 */
export const EXAMPLE_ARTICLE: SeoArticle = {
  slug: 'how-to-verify-ngo-80g-certificate-genuine',
  title: 'How to Check if an NGO\u2019s 80G Certificate Is Genuine (2026)',
  description:
    'Before you donate, verify the NGO\u2019s 80G approval on the Income Tax portal, match the receipt details, and confirm the approval is still valid.',
  keywords: [
    'verify 80g certificate',
    'check ngo 80g genuine',
    '80g approval validity check',
    'income tax exempt institutions search',
    'fake ngo donation receipt india',
  ],
  category: 'fundraising',
  datePublished: '2026-09-24',
  keyTakeaways: [
    'Search the NGO on the Income Tax Department\u2019s exempt-institutions list before donating.',
    'Match the receipt\u2019s trust name, PAN, approval number and validity dates with the portal entry.',
    'An 80G approval can lapse or be withdrawn — a 2019 certificate proves nothing about 2026.',
    'Ask for the approval order copy if the receipt looks freshly printed or vague.',
  ],
  blocks: [
    {
      type: 'p',
      text: 'Every December, donation appeals flood your inbox, and most of them flash an 80G certificate. Here is the uncomfortable truth: a scanned certificate image proves very little. Approvals lapse, registrations get withdrawn, and some receipts are printed by organisations that never held an approval at all. Checking takes about ten minutes, and this guide walks you through exactly how.',
    },
    { type: 'h2', text: 'Start with the Income Tax Department list' },
    {
      type: 'p',
      text: 'The Income Tax Department publishes a list of institutions approved under Section 80G. Search it by the organisation\u2019s name or PAN on incometax.gov.in. If the name does not appear, stop — do not donate on the promise that "approval is under process". An application is not an approval, and your donation will not qualify for deduction until the approval actually exists.',
    },
    {
      type: 'figure',
      figure: {
        type: 'steps',
        title: 'The 10-minute verification routine',
        steps: [
          'Copy the organisation\u2019s legal name and PAN from its website or receipt.',
          'Search both on the Income Tax Department\u2019s exempt-institutions list.',
          'Open the approval entry and note the approval number and validity period.',
          'Compare these against the donation receipt you received.',
          'Confirm the receipt shows your name, amount, date and mode of payment.',
        ],
      },
    },
    { type: 'h2', text: 'Match the receipt against the approval' },
    {
      type: 'p',
      text: 'A genuine 80G receipt is boring in the best way: it carries the trust\u2019s registered name (not a campaign brand name), its PAN, the 80G approval number, the donation amount in figures and words, the date, and your name and address. Mismatches between the receipt and the portal entry — a different name spelling, an old approval number, no PAN — are reasons to pause and ask questions, not to assume a typo.',
    },
    {
      type: 'table',
      title: 'Genuine vs suspicious 80G paperwork',
      headers: ['Signal', 'Genuine', 'Suspicious'],
      rows: [
        ['Approval number', 'Matches portal entry', 'Missing or mismatched'],
        ['Validity', 'Covers your donation date', 'Expired years ago'],
        ['Organisation name', 'Registered legal name', 'Only a campaign brand name'],
        ['PAN', 'Printed and matching', 'Absent'],
        ['Donor details', 'Your name, amount, date', 'Blank or "cash received" only'],
      ],
    },
    { type: 'h2', text: 'Why validity dates matter more than the certificate' },
    {
      type: 'p',
      text: 'Since the 2020 reforms, 80G approvals are typically granted for five-year blocks and must be renewed. An NGO waving a 2019 certificate may be perfectly honest — or may have missed renewal entirely. The portal entry shows the current validity window. Your donation qualifies only if it falls inside an active approval period, so always check the dates, not just the document.',
    },
    {
      type: 'note',
      title: 'The cash trap',
      text: 'Donations above ₹2,000 in cash do not qualify for 80G deduction at all, no matter how genuine the NGO. Always pay by UPI, cheque or bank transfer so the trail exists on both sides.',
    },
    { type: 'h2', text: 'What to do if something looks off' },
    {
      type: 'p',
      text: 'Ask the organisation for a copy of its current 80G approval order — legitimate NGOs share this routinely. If answers turn evasive, redirect your donation to an organisation whose paperwork checks out. Reporting suspected fraud is possible through the Income Tax Department\u2019s grievance channels, and keeping your own receipt copies makes that straightforward.',
    },
  ],
  faqs: [
    {
      q: 'How can I verify an NGO\u2019s 80G certificate online?',
      a: 'Search the organisation\u2019s name or PAN on the Income Tax Department\u2019s exempt-institutions list at incometax.gov.in. Confirm the approval number and validity period, then match them against your donation receipt. The whole check takes about ten minutes.',
    },
    {
      q: 'Does an 80G certificate expire?',
      a: 'Yes. Since the 2020 reforms, approvals are generally valid for five-year blocks and must be renewed. A donation qualifies only if it falls inside an active approval period, so always check current validity rather than trusting an old certificate image.',
    },
    {
      q: 'What should a genuine 80G donation receipt contain?',
      a: 'The trust\u2019s registered legal name, PAN, 80G approval number, donation amount in figures and words, date, mode of payment, and the donor\u2019s name and address. Missing PAN or approval numbers are red flags worth questioning.',
    },
    {
      q: 'Can I claim 80G deduction for a cash donation?',
      a: 'Only up to ₹2,000 in cash qualifies. Anything above that must be paid by cheque, bank transfer or UPI. For larger donations, digital payment also creates the audit trail both you and the NGO need.',
    },
    {
      q: 'What if the NGO says its 80G approval is "under process"?',
      a: 'Treat it as not approved. Your donation will not qualify for deduction until the approval actually exists. You can still donate to support the cause — just do not claim the tax benefit or accept a receipt that implies 80G status.',
    },
  ],
  productTieIn:
    'If you run a small NGO, keeping every donation receipt 80G-ready — donor name, PAN, approval number, amount in words — is exactly what Sangathan\u2019s donation records module enforces before a receipt is generated.',
}
