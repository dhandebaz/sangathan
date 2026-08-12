/**
 * Municipal & Government Representation Templates
 * 
 * Official pre-formatted letters used by RWAs, Civic Collectives, BQF Recognized Groups,
 * Workers Unions, and Student Unions when writing to Indian government authorities.
 */

export interface MunicipalLetterTemplate {
  id: string
  /** Display category for grouping */
  category: 'elected_representative' | 'municipal_civic' | 'utility' | 'police' | 'revenue' | 'bqf_official' | 'labour_rights' | 'student_campus'
  /** Template title shown in UI */
  title: string
  /** Hindi title */
  titleHi: string
  /** Brief description */
  description: string
  /** Default recipient block */
  recipient: string
  /** Default subject line */
  subject: string
  /** Default letter body */
  body: string
  /** Left signatory default title */
  signatory1: string
  /** Right signatory default title */
  signatory2: string
  /** Reference number prefix */
  refPrefix: string
}

export const MUNICIPAL_LETTER_TEMPLATES: MunicipalLetterTemplate[] = [
  // --- BQF Official Civic Representations ---
  {
    id: 'bqf_civic_representation',
    category: 'bqf_official',
    title: 'BQF Official Recognized Collective Civic Representation',
    titleHi: 'BQF मान्यता प्राप्त नागरिक मंच आधिकारिक प्रतिवेदन',
    description: 'Official representation under Bahujan Queer Foundation (CIN: U88900DL2025NPL452474) recognized civic collective status.',
    recipient: 'To,\nThe District Magistrate (DM) / Deputy Commissioner,\nOffice of District Magistrate, District ________,\nGovt. of NCT of Delhi / State Govt.',
    subject: 'OFFICIAL REPRESENTATION REGARDING PUBLIC INFRASTRUCTURE & DISCRIMINATION FREE CIVIC AMENITIES IN ________ AREA',
    body: `Respected Sir/Madam,

This official representation is submitted on behalf of ________, a grassroots civic collective recognized under the civic empowerment framework of BAHUJAN QUEER FOUNDATION (Section 8 NGO Registered in Delhi, CIN: U88900DL2025NPL452474).

We bring to your urgent attention the pressing civic issues affecting marginalized communities and local residents in ________ locality:

1. Lack of sanitation and basic public convenience facilities in Gali/Block ________
2. Inadequate streetlight illumination creating safety concerns for women, queer residents, and senior citizens
3. Delay in municipal repair works despite prior public representations

Constitutional & Statutory Rights Referenced:
- Article 21 of the Constitution of India (Right to Life & Clean Environment)
- Delhi Municipal Corporation Act / State Municipal Regulations

We request your office to:
(a) Order an immediate site inspection by the concerned Nodal Officer
(b) Issue directions to local civic bodies for immediate resolution within 14 working days
(c) Provide a copy of the Action Taken Report (ATR) to our collective

Thanking you.

Yours sincerely,`,
    signatory1: 'Lead Convener, Collective',
    signatory2: 'BQF Civic Nodal Representative',
    refPrefix: 'BQF/CIVIC',
  },

  // --- Elected Representatives ---
  {
    id: 'mla_drain_water',
    category: 'elected_representative',
    title: 'Drainage & Waterlogging Complaint to MLA',
    titleHi: 'विधायक को नाली एवं जलभराव शिकायत',
    description: 'Request MLA intervention for blocked drains and waterlogging during monsoon.',
    recipient: 'To,\nHon\'ble MLA (विधायक),\n________ Vidhan Sabha Constituency,\nDelhi Legislative Assembly, New Delhi',
    subject: 'URGENT REPRESENTATION REGARDING DRAINAGE BLOCKAGE & MONSOON WATERLOGGING IN ________ COLONY',
    body: `Respected Sir/Madam,

We, the residents of ________ Colony, ________ Ward, humbly bring to your kind attention the severe drainage and waterlogging crisis affecting our locality.

The main nali (drain) running through Gali No. ________ has been blocked for the past ________ weeks, causing sewage overflow and stagnant rainwater accumulation. This has resulted in:

1. Mosquito breeding and increased dengue/malaria risk
2. Damage to ground-floor houses and shops
3. Difficulty in commuting, especially for senior citizens and children
4. Unhygienic conditions and foul smell affecting daily life

Despite repeated verbal complaints to the local MCD Sanitary Inspector and calling the 311 helpline (Complaint No. ________), no concrete action has been taken.

We earnestly request your intervention to:
(a) Direct MCD to immediately desilt and clean the blocked drain
(b) Ensure permanent repair of the broken drain cover near House No. ________
(c) Arrange for anti-mosquito fogging in the affected galis

We trust in your leadership and request an early resolution.

With regards,`,
    signatory1: 'President, RWA',
    signatory2: 'General Secretary, RWA',
    refPrefix: 'RWA/MLA',
  },
  {
    id: 'parshad_road_repair',
    category: 'elected_representative',
    title: 'Road & Street Repair Request to Ward Councillor',
    titleHi: 'पार्षद को सड़क मरम्मत अनुरोध',
    description: 'Request Nigam Parshad to repair broken roads and potholes in colony streets.',
    recipient: 'To,\nShri/Smt. ________,\nHon\'ble Ward Councillor (निगम पार्षद),\nWard No. ________, MCD Zone ________,\nMunicipal Corporation of Delhi',
    subject: 'REQUEST FOR IMMEDIATE ROAD REPAIR & RE-SURFACING IN ________ COLONY',
    body: `Respected Parshad Ji,

The residents of ________ Colony respectfully submit this representation regarding the deplorable condition of internal colony roads and gali surfaces.

The following areas require urgent attention:

1. Main colony road from Gate No. ________ to ________: Multiple potholes causing accidents
2. Gali No. ________: Complete breakdown of road surface, waterlogging after rain
3. ________ Chowk: Broken speed breaker creating hazard for two-wheelers

The poor road conditions are causing vehicle breakdowns and pedestrian injury risks.

We request you to kindly allocate ward development funds for re-surfacing and patch repair.

With warm regards,`,
    signatory1: 'President, RWA',
    signatory2: 'General Secretary, RWA',
    refPrefix: 'RWA/PARSHAD',
  },

  // --- Municipal / Civic ---
  {
    id: 'mcd_garbage_collection',
    category: 'municipal_civic',
    title: 'Irregular Garbage Collection to MCD Zonal Office',
    titleHi: 'MCD क्षेत्रीय कार्यालय को अनियमित कूड़ा संग्रहण शिकायत',
    description: 'Complaint about missed garbage pickup and overflowing community dustbins.',
    recipient: 'To,\nThe Executive Engineer / Sanitary Inspector,\nMCD Zone ________, Ward No. ________,\n________ Zonal Office,\nMunicipal Corporation of Delhi',
    subject: 'COMPLAINT REGARDING IRREGULAR GARBAGE COLLECTION & OVERFLOWING DUSTBINS IN ________ COLONY',
    body: `Sir/Madam,

This is to bring to your notice that the daily garbage collection service in ________ Colony has been severely irregular for the past ________ days.

We request:
(a) Resumption of daily door-to-door garbage pickup
(b) Replacement of damaged community dustbins
(c) Regular sweeping of colony roads and galis

Kindly treat this as urgent.

Yours faithfully,`,
    signatory1: 'President, RWA',
    signatory2: 'General Secretary, RWA',
    refPrefix: 'RWA/MCD',
  },

  // --- Police ---
  {
    id: 'police_security',
    category: 'police',
    title: 'Security & Patrolling Request to SHO',
    titleHi: 'SHO को सुरक्षा व गश्त अनुरोध',
    description: 'Request police patrolling and security measures for the colony.',
    recipient: 'To,\nThe Station House Officer (SHO),\nPS ________ (Police Station),\nDelhi Police, New Delhi',
    subject: 'REQUEST FOR ENHANCED POLICE PATROLLING & SECURITY IN ________ COLONY',
    body: `Respected SHO Sahib,

We, the residents of ________ Colony, under the jurisdiction of PS ________, wish to bring to your attention the safety concerns in our locality.

We request regular night patrolling by beat constables and installation of a police patrolling point.

With regards,`,
    signatory1: 'President, RWA',
    signatory2: 'General Secretary, RWA',
    refPrefix: 'RWA/PS',
  },

  // --- Labour Rights ---
  {
    id: 'labour_wages_safety',
    category: 'labour_rights',
    title: 'Labour Commissioner Safety & Minimum Wage Representation',
    titleHi: 'श्रम आयुक्त को न्यूनतम मजदूरी एवं सुरक्षा प्रतिवेदन',
    description: 'Petition to Labour Department regarding safety equipment and wage compliance.',
    recipient: 'To,\nThe Deputy Labour Commissioner,\nOffice of the Labour Commissioner,\nGovernment of NCT of Delhi / State Govt.',
    subject: 'REPRESENTATION REGARDING SAFETY EQUIPMENT & TIMELY WAGE DISBURSEMENT FOR SANITATION WORKERS',
    body: `Respected Sir/Madam,

On behalf of ________ Union, we submit this urgent representation regarding non-compliance with statutory safety standards and wage delays under the Minimum Wages Act and Occupational Safety, Health and Working Conditions Code.

Demands:
1. Provision of mandatory PPE kits, masks, and boots for sanitation workers
2. Immediate release of pending wages for the months of ________
3. Health checkup camps and insurance enrollment

Yours faithfully,`,
    signatory1: 'President, Workers Union',
    signatory2: 'General Secretary',
    refPrefix: 'UNION/LABOUR',
  },

  // --- Student Campus ---
  {
    id: 'student_hostel_audit',
    category: 'student_campus',
    title: 'University Registrar Campus Hostel & Mess Infrastructure Representation',
    titleHi: 'कुलसचिव को छात्रावास एवं मेस ढांचागत प्रतिवेदन',
    description: 'Representation to University administration regarding hostel hygiene and mess facilities.',
    recipient: 'To,\nThe Registrar / Dean of Students Welfare (DSW),\n________ University / Institute,\nNew Delhi / Regional Campus',
    subject: 'REPRESENTATION REGARDING HOSTEL INFRASTRUCTURE, MESS HYGIENE & STUDENT SAFETY',
    body: `Respected Sir/Madam,

We, the elected representatives of ________ Student Union, bring to your attention pressing issues in Hostel No. ________:

1. Substandard food quality and lack of water purifiers in mess
2. Broken window panes and unmaintained washrooms
3. Demand for 24/7 library reading room access

We request a joint committee inspection within 3 days.

Sincerely,`,
    signatory1: 'President, Student Union',
    signatory2: 'General Secretary',
    refPrefix: 'STUDENT/DSW',
  },
]

