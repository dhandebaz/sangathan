import type { SeoArticle } from '../types'

export const batch2Articles: SeoArticle[] = [
  {
    slug: 'ngo-annual-compliance-checklist',
    title: 'NGO Annual Compliance Checklist: Society, Trust & Section 8',
    description:
      'NGO annual compliance checklist for societies, trusts and Section 8 companies: AGM, audit, ITR and filings in a month-by-month calendar with penalties.',
    keywords: [
      'ngo annual compliance',
      'ngo compliance checklist india',
      'society annual filing',
      'trust compliance requirements',
      'section 8 annual filing',
      'ngo agm due date',
    ],
    category: 'ngo-compliance',
    datePublished: '2026-09-24',
    keyTakeaways: [
      'Every NGO faces the same core cycle: AGM, audit, income-tax return, and registrar filings — the form names change by entity type.',
      'Societies registered under the Societies Registration Act 1860 generally hold an AGM within six months of year-end and file annual returns with the Registrar.',
      'Section 8 companies under the Companies Act 2013 file AOC-4 and MGT-7 with mca.gov.in and must hold a board meeting rhythm through the year.',
      'Missing deadlines invites late fees and donor doubts — a shared wall calendar prevents most of it.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'Ask ten NGO founders what filings they owe this year and you will get ten worried looks. The compliance year runs on a repeating loop — close the books on 31 March, audit them, hold the annual general meeting, file the income-tax return, and report to your registrar. This checklist lays that loop out month by month.',
      },
      { type: 'h2', text: 'The compliance year at a glance' },
      {
        type: 'p',
        text: 'The financial year ends 31 March for almost every NGO, and the next six months are the busy season. Audits wrap up by August or September, AGMs happen around September, income-tax returns follow, and registrar filings close the loop before December. Exact dates vary: societies follow state Registrar rules under the Societies Registration Act 1860, and Section 8 companies follow the Companies Act 2013 strictly.',
      },
      {
        type: 'figure',
        figure: {
          type: 'timeline',
          title: 'Month-by-month NGO compliance calendar (April to December)',
          entries: [
            { label: 'April – June', text: 'Close books, reconcile banks and donations, share trial balance with the auditor.' },
            { label: 'July – August', text: 'Finish the statutory audit; collect the report and utilisation certificate.' },
            { label: 'September', text: 'Hold the AGM; approve accounts and appoint next year auditor.' },
            { label: 'October', text: 'File ITR-7 on incometax.gov.in before the audit-case deadline.' },
            { label: 'November', text: 'File registrar returns: society list, or AOC-4 and MGT-7 for Section 8.' },
            { label: 'December', text: 'FCRA holders file FC-4 by 31 December; note 80G/12A renewal dates.' },
          ],
        },
        caption: 'Treat September to October as non-negotiable.',
      },
      { type: 'h2', text: 'What each entity type must file' },
      {
        type: 'p',
        text: 'The shape of compliance depends on how you registered. A society answers to the state Registrar of Societies, a trust answers mostly to the Income Tax Department plus its own deed, and a Section 8 company answers to the Registrar of Companies with the heaviest paperwork.',
      },
      {
        type: 'table',
        title: 'Annual filings by NGO entity type',
        headers: ['Obligation', 'Society', 'Trust', 'Section 8 company'],
        rows: [
          ['Annual general meeting', 'Yes, per state rules', 'Meeting of trustees per deed', 'Yes, AGM plus board meetings'],
          ['Statutory audit', 'Usually required by state rules', 'Required for 12A holders', 'Yes, mandatory under Companies Act 2013'],
          ['Income-tax return (ITR-7)', 'Yes, if income exceeds exemption', 'Yes, if income exceeds exemption', 'Yes'],
          ['Registrar filing', 'Annual list of members with Registrar', 'Generally none, unless state law requires', 'AOC-4 and MGT-7 on mca.gov.in'],
          ['Typical penalty zone', 'Late fees, possible dissolution action', 'Loss of 12A/80G, tax on income', 'Per-day ROC additional fees'],
        ],
      },
      { type: 'h2', text: 'Penalties beginners underestimate' },
      {
        type: 'p',
        text: 'Late income-tax returns draw fees under Section 234F of the Income Tax Act and interest on unpaid tax, and persistent default can cost you the 12A exemption itself. Section 8 companies face additional fees that grow every day the ROC form stays unfiled. An illustrative example: a Jaipur education society we know missed its registrar filing two years running and spent its third year doing paperwork instead of admissions work.',
      },
      {
        type: 'list',
        items: [
          'Mark ITR, AGM and registrar dates on one calendar the whole committee can see.',
          'Keep auditor letters, AGM notices and minutes in a single annual file.',
          'Reconcile FCRA and domestic bank accounts separately before the audit starts.',
          'Check 12A, 80G and FCRA validity every April, not when a donor asks.',
          'File early in October and November — portals choke near deadlines.',
        ],
      },
      {
        type: 'note',
        title: 'State rules differ',
        text: 'Society filing forms, fees and AGM notice periods vary by state — Rajasthan, Maharashtra and Karnataka each have their own Registrar forms. Always confirm with your state Registrar circular or a local consultant before treating this calendar as final.',
      },
      { type: 'h2', text: 'A simple system that works' },
      {
        type: 'p',
        text: 'You do not need expensive software. One folder per financial year — physical or digital — holding the audit report, AGM notice, attendance sheet, minutes, ITR acknowledgement and registrar receipts covers most scrutiny a small NGO will ever face. Review the folder every April and assign one trustee to chase each item. Boring, and it works.',
      },
    ],
    faqs: [
      {
        q: 'What is the annual compliance checklist for an NGO in India?',
        a: 'Close books after 31 March, complete the audit by August or September, hold the AGM around September, file ITR-7 by the October deadline for audit cases, submit registrar filings (society annual list, or AOC-4 and MGT-7 for Section 8), and file FC-4 by 31 December if you hold FCRA registration.',
      },
      {
        q: 'Do small NGOs also need to file ITR every year?',
        a: 'Yes, if gross income exceeds the basic exemption limit, the organisation must file ITR-7 even when its income is fully exempt under Sections 11 and 12. Filing also protects 12A status and is the first document donors and grant-makers ask for during due diligence.',
      },
      {
        q: 'What happens if a society misses its AGM?',
        a: 'Consequences depend on state law but commonly include late fees, objections during registrar inspections, and questions from donors or banks. Repeated defaults can invite inquiry into the managing committee. If you missed one, hold the meeting now, record the delay honestly in the minutes, and file.',
      },
      {
        q: 'What annual filings does a Section 8 company have?',
        a: 'A Section 8 company must hold board meetings and an AGM, get accounts audited, file AOC-4 (financial statements) and MGT-7 (annual return) with the Registrar of Companies on mca.gov.in, and file ITR-7. Delays attract additional fees that accrue daily, so file early.',
      },
      {
        q: 'How do trusts differ from societies in annual compliance?',
        a: 'Trusts have lighter registrar compliance — usually no annual Registrar filing — but identical income-tax duties: audit, ITR-7, and TDS filings. The trust deed governs meetings, so follow its notice and quorum clauses carefully and document trustee resolutions in writing.',
      },
    ],
    productTieIn:
      'Sangathan\u2019s meeting minutes records and statutory member registers keep AGM paperwork in one retrievable place.',
  },
  {
    slug: '80g-renewal-process',
    title: '80G Renewal Process: When and How to Renew 80G Approval',
    description:
      '80G renewal process explained: the 5-year validity cycle, Form 10AB timing six months before expiry, documents needed, and what happens if you miss it.',
    keywords: [
      '80g renewal',
      '80g renewal process online',
      'renew 80g certificate',
      '80g validity renewal',
      'form 10ab 80g renewal',
    ],
    category: 'ngo-compliance',
    datePublished: '2026-09-24',
    keyTakeaways: [
      'Fresh 80G approvals under the reformed regime are typically valid for five years and must be renewed — they do not last forever.',
      'Apply for renewal in Form 10AB on incometax.gov.in at least six months before the approval expires.',
      'Keep audit reports, ITRs, activity proofs and donation records ready — the tax officer examines your whole exemption track record.',
      'If approval lapses, donations received after expiry do not qualify for donor deduction until renewal is granted.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'Since the 2020 overhaul of charity registrations, 80G approval comes with an expiry date. Approvals granted under the new regime are generally valid for five years, and renewal is your job — nobody sends a reminder. Miss the window and your donors lose their tax deduction overnight. Here is how the cycle works and when to act.',
      },
      { type: 'h2', text: 'The five-year cycle in plain words' },
      {
        type: 'p',
        text: 'Under Sections 80G and 12AB of the Income Tax Act, new registrations and renewals are typically granted for five years at a time. Your approval order states the exact validity period — assessment years or financial years with start and end dates. Read that order today and write the expiry date somewhere visible, because everything in the renewal process counts backwards from it.',
      },
      {
        type: 'figure',
        figure: {
          type: 'steps',
          title: '80G renewal timeline',
          steps: [
            'Note your 80G expiry date from the approval order (usually a five-year block).',
            'Six to eight months before expiry, assemble audits, ITRs and activity proof.',
            'File Form 10AB on incometax.gov.in at least six months before expiry.',
            'Respond to any Commissioner (Exemptions) queries or hearings promptly.',
            'Receive the renewal order, update receipts and the website with the new validity.',
          ],
        },
      },
      { type: 'h2', text: 'Filing Form 10AB for renewal' },
      {
        type: 'p',
        text: 'Renewal applications go through Form 10AB on the Income Tax portal, processed by the Commissioner of Income Tax (Exemptions). The rule of thumb is to apply at least six months before expiry — earlier is safe, late is risky. The officer may call for documents or a hearing, and a thin file invites deeper questions, so treat the application as a mini-audit of your last five years.',
      },
      {
        type: 'table',
        title: 'Documents usually needed for 80G renewal',
        headers: ['Document', 'Why it matters', 'Where it lives'],
        rows: [
          ['Original 80G and 12A/12AB orders', 'Proves current approval and validity', 'Your files + portal'],
          ['Audit reports (last 3–5 years)', 'Shows genuine charitable application of funds', 'Auditor + ITR filings'],
          ['ITR-V acknowledgements', 'Confirms continuous filing discipline', 'incometax.gov.in'],
          ['Activity proofs', 'Photos, reports, beneficiary records of real work', 'Your office'],
          ['Donation records and books', 'Shows receipts match claimed donations', 'Accounts file'],
        ],
      },
      { type: 'h2', text: 'What happens if you miss renewal' },
      {
        type: 'p',
        text: 'If the approval lapses, donations received after expiry do not carry 80G deduction for donors — even if your renewal is later granted, the gap period stays uncovered. Fundraising during a lapse means either pausing 80G receipts or issuing plain acknowledgements that supporters cannot claim. An illustrative example: a Nagpur health trust we know filed three months late, and its year-end giving campaign ran on non-80G receipts while the renewal was pending.',
      },
      {
        type: 'note',
        title: 'Never issue 80G receipts during a lapse',
        text: 'Only an organisation holding its own live 80G registration may issue 80G receipts. During any gap, say so plainly on the receipt — otherwise say "80G-ready" nowhere and issue a simple donation acknowledgement instead.',
      },
      { type: 'h2', text: 'Keeping the next cycle painless' },
      {
        type: 'p',
        text: 'File ITR-7 every year without gaps, keep audited accounts consistent with your returns, and document activities as you go rather than reconstructing five years at renewal time. When the new order arrives, update the approval number and validity on receipts, the website and donor decks the same week — stale paperwork is how confusion starts.',
      },
    ],
    faqs: [
      {
        q: 'When should I renew my 80G certificate?',
        a: 'Apply at least six months before the expiry date shown on your approval order, using Form 10AB on incometax.gov.in. Fresh approvals under the current regime are generally valid for five years. Starting early gives the Commissioner (Exemptions) time for queries without your approval lapsing mid-process.',
      },
      {
        q: 'Which form is used for 80G renewal online?',
        a: 'Form 10AB on the Income Tax portal, incometax.gov.in. The same form covers renewal of 12AB and 80G approvals. You attach registration documents, audit reports, returns and activity evidence, and respond to any follow-up notices or hearings from the Commissioner (Exemptions) until the renewal order is issued.',
      },
      {
        q: 'What happens if my 80G approval expires before renewal?',
        a: 'Donations received after expiry do not qualify for 80G deduction until renewal is granted, and the gap period stays uncovered. Stop issuing 80G receipts during the lapse and give plain acknowledgements instead. File the renewal immediately and inform major donors honestly about timing.',
      },
      {
        q: 'How long is 80G approval valid now?',
        a: 'Approvals granted under the post-2020 regime are typically valid for five years at a time, as stated in your approval order. Older perpetual approvals were migrated into this cycle. Always go by the dates on your own order, not by what other NGOs received.',
      },
      {
        q: 'Can 80G renewal be rejected?',
        a: 'Yes. Common reasons include non-filing of ITRs, mismatch between audit reports and returns, weak evidence of genuine charitable activity, or non-compliance with 12AB conditions. A rejection can be appealed before the Income Tax Appellate Tribunal — consult a charity-tax professional quickly since appeal windows are short.',
      },
    ],
    productTieIn:
      'Sangathan\u2019s donation records keep every receipt 80G-ready with donor name, approval number and validity dates, so renewal-time reconciliation takes hours instead of weeks.',
  },
  {
    slug: 'fcra-registration-renewal',
    title: 'FCRA Registration & Renewal: Eligibility, Process, Rejections',
    description:
      'FCRA registration and renewal guide: 3-year existence rule, spending criteria, designated SBI account, application steps and the commonest rejection reasons.',
    keywords: [
      'fcra registration',
      'fcra renewal online',
      'fcra eligibility ngo',
      'fcra application status',
      'fcra designated sbi account',
      'fcra rejection reasons',
    ],
    category: 'ngo-compliance',
    datePublished: '2026-09-24',
    keyTakeaways: [
      'FCRA registration under the Foreign Contribution (Regulation) Act 2010 generally needs three years of existence with genuine activity.',
      'Newer or smaller NGOs can seek prior permission for a specific project and donor instead of full registration.',
      'Foreign funds must first land in the designated SBI New Delhi Main Branch account notified for FCRA.',
      'Renewal is due before the five-year validity expires — late renewal has become far harder than it used to be.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'Foreign donations to Indian NGOs flow through one gate: the Foreign Contribution (Regulation) Act 2010, administered by the Ministry of Home Affairs on fcraonline.nic.in. Registration is powerful and picky — it demands history, spending proof and clean compliance. This guide covers who qualifies, how to apply, and why applications get turned down.',
      },
      { type: 'h2', text: 'Who is eligible for FCRA registration' },
      {
        type: 'p',
        text: 'The standard path expects your organisation to have existed for at least three years with genuine welfare activity, backed by audited statements showing meaningful programme spending — commonly discussed as ₹15 lakh or more spent on core activities across the last three years. The Ministry looks for real work: field programmes, audited books, filed ITRs and a clean record, not paper existence.',
      },
      {
        type: 'figure',
        figure: {
          type: 'checklist',
          title: 'FCRA eligibility self-check',
          items: [
            'Registered NGO (society, trust or Section 8) with at least three years of active existence.',
            'Audited financials showing genuine programme spending over the last three years.',
            'ITRs filed, 12A/12AB registration in place, books properly maintained.',
            'No violations, no pending prosecution, no diversion of funds in your history.',
            'Designated FCRA account ready at the notified SBI New Delhi Main Branch.',
            'Key functionaries with clean records and Aadhaar-linked FCRA logins.',
          ],
        },
      },
      { type: 'h2', text: 'Registration vs prior permission' },
      {
        type: 'p',
        text: 'Not eligible for full registration yet? Prior permission is the alternate route: it lets you receive a specific amount from a specific foreign donor for a specific project. Many young NGOs raise their first foreign grant this way and graduate to full registration later. Full registration, once granted, is generally valid for five years and covers multiple donors.',
      },
      {
        type: 'table',
        title: 'FCRA registration vs prior permission',
        headers: ['Factor', 'Registration', 'Prior permission'],
        rows: [
          ['Best for', 'Established NGOs, 3+ years', 'Younger NGOs with a committed donor'],
          ['Scope', 'Multiple donors and projects', 'One donor, one project, fixed amount'],
          ['Validity', 'Generally five years, renewable', 'Project-specific'],
          ['Applied on', 'Form FC-3A on fcraonline.nic.in', 'Form FC-3B on fcraonline.nic.in'],
          ['Needs designated SBI account', 'Yes', 'Yes'],
        ],
      },
      { type: 'h2', text: 'The SBI account and application steps' },
      {
        type: 'p',
        text: 'Since 2020, all foreign contribution must first be received in the FCRA-designated account at the State Bank of India, New Delhi Main Branch, with onward utilisation through linked accounts. Open this account early — it is frequently the slowest step. Then file online, upload registration, activity, audit and functionary documents, and track the status on the portal. Field inquiries through the district administration are a normal part of processing.',
      },
      {
        type: 'numbered',
        items: [
          'Open the designated FCRA account at the notified SBI branch and collect the account details.',
          'File Form FC-3A (registration) or FC-3B (prior permission) on fcraonline.nic.in with documents.',
          'Track application status on the portal and respond to any Ministry queries in writing.',
          'Cooperate with field verification if the district authorities schedule a visit.',
          'On grant, read the conditions carefully — separate books, utilisation limits and annual FC-4 returns follow.',
        ],
      },
      {
        type: 'note',
        title: 'Common rejection reasons',
        text: 'Thin activity proof, gaps in ITR or audit filings, mismatch between claimed work and spending, adverse field reports, incomplete functionary KYC, and applying for registration before completing three genuine years. Fix the substance first — reapplying with the same file rarely changes the outcome.',
      },
      { type: 'h2', text: 'Renewal timing' },
      {
        type: 'p',
        text: 'Apply for renewal well before the five-year validity expires — six months ahead is the safe habit — because operating with lapsed FCRA while holding foreign funds creates serious legal exposure. File FC-4 annual returns every year without fail; renewal scrutiny leans heavily on that record. An illustrative example: a Kochi livelihood NGO we know calendars its FCRA renewal alongside its 80G renewal every April so neither date can creep up unnoticed.',
      },
    ],
    faqs: [
      {
        q: 'What is the eligibility for FCRA registration in India?',
        a: 'Generally, a registered society, trust or Section 8 company with at least three years of genuine welfare activity, audited statements showing substantial programme spending, filed ITRs, and clean compliance history. The Ministry verifies activity through documents and sometimes field inquiry before granting registration.',
      },
      {
        q: 'How do I apply for FCRA registration online?',
        a: 'File Form FC-3A on fcraonline.nic.in with your registration certificate, memorandum and activity reports, three years of audited statements, and functionary details. Open the designated SBI New Delhi Main Branch account for receipt of foreign funds. Processing takes several months and may include verification.',
      },
      {
        q: 'Why do FCRA applications get rejected?',
        a: 'Frequent reasons include less than three years of genuine activity, weak spending evidence, ITR or audit gaps, adverse field verification reports, incomplete KYC of office bearers, and mismatch between stated objectives and actual work. Address the underlying gap before reapplying.',
      },
      {
        q: 'When should I renew my FCRA registration?',
        a: 'Apply at least six months before the five-year validity expires, on fcraonline.nic.in. Keep every annual FC-4 return filed and the designated SBI account active, since renewal scrutiny weighs your compliance record heavily. Never accept fresh foreign funds while the registration stands lapsed.',
      },
      {
        q: 'Can a new NGO receive foreign funds without FCRA registration?',
        a: 'Yes, through prior permission — Form FC-3B for a specific donor, project and amount. It suits young NGOs with a committed foreign funder. You still need the designated SBI account and clean documentation, and you still file FC-4 returns for funds received.',
      },
    ],
  },
  {
    slug: 'fc-4-annual-return-filing',
    title: 'FC-4 Annual Return: Due Dates, Documents & Mistakes to Avoid',
    description:
      'FC-4 annual return filing for FCRA NGOs: 31 December deadline, nil return rule, documents checklist, and the bank-mismatch mistakes that trigger scrutiny.',
    keywords: [
      'fc-4 return filing',
      'fcra annual return',
      'fc-4 due date',
      'fcra return filing process',
      'fc-4 nil return',
    ],
    category: 'ngo-compliance',
    datePublished: '2026-09-24',
    keyTakeaways: [
      'Every FCRA-registered NGO must file Form FC-4 within nine months of year-end — the deadline is 31 December.',
      'No foreign funds received this year? You still file a nil return — there is no exemption from filing.',
      'FC-4 figures must match the designated SBI account statement to the rupee; mismatches are the commonest red flag.',
      'Late filing draws penalties and stains the renewal record — file in October or November, not late December.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'Holding FCRA registration means filing Form FC-4 every single year, whether you received foreign money or not. It is the return the Ministry of Home Affairs actually reads — and the document most small NGOs get wrong. Here is the deadline, the paperwork, and the mistakes that cause the most grief.',
      },
      { type: 'h2', text: 'Deadline and the nil-return rule' },
      {
        type: 'p',
        text: 'FC-4 for the financial year ending 31 March must be filed on fcraonline.nic.in within nine months — that is, by 31 December. This applies to every FCRA holder, including those with prior permission who received funds. Received nothing? File a nil return anyway. Skipping a year because "there was nothing to report" is one of the fastest ways to damage your renewal prospects.',
      },
      {
        type: 'figure',
        figure: {
          type: 'steps',
          title: 'Filing FC-4 without tears',
          steps: [
            'Pull the designated SBI account statement for 1 April to 31 March and the utilisation account statements.',
            'Reconcile opening balance, receipts (donor-wise), interest, utilisation and closing balance.',
            'Collect auditor certificate, project reports and donor-wise receipt details.',
            'Fill Form FC-4 online, upload statements, and have the chief functionary e-sign.',
            'Download the filed acknowledgement and store it with the audit file.',
          ],
        },
      },
      { type: 'h2', text: 'Documents to keep ready' },
      {
        type: 'p',
        text: 'The return asks for donor-wise receipts, country-wise breakup, interest earned, project-wise utilisation, assets created, and bank balances. Assemble the evidence before opening the form — half-filled returns saved online too long tend to accumulate errors.',
      },
      {
        type: 'table',
        title: 'FC-4 document checklist',
        headers: ['Document', 'Covers', 'Source'],
        rows: [
          ['Designated SBI account statement', 'All foreign receipts and balances', 'SBI branch / netbanking'],
          ['Utilisation account statements', 'Project spending trail', 'Your bank'],
          ['Auditor certificate', 'Receipt and utilisation certification', 'FCRA auditor'],
          ['Donor-wise receipts list', 'Who sent what, from which country', 'Your books'],
          ['Project reports', 'What the money achieved', 'Programme team'],
        ],
      },
      { type: 'h2', text: 'Mistakes that trigger scrutiny' },
      {
        type: 'p',
        text: 'The classic error is a closing balance in FC-4 that does not match the bank statement — usually because interest was forgotten or a transfer between accounts was recorded twice. Next come donor-name spellings that differ from the bank credit, utilisation shown without vouchers, and administrative-expense breaches of the statutory ceiling. An illustrative example: a Lucknow child-rights group we know filed with a ₹18,000 interest omission and spent a year exchanging clarification letters over it.',
      },
      {
        type: 'list',
        items: [
          'Match FC-4 receipts, interest and balances to bank statements to the rupee.',
          'Use bank-statement spellings for donor names throughout the form.',
          'Keep utilisation vouchers project-tagged so every figure traces to paper.',
          'File in October or November — the portal slows badly in the last fortnight.',
          'Never mix domestic and FCRA funds in the same account or entry.',
        ],
      },
      {
        type: 'note',
        title: 'Late filing costs real money and goodwill',
        text: 'Late FC-4 filings attract additional fees and, worse, sit on your record when renewal comes up. A clean chain of on-time FC-4s is the cheapest renewal insurance an FCRA NGO can buy.',
      },
    ],
    faqs: [
      {
        q: 'What is the due date for FC-4 annual return filing?',
        a: '31 December — within nine months of the 31 March year-end. The return is filed online on fcraonline.nic.in in Form FC-4 with bank statements and auditor certification. File in October or November to avoid portal congestion and last-minute reconciliation errors.',
      },
      {
        q: 'Do I need to file FC-4 if I received no foreign funds?',
        a: 'Yes. Every FCRA-registered organisation must file annually, including nil returns in years with zero receipts. Skipping nil years breaks your compliance chain and counts against you at renewal. The nil return takes little time once bank statements confirm no credits.',
      },
      {
        q: 'Which bank statements are needed for FC-4?',
        a: 'The designated SBI New Delhi Main Branch account statement for the full financial year plus statements of all linked utilisation accounts. Every figure in the return — opening balance, receipts, interest, utilisation, closing balance — must tie to these statements exactly.',
      },
      {
        q: 'What are common FC-4 filing mistakes?',
        a: 'Bank-balance mismatches from forgotten interest are the commonest, followed by donor names spelt differently from bank credits, utilisation shown without supporting vouchers, breaching the administrative-expenses ceiling, and mixing domestic with foreign funds. Reconcile every figure to the bank statement to the rupee before submitting.',
      },
      {
        q: 'What happens if FC-4 is filed late?',
        a: 'Late filing draws additional fees and marks your compliance record, which renewal officers examine closely. Repeated defaults can invite inquiry or restrictions on receiving funds. If already late, file immediately with correct figures — delay compounds both fee and risk.',
      },
    ],
  },
  {
    slug: 'itr-7-filing-ngo',
    title: 'ITR-7 Filing for NGOs: Who Must File, Due Dates & Sections',
    description:
      'ITR-7 filing for NGOs explained: who must file including 12A holders, audit and 31 October vs 31 July deadlines, schedules, and belated-return consequences.',
    keywords: [
      'itr-7 filing',
      'itr for ngo',
      'itr-7 due date',
      'ngo income tax return',
      'itr-7 audit deadline',
    ],
    category: 'ngo-compliance',
    datePublished: '2026-09-24',
    keyTakeaways: [
      'ITR-7 is the return form for trusts, societies and Section 8 companies claiming exemption under Sections 11 and 12.',
      'If your accounts need audit, the deadline is generally 31 October; otherwise 31 July — confirm the current year notification.',
      'Audit report in Form 10B or 10BB must be filed before the return itself, or the exemption claim weakens.',
      'Belated filing risks fees under Section 234F, interest, and in serious cases trouble for 12AB status.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'Every Indian non-profit with income above the basic exemption limit must file an income-tax return, and for most of them the form is ITR-7. Exempt does not mean excused: the return is how you claim the exemption each year. Here is who files, when, and what sits inside the form.',
      },
      { type: 'h2', text: 'Who must file ITR-7' },
      {
        type: 'p',
        text: 'ITR-7 covers trusts, societies, Section 8 companies and other institutions claiming exemption under Sections 11 and 12 of the Income Tax Act — which includes 12A and 12AB holders — plus entities under Sections 10(23C), 13A and 13B. In plain words: if your NGO holds 12AB, file ITR-7. If you are a small unregistered collective with income below the exemption limit, the duty may not trigger — but check with your auditor rather than assuming.',
      },
      {
        type: 'figure',
        figure: {
          type: 'checklist',
          title: 'Do we file ITR-7 this year?',
          items: [
            'Registered trust, society or Section 8 company with income above the basic exemption limit.',
            'Holding 12A/12AB or 10(23C) approval and claiming exemption on income.',
            'Received 80G-linked donations that must show up in audited books and returns.',
            'Holding FCRA funds — the ITR corroborates your FC-4 figures.',
            'Carrying forward any deficit or excess application of income to future years.',
          ],
        },
      },
      { type: 'h2', text: 'Due dates without the jargon' },
      {
        type: 'p',
        text: 'Two dates matter. If your accounts must be audited — which covers most 12AB NGOs — the return deadline generally falls on 31 October following the financial year. If no audit is required, it is generally 31 July. The audit report itself (Form 10B or the simpler 10BB, as applicable) must be uploaded before you file the return. Dates can shift by CBDT notification in exceptional years, so verify the current year circular on incometax.gov.in rather than trusting memory.',
      },
      {
        type: 'table',
        title: 'ITR-7 deadlines at a glance',
        headers: ['Situation', 'Audit report', 'Return deadline (usual)'],
        rows: [
          ['NGO with audit requirement', 'Form 10B/10BB before filing', '31 October'],
          ['NGO without audit requirement', 'Not required', '31 July'],
          ['Belated return', 'As applicable', '31 December of assessment year'],
          ['Revised return', 'As applicable', 'Within the belated window'],
        ],
      },
      { type: 'h2', text: 'What is inside the form' },
      {
        type: 'p',
        text: 'ITR-7 runs through schedules reporting voluntary contributions (including anonymous donations under Section 115BBC), application of income to charitable objects, accumulation or set-apart of funds, and administration details of trustees. Anonymous cash donations above set thresholds can be taxed punitively, which is why donor KYC in your books matters long before return season. An illustrative example: a Bhopal skilling trust we know discovered ₹60,000 of untagged cash entries in September and spent three weeks reconstructing donor lists before its auditor would sign off.',
      },
      {
        type: 'note',
        title: 'Belated is better than never — but costly',
        text: 'A late return filed by 31 December of the assessment year is valid but draws fees under Section 234F plus interest, and you may lose the right to carry forward deficits. File on time; revise later if a figure needs correction.',
      },
      { type: 'h2', text: 'After filing' },
      {
        type: 'p',
        text: 'E-verify within the stipulated window, download the ITR-V acknowledgement, and store it with the audit report and 10B/10BB. Then check the processed intimation under Section 143(1) when it arrives — mismatches between TDS credits (Form 26AS/AIS) and the return are the commonest reason for demands against NGOs.',
      },
    ],
    faqs: [
      {
        q: 'Who must file ITR-7 in India?',
        a: 'Trusts, societies, Section 8 companies and institutions claiming exemption under Sections 11–12 (including 12A/12AB holders), Section 10(23C), and related provisions must file it. If gross income exceeds the basic exemption limit, filing is compulsory even when the entire income is exempt from tax.',
      },
      {
        q: 'What is the ITR-7 due date for NGOs?',
        a: 'Generally 31 October when accounts require audit (Form 10B/10BB uploaded first), and 31 July when no audit is needed. Confirm the current assessment year notification on incometax.gov.in, since the CBDT occasionally extends dates. E-verify promptly after filing and preserve the acknowledgement.',
      },
      {
        q: 'What is Form 10B vs 10BB for NGOs?',
        a: 'Both are audit reports for charitable institutions. Form 10B is the detailed report for larger NGOs above prescribed turnover or receipt thresholds, while 10BB is the simpler version for smaller ones. Your auditor picks based on current thresholds — ask which applies to you each year.',
      },
      {
        q: 'What happens if an NGO files ITR late?',
        a: 'Late returns attract fees under Section 234F and interest on unpaid tax, and you generally lose the right to carry forward deficits. Persistent non-filing can endanger 12AB exemption. A belated return by 31 December of the assessment year is valid — file it rather than skipping.',
      },
      {
        q: 'Do NGOs with zero income need to file ITR-7?',
        a: 'If gross income stays below the basic exemption limit, filing may not be compulsory — but most auditors recommend filing anyway to keep 12AB, 80G and FCRA records continuous. A nil or near-nil return costs little and answers donor due-diligence questions for years.',
      },
    ],
    productTieIn:
      'Sangathan\u2019s donation records keep donor-wise contributions audit-clean through the year, so the voluntary-contribution schedules in ITR-7 write themselves at filing time.',
  },
  {
    slug: 'society-agm-meeting-minutes',
    title: 'Society AGM & Meeting Minutes: A Format That Passes Scrutiny',
    description:
      'Society AGM minutes format that passes scrutiny: notice period, quorum, agenda, a minutes skeleton with example lines, attendance and resolutions.',
    keywords: [
      'society agm minutes format',
      'meeting minutes format society',
      'agm notice format ngo',
      'society meeting rules',
      'ngo board resolution format',
    ],
    category: 'ngo-compliance',
    datePublished: '2026-09-24',
    keyTakeaways: [
      'A valid AGM needs proper notice, quorum as per your bylaws, a recorded agenda, and signed minutes — in that order.',
      'Minutes must capture attendance, resolutions with vote counts, and office-bearer signatures to survive Registrar or donor scrutiny.',
      'Circulate the notice with agenda in advance (commonly 14–21 days per bylaws) and keep proof of dispatch.',
      'Store notices, attendance sheets and minutes together for every year — this bundle is your first line of defence.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'Minutes are the memory of your organisation. When a Registrar inspector, auditor or big donor asks "did the general body actually approve this?", the signed minutes book is your answer. Most small societies keep minutes that are too thin to prove anything. Here is a format that holds up.',
      },
      { type: 'h2', text: 'Before the meeting: notice and quorum' },
      {
        type: 'p',
        text: 'The AGM process starts with notice, not with the meeting. Your bylaws set the notice period — commonly 14 to 21 days — plus the quorum, often one-third or one-half of members. Send written notice with date, time, venue and agenda to every member, and keep proof: postal receipts, email logs or signed acknowledgements. No quorum at start time? Adjourn as the bylaws direct and record that fact instead of proceeding informally.',
      },
      {
        type: 'figure',
        figure: {
          type: 'steps',
          title: 'AGM sequence that never fails you',
          steps: [
            'Managing committee fixes date, venue and draft agenda; secretary issues notice with agenda.',
            'Confirm quorum at start; record present count against the attendance sheet.',
            'Read and confirm last meeting minutes; present annual report and audited accounts.',
            'Move, second and vote each resolution; record proposer, seconder and vote count.',
            'Elect or re-elect office bearers if due; appoint auditor for next year.',
            'Chair and secretary sign minutes; file Registrar intimations within due time.',
          ],
        },
      },
      { type: 'h2', text: 'A minutes skeleton with example lines' },
      {
        type: 'p',
        text: 'Good minutes are factual and boring: who met, when, what was decided, who will do what. Write them within a week while memory is fresh, then get them confirmed at the next meeting. Adapt this skeleton to your bylaws:',
      },
      {
        type: 'table',
        title: 'Minutes skeleton — section by section',
        headers: ['Section', 'What to write', 'Example line'],
        rows: [
          ['Header', 'Society name, meeting type, date, time, venue', 'Annual General Meeting, 21 Sept 2026, 11 am, Community Hall, C-Scheme'],
          ['Chair and quorum', 'Chair name, members present vs required', 'Chaired by President Meera Rao; 42 of 60 members present, quorum met'],
          ['Confirmation', 'Previous minutes read and confirmed', 'Minutes of 15 Sept 2025 read and unanimously confirmed'],
          ['Reports', 'Annual report and accounts presented', 'Secretary presented the annual report; Treasurer placed audited accounts for FY 2025-26'],
          ['Resolutions', 'Numbered, with proposer and votes', 'Resolution 2: accounts adopted — proposed by A. Khan, seconded by S. Iyer, passed 40-2'],
          ['Closing', 'Vote of thanks, time, signatures', 'Meeting closed 1:30 pm with thanks to the chair; signed by President and Secretary'],
        ],
      },
      { type: 'h2', text: 'Resolutions and attendance: the two pages that matter most' },
      {
        type: 'p',
        text: 'Each resolution needs a number, exact wording, proposer and seconder names, and the vote outcome — "passed unanimously" or the for/against count. Attach the signed attendance sheet as an annexure rather than copying forty names into the minutes body. An illustrative example: an Indore residents welfare society we know survived a Registrar query purely because its attendance sheets carried member signatures against every resolution year.',
      },
      {
        type: 'list',
        items: [
          'Number every resolution consecutively across the year for easy reference.',
          'Record dissent honestly — "passed 23-7 with members X and Y dissenting" is stronger than fake unanimity.',
          'Note financial approvals precisely: amounts in figures and words, payee, purpose.',
          'Attach auditor appointment letters and election results where applicable.',
          'Never backdate or rewrite minutes — correct errors with a fresh dated correction entry.',
        ],
      },
      {
        type: 'note',
        title: 'State bylaws rule the details',
        text: 'Notice periods, quorum fractions and filing forms for managing-committee changes differ across states under their Societies Registration rules. Read your own registered bylaws first — this format implements them; it does not replace them.',
      },
    ],
    faqs: [
      {
        q: 'What is the proper format of society AGM minutes?',
        a: 'Header with society name, date, time and venue; chair and quorum record; confirmation of previous minutes; annual report and accounts presentation; numbered resolutions with proposer, seconder and votes; elections and auditor appointment; closing time with president and secretary signatures plus attendance annexure.',
      },
      {
        q: 'How much notice is required for a society AGM?',
        a: 'Your registered bylaws fix it — commonly 14 to 21 days with agenda, sent to all members in writing. Keep dispatch proof. Short notice is valid only if the bylaws allow it and members consent as prescribed, so check the clause before rushing.',
      },
      {
        q: 'What is quorum for an NGO general body meeting?',
        a: 'Whatever your bylaws say — often one-third to one-half of members must be present. If quorum fails, adjourn following the bylaw procedure and record the adjournment in writing. Decisions taken without quorum can be challenged later, so never paper over a thin turnout.',
      },
      {
        q: 'Do meeting minutes need to be signed?',
        a: 'Yes — typically by the chair of the meeting and the secretary, promptly after the meeting closes. Signed, dated minutes with an attendance annexure are what auditors, Registrars and donors accept as proof. Unsigned drafts floating in email carry little evidentiary weight when questioned.',
      },
      {
        q: 'How long should an NGO keep meeting minutes?',
        a: 'Permanently, in practice. Minutes prove approvals for property, loans, statutory filings and elections years after the event. Keep the bound or digitally signed book plus attendance sheets for every year the organisation exists, stored safely where successors can find them.',
      },
    ],
    productTieIn:
      'Sangathan\u2019s meeting minutes records give small societies a ready AGM skeleton — attendance, agenda, numbered resolutions and signatures — stored year-wise for instant retrieval.',
  },
  {
    slug: 'audit-requirements-ngo-india',
    title: 'Audit Requirements for NGOs in India: Limits, Reports & Auditors',
    description:
      'NGO audit requirements in India: when audit is mandatory for 12A, 80G, FCRA and turnover cases, how to appoint an auditor, and what the report contains.',
    keywords: [
      'ngo audit requirements',
      'audit for trust india',
      'society audit limit',
      'ngo audit report format',
      'form 10b 10bb ngo',
    ],
    category: 'ngo-compliance',
    datePublished: '2026-09-24',
    keyTakeaways: [
      'Most 12A/12AB, 80G and FCRA NGOs need annual audit regardless of size — turnover thresholds decide the report format, not whether to audit.',
      'Society audit duties come from state Registrar rules; Section 8 companies always audit under the Companies Act 2013.',
      'Appoint a qualified chartered accountant early in the year, not in September when every NGO wants one.',
      'The same audit file feeds ITR-7, FC-4, donor reports and 80G renewal — build it once, reuse it everywhere.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'An NGO audit is not just a statutory chore — it is the document every stakeholder trusts. Donors read it before writing cheques, the tax department reads it before renewing 12AB, and your own committee needs it to know the money story. Here is when audit becomes mandatory, who can audit you, and what lands in the report.',
      },
      { type: 'h2', text: 'When audit is mandatory' },
      {
        type: 'p',
        text: 'For practical purposes, assume annual audit is compulsory: 12A and 12AB holders need it for exemption, 80G holders need clean audited books for renewal, FCRA holders need certified receipt-and-utilisation accounts, and Section 8 companies audit under the Companies Act 2013 every year without exception. Societies without tax registrations still usually face audit under state Registrar rules above modest receipt thresholds.',
      },
      {
        type: 'table',
        title: 'Audit triggers by situation',
        headers: ['Situation', 'Audit needed?', 'Report / form'],
        rows: [
          ['Holding 12A/12AB exemption', 'Yes, every year', 'Form 10B or 10BB for ITR'],
          ['Holding 80G approval', 'Yes, in practice for renewal', 'Statutory audit report'],
          ['Holding FCRA registration', 'Yes, every year', 'Receipt-utilisation certificate + FC-4 schedules'],
          ['Section 8 company', 'Yes, always', 'Companies Act audit + board report inputs'],
          ['Small society, no tax registrations', 'Often yes above state limits', 'As per state Registrar format'],
        ],
      },
      { type: 'h2', text: 'Appointing the right auditor' },
      {
        type: 'p',
        text: 'Only a qualified chartered accountant in practice should sign your audit — and ideally one who works with non-profits, since charity accounting (corpus vs general funds, restricted grants, accumulation under Section 11) confuses generalists. Appoint early: formally engage by June, share monthly books through the year, and fix the audit calendar before the September rush when good CA firms stop taking new NGO clients.',
      },
      {
        type: 'figure',
        figure: {
          type: 'checklist',
          title: 'Auditor appointment checklist',
          items: [
            'Chartered accountant holding a valid certificate of practice.',
            'Experience with 12AB, 80G, FCRA and Form 10B/10BB work.',
            'Written engagement letter with scope, fee and timeline.',
            'Independence: no office-bearer relationship, no book-writing plus audit by the same hands.',
            'Availability for donor or tax queries for a few months after signing.',
          ],
        },
      },
      { type: 'h2', text: 'What the audit report contains' },
      {
        type: 'p',
        text: 'Expect the balance sheet and income-and-expenditure account, receipts-and-payments account, schedules of funds and fixed assets, notes on accounting policy, annexures on TDS and statutory dues, and the tax audit report in Form 10B or 10BB. FCRA audits add donor-wise receipt certification. Read the management letter seriously — the auditor notes control weaknesses there that become renewal objections later. An illustrative example: a Patna water-conservation NGO we know fixed its missing fixed-asset register after one audit remark and sailed through its next donor due diligence.',
      },
      {
        type: 'note',
        title: 'Keep auditor and accountant separate',
        text: 'The person writing your daily books should not be the person auditing them. Even tiny NGOs should separate bookkeeping from audit — shared hands are the commonest audit qualification in small-trust reports.',
      },
      { type: 'h2', text: 'Using the audit beyond compliance' },
      {
        type: 'p',
        text: 'Publish a two-page financial summary on your noticeboard or website: income split, programme vs administration ratio, and auditor name. Donors reward this openness disproportionately. File the report into ITR-7, FC-4 and grant utilisation certificates within weeks of signing so figures never drift apart across documents.',
      },
    ],
    faqs: [
      {
        q: 'Is audit compulsory for all NGOs in India?',
        a: 'Effectively yes for most. 12A/12AB, 80G and FCRA holders need annual audit, Section 8 companies audit under the Companies Act 2013, and societies usually audit under state Registrar rules. Only tiny unregistered groups below all thresholds may escape — and even they benefit from voluntary audit when seeking grants.',
      },
      {
        q: 'Who can audit an NGO?',
        a: 'A chartered accountant holding a valid certificate of practice, formally appointed by the managing committee or board. Choose one experienced with non-profit specifics like corpus funds, restricted grants and Form 10B/10BB. The auditor must remain independent of bookkeeping and management.',
      },
      {
        q: 'What is Form 10B and 10BB for NGOs?',
        a: 'They are the tax audit reports charitable institutions upload before filing ITR-7. Form 10B is the detailed version for larger organisations above prescribed thresholds; 10BB is the simpler one for smaller ones. Thresholds change, so your auditor confirms which applies each year.',
      },
      {
        q: 'What documents does the auditor ask for?',
        a: 'Registration certificates, bylaws or trust deed, full books with vouchers, all twelve months of bank statements, donation records with donor details, grant agreements, TDS challans and filed returns, asset registers, minutes approving the accounts, and prior-year audit and ITR copies for continuity.',
      },
      {
        q: 'Can donors see our audit report?',
        a: 'They routinely ask for it, and sharing builds trust. Many NGOs publish audited summaries on their website or a public transparency page. Keep the full signed report ready for due diligence — refusal to share is itself a red flag for funders.',
      },
    ],
    productTieIn:
      'A public transparency page on Sangathan lets NGOs publish audited summaries and reports where donors actually look for them.',
  },
  {
    slug: 'tds-rules-ngo-payments',
    title: 'TDS Rules for NGOs: Salaries, Rent & Contractor Payments',
    description:
      'TDS for NGOs made simple: salaries, rent and contractor payments in plain English, quarterly 24Q/26Q filing, Form 16/16A, and mistakes small NGOs make.',
    keywords: [
      'tds for ngo',
      'tds deduction ngo salary',
      'ngo tds on rent',
      'tds professional fees section 194j',
      'form 24q 26q ngo',
    ],
    category: 'ngo-compliance',
    datePublished: '2026-09-24',
    keyTakeaways: [
      'Tax exemption on income does not exempt an NGO from deducting TDS on salaries, rent and professional payments.',
      'Deposit deducted tax monthly, file 24Q (salaries) and 26Q (other payments) quarterly, and issue Form 16/16A.',
      'Rates change with Finance Acts — always verify current rates on incometax.gov.in rather than memorising figures.',
      'Missing TAN, late deposits and unfiled quarters are the three errors that haunt small NGOs for years.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'Here is the misunderstanding that costs small NGOs the most: "we are tax-exempt, so TDS does not apply to us." Wrong. Your income may be exempt under Sections 11 and 12, but when you pay salaries, rent or professionals, you are a tax deductor like any employer. This guide explains the duties in plain English.',
      },
      { type: 'h2', text: 'Which payments attract TDS' },
      {
        type: 'p',
        text: 'The Income Tax Act requires TDS on common NGO payments: salaries under Section 192 (deducted per the employee slab), rent under Section 194-I, professional and technical fees under Section 194J, contractor payments under Section 194C, and similar provisions for interest and commissions. Small thresholds decide whether deduction triggers in a given month — your accountant should map every recurring payee against the relevant section once, then run the sheet monthly.',
      },
      {
        type: 'table',
        title: 'Common NGO payments and TDS treatment (indicative)',
        headers: ['Payment', 'Section', 'Idea of rate', 'Return form'],
        rows: [
          ['Salaries', '192', 'Slab rate of employee', '24Q'],
          ['Office or hall rent', '194-I', 'Lower slab for land/building, higher for plant — check Finance Act', '26Q'],
          ['Professional fees (CA, trainers)', '194J', 'Indicative single-digit to low double-digit percent — verify current rates', '26Q'],
          ['Contractors (repairs, printing)', '194C', 'Small indicative percent, differs for individuals vs firms — verify', '26Q'],
          ['Audit fee to CA firm', '194J', 'As per current professional-fees rate', '26Q'],
        ],
      },
      {
        type: 'note',
        title: 'Rates move — verify, do not memorise',
        text: 'TDS rates and thresholds change through Finance Acts and notifications. Treat the rate column above as orientation only and confirm exact current rates on incometax.gov.in or with your auditor before every quarter filing.',
      },
      { type: 'h2', text: 'The quarterly rhythm: deposit, file, certify' },
      {
        type: 'p',
        text: 'First, obtain TAN — the tax deduction account number — without which nothing moves. Deduct at payment time, deposit the tax monthly through challans, file quarterly statements (24Q for salaries, 26Q for the rest), and issue Form 16 to employees and Form 16A to others as deduction certificates. Reconcile every quarter against Form 26AS and AIS so a missed challan surfaces in weeks, not years.',
      },
      {
        type: 'figure',
        figure: {
          type: 'steps',
          title: 'Quarterly TDS routine for a small NGO',
          steps: [
            'Check the payee master: correct PAN, section and rate for each regular payment.',
            'Deduct at the time of payment or credit, whichever comes first.',
            'Deposit tax via challan within the monthly due date and save the challan.',
            'File 24Q/26Q for the quarter on the e-filing portal before the quarterly deadline.',
            'Issue Form 16/16A and reconcile with 26AS and AIS.',
          ],
        },
      },
      { type: 'h2', text: 'Mistakes small NGOs keep making' },
      {
        type: 'p',
        text: 'The greatest hits: paying a trainer ₹40,000 with no deduction "because she is an individual", forgetting rent TDS on the office, deducting but never depositing, filing nil quarters while payments continued, and losing Form 16A requests from vendors at year-end. An illustrative example: a Surat craft collective we know skipped TAN for two years, then spent a full quarter regularising old payments with interest and late fees before a grant could be released.',
      },
      {
        type: 'list',
        items: [
          'Apply for TAN the month you hire your first paid staffer or rent an office.',
          'Collect PAN from every payee before the first payment, not in March.',
          'Never delay challan deposits — interest runs monthly and adds up fast.',
          'File every quarter even if one quarter is genuinely nil, to keep the chain clean.',
          'Keep challans, returns and certificates filed with the annual audit bundle.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Do tax-exempt NGOs need to deduct TDS?',
        a: 'Yes. Exemption under Sections 11 and 12 covers the NGO income, not its role as a payer. Salaries, rent, professional fees and contractor payments attract TDS under Sections 192, 194-I, 194J and 194C respectively, exactly as for any other deductor.',
      },
      {
        q: 'What are Form 24Q and 26Q?',
        a: 'They are quarterly TDS statements: 24Q reports salary deductions under Section 192, while 26Q covers non-salary payments like rent, professional fees and contracts. File both every quarter on incometax.gov.in and issue Form 16 (salary) and 16A (non-salary) certificates to payees.',
      },
      {
        q: 'What TDS rate applies to professional fees paid by an NGO?',
        a: 'Professional and technical fees fall under Section 194J, with rates that can differ for professional versus technical services and change via Finance Acts. Check the current rate on incometax.gov.in or with your auditor before deducting — do not rely on remembered figures.',
      },
      {
        q: 'Does an NGO need TAN?',
        a: 'Yes, the moment it makes payments liable to TDS — typically the first salary or office rent. TAN is the deduction account number quoted on every challan, return and certificate. Apply early on the e-filing portal; operating without one while deducting is not an option.',
      },
      {
        q: 'What happens if an NGO misses TDS deadlines?',
        a: 'Interest accrues on late deposits, late-filing fees apply per quarterly statement, and undeducted amounts can be disallowed as expenses in assessment. Persistent default also embarrasses you in audits and donor due diligence. Regularise quickly with interest, then lock in the quarterly routine.',
      },
    ],
  },
]
