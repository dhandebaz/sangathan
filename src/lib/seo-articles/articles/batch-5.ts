import type { SeoArticle } from '../types'

export const batch5Articles: SeoArticle[] = [
  {
    slug: 'how-to-file-rti-online',
    title: 'How to File RTI Online via rtionline.gov.in (2026 Guide)',
    description:
      'Learn how to file RTI online at rtionline.gov.in: register an account, pick the right department, draft record-seeking questions, pay the ₹10 fee and track replies.',
    keywords: [
      'how to file rti online',
      'rtionline.gov.in registration',
      'online rti application',
      'rti kaise file kare',
      'rti online fee payment',
    ],
    category: 'rti-civic',
    datePublished: '2026-09-24',
    keyTakeaways: [
      'rtionline.gov.in handles Central government authorities; most states run their own separate RTI portals.',
      'Register once with your name, email and mobile, then file under the exact public authority that holds the record.',
      'The application fee is ₹10, paid online by UPI, card or net banking, and you get a registration number for tracking.',
      'The public information officer must reply within 30 days of receiving your application.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'Filing an RTI application online takes about twenty minutes once you know the routine: create an account on rtionline.gov.in, choose the public authority that actually holds the record, write short questions that ask for records rather than opinions, pay the ₹10 fee online, and save the registration number that lets you track the reply. This guide walks through each step so your first application lands in the right inbox instead of bouncing between departments.',
      },
      { type: 'h2', text: 'Create your rtionline.gov.in account first' },
      {
        type: 'p',
        text: 'Open rtionline.gov.in and use the citizen registration option before you try to file anything. You will need your full name, a working email address and a mobile number that can receive an OTP. Fill in your address carefully, because the reply — especially any documents sent by post — comes to the address on your account. One registration works for all future applications, so getting the details right the first time saves repeated corrections later.',
      },
      {
        type: 'figure',
        figure: {
          type: 'steps',
          title: 'The online RTI filing routine',
          steps: [
            'Register on rtionline.gov.in with your name, email, mobile OTP and postal address.',
            'Log in and open the RTI application form for a Central public authority.',
            'Select the ministry or department that holds the record you want.',
            'Draft short numbered questions that ask for specific records or data.',
            'Pay the ₹10 fee online and note the registration number generated.',
            'Track the application status on the portal and count 30 days for the reply.',
          ],
        },
      },
      { type: 'h2', text: 'Pick the public authority that holds the record' },
      {
        type: 'p',
        text: 'The most common reason RTI applications fail is filing them with the wrong department. The RTI Act 2005 says every public authority must appoint officers to receive requests, but it does not force one department to fetch records from another. Before filing, ask yourself which office created or keeps the file you want: a municipal sanction plan sits with the municipality, a ration-shop register with the food department, a school grant file with the education department. Filing with the record-holder is what gets answers.',
      },
      {
        type: 'table',
        title: 'Where to file: Central portal vs state portals',
        headers: ['Situation', 'Where to file', 'What to remember'],
        rows: [
          ['Record held by a Central ministry or department', 'rtionline.gov.in', 'Covers Central authorities such as railways, EPFO, passport offices'],
          ['Record held by a state department', 'That state’s own RTI portal', 'Each state has different fees, formats and payment modes'],
          ['Record held by a municipal body or panchayat', 'State portal or offline application', 'Local bodies rarely appear on the Central portal'],
          ['Unsure which office holds the record', 'Ask the likely office first by phone or visit', 'A wrong filing costs time even when transferred'],
        ],
      },
      { type: 'h2', text: 'Draft short questions that ask for records' },
      {
        type: 'p',
        text: 'Online forms give you a limited text box, which is actually a blessing: it forces short questions. Number each question separately, keep each one to a single point, and ask for records, numbers or copies rather than explanations. “Provide the sanctioned and vacant posts in the primary health centre at block Rampur as on 31 March 2026” works far better than “why is our health centre understaffed”. For illustration: a neighbourhood group in Indore asking about a broken handpump got a one-line dismissal when they asked why repairs were delayed, then received the actual repair register within weeks after re-filing with numbered record requests. This is an illustrative example, not a reported case.',
      },
      {
        type: 'list',
        items: [
          'One question, one number — never bundle three demands into a single paragraph.',
          'Ask for records: registers, muster rolls, sanction orders, inspection reports, file notings.',
          'Add dates, places and reference numbers wherever you know them.',
          'Keep the whole application under five questions so the officer can answer precisely.',
          'Attach no long essays; the facts you need will come out of the records themselves.',
        ],
      },
      { type: 'h2', text: 'Pay the ₹10 fee and guard your registration number' },
      {
        type: 'p',
        text: 'The standard RTI application fee for Central authorities is ₹10, payable on the portal through UPI, debit or credit card, or net banking. Applicants below the poverty line pay no fee but must attach valid BPL proof. Once payment succeeds, the portal generates a registration number — screenshot it, save the SMS, and note it in a diary. That number is your key for tracking status, filing a first appeal if the 30-day period passes without reply, and proving you ever filed at all.',
      },
      {
        type: 'numbered',
        items: [
          'Complete payment in the same session so the application is actually submitted.',
          'Save the registration number, payment receipt and a copy of your question text.',
          'Check status on rtionline.gov.in after a week to confirm it reached the officer.',
          'Count 30 days from the date of receipt and prepare a first appeal if nothing arrives.',
        ],
      },
      {
        type: 'note',
        title: 'Central scope warning',
        text: 'rtionline.gov.in covers Central government public authorities only. State departments, municipal corporations and panchayats come under state RTI rules with their own portals, fees and formats. Filing a state matter on the Central portal is the single most common beginner mistake.',
      },
      { type: 'h2', text: 'After filing: the 30-day clock starts' },
      {
        type: 'p',
        text: 'Under the RTI Act 2005, the public information officer must respond within 30 days of receiving your request. The reply may give you the information, ask for copying charges for bulky records, or refuse with written reasons citing a specific exemption section. If 30 days pass with no reply, you can file a first appeal to the designated appellate authority. Mark the due date on a calendar the day you file — collectives that track this date win far more often than those that file and forget.',
      },
    ],
    faqs: [
      {
        q: 'How do I register on rtionline.gov.in for filing RTI online?',
        a: 'Open rtionline.gov.in, choose citizen registration, and enter your name, email, mobile number and postal address. Verify the mobile with the OTP sent to you. Once registered, you can log in any time to file fresh applications, pay fees and track replies under one account.',
      },
      {
        q: 'Can I file RTI against a state government department on rtionline.gov.in?',
        a: 'No. The Central portal serves Central ministries, departments and undertakings only. State departments, municipal bodies and panchayats fall under state RTI rules with separate portals and fee modes. Check your state information commission website for the correct filing channel before paying any fee.',
      },
      {
        q: 'What is the fee for filing RTI online in India?',
        a: 'For Central public authorities the application fee is ₹10, payable online by UPI, card or net banking. Extra charges apply for supplied copies, typically ₹2 per page, plus inspection rules for bulky files. Applicants below the poverty line are exempt on producing valid BPL proof.',
      },
      {
        q: 'How do I track my online RTI application status?',
        a: 'Log in to rtionline.gov.in and open the view-status option, then enter the registration number issued at payment. The status shows whether your application has reached the officer and whether a reply has been uploaded. Save the registration number safely, since tracking and any later appeal both need it.',
      },
      {
        q: 'What happens after I submit my online RTI application?',
        a: 'The application reaches the concerned public information officer, who must reply within 30 days of receipt. You may receive the information, a demand for copying charges, or a refusal citing a specific exemption. If nothing arrives within 30 days, you become eligible to file a first appeal.',
      },
    ],
    productTieIn:
      'If your collective files RTIs regularly, keeping every registration number, due date and reply in one complaint diary with a 30-day RTI reminder stops deadlines from slipping — that is what Sangathan’s complaint diary module is built for.',
  },
  {
    slug: 'rti-application-format-drafting',
    title: 'RTI Application Format: Drafting Questions That Get Answers',
    description:
      'Master the RTI application format: one-question-one-number drafting, record-focused wording, good vs bad question examples, and what never to ask under RTI.',
    keywords: [
      'rti application format',
      'how to draft rti',
      'rti question format',
      'rti application points',
      'rti sample questions india',
    ],
    category: 'rti-civic',
    datePublished: '2026-09-24',
    keyTakeaways: [
      'Give every question its own number and keep each one to a single point.',
      'Ask for records, data and certified copies — never for reasons, opinions or explanations.',
      'Add dates, places, file numbers and periods so the officer can locate the file.',
      'Questions starting with “why” invite rejection; questions starting with “provide” invite replies.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'Most rejected RTI applications fail on drafting, not on law. Officers answer quickly when each numbered question asks for a specific record with dates and places attached; they stall or reject when the application bundles five grievances into one paragraph or demands opinions. This guide gives you a drafting format that works: one question per number, record-seeking language, and examples of good and bad questions you can copy the pattern from.',
      },
      { type: 'h2', text: 'The one-question-one-number rule' },
      {
        type: 'p',
        text: 'Number your questions 1, 2, 3 and keep each number to exactly one point. This is not decoration — under the RTI Act 2005, the officer must respond to each request, and separate numbers make evasion visible. A bundled question like “give details of funds sanctioned, spent and remaining for all ward works with reasons for delay” lets the officer answer one fragment and ignore the rest. Split it into three numbered questions on sanction orders, expenditure statements and completion certificates, and each one demands its own answer.',
      },
      {
        type: 'table',
        title: 'Good vs bad RTI questions on the same issue',
        headers: ['Bad question (invites rejection)', 'Good question (gets records)', 'Why it works'],
        rows: [
          ['Why is our streetlight not repaired?', 'Provide the complaint register entries for streetlight complaints in Ward 12 from January to March 2026.', 'Asks for a locatable record with a period'],
          ['Who is responsible for the delay?', 'Provide copies of the work order and completion certificate for the streetlight repair contract of 2025-26.', 'Seeks documents, not blame'],
          ['What action will you take on drainage?', 'Provide the sanctioned amount, expenditure and current status of the Ward 12 drain project as per records.', 'Asks for figures on file'],
          ['Explain your policy on water supply.', 'Provide a certified copy of the current water supply schedule order for our zone.', 'Names one obtainable document'],
          ['Give all information about the school.', 'Provide the sanctioned vs filled teacher posts in Government Primary School Rampur as on 31 March 2026.', 'Narrows to a date and a table'],
        ],
      },
      { type: 'h2', text: 'Write in record-focused language' },
      {
        type: 'p',
        text: 'The RTI Act gives you access to information held in records — registers, returns, orders, reports, file notings, emails on file. It does not force officers to create fresh analysis, justify decisions or predict the future. So translate every frustration into a document request. “The drain was never cleaned” becomes “provide the drain-cleaning log and muster rolls for April to June 2026”. “Funds were misused” becomes “provide the utilisation certificate and measurement book entries for the project”. You are not softening your demand; you are aiming it at something the officer can actually supply.',
      },
      {
        type: 'figure',
        figure: {
          type: 'dos-donts',
          title: 'Drafting dos and don’ts',
          dos: [
            'Start questions with provide, supply or give certified copies of.',
            'Name the record: register, order, muster roll, inspection report.',
            'Fix the period: month, financial year or exact dates.',
            'Mention the place, office, scheme or work by name.',
            'Ask for inspection of bulky files when copies would cost too much.',
          ],
          donts: [
            'Ask why, who is guilty, or what the officer personally thinks.',
            'Demand future action or promises inside an RTI application.',
            'Bundle multiple topics into a single unnumbered paragraph.',
            'File more than five questions in one application.',
            'Attach long complaint essays instead of precise record requests.',
          ],
        },
      },
      { type: 'h2', text: 'What never to ask in an RTI application' },
      {
        type: 'p',
        text: 'Certain requests waste your ₹10 every time. Do not ask for opinions, reasons, or interpretations — the officer is not bound to explain, only to share records. Do not ask questions about private bodies with no public authority link, or demand information that would require creating new compilations from scratch. And do not use the RTI to file a grievance: “take action against the contractor” belongs in a complaint letter, while “provide the contractor’s bills and completion certificate” belongs in the RTI. For illustration, one residents’ group filed three failed applications asking why a park was neglected, then succeeded on the fourth try by asking for the maintenance log, the sanctioned budget and the inspection notes. This is an illustrative example, not a reported case.',
      },
      {
        type: 'list',
        items: [
          'Opinions and advice: the Act covers records held, not views formed.',
          'Reasons and justifications: ask for the file noting instead, which shows the reasoning on record.',
          'Hypotheticals: officers need not answer what-if or what-will-you-do questions.',
          'Voluminous fishing: “all files of the last ten years” invites proportionate refusal or heavy copying charges.',
        ],
      },
      {
        type: 'note',
        title: 'The 500-word discipline',
        text: 'Central online RTI forms typically cap the application text at a few thousand characters. Treat that as a feature: if your draft does not fit, you are asking too much in one application. Split it and file two sharp applications instead of one sprawling one.',
      },
      { type: 'h2', text: 'A format skeleton you can reuse' },
      {
        type: 'p',
        text: 'Every application needs the same skeleton: your name and address, the designation of the public information officer, a clear subject line naming the office and period, then numbered questions in record language, then the fee details and your signature with date. On rtionline.gov.in much of this is pre-printed in the form, so your real work is the subject line plus the numbered questions. End with a line requesting the information by post or portal upload within 30 days, and keep a signed copy with the registration number in your file.',
      },
    ],
    faqs: [
      {
        q: 'What is the correct format for an RTI application in India?',
        a: 'Address it to the public information officer of the record-holding office, add your name, address and contact, write a precise subject line, then list numbered questions asking for specific records with dates and places. Mention the fee paid, sign and date it, and keep a copy with the registration or postal receipt.',
      },
      {
        q: 'How many questions can I ask in one RTI application?',
        a: 'The law sets no fixed number, but experienced filers keep it under five sharp questions per application. Fewer, precise questions get faster and fuller answers, while long bundled applications attract partial replies or heavy copying charges. Split big topics into two focused applications.',
      },
      {
        q: 'Can I ask why a decision was taken in an RTI?',
        a: 'Not directly. The RTI Act 2005 gives access to records, not explanations or opinions. Instead of asking why a road was not repaired, ask for the file notings, inspection reports and expenditure statements on that road. The records usually reveal the reasoning better than any explanation would.',
      },
      {
        q: 'Should I write my RTI in English or Hindi?',
        a: 'Either works. Write in the language the concerned office actually uses day to day — Hindi for most block and district offices in the Hindi belt, English where the office corresponds in English. Plain words beat formal language; precision about records, dates and places matters far more than style.',
      },
      {
        q: 'Can I ask for certified copies in my RTI application?',
        a: 'Yes. Explicitly ask for certified copies of the registers, orders or reports you need, and the office must supply them on payment of copying charges, usually ₹2 per page for Central authorities. Certified copies carry evidentiary value in appeals, complaints and public hearings.',
      },
    ],
  },
  {
    slug: 'rti-first-appeal-30-days',
    title: 'No RTI Reply in 30 Days? How the First Appeal Works',
    description:
      'Got no RTI reply in 30 days? Learn the RTI first appeal process: how to count the deadline, draft the appeal, find the appellate authority and what follows.',
    keywords: [
      'rti first appeal',
      'no reply rti 30 days',
      'rti appeal process',
      'first appeal format rti',
      'rti appellate authority',
    ],
    category: 'rti-civic',
    datePublished: '2026-09-24',
    keyTakeaways: [
      'The officer must reply within 30 days of receiving your RTI application.',
      'No reply, partial reply or unconvincing refusal all qualify you to file a first appeal.',
      'Address the first appeal to the designated appellate authority of the same public authority.',
      'Keep copies of everything — the appeal is decided on paper, not on arguments.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'Thirty days pass, and the envelope never arrives. No reply, no documents, no explanation. This is the most common RTI experience in India — and the law anticipates it. The RTI Act 2005 gives you a first appeal to a senior officer of the same public authority, and filing it is simpler than the original application. Here is how the 30-day clock works, how to draft the appeal, and what happens next.',
      },
      { type: 'h2', text: 'Count your 30 days correctly' },
      {
        type: 'p',
        text: 'The 30-day period runs from the date the public information officer receives your application, not the date you post it. Online filings on rtionline.gov.in generate a receipt date you can treat as day zero; postal filings need a few extra days for delivery, which is why sent-by-registered-post proof matters. Mark day 30 on a calendar the moment you file. If the reply arrives on day 34, that is still a delay on record — and the delay itself strengthens your appeal.',
      },
      {
        type: 'figure',
        figure: {
          type: 'timeline',
          title: 'The 30-day clock and the first appeal',
          entries: [
            { label: 'Day 0', text: 'Your application reaches the officer; the 30-day reply period begins.' },
            { label: 'Day 7', text: 'Check status online or confirm postal delivery of your application.' },
            { label: 'Day 30', text: 'Deadline for the officer’s reply, documents, or reasoned refusal.' },
            { label: 'Day 31+', text: 'You may file the first appeal with the appellate authority.' },
            { label: 'Appeal stage', text: 'The appellate authority examines the record and directs the officer.' },
            { label: 'Still stuck?', text: 'A second appeal lies to the Information Commission — a longer, separate process.' },
          ],
        },
      },
      { type: 'h2', text: 'Know when a first appeal is justified' },
      {
        type: 'p',
        text: 'Silence is only one ground. File a first appeal when there is no reply within 30 days, when the reply answers half your questions and ignores the rest, when copying charges look inflated, or when refusal cites an exemption section without explaining how it applies to your request. You do not need a lawyer and you do not need to prove bad faith — you only need to show what you asked, what you received, and where the gap lies. For illustration, a youth group seeking muster rolls received two pages out of six requested and won the remaining pages at first appeal by tabulating asked-versus-received in a single table. This is an illustrative example, not a reported case.',
      },
      {
        type: 'table',
        title: 'Appeal grounds and what to attach',
        headers: ['Situation', 'Ground for appeal', 'Key attachment'],
        rows: [
          ['No reply within 30 days', 'Deemed refusal through silence', 'Application copy plus proof of delivery or registration number'],
          ['Partial reply received', 'Incomplete information furnished', 'Asked-vs-received comparison table'],
          ['Refusal citing exemption', 'Exemption misapplied or unexplained', 'Copy of refusal with your counter on record disclosure'],
          ['Excessive copying charges demanded', 'Unreasonable fee demand', 'Fee demand letter with per-page charge sheet'],
        ],
      },
      { type: 'h2', text: 'Draft and file the first appeal' },
      {
        type: 'p',
        text: 'Address the appeal to the first appellate authority of the same public authority — the name and address usually appear at the bottom of the original reply, on the department website, or on the rtionline.gov.in portal for online cases. State your original application date and registration number, describe what happened in dated points, and ask specifically: direct the officer to furnish the information within the statutory period. Attach the application copy, delivery proof, any reply received, and postal order or fee receipt if your state levies an appeal fee.',
      },
      {
        type: 'numbered',
        items: [
          'Find the appellate authority’s name and address from the reply footer, portal or office notice board.',
          'Write dated facts: application date, 30-day expiry date, what reply (if any) arrived.',
          'Tabulate each original question against what you actually received.',
          'State the relief sought: direction to furnish complete information promptly.',
          'Attach application copy, delivery proof, reply copy and fee receipt; keep one full set yourself.',
        ],
      },
      {
        type: 'note',
        title: 'Do not skip to the top',
        text: 'A second appeal to the Information Commission generally comes only after the first appeal stage. Jumping levels or writing directly to commissioners usually gets your letter sent back down. Climb one rung at a time and let each level’s order strengthen the next.',
      },
      { type: 'h2', text: 'What the appellate authority can do' },
      {
        type: 'p',
        text: 'The appellate authority examines your papers and the officer’s version, then typically directs the officer to supply the information within a fixed time, sometimes with a hearing where both sides are heard. It cannot award you compensation in most first-appeal settings, but its written order becomes powerful paper: if the matter ever reaches the Information Commission in second appeal, that order frames the whole case. Whatever the outcome, collect the order copy in writing and file it with your growing case diary.',
      },
    ],
    faqs: [
      {
        q: 'What is the time limit for filing an RTI first appeal?',
        a: 'You can file once the 30-day reply period expires without a satisfactory response. Rules generally expect the appeal within 30 days after that expiry, though authorities may condone short delays with reasons. File promptly while dates, receipts and postal proofs are fresh and easy to assemble.',
      },
      {
        q: 'Who is the appellate authority for my RTI first appeal?',
        a: 'It is a senior officer designated by the same public authority you applied to. The name and address usually appear on the original reply, the department website, or the rtionline.gov.in portal. Address your appeal to that officer by designation, not to the Information Commission.',
      },
      {
        q: 'Is there a fee for filing an RTI first appeal?',
        a: 'Central online appeals typically carry no separate fee, but some states prescribe a small appeal fee with their own payment mode. Check your state RTI rules or the portal instructions before filing. Whatever you pay, keep the receipt stapled to your appeal set.',
      },
      {
        q: 'What if my RTI first appeal also gets no response?',
        a: 'Then the route is a second appeal to the Central or State Information Commission, which is a quasi-judicial process with longer timelines. Your first-appeal papers — application, proof of delivery, replies and orders — become the case file. Commissions take documented, chronological cases far more seriously.',
      },
      {
        q: 'Can I file an RTI first appeal online?',
        a: 'Yes, for Central authorities you can file the first appeal through rtionline.gov.in against your original registration number. State portals differ — some support online appeals and some need a signed paper appeal by post. Use the same channel logic as your original application.',
      },
    ],
    productTieIn:
      'Appeals are won on dates and paper, not memory. Sangathan’s complaint diary with its 30-day RTI reminder keeps your application, registration number and appeal due date in one place so day 31 never catches you unprepared.',
  },
  {
    slug: 'rti-fees-exemptions-bpl',
    title: 'RTI Fees, Payment Modes & BPL Exemptions Explained',
    description:
      'Understand RTI fees online in India: the ₹10 application fee, per-page and inspection charges, working payment modes, plus BPL exemption rules and proof.',
    keywords: [
      'rti fees online',
      'rti application fee',
      'bpl rti free',
      'rti payment methods',
      'rti copying charges per page',
    ],
    category: 'rti-civic',
    datePublished: '2026-09-24',
    keyTakeaways: [
      'The basic RTI application fee for Central authorities is ₹10.',
      'Extra charges apply for pages supplied, bulky files, samples and models.',
      'Below-poverty-line applicants pay no fee on producing valid BPL proof.',
      'Always take receipts for every payment — fee slips decide appeals.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'RTI fees are small but confusing: a ₹10 application fee here, per-page charges there, different payment modes in every state, and a full exemption for below-poverty-line applicants that many officers handle badly. Pay the wrong way and your application can sit unregistered; pay without receipts and you lose proof in appeal. This guide lays out the Central fee structure under the RTI Act 2005, the payment modes that work, and how the BPL exemption actually operates.',
      },
      { type: 'h2', text: 'The ₹10 application fee and what follows' },
      {
        type: 'p',
        text: 'For Central public authorities, the application fee is ₹10. That single payment opens the file — it is not the total cost of everything you might receive. When the officer pulls bulky records, the rules add further charges for copies supplied, inspection of files beyond the free first hour, and samples or models where relevant. States set their own fee schedules under their RTI rules, so a state application may differ in amount and mode. Always check the concerned state’s current fee table before assuming Central rates apply.',
      },
      {
        type: 'table',
        title: 'Central RTI charges at a glance',
        headers: ['Item', 'Charge', 'Practical note'],
        rows: [
          ['Application fee', '₹10', 'Paid with the application; BPL applicants exempt with proof'],
          ['Copies supplied (A4/A3)', '₹2 per page', 'Demand letter should show page count and total'],
          ['Inspection of records', 'Free first hour, then a small hourly charge', 'Inspect bulky files instead of ordering hundreds of copies'],
          ['Samples and models', 'Actual cost as assessed', 'Rare in civic filings; ask for the cost break-up first'],
          ['Information on diskette or CD', '₹50 per unit where offered', 'Many offices now reply by portal upload or email instead'],
        ],
      },
      { type: 'h2', text: 'Payment modes that actually work' },
      {
        type: 'p',
        text: 'On rtionline.gov.in, payment is electronic — UPI, debit or credit card, or net banking — and the portal receipt doubles as your filing proof. Offline applications to Central authorities generally use Indian Postal Orders, demand drafts or banker’s cheques drawn in favour of the correct accounts officer, plus cash against a receipt where the office accepts it. State filings vary widely: some states accept court-fee stamps, some run their own payment gateways, and some still insist on postal orders. The golden rule is boring but vital: pay in the mode the receiving office recognises, and collect a receipt every single time.',
      },
      {
        type: 'figure',
        figure: {
          type: 'checklist',
          title: 'Fee-payment checklist before you file',
          items: [
            'Confirm whether the authority is Central or state — fee tables differ.',
            'Check the exact payee name for postal orders and drafts.',
            'Pay online in one session so the application actually submits.',
            'Save the portal receipt, UPI reference or postal order counterfoil.',
            'Staple the fee proof to your application copy and diary entry.',
          ],
        },
      },
      { type: 'h2', text: 'BPL exemption: free filing with proof' },
      {
        type: 'p',
        text: 'Applicants below the poverty line pay no RTI application fee and no copying charges, provided they attach valid proof of BPL status with the application. A current BPL ration card or an official BPL certificate from the competent authority is what offices expect — an expired card or a self-declaration invites objections. Attach a clear photocopy, mention the exemption claim in the application itself, and carry the original when visiting the office. For illustration, a daily-wage worker’s application was returned for “non-payment” until she re-filed with her BPL card copy prominently attached and referenced in point one; the same office then registered it without fuss. This is an illustrative example, not a reported case.',
      },
      {
        type: 'list',
        items: [
          'Claim the exemption inside the application text, not only as an attachment.',
          'Attach a legible copy of a current BPL card or certificate.',
          'Keep the original ready for verification at hearings or inspections.',
          'If an officer still demands fees, ask for the objection in writing for your appeal file.',
        ],
      },
      {
        type: 'note',
        title: 'Fee traps to avoid',
        text: 'Three traps recur: drafts drawn in the wrong payee name, state applications paid through Central modes, and inflated copying demands with no page count. Insist on a written demand showing pages multiplied by the notified rate — vague lump sums are challengeable in first appeal.',
      },
      { type: 'h2', text: 'When fees become an appeal ground' },
      {
        type: 'p',
        text: 'A fee demand is itself answerable in appeal. If copying charges look inflated, if the math of pages times rate does not add up, or if your BPL exemption was ignored, the first appeal can challenge the demand alongside the information request. File the demand letter with your appeal papers and ask the appellate authority to review the charges. Officers who know their arithmetic will be checked tend to calculate carefully the first time — which is precisely why keeping every receipt matters.',
      },
    ],
    faqs: [
      {
        q: 'What is the RTI application fee in India?',
        a: 'For Central public authorities the application fee is ₹10 under the RTI fee rules. States prescribe their own fees under state rules, usually in a similar range but with different payment modes. Always confirm the current schedule of the authority you are applying to before paying.',
      },
      {
        q: 'Is RTI free for BPL card holders?',
        a: 'Yes. Applicants below the poverty line pay no application fee or copying charges on furnishing valid BPL proof, such as a current BPL ration card or an official certificate. Attach a clear copy with the application and mention the exemption claim in the application text itself.',
      },
      {
        q: 'How can I pay RTI fees online?',
        a: 'On the Central portal rtionline.gov.in you pay electronically through UPI, debit or credit card, or net banking during filing. State portals have their own gateways with varying options. Complete payment in the same session and save the electronic receipt with your registration number.',
      },
      {
        q: 'What are RTI copying charges per page?',
        a: 'For Central authorities, copies in A4 or A3 size cost ₹2 per page, with separate provisions for larger sizes, samples and electronic media. The officer should raise a written demand showing the page count and total. Inspection of records is free for the first hour.',
      },
      {
        q: 'Can I get a refund if my RTI application is rejected?',
        a: 'Generally no. The application fee covers processing, not an assured supply of records, so lawful refusals citing specific exemptions do not earn refunds. But inflated or wrongly demanded copying charges can be challenged in first appeal, where the authority can revise or set aside the demand.',
      },
    ],
  },
  {
    slug: 'municipal-complaint-letter-format',
    title: 'Municipal Complaint Letter Format That Gets a Receiving Stamp',
    description:
      'Use this municipal complaint letter format: subject line, ward details, dated facts, photo annexures and numbered demands that earn a receiving stamp.',
    keywords: [
      'municipal complaint letter format',
      'complaint letter to municipal corporation',
      'nagar nigam complaint letter',
      'civic complaint format',
      'ward complaint letter india',
    ],
    category: 'rti-civic',
    datePublished: '2026-09-24',
    keyTakeaways: [
      'A stamp-worthy letter has a precise subject, ward and address, dated facts and numbered demands.',
      'Write calm, verifiable sentences — anger gets read slowly and filed nowhere.',
      'Carry two copies so the office stamps your copy as received with date and signature.',
      'Annex photos and earlier receipts; paper trails beat fresh complaints every time.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'A municipal complaint letter has one job: to come back to you with a round receiving stamp, a date and a signature. That stamped copy turns a spoken grievance into a paper fact the office cannot later deny receiving. The format below — precise subject, ward identification, dated facts, photo annexures and numbered demands — is what counter clerks accept without argument and what senior officers actually act on.',
      },
      { type: 'h2', text: 'Anatomy of a stamp-worthy complaint letter' },
      {
        type: 'p',
        text: 'Start with your name, full address with ward number, and mobile number at the top, then address the letter to the correct officer by designation — executive officer, sanitary inspector or ward officer as the case may be. The subject line should name the problem, the place and the duration in one breath: “Non-clearance of garbage from Lane 4, Ward 12 since 2 September 2026”. Open with one paragraph of dated facts, attach what proves them, and close with numbered demands plus a reasonable deadline. For illustration, a residents’ group whose first letter read “the whole area is dirty, do something” got no stamp and no action; their rewritten letter with dates, photos and three numbered demands was stamped in two minutes. This is an illustrative example, not a reported case.',
      },
      {
        type: 'table',
        title: 'Anatomy of the letter, part by part',
        headers: ['Part', 'What to write', 'Why it matters'],
        rows: [
          ['Sender block', 'Name, address with ward number, mobile', 'Lets the office reply and proves local standing'],
          ['Addressee', 'Correct officer by designation and office', 'Wrong addressees invite redirection and delay'],
          ['Subject line', 'Problem + exact place + since-when date', 'Decides which desk and register your letter enters'],
          ['Facts paragraph', 'Dated events in short verifiable sentences', 'Dates convert complaints into actionable records'],
          ['Annexures', 'Photos, earlier receipts, location sketch', 'Evidence the officer can verify without a visit'],
          ['Numbered demands', 'Two to four specific actions with a deadline', 'Numbered points force point-wise replies'],
        ],
      },
      { type: 'h2', text: 'Tone that works at the counter' },
      {
        type: 'p',
        text: 'Write like a record-keeper, not a protester. Short sentences, exact dates, no abuse, no threats, no sweeping corruption charges you cannot prove on paper. “Garbage has not been lifted from Lane 4 since 2 September 2026; residents reported it verbally on 5 and 9 September; photos dated 10 September are annexed” is stronger than any angry adjective. Clerks stamp calm letters fast because there is nothing in them to argue about — and a calm letter photocopies beautifully into RTI annexures, press notes and appeal files later.',
      },
      {
        type: 'figure',
        figure: {
          type: 'checklist',
          title: 'Before you leave for the municipal office',
          items: [
            'Two printed copies of the letter, both signed in ink.',
            'Photos printed with dates, or phone originals ready to show.',
            'Copies of any earlier complaints with their receiving stamps.',
            'A pen, so diary number, date and receiving signature can be noted on the spot.',
            'A polite one-line request: “please stamp my copy as received.”',
          ],
        },
      },
      { type: 'h2', text: 'Copies, annexures and the diary number' },
      {
        type: 'p',
        text: 'Always carry two identical copies: one stays with the office, one comes home with the receiving stamp, date, signature and — if the office maintains one — the inward or diary number. Note that number in your own register the same evening with the date, office name and the clerk’s name if visible. Annexures should be numbered and listed at the letter’s foot: Annexure 1 — four dated photos, Annexure 2 — copy of the earlier complaint with stamp. A letter whose attachments are listed cannot be quietly separated from its evidence.',
      },
      {
        type: 'list',
        items: [
          'Keep the stamped copy unfolded in a file — it is now legal paper, not scrap.',
          'Photograph the stamped copy the same day as backup against loss and fading.',
          'Send copies for information to the ward councillor where the practice helps, marked clearly as CC.',
          'Fix a follow-up date about two weeks out and write it on the file cover.',
        ],
      },
      {
        type: 'note',
        title: 'If the counter refuses your letter',
        text: 'Refusals happen. Ask politely for the refusal in writing, note the date and the official’s name, and send the same letter by registered post with acknowledgement due. The postal acknowledgement becomes your receiving proof, and the refusal itself becomes appeal material.',
      },
      { type: 'h2', text: 'From stamped letter to resolved problem' },
      {
        type: 'p',
        text: 'The stamped letter is the beginning, not the end. Visit once on your follow-up date with the stamped copy in hand, escalate to the next officer with a reference to the diary number if nothing moved, and after 30 days consider an RTI asking for the action-taken report on your dated complaint. Offices respond to complainants who return with paper far more readily than to those who shout once and vanish. File the letter, track the number, return on schedule — that rhythm resolves more drains, lights and garbage points than any single dramatic visit.',
      },
    ],
    faqs: [
      {
        q: 'How do I write a complaint letter to the municipal corporation?',
        a: 'Put your name, ward address and mobile on top, address the correct officer by designation, and write a subject naming the problem, place and since-when date. State dated facts briefly, list annexures, close with two to four numbered demands and a deadline, sign both copies and get one stamped as received.',
      },
      {
        q: 'What should be in the subject line of a civic complaint?',
        a: 'The problem, the exact location and the duration — for example, non-clearance of garbage from Lane 4, Ward 12 since early September. A precise subject routes your letter to the right desk and register, while a vague one like civic problem invites misfiling and delay.',
      },
      {
        q: 'How many copies of a municipal complaint should I carry?',
        a: 'Two identical signed copies. The office keeps one and stamps the other as received with date and signature for you to take home. Photograph the stamped copy the same day, note any diary or inward number, and preserve it as the proof on which RTIs and appeals later rest.',
      },
      {
        q: 'What if the municipal office refuses to accept my complaint?',
        a: 'Note the date, the official’s name and the reason given, then send the identical letter by registered post with acknowledgement due. The postal acknowledgement serves as receiving proof. Persistent verbal-only refusals can themselves be documented and escalated to the next officer in writing.',
      },
      {
        q: 'Should I attach photos to a municipal complaint letter?',
        a: 'Yes. Dated photos of the garbage pile, broken light, open drain or damaged road convert allegations into verifiable facts. Print them with dates where possible, list them as numbered annexures at the foot of the letter, and keep phone originals ready to show during follow-up visits.',
      },
    ],
  },
  {
    slug: 'how-to-get-receiving-stamp',
    title: 'How to Get a Receiving Stamp on Your Complaint (And Why It Matters)',
    description:
      'Receiving stamp complaint guide: the counter routine, diary numbers, what to do if refused, and how the stamp powers your RTI and appeals later.',
    keywords: [
      'receiving stamp complaint',
      'acknowledgment stamp government office',
      'proof of complaint submission',
      'inward number complaint',
      'complaint diary number india',
    ],
    category: 'rti-civic',
    datePublished: '2026-09-24',
    keyTakeaways: [
      'Carry two signed copies and ask politely for a dated receiving stamp with signature.',
      'Record the diary or inward number, date, office and clerk details the same day.',
      'If refused, send the letter by registered post with acknowledgement due.',
      'The stamped copy becomes the foundation of RTI filings, appeals and escalations.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'In every Indian government office, an unstamped complaint officially never happened. The receiving stamp — a round seal with the office name, date, signature and ideally a diary number — is the difference between “we never got it” and a paper trail nobody can erase. Getting it is a small counter routine anyone can learn, and this guide covers the routine, the diary entry that backs it up, and what to do when a clerk refuses.',
      },
      { type: 'h2', text: 'The counter routine, step by step' },
      {
        type: 'p',
        text: 'Reach the office with two identical signed copies of your letter and your annexures attached to both. Hand over both copies together and make one polite request: “please stamp my copy as received.” Watch while the clerk stamps, dates and signs your copy, and ask for the inward or diary number to be written on it. Thank them, step aside, and check the stamp before leaving the building — faded seals and missing dates are easiest to fix while you are still at the counter. The whole exchange takes minutes when your papers are ready and your tone stays even.',
      },
      {
        type: 'figure',
        figure: {
          type: 'steps',
          title: 'Counter routine for a stamped receipt',
          steps: [
            'Carry two signed copies with identical annexures attached.',
            'Submit at the receipt counter or designated inward clerk.',
            'Request politely: stamp, date and signature on your copy.',
            'Ask for the diary or inward number to be written on it.',
            'Verify stamp clarity, date correctness and signature before leaving.',
            'Log all details in your register the same evening.',
          ],
        },
      },
      { type: 'h2', text: 'What to do if the stamp is refused' },
      {
        type: 'p',
        text: 'Refusals usually sound like “officer is on tour”, “come next week” or a silent push of your papers back across the counter. Stay calm and escalate in writing, not in volume. Ask for the refusal reason on paper; if that fails, note the date, time, office and the official’s name on your copy. Then send the identical letter by registered post with acknowledgement due to the same officer — the signed postal acknowledgement becomes receiving proof equivalent to the stamp. For illustration, a slum residents’ committee refused three times at a ward counter finally mailed everything by registered post; the green acknowledgement cards later anchored their RTI on action taken. This is an illustrative example, not a reported case.',
      },
      {
        type: 'table',
        title: 'Refusal situations and your response',
        headers: ['What happens', 'Do this', 'Proof you gain'],
        rows: [
          ['Clerk accepts but will not stamp', 'Insist politely; offer to wait for the authorised signatory', 'Stamped copy with date and signature'],
          ['Told to come another day', 'Leave one copy, take a dated acknowledgement or note names', 'Dated note plus witness if accompanied'],
          ['Outright refusal to accept', 'Ask for written reasons; note details on your copy', 'Refusal record for escalation'],
          ['Repeated verbal refusals', 'Send by registered post with acknowledgement due', 'Postal acknowledgement card'],
        ],
      },
      { type: 'h2', text: 'Maintain a diary that courts and commissions respect' },
      {
        type: 'p',
        text: 'A stamped copy proves submission; a maintained diary proves a campaign. Rule columns for serial number, date, office, officer designation, subject, mode of submission, diary or inward number, postal receipt number where applicable, and follow-up date. Enter every complaint, RTI, appeal and visit as it happens — not from memory at month-end. Commissions and senior officers visibly trust complainants whose dates, numbers and receipts line up across pages, because such diaries are hard to fabricate and easy to verify.',
      },
      {
        type: 'list',
        items: [
          'File stamped copies chronologically with newest follow-ups on top.',
          'Photograph each stamped page the same day against fading and loss.',
          'Keep postal receipts stapled to the letter they carried.',
          'Bring the diary to every hearing, visit and press interaction.',
        ],
      },
      {
        type: 'note',
        title: 'Never surrender your only copy',
        text: 'Offices sometimes ask to “keep both copies for the file”. Politely decline — one stamped copy must always come home with you. If pressured, offer to supply a third copy on your next visit instead.',
      },
      { type: 'h2', text: 'How the stamp powers your RTI later' },
      {
        type: 'p',
        text: 'Thirty days after a stamped complaint with no action, you can file an RTI asking for the action-taken report, file notings and inspection records on your dated complaint — citing its diary number. That RTI is dramatically stronger than a generic information request because it points at a specific file the office admits exists. If the RTI reply also stalls, your first appeal attaches the stamped complaint, the postal proofs and the RTI registration in one chronological chain. Stamp, diary, RTI, appeal: each layer rests on the one below, which is why the two minutes at the counter matter so much.',
      },
    ],
    faqs: [
      {
        q: 'What is a receiving stamp on a government complaint?',
        a: 'It is the office seal applied to your copy of a submitted letter, carrying the office name, date of receipt and usually a signature, often with a diary or inward number. It proves the office received your complaint on that date and converts a verbal grievance into documented paper.',
      },
      {
        q: 'How do I get my complaint stamped at a government office?',
        a: 'Carry two identical signed copies, submit both at the receipt counter, and politely ask the clerk to stamp, date and sign your copy with the diary number. Check the stamp for clarity and correct date before leaving, then log every detail in your register the same day.',
      },
      {
        q: 'What should I do if the office refuses to stamp my complaint?',
        a: 'Note the date, time, office and official’s name, ask for written reasons, and then send the identical letter by registered post with acknowledgement due. The signed postal acknowledgement serves as receiving proof. Keep the refusal note too — it becomes escalation and appeal material.',
      },
      {
        q: 'What is a diary number or inward number on a complaint?',
        a: 'It is the serial number the office assigns your letter in its inward register, written on your stamped copy alongside the date. Quote this number in every follow-up visit, escalation letter and RTI about the complaint so the office can trace your file instantly.',
      },
      {
        q: 'Why does a stamped complaint help in RTI and appeals?',
        a: 'Because it proves the office holds a file on your issue from a specific date. Your later RTI can demand the action-taken report on that numbered complaint, and appeals can show a dated chain of submission, silence and follow-up. Documented sequences persuade authorities far better than fresh allegations.',
      },
    ],
    productTieIn:
      'Paper trails die in shoeboxes. Sangathan’s complaint diary module keeps stamped submissions, diary numbers, photos and the 30-day RTI reminder together so every complaint stays traceable from counter to commission.',
  },
  {
    slug: 'parcha-pamphlet-design',
    title: 'Designing a One-Page Parcha: Flyers That Survive Print Shops',
    description:
      'Parcha design for print shops: a one-page headline-plus-demands formula, photostat-proof layout, font size rules and Hindi wording tips that read fast.',
    keywords: [
      'parcha design',
      'pamphlet design hindi',
      'one page flyer ngo',
      'cheap pamphlet printing india',
      'hindi pamphlet matter',
    ],
    category: 'rti-civic',
    datePublished: '2026-09-24',
    keyTakeaways: [
      'One page, one headline, three demands, one contact footer — that is the whole formula.',
      'Design in black and white for photostat machines, not in colour for screens.',
      'Headlines above 28 points and body text above 13 points survive cheap printing.',
      'Write demands in plain Hindi people speak, with dates, places and numbers.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'A parcha has about three seconds to earn a reading: pulled from a stack at a chaupal, glanced at under a shop awning, or photographed on a phone before the paper disappears. The one-page parchas that survive cheap print shops all share one formula — a loud headline, three concrete demands, and a contact footer — set in black and white at sizes a photostat machine cannot destroy. Here is how to design yours.',
      },
      { type: 'h2', text: 'The headline plus three demands formula' },
      {
        type: 'p',
        text: 'Give the top third of the page to a single headline that names the issue, the place and the ask: “Ward 12 ki safai vyavastha theek karo — 3 maange”. Below it, list exactly three numbered demands, each one line with a verifiable fact: the drain length uncleaned, the streetlight count dead, the meeting date demanded. Close the page with a footer strip carrying the collective’s name, one mobile number and the meeting venue with date and time. One page, one headline, three demands, one footer — anything more and the reader folds it into a pocket unread.',
      },
      {
        type: 'table',
        title: 'One-page parcha layout grid',
        headers: ['Zone of page', 'Contents', 'Size guidance'],
        rows: [
          ['Top third', 'Single headline with place and ask', 'Headline at 28 points or larger, bold'],
          ['Middle half', 'Three numbered demands with facts', 'Body at 13-15 points, generous line gap'],
          ['Small box', 'Date, time and venue of meeting or action', 'Boxed and bold so it survives folding'],
          ['Footer strip', 'Collective name plus one mobile number', 'One number only — two numbers halve the calls'],
        ],
      },
      { type: 'h2', text: 'Design for the photostat machine, not the screen' },
      {
        type: 'p',
        text: 'Most parchas are printed as a single master at a computer shop and then multiplied a thousand times on photostat machines that eat grey shading, thin fonts and colour gradients. Design accordingly: pure black text on white, thick borders instead of shaded boxes, no background images behind words, and simple geometric dividers. Print five test copies on the cheapest machine you can find before ordering a thousand — if the test copies read well in daylight at arm’s length, the design is ready. For illustration, a sanitation campaign’s first parcha used grey boxes that printed as black blobs; the redesigned version with plain bold borders cost the same ₹1.20 per copy and was readable down to the last demand. This is an illustrative example, not a reported case.',
      },
      {
        type: 'figure',
        figure: {
          type: 'checklist',
          title: 'Photostat-proof design checklist',
          items: [
            'Black text on white paper — no colour-dependent meaning.',
            'Headline 28 points or larger; body never below 13 points.',
            'Bold borders and boxes instead of grey shading.',
            'One simple font for the whole page, bold used sparingly.',
            'Margins of at least 1.5 cm so nothing is eaten by the machine edge.',
            'Test five cheap copies in daylight before bulk printing.',
          ],
        },
      },
      { type: 'h2', text: 'Hindi wording that people actually read' },
      {
        type: 'p',
        text: 'Write demands the way people speak at the meeting, not the way offices write orders. Short sentences, active verbs, concrete nouns: “4 september se band streetlight theek ho” beats “prakash vyavastha sunischit ki jaye”. Put numbers in digits, dates in full, and place names exactly as locals say them. Read the draft aloud to two people outside your core group — wherever they stumble, rewrite. A parcha is not a press note; its Hindi should sound like a neighbour explaining the problem over the fence.',
      },
      {
        type: 'list',
        items: [
          'One demand per numbered point, each fitting in two lines.',
          'Name the officer or office each demand is addressed to.',
          'Give the meeting date, time and landmark-based venue in a box.',
          'Add a one-line next step: attend, sign, or bring your neighbour.',
        ],
      },
      {
        type: 'note',
        title: 'The one-number rule',
        text: 'Print exactly one mobile number on the parcha — the phone that will actually be answered for the next two weeks. Parchas with three numbers get zero calls because nobody knows whom to ring.',
      },
      { type: 'h2', text: 'Printing, costing and distribution' },
      {
        type: 'p',
        text: 'Get quotes from two or three shops for the same specification — paper size, single or double side, and quantity — since photostat rates swing widely between markets. A thousand single-side A4 black-and-white copies typically cost little enough for a mohalla collection to cover, and splitting costs openly at the meeting builds ownership of the campaign. Distribute through meetings, shops and hand-to-hand passing rather than scattering bundles that end up as litter; a parcha handed over with two spoken sentences gets read, while a dumped stack gets swept. Count what you distributed and where, so the next print run goes to the lanes that responded.',
      },
    ],
    faqs: [
      {
        q: 'What should a one-page parcha contain?',
        a: 'A single bold headline naming the issue and place, three numbered demands with concrete facts, a boxed meeting notice with date, time and venue, and a footer with the collective name and one mobile number. One page, one message, one contact — restraint is what makes people read it.',
      },
      {
        q: 'How much does pamphlet printing cost in India?',
        a: 'Black-and-white A4 photostat parchas are among the cheapest print options, with rates varying by city, quantity and paper quality. Collect written quotes from two or three shops, test quality on cheap machines first, and fund the run through small transparent collections at your meeting.',
      },
      {
        q: 'Which font size is best for pamphlets?',
        a: 'Keep headlines at 28 points or larger and body text at 13 to 15 points minimum. Cheap photostat machines blur small and thin type, so bold simple fonts with generous line spacing survive far better. Always test five copies in daylight before ordering in bulk.',
      },
      {
        q: 'Should my parcha be in Hindi or English?',
        a: 'Use the language your readers speak daily — Hindi or the local language for most mohalla and village campaigns. Write in plain spoken words with short sentences, digits for numbers and local place names. Read the draft aloud to two outsiders and rewrite wherever they stumble.',
      },
      {
        q: 'How do I distribute parchas effectively?',
        a: 'Hand them over personally at meetings, markets and doorsteps with a two-sentence explanation rather than dumping stacks. Track which lanes received how many, note where response is strongest, and direct your second print run there. Personal distribution consistently outperforms scattering.',
      },
    ],
    productTieIn:
      'Drafting the parcha is half the job; keeping the master copy, print specs and distribution count findable is the other half. Sangathan’s printable parcha studio keeps your one-page masters ready to reprint instead of redesigning from scratch each time.',
  },
  {
    slug: 'press-release-format-ngo',
    title: 'Press Release Format for NGOs & Collectives (Fill-in Template)',
    description:
      'Learn the press release format for NGOs: dateline, headline, first-para rule, quote placement, boilerplate, distribution lists and follow-up etiquette.',
    keywords: [
      'press release format ngo',
      'how to write press release india',
      'press note format event',
      'media release template',
      'ngo media coverage tips',
    ],
    category: 'rti-civic',
    datePublished: '2026-09-24',
    keyTakeaways: [
      'A press release answers who, what, where, when and why in its first paragraph.',
      'One page with a real quote beats three pages of background every time.',
      'Build a local reporter list before you need it, reporter by reporter.',
      'Follow up with one polite call, not ten — and never after deadline hour.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'Local reporters receive dozens of press notes a week and read most for exactly ten seconds. The ones that become stories share a format: a headline that names the news, a dateline with place and date, a first paragraph answering everything, one genuine quote, the facts in short paragraphs, and a contact who picks up the phone. Whether your collective is announcing a survey, a protest memorandum or a public hearing, this fill-in template gives your news its best shot.',
      },
      { type: 'h2', text: 'The format, block by block' },
      {
        type: 'p',
        text: 'Start with PRESS RELEASE centred at the top, then your headline in bold — news first, adjectives last: “Ward 12 residents submit 800-signature memorandum on garbage clearance” tells the desk everything. Below comes the dateline — city, date — followed by the first paragraph answering who did what, where, when and why in three sentences. Then two or three short paragraphs of facts with numbers, one quote from a named local person saying something only a human would say, and a final boilerplate paragraph describing your collective in two lines. End with a contact block: name, designation, mobile number, email.',
      },
      {
        type: 'table',
        title: 'Press release skeleton with fill-in prompts',
        headers: ['Block', 'What goes here', 'Length'],
        rows: [
          ['Headline', 'News + place + number (who, what, where)', 'One line, under 15 words'],
          ['Dateline', 'City, date of issue', 'One line'],
          ['First paragraph', 'Who, what, where, when, why', 'Three sentences maximum'],
          ['Fact paragraphs', 'Numbers, dates, annexures, background', 'Two to three short paragraphs'],
          ['Quote', 'One named person, one human sentence', 'Two to three lines'],
          ['Boilerplate', 'Who your collective is, what it does', 'Two lines'],
          ['Contact block', 'Name, role, mobile, email', 'Three to four lines'],
        ],
      },
      { type: 'h2', text: 'Quotes and numbers that get printed' },
      {
        type: 'p',
        text: 'Editors cut background but keep quotes and numbers, so spend your effort there. A quotable quote sounds like a person, not a pamphlet: “Our children cross this drain water to reach school — we have photos of every monsoon since 2023” will survive sub-editing, while “we strongly condemn the apathy” will be deleted. Numbers work the same way: 800 signatures, 47 days without clearance, 3 stamped complaints with diary numbers. For illustration, a collective’s four-page background note got zero coverage, while its rewritten one-pager with two hard numbers and a grandmother’s quote became a 300-word district story. This is an illustrative example, not a reported case.',
      },
      {
        type: 'figure',
        figure: {
          type: 'dos-donts',
          title: 'Press note dos and don’ts',
          dos: [
            'Send the note before noon for same-day editions.',
            'Attach two or three high-resolution photos with captions.',
            'Name a contact who answers unknown numbers all day.',
            'Offer the reporter the memorandum copy and stamped receipts.',
            'Write dates, designations and spellings with zero errors.',
          ],
          donts: [
            'Send PDFs that cannot be copy-pasted — use plain text or Word.',
            'Address twenty reporters in one visible CC line.',
            'Call repeatedly after evening deadline hour.',
            'Demand that the story appear or dictate the headline.',
            'Send the same note five times with small corrections.',
          ],
        },
      },
      { type: 'h2', text: 'Build your distribution list before you need it' },
      {
        type: 'p',
        text: 'A distribution list is built reporter by reporter, not downloaded. After every local event, note which reporter came, which paper or channel they filed for, their mobile number and beat. District correspondents of Hindi dailies, stringers of TV channels and local portal editors matter far more to a civic campaign than national mastheads. Keep the list current with a column for last contact date, and refresh it every few months — reporters change beats often, and a note sent to last year’s education correspondent about this year’s drainage story goes nowhere.',
      },
      {
        type: 'list',
        items: [
          'District correspondents of major Hindi and regional dailies first.',
          'Local TV stringers and digital news portals next.',
          'Community radio and local cable channels where active.',
          'One national contact only when the story genuinely scales up.',
        ],
      },
      {
        type: 'note',
        title: 'Timing beats eloquence',
        text: 'Morning events with notes sent before noon make same-day copy; evening events need the note that night for next-day editions. A perfect note sent two days late loses to an average note sent on time — plan your release hour before you plan your adjectives.',
      },
      { type: 'h2', text: 'Follow-up calls without burning bridges' },
      {
        type: 'p',
        text: 'One polite follow-up call per reporter is professional; five is harassment remembered for years. Call in the early afternoon, confirm the note arrived, offer one new fact or a photo, and ask if anything else is needed. If the story does not appear, thank them anyway and keep the relationship warm for next time — today’s unpublished water story becomes tomorrow’s published health story through the same reporter. And when a story does appear, share it with your members, archive the clipping with date and publication, and send a short thank-you message that keeps your collective on the reporter’s friendly list.',
      },
    ],
    faqs: [
      {
        q: 'What is the correct format of a press release for an NGO?',
        a: 'Headline with the news, city dateline with date, a first paragraph answering who, what, where, when and why, two or three short fact paragraphs, one genuine quote, a two-line boilerplate about your organisation, and a contact block with a responsive mobile number. Keep it to one page.',
      },
      {
        q: 'How long should a press release be?',
        a: 'One page, roughly 300 to 400 words. Reporters read the first paragraph fully and skim the rest, so front-load the news and relegate background to the later paragraphs. Longer notes get trimmed arbitrarily; short notes get printed nearly whole.',
      },
      {
        q: 'When should I send a press release to local newspapers?',
        a: 'Before noon for same-day consideration in most district editions, and the same night for next-day coverage of evening events. Avoid sending during late-evening deadline hours when desks cannot process new material. Plan the release hour as carefully as the wording.',
      },
      {
        q: 'Should I send press releases by WhatsApp or email?',
        a: 'Send the text by email for copy-paste ease with photos attached, then share a short alert on WhatsApp to the reporters who accept it. Never send the note only as an image or PDF that cannot be copied. Confirm current preferences reporter by reporter, since habits differ.',
      },
      {
        q: 'What do I do if no newspaper covers my press release?',
        a: 'Keep the relationship intact with a thank-you message, publish the news on your own channels with photos, and try again with a stronger news hook next time. Coverage builds over repeated, reliable, accurately-dated notes — one ignored release is normal and says little about the next.',
      },
    ],
  },
  {
    slug: 'online-petition-india-guide',
    title: 'How to Start an Online Petition in India That Builds Pressure',
    description:
      'Learn how to start an online petition in India: set signature goals, target the decision-maker, write updates that convert, and deliver it for real pressure.',
    keywords: [
      'how to start online petition india',
      'petition format india',
      'online petition signature goal',
      'petition delivery authority',
      'change.org petition india tips',
    ],
    category: 'rti-civic',
    datePublished: '2026-09-24',
    keyTakeaways: [
      'Name one decision-maker with the power to act — petitions to “the government” go nowhere.',
      'Set an honest signature goal tied to a delivery date, not a fantasy number.',
      'Regular updates with fresh facts convert signers into sharers and volunteers.',
      'Plan a physical delivery event, because paper handed over in person beats a link.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'An online petition is a pressure tool, not a solution machine. It works when it names one decision-maker, gathers signatures from people that officer answers to, and ends with a physical delivery the local press can photograph. It fails when it addresses “the government” vaguely, chases lakh-scale numbers nobody delivers, and sits as a link nobody closes. This guide shows how to run the kind that ends on an officer’s desk, not in a forgotten tab.',
      },
      { type: 'h2', text: 'Target one decision-maker, set one honest goal' },
      {
        type: 'p',
        text: 'Every effective petition has a single addressee with the authority to grant the demand: the municipal commissioner for garbage contracts, the district magistrate for land issues, the department head for service matters. Name that officer by designation in the title and text, and explain in one line why they hold the power. Then set a signature goal you can actually deliver — 1,000 verified local signatures handed over on a fixed date outweigh 50,000 anonymous clicks with no delivery plan. For illustration, a library campaign targeting its municipal commissioner set 2,000 signatures in 30 days, delivered the bound printout with press present, and got a written meeting date. This is an illustrative example, not a reported case.',
      },
      {
        type: 'table',
        title: 'Petition goal-setting that survives contact with reality',
        headers: ['Element', 'Weak version', 'Strong version'],
        rows: [
          ['Addressee', 'To the government of India', 'To the Municipal Commissioner, Nagar Nigam'],
          ['Demand', 'Improve our area', 'Clear the Lane 4 garbage point daily and publish the roster'],
          ['Signature goal', '1,00,000 signatures', '2,000 ward residents in 30 days'],
          ['Close', 'Link stays open forever', 'Delivery of printed signatures on a fixed date'],
          ['Follow-up', 'No updates after launch', 'Weekly updates with photos and signer counts'],
        ],
      },
      { type: 'h2', text: 'Write petition text that strangers sign' },
      {
        type: 'p',
        text: 'Strangers sign petitions that explain the problem in thirty seconds. Open with the human stake in two sentences, follow with three verifiable facts carrying dates and numbers, state the single demand plainly, and close by saying exactly what delivery looks like. Keep the whole text under 300 words — long petitions signal disorganisation. Add one strong photo with a caption naming place and date, since petitions with real images consistently outperform text-only ones, and proofread every designation and figure before launch.',
      },
      {
        type: 'figure',
        figure: {
          type: 'steps',
          title: 'Launch sequence for a petition that travels',
          steps: [
            'Fix the decision-maker, the single demand and the delivery date.',
            'Write under 300 words with three dated facts and one photo.',
            'Seed the first 100 signatures through members and neighbours.',
            'Share in local WhatsApp groups with a two-line personal note.',
            'Publish weekly updates with fresh facts and signer milestones.',
            'Print, bind and physically deliver the signatures with press present.',
          ],
        },
      },
      { type: 'h2', text: 'Updates are the engine, delivery is the destination' },
      {
        type: 'p',
        text: 'Petitions die without updates and convert with them. Every week, post a short update: signer milestones, a new photo, a fresh fact from your RTI file, a quote from a resident. Each update re-notifies signers and gives them a reason to share again — campaigns with steady updates routinely double their final counts. Then close the loop physically: print the signatures, bind them with your stamped complaints and RTI replies as annexures, and deliver the bundle to the officer on the announced date with members and local press present. The photograph of that handover is worth more than any signature counter.',
      },
      {
        type: 'list',
        items: [
          'Announce the delivery date publicly a week in advance.',
          'Carry printed signatures plus stamped complaints and RTI papers.',
          'Invite local reporters with a one-page press note at delivery.',
          'Take the officer’s receiving stamp on your delivery letter.',
          'Post the delivery photo as the petition’s final update.',
        ],
      },
      {
        type: 'note',
        title: 'Honest limits of petitions',
        text: 'A petition pressures; it does not compel. No officer is legally bound to act because a counter crossed a number. Treat the petition as one layer alongside stamped complaints, RTI filings and meetings — powerful in combination, thin on its own.',
      },
      { type: 'h2', text: 'After delivery: convert signatures into members' },
      {
        type: 'p',
        text: 'The signature list is your campaign’s warmest audience — people who already agreed with you once. Thank every signer with a final update, invite the locals among them to the next meeting, and record who volunteered, who donated and who only clicked. A petition that ends with forty new meeting attendees has succeeded even if the officer’s response is slow, because it built the collective that will file the next RTI, print the next parcha and return to the counter. Pressure wins rounds; organisation wins campaigns.',
      },
    ],
    faqs: [
      {
        q: 'How do I start an online petition in India?',
        a: 'Choose a petition platform, name one decision-maker by designation, write under 300 words with dated facts and a single demand, add a captioned photo, and set an honest signature goal with a delivery date. Seed the first hundred signatures through your own network before promoting widely.',
      },
      {
        q: 'How many signatures does an online petition need to work?',
        a: 'There is no magic number. A few thousand verified local signatures delivered physically to the right officer outweigh lakhs of anonymous clicks with no delivery. Set a goal your network can realistically reach before your announced delivery date, then deliver every signature on paper.',
      },
      {
        q: 'Are online petitions legally binding on the government?',
        a: 'No. No law forces an officer to act because a petition crossed a signature count. Petitions create public and media pressure that makes action politically sensible, and they work best layered with stamped complaints, RTI applications, meetings and press coverage rather than alone.',
      },
      {
        q: 'How do I deliver an online petition to the authority?',
        a: 'Print and bind the signatures with your demand letter, stamped complaints and RTI papers as annexures. Visit the officer on a pre-announced date with members present, invite local press with a one-page note, hand over the bundle, and take a receiving stamp on your delivery letter.',
      },
      {
        q: 'Which platform is best for online petitions in India?',
        a: 'Pick a widely recognised platform your signers already trust and can use on basic phones, with easy sharing to WhatsApp. Compare each platform’s reach, update tools and signature-export options before launching, since you will need to print and deliver the final list physically.',
      },
    ],
  },
]