/**
 * Get templates grouped by category
 */
export function getTemplatesByCategory() {
  const categories: Record<string, { label: string; labelHi: string; icon: string; templates: MunicipalLetterTemplate[] }> = {
    bqf_official: { label: 'BQF Recognized Civic Submissions', labelHi: 'BQF मान्यता प्राप्त प्रतिवेदन', icon: 'Shield', templates: [] },
    elected_representative: { label: 'Elected Representatives', labelHi: 'निर्वाचित प्रतिनिधि', icon: 'Landmark', templates: [] },
    municipal_civic: { label: 'Municipal & Civic Services', labelHi: 'नगर निगम एवं नागरिक सेवाएं', icon: 'Building2', templates: [] },
    utility: { label: 'Utility Companies', labelHi: 'बिजली एवं जल बोर्ड', icon: 'Zap', templates: [] },
    police: { label: 'Police & Security', labelHi: 'पुलिस एवं सुरक्षा', icon: 'Shield', templates: [] },
    revenue: { label: 'Revenue & Land', labelHi: 'राजस्व एवं भूमि', icon: 'MapPin', templates: [] },
    labour_rights: { label: 'Labour Rights & Unions', labelHi: 'श्रम अधिकार एवं यूनियन', icon: 'HardHat', templates: [] },
    student_campus: { label: 'Student Unions & Campus', labelHi: 'छात्र संघ एवं परिसर', icon: 'GraduationCap', templates: [] },
  }

  for (const template of MUNICIPAL_LETTER_TEMPLATES) {
    if (categories[template.category]) {
      categories[template.category].templates.push(template)
    } else {
      categories.municipal_civic.templates.push(template)
    }
  }

  return categories
}
