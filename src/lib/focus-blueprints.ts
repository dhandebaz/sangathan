import { OrgType } from '@/lib/org-types'

export interface BlueprintRole {
  value: string
  labelEn: string
  labelHi: string
}

export interface FocusBlueprint {
  id: string
  titleEn: string
  titleHi: string
  descEn: string
  descHi: string
  recommendedRoles: BlueprintRole[]
}

export const FOCUS_BLUEPRINTS: Record<OrgType, FocusBlueprint[]> = {
  civic_collective: [
    {
      id: 'colony_civic',
      titleEn: 'Neighborhood & Colony Action (वार्ड व कॉलोनी)',
      titleHi: 'मोहल्ला व कॉलोनी सुधार (सड़क, पानी, कचरा)',
      descEn: 'Fix broken roads, sewer overflows, uncollected waste & streetlights with 1-page A4 Parchas and official diary timers.',
      descHi: 'सड़क, पानी, सीवर और कचरा समस्याओं पर ₹1 पर्चा और 15-दिवसीय काउंटडाउन डायरी से जवाबदेही सुनिश्चित करें।',
      recommendedRoles: [
        { value: 'Lead Organizer', labelEn: 'Lead Organizer (प्रमुख संयोजक)', labelHi: 'प्रमुख संयोजक' },
        { value: 'Ward Coordinator', labelEn: 'Ward / Mohalla Coordinator (वार्ड प्रभारी)', labelHi: 'वार्ड प्रभारी' },
        { value: 'Field Volunteer', labelEn: 'Field Action Volunteer (फील्ड साथी)', labelHi: 'फील्ड साथी' },
      ],
    },
    {
      id: 'citizen_science',
      titleEn: 'Environmental & Citizen Science (पर्यावरण व वायु)',
      titleHi: 'पर्यावरण व वायु प्रदूषण निगरानी (नागरिक विज्ञान मॉडल)',
      descEn: 'Deploy ground air PM2.5 and water testing teams, log GPS-tagged spot sensor readings, and send statutory notices to DPCC/CPCB.',
      descHi: 'जमीनी प्रदूषण व पानी जांच डेटा दर्ज करें और DPCC/CPCB को तत्काल वैधानिक नोटिस व RTI भेजें।',
      recommendedRoles: [
        { value: 'Lead Researcher', labelEn: 'Lead Field Researcher (प्रमुख शोधकर्ता)', labelHi: 'प्रमुख शोधकर्ता' },
        { value: 'Air/Water Testing Lead', labelEn: 'Testing & Sensor Lead (जांच प्रभारी)', labelHi: 'जांच प्रभारी' },
        { value: 'Legal & RTI Officer', labelEn: 'Legal & RTI Coordinator (RTI प्रभारी)', labelHi: 'RTI प्रभारी' },
      ],
    },
    {
      id: 'legal_defense',
      titleEn: 'Human Rights & Legal Defense (अधिकार व कानूनी सुरक्षा)',
      titleHi: 'मानवाधिकार व कानूनी सहायता नेटवर्क',
      descEn: 'Emergency SOS broadcasts, police thana custody tracker, advocate dispatch, and BQF Section 8 recognition.',
      descHi: 'थाना हिरासत ट्रैकर, आपातकालीन SOS प्रसारण, वकील सहायता और BQF धारा 8 आधिकारिक सत्यापन।',
      recommendedRoles: [
        { value: 'Legal Aid Convener', labelEn: 'Legal Aid Convener (विधि संयोजक)', labelHi: 'विधि संयोजक' },
        { value: 'Rapid Response Lead', labelEn: 'Emergency Response Lead (त्वरित दल)', labelHi: 'त्वरित दल' },
        { value: 'Human Rights Monitor', labelEn: 'Human Rights Monitor (निगरानी साथी)', labelHi: 'निगरानी साथी' },
      ],
    },
    {
      id: 'mass_campaigns',
      titleEn: 'Mass Movements & Public Campaigns (जन आंदोलन)',
      titleHi: 'जन आंदोलन व सार्वजनिक हस्ताक्षर अभियान',
      descEn: 'Organize door-to-door signature campaigns, public referendums, press releases, and multi-collective solidarity fronts.',
      descHi: 'हस्ताक्षर अभियान, जनमत संग्रह, प्रेस विज्ञप्ति और सामूहिक फ्रंट बनाकर बड़े पैमाने पर जनहित बदलाव लाएं।',
      recommendedRoles: [
        { value: 'Campaign Lead', labelEn: 'General Campaign Lead (आंदोलन संचालक)', labelHi: 'आंदोलन संचालक' },
        { value: 'Media & Press Secretary', labelEn: 'Media & Press Secretary (प्रेस सचिव)', labelHi: 'प्रेस सचिव' },
        { value: 'Mobilization Convener', labelEn: 'Outreach & Mass Mobilizer (जनसंपर्क)', labelHi: 'जनसंपर्क' },
      ],
    },
  ],
  ngo: [
    {
      id: 'welfare_relief',
      titleEn: 'Education, Health & Relief Welfare (समाज कल्याण)',
      titleHi: 'शिक्षा, स्वास्थ्य व राहत वितरण कार्यक्रम',
      descEn: 'Volunteer hours logging, 80G tax-exempt donor receipts, beneficiary survey forms, and field distribution audits.',
      descHi: 'स्वयंसेवक सेवा घंटे, 80G दान रसीदें, लाभार्थी डेटा सर्वेक्षण और राहत वितरण लेखाजोखा।',
      recommendedRoles: [
        { value: 'Program Director', labelEn: 'Program Director (कार्यक्रम निदेशक)', labelHi: 'कार्यक्रम निदेशक' },
        { value: 'Volunteer Manager', labelEn: 'Volunteer Manager (स्वयंसेवक प्रबंधक)', labelHi: 'स्वयंसेवक प्रबंधक' },
        { value: 'Donor Relations Lead', labelEn: 'Donor Relations Lead (दान समन्वयक)', labelHi: 'दान समन्वयक' },
      ],
    },
    {
      id: 'policy_advocacy',
      titleEn: 'Policy Research & Advocacy Think-Tank (नीति व शोध)',
      titleHi: 'नीति अनुसंधान, थिंक-टैंक व पैरवी',
      descEn: 'Whitepaper repositories, policy consultation records, empirical survey data, and government representations.',
      descHi: 'नीतिगत शोध पत्र, सरकारी प्रतिनिधित्व, जन संवाद और अनुभवजन्य अनुसंधान डेटा।',
      recommendedRoles: [
        { value: 'Research Lead', labelEn: 'Principal Researcher (प्रमुख शोधकर्ता)', labelHi: 'प्रमुख शोधकर्ता' },
        { value: 'Advocacy Officer', labelEn: 'Policy & Advocacy Officer (पैरवी अधिकारी)', labelHi: 'पैरवी अधिकारी' },
        { value: 'Communications Lead', labelEn: 'Communications Director (संचार निदेशक)', labelHi: 'संचार निदेशक' },
      ],
    },
    {
      id: 'community_shg',
      titleEn: 'Community Development & SHGs (स्वयं सहायता समूह)',
      titleHi: 'सामुदायिक विकास व महिला स्वयं सहायता समूह',
      descEn: 'Micro-grants bookkeeping, artisan training workshops, SHG saving logs, and grassroots empowerment projects.',
      descHi: 'माइक्रो-अनुदान बहीखाता, कार्यशालाएं, SHG बचत रिकॉर्ड और जमीनी आजीविका परियोजनाएं।',
      recommendedRoles: [
        { value: 'SHG Coordinator', labelEn: 'SHG Cluster Coordinator (समूह संयोजक)', labelHi: 'समूह संयोजक' },
        { value: 'Field Trainer', labelEn: 'Livelihood Trainer (प्रशिक्षक)', labelHi: 'प्रशिक्षक' },
        { value: 'Accounts Supervisor', labelEn: 'Accounts Supervisor (लेखा निरीक्षक)', labelHi: 'लेखा निरीक्षक' },
      ],
    },
    {
      id: 'animal_green',
      titleEn: 'Animal Welfare & Green Action (जीव कल्याण व हरित)',
      titleHi: 'पशु कल्याण, आश्रय व पर्यावरण संरक्षण',
      descEn: 'Rescue dispatch tickets, vaccination and foster logs, tree plantation drives, and animal feeder rosters.',
      descHi: 'रेस्क्यू डिस्पैच टिकट, टीकाकरण व आश्रय रिकॉर्ड, वृक्षारोपण और पशु आहार रोस्टर।',
      recommendedRoles: [
        { value: 'Rescue Coordinator', labelEn: 'Rescue Coordinator (रेस्क्यू प्रभारी)', labelHi: 'रेस्क्यू प्रभारी' },
        { value: 'Shelter Lead', labelEn: 'Shelter & Medical Lead (आश्रय प्रभारी)', labelHi: 'आश्रय प्रभारी' },
        { value: 'Community Feeder Lead', labelEn: 'Community Feeder Lead (आहार दल प्रभारी)', labelHi: 'आहार दल प्रभारी' },
      ],
    },
  ],
  student_union: [
    {
      id: 'campus_elections',
      titleEn: 'Campus Elections & Lyngdoh Compliance (छात्र संघ चुनाव)',
      titleHi: 'छात्र संघ चुनाव व लिंगदोह समिति अनुपालन',
      descEn: 'Digital nomination filing, expenditure cap auditing, Lyngdoh criteria checks, and tamper-evident secret ballots.',
      descHi: 'डिजिटल नामांकन, चुनाव खर्च सीमा ऑडिट, लिंगदोह अनुपालन और सुरक्षित गुप्त मतदान।',
      recommendedRoles: [
        { value: 'Election Commissioner', labelEn: 'Chief Election Commissioner (मुख्य चुनाव आयुक्त)', labelHi: 'मुख्य चुनाव आयुक्त' },
        { value: 'Presidential Candidate', labelEn: 'Presidential Nominee (अध्यक्ष पद प्रत्याशी)', labelHi: 'अध्यक्ष पद प्रत्याशी' },
        { value: 'Returning Officer', labelEn: 'Returning Officer (रिटर्निंग ऑफिसर)', labelHi: 'रिटर्निंग ऑफिसर' },
      ],
    },
    {
      id: 'hostel_mess',
      titleEn: 'Hostel, Mess & Campus Welfare (छात्रावास व मेस)',
      titleHi: 'छात्रावास, मेस गुणवत्ता व छात्र कल्याण',
      descEn: 'Log daily food quality inspections, hostel maintenance requests, library amenity tickets, and warden escalations.',
      descHi: 'मेस भोजन गुणवत्ता जांच, छात्रावास रखरखाव शिकायतें और वार्डन स्तर पर त्वरित निवारण।',
      recommendedRoles: [
        { value: 'Mess Secretary', labelEn: 'Mess Secretary (मेस सचिव)', labelHi: 'मेस सचिव' },
        { value: 'Hostel Representative', labelEn: 'Hostel Representative (हॉस्टल प्रतिनिधि)', labelHi: 'हॉस्टल प्रतिनिधि' },
        { value: 'Welfare Convener', labelEn: 'Welfare Convener (कल्याण संयोजक)', labelHi: 'कल्याण संयोजक' },
      ],
    },
    {
      id: 'academic_antiragging',
      titleEn: 'Academic Rights & Anti-Ragging Cell (अधिकार व सुरक्षा)',
      titleHi: 'शैक्षणिक अधिकार, शिकायत निवारण व एंटी-रैगिंग सेल',
      descEn: 'Fee refund disputes, curriculum grievances, anonymous anti-ragging complaints, and disciplinary hearing records.',
      descHi: 'फीस वापसी विवाद, परीक्षा शिकायतें, गोपनीय एंटी-रैगिंग शिकायतें और छात्र सहायता।',
      recommendedRoles: [
        { value: 'Academic Secretary', labelEn: 'Academic Affairs Secretary (शिक्षा सचिव)', labelHi: 'शिक्षा सचिव' },
        { value: 'Anti-Ragging Officer', labelEn: 'Anti-Ragging Counselor (एंटी-रैगिंग प्रभारी)', labelHi: 'एंटी-रैगिंग प्रभारी' },
        { value: 'Student Advocate', labelEn: 'Student Advocate / Counselor (छात्र प्रतिनिधि)', labelHi: 'छात्र प्रतिनिधि' },
      ],
    },
    {
      id: 'student_movement',
      titleEn: 'Student Activism & Fee Agitations (छात्र आंदोलन)',
      titleHi: 'छात्र आंदोलन, पर्चा वितरण व संघर्ष मोर्चा',
      descEn: 'Campus flyer distribution, general body meetings (GBMs), strike mandates, and solidarity campaigns across universities.',
      descHi: 'कैम्पस पर्चा अभियान, आम सभा (GBM) आयोजन, फीस वृद्धि आंदोलन और अंतर-विश्वविद्यालय एकजुटता।',
      recommendedRoles: [
        { value: 'General Secretary', labelEn: 'General Secretary (महासचिव)', labelHi: 'महासचिव' },
        { value: 'Campus Organizer', labelEn: 'Campus Mobilization Lead (कैम्पस संयोजक)', labelHi: 'कैम्पस संयोजक' },
        { value: 'Cultural & Media Lead', labelEn: 'Cultural & Agit-Prop Lead (सांस्कृतिक सचिव)', labelHi: 'सांस्कृतिक सचिव' },
      ],
    },
  ],
  workers_union: [
    {
      id: 'cba_negotiations',
      titleEn: 'Collective Bargaining (CBA) & Wage Talks (वेतन समझौता)',
      titleHi: 'सामूहिक सौदाकारी (CBA) व वेतन मांग पत्र',
      descEn: 'Draft tripartite Charters of Demands, track management minutes, strike authorization ballots, and cost-of-living index.',
      descHi: 'वेतन व भत्ते मांग पत्र तैयार करें, प्रबंधन वार्ता ट्रैक करें और गोपनीय हड़ताल मतदान कराएं।',
      recommendedRoles: [
        { value: 'General Secretary', labelEn: 'Union General Secretary (महासचिव)', labelHi: 'महासचिव' },
        { value: 'Bargaining Lead', labelEn: 'Chief Negotiator (मुख्य वार्ताकार)', labelHi: 'मुख्य वार्ताकार' },
        { value: 'Legal Advisor', labelEn: 'Labor Advocate / Legal Advisor (श्रम कानून सलाहकार)', labelHi: 'श्रम कानून सलाहकार' },
      ],
    },
    {
      id: 'safety_inspectorate',
      titleEn: 'Workplace Safety & Factory Audits (सुरक्षा व निरीक्षण)',
      titleHi: 'कार्यस्थल सुरक्षा, दुर्घटना रिपोर्टिंग व फैक्ट्री निरीक्षण',
      descEn: 'OSHA hazard logs, machine safety audits, accidental injury claims, and statutory representations to Factory Inspectorate.',
      descHi: 'मशीन सुरक्षा जांच, दुर्घटना मुआवजा क्लेम और फैक्ट्री इंस्पेक्टर को कानूनी नोटिस।',
      recommendedRoles: [
        { value: 'Safety Steward', labelEn: 'Chief Safety Steward (सुरक्षा प्रतिनिधि)', labelHi: 'सुरक्षा प्रतिनिधि' },
        { value: 'Accident Relief Officer', labelEn: 'Relief & Compensation Lead (राहत प्रभारी)', labelHi: 'राहत प्रभारी' },
        { value: 'Shopfloor Inspector', labelEn: 'Shopfloor Auditor (संयंत्र निरीक्षक)', labelHi: 'संयंत्र निरीक्षक' },
      ],
    },
    {
      id: 'gig_informal',
      titleEn: 'Gig Worker & Informal Labor Solidarity (गिग व असंगठित)',
      titleHi: 'गिग वर्कर, डिलीवरी राइडर व असंगठित मज़दूर सुरक्षा',
      descEn: 'Rider mutual-aid chanda, emergency accident SOS, rate-card disputes, and gig union verification badges.',
      descHi: 'डिलीवरी राइडर परस्पर सहायता कोष, दुर्घटना SOS, रेट-कार्ड विवाद और डिजिटल यूनियन सदस्यता।',
      recommendedRoles: [
        { value: 'Fleet Organizer', labelEn: 'Hub / Fleet Coordinator (हब संयोजक)', labelHi: 'हब संयोजक' },
        { value: 'Mutual Aid Trustee', labelEn: 'Mutual Aid Fund Trustee (पारस्परिक सहायता ट्रस्टी)', labelHi: 'पारस्परिक सहायता ट्रस्टी' },
        { value: 'Field Representative', labelEn: 'Grievance Field Rep (क्षेत्रीय प्रतिनिधि)', labelHi: 'क्षेत्रीय प्रतिनिधि' },
      ],
    },
    {
      id: 'cadre_delegate',
      titleEn: 'Shop-Floor Stewards & Unit Delegates (संयंत्र व प्रतिनिधि)',
      titleHi: 'प्लांट यूनिट प्रतिनिधि, मासिक चंदा व गेट बैठकें',
      descEn: 'Plant department delegates, monthly union levy UPI collection, shift rosters, and gate meeting notices.',
      descHi: 'संयंत्र प्रतिनिधि नेटवर्क, UPI मासिक चंदा संग्रह, शिफ्ट रोस्टर और गेट सभाएं।',
      recommendedRoles: [
        { value: 'Unit President', labelEn: 'Plant Unit President (यूनिट अध्यक्ष)', labelHi: 'यूनिट अध्यक्ष' },
        { value: 'Shop Steward', labelEn: 'Shopfloor Steward (शॉप प्रतिनिधि)', labelHi: 'शॉप प्रतिनिधि' },
        { value: 'Treasurer', labelEn: 'Levy & Finance Secretary (कोषाध्यक्ष)', labelHi: 'कोषाध्यक्ष' },
      ],
    },
  ],
  rwa: [
    {
      id: 'estate_maintenance',
      titleEn: 'Gated Society & Estate Operations (सोसायटी रखरखाव)',
      titleHi: 'सोसायटी रख-रखाव, लिफ्ट/डीजी व पानी प्रबंधन',
      descEn: 'Lift, DG, STP and plumbing job tickets, vendor AMC tracker, resident repair requests, and technician dispatch.',
      descHi: 'लिफ्ट, जनरेटर और प्लंबिंग टिकट, वेंडर AMC ट्रैकर और तकनीशियन प्रबंधन।',
      recommendedRoles: [
        { value: 'Estate Manager', labelEn: 'Estate & Operations Manager (प्रबंधक)', labelHi: 'प्रबंधक' },
        { value: 'Maintenance Secretary', labelEn: 'Maintenance Secretary (रखरखाव सचिव)', labelHi: 'रखरखाव सचिव' },
        { value: 'Resident Representative', labelEn: 'Tower / Block Lead (ब्लॉक प्रतिनिधि)', labelHi: 'ब्लॉक प्रतिनिधि' },
      ],
    },
    {
      id: 'municipal_civic',
      titleEn: 'Colony & Ward Municipal Action (वार्ड व नगर निगम)',
      titleHi: 'कॉलोनी नागरिक सुधार, नगर निगम व पार्षद पत्राचार',
      descEn: 'MCD/civic agency escalation, road potholes, storm drains, streetlights, and ward councillor RTIs.',
      descHi: 'नगर निगम को मांग पत्र, नाली-सड़क शिकायतें और पार्षद स्तर पर नागरिक पैरवी।',
      recommendedRoles: [
        { value: 'Civic Action Lead', labelEn: 'Municipal Affairs Lead (नागरिक सचिव)', labelHi: 'नागरिक सचिव' },
        { value: 'General Secretary', labelEn: 'RWA General Secretary (महासचिव)', labelHi: 'महासचिव' },
        { value: 'RTI Convener', labelEn: 'Colony RTI Convener (RTI संयोजक)', labelHi: 'RTI संयोजक' },
      ],
    },
    {
      id: 'security_amenities',
      titleEn: 'Security, Parking & Community Facilities (सुरक्षा व सुविधाएं)',
      titleHi: 'सुरक्षा गार्ड रोस्टर, पार्किंग प्रबंधन व क्लब हाउस',
      descEn: 'Guard duty rosters, visitor logs, parking slot allocation, clubhouse & sports facility slot bookings.',
      descHi: 'सुरक्षा गार्ड रोस्टर, पार्किंग आवंटन और क्लब हाउस/सामुदायिक भवन बुकिंग।',
      recommendedRoles: [
        { value: 'Security Supervisor', labelEn: 'Security Supervisor (सुरक्षा प्रभारी)', labelHi: 'सुरक्षा प्रभारी' },
        { value: 'Facility Convener', labelEn: 'Amenities & Club Lead (सुविधा संयोजक)', labelHi: 'सुविधा संयोजक' },
        { value: 'Resident Warden', labelEn: 'Resident Warden (निवासी प्रतिनिधि)', labelHi: 'निवासी प्रतिनिधि' },
      ],
    },
    {
      id: 'agm_billing',
      titleEn: 'Annual AGM Elections & Bill Collection (AGM व बिलिंग)',
      titleHi: 'वार्षिक AGM चुनाव, ऑनलाइन वोटिंग व मेंटेनेंस वसूली',
      descEn: 'Annual General Meeting agendas, tamper-evident executive election voting, and UPI maintenance billing ledger.',
      descHi: 'वार्षिक AGM एजेंडा, ऑनलाइन कार्यसमिति चुनाव और UPI मेंटेनेंस पारदर्शी बहीखाता।',
      recommendedRoles: [
        { value: 'RWA President', labelEn: 'RWA President (अध्यक्ष)', labelHi: 'अध्यक्ष' },
        { value: 'Treasurer', labelEn: 'Treasurer / Finance Lead (कोषाध्यक्ष)', labelHi: 'कोषाध्यक्ष' },
        { value: 'Election Officer', labelEn: 'Election Officer (चुनाव अधिकारी)', labelHi: 'चुनाव अधिकारी' },
      ],
    },
  ],
}
