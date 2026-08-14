export type LegalEntityType =
  // For ngo
  | 'society'           // Societies Registration Act 1860
  | 'trust'             // Indian Trusts Act 1882 / State Trust Acts
  | 'section_8_company' // Companies Act 2013, Section 8
  // For workers_union
  | 'registered_trade_union'  // Trade Unions Act 1926
  | 'informal_collective'     // Unregistered gig worker / informal group
  // For rwa
  | 'registered_society'      // Societies Registration Act
  | 'cooperative_housing'     // State Cooperative Housing Acts
  | 'apartment_association'   // State Apartment Ownership Acts
  // For student_union
  | 'university_body'         // Constituted under university statute
  | 'independent_front'       // Independent student organization (may be society)
  // For civic_collective
  | 'unregistered'            // No legal registration
  | 'bqf_recognized'          // BQF Section 8 umbrella recognition

export type StatutoryIdType =
  | 'pan' | 'tan' | 'gstin' | 'cin' | 'llpin'
  | 'darpan_uid' | 'certificate_12a' | 'certificate_80g'
  | 'fcra_registration' | 'csr_registration'
  | 'eci_registration' // Not used currently, but ready
  | 'trade_union_registration' | 'cooperative_registration'
  | 'society_registration' | 'trust_registration'
  | 'epfo_code' | 'esic_code' | 'udyam_registration'
  | 'aishe_code' | 'udise_code' | 'lgd_code'

// Mapping: which legal entity types are valid for each org type
export const VALID_LEGAL_TYPES: Record<string, LegalEntityType[]> = {
  ngo: ['society', 'trust', 'section_8_company'],
  workers_union: ['registered_trade_union', 'informal_collective'],
  rwa: ['registered_society', 'cooperative_housing', 'apartment_association'],
  student_union: ['university_body', 'independent_front'],
  civic_collective: ['unregistered', 'bqf_recognized'],
}

// Mapping: which statutory IDs are applicable per legal entity type
export const REQUIRED_STATUTORY_IDS: Record<LegalEntityType, StatutoryIdType[]> = {
  society: ['pan', 'cin', 'society_registration', 'darpan_uid'],
  trust: ['pan', 'darpan_uid', 'certificate_12a', 'certificate_80g'],
  'section_8_company': ['pan', 'tan', 'gstin', 'cin', 'llpin', 'udaam_registration'],
  'registered_trade_union': ['pan', 'trade_union_registration', 'epfo_code', 'esic_code'],
  'informal_collective': ['pan'],
  'registered_society': ['pan', 'society_registration', 'darpan_uid'],
  'cooperative_housing': ['pan', 'cin', 'cooperative_registration', 'esic_code'],
  'apartment_association': ['pan', 'cin'],
  'university_body': ['pan', 'lgd_code', 'aishe_code'],
  'independent_front': ['pan', 'darpan_uid'],
  'unregistered': ['pan'],
  'bqf_recognized': ['pan', 'cin', 'darpan_uid'],
}

// Regex patterns for validating statutory IDs
export const STATUTORY_ID_PATTERNS: Record<StatutoryIdType, RegExp> = {
  pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  tan: /^[A-Z]{4}[0-9]{7}$/,
  gstin: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[Z]{1}$/,
  cin: /^[A-Z]{5}[0-9]{6}$/,
  llpin: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  darpan_uid: /^[A-Z]{2}[0-9]{8}$/,
  certificate_12a: /^12[A-Z0-9]{6}$/,
  certificate_80g: /^80G[A-Z0-9]{6}$/,
  fcra_registration: /^FCRA[0-9]{6,10}$/,
  csr_registration: /^CSR-[0-9]{7}$/,
  eci_registration: /^ECI-[0-9]{8}$/,
  trade_union_registration: /^TU-[0-9]{6,10}$/,
  cooperative_registration: /^COOP-[0-9]{6,10}$/,
  society_registration: /^SOC-[0-9]{6,10}$/,
  trust_registration: /^TRUST-[0-9]{6,10}$/,
  epfo_code: /^EPFO[A-Z]{2}[0-9]{8}$/,
  esic_code: /^ESIC[A-Z]{2}[0-9]{8}$/,
  udyam_registration: /^UDYAM[A-Z0-9]{12}$/,
  aishe_code: /^AISHE[A-Z0-9]{8}$/,
  udise_code: /^UDISE[0-9]{10}$/,
  lgd_code: /^LGD-[A-Z]{2}[0-9]{6}$/,
}

// Validate statutory ID format using regex patterns
export function validateStatutoryId(idType: StatutoryIdType, value: string): boolean {
  const pattern = STATUTORY_ID_PATTERNS[idType]
  if (!pattern) return false
  return pattern.test(value)
}

// Government portal links per statutory ID type
export const GOVT_PORTAL_LINKS: Record<StatutoryIdType, string> = {
  pan: 'https://www.incometax.gov.in/iec/foportal/',
  tan: 'https://www.incometax.gov.in/iec/foportal/',
  gstin: 'https://www.gst.gov.in/',
  cin: 'https://www.mca.gov.in/',
  llpin: 'https://www.mca.gov.in/',
  darpan_uid: 'https://ngodarpan.gov.in/',
  certificate_12a: 'https://www.incometax.gov.in/iec/foportal/',
  certificate_80g: 'https://www.incometax.gov.in/iec/foportal/',
  fcra_registration: 'https://fcraonline.nic.in/',
  csr_registration: 'https://www.mca.gov.in/',
  eci_registration: 'https://www.mca.gov.in/',
  trade_union_registration: 'https://labour.gov.in/',
  cooperative_registration: 'https://cooperative.gov.in/',
  society_registration: 'https://ros.gov.in/',
  trust_registration: 'https://charitycommissioner.gov.in/',
  epfo_code: 'https://unified-members-epfindia.gov.in/',
  esic_code: 'https://www.esic.nic.in/',
  udyam_registration: 'https://udyam-registrations.gov.in/',
  aishe_code: 'https://aishe.gov.in/',
  udise_code: 'https://udiseplus.gov.in/',
  lgd_code: 'https://lgd.gov.in/',
}