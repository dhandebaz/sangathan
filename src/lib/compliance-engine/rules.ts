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
  legalEntityType?: string | null
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
  },

  // --- LEGAL ENTITY TYPE-SPECIFIC COMPLIANCE ---
  {
    id: 'section_8_mca_aoc4',
    title: 'MCA Annual Filing — Form AOC-4 (Financial Statements)',
    category: 'MCA Compliance',
    description: 'Section 8 Companies must file annual financial statements with the Registrar of Companies (MCA) within 30 days of AGM.',
    registration_link: 'https://www.mca.gov.in/',
    orgTypes: ['ngo'],
    condition: (metrics) => metrics.legalEntityType === 'section_8_company'
  },
  {
    id: 'section_8_mca_mgt7',
    title: 'MCA Annual Return — Form MGT-7',
    category: 'MCA Compliance',
    description: 'Section 8 Companies must file annual return within 60 days of AGM with Registrar of Companies.',
    registration_link: 'https://www.mca.gov.in/',
    orgTypes: ['ngo'],
    condition: (metrics) => metrics.legalEntityType === 'section_8_company'
  },
  {
    id: 'section_8_dir3_kyc',
    title: 'Director KYC — Form DIR-3 KYC',
    category: 'MCA Compliance',
    description: 'All directors of Section 8 Companies must file annual KYC with MCA by September 30.',
    registration_link: 'https://www.mca.gov.in/',
    orgTypes: ['ngo'],
    condition: (metrics) => metrics.legalEntityType === 'section_8_company'
  },
  {
    id: 'trust_charity_commissioner_return',
    title: 'Charity Commissioner Annual Return',
    category: 'Statutory Filing',
    description: 'Public Charitable Trusts must file annual change report with the state Charity Commissioner.',
    orgTypes: ['ngo'],
    condition: (metrics) => metrics.legalEntityType === 'trust'
  },
  {
    id: 'society_ros_annual_list',
    title: 'Annual List of Managing Committee (Form V)',
    category: 'Statutory Filing',
    description: 'Registered Societies must file annual list of managing committee members with the Registrar of Societies within 14 days of AGM.',
    orgTypes: ['ngo'],
    condition: (metrics) => metrics.legalEntityType === 'society'
  },
  {
    id: 'cooperative_statutory_audit',
    title: 'Cooperative Society Statutory Audit',
    category: 'Statutory Audit',
    description: 'Cooperative Housing Societies must undergo annual statutory audit by a panel auditor appointed by the Registrar of Cooperative Societies.',
    orgTypes: ['rwa'],
    condition: (metrics) => metrics.legalEntityType === 'cooperative_housing'
  },
  // Additional legal entity type rules
  {
    id: 'society_ros_managing_committee',
    title: 'Registrar of Societies — Annual Managing Committee List',
    category: 'Statutory Filing',
    description: 'Registered Societies must file annual list of managing committee members with the Registrar of Societies within 14 days of AGM.',
    orgTypes: ['ngo'],
    condition: (metrics) => metrics.legalEntityType === 'society'
  },
  {
    id: 'trust_annual_change_report',
    title: 'Charity Commissioner — Annual Change Report',
    category: 'Statutory Filing',
    description: 'Public Charitable Trusts must file annual change report with the state Charity Commissioner.',
    orgTypes: ['ngo'],
    condition: (metrics) => metrics.legalEntityType === 'trust'
  },
  {
    id: 'cooperative_annual_audit',
    title: 'Cooperative Society — Annual Statutory Audit',
    category: 'Statutory Audit',
    description: 'Cooperative Housing Societies must undergo annual statutory audit by a panel auditor appointed by the Registrar of Cooperative Societies.',
    orgTypes: ['rwa'],
    condition: (metrics) => metrics.legalEntityType === 'cooperative_housing'
  },
  {
    id: 'apartment_association_annual_list',
    title: 'Apartment Association — Annual Member List',
    category: 'Statutory Filing',
    description: 'Apartment Associations must file annual list of unit owners with the Registrar under State Apartment Ownership Acts.',
    orgTypes: ['rwa'],
    condition: (metrics) => metrics.legalEntityType === 'apartment_association'
  },
  {
    id: 'trade_union_form_b',
    title: 'Trade Unions Act — Form B Registration',
    category: 'Statutory Registration',
    description: 'Initial registration certificate filed with the State Registrar of Trade Unions under Section 5 of the Trade Unions Act 1926.',
    orgTypes: ['workers_union'],
    condition: (metrics) => metrics.legalEntityType === 'registered_trade_union'
  },
  {
    id: 'trade_union_annual_return',
    title: 'Trade Unions Act — Annual Return',
    category: 'Statutory Filing',
    description: 'Annual return of income and expenditure filed with the State Registrar of Trade Unions.',
    orgTypes: ['workers_union'],
    condition: (metrics) => metrics.legalEntityType === 'registered_trade_union'
  },
  {
    id: 'university_constitution_compliance',
    title: 'University Statute Compliance',
    category: 'Governance',
    description: ' adherence to university statutes governing student union elections, representation, and financial oversight.',
    orgTypes: ['student_union'],
    condition: (metrics) => metrics.legalEntityType === 'university_body'
  },
  {
    id: 'independent_student_org_darpan',
    title: 'NITI Aayog NGO Darpan Registration (Independent Front)',
    category: 'Legal & Grants',
    description: 'Unique Darpan ID issued by NITI Aayog required for government grant applications and CSR eligibility for independent student fronts.',
    orgTypes: ['student_union'],
    condition: (metrics) => metrics.legalEntityType === 'independent_front'
  }
]
