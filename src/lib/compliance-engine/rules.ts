export type ComplianceRule = {
  id: string
  title: string
  category: string
  description: string
  registration_link?: string
  orgTypes: string[] // 'all', 'ngo', 'civic_collective'
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
  }
]
