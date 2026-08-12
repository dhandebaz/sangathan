/**
 * Municipal Letter Templates for Colony/RWA Representations
 * 
 * Common pre-formatted letters used by RWAs and colony associations
 * when writing to elected representatives and civic agencies.
 */

export interface MunicipalLetterTemplate {
  id: string
  /** Display category for grouping */
  category: 'elected_representative' | 'municipal_civic' | 'utility' | 'police' | 'revenue'
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

The poor road conditions are causing:
- Frequent vehicle breakdowns and tyre punctures
- Injury risks for pedestrians, especially during night hours
- Ambulance and fire tender access difficulty in emergencies
- Property value depreciation in the area

We request you to kindly allocate ward development funds for:
(a) Re-surfacing of the main colony road
(b) Repair of broken gali patches
(c) Installation of proper interlocking tiles in narrow galis where road-roller access is not possible

A delegation of residents is available to accompany you for a site inspection at your convenience.

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

This is to bring to your notice that the daily garbage collection service in ________ Colony has been severely irregular for the past ________ days/weeks.

Issues observed:
1. The garbage collection vehicle (ठेला/ट्रक) has not visited Gali No. ________ since ________
2. Community dustbin at ________ Chowk is overflowing and creating health hazard
3. Stray cattle and dogs are scattering garbage across the streets
4. Segregated waste (wet/dry) collection is not being followed despite rules

We have registered complaints on the 311 helpline (Reference No. ________) but the situation remains unchanged.

We request:
(a) Resumption of daily door-to-door garbage pickup
(b) Replacement of damaged community dustbins
(c) Regular sweeping of colony roads and galis
(d) Action against the contractor if collection norms are being violated

Kindly treat this as urgent and depute your team for immediate resolution.

Yours faithfully,`,
    signatory1: 'President, RWA',
    signatory2: 'General Secretary, RWA',
    refPrefix: 'RWA/MCD',
  },
  {
    id: 'mcd_encroachment',
    category: 'municipal_civic',
    title: 'Encroachment Removal Request to MCD',
    titleHi: 'MCD को अतिक्रमण हटाने का अनुरोध',
    description: 'Request removal of illegal encroachments blocking colony roads and drains.',
    recipient: 'To,\nThe Zonal Deputy Commissioner / Anti-Encroachment Cell,\nMCD Zone ________,\nMunicipal Corporation of Delhi',
    subject: 'REQUEST FOR REMOVAL OF ILLEGAL ENCROACHMENTS IN ________ COLONY',
    body: `Sir/Madam,

We wish to draw your attention to the growing menace of illegal encroachments in ________ Colony that are obstructing public pathways and emergency access routes.

Specific encroachments:
1. Illegal construction/extension at House No. ________, Gali No. ________: blocking drain
2. Unauthorized vendor stalls at ________ Chowk: obstructing pedestrian movement
3. Construction material dumped on public road near ________: blocking fire tender access
4. Unauthorized parking of commercial vehicles at ________

These encroachments are in violation of MCD building bylaws and are causing:
- Narrowing of already tight galis, making emergency vehicle access impossible
- Drain blockage leading to waterlogging
- Traffic congestion and safety hazards

We request an anti-encroachment drive and survey of the above locations.

Yours faithfully,`,
    signatory1: 'President, RWA',
    signatory2: 'General Secretary, RWA',
    refPrefix: 'RWA/ENC',
  },
  // --- Utilities ---
  {
    id: 'bses_transformer',
    category: 'utility',
    title: 'Transformer Overload / Power Failure to BSES',
    titleHi: 'BSES को ट्रांसफार्मर ओवरलोड / बिजली कटौती शिकायत',
    description: 'Complaint about frequent power cuts due to overloaded transformer or faulty wiring.',
    recipient: 'To,\nThe Executive Engineer / SDO,\nBSES Rajdhani Power Ltd. / BSES Yamuna Power Ltd.,\n________ Division, ________ Sub-Division,\nNew Delhi',
    subject: 'URGENT: FREQUENT POWER FAILURES & TRANSFORMER OVERLOAD IN ________ COLONY',
    body: `Sir/Madam,

The residents of ________ Colony are facing severe hardship due to frequent and prolonged power failures.

Details of the problem:
1. Colony transformer (Pole No./ID: ________) is severely overloaded
2. Power tripping occurs ________ times daily, especially between ________ PM to ________ PM
3. Low voltage issue affecting ________ houses in Gali No. ________
4. Exposed/hanging wires near ________ pose electrocution risk

Previous complaints:
- BSES Complaint No. ________  dated ________
- 19123/19122 Helpline complaint dated ________

We request:
(a) Immediate inspection of the colony transformer and augmentation if overloaded
(b) Replacement of faulty/hanging wires
(c) Installation of new transformer if the colony load exceeds existing capacity
(d) Written update on resolution timeline

This is a life-safety issue and requires urgent attention.

Yours faithfully,`,
    signatory1: 'President, RWA',
    signatory2: 'General Secretary, RWA',
    refPrefix: 'RWA/BSES',
  },
  {
    id: 'djb_water_supply',
    category: 'utility',
    title: 'Irregular Water Supply to DJB',
    titleHi: 'DJB को अनियमित जल आपूर्ति शिकायत',
    description: 'Complaint about insufficient or irregular water supply and tanker requests.',
    recipient: 'To,\nThe Executive Engineer,\nDelhi Jal Board (DJB),\n________ Water Supply Zone,\nDelhi Jal Board, New Delhi',
    subject: 'REPRESENTATION REGARDING IRREGULAR WATER SUPPLY IN ________ COLONY',
    body: `Sir/Madam,

The residents of ________ Colony are facing acute water shortage. We respectfully submit the following:

Current situation:
1. Pipeline water supply timing: Only ________ minutes per day (morning ________ AM)
2. Water pressure is extremely low in Gali No. ________ (upper floors get no water)
3. No supply received on the following dates: ________
4. DJB tanker was requested but arrived ________ days late / has not arrived

Impact on residents:
- ________ families (approx. ________ persons) are affected
- Senior citizens and families with infants are in severe distress
- Residents are forced to purchase private tankers at ₹________ per tanker

Previous complaints:
- DJB 1916 Complaint No. ________ dated ________

We request:
(a) Restoration of regular pipeline water supply for minimum 2 hours daily
(b) Emergency DJB tanker deployment (2 tankers per day until supply is restored)
(c) Inspection of the feeder pipeline for leakage/theft
(d) Installation of a new bore-well/tube-well if the area is chronic water-scarce

Yours faithfully,`,
    signatory1: 'President, RWA',
    signatory2: 'General Secretary, RWA',
    refPrefix: 'RWA/DJB',
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

We, the residents of ________ Colony, under the jurisdiction of PS ________, wish to bring to your attention the deteriorating law and order situation in our locality.

Recent incidents:
1. ________ (Date: ________): Theft/chain snatching/eve teasing near ________
2. ________ (Date: ________): Suspicious persons/vehicles noticed at night
3. Anti-social elements gathering near ________ causing nuisance

Current security gaps:
- No beat constable visits at night (last visit: ________)
- Streetlights non-functional in Gali No. ________
- No CCTV coverage in colony entry/exit points
- Unauthorized liquor/gambling dens reported near ________

We request:
(a) Regular night patrolling by beat constable (PCR/motorcycle)
(b) Installation of police help booth / patrolling point
(c) Community policing meeting with residents
(d) Action against known troublemakers in the area

We assure full cooperation from the residents and RWA.

With regards,`,
    signatory1: 'President, RWA',
    signatory2: 'General Secretary, RWA',
    refPrefix: 'RWA/PS',
  },
  // --- Revenue / Land ---
  {
    id: 'sdm_unauthorized_colony',
    category: 'revenue',
    title: 'Basic Services Request for Unauthorized Colony to SDM',
    titleHi: 'SDM को अनधिकृत कॉलोनी में बुनियादी सेवा अनुरोध',
    description: 'Request basic civic amenities for unauthorized/JJ colonies under Delhi government regularization.',
    recipient: 'To,\nThe Sub-Divisional Magistrate (SDM),\n________ Sub-Division,\nRevenue Department, Govt. of NCT of Delhi',
    subject: 'REQUEST FOR PROVISION OF BASIC CIVIC AMENITIES IN ________ COLONY (UNAUTHORIZED COLONY LIST S. No. ________)',
    body: `Respected Sir/Madam,

________ Colony falls under the list of unauthorized colonies identified by the Delhi Government for regularization under the PM-UDAY scheme / DUSIB notification.

Despite being on the regularization list (S. No. ________), our colony still lacks basic civic amenities:

1. No pucca (concrete) internal roads (only kaccha paths)
2. No proper sewer line (open drains causing health hazards)
3. Irregular DJB water supply (dependency on private borewells)
4. No community toilet complex (required for ________ families without individual toilets)
5. No functioning streetlights
6. No MCD garbage collection

Affected population: Approx. ________ families (________ persons)

We request your kind intervention under the provisions of:
- Delhi Government's regularization policy for unauthorized colonies
- PM-UDAY (Unauthorized Colonies in Delhi Awas Adhikar Yojana)
- DUSIB (Delhi Urban Shelter Improvement Board) welfare schemes

Specifically, we request:
(a) Survey and mapping of the colony for regularization processing
(b) Interim provision of DJB tanker service and community water point
(c) Construction of pucca drain and sewer connection
(d) Installation of solar/LED streetlights

Yours faithfully,`,
    signatory1: 'President, Colony Welfare Association',
    signatory2: 'General Secretary',
    refPrefix: 'CWA/SDM',
  },
]

/**
 * Get templates grouped by category
 */
export function getTemplatesByCategory() {
  const categories: Record<string, { label: string; labelHi: string; icon: string; templates: MunicipalLetterTemplate[] }> = {
    elected_representative: { label: 'Elected Representatives', labelHi: 'निर्वाचित प्रतिनिधि', icon: 'Landmark', templates: [] },
    municipal_civic: { label: 'Municipal & Civic Services', labelHi: 'नगर निगम एवं नागरिक सेवाएं', icon: 'Building2', templates: [] },
    utility: { label: 'Utility Companies', labelHi: 'बिजली एवं जल बोर्ड', icon: 'Zap', templates: [] },
    police: { label: 'Police & Security', labelHi: 'पुलिस एवं सुरक्षा', icon: 'Shield', templates: [] },
    revenue: { label: 'Revenue & Land', labelHi: 'राजस्व एवं भूमि', icon: 'MapPin', templates: [] },
  }

  for (const template of MUNICIPAL_LETTER_TEMPLATES) {
    categories[template.category]?.templates.push(template)
  }

  return categories
}
