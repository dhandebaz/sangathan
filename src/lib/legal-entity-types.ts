export type LegalEntityType =
  // For ngo
  | 'society'           // Societies Registration Act 1860
  | 'trust'             // Indian Trusts Act 1882 / State Trust Acts
  | 'section_8_company' // Companies Act 2013, Section 8
  // For civic_collective
  | 'unregistered'            // No legal registration
  | 'bqf_recognized'          // BQF Section 8 umbrella recognition

export type StatutoryIdType =
  | 'pan' | 'tan' | 'gstin' | 'cin' | 'llpin'
  | 'darpan_uid' | 'certificate_12a' | 'certificate_80g'
  | 'fcra_registration' | 'csr_registration'
  | 'eci_registration' // Not used currently, but ready
  | 'cooperative_registration'
  | 'society_registration' | 'trust_registration'
  | 'epfo_code' | 'esic_code' | 'udyam_registration'
  | 'aishe_code' | 'udise_code' | 'lgd_code'

// Mapping: which legal entity types are valid for each org type
export const VALID_LEGAL_TYPES: Record<string, LegalEntityType[]> = {
  ngo: ['society', 'trust', 'section_8_company'],
  civic_collective: ['unregistered', 'bqf_recognized'],
}

// Display metadata for legal entity types
export const LEGAL_ENTITY_TYPE_CONFIG: Record<
  LegalEntityType,
  { en: string; hi: string; lawEn: string; lawHi: string }
> = {
  society: { en: 'Registered Society', hi: 'पंजीकृत सोसाइटी', lawEn: 'Societies Registration Act, 1860', lawHi: 'सोसाइटी पंजीकरण अधिनियम, 1860' },
  trust: { en: 'Public Charitable Trust', hi: 'सार्वजनिक धर्मार्थ ट्रस्ट', lawEn: 'Indian Trusts Act, 1882', lawHi: 'भारतीय ट्रस्ट अधिनियम, 1882' },
  section_8_company: { en: 'Section 8 Non-Profit Company', hi: 'धारा 8 गैर-लाभकारी कंपनी', lawEn: 'Companies Act, 2013 (Section 8)', lawHi: 'कंपनी अधिनियम, 2013 (धारा 8)' },
  unregistered: { en: 'Informal Grassroots Collective', hi: 'अनौपचारिक नागरिक समूह', lawEn: 'Constitution of India — Article 19(1)(c)', lawHi: 'भारत का संविधान — अनुच्छेद 19(1)(c)' },
  bqf_recognized: { en: 'BQF Section 8 Umbrella Recognized', hi: 'BQF धारा 8 मान्यता प्राप्त समूह', lawEn: 'Bahujan Queer Foundation Section 8 Umbrella', lawHi: 'बहुजन क्वीयर फाउंडेशन धारा 8 छत्र मान्यता' },
}

// Mapping: which statutory IDs are applicable per legal entity type
export const REQUIRED_STATUTORY_IDS: Record<LegalEntityType, StatutoryIdType[]> = {
  society: ['pan', 'cin', 'society_registration', 'darpan_uid'],
  trust: ['pan', 'darpan_uid', 'certificate_12a', 'certificate_80g'],
  'section_8_company': ['pan', 'tan', 'gstin', 'cin', 'llpin', 'udyam_registration'],
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

// DB column, display label, and example format per statutory ID type
export const STATUTORY_ID_CONFIG: Record<
  StatutoryIdType,
  { dbColumn: string; en: string; example: string }
> = {
  pan: { dbColumn: 'tax_id', en: 'PAN', example: 'ABCDE1234F' },
  tan: { dbColumn: 'tan', en: 'TAN', example: 'DELC1234567' },
  gstin: { dbColumn: 'gstin', en: 'GSTIN', example: '27ABCDE1234F1Z5' },
  cin: { dbColumn: 'cin', en: 'CIN', example: 'ABCDE123456' },
  llpin: { dbColumn: 'llpin', en: 'LLPIN', example: 'ABCDE1234F' },
  darpan_uid: { dbColumn: 'darpan_id', en: 'NGO Darpan UID', example: 'UP20123456' },
  certificate_12a: { dbColumn: 'certificate_12a', en: 'Section 12A Certificate', example: '12ABC789' },
  certificate_80g: { dbColumn: 'certificate_80g', en: 'Section 80G Certificate', example: '80GABC123' },
  fcra_registration: { dbColumn: 'fcra_registration', en: 'FCRA Registration', example: 'FCRA123456' },
  csr_registration: { dbColumn: 'csr_registration', en: 'CSR Registration', example: 'CSR-1234567' },
  eci_registration: { dbColumn: 'eci_registration', en: 'ECI Registration', example: 'ECI-12345678' },
  cooperative_registration: { dbColumn: 'cooperative_registration', en: 'Cooperative Registration', example: 'COOP-123456' },
  society_registration: { dbColumn: 'society_registration', en: 'Society Registration', example: 'SOC-123456' },
  trust_registration: { dbColumn: 'trust_registration', en: 'Trust Registration', example: 'TRUST-123456' },
  epfo_code: { dbColumn: 'epfo_code', en: 'EPFO Code', example: 'EPFODL12345678' },
  esic_code: { dbColumn: 'esic_code', en: 'ESIC Code', example: 'ESICDL12345678' },
  udyam_registration: { dbColumn: 'udyam_registration', en: 'Udyam Registration', example: 'UDYAM12AB34CD' },
  aishe_code: { dbColumn: 'aishe_code', en: 'AISHE Code', example: 'AISHE12AB34' },
  udise_code: { dbColumn: 'udise_code', en: 'UDISE Code', example: 'UDISE1234567890' },
  lgd_code: { dbColumn: 'lgd_code', en: 'LGD Code', example: 'LGD-DL123456' },
}