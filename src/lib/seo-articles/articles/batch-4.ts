import type { SeoArticle } from '../types'

export const batch4Articles: SeoArticle[] = [
  {
    slug: 'member-register-format-society',
    title: 'Member Register Format for Societies & Collectives (2026)',
    description:
      'This member register format shows every column a society needs — serial number, admission date, fees, signatures — plus paper and digital habits that pass scrutiny.',
    keywords: [
      'member register format',
      'society member register',
      'ngo member list format',
      'membership register columns',
      'society membership records india',
    ],
    category: 'governance',
    datePublished: '2026-09-24',
    keyTakeaways: [
      'Record serial number, name, father or spouse name, address, occupation, admission date, fee, and signature for every member.',
      'Use a bound, page-numbered book; correct errors with a dated, countersigned line instead of overwriting entries.',
      'Enter admissions, resignations, and removals within a week, secretary-signed.',
      'Keep scanned backups, but treat the signed physical register as the original during registrar inspections.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'If your society was asked tomorrow to prove who its members are, could you? The member register answers that question — and it is the book registrars open during inspections. This guide gives you a column-by-column format, habits that keep it inspection-ready, and how paper and digital copies work together.',
      },
      { type: 'h2', text: 'Every column in the register, explained' },
      {
        type: 'p',
        text: 'Under the Societies Registration Act, 1860 — administered by each state through its Registrar of Societies — every registered society is expected to maintain an up-to-date roll of members, and your bye-laws may add columns. The format below covers what registrars commonly expect: identity, contact, admission trail, and money trail. Fill every column at admission time; registers finished the night before an inspection are easy to spot.',
      },
      {
        type: 'table',
        title: 'Member register columns — what goes in each',
        headers: ['Column', 'What to write', 'Why it matters'],
        rows: [
          ['Serial no.', 'Running number, never reused after a removal', 'Keeps the roll auditable from end to end'],
          ['Full name', 'Name as on Aadhaar or voter ID', 'Avoids disputes over who exactly is a member'],
          ['Father / spouse name', 'As declared on the admission form', 'Identity column registrars routinely look for'],
          ['Address', 'Complete postal address with PIN code', 'Needed for notices and quorum counts'],
          ['Occupation', 'Short entry: teacher, farmer, shopkeeper', 'Shows the collective character of membership'],
          ['Date of admission', 'Date of the resolution admitting them', 'Membership starts at approval, not application'],
          ['Fee + subscription', 'Amount, receipt number, date paid', 'Links each member to your cash book'],
          ['Signature', 'Member signs; officer countersigns entry', 'Proof the entry was made in the open'],
        ],
      },
      { type: 'h2', text: 'Paper habits that survive inspections' },
      {
        type: 'p',
        text: 'To illustrate with an illustrative example only, a Jaipur education society kept its roll on loose sheets, and pages went missing with every change of office-bearers. After an inspection flagged gaps in serial numbers, they moved to a bound, page-numbered register, with the secretary countersigning every page. The register is a permanent book, not a file.',
      },
      {
        type: 'figure',
        figure: {
          type: 'checklist',
          title: 'Register discipline checklist',
          items: [
            'Use a bound, page-numbered book — never loose sheets or a spring file.',
            'Admit by resolution first, then enter in the book the same week.',
            'Correct mistakes with a single dated line and a countersignature, never whitener.',
            'Record resignations and removals with dates; never delete or reuse rows.',
            'Have the secretary sign each page and the president review the roll yearly.',
          ],
        },
      },
      { type: 'h2', text: 'Going digital without losing the original' },
      {
        type: 'p',
        text: 'A spreadsheet helps you search, sort, and print the roll in minutes — useful for voters lists before elections or member counts for the NITI Aayog Darpan portal at ngodarpan.gov.in. But most registrars still treat the signed physical book as the original. Run both: paper as the legal original, digital as the working copy, reconciled quarterly.',
      },
      {
        type: 'numbered',
        items: [
          'Compare printed digital roll serials against the bound book.',
          'Chase missing signatures, receipt numbers, or admission dates the same week.',
          'Enter all admissions and exits of the last three months, with resolution dates.',
          'Store scans and spreadsheet backup in two places.',
        ],
      },
      {
        type: 'note',
        title: 'Bye-laws first',
        text: 'State rules differ, and your registered bye-laws override any generic format. If your bye-laws demand extra columns — nominee name, membership class, ward number — add them. When in doubt, the Registrar of Societies in your state is the authority, not this guide.',
      },
      {
        type: 'p',
        text: 'A clean register does quiet work: elections run unchallenged, inspections end quickly, and new office-bearers inherit clarity. Start with the columns above and keep the weekly discipline.',
      },
    ],
    faqs: [
      {
        q: 'Is a member register compulsory for a registered society?',
        a: 'Yes, in effect. The Societies Registration Act, 1860 and state rules require a roll of members, and your bye-laws almost certainly repeat the duty. Inspections, bank formalities, and election disputes all begin with this book. Even unregistered collectives benefit, since it settles who counts as a member.',
      },
      {
        q: 'What details must each member entry contain?',
        a: 'Record serial number, full name, father or spouse name, address, occupation, admission date, fees with receipt numbers, and signatures. Many bye-laws add nominee or membership class. Use the resolution date as the admission date, since membership legally begins at approval, not application.',
      },
      {
        q: 'Can we keep the register in Excel instead of a bound book?',
        a: 'Use Excel as a working copy, not a replacement. Most registrars still expect a signed, bound, page-numbered book as the original. Run both: paper as the legal original, spreadsheet as the searchable copy, reconciled quarterly. Print the digital roll before elections so tellers work from one list.',
      },
      {
        q: 'How do we record a member who resigns or is removed?',
        a: 'Never delete the row or reuse the serial number. Add the date, reason, and resolution or letter reference, then mark cessation with a single line. The historical row preserves the audit trail. Inform the member in writing and update quorum and voter lists from the same roll.',
      },
      {
        q: 'Who signs the register, and how often should it be updated?',
        a: 'The member signs at admission and the secretary countersigns each entry, with the president reviewing yearly. Update within a week of every admission, resignation, or removal. Annual general meetings are a natural checkpoint: place the updated roll before the house and note its confirmation in the minutes.',
      },
    ],
    productTieIn:
      'Sangathan keeps a statutory-style member register for your organisation — admissions, fees, and exits recorded entry by entry — and you can bulk-import an existing roll from Excel or CSV instead of retyping the whole book.',
  },
  {
    slug: 'meeting-minutes-format-ngo',
    title: 'Meeting Minutes Format for NGOs: Template + Legal Essentials',
    description:
      'A meeting minutes format NGO office-bearers can reuse: date, quorum, agenda-wise resolutions, signatures, plus the legal essentials and storage rules that hold up.',
    keywords: [
      'meeting minutes format ngo',
      'minutes of meeting format',
      'ngo board meeting minutes',
      'mom format trust',
      'society meeting resolution format',
    ],
    category: 'governance',
    datePublished: '2026-09-24',
    keyTakeaways: [
      'Every set of minutes needs date, venue, chair, attendance, quorum confirmation, agenda-wise discussion, numbered resolutions, and signatures.',
      'Write resolutions as complete decisions with names and amounts — vague lines cannot be acted upon.',
      'Record minutes within a week, get them confirmed at the next meeting, and keep a bound, page-numbered book.',
      'For Section 8 companies under the Companies Act, 2013, board rules are stricter — follow the Act, not custom.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'Minutes are the memory of your organisation. A year on, nobody will remember decisions on signatories or repairs unless written down. This guide gives a reusable format for governing and general-body meetings, plus legal essentials that keep minutes valid.',
      },
      { type: 'h2', text: 'The skeleton every set of minutes needs' },
      {
        type: 'p',
        text: 'Whether you are a society under the Societies Registration Act, 1860, a trust under the Indian Trusts Act, 1882, or a Section 8 company under the Companies Act, 2013, the skeleton is the same. Open with name, meeting type, date, time, and venue. Name the chair, record attendance with quorum stated, list the agenda, then capture discussion and decisions. Close with adjournment time and signatures.',
      },
      {
        type: 'table',
        title: 'Minutes skeleton — element by element',
        headers: ['Element', 'What to write', 'Common slip'],
        rows: [
          ['Header', 'Organisation name, meeting type, date, time, venue', 'Not naming which body met'],
          ['Chair + attendance', 'Chair name; present, absent, and leave-of-absence lists', 'Not stating whether quorum was present'],
          ['Agenda', 'Numbered items circulated beforehand', 'Deciding big items never on the agenda'],
          ['Discussion', 'Brief summary per item, naming dissent if any', 'Recording speeches instead of the sense'],
          ['Resolutions', 'Numbered decisions with names, amounts, authorisations', 'Vague “do the needful” lines'],
          ['Close + signatures', 'Time of closure; chair and secretary sign', 'Leaving minutes unsigned for months'],
        ],
      },
      { type: 'h2', text: 'Writing resolutions that can actually be acted on' },
      {
        type: 'p',
        text: 'The resolution is the working part — it is what the bank manager reads before changing signatories. To illustrate with an illustrative example only: “Resolved that a savings account be opened with the Main Road branch of State Bank of India, to be operated jointly by secretary R. Devi and treasurer M. Khan.” That sentence carries the what, where, who, and how. Compare “resolved to open a bank account,” which sends your treasurer back for three more visits. Include amounts, full names, and authorisations.',
      },
      {
        type: 'figure',
        figure: {
          type: 'steps',
          title: 'From meeting to confirmed record',
          steps: [
            'Circulate agenda and papers a week before the meeting, as bye-laws require.',
            'Take rough notes: attendance, quorum, decisions, dissent, deadlines.',
            'Draft minutes within seven days; number each resolution.',
            'Get the chair’s approval, then place for confirmation at the next meeting.',
            'Enter confirmed minutes in the bound book; file papers alongside.',
          ],
        },
      },
      { type: 'h2', text: 'Storage discipline most NGOs skip' },
      {
        type: 'p',
        text: 'Minutes should live in a bound, page-numbered book, each meeting starting on a fresh page, corrections made as dated, countersigned lines. Keep supporting papers — notices, attendance sheets, approved bills — in a matching file. For Section 8 companies, the Companies Act, 2013 sets stricter minute-book expectations, so directors should follow the Act and professional advice. Confirmed minutes are evidence auditors and registrars routinely call for.',
      },
      {
        type: 'list',
        items: [
          'One book per body: governing, general, and committees keep their own.',
          'Never leave pages blank between meetings; rule off unused space and sign across it.',
          'Scan confirmed minutes yearly; store copies outside the office.',
          'Produce minutes within days when asked — delays look evasive.',
        ],
      },
      {
        type: 'note',
        title: 'Quorum is not optional',
        text: 'Check your bye-laws for the quorum figure before every meeting and record it in the minutes. Decisions without quorum can be challenged. If quorum fails, adjourn, record the fact, and reconvene as your bye-laws prescribe.',
      },
      {
        type: 'p',
        text: 'Good minutes take twenty extra minutes of care and save twenty hours of dispute. Use the skeleton above, write resolutions your treasurer can act on without calling you, and keep the book like the legal document it is.',
      },
    ],
    faqs: [
      {
        q: 'What is the standard format of meeting minutes for an NGO?',
        a: 'Open with organisation name, meeting type, date, time, and venue. Record the chair, attendance, and whether quorum was present. List numbered agenda items, summarise discussion per item, and write each decision as a numbered resolution with names and amounts. Close with signatures, then confirm at the next meeting.',
      },
      {
        q: 'How do you write a resolution in NGO minutes?',
        a: 'Write one complete sentence stating what was decided, the amount, full names, and who is authorised to act. Number resolutions serially through the year so banks and auditors can cite them precisely. If the treasurer cannot act on the line without calling you for an explanation, rewrite it until she can.',
      },
      {
        q: 'Do general body meeting minutes differ from board minutes?',
        a: 'The skeleton is the same, but general body minutes additionally record elections, annual report and account adoption, and membership business. Quorum rules usually differ between the two bodies, so check your bye-laws. Each body should keep its own bound minute book, confirmed at its own next meeting.',
      },
      {
        q: 'How long should an NGO keep its minutes?',
        a: 'Treat minutes as permanent records kept for the life of the organisation. Tax assessments, FCRA scrutiny under the FCRA, 2010, and 80G or 12AB proceedings under the Income-tax Act, 1961 can reach back years, and old resolutions get cited routinely. Scan confirmed minutes yearly and keep a copy outside the office.',
      },
      {
        q: 'Can minutes be kept digitally instead of in a book?',
        a: 'Digital drafts and scans are excellent working copies, but most societies and trusts are still expected to keep a signed physical minute book as the original. For Section 8 companies, follow the Companies Act, 2013 requirements strictly. The safe practice is confirmed minutes in the bound book, with scans stored separately.',
      },
    ],
    productTieIn:
      'Sangathan lets office-bearers record meeting minutes against each meeting — attendance, resolutions, and confirmations in one place — so the minute book writes itself as you go.',
  },
  {
    slug: 'secret-ballot-voting-elections',
    title: 'Secret Ballot Voting for Organisational Elections: Fair Process',
    description:
      'Secret ballot voting NGO guide: why secrecy matters, paper-ballot steps, counting protocol, recount rules, and cautious advice on digital options that protect anonymity.',
    keywords: [
      'secret ballot voting ngo',
      'fair election process organisation',
      'anonymous voting members',
      'ngo election procedure',
      'society election voting process',
    ],
    category: 'governance',
    datePublished: '2026-09-24',
    keyTakeaways: [
      'Secrecy protects ordinary members from pressure; never use signed ballots or show-of-hands for contested posts.',
      'Publish the voters list from the register a week before polling and freeze it.',
      'Count votes in the open with candidates watching, announce each ballot, and record the tally sheet with signatures.',
      'Allow a recount on a written request with a narrow margin, decided before results are declared final.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'Nothing splits a collective faster than an election its losers call rigged. A secret ballot does not just pick winners — it gives every member reason to accept the result. This guide lays out a fair, low-cost paper-ballot process: the voters list, polling discipline, counting protocol, recount rules, and honest cautions about digital options.',
      },
      { type: 'h2', text: 'Why secrecy matters more than convenience' },
      {
        type: 'p',
        text: 'In small organisations, everyone knows everyone — which is exactly why open voting fails. A show of hands forces junior members, staff, and beneficiaries to vote against the visible preference of powerful people. Secrecy reverses the pressure: nobody can prove how you voted, so nobody can punish you. To illustrate with an illustrative example only, a ward collective that moved from voice votes to folded paper slips saw two quiet women members contest for the first time.',
      },
      {
        type: 'figure',
        figure: {
          type: 'steps',
          title: 'Paper-ballot polling, step by step',
          steps: [
            'Freeze the voters list one week before polling; display it publicly.',
            'Appoint a neutral returning officer and one polling agent per candidate.',
            'Issue uniform ballot slips, one per voter, marking each name off the roll as slips are given.',
            'Set up a screened corner for marking; fold slips before they reach the sealed box.',
            'Seal the box in front of agents, open counting only when polling formally closes.',
          ],
        },
      },
      { type: 'h2', text: 'Counting protocol that survives suspicion' },
      {
        type: 'p',
        text: 'Count in the same hall, immediately after polling, with candidates or agents watching every ballot. Open the box, tally total slips against ticked names, and read each ballot aloud before sorting into candidate piles. Decide doubtful ballots openly by rules announced before counting began. Record the tally on a sheet the returning officer and all agents sign, then announce totals before declaring winners.',
      },
      {
        type: 'table',
        title: 'Paper ballots vs digital options, honestly compared',
        headers: ['Factor', 'Paper ballot', 'Digital / online voting'],
        rows: [
          ['Anonymity', 'Strong, if slips are uniform and unmarked', 'Only if the tool separates identity from vote'],
          ['Cost', 'Box, slips, screen — nearly nothing', 'Free tools exist, but secrecy varies widely'],
          ['Trust', 'Everyone watches the count happen', 'Requires members to trust software'],
          ['Remote members', 'Needs postal or proxy rules in bye-laws', 'Genuinely easier for spread-out membership'],
          ['Audit trail', 'Sealed packets of used ballots', 'Logs help, but few tools are voter-verifiable'],
        ],
      },
      { type: 'h2', text: 'Recounts, records, and digital caution' },
      {
        type: 'p',
        text: 'Announce before polling that any candidate may seek a recount in writing if the margin is narrow — say under five votes — decided before results become final. Then preserve everything: voters list, unused slips, sealed packets of counted ballots, signed tally sheet, and result declaration with the election minutes. If you consider digital voting, put anonymity first: reject any tool linking names to votes in an exportable sheet, and test with a mock poll.',
      },
      {
        type: 'note',
        title: 'Check your bye-laws first',
        text: 'Your registered bye-laws or trust deed govern term lengths, voter eligibility, notice periods, and whether postal, proxy, or electronic voting is even permitted. An election held outside the bye-laws can be set aside no matter how fairly it was run. Read the election clauses before fixing the schedule.',
      },
      {
        type: 'p',
        text: 'Fair elections are boring administration done visibly: frozen roll, sealed box, open count, papers kept for years.',
      },
    ],
    faqs: [
      {
        q: 'What is the secret ballot procedure for NGO elections?',
        a: 'Freeze a voters list from the member register a week ahead, appoint a neutral returning officer, and issue one uniform slip per voter against ticked names. Voters mark slips in a screened corner and drop folded slips into a sealed box. Count immediately in the open with agents watching, read each ballot aloud, sign a tally sheet, and declare results the same day.',
      },
      {
        q: 'Why is secret ballot better than show of hands?',
        a: 'Open voting exposes juniors, employees, and beneficiaries to pressure from powerful people in the room, so results reflect fear as much as preference. A secret ballot breaks the link between voter and vote, lowering the cost of dissent and letting new candidates emerge. For any contested post, secrecy is what makes the result acceptable to the losing side.',
      },
      {
        q: 'Who can vote in a society election?',
        a: 'Your bye-laws decide: usually members admitted before a cut-off date with subscriptions paid up. Publish the voters list from the member register a week before polling so errors get corrected. Admitting waves of new members days before polling to swing results is a classic dispute — many bye-laws bar admissions in the months preceding elections.',
      },
      {
        q: 'When should a recount be allowed?',
        a: 'Permit a recount when a candidate requests it in writing and the margin is narrow — a common rule is under five votes. Announce this rule before polling, not after a dispute. The returning officer recounts immediately, before results go final, with the same agents present, and records the revised tally with fresh signatures.',
      },
      {
        q: 'Is online voting safe for small organisation elections?',
        a: 'It can be, but anonymity comes first. Many free tools record names alongside votes or let administrators export who voted how, destroying secrecy. If members are spread across cities, use a tool that verifiably separates identity from ballot and run a mock poll first. Keep paper-ballot rules for rolls, observers, and records — never trade secrecy for convenience.',
      },
    ],
    productTieIn:
      'Sangathan supports secret-ballot voting for organisational elections — anonymous ballots with a proper voters list — so members can vote freely and results stay above suspicion.',
  },
  {
    slug: 'volunteer-management-small-ngo',
    title: 'Volunteer Management for Small NGOs: Roles, Hours, Recognition',
    description:
      'Volunteer management NGO playbook: role cards, hour logs, recognition that works, plus burnout prevention for small teams carrying big workloads.',
    keywords: [
      'volunteer management ngo',
      'managing volunteers india',
      'volunteer policy ngo',
      'volunteer retention',
      'volunteer roles responsibilities ngo',
    ],
    category: 'governance',
    datePublished: '2026-09-24',
    keyTakeaways: [
      'Write one-page role cards with tasks, time commitment, and a named supervisor before anyone starts.',
      'Log volunteer hours monthly; the log doubles as attendance proof and recognition data.',
      'Recognise specifically and early — name the task, the effort, and the effect, in front of peers.',
      'Watch for burnout signals and rotate duties; an exit note keeps the door open for return.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'Small NGOs run on volunteers, and volunteers run on clarity. Most volunteer problems — irregular attendance, dropped tasks, quiet resentment — trace back to fuzzy expectations rather than weak commitment. This guide gives you a workable system: role cards, hour logging, recognition that costs little, burnout prevention, and graceful exits.',
      },
      { type: 'h2', text: 'Start with role cards, not speeches' },
      {
        type: 'p',
        text: 'A role card is a single page stating what the volunteer will do, weekly hours, supervisor, and commitment length. Write it before recruitment and read it aloud together on day one. To illustrate with an illustrative example only, a literacy centre that replaced vague appeals for “teaching help” with “two evenings a week, Class 3 reading, 25 children, three-month term” filled all six slots in a fortnight — people say yes when they can see the shape of the yes.',
      },
      {
        type: 'table',
        title: 'What a one-page volunteer role card carries',
        headers: ['Section', 'Example', 'Why it helps'],
        rows: [
          ['Role title', 'Weekend library assistant', 'Gives identity and belonging'],
          ['Tasks', 'Issue books, shelve returns, read-aloud hour', 'Ends arguments about scope'],
          ['Time', 'Sat–Sun, 10 am–1 pm, 3-month term', 'Lets volunteers plan their lives'],
          ['Supervisor', 'Named person + phone number', 'Nobody reports to “the office”'],
          ['Support', 'Training date, travel reimbursement', 'Removes hidden costs of helping'],
          ['Review', 'Fortnightly 15-minute check-in', 'Catches problems while small'],
        ],
      },
      { type: 'h2', text: 'Log hours like they matter — because they do' },
      {
        type: 'p',
        text: 'A simple register or shared sheet where volunteers record date, hours, and task done is the backbone of the system. It shows who is drifting before they disappear, gives honest numbers for annual reports and NITI Aayog Darpan updates at ngodarpan.gov.in, and feeds certificates and references. Review the log monthly in a fifteen-minute check-in: what went well, what dragged, what changes next month.',
      },
      {
        type: 'figure',
        figure: {
          type: 'checklist',
          title: 'Monthly volunteer check-in (15 minutes)',
          items: [
            'Open the hour log together; acknowledge the actual hours given.',
            'Ask what task gave energy and which one drained it.',
            'Agree one adjustment: timing, task mix, training, or a short break.',
            'Note any grievance early — small irritations become exits.',
            'Confirm next month’s schedule before you part.',
          ],
        },
      },
      { type: 'h2', text: 'Recognition that works, and burnout prevention' },
      {
        type: 'p',
        text: 'Recognition works when it is specific, prompt, and public: name the task, the extra effort, and its effect, in front of peers. Certificates matter in India — signed, dated, with hours served — because students and job-seekers genuinely use them. But the deeper retention tool is burnout prevention: rotate heavy duties, cap weekly hours on the role card, insist on festival and exam breaks, and thank people before they wonder why they bother.',
      },
      {
        type: 'list',
        items: [
          'Welcome each volunteer by name at a team meeting; introduce their role card briefly.',
          'Issue certificates quarterly with exact hours — not vague “valuable service” lines.',
          'Create a volunteer-of-the-month note on the noticeboard, citing a specific contribution.',
          'Offer training first to regulars: first aid, teaching methods, basic accounts.',
          'Take an exit note from every leaver: reason, feedback, and whether they may return.',
        ],
      },
      {
        type: 'note',
        title: 'Money and volunteers',
        text: 'Reimburse genuine out-of-pocket costs — travel, phone, printing — promptly and without making volunteers beg. Unreimbursed expenses silently tax the poorest volunteers first. Keep a small monthly imprest for this, record every payment, and never delay reimbursements beyond the month.',
      },
      {
        type: 'p',
        text: 'Treat volunteers as unpaid colleagues rather than free labour: clear roles, logged hours, specific thanks, and honest workload limits. Teams managed this way do not just stay longer — they bring their friends.',
      },
    ],
    faqs: [
      {
        q: 'How do small NGOs manage volunteers effectively?',
        a: 'Write one-page role cards with tasks, hours, supervisor, and term before anyone starts. Log hours monthly and hold fifteen-minute check-ins to adjust workloads early. Recognise contributions specifically and publicly, reimburse expenses promptly, and rotate heavy duties. Most volunteer problems are clarity problems, and this routine supplies it.',
      },
      {
        q: 'What should a volunteer policy for an NGO include?',
        a: 'Cover recruitment, role cards, time commitments, attendance logging, supervision, expense reimbursement, conduct, safeguarding for work with children, certificates, grievances, and exits. Keep it to a few readable pages approved by the governing body. A short policy volunteers actually read beats a long one nobody opens.',
      },
      {
        q: 'How do you retain volunteers in a small organisation?',
        a: 'Retain through clarity and attention: realistic role cards, monthly check-ins, prompt reimbursement, specific public recognition, and training chances. Watch for missed shifts and short tempers, and offer breaks before people quit. Certificates with exact hours matter greatly to students and job-seekers, so issue them quarterly without being asked.',
      },
      {
        q: 'Should NGOs pay volunteers or only reimburse expenses?',
        a: 'Pure volunteers are unpaid by definition, but always reimburse genuine out-of-pocket costs like travel and phone charges. If someone works near-full-time for months, consider an honorarium or formal part-time engagement instead of stretching the volunteer label. Keep every payment recorded and consistent so money never breeds quiet resentment.',
      },
      {
        q: 'What records should we keep for each volunteer?',
        a: 'Keep the joining form, ID proof copy, signed role card, monthly hour logs, training attended, certificates issued, and an exit note. This file supports references, settles tenure disputes, and feeds honest numbers into annual reports. Store personal data securely and share it only with consent.',
      },
    ],
    productTieIn:
      'Sangathan keeps member and volunteer records with role details and printable member ID cards, so regular volunteers carry recognised identity and their service history stays on file.',
  },
  {
    slug: 'complaint-diary-rti-reminder-system',
    title: 'Complaint Diary + 30-Day RTI Reminder: Never Lose a Grievance',
    description:
      'A complaint diary format plus a 30-day RTI reminder routine so no grievance goes missing: columns, receiving-stamp habit, and escalation ladder.',
    keywords: [
      'complaint diary format',
      'rti reminder 30 days',
      'track municipal complaints',
      'grievance register format',
      'rti first appeal process',
    ],
    category: 'governance',
    datePublished: '2026-09-24',
    keyTakeaways: [
      'Give every grievance a diary number, date, department, and a receiving stamp on day one.',
      'Count 30 days from RTI application to PIO reply under the RTI Act, 2005 — then file the first appeal.',
      'Review the diary weekly; escalate in order: reminder, first appeal or higher officer, then the elected councillor or MLA.',
      'File RTI applications on rtionline.gov.in so dates, payments, and replies stay on record.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'Drains stay clogged and streetlights stay dark — not always because officials refuse, but because complaints vanish into loose papers and forgotten follow-ups. A complaint diary plus a 30-day RTI reminder routine fixes exactly that: the diary columns, the receiving-stamp habit, the countdown discipline, and the escalation ladder that turns complaints into outcomes.',
      },
      { type: 'h2', text: 'The diary columns that keep every grievance alive' },
      {
        type: 'p',
        text: 'One bound register or shared sheet carries every complaint your collective handles. The rule is simple: nothing is pursued unless entered first, and nothing closes without a recorded outcome. Each row gets a running diary number for the year — CD-2026-014 reads far better in an escalation letter than “our complaint about the drain.” Review open rows together every week; a diary nobody reviews is decoration.',
      },
      {
        type: 'table',
        title: 'Complaint diary columns — and what each one does',
        headers: ['Column', 'What to write', 'Why it matters'],
        rows: [
          ['Diary no. + date', 'CD-2026-014, date received', 'Unique reference for follow-ups'],
          ['Complainant', 'Name, address, phone', 'So replies reach the right person'],
          ['Department + office', 'Ward office, PHED subdivision', 'Vague offices kill complaints'],
          ['Grievance summary', 'Two lines: what, where, since when', 'Forces clarity before action'],
          ['Acknowledgement', 'Receiving stamp no. or online ref', 'Proof the office accepted it'],
          ['Next action + date', 'Reminder visit on 12th; appeal by 30th day', 'The countdown lives here'],
          ['Outcome', 'Resolved / escalated, with date', 'Nothing closes on a verbal promise'],
        ],
      },
      { type: 'h2', text: 'The receiving-stamp habit and the 30-day countdown' },
      {
        type: 'p',
        text: 'Always file complaints in duplicate and get the receiving stamp, signature, and date on your copy — or keep the SMS and reference number for online filings like CPGRAMS. Under the RTI Act, 2005, the Public Information Officer gets 30 days to reply, so mark day 30 the moment you file on rtionline.gov.in or by post. To illustrate with an illustrative example only, a mohalla group tracking twelve drain complaints found stamped copies plus marked 30th days doubled responses in one season — nothing was forgotten, and every reminder cited a reference.',
      },
      {
        type: 'figure',
        figure: {
          type: 'steps',
          title: 'The 30-day RTI countdown routine',
          steps: [
            'File the RTI with clear, numbered questions; keep delivery and fee proof.',
            'Enter diary number, PIO office, filing date, and the 30th day.',
            'Send one reminder around day 20 citing your reference.',
            'On day 31 with no reply, file the first appeal.',
            'Record every reply, inspection date, and document received against the diary row.',
          ],
        },
      },
      { type: 'h2', text: 'The escalation ladder, in order' },
      {
        type: 'p',
        text: 'Escalation works when each step cites the last. Begin with a reminder quoting diary number and acknowledgement. If the RTI reply is denied, delayed, or incomplete, file the first appeal naming exactly what is missing. Then take the file to the councillor, MLA, or district meetings — stamped papers move fastest.',
      },
      {
        type: 'list',
        items: [
          'Step one: polite reminder with diary number and acknowledgement copy.',
          'Step two: first appeal under the RTI Act, 2005, or complaint to the higher officer.',
          'Step three: councillor or MLA meeting with the complete dated file.',
          'Step four: district grievance forums and public hearings, file in hand.',
        ],
      },
      {
        type: 'note',
        title: 'The 30-day rule, stated plainly',
        text: 'Under the RTI Act, 2005, the PIO ordinarily has 30 days from receipt — counted from when the office receives it, not when you post it. If day 30 passes in silence, file the first appeal.',
      },
      {
        type: 'p',
        text: 'Civic persistence is administration: stamped copies, marked calendars, weekly reviews, orderly escalation. Run the diary one season and offices will know you as the group whose papers are always in order.',
      },
    ],
    faqs: [
      {
        q: 'What is a complaint diary format for citizen groups?',
        a: 'A running register where each grievance gets a diary number, date, complainant details, department, summary, acknowledgement reference, next-action date, and outcome. Nothing is pursued unless entered; nothing closes without a recorded outcome. Review open rows every week and cite diary numbers in escalation letters.',
      },
      {
        q: 'How many days does the PIO get to reply to an RTI?',
        a: 'Ordinarily 30 days from receipt under the RTI Act, 2005. Mark the 30th day the moment you file, remind politely around day 20, and file the first appeal if the reply is missing or incomplete. Filing through rtionline.gov.in keeps your dates, fee payment, and replies saved on record.',
      },
      {
        q: 'What is the first appeal process under RTI?',
        a: 'If the PIO misses the 30-day deadline or the reply disappoints, appeal in writing to the First Appellate Authority, citing application number and dates. Attach the application copy and postal or portal receipts, and state precisely which information is missing. Keep the appeal factual and within the permitted time.',
      },
      {
        q: 'How do we track municipal complaints effectively?',
        a: 'File in writing or through the official portal, always keeping the acknowledgement number. Enter the complaint in your diary with office name, date, and next-action date, then follow the reminder-to-escalation ladder weekly. Stamped receiving copies and dated references make officers act faster, because the paper trail shows persistence.',
      },
      {
        q: 'Where should we file RTI applications online?',
        a: 'Use rtionline.gov.in for central ministries and departments covered there, with fees and replies on record. For state departments, use the state RTI portal or registered post to the concerned PIO. Either way, save the application copy, payment proof, and postal receipt against your diary number the same day.',
      },
    ],
    productTieIn:
      'Sangathan includes a complaint diary with a 30-day RTI reminder, so every grievance carries its dates and next action — and no appeal deadline slips past.',
  },
  {
    slug: 'transparency-portal-small-ngo',
    title: 'How Small NGOs Can Publish a Transparency Page Donors Trust',
    description:
      'An NGO transparency page donors trust: registration papers, audited statements, board list, 80G status — what to publish, redact, and update.',
    keywords: [
      'ngo transparency page',
      'what to publish ngo website',
      'donor trust transparency',
      'ngo disclosure requirements',
      'ngo annual report online',
    ],
    category: 'governance',
    datePublished: '2026-09-24',
    keyTakeaways: [
      'Publish registration certificate, bye-laws or trust deed, PAN, board list, audited statements, annual report, and 80G or 12AB status.',
      'Claim 80G receipts only if your organisation holds its own 80G approval; otherwise say 80G-ready or nothing.',
      'Redact Aadhaar numbers, bank account numbers, donor phone numbers, and addresses of vulnerable beneficiaries.',
      'Refresh the page every year within six months of year-end, and date-stamp every document.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'Donors today check before they give. A simple, honest transparency page — your core documents on one page of your website — answers their questions before they ask. This guide covers what to publish, what to redact, and the yearly rhythm that keeps the page alive, sized for small teams without a communications department.',
      },
      { type: 'h2', text: 'What to publish: the trust-building set' },
      {
        type: 'p',
        text: 'Think of the page as the file you would hand a careful donor across the table. Registration certificate under the Societies Registration Act, 1860, the Indian Trusts Act, 1882, or Section 8 of the Companies Act, 2013; bye-laws or trust deed; PAN; NITI Aayog Darpan registration from ngodarpan.gov.in; board list; three years of audited statements and annual reports; and 12AB and 80G status under the Income-tax Act, 1961, with numbers and validity. FCRA-registered organisations under the FCRA, 2010 should link their mandated quarterly disclosures. Date-stamp every upload.',
      },
      {
        type: 'table',
        title: 'Publish, summarise, or redact — document by document',
        headers: ['Document', 'How to show it', 'Notes'],
        rows: [
          ['Registration certificate', 'Full scan as PDF', 'Your legal existence proof; always current'],
          ['Bye-laws / trust deed', 'Full text or scan', 'Donors check objects and governance rules'],
          ['Board / trustee list', 'Names and roles', 'Add year of appointment, not home addresses'],
          ['Audited statements', 'Full PDFs, 3 years', 'Balance sheet, income-expenditure, receipts-payments'],
          ['Annual report', 'Full PDF + one-page summary', 'Activities, numbers served, finances in plain words'],
          ['80G + 12AB approvals', 'Approval numbers + validity', 'Claim 80G receipts only with your own approval'],
          ['Donor list', 'Names + slabs, with consent', 'Never publish phone numbers or addresses'],
        ],
      },
      { type: 'h2', text: 'The 80G honesty rule' },
      {
        type: 'p',
        text: 'This deserves its own section because it is where small NGOs most often slip. Only describe donations as 80G receipts if your organisation holds its own live 80G approval; an application under process is not an approval. To illustrate with an illustrative example only, a Jaipur education trust once printed “80G receipts available” while renewal was pending, and withdrew the claim after a donor checked incometax.gov.in. Until approval exists, say “80G-ready systems” — and renew through proper channels with professional help.',
      },
      {
        type: 'figure',
        figure: {
          type: 'checklist',
          title: 'Yearly transparency refresh routine',
          items: [
            'Upload the new audit and annual report within six months of year-end.',
            'Update board changes, contact details, and registration validity dates.',
            'Confirm 80G and 12AB approval numbers and validity windows still read correctly.',
            'Replace “coming soon” placeholders — a stale page hurts more than a thin one.',
            'Ask one outsider yearly to read the page and flag anything confusing.',
          ],
        },
      },
      { type: 'h2', text: 'What to redact, and how to stay safe' },
      {
        type: 'p',
        text: 'Transparency never means exposing people. Strip Aadhaar and bank account numbers from every scan, remove home addresses and phone numbers of staff and donors, and never publish identifying details of vulnerable beneficiaries such as children. Share programme photos with consent, preferring group shots where consent is doubtful. A short privacy note on the page signals maturity to institutional donors.',
      },
      {
        type: 'note',
        title: 'Small is fine; stale is not',
        text: 'A thin but current page beats a thick abandoned one. If you only have two years of audits, publish two with dates. Donors forgive small; they do not forgive documents five years old or a page that says the report is coming soon since 2021.',
      },
      {
        type: 'p',
        text: 'Build the page in one focused weekend, refresh it once a year, and link it from every proposal and appeal. Over time it becomes your hardest-working fundraiser — the one that answers questions while you sleep.',
      },
    ],
    faqs: [
      {
        q: 'What should an NGO publish on its transparency page?',
        a: 'Publish the registration certificate, bye-laws or trust deed, PAN, Darpan registration, board list, three years of audited statements, annual reports, and 12AB plus 80G status with validity. FCRA holders should link quarterly disclosures. Date-stamp every document and refresh the page within six months of each year-end.',
      },
      {
        q: 'Can we claim 80G benefits without 80G registration?',
        a: 'No. Only organisations holding their own live 80G approval can issue 80G receipts; an application under process does not count. Donors can verify approvals on the Income Tax portal at incometax.gov.in, so false claims get caught. Until approval exists, describe your systems as 80G-ready and pursue registration through proper channels with professional guidance.',
      },
      {
        q: 'How often should a small NGO update its website disclosures?',
        a: 'Refresh core documents once a year within six months of year-end: new audit, annual report, board changes, and approval validity dates. FCRA-registered NGOs must additionally follow quarterly disclosure timelines. A yearly outsider review catches stale figures and confusing language. Regularity matters more than volume — current and thin beats thick and abandoned.',
      },
      {
        q: 'Should we publish our donor list online?',
        a: 'Publishing donor names in slabs builds confidence, but only with each donor’s consent. Never publish phone numbers, addresses, or exact large amounts without explicit permission. Honour anonymity requests fully while reporting aggregate collections in audited statements. Corporate CSR donors usually welcome mentions; individual donors vary, so ask first.',
      },
      {
        q: 'Do unregistered collectives need a transparency page?',
        a: 'A simple public page still helps: state who you are, what you do, who decides, and where money goes, with basic income-expenditure summaries. You cannot show registration or 80G papers you do not hold, so be upfront about unregistered status. Honest informal disclosure builds credibility that later supports registration and fundraising.',
      },
    ],
    productTieIn:
      'Sangathan gives small NGOs a public transparency page out of the box — registration details, reports, and disclosures in one linkable place that donors can actually verify.',
  },
  {
    slug: 'member-id-cards-organisation',
    title: 'Member ID Cards for Organisations: What to Print + Verify',
    description:
      'Member ID card format for organisations: fields to print, photo and validity rules, QR verification, reissue process, and honest cost notes.',
    keywords: [
      'member id card format',
      'ngo id card',
      'volunteer id card india',
      'digital member id card',
      'organisation identity card format',
    ],
    category: 'governance',
    datePublished: '2026-09-24',
    keyTakeaways: [
      'Print organisation name, cardholder name, membership number, role, photo, validity dates, and authorised signature with seal.',
      'Verify cards against the member register serial number — the card is only as genuine as the roll behind it.',
      'Add a QR code linking to a verification page for field-level checks.',
      'Run a written reissue process for lost cards: report, fee, new serial entry, and deactivation of the old card.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'An ID card turns membership from a claim into something verifiable. Volunteers entering schools, members attending district meetings, and collectors handling donations all work more smoothly when identity is one glance away. This guide covers what to print, how anyone can verify a card, and how to handle loss, expiry, and costs without drama.',
      },
      { type: 'h2', text: 'Fields to print: the front and the back' },
      {
        type: 'p',
        text: 'The front carries identity: organisation name with logo, card type, holder name, photograph, membership number matching the register, role, and validity dates. The back carries verification: office address, phone number or QR code, cardholder signature, and the authorised signature with seal. To illustrate with an illustrative example only, a health camp collective reprinted two hundred cards after realising none carried validity dates — undated cards of resigned volunteers kept surfacing at events.',
      },
      {
        type: 'table',
        title: 'ID card fields — front vs back',
        headers: ['Side', 'Field', 'Tip'],
        rows: [
          ['Front', 'Organisation name + logo', 'Legal name as registered, not only the campaign name'],
          ['Front', 'Cardholder name + photo', 'Recent passport-size photo'],
          ['Front', 'Membership / roll number', 'Must match the register serial exactly'],
          ['Front', 'Role + validity dates', 'Undated cards live forever — always print an expiry'],
          ['Back', 'Office address + phone', 'Verification calls must reach a real person'],
          ['Back', 'QR code', 'Links to a verification page or pre-filled check SMS'],
          ['Back', 'Signatures + seal', 'Both sign; seal affixed'],
        ],
      },
      { type: 'h2', text: 'Verification anyone can do in a minute' },
      {
        type: 'p',
        text: 'A card verifies in three steps: read the membership number, match it against the member register, and confirm name, photo, role, and validity agree. A QR code can shortcut this by opening a verification page — but the register remains the source of truth, since QR codes are easily copied onto fake cards. Train gate volunteers on this one-minute check, and publish the verification number on your website and noticeboard.',
      },
      {
        type: 'figure',
        figure: {
          type: 'checklist',
          title: 'One-minute card verification',
          items: [
            'Read the membership number and validity dates on the card.',
            'Match the number against the member register or current roll.',
            'Confirm name, photograph, and role agree with the register entry.',
            'Check validity, signature, and seal.',
            'For high-stakes access, call the number on the back.',
          ],
        },
      },
      { type: 'h2', text: 'Reissue, expiry, and honest costs' },
      {
        type: 'p',
        text: 'Cards should expire — one to three years for members, shorter for event volunteers — with renewal tied to an updated register entry. For lost cards, require a written report, collect a modest reissue fee, and mark the old number deactivated. On cost, standard PVC cards from local printers typically run tens of rupees per card in bulk, plus one-time design and QR setup; collect two or three quotes before ordering.',
      },
      {
        type: 'numbered',
        items: [
          'Fix card validity in a governing-body resolution before printing.',
          'Collect photos, verify names against the register, and freeze the print list.',
          'Print, sign, seal, and issue against signatures.',
          'Publish the verification number and train checkers.',
        ],
      },
      {
        type: 'note',
        title: 'Cards are not authority letters',
        text: 'A card proves membership, not authority to collect money or speak for the organisation. Fund collectors need a separate dated authority letter per drive. Printing “authorised signatory” on every card invites misuse.',
      },
      {
        type: 'p',
        text: 'Done right, ID cards upgrade everything: faster event entry, credible field teams, fakes caught at the gate. Print carefully, verify casually, expire ruthlessly.',
      },
    ],
    faqs: [
      {
        q: 'What should be printed on an NGO member ID card?',
        a: 'Print the legal name with logo, card type, holder name and photo, membership number matching the register, role, validity dates, office contact, a QR code, and signatures with seal. Always include an expiry date so resigned members cannot reuse old cards. Keep the design readable at arm’s length in field conditions.',
      },
      {
        q: 'How do you verify if a volunteer ID card is genuine?',
        a: 'Match the membership number against the member register, confirming name, photo, role, and validity dates. A QR code may shortcut to the same details, but the register is the source of truth since codes can be copied. For high-stakes situations like cash collection, call the verification number on the card back first.',
      },
      {
        q: 'What is the process for a lost member ID card?',
        a: 'Ask the member for a written loss report, record it with the date, and mark the old card number deactivated in your records. Collect a small reissue fee if your policy provides one, print the replacement with the same membership number, and issue it against a signature. Circulate the deactivation to gate teams so the lost card cannot be misused.',
      },
      {
        q: 'How long should organisation ID cards stay valid?',
        a: 'One to three years suits most members, with renewal tied to a fresh register check and subscription status. Event or project volunteers should get shorter, assignment-linked validity. Expiry matters because undated cards keep circulating after resignations. Announce renewals a month ahead and collect expired cards wherever practical.',
      },
      {
        q: 'How much does printing member ID cards cost in India?',
        a: 'Standard PVC cards from local printers usually cost tens of rupees per card in reasonable bulk, plus one-time design and QR setup. Premium smart cards cost far more and suit only large federations. Collect two or three local quotes, order about ten per cent extra for reissues, and treat printing as a planned yearly expense.',
      },
    ],
    productTieIn:
      'Sangathan issues member ID cards linked to your organisation register — printable cards with validity and verification details, reissued cleanly when roles change or cards go missing.',
  },
  {
    slug: 'onboarding-new-members-collective',
    title: 'Onboarding New Members: A First-30-Days Checklist',
    description:
      'A member onboarding checklist for the first 30 days: week-by-week tasks, buddy system, first-meeting script, and paperwork that keeps records clean.',
    keywords: [
      'member onboarding checklist',
      'onboard volunteers ngo',
      'new member induction',
      'collective member welcome',
      'ngo joining process',
    ],
    category: 'governance',
    datePublished: '2026-09-24',
    keyTakeaways: [
      'Complete paperwork first: admission form, ID proof, register entry, and fee receipt before the first meeting.',
      'Assign every newcomer a buddy who introduces people, norms, and unwritten rules over four weeks.',
      'Give a small first task in week one so the new member contributes before the first month ends.',
      'Review the onboarding at day 30 with a short conversation, then confirm the membership formally.',
    ],
    blocks: [
      {
        type: 'p',
        text: 'Most members decide in the first month whether they truly belong — or quietly drift away. Onboarding makes those thirty days deliberate: paperwork done right, people introduced warmly, a first contribution made early. This guide gives you a week-by-week checklist, a buddy system that works, a first-meeting script, and paperwork that keeps records clean.',
      },
      { type: 'h2', text: 'Before day one: the paperwork spine' },
      {
        type: 'p',
        text: 'Paperwork is what makes membership real. Collect a filled admission form, ID proof copy, and admission fee with receipt before the newcomer attends as a member. Place the admission before the competent body — governing or general body, as your bye-laws or trust deed require — and enter the name in the register only after approval, with the resolution date as admission date. Hand over a welcome kit the same week: rules summary, contacts, calendar, role options.',
      },
      {
        type: 'table',
        title: 'Joining paperwork — collect, approve, record',
        headers: ['Step', 'Document', 'Done when'],
        rows: [
          ['Collect', 'Admission form + ID proof copy', 'Received and filed'],
          ['Collect', 'Admission fee + receipt', 'Receipt issued, cash book updated'],
          ['Approve', 'Resolution admitting the member', 'Passed by the competent body'],
          ['Record', 'Member register entry', 'Entered with resolution date'],
          ['Welcome', 'Kit: rules, contacts, calendar', 'Handed over in week one'],
        ],
      },
      { type: 'h2', text: 'The first 30 days, week by week' },
      {
        type: 'p',
        text: 'To illustrate with an illustrative example only, a library collective that let newcomers “just hang around” lost half of them within two months; after adopting a thirty-day plan with a buddy and a week-one task, nearly every newcomer stayed. Structure beats charisma: people remain where they quickly feel useful and known. The timeline below paces welcome, learning, contribution, and confirmation.',
      },
      {
        type: 'figure',
        figure: {
          type: 'timeline',
          title: 'First-30-days onboarding timeline',
          entries: [
            { label: 'Days 1–7: Welcome', text: 'Buddy assigned, kit given, people introduced, one small task allotted.' },
            { label: 'Days 8–14: Learn', text: 'Attend first meeting, read rules summary, visit one field activity.' },
            { label: 'Days 15–21: Contribute', text: 'Own one task end to end, report at the weekly check-in.' },
            { label: 'Days 22–30: Confirm', text: 'Thirty-day conversation; membership confirmed, next role agreed.' },
          ],
        },
      },
      { type: 'h2', text: 'Buddy system and the first-meeting script' },
      {
        type: 'p',
        text: 'Pair every newcomer with a buddy — a regular member, not an office-bearer — who sits with them at meetings, explains unwritten norms like speaking order, and checks in twice during the month. For the first meeting, use a tiny script: the chair welcomes newcomers by name in the first five minutes, the secretary gives a two-minute picture of priorities, the buddy introduces three people over chai, and the meeting ends with a first role offered, not assigned.',
      },
      {
        type: 'list',
        items: [
          'Welcome newcomers by name in the opening minutes — never leave introductions to the end.',
          'Give a two-minute plain-words briefing: what the collective does, what is urgent now.',
          'Over chai, the buddy introduces three members by name.',
          'Offer a first role as a choice between two concrete tasks, sized for one week.',
          'Close the loop at day 30: confirm membership, record it, and celebrate briefly.',
        ],
      },
      {
        type: 'note',
        title: 'Approval before entry, always',
        text: 'Names go into the member register only after the competent body approves admission — never on application, payment, or enthusiasm alone. Backdated or pre-approved entries are a classic election dispute. Keep the sequence visible: form, fee, resolution, register, welcome.',
      },
      {
        type: 'p',
        text: 'Thirty deliberate days cost little: a form, a buddy, a small task, and a short conversation. What they buy is a member who arrives at the second month already belonging — and a register that stays beyond dispute.',
      },
    ],
    faqs: [
      {
        q: 'What is a good new member onboarding checklist?',
        a: 'Collect the admission form, ID proof, and fee with receipt; get admission approved by resolution; enter the member in the register; hand over a welcome kit; assign a buddy; allot a small week-one task; and hold a thirty-day review. Confirm membership formally at the end and file every paper against the register serial.',
      },
      {
        q: 'How do you onboard volunteers in a small NGO?',
        a: 'Combine member onboarding with a one-page volunteer role card covering tasks, hours, supervisor, and term. Explain safeguarding and conduct rules on day one, pair them with an experienced buddy, and start with a small supervised task. Log hours from the first week so certificates and references later write themselves from real data.',
      },
      {
        q: 'What should happen in a new member’s first meeting?',
        a: 'Welcome them by name in the opening minutes and give a two-minute briefing on current priorities. Let them observe and speak without pressuring a position, have the buddy introduce them to three members during the break, and offer a small first role as a choice. End by confirming the next meeting date personally so returning feels expected and easy.',
      },
      {
        q: 'How long should member onboarding take?',
        a: 'Thirty days suits most collectives: week one for welcome and paperwork, week two for learning through meetings and visits, week three for a first owned task, week four for review and confirmation. Complex roles like field leadership may need longer shadowing. The principle holds regardless — paced belonging beats both neglect and overload.',
      },
      {
        q: 'What documents does a new society member need to submit?',
        a: 'Typically a filled admission form with proposer and seconder where bye-laws require them, an ID proof copy, a photograph, and the admission fee plus first subscription. Bye-laws may specify eligibility or admission blackout periods before elections. File everything against the register serial once admission is formally approved.',
      },
    ],
    productTieIn:
      'Sangathan helps onboarding stay tidy: import new members from Excel or CSV, record them in the statutory-style register, and issue member ID cards once admission is confirmed.',
  },

]
