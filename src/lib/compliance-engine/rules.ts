export type ComplianceRule = {
  id: string
  title: string
  category: string
  description: string
  registration_link?: string
  orgTypes: string[] // 'all', 'ngo', 'club', 'business'
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
  {
    id: 'pan_card',
    title: 'PAN Card Registration',
    category: 'Tax',
    description: 'Permanent Account Number for tax identity. Required for all entities.',
    registration_link: 'https://www.incometax.gov.in/iec/foportal/',
    orgTypes: ['all'],
    condition: (metrics) => true // Basic requirement, triggers immediately or on first member
  },
  {
    id: 'registration_deed',
    title: 'Deed / Society Registration',
    category: 'Legal',
    description: 'Official registration document of the organization.',
    registration_link: 'https://ngodarpan.gov.in/',
    orgTypes: ['ngo', 'club'],
    condition: (metrics) => true 
  },
  {
    id: '12a_80g',
    title: '12A & 80G Registration',
    category: 'Tax Exemption',
    description: 'Provides tax exemption to the NGO and tax deductions for donors.',
    registration_link: 'https://www.incometax.gov.in/iec/foportal/',
    orgTypes: ['ngo'],
    condition: (metrics) => metrics.totalDonations > 0 // Unlocks when they start getting donations
  },
  {
    id: 'fcra',
    title: 'FCRA Registration',
    category: 'Foreign Contributions',
    description: 'Required to receive foreign donations under the Foreign Contribution Regulation Act.',
    registration_link: 'https://fcraonline.nic.in/',
    orgTypes: ['ngo'],
    condition: (metrics) => metrics.hasForeignDonations // Unlocks if foreign donations flag is true
  },
  {
    id: 'gst_registration',
    title: 'GST Registration',
    category: 'Tax',
    description: 'Goods and Services Tax registration for selling goods or paid event tickets.',
    registration_link: 'https://www.gst.gov.in/',
    orgTypes: ['all'],
    condition: (metrics) => metrics.hasPaidTickets // Unlocks if selling tickets
  },
  {
    id: 'epf_esi',
    title: 'EPF & ESI Registration',
    category: 'Labour',
    description: 'Provident Fund and Employee State Insurance for staff.',
    registration_link: 'https://www.epfindia.gov.in/',
    orgTypes: ['all'],
    condition: (metrics) => metrics.memberCount > 19 // Typically requires 20+ members/staff
  }
]
