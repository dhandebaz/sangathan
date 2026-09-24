import type { SeoArticle } from '../types'

export const batch3Articles: SeoArticle[] = [
  {
    slug: '80g-donation-receipt-format',
    title: '80G Donation Receipt Format: Mandatory Fields + Checklist',
    description:
      'Get the 80G receipt format right: every mandatory field Indian NGOs need, the amount-in-words habit, the Rs 2,000 cash rule, and a ready checklist.',
    keywords: [
      '80g receipt format',
      'donation receipt format ngo',
      '80g receipt mandatory fields',
      'donation receipt india format',
      '80g receipt cash limit',
    ],
    category: 'fundraising',
    datePublished: '2026-09-24',
    keyTakeaways: [
      'An 80G receipt must show trust name, PAN, approval number, receipt number, date, donor details, amount in figures and words, and payment mode.',
      'Only organisations holding their own 80G registration can issue 80G receipts; an application is not an approval.',
      'Cash donations above Rs 2,000 do not qualify for 80G deduction, so record and encourage digital or cheque payments.',
      'File Form 10BE on incometax.gov.in so each donation appears in the donor claim record.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'A donation receipt looks like a small piece of paper, but for your donor it supports their tax deduction under Section 80G of the Income Tax Act, 1961. A missing PAN or an expired approval number means awkward questions at filing time. This guide covers every mandatory field, the habits that prevent errors, and a checklist you can pin above your desk.',
      },
      { type: 'h2', text: 'Every mandatory field, explained simply' },
      {
        type: 'p',
        text: 'A proper 80G receipt carries the organisation legal name exactly as registered, the registered address, and the PAN. It shows the 80G approval number with validity, a unique serial number, and the donation date. Then come donor details: full name and address, and PAN where shared. The amount appears twice — in figures and in words — plus the mode of payment (UPI, cheque, transfer, or cash). Close with the authorised signature and seal. Illustrative example: a Jaipur education trust we know of prints PAN and the 80G approval number in every receipt header, so volunteers cannot issue one with those fields accidentally blank.',
      },
      {
        type: 'figure',
        figure: {
          type: 'checklist',
          title: '80G receipt checklist — check before you hand it over',
          items: [
            'Registered legal name of the organisation, spelt exactly as in the 80G approval order',
            'PAN of the organisation and the 80G approval number with validity dates',
            'Unique receipt serial number and date of donation',
            'Donor full name and address, plus donor PAN if shared',
            'Donation amount in figures AND in words — both must match',
            'Mode of payment written out (UPI/cheque/transfer/cash)',
            'Authorised signature with seal or stamp',
          ],
        },
        caption: 'Run this checklist on every receipt before it leaves your office.',
      },
      { type: 'h2', text: 'The Rs 2,000 cash rule and the amount-in-words habit' },
      {
        type: 'p',
        text: 'Under Section 80G, cash donations above Rs 2,000 do not qualify for deduction at all. The receipt can still record a large cash gift honestly, but the donor cannot claim it. Train your volunteers to say this line politely at the counter: for any gift above Rs 2,000, please pay by UPI, cheque, or bank transfer. The second habit is writing the amount in words alongside figures. Figures are easy to alter and easy to mistype; words force a second moment of attention. When your register, your receipt, and your bank entry all agree, reconciliation at month-end takes minutes instead of days.',
      },
      {
        type: 'table',
        title: 'Field, why it matters, and the common mistake',
        headers: ['Field', 'Why it matters', 'Common mistake'],
        rows: [
          ['Organisation legal name', 'Must match the 80G approval order', 'Using a campaign brand name instead'],
          ['PAN', 'Links the receipt to your tax filings', 'Leaving it off pre-printed books'],
          ['80G approval number + validity', 'Proves the approval covered the donation date', 'Quoting an expired approval'],
          ['Receipt serial number', 'Keeps books auditable and gap-free', 'Reusing numbers across books'],
          ['Amount in figures and words', 'Prevents tampering and typos', 'Figures only, words skipped'],
          ['Mode of payment', 'Supports the Rs 2,000 cash rule check', 'Writing vague terms like paid'],
        ],
      },
      { type: 'h2', text: 'Receipts, approval orders, and Form 10BE' },
      {
        type: 'p',
        text: 'Three documents work together. The approval order is the Income Tax Department grant of 80G status to your organisation. The receipt is what you hand the donor as proof of payment. Form 10BE is the annual statement you file on incometax.gov.in, which the donor tax record then reflects. Missing the 10BE filing is the most common reason donors complain a genuine donation did not show up — put its due date on your compliance calendar.',
      },
      {
        type: 'note',
        title: 'Honest wording matters',
        text: 'Call a receipt an 80G receipt only when your organisation holds its own active 80G registration. If approval is still applied for, issue a plain donation acknowledgement without 80G claims, and say so clearly to the donor.',
      },
      { type: 'h2', text: 'Setting up a receipt system that survives volunteer turnover' },
      {
        type: 'p',
        text: 'Pre-print the fields that never change: legal name, address, PAN, and 80G approval number with validity. Number every book and log which volunteer holds it. Enter each receipt in the donation register the same day, and match the register against the bank statement monthly. Auditors, donors, and your future self all trust boring, complete records.',
      },
      {
        type: 'list',
        items: [
          'Pre-print fixed fields so volunteers cannot skip them.',
          'Number receipt books and track who holds each one.',
          'Enter every receipt in the donation register the same day.',
          'Match the register with the bank statement every month.',
          'File Form 10BE on time so donor claims go through smoothly.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What is the format of an 80G donation receipt in India?',
        a: 'An 80G receipt shows the organisation registered name, address, PAN, 80G approval number with validity, unique receipt number, date, donor name and address, amount in figures and words, payment mode, and an authorised signature with seal. Pre-printing the fixed fields stops volunteers skipping them accidentally.',
      },
      {
        q: 'Can my NGO issue 80G receipts while the application is pending?',
        a: 'No. Only an organisation holding its own active 80G registration can issue 80G receipts. An application under process is not an approval. Until approval arrives, issue a plain donation acknowledgement without 80G claims, and explain honestly so donors do not attempt a deduction they cannot support.',
      },
      {
        q: 'What is the Rs 2,000 cash rule for 80G donations?',
        a: 'Cash donations above Rs 2,000 do not qualify for 80G deduction under the Income Tax Act, 1961, however genuine the NGO. For larger gifts, donors should pay by UPI, cheque, or bank transfer. Always write the payment mode on the receipt so the position is clear to everyone.',
      },
      {
        q: 'What is Form 10BE and why do donors ask about it?',
        a: 'Form 10BE is the annual statement of donations your NGO files on incometax.gov.in, and the donor tax record reflects it at claim time. If you skip this filing, donors may find a genuine donation missing when they file — so track its due date.',
      },
    ],
    productTieIn:
      'Sangathan donation records enforce 80G-ready fields — donor name, amount in figures and words, mode of payment, and approval details — before a receipt is generated, so volunteer-issued receipts stay complete.',
  },
  {
    slug: 'donation-receipt-vs-80g-certificate',
    title: 'Donation Receipt vs 80G Certificate: What Donors Actually Need',
    description:
      'Confused between 80G certificate vs receipt? Learn what a donation receipt, approval order, and Form 10BE each do, and what donors need to claim deduction.',
    keywords: [
      '80g certificate vs receipt',
      'donation receipt 80g difference',
      'what is 80g certificate',
      'form 10be donation claim',
      '80g approval order ngo',
    ],
    category: 'fundraising',
    datePublished: '2026-09-24',
    keyTakeaways: [
      'The donation receipt proves the donor paid; the 80G approval order proves the NGO held 80G status.',
      'Form 10BE is the NGO annual statement on incometax.gov.in that supports the donor deduction claim.',
      'Donors need a complete receipt plus a 10BE-backed entry — a certificate image alone is not enough.',
      'NGOs should share the approval order copy on request and never imply pending applications equal approval.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'Ask ten donors what an 80G certificate is and you will get ten different answers. Some think the receipt itself is the certificate. Some think a scanned certificate image is all they need at filing time. The confusion costs real money — donors lose deductions, and NGOs lose trust. Here is the plain distinction: the receipt proves payment, the approval order proves status, and Form 10BE connects the two in tax records.',
      },
      { type: 'h2', text: 'Three documents, three different jobs' },
      {
        type: 'p',
        text: 'The donation receipt is issued per donation. It records who gave, how much, when, and how — and it is the paper the donor keeps. The 80G approval order is issued once by the Income Tax Department to the organisation under the Income Tax Act, 1961, granting 80G status for a validity period, typically a five-year block since the 2020 reforms. Form 10BE is filed by the NGO every year on incometax.gov.in, listing donations received. The donor claim rests on the receipt plus the 10BE entry; the approval order is the background proof that the organisation qualified during that period.',
      },
      {
        type: 'table',
        title: 'Receipt vs approval order vs Form 10BE',
        headers: ['Document', 'Issued by', 'What it proves'],
        rows: [
          ['Donation receipt', 'NGO, per donation', 'Donor paid a specific amount on a date by a stated mode'],
          ['80G approval order', 'Income Tax Department, per approval period', 'Organisation held 80G status with validity dates'],
          ['Form 10BE', 'NGO files yearly on incometax.gov.in', 'Donation is reported in official records for the year'],
          ['Donor PAN trail', 'Payment system and receipt', 'Payment is traceable, supporting the Rs 2,000 cash rule'],
        ],
      },
      { type: 'h2', text: 'What donors actually need at filing time' },
      {
        type: 'p',
        text: 'A donor needs a complete receipt: your registered name, PAN, 80G approval number, receipt serial number, date, their name and address, amount in figures and words, and mode of payment. Then they need your Form 10BE filing to reflect their donation. Illustrative example: a first-time donor in Lucknow we heard about kept only a WhatsApp thank-you message and discovered at filing time that it proved nothing — no receipt number, no PAN, no approval reference. A two-minute receipt routine at the collection desk would have saved the deduction.',
      },
      {
        type: 'figure',
        figure: {
          type: 'steps',
          title: 'What a careful donor checks before filing',
          steps: [
            'Receipt shows the NGO registered name, PAN, and 80G approval number with validity.',
            'Receipt shows donor name, date, amount in figures and words, and payment mode.',
            'Donation date falls inside the approval validity period.',
            'Payment above Rs 2,000 was made digitally or by cheque, not cash.',
            'NGO confirms the donation appears in its Form 10BE filing.',
          ],
        },
      },
      { type: 'h2', text: 'What NGOs should give — and say — clearly' },
      {
        type: 'p',
        text: 'Hand over a complete receipt promptly, ideally within a week. Share a copy of your current approval order when a donor or company asks — legitimate organisations do this routinely. If your 80G application is still pending, say so plainly and issue a non-80G acknowledgement. Never let a volunteer promise that approval is automatic or that a backdated receipt can fix an expired approval period.',
      },
      {
        type: 'note',
        title: 'The phrase that causes trouble',
        text: 'Approval under process means not approved. Donations given during this window do not qualify for 80G deduction. Say it upfront and you keep the donor; hide it and you lose them when filing season arrives.',
      },
      { type: 'h2', text: 'Answering the questions donors ask most' },
      {
        type: 'list',
        items: [
          'Is this receipt enough for my tax filing? Yes, if it is complete and your donation sits inside our approval validity.',
          'Can I see your 80G approval? Yes — here is the current order copy with validity dates.',
          'Will my donation show in official records? Yes, through our yearly Form 10BE filing.',
          'I paid cash above Rs 2,000 — can I still claim? Honestly, no; the law bars deduction for that payment.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What is the difference between a donation receipt and an 80G certificate?',
        a: 'A donation receipt is issued per donation and proves the donor paid a specific amount on a date. The 80G approval order, often called the certificate, is issued by the Income Tax Department to the NGO and proves it held 80G status for a validity period. Donors need the receipt plus the NGO Form 10BE filing; the certificate image alone supports no claim.',
      },
      {
        q: 'What does a donor need to claim 80G deduction?',
        a: 'A complete receipt with the NGO registered name, PAN, 80G approval number, receipt number, date, donor details, amount in figures and words, and payment mode. The donation date must fall inside the approval validity period, payments above Rs 2,000 must be non-cash, and the NGO must have reported the donation in its yearly Form 10BE.',
      },
      {
        q: 'What is Form 10BE in simple words?',
        a: 'Form 10BE is the yearly statement an NGO files on incometax.gov.in listing the donations it received. It connects the donor receipt to official tax records. If the NGO misses this filing, the donor may find their genuine donation missing when they file. NGOs should confirm to donors each year that 10BE has been filed.',
      },
      {
        q: 'Can I claim 80G if the NGO approval was pending when I donated?',
        a: 'No. A pending application is not an approval, and donations made before approval arrives do not qualify for deduction. You can still support the cause wholeheartedly, but do not claim the tax benefit. Ask the NGO for a plain acknowledgement and donate again after approval if the deduction matters to you.',
      },
      {
        q: 'Should NGOs share their 80G approval order with donors?',
        a: 'Yes, on request. Sharing the current approval order with its validity dates is normal practice and builds confidence, especially with companies and large donors. Keep a clean PDF copy ready, and make sure receipts quote the same approval number and validity that the order shows.',
      },
    ],
    productTieIn:
      'Sangathan donation records keep each receipt 80G-ready with approval details and donor fields, so answering donor questions at filing time means opening a record, not hunting through paper books.',
  },
  {
    slug: 'csr-funding-ngo-eligibility',
    title: 'CSR Funding for NGOs: Eligibility, CSR-1 & Company Selection',
    description:
      'CSR funding for NGOs explained: eligibility, CSR-1 registration on the MCA portal, Schedule VII fit, and how companies actually shortlist NGO partners.',
    keywords: [
      'csr funding for ngo',
      'csr-1 registration',
      'csr eligibility ngo',
      'how to get csr funds',
      'schedule vii ngo activities',
    ],
    category: 'fundraising',
    datePublished: '2026-09-24',
    keyTakeaways: [
      'Companies look for a three-year track record plus 12A and 80G registrations under the Income Tax Act, 1961.',
      'File Form CSR-1 on mca.gov.in to get a CSR registration number before approaching companies.',
      'Your work must fit a Schedule VII theme of the Companies Act, 2013.',
      'Companies shortlist partners with audited statements, field presence, and measurable past outcomes.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'Every year, hundreds of small NGOs write to companies asking for CSR support, and most letters go unanswered. The reason is rarely the cause — it is eligibility and presentation. Companies giving under Section 135 of the Companies Act, 2013 must follow strict rules on who they can fund. Understand those rules first, and your proposal lands in a much smaller, much more serious pile.',
      },
      { type: 'h2', text: 'Eligibility: what companies must check before funding you' },
      {
        type: 'p',
        text: 'The CSR framework expects NGO partners to have an established track record of at least three years in activities similar to the proposed project. Companies routinely ask for 12A and 80G registrations under the Income Tax Act, 1961, audited financial statements, and registration on NITI Aayog NGO Darpan at ngodarpan.gov.in with a Unique ID. Your project must also fit one of the Schedule VII themes — education, health, environment, rural development, gender equality, and similar listed areas. Illustrative example: a Nagpur health NGO we know of spent a year getting its Darpan profile, 12A, 80G, and audits in order before approaching a single company, and its first two meetings went strikingly better than its earlier cold emails ever had.',
      },
      {
        type: 'figure',
        figure: {
          type: 'checklist',
          title: 'CSR-readiness checklist for NGOs',
          items: [
            'Three years of work in the proposed activity area, with reports to show',
            '12A and 80G registrations under the Income Tax Act, 1961',
            'NGO Darpan Unique ID from ngodarpan.gov.in with updated profile',
            'Form CSR-1 filed on mca.gov.in with CSR registration number received',
            'Three years of audited financial statements and annual reports',
            'Project mapped clearly to one Schedule VII theme',
          ],
        },
      },
      { type: 'h2', text: 'CSR-1 registration and Schedule VII fit' },
      {
        type: 'p',
        text: 'Form CSR-1 is filed on the MCA portal at mca.gov.in, signed with a digital signature and certified by a practising professional. Once accepted, your NGO receives a CSR registration number — companies ask for this number in their very first screening call, so get it before you start outreach. Schedule VII fit deserves equal care: do not stretch your project to match a theme. If you run a library programme, say education plainly and show reading outcomes. CSR heads review hundreds of proposals and can spot theme-stretching in seconds.',
      },
      {
        type: 'table',
        title: 'Common Schedule VII themes with NGO project examples',
        headers: ['Theme', 'Example projects', 'Evidence companies expect'],
        rows: [
          ['Education and skills', 'Learning centres, scholarships, vocational training', 'Enrolment, attendance, learning assessments'],
          ['Health and sanitation', 'Health camps, nutrition, clean drinking water', 'Patients served, follow-up records'],
          ['Environment', 'Plantation, waste management, water conservation', 'Survival rates, waste volumes, recharge data'],
          ['Rural development', 'Livelihoods, farmer training, village infrastructure', 'Income records, adoption numbers'],
          ['Gender equality and welfare', 'Women self-help groups, shelter support', 'Group records, case documentation'],
        ],
      },
      { type: 'h2', text: 'How companies actually shortlist NGO partners' },
      {
        type: 'p',
        text: 'Shortlisting usually runs through the company CSR team or a foundation arm. They check your registrations and filings, read two or three past project reports, call references from previous funders, and visit your field site. Geography matters — companies prefer projects near their plants and offices. Ticket size matters too: a first grant is often a modest pilot of five to twenty lakh rupees, growing only after clean utilisation reporting. Your proposal should therefore read like an operations plan, not a brochure: baselines, activities month by month, measurable targets, budgets per line item, and exactly how you will report progress.',
      },
      {
        type: 'note',
        title: 'Proposal mistakes that end conversations',
        text: 'Vague budgets, inflated beneficiary counts, no baseline data, and promises of assured outcomes all trigger rejection. Companies fund careful operators, not loud claims. Show last year numbers honestly, including what did not work.',
      },
      { type: 'h2', text: 'A realistic twelve-month path to your first CSR grant' },
      {
        type: 'list',
        items: [
          'Months 1-3: complete CSR-1, update NGO Darpan, organise audits and past reports.',
          'Months 4-6: shortlist 20 companies with local presence and matching Schedule VII themes.',
          'Months 7-9: send tight two-page concepts, follow up, host site visits for interested teams.',
          'Months 10-12: negotiate a pilot-scale project with quarterly reporting milestones.',
          'After funding: report on time, document outcomes with photos and registers, and renew the relationship.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Is CSR-1 registration mandatory for NGOs seeking CSR funds?',
        a: 'Yes, effectively. Companies can only give CSR grants to entities registered through Form CSR-1 on the MCA portal at mca.gov.in, which generates a CSR registration number. File it with a digital signature and professional certification before starting outreach, since company CSR teams ask for this number in their first screening itself.',
      },
      {
        q: 'What is the three-year rule for CSR eligibility?',
        a: 'The CSR framework expects NGO partners to have at least three years of track record in activities similar to the proposed project. Companies verify this through your annual reports, audited statements, and project documentation. New organisations should build this record first, possibly through individual donations and small grants, before approaching companies.',
      },
      {
        q: 'Do NGOs need 12A and 80G for CSR funding?',
        a: 'Companies overwhelmingly expect both 12A and 80G registrations under the Income Tax Act, 1961, alongside CSR-1 and NGO Darpan registration. These signal tax-compliant, established operations. If you lack them, treat getting registered as step one of your CSR journey rather than writing proposals that screening teams will set aside.',
      },
      {
        q: 'What is Schedule VII and why does it matter?',
        a: 'Schedule VII of the Companies Act, 2013 lists the themes that qualify as CSR activity — education, health, environment, rural development, gender equality, and others. Your project must genuinely fit one of these themes. Map your proposal to a single theme with matching evidence instead of stretching claims across several areas.',
      },
      {
        q: 'How much CSR funding can a small NGO expect first?',
        a: 'First grants are usually modest pilots, often in the range of five to twenty lakh rupees, growing after clean utilisation and reporting. Companies test new partners with small, measurable projects near their operational areas. A realistic pilot proposal with quarterly milestones wins more often than an ambitious multi-crore ask from an unknown organisation.',
      },
    ],
  },
  {
    slug: 'upi-donations-tracking-ngo',
    title: 'Tracking UPI Donations for NGOs: Reconciliation Without Excel',
    description:
      'Track UPI donations cleanly: UTR matching routine, daily and weekly reconciliation steps, donor identification fixes, and bank statement discipline for NGOs.',
    keywords: [
      'upi donations ngo',
      'track upi donations',
      'donation reconciliation ngo',
      'upi payment tracking charity',
      'utr matching donations',
    ],
    category: 'fundraising',
    datePublished: '2026-09-24',
    keyTakeaways: [
      'Match every UPI credit to a donor using the UTR number plus date and amount.',
      'Reconcile daily for festival and campaign peaks, weekly as a minimum routine.',
      'Fix donor identification with purpose-built QR codes, reference fields, and a confirmation message habit.',
      'Keep one donation register where bank entries and receipts agree line by line.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'UPI has made donating beautifully easy — scan, pay, done. For the NGO treasurer, though, it has created a daily puzzle: thirty small credits with cryptic narration lines, half of them without donor names. Money arrives faster than information. This guide gives you a reconciliation routine that matches every rupee to a donor without heroic month-end spreadsheet sessions.',
      },
      { type: 'h2', text: 'Why UPI donations go unidentified' },
      {
        type: 'p',
        text: 'A UPI credit in your bank statement typically shows a UTR or reference number, an amount, a date, and a fragment of the payer name or VPA — often truncated beyond recognition. Family members donate from one phone, supporters forget to mention the campaign, and festival appeals trigger bursts of small anonymous credits. Illustrative example: a Pune animal-care group we know of received forty-two UPI credits during a Diwali appeal and could identify only nineteen donors from bank narration alone. The rest required patient follow-up that should have been designed into the appeal from the start.',
      },
      {
        type: 'figure',
        figure: {
          type: 'steps',
          title: 'The daily UTR matching routine',
          steps: [
            'Download or note the day UPI credits with UTR, amount, date, and payer fragment.',
            'Match each credit against donation alerts, forms, and WhatsApp confirmations received.',
            'Enter matched donations in the register with receipt numbers the same day.',
            'Message unmatched payers from campaign groups asking for name and purpose.',
            'Carry only the genuinely unidentified items to the weekly review, never to month-end.',
          ],
        },
        caption: 'Fifteen minutes daily beats five painful hours at month-end.',
      },
      { type: 'h2', text: 'Design appeals so donors identify themselves' },
      {
        type: 'p',
        text: 'Prevention beats detective work. Use separate QR codes or UPI IDs per campaign so a Diwali-drive credit never mixes with general donations. Ask donors to add a short note in the UPI reference field, like a name or campaign word. Add a simple donation form link beside every QR code, and request a screenshot on WhatsApp for receipts. Most supporters comply happily when the request is short and the reason is honest: we want your 80G receipt to reach you without delay.',
      },
      {
        type: 'table',
        title: 'Identification problems and practical fixes',
        headers: ['Problem', 'Fix', 'Effort'],
        rows: [
          ['Truncated payer names in statements', 'Ask for WhatsApp screenshot with name after payment', 'Low'],
          ['One QR code for all campaigns', 'Separate QR or UPI ID per campaign', 'One-time setup'],
          ['No purpose mentioned', 'Request a reference word in the UPI note field', 'Low'],
          ['Family phone, unknown donor', 'Donation form link beside every QR code', 'One-time setup'],
          ['Festival credit bursts', 'Daily matching during campaigns, volunteer on duty', 'Medium'],
        ],
      },
      { type: 'h2', text: 'Weekly discipline and bank statement habits' },
      {
        type: 'p',
        text: 'Once a week, sit with the bank statement and the donation register side by side. Every credit needs a matching receipt entry; every receipt needs a matching credit. Investigate gaps while memories are fresh — a donor asked on day three remembers the payment, while the same question after forty days feels like an audit. Keep digital copies of statements filed by month, and never edit narration lines when copying them into your register. Your auditor will trust records that preserve the original trail, warts and all.',
      },
      {
        type: 'note',
        title: 'Unidentified credits are still your responsibility',
        text: 'Money you cannot attribute still sits in your books and your 80G and audit position. Keep an unidentified-items list, follow up diligently, and place unresolved entries before your auditor or CA rather than quietly absorbing them.',
      },
      { type: 'h2', text: 'Receipts for UPI donors, without delay' },
      {
        type: 'list',
        items: [
          'Issue 80G-ready receipts within a week, faster during campaigns.',
          'Quote the UTR or reference number on the receipt for traceability.',
          'Send receipts digitally with a thank-you line; collect addresses for 80G needs.',
          'Reflect every receipted donation in Form 10BE filing for the year.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How do NGOs track UPI donations with only bank statements?',
        a: 'Use the UTR or reference number with date and amount as your matching key. Compare each credit against donation forms, QR-code campaign splits, and WhatsApp confirmations. Enter matches in the donation register daily, and follow up on unmatched items within days while donors still remember the payment clearly.',
      },
      {
        q: 'What is UTR matching for donations?',
        a: 'Every UPI payment carries a unique UTR or reference number visible in both the donor payment app and your bank statement. Quoting that number on the donation receipt links the receipt to the bank trail permanently. It is the single most reliable identifier when payer names appear truncated or unclear in statements.',
      },
      {
        q: 'How should my NGO handle unidentified UPI credits?',
        a: 'Keep a running unidentified-items list with UTR, date, and amount. Message campaign groups promptly, check with volunteers who shared QR codes, and review weekly. Place genuinely unresolved entries before your auditor or CA for proper treatment instead of absorbing them quietly into general funds without documentation.',
      },
      {
        q: 'Should we use separate QR codes for each campaign?',
        a: 'Yes. Separate QR codes or UPI IDs per campaign let you attribute credits by destination account even when donors skip the reference note. It is a one-time setup that pays off in every festival appeal. Pair each code with a short donation form link so donor details arrive alongside the money.',
      },
      {
        q: 'How fast should UPI donation receipts be issued?',
        a: 'Within a week as routine, and within two to three days during active campaigns. Fast receipts confirm to donors that their money reached the right hands, improve repeat giving, and keep your register current. Digital receipts with the UTR quoted work well for UPI donors.',
      },
    ],
    productTieIn:
      'Sangathan donation records store the UTR or payment reference against each receipt, so matching the register to the bank statement becomes a line-by-line check instead of a memory exercise.',
  },
  {
    slug: 'fundraising-ideas-small-ngo-india',
    title: '11 Practical Fundraising Ideas for Small Indian NGOs',
    description:
      'Eleven small-budget fundraising ideas for Indian NGOs: festival drives, school partnerships, membership circles, and more, each with effort and cost notes.',
    keywords: [
      'fundraising ideas for ngo india',
      'small ngo fundraising',
      'ngo donation ideas',
      'charity fundraising india',
      'ngo festival donation drive',
    ],
    category: 'fundraising',
    datePublished: '2026-09-24',
    keyTakeaways: [
      'Small NGOs raise more with repeatable local efforts than with one grand annual event.',
      'Festival drives, school partnerships, and membership circles suit tiny teams and budgets.',
      'Every idea needs an owner, a target amount, and a receipt routine before launch.',
      'Avoid lotteries, pressure tactics, and promises your team cannot keep.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'Small NGOs often assume fundraising means a glittering gala dinner. It does not. For a team of five volunteers, the maths that works is humbler: many small, repeatable efforts rooted in your neighbourhood. The eleven ideas below are chosen for low cost, honest effort levels, and suitability for Indian towns and cities. Pick two, run them well, and repeat what works.',
      },
      { type: 'h2', text: 'Community-rooted drives that cost almost nothing' },
      {
        type: 'numbered',
        items: [
          'Festival donation drive: set up a stall or door-to-door round during Diwali, Eid, or Pongal with a clear one-line cause. Effort: medium. Cost: printing and a QR stand.',
          'School partnership: offer a weekend activity — storytelling, clean-up, painting — with a voluntary parent contribution. Effort: medium. Cost: materials only.',
          'Membership circle: invite fifty local supporters to give a fixed small sum monthly, with a one-page quarterly update. Effort: low after setup. Cost: near zero.',
          'Birthday and anniversary giving: ask supporters to dedicate celebrations to your cause with a shareable appeal link. Effort: low. Cost: zero.',
          'Community kitchen or lunch: sell coupons for a Sunday meal cooked by volunteers, with the surplus going to the cause. Effort: high. Cost: ingredients.',
          'Book and clothes sale: collect pre-loved items for a weekend sale in your lane or society hall. Effort: medium. Cost: venue permission and tables.',
        ],
      },
      {
        type: 'p',
        text: 'Illustrative example: a Coimbatore literacy group we know of runs a membership circle of sixty supporters giving Rs 200 a month, and that steady Rs 12,000 covers their library rent without a single stressful annual scramble. Small sums, collected faithfully, beat occasional windfalls.',
      },
      { type: 'h2', text: 'Events and partnerships that stretch your reach' },
      {
        type: 'numbered',
        items: [
          'Skill workshop fundraiser: charge a modest fee for tailoring, spoken English, or computer basics taught by volunteers. Effort: medium. Cost: venue and materials.',
          'Friendly sports match: organise a cricket or kabaddi game with entry coupons and local shop sponsorships for water and medals. Effort: high. Cost: ground and refreshments.',
          'Local shop collection boxes: place sealed, numbered boxes in friendly kirana and medical stores with monthly opening in pairs. Effort: low. Cost: boxes and seals.',
          'Corporate volunteering day: invite a nearby company team for a half-day activity with a participation contribution. Effort: medium. Cost: activity materials.',
          'Fair and haat stall: sell volunteer-made crafts, pickles, or plants at local fairs with visible cause signage. Effort: medium. Cost: stall fee and stock.',
        ],
      },
      {
        type: 'table',
        title: 'Ideas compared by effort, cost, and character',
        headers: ['Idea', 'Effort', 'Typical cost', 'Best for'],
        rows: [
          ['Festival drive', 'Medium', 'Printing + QR stand', 'Seasonal visibility'],
          ['Membership circle', 'Low after setup', 'Near zero', 'Steady monthly income'],
          ['School partnership', 'Medium', 'Activity materials', 'Parent and teacher networks'],
          ['Community lunch', 'High', 'Ingredients', 'Neighbourhood bonding'],
          ['Collection boxes', 'Low', 'Boxes and seals', 'Passive small change'],
          ['Skill workshop', 'Medium', 'Venue + materials', 'Demonstrable value exchange'],
        ],
      },
      { type: 'h2', text: 'What to avoid, however tempting' },
      {
        type: 'p',
        text: 'Skip anything resembling a lottery or lucky draw with prizes — prize-linked collections invite legal trouble under state lottery and prize regulations. Never pressure schoolchildren or employees to contribute, and never let volunteers quote 80G benefits your organisation does not hold. Avoid booking expensive venues on borrowed hope; if an event needs a loan to happen, shrink the event. Finally, do not launch five ideas at once. A small team running two efforts with clean receipts and thank-you notes raises more than the same team running six efforts messily.',
      },
      {
        type: 'figure',
        figure: {
          type: 'dos-donts',
          title: 'Small-NGO fundraising discipline',
          dos: [
            'Assign one owner and one money target per idea.',
            'Issue receipts on the spot or within days.',
            'Thank every donor personally, however small the gift.',
            'Record collections in pairs with signed counts.',
          ],
          donts: [
            'Run prize-linked draws or lucky-draw schemes.',
            'Promise 80G benefits without active 80G registration.',
            'Mix event cash with general funds before counting.',
            'Launch more efforts than your volunteers can track.',
          ],
        },
      },
    ],
    faqs: [
      {
        q: 'What is the easiest fundraising idea for a new small NGO?',
        a: 'A membership circle of local supporters giving a small fixed sum monthly is usually the easiest start. It needs no venue and almost no cost — just a list, a UPI ID, and a one-page quarterly update. Even fifty members at Rs 100 to Rs 200 a month creates predictable income that covers rent or materials.',
      },
      {
        q: 'How can small NGOs raise funds during festivals?',
        a: 'Run a focused festival drive with a single clear ask, visible QR codes, and volunteers issuing receipts on the spot. Door-to-door rounds, society stalls, and shop partnerships all work. Prepare change, receipt books, and a daily counting routine in pairs so festival enthusiasm converts into clean, accounted collections.',
      },
      {
        q: 'Can NGOs put donation boxes in shops?',
        a: 'Yes, with the shopkeeper written consent. Use sealed, serially numbered boxes, record which shop holds each box, and open them monthly in pairs with signed counts and immediate receipts into your books. Small change accumulates surprisingly well, and the boxes keep your cause visible in the neighbourhood all year.',
      },
      {
        q: 'Should small NGOs organise big charity events?',
        a: 'Usually not at first. Big events carry venue, catering, and sound costs that can swallow the collections. Start with low-cost efforts like sales, workshops, and membership circles. Attempt a larger event only after smaller efforts show you can mobilise volunteers, count cash cleanly, and follow up with donors afterwards.',
      },
      {
        q: 'What fundraising mistakes do small NGOs make most?',
        a: 'Launching too many efforts at once, skipping receipts for small gifts, mixing event cash with general funds before counting, and promising tax benefits they cannot offer. Each mistake is avoidable: fewer efforts, same-day receipts, paired counting, and honest wording about 80G status keep trust intact.',
      },
    ],
  },
  {
    slug: 'donor-retention-ngo-india',
    title: 'Donor Retention for NGOs: 7 Habits That Bring Repeat Donations',
    description:
      'Donor retention for NGOs made practical: seven habits — fast receipts, utilisation reports, festival updates — that turn one-time givers into repeat donors.',
    keywords: [
      'donor retention ngo',
      'repeat donors charity',
      'donor engagement ngo india',
      'ngo donor communication',
      'donor thank you ngo',
    ],
    category: 'fundraising',
    datePublished: '2026-09-24',
    keyTakeaways: [
      'Thank every donor within 48 hours and send 80G-ready receipts within a week.',
      'Show utilisation with photos, registers, and specific numbers, not adjectives.',
      'Stay in touch through festivals and quarterly updates without always asking for money.',
      'Win back lapsed donors with a personal message and one concrete story of impact.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'Acquiring a new donor costs far more effort than keeping an existing one, yet most small NGOs chase new names while old supporters quietly drift away. Donors rarely leave because of the cause — they leave because nobody thanked them, nobody showed them what their money did, and the next ask arrived out of nowhere. Seven steady habits fix all three problems.',
      },
      { type: 'h2', text: 'The first three habits: gratitude, receipts, and proof' },
      {
        type: 'numbered',
        items: [
          'Thank within 48 hours. A personal call or message naming the amount and purpose beats a bulk forward every time. Thank the Rs 101 donor with the same warmth as the Rs 11,000 one.',
          'Send receipts within a week. For 80G donors, the receipt with approval details plus Form 10BE follow-through proves your professionalism at filing season.',
          'Report utilisation with specifics. Three photos of the books bought, the attendance register page, and the line — your Rs 5,000 funded science kits for Class 6 — builds more trust than a paragraph of praise.',
        ],
      },
      {
        type: 'p',
        text: 'Illustrative example: a Madurai health trust we know of started sending a one-page utilisation note with two photos within a month of every donation above Rs 1,000, and its festival appeal the next year recognised so many returning names that volunteers stopped calling them first-time donors. Proof, delivered promptly, compounds.',
      },
      { type: 'h2', text: 'Habits four to seven: rhythm, recognition, and winback' },
      {
        type: 'numbered',
        items: [
          'Keep a gentle rhythm. A short quarterly update and festival greetings keep you familiar, so the next appeal never feels like a stranger knock. Share news without an ask most of the time.',
          'Recognise, with permission. A donor wall, a name in the annual report, or a public transparency page entry honours repeat givers — always with consent, never with amounts unless agreed.',
          'Ask for feedback, not just funds. A yearly two-question message — what should we do more of, what should we stop — makes donors feel like members rather than wallets.',
          'Win back the lapsed personally. After twelve quiet months, one warm message with a single concrete story and an easy giving link works better than repeated bulk reminders.',
        ],
      },
      {
        type: 'table',
        title: 'The seven habits with rhythm and owner',
        headers: ['Habit', 'Rhythm', 'Who owns it'],
        rows: [
          ['Thank-you message', 'Within 48 hours', 'Volunteer on duty'],
          ['80G-ready receipt', 'Within a week', 'Treasurer'],
          ['Utilisation note', 'Within a month', 'Project lead'],
          ['Quarterly update', 'Every 3 months', 'Secretary or communications volunteer'],
          ['Festival greeting', 'Major festivals', 'Volunteer team'],
          ['Recognition entry', 'Yearly, with consent', 'Secretary'],
          ['Lapsed-donor winback', 'After 12 quiet months', 'Founder or trustee'],
        ],
      },
      { type: 'h2', text: 'What repeat donors quietly watch for' },
      {
        type: 'p',
        text: 'Experienced donors notice whether your receipts quote a valid 80G approval, whether your numbers stay consistent across appeals and reports, and whether you admit setbacks honestly. A flood that delayed your project, told plainly with revised timelines, retains more donors than silence followed by inflated claims. Consistency across your receipts, your updates, and your public transparency page is what converts a one-time giver into a five-year supporter.',
      },
      {
        type: 'figure',
        figure: {
          type: 'stats',
          title: 'Where retention is won or lost',
          stats: [
            { value: '48 hours', label: 'Window for the first thank-you message' },
            { value: '1 week', label: 'Target for sending donation receipts' },
            { value: '4 touches', label: 'Non-ask updates worth sending per year' },
            { value: '12 months', label: 'Silence after which a donor counts as lapsed' },
          ],
        },
        caption: 'Timelines are approximate guides, not legal rules — but rhythm matters.',
      },
    ],
    faqs: [
      {
        q: 'How do NGOs retain donors for repeat donations?',
        a: 'Thank within 48 hours, send receipts within a week, report utilisation with specific photos and numbers, share quarterly updates without always asking, and recognise donors with consent. Donors repeat when they feel noticed, informed, and confident their money was used as promised. Rhythm matters more than grand gestures.',
      },
      {
        q: 'How fast should an NGO send donation receipts?',
        a: 'Within a week as routine practice, and faster during campaigns. Quick receipts confirm the money arrived safely and give 80G donors what they need for filing. Pair each receipt with a warm thank-you line and confirm that the donation will reflect in your yearly Form 10BE filing on incometax.gov.in.',
      },
      {
        q: 'What should a donor utilisation report contain?',
        a: 'Specifics: what was bought or done, how many people benefited, two or three honest photos, and the exact line connecting the gift to the outcome. Include one setback honestly if relevant. Keep it to one page — busy donors read short proof, while long brochures with adjectives and no numbers get skimmed and forgotten.',
      },
      {
        q: 'How do you win back donors who stopped giving?',
        a: 'After about twelve quiet months, send one personal message referencing their last gift and sharing a single concrete recent outcome, with an easy giving link. Avoid guilt, bulk forwards, and repeated reminders. If they stay silent, thank them for past support and try again next festival season with fresh news.',
      },
      {
        q: 'Should NGOs publicly list donor names?',
        a: 'Only with clear consent, and never publish amounts unless the donor explicitly agrees. A donor wall, annual report mention, or transparency page entry honours supporters and signals credibility to new givers. Always offer anonymity as the default option, since many Indian donors strongly prefer quiet giving.',
      },
    ],
    productTieIn:
      'Sangathan public transparency page gives repeat donors one steady place to see your work, while donation records keep receipts and thank-you follow-ups from slipping through the cracks.',
  },
  {
    slug: 'in-kind-donation-recording',
    title: 'How to Record In-Kind Donations: Goods, Time & Free Services',
    description:
      'Record in-kind donations correctly: fair-value principles for goods, caution on volunteer time, register columns, and receipt wording that avoids wrong 80G claims.',
    keywords: [
      'in-kind donation accounting',
      'record donated goods ngo',
      'in kind donation receipt',
      'volunteer time valuation india',
      'donated goods register ngo',
    ],
    category: 'fundraising',
    datePublished: '2026-09-24',
    keyTakeaways: [
      'Record donated goods at a reasonable fair value with bills or market comparison as support.',
      'Do not assign 80G tax-benefit value to in-kind receipts; word them as acknowledgements of goods received.',
      'Track volunteer time in hours for reports, but keep it out of audited donation income unless your CA advises.',
      'Maintain an in-kind register with donor, description, quantity, value basis, and use or distribution.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'Bags of rice for the hostel kitchen, a dentist free Sunday camp, a volunteer designer building your brochure — in-kind gifts keep many NGOs running. Yet most organisations record them carelessly or not at all, which creates two risks: auditors question your stock and expense story, and donors receive wrongly worded 80G receipts for goods. Here is how to record goods, time, and free services cleanly.',
      },
      { type: 'h2', text: 'Valuation principles for donated goods' },
      {
        type: 'p',
        text: 'Record goods at a fair, supportable value: the printed MRP for new packed items, the supplier bill where available, or a documented local market price for grain, clothes, and similar goods. Note the basis of valuation in your register — bill attached, market enquiry on date — so an auditor can follow your reasoning. For used items like computers or furniture, record a conservative current value rather than the original purchase price. Illustrative example: a Nashik shelter we know of logs donated ration bags at the wholesale bill rate the donor shares, and writes market enquiry with the shop name and date when no bill exists.',
      },
      {
        type: 'table',
        title: 'In-kind register columns that auditors like',
        headers: ['Column', 'What to write', 'Why'],
        rows: [
          ['Serial no. and date', 'Running number, receipt date', 'Gap-free trail'],
          ['Donor name and contact', 'Full name, phone or address', 'Acknowledgement and verification'],
          ['Description and quantity', 'Rice 50 kg, notebooks 200 pcs', 'Stock matching'],
          ['Value and basis', 'Rs 2,750, wholesale bill attached', 'Supportable valuation'],
          ['Use or distribution', 'Hostel kitchen, March week 2', 'Proves charitable use'],
          ['Receiver signature', 'Warden or project lead signs', 'Confirms custody'],
        ],
      },
      { type: 'h2', text: 'Volunteer time and free professional services' },
      {
        type: 'p',
        text: 'Volunteer time deserves gratitude and careful paperwork — but not inflated financial value. Track hours in an attendance register for annual reports and grant applications, where funders genuinely value the mobilisation story. Do not add notional salary values into your audited donation income unless your chartered accountant specifically advises and documents the treatment. For free professional services — medical camps, legal help, design work — record the service description, dates, and a reasonable market-equivalent note for internal MIS only, and thank the professional with a service certificate rather than a donation receipt carrying tax claims.',
      },
      {
        type: 'figure',
        figure: {
          type: 'steps',
          title: 'Recording an in-kind gift, start to finish',
          steps: [
            'Inspect and count the goods with the donor present; note condition.',
            'Fix a fair value with a bill, MRP, or documented market enquiry.',
            'Enter all register columns and get the receiver signature.',
            'Issue an in-kind acknowledgement worded without 80G tax-benefit claims.',
            'Record use or distribution with dates as stocks move out.',
          ],
        },
      },
      { type: 'h2', text: 'Receipt wording that stays out of trouble' },
      {
        type: 'p',
        text: 'Cash and bank donations to an 80G-registered NGO can support a donor deduction claim; donated goods generally do not work that way, and volunteer hours certainly do not. Your in-kind acknowledgement should therefore say received in kind, describe the goods or service precisely, state the recorded value with its basis, and avoid any sentence suggesting 80G deduction eligibility. Where a donor insists on tax language, explain gently and place the question before your CA — tax positions belong to professionals, and current rules should always be checked rather than assumed from old advice.',
      },
      {
        type: 'note',
        title: 'Check with your CA before filing positions',
        text: 'Accounting and tax treatment of in-kind gifts can vary with your registration status and the nature of goods. Treat this guide as record-keeping discipline, and confirm filing and disclosure positions with your chartered accountant for the current assessment year.',
      },
    ],
    faqs: [
      {
        q: 'How do NGOs record donated goods in India?',
        a: 'Enter each gift in an in-kind register with serial number, date, donor details, item description, quantity, fair value with its basis, and later use or distribution with receiver signatures. Support values with supplier bills, MRP, or documented market enquiries. This trail lets auditors connect incoming goods to charitable use without guesswork.',
      },
      {
        q: 'Can donors claim 80G for donating goods instead of money?',
        a: 'Generally, 80G deduction applies to monetary contributions, not donated goods or volunteer time. Issue an in-kind acknowledgement describing what was received, and avoid wording that promises tax benefits. If a donor presses the point, explain the position plainly and ask your chartered accountant to confirm the current rule for your situation.',
      },
      {
        q: 'How should volunteer time be valued in NGO books?',
        a: 'Track volunteer hours carefully for reports and grant applications, but do not convert them into donation income at notional salaries unless your CA documents that treatment. Inflated time valuations distort your financials and invite audit questions. A clean attendance register plus heartfelt service certificates serves volunteers better than questionable numbers.',
      },
      {
        q: 'What should an in-kind donation receipt say?',
        a: 'Donor name, date, precise description with quantity and condition, recorded value with its basis, and a line stating the goods or services were received in kind. Skip any 80G deduction language. Add receiver signature and serial numbering so the acknowledgement ties back to your register entry line by line.',
      },
      {
        q: 'Do free professional services count as donations?',
        a: 'Record them descriptively — doctor name, camp date, patients seen — with a market-equivalent note for internal reporting if useful. Thank professionals with service certificates describing the contribution. Keep such notional values out of audited donation income unless your chartered accountant advises otherwise for the current year.',
      },
    ],
  },
  {
    slug: 'foreign-donations-fcra-rules',
    title: 'Accepting Foreign Donations in India: FCRA Rules You Must Know',
    description:
      'Foreign donation rules for Indian NGOs: FCRA registration vs prior permission, the designated SBI account, what counts as foreign source, and penalties.',
    keywords: [
      'foreign donation rules india',
      'fcra foreign contribution',
      'receive foreign funds ngo',
      'fcra donation rules',
      'fcra registration vs prior permission',
    ],
    category: 'fundraising',
    datePublished: '2026-09-24',
    keyTakeaways: [
      'Foreign contributions need FCRA registration or prior permission under the Foreign Contribution Regulation Act, 2010.',
      'Receive foreign funds only in the designated SBI New Delhi account reported on fcraonline.nic.in.',
      'Foreign source includes foreign persons, companies, and many NRI-related transfers — check each case carefully.',
      'Violations bring penalties, suspension, and cancellation, so consult a professional before accepting anything.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'A well-wisher in London offers to wire funds for your school. A diaspora group wants to sponsor your health camp. Accepting feels like the obvious answer — but foreign donations in India sit under a separate law with its own permissions, accounts, and filings. Receive even a small foreign gift through the wrong channel and your organisation can face penalties. Here are the FCRA rules every trustee must know, with the honest caveat to check current requirements with a professional.',
      },
      { type: 'h2', text: 'Registration vs prior permission: the two doors' },
      {
        type: 'p',
        text: 'The Foreign Contribution Regulation Act, 2010 — FCRA — governs foreign contributions to associations with definite cultural, economic, educational, religious, or social programmes. The standard route is FCRA registration, generally available to organisations with a track record of work and audited statements. The alternative is prior permission: a one-time clearance tied to a specific donor, amount, and project. Illustrative example: a Kochi coastal-relief group we know of used prior permission for its first diaspora-funded project while building the record needed for full registration later. Either way, applications and filings run through the FCRA portal at fcraonline.nic.in under the Ministry of Home Affairs.',
      },
      {
        type: 'figure',
        figure: {
          type: 'timeline',
          title: 'The FCRA journey for a new NGO',
          entries: [
            { label: 'Years 1-3', text: 'Build domestic record: programmes, audits, annual reports, 12A and 80G groundwork.' },
            { label: 'First foreign offer', text: 'Do not accept yet — examine prior permission for the specific project and donor.' },
            { label: 'Application', text: 'Apply on fcraonline.nic.in with project details, donor commitment, and organisational documents.' },
            { label: 'Approval and account', text: 'On clearance, receive funds only in the reported designated account and file as required.' },
            { label: 'Later', text: 'Seek full FCRA registration once track record and compliance history support it.' },
          ],
        },
      },
      { type: 'h2', text: 'The designated account and utilisation discipline' },
      {
        type: 'p',
        text: 'Foreign contributions must first arrive in the designated FCRA account at the specified SBI branch in New Delhi, as directed under current FCRA rules, and transfers for utilisation follow the prescribed account structure reported on the portal. This surprises many treasurers used to operating everything from a local current account. Keep foreign and domestic funds strictly separate — separate books, separate utilisation records, and annual FCRA returns filed on time. Mixing a foreign wire into your general domestic account, even innocently, is exactly the kind of error that draws scrutiny.',
      },
      {
        type: 'table',
        title: 'Domestic vs foreign contributions at a glance',
        headers: ['Point', 'Domestic donations', 'Foreign contributions'],
        rows: [
          ['Governing law', 'Income Tax Act, 1961 for 80G aspects', 'FCRA, 2010 for receipt and use'],
          ['Permission', 'None beyond 12A/80G for tax benefits', 'FCRA registration or prior permission needed'],
          ['Receiving account', 'Any organisation bank account', 'Designated SBI New Delhi account channel'],
          ['Portal', 'incometax.gov.in for 10BE', 'fcraonline.nic.in for FCRA filings'],
          ['Mixing funds', 'Routine single books', 'Strict separation required'],
        ],
      },
      { type: 'h2', text: 'What counts as a foreign source' },
      {
        type: 'p',
        text: 'Foreign source covers more than foreign citizens. It includes foreign companies and organisations, and contributions routed through certain overseas entities. NRI gifts need plain-words care: an NRI citizen giving from Indian income through domestic channels differs from funds remitted from abroad or given by a foreign passport holder — and borderline cases genuinely confuse experienced treasurers. When in doubt, treat the receipt as potentially foreign and ask your professional before touching the money. Returning or re-routing a wrongly received contribution after spending it is far harder than pausing for one consultation.',
      },
      {
        type: 'note',
        title: 'Penalties are real — and this is not legal advice',
        text: 'FCRA violations can lead to penalties, suspension of registration, cancellation, and restrictions on future permissions. Rules and thresholds also change, so verify the current position on fcraonline.nic.in and consult a lawyer or CA experienced in FCRA before accepting, receipting, or spending any foreign contribution.',
      },
      { type: 'h2', text: 'A trustee checklist before saying yes' },
      {
        type: 'list',
        items: [
          'Confirm your FCRA registration or obtain prior permission for the specific project first.',
          'Verify the donor and amount match the permission or registration scope.',
          'Route the receipt through the designated SBI New Delhi account channel only.',
          'Keep foreign books, vouchers, and utilisation records fully separate.',
          'Calendarise annual FCRA returns alongside your Income Tax Act filings.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can my NGO accept foreign donations without FCRA registration?',
        a: 'Only through prior permission for a specific donor, amount, and project, granted via fcraonline.nic.in — or not at all. Routine acceptance of foreign contributions requires FCRA registration under the Foreign Contribution Regulation Act, 2010. Never receive a foreign wire into a domestic account while hoping paperwork will follow later.',
      },
      {
        q: 'What is the difference between FCRA registration and prior permission?',
        a: 'Registration is a standing clearance for organisations with an established track record, allowing ongoing foreign contributions within the law. Prior permission is a one-time clearance tied to one donor, amount, and project. New organisations often start with prior permission while building the history that supports full registration.',
      },
      {
        q: 'Which bank account should receive foreign contributions?',
        a: 'Foreign contributions must come through the designated FCRA account at the specified SBI branch in New Delhi, with utilisation following the prescribed reported account structure. Check the current directions on fcraonline.nic.in and with your professional, since account mechanics have been updated over the years and must be followed exactly.',
      },
      {
        q: 'Do NRI donations count as foreign contributions?',
        a: 'It depends on the facts: citizenship, source of funds, and channel of transfer all matter, and plain-words summaries cannot settle borderline cases. Treat any NRI-linked or overseas-routed gift as potentially foreign, pause before accepting, and get a professional opinion on your specific facts rather than relying on general articles.',
      },
      {
        q: 'What happens if an NGO violates FCRA rules?',
        a: 'Consequences can include penalties, suspension or cancellation of registration, and bars on receiving foreign contributions, alongside reputational damage with all funders. Because rules evolve, verify current requirements on fcraonline.nic.in and consult an FCRA-experienced lawyer or CA before accepting or spending any foreign funds.',
      },
    ],
  },
]
