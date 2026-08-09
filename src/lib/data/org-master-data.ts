/**
 * Sangathan Domain-Specific Master Reference Datasets & Statutory Taxonomies
 * Pre-populated for NGOs, Student Unions, Workers Unions, and Resident Welfare Associations.
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
// 2. STUDENT UNION MASTER DATA
// ==========================================

export const STUDENT_CENTRAL_PANEL: MasterItem[] = [
  { id: 'pres', code: 'SU-PRES', nameEn: 'President (अध्यक्ष)', nameHi: 'अध्यक्ष', descriptionEn: 'Chief representative of the student body', descriptionHi: 'छात्र संघ का मुख्य प्रतिनिधि' },
  { id: 'vp', code: 'SU-VP', nameEn: 'Vice President (उपाध्यक्ष)', nameHi: 'उपाध्यक्ष', descriptionEn: 'Presides over executive sessions and academic committees', descriptionHi: 'कार्यकारी सत्रों व समितियों का संचालन' },
  { id: 'gs', code: 'SU-GS', nameEn: 'General Secretary (महासचिव)', nameHi: 'महासचिव', descriptionEn: 'Chief administrative officer and Gyapan signatory', descriptionHi: 'मुख्य प्रशासनिक अधिकारी व ज्ञापन हस्ताक्षरकर्ता' },
  { id: 'js', code: 'SU-JS', nameEn: 'Joint Secretary (संयुक्त सचिव)', nameHi: 'संयुक्त सचिव', descriptionEn: 'Coordinates welfare drives and campus student records', descriptionHi: 'कल्याणकारी अभियानों व छात्र रिकॉर्ड का समन्वय' },
  { id: 'cc', code: 'SU-CC', nameEn: 'Central Councillor (केंद्रीय पार्षद)', nameHi: 'केंद्रीय पार्षद', descriptionEn: 'Faculty and department delegate to university council', descriptionHi: 'विश्वविद्यालय परिषद में संकाय प्रतिनिधि' },
]

export const ACADEMIC_FACULTIES: MasterItem[] = [
  { id: 'arts', nameEn: 'Faculty of Arts & Humanities', nameHi: 'कला एवं मानविकी संकाय' },
  { id: 'social_sci', nameEn: 'Faculty of Social Sciences', nameHi: 'सामाजिक विज्ञान संकाय' },
  { id: 'science', nameEn: 'Faculty of Natural & Applied Sciences', nameHi: 'प्राकृतिक एवं अनुप्रयुक्त विज्ञान संकाय' },
  { id: 'tech_eng', nameEn: 'Faculty of Engineering & Technology', nameHi: 'अभियांत्रिकी एवं प्रौद्योगिकी संकाय' },
  { id: 'law', nameEn: 'Faculty of Law & Legal Studies', nameHi: 'विधि एवं कानूनी अध्ययन संकाय' },
  { id: 'medicine', nameEn: 'Faculty of Medical Sciences & Dentistry', nameHi: 'चिकित्सा विज्ञान एवं दंत चिकित्सा संकाय' },
  { id: 'commerce', nameEn: 'Faculty of Commerce & Management', nameHi: 'वाणिज्य एवं प्रबंधन संकाय' },
]

export const CAMPUS_GRIEVANCE_CHANNELS: MasterItem[] = [
  { id: 'dsw', code: 'OFF-DSW', nameEn: 'Dean of Students Welfare (DSW)', nameHi: 'छात्र कल्याण संकायाध्यक्ष (DSW)' },
  { id: 'proctor', code: 'OFF-PROCTOR', nameEn: 'Chief Proctor Office (Campus Security)', nameHi: 'मुख्य प्रॉक्टर कार्यालय (कैंपस सुरक्षा)' },
  { id: 'anti_ragging', code: 'UGC-ARC', nameEn: 'Anti-Ragging Squad & Hotline', nameHi: 'एंटी-रैगिंग दस्ता व हेल्पलाइन' },
  { id: 'posh_icc', code: 'POSH-ICC', nameEn: 'Internal Complaints Committee (POSH/ICC)', nameHi: 'आंतरिक शिकायत समिति (POSH/ICC)' },
  { id: 'hostel_council', code: 'HSTL-COUNCIL', nameEn: 'Hostel Wardens & Mess Council', nameHi: 'छात्रावास वार्डन व मेस परिषद' },
]

// ==========================================
// 3. WORKERS & TRADE UNION MASTER DATA
// ==========================================

export const INDUSTRIAL_SECTORS: MasterItem[] = [
  { id: 'mfg_auto', code: 'SEC-MFG', nameEn: 'Automobile & Heavy Manufacturing', nameHi: 'ऑटोमोबाइल व भारी विनिर्माण' },
  { id: 'gig_platform', code: 'SEC-GIG', nameEn: 'IT, Tech & App-based Gig Economy', nameHi: 'आईटी, टेक व ऐप-आधारित गिग वर्कर' },
  { id: 'logistics', code: 'SEC-LOG', nameEn: 'Transportation, Railways & Logistics', nameHi: 'परिवहन, रेलवे व लॉजिस्टिक्स' },
  { id: 'construction', code: 'SEC-CONST', nameEn: 'Construction & Infrastructure Labour', nameHi: 'भवन निर्माण व बुनियादी ढांचा श्रमिक' },
  { id: 'health_sanitation', code: 'SEC-SAN', nameEn: 'Healthcare, Nursing & Sanitation', nameHi: 'स्वास्थ्य सेवा, नर्सिंग व स्वच्छता' },
  { id: 'textile', code: 'SEC-TEX', nameEn: 'Textile, Garment & Leather Units', nameHi: 'कपड़ा, परिधान व चमड़ा उद्योग' },
  { id: 'mining_energy', code: 'SEC-MINE', nameEn: 'Mining, Coal, Power & Petrochemicals', nameHi: 'खनन, कोयला, बिजली व पेट्रोकेमिकल्स' },
]

export const LABOUR_DISPUTE_CATEGORIES: MasterItem[] = [
  { id: 'wage_unpaid', code: 'DISP-WAGE', nameEn: 'Minimum Wage Non-Payment / Delayed Wages', nameHi: 'न्यूनतम वेतन न मिलना / वेतन में देरी' },
  { id: 'retrenchment', code: 'DISP-RET', nameEn: 'Wrongful Retrenchment & Unlawful Termination', nameHi: 'अनुचित छंटनी व अवैध बर्खास्तगी' },
  { id: 'workplace_safety', code: 'DISP-SAFE', nameEn: 'Occupational Safety & Hazardous Environment', nameHi: 'कार्यस्थल सुरक्षा व खतरनाक माहौल' },
  { id: 'overtime', code: 'DISP-OT', nameEn: 'Uncompensated Overtime & 12-Hour Shifts', nameHi: 'अवैतनिक ओवरटाइम व 12 घंटे की शिफ्ट' },
  { id: 'regularization', code: 'DISP-REG', nameEn: 'Contract Labour Regularization & PF/ESI Default', nameHi: 'ठेका श्रमिक नियमितीकरण व PF/ESI डिफ़ॉल्ट' },
]

export const STATUTORY_LABOUR_AUTHORITIES: MasterItem[] = [
  { id: 'alc', code: 'AUTH-ALC', nameEn: 'Assistant Labour Commissioner (Conciliation Officer)', nameHi: 'सहायक श्रम आयुक्त (सुलह अधिकारी)' },
  { id: 'rlc', code: 'AUTH-RLC', nameEn: 'Regional Labour Commissioner (Central / State)', nameHi: 'क्षेत्रीय श्रम आयुक्त (केंद्रीय / राज्य)' },
  { id: 'tribunal', code: 'AUTH-IT', nameEn: 'Industrial Disputes Tribunal', nameHi: 'औद्योगिक विवाद न्यायाधिकरण' },
  { id: 'cgit', code: 'AUTH-CGIT', nameEn: 'Central Govt Industrial Tribunal (CGIT)', nameHi: 'केंद्रीय सरकार औद्योगिक न्यायाधिकरण (CGIT)' },
]

// ==========================================
// 4. RESIDENT WELFARE ASSOCIATION (RWA) MASTER DATA
// ==========================================

export const RWA_UNIT_TYPES: MasterItem[] = [
  { id: '1bhk', nameEn: '1 BHK Studio / Compact Apartment', nameHi: '1 बीएचके स्टूडियो अपार्टमेंट' },
  { id: '2bhk', nameEn: '2 BHK Standard Flat', nameHi: '2 बीएचके फ्लैट' },
  { id: '3bhk', nameEn: '3 BHK Family Flat', nameHi: '3 बीएचके फ्लैट' },
  { id: '4bhk', nameEn: '4 BHK Luxury Apartment', nameHi: '4 बीएचके लग्जरी फ्लैट' },
  { id: 'penthouse', nameEn: 'Penthouse / Duplex Unit', nameHi: 'पेंटहाउस / डुप्लेक्स' },
  { id: 'villa', nameEn: 'Independent Row House / Villa', nameHi: 'स्वतंत्र विला / रो हाउस' },
  { id: 'shop', nameEn: 'Commercial Society Retail Shop', nameHi: 'सोसाइटी रिटेल दुकान' },
]

export const RWA_AMENITIES: MasterItem[] = [
  { id: 'clubhouse', nameEn: 'Community Clubhouse & Lounge', nameHi: 'सामुदायिक क्लब हाउस' },
  { id: 'gym', nameEn: 'Fitness Center & Gymnasium', nameHi: 'फिटनेस सेंटर व जिम' },
  { id: 'pool', nameEn: 'Swimming Pool & Kids Splash Deck', nameHi: 'स्विमिंग पूल' },
  { id: 'banquet', nameEn: 'Party Hall & Event Banquet', nameHi: 'पार्टी हॉल व बैंक्वेट' },
  { id: 'sports', nameEn: 'Badminton / Tennis Court', nameHi: 'बैडमिंटन / टेनिस कोर्ट' },
  { id: 'ev_charging', nameEn: 'EV Vehicle Fast-Charging Station', nameHi: 'ईवी फास्ट चार्जिंग स्टेशन' },
]

export const RWA_MAINTENANCE_HEADS: MasterItem[] = [
  { id: 'electricity_common', nameEn: 'Common Area Grid Electricity', nameHi: 'सामान्य क्षेत्र बिजली बिल' },
  { id: 'security', nameEn: '24x7 Security Guard Agency Contract', nameHi: 'सुरक्षा गार्ड एजेंसी अनुबंध' },
  { id: 'housekeeping', nameEn: 'Housekeeping, Waste Segregation & Sanitation', nameHi: 'सफाई व कचरा पृथक्करण' },
  { id: 'lift_amc', nameEn: 'Elevator & Lift Maintenance (AMC)', nameHi: 'लिफ्ट रखरखाव (AMC)' },
  { id: 'diesel_gen', nameEn: 'Diesel Generator (DG) Backup Fuel', nameHi: 'डीजल जनरेटर ईंधन' },
  { id: 'fire_safety', nameEn: 'Fire Fighting Systems AMC & NOC', nameHi: 'अग्निशमन प्रणाली रखरखाव' },
  { id: 'sinking_fund', nameEn: 'Long-term Capital Sinking Fund', nameHi: 'दीर्घकालिक सिंकिंग फंड' },
]
