/**
 * Sangathan Domain-Specific Master Reference Datasets & Statutory Taxonomies
 * Pre-populated for NGOs and Civic Collectives.
 */

export interface MasterItem {
  id: string
  nameEn: string
  nameHi: string
  code?: string
  descriptionEn?: string
  descriptionHi?: string
  category?: string
}

// ==========================================
// 1. NGO & CIVIL SOCIETY MASTER DATA
// ==========================================

export const NGO_SDG_SECTORS: MasterItem[] = [
  { id: 'sdg-1', code: 'SDG-1', nameEn: 'No Poverty & Rural Livelihoods', nameHi: 'गरीबी उन्मूलन व ग्रामीण आजीविका', category: 'Social Welfare' },
  { id: 'sdg-2', code: 'SDG-2', nameEn: 'Zero Hunger & Food Security', nameHi: 'भुखमरी मुक्ति व खाद्य सुरक्षा', category: 'Basic Needs' },
  { id: 'sdg-3', code: 'SDG-3', nameEn: 'Good Health & Public Sanitation', nameHi: 'अच्छा स्वास्थ्य व सार्वजनिक स्वच्छता', category: 'Healthcare' },
  { id: 'sdg-4', code: 'SDG-4', nameEn: 'Quality Education & Skill Development', nameHi: 'गुणवत्तापूर्ण शिक्षा व कौशल विकास', category: 'Education' },
  { id: 'sdg-5', code: 'SDG-5', nameEn: 'Gender Equality & Women Empowerment', nameHi: 'लैंगिक समानता व महिला सशक्तिकरण', category: 'Rights' },
  { id: 'sdg-6', code: 'SDG-6', nameEn: 'Clean Water & Sanitation (WASH)', nameHi: 'स्वच्छ जल व स्वच्छता', category: 'Environment' },
  { id: 'sdg-8', code: 'SDG-8', nameEn: 'Decent Work & Artisan Support', nameHi: 'सम्मानजनक कार्य व कारीगर सहयोग', category: 'Livelihoods' },
  { id: 'sdg-10', code: 'SDG-10', nameEn: 'Reduced Inequalities & Tribal Rights', nameHi: 'असमानता में कमी व आदिवासी अधिकार', category: 'Rights' },
  { id: 'sdg-13', code: 'SDG-13', nameEn: 'Climate Action & Environmental Conservation', nameHi: 'जलवायु कार्रवाई व पर्यावरण संरक्षण', category: 'Environment' },
  { id: 'sdg-16', code: 'SDG-16', nameEn: 'Peace, Justice & Legal Aid', nameHi: 'शांति, न्याय व विधिक सहायता', category: 'Governance' },
]

export const NGO_LEGAL_STRUCTURES: MasterItem[] = [
  { id: 'trust', code: 'TRUST-1882', nameEn: 'Public Charitable Trust', nameHi: 'सार्वजनिक धर्मार्थ ट्रस्ट', descriptionEn: 'Governed by Indian Trusts Act 1882 / State Public Trusts Acts', descriptionHi: 'भारतीय ट्रस्ट अधिनियम 1882 अथवा राज्य ट्रस्ट अधिनियम के तहत शासित' },
  { id: 'society', code: 'SOC-1860', nameEn: 'Registered Society', nameHi: 'पंजीकृत सोसाइटी', descriptionEn: 'Governed by Societies Registration Act 1860 (Minimum 7 members)', descriptionHi: 'सोसाइटी पंजीकरण अधिनियम 1860 (न्यूनतम 7 सदस्य) के तहत शासित' },
  { id: 'sec8', code: 'SEC8-2013', nameEn: 'Section 8 Company', nameHi: 'धारा 8 कंपनी', descriptionEn: 'Incorporated under Companies Act 2013 with MCA Form CSR-1 eligibility', descriptionHi: 'कंपनी अधिनियम 2013 के तहत निगमित व MCA CSR-1 के लिए पात्र' },
]

export const NGO_TAX_EXEMPTIONS: MasterItem[] = [
  { id: '12a', code: 'SEC-12A', nameEn: 'Section 12A/12AB Income Tax Exemption', nameHi: 'धारा 12A/12AB आयकर छूट', descriptionEn: 'Tax exemption on institutional surplus and donations', descriptionHi: 'संस्थागत अधिशेष और दान पर आयकर से छूट' },
  { id: '80g', code: 'SEC-80G', nameEn: 'Section 80G 50% Tax Deduction Receipt', nameHi: 'धारा 80G 50% कर कटौती रसीद', descriptionEn: 'Enables individual and corporate donors to claim 50% income tax deduction', descriptionHi: 'दानदाताओं को 50% आयकर कटौती का दावा करने में सक्षम बनाता है' },
  { id: 'csr1', code: 'MCA-CSR1', nameEn: 'MCA Form CSR-1 Registration', nameHi: 'MCA फॉर्म CSR-1 पंजीकरण', descriptionEn: 'Mandatory unique code for receiving corporate CSR contributions', descriptionHi: 'कॉर्पोरेट सीएसआर अनुदान प्राप्त करने के लिए अनिवार्य विशिष्ट कोड' },
  { id: 'fcra', code: 'MHA-FCRA', nameEn: 'FCRA Foreign Contribution Registration', nameHi: 'FCRA विदेशी अंशदान पंजीकरण', descriptionEn: 'Ministry of Home Affairs approval with SBI New Delhi Main Branch account', descriptionHi: 'गृह मंत्रालय से विदेशी धन प्राप्त करने की पूर्व अनुमति' },
]

// ==========================================
// 2. CIVIC COLLECTIVE MASTER DATA
// ==========================================

export const CIVIC_ACTION_AREAS: MasterItem[] = [
  { id: 'waste_water', code: 'CIVIC-SWACHH', nameEn: 'Waste Management & Sewer Overflow', nameHi: 'कचरा प्रबंधन व सीवर ओवरफ्लो', category: 'Sanitation' },
  { id: 'air_quality', code: 'CIVIC-AIR', nameEn: 'Air Pollution & Stubble Burning Audit', nameHi: 'वायु प्रदूषण व पराली जलाने की जांच', category: 'Environment' },
  { id: 'road_lighting', code: 'CIVIC-ROAD', nameEn: 'Roads, Streetlights & Public Infrastructure', nameHi: 'सड़क, स्ट्रीट लाइट व सार्वजनिक बुनियादी ढांचा', category: 'Infrastructure' },
  { id: 'water_supply', code: 'CIVIC-WATER', nameEn: 'Drinking Water Supply & Tanker Scheduling', nameHi: 'पेयजल आपूर्ति व टैंकर शेड्यूलिंग', category: 'Utilities' },
  { id: 'safety_harassment', code: 'CIVIC-SAFETY', nameEn: 'Public Safety, Harassment & Police Response', nameHi: 'सार्वजनिक सुरक्षा, उत्पीड़न व पुलिस व्यवस्था', category: 'Rights' },
  { id: 'education_health', code: 'CIVIC-EDU', nameEn: 'Local Schools, Health Centres & Anganwadi', nameHi: 'स्थानीय स्कूल, स्वास्थ्य केंद्र व आंगनवाड़ी', category: 'Social Services' },
]
