export type ComplianceRule = {
  id: string
  title: string
  category: string
  description: string
  registration_link?: string
  orgTypes: string[] // 'all', 'ngo', 'student_union', 'workers_union', 'rwa', 'club'
  condition: (metrics: OrgMetrics) => boolean
}

export type OrgMetrics = {
  memberCount: number
  totalDonations: number
  eventCount: number
  hasForeignDonations: boolean
  hasPaidTickets: boolean
}

export const COMPLIANCE_RULES: ComplianceRule[] = [
  // --- GENERAL STATUTORY COMPLIANCE ---
  {
    id: 'pan_card',
    title: 'PAN Card Registration',
    category: 'Tax & Identity',
    description: 'Permanent Account Number for institutional tax identity and bank operations.',
    registration_link: 'https://www.incometax.gov.in/iec/foportal/',
    orgTypes: ['all'],
    condition: () => true
  },
  {
    id: 'internal_complaints_committee',
    title: 'Internal Complaints Committee (POSH Act)',
    category: 'Statutory Governance',
    description: 'Mandatory constitution of ICC under the Sexual Harassment of Women at Workplace Act 2013.',
    registration_link: 'https://wcd.nic.in/',
    orgTypes: ['all'],
    condition: (metrics) => metrics.memberCount >= 10
  },

  // --- NGO SPECIFIC COMPLIANCE ---
  {
    id: 'ngo_darpan',
    title: 'NITI Aayog NGO Darpan Registration',
    category: 'Legal & Grants',
    description: 'Unique Darpan ID issued by NITI Aayog required for government grant applications and CSR eligibility.',
    registration_link: 'https://ngodarpan.gov.in/',
    orgTypes: ['ngo'],
    condition: () => true
  },
  {
    id: '12a_80g',
    title: '12A & 80G Tax Exemption Certificate',
    category: 'Tax Exemption',
    description: 'Section 12A surplus tax exemption and 80G tax deduction certificates for Indian donors.',
    registration_link: 'https://www.incometax.gov.in/iec/foportal/',
    orgTypes: ['ngo'],
    condition: (metrics) => metrics.totalDonations > 0
  },
  {
    id: 'csr_1_registration',
    title: 'MCA Form CSR-1 Registration',
    category: 'CSR Eligibility',
    description: 'Ministry of Corporate Affairs filing for undertaking Corporate Social Responsibility projects.',
    registration_link: 'https://www.mca.gov.in/content/mca/global/en/home.html',
    orgTypes: ['ngo'],
    condition: (metrics) => metrics.totalDonations > 25000 || metrics.memberCount > 5
  },
  {
    id: 'fcra',
    title: 'FCRA Registration (MHA)',
    category: 'Foreign Contributions',
    description: 'Ministry of Home Affairs license under Foreign Contribution Regulation Act for international funds.',
    registration_link: 'https://fcraonline.nic.in/',
    orgTypes: ['ngo'],
    condition: (metrics) => metrics.hasForeignDonations
  },

  // --- STUDENT UNION SPECIFIC COMPLIANCE ---
  {
    id: 'lyngdoh_committee_compliance',
    title: 'Lyngdoh Committee Electoral Compliance',
    category: 'Campus Election Norms',
    description: 'Strict adherence to Supreme Court Lyngdoh norms: expenditure cap ₹5,000 per candidate, age limits, and 75% attendance.',
    registration_link: 'https://www.ugc.gov.in/',
    orgTypes: ['student_union'],
    condition: () => true
  },
  {
    id: 'anti_ragging_undertaking',
    title: 'UGC Anti-Ragging Cell & Affidavit Registry',
    category: 'Student Safety',
    description: 'Mandatory annual online anti-ragging undertakings and constitution of Anti-Ragging Squad.',
    registration_link: 'https://www.antiragging.in/',
    orgTypes: ['student_union'],
    condition: () => true
  },
  {
    id: 'campus_constitution_charter',
    title: 'Student Union Constitution & By-Laws',
    category: 'Governance',
    description: 'Dean of Students Welfare (DSW) approved Union Charter outlining democratic representation norms.',
    orgTypes: ['student_union'],
    condition: (metrics) => metrics.memberCount >= 5
  },

  // --- WORKERS UNION SPECIFIC COMPLIANCE ---
  {
    id: 'trade_union_act_registration',
    title: 'Trade Unions Act 1926 Registration (Form B)',
    category: 'Statutory Registration',
    description: 'Official Certificate of Registration from the State Registrar of Trade Unions.',
    registration_link: 'https://labour.gov.in/',
    orgTypes: ['workers_union'],
    condition: () => true
  },
  {
    id: 'annual_return_form_h',
    title: 'Annual General Return (Form H)',
    category: 'Annual Regulatory Filing',
    description: 'Mandatory annual audit return of assets, liabilities, and audited member subscription records.',
    registration_link: 'https://labour.gov.in/',
    orgTypes: ['workers_union'],
    condition: (metrics) => metrics.memberCount > 0
  },
  {
    id: 'labour_welfare_fund',
    title: 'State Labour Welfare Fund Statement',
    category: 'Worker Welfare',
    description: 'Statutory bi-annual contribution filing under State Labour Welfare Fund Act.',
    registration_link: 'https://labour.gov.in/',
    orgTypes: ['workers_union'],
    condition: (metrics) => metrics.memberCount >= 10
  },

  // --- RESIDENTS WELFARE ASSOCIATION (RWA) SPECIFIC COMPLIANCE ---
  {
    id: 'societies_registration_act',
    title: 'Societies Registration Act / Apartment Ownership By-Laws',
    category: 'Legal Registration',
    description: 'Registered memorandum of association and model by-laws for residential society governance.',
    orgTypes: ['rwa'],
    condition: () => true
  },
  {
    id: 'fire_safety_lift_noc',
    title: 'Fire Safety NOC & Lift Inspection Certificate',
    category: 'Safety & Infrastructure',
    description: 'Annual Fire Department clearance certificate and statutory lift inspection compliance.',
    orgTypes: ['rwa'],
    condition: () => true
  },
  {
    id: 'rwa_agm_filing',
    title: 'Annual General Body Meeting (AGM) Minutes & Audit',
    category: 'Statutory Filing',
    description: 'Submission of annual audited financial statement and elected managing committee list to Sub-Registrar.',
    orgTypes: ['rwa'],
    condition: (metrics) => metrics.memberCount >= 5
  },

  // --- EMPLOYMENT & TAX ---
  {
    id: 'gst_registration',
    title: 'GST Registration',
    category: 'Indirect Tax',
    description: 'Goods and Services Tax registration for commercial activities or paid ticketed cultural events.',
    registration_link: 'https://www.gst.gov.in/',
    orgTypes: ['all'],
    condition: (metrics) => metrics.hasPaidTickets
  },
  {
    id: 'epf_esi',
    title: 'EPF & ESI Social Security Registration',
    category: 'Labour & Employment',
    description: 'Employees Provident Fund and Employee State Insurance for payroll staff exceeding 20 persons.',
    registration_link: 'https://www.epfindia.gov.in/',
    orgTypes: ['all'],
    condition: (metrics) => metrics.memberCount >= 20
  }
]
