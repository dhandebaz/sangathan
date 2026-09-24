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
      descEn: 'Fix broken roads, sewer overflows, uncollected waste & streetlights with 1-page A4 Parchas and a dated complaint diary.',
      descHi: 'सड़क, पानी, सीवर और कचरा समस्याओं पर ₹1 पर्चा और तारीख वाली शिकायत डायरी से हिसाब रखें।',
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
      descEn: 'Deploy ground air PM2.5 and water testing teams, log GPS-tagged spot readings, and draft representations to DPCC/CPCB.',
      descHi: 'जमीनी प्रदूषण व पानी जांच डेटा दर्ज करें और DPCC/CPCB को प्रतिनिधित्व पत्र का मसौदा बनाएं।',
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
      descEn: 'Emergency SOS broadcasts, police thana custody tracker, advocate dispatch, and BQF verification pathway.',
      descHi: 'थाना हिरासत ट्रैकर, आपातकालीन SOS प्रसारण, वकील सहायता और सक्रिय समूहों हेतु BQF सत्यापन मार्ग।',
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
      descEn: 'Volunteer hours logging, 80G/12A donor receipts, beneficiary survey forms, and field distribution audits.',
      descHi: 'स्वयंसेवक सेवा घंटे, 80G/12A दान रसीदें, लाभार्थी डेटा सर्वेक्षण और राहत वितरण लेखाजोखा।',
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
}
