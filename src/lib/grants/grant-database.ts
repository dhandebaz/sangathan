// Curated Indian Government Schemes and CSR Opportunities Database

export interface GrantOpportunity {
  id: string
  title: string
  funderName: string
  funderType: 'government' | 'csr_corporate' | 'philanthropic_trust' | 'international_agency'
  focusAreas: string[]
  eligibleOrgTypes: string[]
  targetRegions: string[]
  maxFundingAmount: number
  deadline: string
  guidelinesSummary: string
  portalUrl: string
}

export const OPEN_GRANT_OPPORTUNITIES: GrantOpportunity[] = [
  {
    id: 'grant-icssr-2026',
    title: 'ICSSR Special Social Impact & Marginalized Communities Research Fund',
    funderName: 'Indian Council of Social Science Research (ICSSR)',
    funderType: 'government',
    focusAreas: ['Student Welfare', 'Labor Rights', 'Higher Education', 'Civic Research'],
    eligibleOrgTypes: ['student_union', 'ngo', 'academic_collective'],
    targetRegions: ['Pan-India', 'Delhi', 'Uttar Pradesh', 'Bihar', 'West Bengal'],
    maxFundingAmount: 1500000,
    deadline: '2026-11-30',
    guidelinesSummary: 'Funding for ground-level field surveys on campus accessibility, student mental health, and educational equity.',
    portalUrl: 'https://icssr.org/grants',
  },
  {
    id: 'grant-tata-2026',
    title: 'Tata Trusts Grassroots Community Development & Youth Empowerment Grant',
    funderName: 'Tata Trusts Philanthropy',
    funderType: 'csr_corporate',
    focusAreas: ['Youth Leadership', 'Civic Empowerment', 'Community Action', 'Vocational Skills'],
    eligibleOrgTypes: ['ngo', 'workers_union', 'student_union'],
    targetRegions: ['Pan-India', 'Maharashtra', 'Jharkhand', 'Odisha', 'Assam'],
    maxFundingAmount: 2500000,
    deadline: '2026-10-15',
    guidelinesSummary: 'Grants supporting grassroots community hubs, youth organizing, and skill building for informal sector youth.',
    portalUrl: 'https://tatatrusts.org/grants',
  },
  {
    id: 'grant-infosys-2026',
    title: 'Infosys Foundation Digital Inclusion & Tech Literacy Initiative',
    funderName: 'Infosys Foundation',
    funderType: 'csr_corporate',
    focusAreas: ['Digital Literacy', 'Student Technology Access', 'Education Equity'],
    eligibleOrgTypes: ['student_union', 'ngo'],
    targetRegions: ['Pan-India', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Delhi NCR'],
    maxFundingAmount: 2000000,
    deadline: '2026-12-31',
    guidelinesSummary: 'Equipping university hostels, rural student cells, and community learning centers with digital tools.',
    portalUrl: 'https://infosys.org/foundation',
  },
  {
    id: 'grant-azim-premji-2026',
    title: 'Azim Premji Philanthropic Initiatives - Grassroots Workers Support Fund',
    funderName: 'Azim Premji Philanthropic Initiatives',
    funderType: 'philanthropic_trust',
    focusAreas: ['Labor Welfare', 'Informal Worker Rights', 'Legal Aid', 'Emergency Relief'],
    eligibleOrgTypes: ['workers_union', 'ngo', 'labor_collective'],
    targetRegions: ['Pan-India', 'Rajasthan', 'Gujarat', 'Chhattisgarh', 'Karnataka'],
    maxFundingAmount: 5000000,
    deadline: '2026-11-15',
    guidelinesSummary: 'Multi-year capacity grant for unorganized worker collectives, legal aid desks, and social security mobilization.',
    portalUrl: 'https://azimpremjiphilanthropicinitiatives.org',
  },
  {
    id: 'grant-ugc-2026',
    title: 'UGC National Campus Welfare & Accessibility Improvement Scheme',
    funderName: 'University Grants Commission (UGC)',
    funderType: 'government',
    focusAreas: ['Campus Infrastructure', 'Hostel Mess Quality', 'Anti-Ragging Legal Desk'],
    eligibleOrgTypes: ['student_union'],
    targetRegions: ['Pan-India'],
    maxFundingAmount: 1000000,
    deadline: '2026-09-30',
    guidelinesSummary: 'Financial grants to student representative councils for campus accessibility audits and student welfare forums.',
    portalUrl: 'https://ugc.gov.in',
  },
]
