export interface SolutionGroundTool {
  nameEn: string
  nameHi: string
  descEn: string
  descHi: string
  icon: string
  badge?: string
}

export interface SolutionStatutoryAct {
  titleEn: string
  titleHi: string
  descEn: string
  descHi: string
  provision: string
}

export interface SolutionFAQ {
  questionEn: string
  questionHi: string
  answerEn: string
  answerHi: string
}

export interface SolutionSubtype {
  id: string
  slug: string
  titleEn: string
  titleHi: string
  taglineEn: string
  taglineHi: string
  metaTitleEn: string
  metaTitleHi: string
  metaDescEn: string
  metaDescHi: string
  keywords: string[]
  activistQuoteEn: string
  activistQuoteHi: string
  groundChallengeEn: string
  groundChallengeHi: string
  solutionOverviewEn: string
  solutionOverviewHi: string
  keyTools: SolutionGroundTool[]
  statutoryActs: SolutionStatutoryAct[]
  stepWorkflow: { stepEn: string; stepHi: string; titleEn: string; titleHi: string; detailEn: string; detailHi: string }[]
  faqs: SolutionFAQ[]
}

export interface SolutionOrgType {
  id: string
  slug: string
  titleEn: string
  titleHi: string
  categoryBadgeEn: string
  categoryBadgeHi: string
  metaTitleEn: string
  metaTitleHi: string
  metaDescEn: string
  metaDescHi: string
  keywords: string[]
  heroHeadlineEn: string
  heroHeadlineHi: string
  heroSubheadlineEn: string
  heroSubheadlineHi: string
  activistQuoteEn: string
  activistQuoteHi: string
  quoteAttributionEn: string
  quoteAttributionHi: string
  groundPillars: { titleEn: string; titleHi: string; descEn: string; descHi: string; icon: string }[]
  coreTools: SolutionGroundTool[]
  subtypes: SolutionSubtype[]
  statutoryCompliance: {
    actName: string
    registrationRequirementEn: string
    registrationRequirementHi: string
    keyFilingsEn: string
    keyFilingsHi: string
  }[]
  faqs: SolutionFAQ[]
}

export const SOLUTIONS_DATA: Record<string, SolutionOrgType> = {
  'civic-collective': {
    id: 'civic_collective',
    slug: 'civic-collective',
    titleEn: 'Civic Collectives & Grassroots Movements',
    titleHi: 'नागरिक समूह व जमीनी आंदोलन',
    categoryBadgeEn: 'Unregistered & Community Groups',
    categoryBadgeHi: 'अनौपचारिक व जमीनी नागरिक समूह',
    metaTitleEn: 'Civic Collective Management Software India | Grassroots Movement Tools | Sangathan',
    metaTitleHi: 'नागरिक समूह सॉफ्टवेयर | जमीनी आंदोलन व जन अधिकार टूल्स | संगठन',
    metaDescEn: 'Purpose-built digital operating system for informal civic groups, colony activists, citizen science teams, and legal defense networks. 1-tap spot audits, ₹1 printable Parchas, complaint diary with 30-day RTI reminder, and BQF recognition pathway for active collectives.',
    metaDescHi: 'अनौपचारिक नागरिक समूहों, कॉलोनी कार्यकर्ताओं, पर्यावरण जांच दलों और विधिक रक्षा नेटवर्क के लिए विशेष डिजिटल ऑपरेटिंग सिस्टम। फील्ड जांच, ₹1 पर्चा, 30-दिवसीय आरटीआई याद दिलाने वाली शिकायत डायरी एवं सक्रिय समूहों के लिए BQF मान्यता मार्ग।',
    keywords: [
      'civic collective software India', 'grassroots movement management', 'colony action tool',
      'citizen science air pollution app Delhi', 'RTI reminder diary', 'printable A4 parcha generator',
      'legal defense rapid response', 'BQF verification pathway', 'unregistered group management software',
      'citizen grievance escalation MCD', 'public petition studio India'
    ],
    heroHeadlineEn: 'You Don\'t Need Registration to Organize. You Need Sangathan.',
    heroHeadlineHi: 'बस्ती में बदलाव के लिए पंजीकरण नहीं, संगठित शक्ति चाहिए।',
    heroSubheadlineEn: 'The zero-tech, mobile-first operating system for informal citizen groups, colony monitors, and activist campaigns. Keep written records of every complaint with stamped receiving photos, spot evidence, and 30-day RTI reminders.',
    heroSubheadlineHi: 'अनौपचारिक नागरिक समूहों, मोहल्ला कार्यकर्ताओं और जन अभियानों के लिए पूर्ण डिजिटल प्लेटफॉर्म। स्टैम्प्ड रिसीविंग फोटो, जमीनी सबूत और 30-दिवसीय आरटीआई याद के साथ हर शिकायत का लिखित हिसाब रखें।',
    activistQuoteEn: '“Babus ignore verbal complaints and WhatsApp forwards. They respond to dated written records with stamped receiving numbers.”',
    activistQuoteHi: '“सरकारी अधिकारी मौखिक बातों और व्हाट्सएप ग्रुपों को अनदेखा करते हैं। तारीख वाली लिखित रिसीविंग का हिसाब रखने पर जवाब मिलता है।”',
    quoteAttributionEn: 'Citizen Science & Clean Air Collective Leader',
    quoteAttributionHi: 'नागरिक विज्ञान व स्वच्छ हवा समूह',
    groundPillars: [
      {
        titleEn: '₹1 Photostat Parcha Engine',
        titleHi: '₹1 फोटोस्टेट पर्चा जनरेटर',
        descEn: 'Generate high-contrast, black-and-white 1-page A4 flyers optimized for local photostat machines and tea-stall signature drives.',
        descHi: 'चाय की दुकानों और पार्कों में हस्ताक्षर अभियानों के लिए स्थानीय ₹1 फोटोस्टेट मशीनों पर छपने योग्य ब्लैक-एंड-व्हाइट पर्चे बनाएं।',
        icon: 'Printer'
      },
      {
        titleEn: 'Complaint Diary & 30-Day RTI Reminder',
        titleHi: 'शिकायत डायरी व 30-दिवसीय आरटीआई याद',
        descEn: 'Save municipal receiving numbers with stamped photos. Get a reminder at 30 days (the legal RTI reply period) with a ready Section 6(1) draft you print, sign and submit yourself.',
        descHi: 'नगर निगम की डायरी संख्या स्टैम्प्ड फोटो के साथ सहेजें। 30 दिन (कानूनी आरटीआई जवाब अवधि) पर याद पाएं और धारा 6(1) का तैयार मसौदा खुद प्रिंट, हस्ताक्षर व जमा करें।',
        icon: 'Clock'
      },
      {
        titleEn: 'Field Spot Audits & Geotagged Evidence',
        titleHi: 'फील्ड स्पॉट ऑडिट व जीपीएस सबूत',
        descEn: 'Log PM2.5 air sensor readings, water TDS levels, and garbage dump photos with cryptographic tamper-evident timestamps.',
        descHi: 'प्रदूषण PM2.5, पानी TDS और कचरा ढलावों के जीपीएस-टैग्ड सबूत दर्ज करें और सीधे विधिक नोटिस बनाएं।',
        icon: 'Activity'
      },
      {
        titleEn: 'BQF Milestone Verification Pathway',
        titleHi: 'BQF सत्यापन व संस्थागत संबद्धता मार्ग',
        descEn: 'Milestone-based institutional verification from Bahujan Queer Foundation (Delhi Section 8 NGO) for active grassroots collectives meeting verified ground audit and community criteria.',
        descHi: 'सत्यापित जमीनी कार्य और नागरिक ऑडिट पूरा करने वाले सक्रिय समूहों के लिए बहुजन क्वीर फाउंडेशन द्वारा संस्थागत सत्यापन एवं मार्गदर्शन।',
        icon: 'ShieldCheck'
      }
    ],
    coreTools: [
      {
        nameEn: 'Unified Inbox & Video Dispatch Desk',
        nameHi: 'एकीकृत इनबॉक्स व वीडियो संवाद डेस्क',
        descEn: 'Consolidated 2-way member chats, automated Telegram channel broadcasting, 1-click Google Meet video rooms, and emergency crisis SOS alerts.',
        descHi: '2-तरफा सदस्य चैट, टेलीग्राम चैनल प्रसारण, 1-क्लिक Google Meet वीडियो कॉलिंग और आपातकालीन संकट SOS अलर्ट।',
        icon: 'MessageSquare',
        badge: 'Zero-Leakage Comms'
      },
      {
        nameEn: 'Centralized Synchronized Calendar & Field Rosters',
        nameHi: 'केंद्रीकृत स्वतः-सिंक कैलेंडर व फील्ड रोस्टर',
        descEn: 'Shared movement schedule for general assemblies and door-to-door surveyor pairings with live Google Calendar & Apple iCal (webcal://) background sync.',
        descHi: 'आम सभाओं और घर-घर सर्वेक्षक जोड़ियों के लिए साझा आंदोलन कैलेंडर, Google Calendar व Apple iCal लाइव सिंक सहित।',
        icon: 'Calendar',
        badge: 'Live Auto-Sync'
      },
      {
        nameEn: 'Field Spot Sensor & Evidence Desk',
        nameHi: 'फील्ड स्पॉट सेंसर व साक्ष्य डेस्क',
        descEn: 'Ground data collection for air quality, sewer overflow, and uncollected waste with instant statutory notice generation for DPCC/CPCB.',
        descHi: 'वायु गुणवत्ता, सीवर ओवरफ्लो और कचरा शिकायतों पर जमीनी डेटा और DPCC/CPCB को तुरंत कानूनी नोटिस।',
        icon: 'Activity',
        badge: 'Citizen Science Model'
      },
      {
        nameEn: 'A4 Printable Parcha Studio',
        nameHi: 'A4 प्रिंटेबल पर्चा स्टूडियो',
        descEn: '1-click generator for high-contrast colony flyers, protest leaflets, and physical pen-and-paper signature tables.',
        descHi: 'मोहल्ला पर्चों, विरोध पत्रों और पेन-कागज हस्ताक्षर तालिकाओं के लिए 1-क्लिक जनरेटर।',
        icon: 'Printer',
        badge: 'Zero-Cost Mobilization'
      },
      {
        nameEn: 'Complaint Diary & RTI Helper',
        nameHi: 'शिकायत डायरी व आरटीआई सहायक',
        descEn: 'Save stamped receiving copies from ward offices with dates. Get a 30-day reminder and a Section 6(1) draft you file yourself.',
        descHi: 'वार्ड कार्यालयों से मुहर लगी रिसीविंग तारीख के साथ सहेजें। 30 दिन पर याद पाएं और खुद दाखिल करने वाला धारा 6(1) मसौदा बनाएं।',
        icon: 'Clock',
        badge: 'Written Record'
      },
      {
        nameEn: 'Emergency SOS Broadcast',
        nameHi: 'आपातकालीन SOS प्रसारण',
        descEn: '1-tap alert to your own team members and saved contacts with location and details you type.',
        descHi: 'अपनी टीम और सहेजे गए संपर्कों को 1-टैप में लोकेशन सहित सतर्क संदेश भेजें।',
        icon: 'ShieldAlert',
        badge: 'Team Alert'
      }
    ],
    subtypes: [
      {
        id: 'colony_civic',
        slug: 'colony-civic',
        titleEn: 'Neighborhood & Colony Municipal Action',
        titleHi: 'मोहल्ला व कॉलोनी नागरिक सुधार',
        taglineEn: 'Fix broken roads, sewer overflows, uncollected waste & streetlights with ₹1 Parchas and a dated complaint diary.',
        taglineHi: 'सड़क, पानी, सीवर और कचरा समस्याओं पर ₹1 पर्चा और तारीख वाली शिकायत डायरी से हिसाब रखें।',
        metaTitleEn: 'Colony Action & Municipal Grievance Software | Ward Accountability | Sangathan',
        metaTitleHi: 'कॉलोनी नागरिक सुधार सॉफ्टवेयर | नगर निगम व वार्ड जवाबदेही | संगठन',
        metaDescEn: 'Organize colony residents, save municipal receiving copies with dates, generate 1-page A4 flyers, and prepare RTI drafts for ward issues.',
        metaDescHi: 'कॉलोनी निवासियों को संगठित करें, नगर निगम की रिसीविंग तारीख सहित सहेजें, ₹1 पर्चे निकालें और वार्ड स्तर पर आरटीआई मसौदे तैयार करें।',
        keywords: ['colony action app India', 'RWA alternative informal group', 'municipal grievance escalation Delhi', 'MCD ward diary tracker', 'pothole complaint tracking software'],
        activistQuoteEn: '“When 200 residents hand an MCD Junior Engineer a typed representation with a diary number, the pothole gets fixed in 72 hours.”',
        activistQuoteHi: '“जब 200 निवासी डायरी नंबर के साथ मुहर लगा मांग पत्र नगर निगम जेई को देते हैं, तो गड्ढा 72 घंटे में भरता है।”',
        groundChallengeEn: 'Residents file verbal complaints or post on WhatsApp groups, which local officials ignore without any accountability or timeline.',
        groundChallengeHi: 'निवासी केवल व्हाट्सएप पर शिकायतें करते हैं, जिसे स्थानीय पार्षद व निगम कर्मचारी बिना किसी जवाबदेही के नजरअंदाज कर देते हैं।',
        solutionOverviewEn: 'Sangathan provides physical A4 printable flyers for colony tea stalls, saves municipal receiving stamps with dates, and prepares a Section 6(1) RTI draft you file yourself if nothing moves.',
        solutionOverviewHi: 'संगठन चाय की दुकानों के लिए ₹1 पर्चे देता है, डायरी नंबर तारीख सहित सहेजता है और काम न होने पर खुद दाखिल करने वाला धारा 6(1) आरटीआई मसौदा तैयार करता है।',
        keyTools: [
          { nameEn: '1-Page Colony Parcha Generator', nameHi: '1-पेज मोहल्ला पर्चा जनरेटर', descEn: 'High-contrast A4 flyers ready for ₹1 photostat machines with problem summary and signature blocks.', descHi: 'समस्या का स्पष्ट विवरण और हस्ताक्षर तालिकाओं वाला ₹1 फोटोस्टेट-रेडी A4 पर्चा।', icon: 'Printer' },
          { nameEn: 'MCD Ward Diary Tracker', nameHi: 'वार्ड डायरी व रिसीविंग ट्रैकर', descEn: 'Save diary numbers from the Junior Engineer (JE) office with stamped photos and dates.', descHi: 'जेई कार्यालय से प्राप्त डायरी संख्या स्टैम्प्ड फोटो और तारीख सहित सहेजें।', icon: 'Clock' },
          { nameEn: 'Section 6(1) RTI Draft Helper', nameHi: 'धारा 6(1) आरटीआई मसौदा सहायक', descEn: 'Prepare an RTI draft asking for file status. You print, sign, pay ₹10 and submit it yourself.', descHi: 'फाइल की स्थिति मांगने वाला आरटीआई मसौदा बनाएं। प्रिंट, हस्ताक्षर, ₹10 शुल्क और जमा आप खुद करें।', icon: 'Scale' }
        ],
        statutoryActs: [
          { titleEn: 'Delhi Municipal Corporation (DMC) Act, 1957', titleHi: 'दिल्ली नगर निगम अधिनियम, 1957', descEn: 'Mandates basic sanitation, road upkeep, and streetlight maintenance by local ward staff.', descHi: 'वार्ड स्तर पर स्वच्छता, सड़क मरम्मत और प्रकाश व्यवस्था बनाए रखने का वैधानिक दायित्व।', provision: 'Sections 42 & 43' },
          { titleEn: 'Right to Information Act, 2005', titleHi: 'सूचना का अधिकार अधिनियम, 2005', descEn: 'Provides citizens the statutory right to inspect official files and obtain work completion estimates.', descHi: 'सरकारी फाइलों के निरीक्षण और कार्य प्रगति रिपोर्ट प्राप्त करने का वैधानिक अधिकार।', provision: 'Section 6(1)' }
        ],
        stepWorkflow: [
          { stepEn: '01', stepHi: '०१', titleEn: 'Generate 1-Page Parcha', titleHi: 'पर्चा जनरेट करें', detailEn: 'Select issue (pothole/drain/garbage), generate ₹1 photostat flyer with signature table.', detailHi: 'समस्या चुनें और हस्ताक्षर तालिका के साथ ₹1 फोटोस्टेट पर्चा तैयार करें।' },
          { stepEn: '02', stepHi: '०२', titleEn: 'Collect 50+ Colony Signatures', titleHi: 'हस्ताक्षर एकत्र करें', detailEn: 'Place the sheet at local chai stalls, resident gates, and evening colony gatherings.', detailHi: 'स्थानीय चाय की दुकान, कॉलोनी गेट और पार्कों में निवासियों के हस्ताक्षर लें।' },
          { stepEn: '03', stepHi: '०३', titleEn: 'Submit & Get Stamped Receiving', titleHi: 'मुहर लगी रिसीविंग लें', detailEn: 'Handover to ward Junior Engineer and photograph the stamped diary number in Sangathan.', detailHi: 'वार्ड जेई को सौंपें और मुहर लगी डायरी संख्या की फोटो ऐप में अपलोड करें।' },
          { stepEn: '04', stepHi: '०४', titleEn: '30-Day RTI Reminder Draft', titleHi: '30-दिवसीय आरटीआई याद', detailEn: 'If nothing moves, prepare a Section 6(1) RTI draft asking for file status. PIO must reply in 30 days.', detailHi: 'काम न होने पर फाइल की स्थिति मांगने वाला धारा 6(1) मसौदा बनाएं। PIO को 30 दिन में जवाब देना होता है।' }
        ],
        faqs: [
          {
            questionEn: 'Do we need a registered RWA to use this tool?',
            questionHi: 'क्या इस टूल का उपयोग करने के लिए पंजीकृत RWA की आवश्यकता है?',
            answerEn: 'No. Sangathan is built specifically for informal citizen groups, colony residents, and unorganized basti collectives without requiring society registration or PAN cards.',
            answerHi: 'नहीं। संगठन विशेष रूप से अनौपचारिक नागरिक समूहों और मोहल्ला निवासियों के लिए बनाया गया है, जिसमें किसी पंजीकरण या पैन कार्ड की आवश्यकता नहीं है।'
          },
          {
            questionEn: 'How does the RTI reminder work?',
            questionHi: 'आरटीआई याद कैसे काम करता है?',
            answerEn: 'Save the stamped receiving with its date. At 30 days — the legal PIO reply period under Section 7(1) — the app reminds you and prepares an RTI draft asking for file status. You print, sign, pay ₹10 and submit it yourself.',
            answerHi: 'मुहर लगी रिसीविंग तारीख सहित सहेजें। 30 दिन पर — धारा 7(1) के तहत PIO की कानूनी जवाब अवधि — ऐप याद दिलाता है और फाइल की स्थिति मांगने वाला मसौदा बनाता है। प्रिंट, हस्ताक्षर, ₹10 और जमा आप करते हैं।'
          }
        ]
      },
      {
        id: 'citizen_science',
        slug: 'citizen-science',
        titleEn: 'Environmental & Citizen Science',
        titleHi: 'पर्यावरण व वायु प्रदूषण निगरानी (नागरिक विज्ञान मॉडल)',
        taglineEn: 'Deploy ground air PM2.5 and water testing teams, log GPS-tagged spot readings, and draft representations to DPCC/CPCB.',
        taglineHi: 'जमीनी प्रदूषण व पानी जांच डेटा दर्ज करें और DPCC/CPCB को प्रतिनिधित्व पत्र का मसौदा बनाएं।',
        metaTitleEn: 'Citizen Science & Air Quality Monitoring App | Ground Audits | Sangathan',
        metaTitleHi: 'पर्यावरण व वायु गुणवत्ता निगरानी सॉफ्टवेयर | नागरिक विज्ञान मॉडल | संगठन',
        metaDescEn: 'Empower ground activists to log PM2.5/PM10 air sensor data, water TDS, and industrial pollution spots with GPS geotagging and draft representations to authorities.',
        metaDescHi: 'कार्यकर्ताओं को PM2.5/PM10 वायु सेंसर डेटा, पानी TDS और प्रदूषण हॉटस्पॉट दर्ज करने और वैधानिक नोटिस जारी करने की शक्ति दें।',
        keywords: ['air quality monitoring app India', 'citizen science environmental app', 'PM2.5 sensor logger', 'DPCC CPCB legal notice generator', 'industrial pollution whistleblower tool'],
        activistQuoteEn: '“Pollution data in government hands is sanitized. Independent citizen science logs on Sangathan force the High Court and NGT to act.”',
        activistQuoteHi: '“सरकारी प्रदूषण आंकड़े वास्तविक स्थिति छिपाते हैं। संगठन पर दर्ज स्वतंत्र नागरिक डेटा से एनजीटी व अदालतों में ठोस कार्रवाई होती है।”',
        groundChallengeEn: 'Community pollution hotspots (smog towers, waste burning, industrial smoke) go unmonitored by government stations located miles away.',
        groundChallengeHi: 'स्थानीय प्रदूषण स्रोत (कचरा जलना, औद्योगिक धुआं) सरकारी मॉनिटरिंग स्टेशनों से दूर होने के कारण रिकॉर्ड ही नहीं होते।',
        solutionOverviewEn: 'Sangathan lets volunteers log portable sensor readings with GPS-tagged photos and draft representations citing the Air Act 1981 and NGT orders — which a person files themselves.',
        solutionOverviewHi: 'संगठन स्वयंसेवकों को पोर्टेबल सेंसर डेटा, जीपीएस तस्वीरें और वायु अधिनियम 1981 के हवाले से प्रतिनिधित्व मसौदे बनाने देता है — जिसे व्यक्ति खुद दाखिल करता है।',
        keyTools: [
          { nameEn: 'Ground Sensor & Hotspot Logger', nameHi: 'ग्राउंड सेंसर व हॉटस्पॉट लॉगर', descEn: 'Record PM2.5, PM10, AQI, and water TDS readings with GPS coordinates and photo evidence.', descHi: 'जीपीएस लोकेशन और तस्वीरों के साथ PM2.5, PM10 और पानी TDS डेटा दर्ज करें।', icon: 'Activity' },
          { nameEn: 'DPCC/CPCB Representation Drafter', nameHi: 'प्रदूषण बोर्ड पत्र मसौदा', descEn: 'Draft representations citing the Air Act 1981 and CAQM GRAP directives for you to file.', descHi: 'वायु अधिनियम 1981 और ग्रैप (GRAP) नियमों के हवाले से पत्र का मसौदा बनाएं, दाखिल आप करें।', icon: 'Scale' },
          { nameEn: 'Public Air Dossier PDF', nameHi: 'सार्वजनिक वायु रिपोर्ट PDF', descEn: 'Export high-contrast printable audit sheets for media briefings and High Court PIL filings.', descHi: 'प्रेस और हाईकोर्ट याचिकाओं के लिए प्रिंट-रेडी नागरिक पर्यावरण रिपोर्ट।', icon: 'FileText' }
        ],
        statutoryActs: [
          { titleEn: 'Air (Prevention & Control of Pollution) Act, 1981', titleHi: 'वायु (प्रदूषण निवारण एवं नियंत्रण) अधिनियम, 1981', descEn: 'Statutory powers of State Pollution Control Boards to penalize polluters upon citizen complaint.', descHi: 'नागरिक शिकायत पर प्रदूषण फैलाने वालों पर दंडात्मक कार्रवाई का वैधानिक अधिकार।', provision: 'Section 31A' },
          { titleEn: 'Commission for Air Quality Management (CAQM) Act, 2021', titleHi: 'वायु गुणवत्ता प्रबंधन आयोग अधिनियम, 2021', descEn: 'Mandates strict Graded Response Action Plan (GRAP) enforcement across Delhi-NCR.', descHi: 'दिल्ली-एनसीआर में ग्रैप (GRAP) पाबंदियों को लागू करने का वैधानिक ढांचा।', provision: 'GRAP Directives' }
        ],
        stepWorkflow: [
          { stepEn: '01', stepHi: '०१', titleEn: 'Log Ground Sensor Reading', titleHi: 'सेंसर रीडिंग दर्ज करें', detailEn: 'Use portable monitor to measure PM2.5/PM10 at the hot-spot with GPS photo.', detailHi: 'पोर्टेबल मॉनिटर से मौके पर PM2.5/PM10 मापें और जीपीएस फोटो लें।' },
          { stepEn: '02', stepHi: '०२', titleEn: 'Generate Violation Notice', titleHi: 'उल्लंघन नोटिस बनाएं', detailEn: 'Auto-generate statutory representation addressed to DPCC Member Secretary.', detailHi: 'प्रदूषण नियंत्रण बोर्ड के सदस्य सचिव के नाम वैधानिक नोटिस तैयार करें।' },
          { stepEn: '03', stepHi: '०३', titleEn: 'Dispatch via WhatsApp/SpeedPost', titleHi: 'स्पीड पोस्ट व व्हाट्सएप भेजें', detailEn: 'Send certified copies to authorities and upload receipt into Sangathan.', detailHi: 'अधिकारियों को प्रमाणित प्रति भेजें और डाक रसीद ऐप में सुरक्षित रखें।' },
          { stepEn: '04', stepHi: '०४', titleEn: 'Publish Community Air Report', titleHi: 'रिपोर्ट सार्वजनिक करें', detailEn: 'Publish verified data on public movement link for journalists and court advocates.', detailHi: 'पत्रकारों और वकीलों के लिए सत्यापित डेटा सार्वजनिक लिंक पर साझा करें।' }
        ],
        faqs: [
          {
            questionEn: 'Can low-cost sensor data be used in legal representations?',
            questionHi: 'क्या लो-कॉस्ट सेंसर डेटा का उपयोग कानूनी नोटिस में किया जा सकता है?',
            answerEn: 'Yes. While regulatory monitors establish official benchmarks, geotagged spot sensor logs with photo timestamps serve as admissible prima facie evidence under Section 65B of the Indian Evidence Act.',
            answerHi: 'हाँ। जीपीएस और फोटो टाइमस्टैम्प के साथ दर्ज स्पॉट डेटा भारतीय साक्ष्य अधिनियम की धारा 65B के तहत प्रथम दृष्टया साक्ष्य के रूप में मान्य है।'
          }
        ]
      },
      {
        id: 'legal_defense',
        slug: 'legal-defense',
        titleEn: 'Human Rights & Legal Defense Network',
        titleHi: 'मानवाधिकार व कानूनी सहायता नेटवर्क',
        taglineEn: 'Emergency SOS broadcasts, police thana custody tracker, advocate dispatch, and BQF verification pathway.',
        taglineHi: 'थाना हिरासत ट्रैकर, आपातकालीन SOS प्रसारण, वकील सहायता और सक्रिय समूहों हेतु BQF सत्यापन मार्ग।',
        metaTitleEn: 'Activist Legal Defense & Emergency SOS App | Rights Protection | Sangathan',
        metaTitleHi: 'कार्यकर्ता विधिक सुरक्षा व आपातकालीन SOS ऐप | कानूनी सहायता | संगठन',
        metaDescEn: 'Protect grassroots organizers with 1-tap emergency custody alerts, detention loggers, panel advocate dispatches, and milestone-based BQF verification.',
        metaDescHi: '1-टैप आपातकालीन हिरासत अलर्ट, थाना ट्रैकर, पैनल वकील सहायता और सक्रिय समूहों के लिए BQF सत्यापन मार्ग से जमीनी कार्यकर्ताओं की रक्षा करें।',
        keywords: ['activist legal defense software', 'emergency SOS thana custody tracker', 'protest legal aid app India', 'Section 8 NGO verification', 'DK Basu guidelines tracker'],
        activistQuoteEn: '“When an activist is detained, the first 60 minutes determine their safety. Sangathan alerts 10 defense advocates before police even enter the thana.”',
        activistQuoteHi: '“हिरासत के शुरुआती 60 मिनट सबसे महत्वपूर्ण होते हैं। संगठन पुलिस के थाने पहुंचने से पहले 10 वकीलों को अलर्ट भेज देता है।”',
        groundChallengeEn: 'During protests or field actions, activists face sudden detentions without immediate legal representation or family notifications.',
        groundChallengeHi: 'धरना-प्रदर्शन या फील्ड एक्शन के दौरान कार्यकर्ताओं को बिना वकील या परिवार को सूचित किए अचानक हिरासत में ले लिया जाता है।',
        solutionOverviewEn: 'Sangathan provides 1-tap GPS SOS alerts, logs detention details against D.K. Basu guidelines, and auto-dispatches panel advocates.',
        solutionOverviewHi: 'संगठन 1-टैप जीपीएस एसओएस, डी.के. बसु दिशा-निर्देशों के अनुसार हिरासत ट्रैकिंग और वकीलों की तत्काल तैनाती सुनिश्चित करता है।',
        keyTools: [
          { nameEn: '1-Tap Rapid Response SOS', nameHi: '1-टैप त्वरित SOS', descEn: 'Instantly broadcast GPS location and audio notes to pre-configured legal defense teams.', descHi: 'कानूनी टीम को तुरंत जीपीएस लोकेशन और ऑडियो संदेश प्रसारित करें।', icon: 'ShieldAlert' },
          { nameEn: 'Thana Custody & D.K. Basu Tracker', nameHi: 'थाना हिरासत व डी.के. बसु ट्रैकर', descEn: 'Log detention time, inspecting officer name, and generate habeas corpus documentation.', descHi: 'हिरासत का समय, जांच अधिकारी का नाम दर्ज करें और बंदी प्रत्यक्षीकरण दस्तावेज बनाएं।', icon: 'Scale' },
          { nameEn: 'BQF Section 8 Verification Pathway', nameHi: 'BQF धारा 8 सत्यापन कार्यक्रम', descEn: 'Milestone-based verification review proving active grassroots standing under registered non-profit governance.', descHi: 'पंजीकृत सेक्शन 8 गैर-लाभकारी संगठन के तहत सक्रिय जमीनी कार्य का सत्यापन।', icon: 'ShieldCheck' }
        ],
        statutoryActs: [
          { titleEn: 'Supreme Court D.K. Basu Guidelines on Arrest (1997)', titleHi: 'सुप्रीम कोर्ट डी.के. बसु गिरफ्तारी दिशा-निर्देश (1997)', descEn: 'Mandates arrest memo, informing next of kin within 12 hours, and physical safety of detainees.', descHi: 'गिरफ्तारी मेमो, 12 घंटे में परिजनों को सूचना और हिरासत में शारीरिक सुरक्षा का वैधानिक अधिकार।', provision: 'AIR 1997 SC 610' },
          { titleEn: 'Code of Criminal Procedure (CrPC / BNSS)', titleHi: 'दंड प्रक्रिया संहिता (CrPC / BNSS)', descEn: 'Statutory rights of arrested persons to meet defense counsel during interrogation.', descHi: 'पूछताछ के दौरान अपने वकील से मिलने का वैधानिक अधिकार।', provision: 'Section 41D CrPC' }
        ],
        stepWorkflow: [
          { stepEn: '01', stepHi: '०१', titleEn: 'Trigger 1-Tap SOS', titleHi: 'SOS ट्रिगर करें', detailEn: 'Field worker taps SOS button; GPS coordinates transmit to central dashboard.', detailHi: 'कार्यकर्ता SOS बटन दबाता है; जीपीएस लोकेशन तुरंत केंद्रीय टीम को मिलती है।' },
          { stepEn: '02', stepHi: '०२', titleEn: 'Advocate Auto-Dispatch', titleHi: 'वकील को अलर्ट', detailEn: 'System alerts nearest panel advocate with police station jurisdiction details.', detailHi: 'सिस्टम संबंधित थाना क्षेत्र के नजदीकी पैनल वकील को तुरंत अलर्ट करता है।' },
          { stepEn: '03', stepHi: '०३', titleEn: 'Verify D.K. Basu Compliance', titleHi: 'नियमों का अनुपालन', detailEn: 'Advocate verifies arrest memo, GD entry, and medical examination on site.', detailHi: 'वकील मौके पर पहुंचकर गिरफ्तारी मेमो, जीडी एंट्री और मेडिकल जांच सत्यापित करता है।' }
        ],
        faqs: [
          {
            questionEn: 'How does BQF Section 8 verification & recognition work?',
            questionHi: 'BQF सेक्शन 8 सत्यापन व मान्यता कैसे मिलती है?',
            answerEn: 'Bahujan Queer Foundation is an officially incorporated Section 8 NGO in Delhi (CIN: U88900DL2025NPL452474). Unregistered collectives that achieve verified milestones of active community groundwork, field spot audits, and transparent governance can apply for reviewed institutional verification.',
            answerHi: 'बहुजन क्वीर फाउंडेशन दिल्ली में पंजीकृत सेक्शन 8 गैर-लाभकारी संस्था है। अनौपचारिक नागरिक समूह जब सक्रिय जमीनी कार्य, फील्ड स्पॉट ऑडिट और पारदर्शी सदस्यता के मानदंड पूरे करते हैं, तो वे समीक्षा-आधारित संस्थागत सत्यापन के लिए आवेदन कर सकते हैं।'
          }
        ]
      },
      {
        id: 'mass_campaigns',
        slug: 'mass-campaigns',
        titleEn: 'Mass Movements & Public Campaigns',
        titleHi: 'जन आंदोलन व सार्वजनिक हस्ताक्षर अभियान',
        taglineEn: 'Organize door-to-door signature campaigns, public referendums, press releases, and multi-collective solidarity fronts.',
        taglineHi: 'हस्ताक्षर अभियान, जनमत संग्रह, प्रेस विज्ञप्ति और सामूहिक फ्रंट बनाकर बड़े पैमाने पर जनहित बदलाव लाएं।',
        metaTitleEn: 'Mass Campaign & Signature Petition Software | Movement Platform | Sangathan',
        metaTitleHi: 'जन आंदोलन व हस्ताक्षर अभियान सॉफ्टवेयर | अभियान प्रबंधन | संगठन',
        metaDescEn: 'Run large-scale public campaigns with physical and digital signatures, bilingual press release dispatches, and joint front coalition coordination.',
        metaDescHi: 'डिजिटल व भौतिक हस्ताक्षर अभियानों, द्विभाषी प्रेस रिलीज स्टूडियो और संयुक्त मोर्चा गठबंधन के साथ बड़े जन आंदोलन चलाएं।',
        keywords: ['mass campaign software India', 'petition signature tool', 'press release dispatch studio', 'joint front coalition engine', 'grassroots referendum app'],
        activistQuoteEn: '“Petitions signed online are easy to ignore. A box containing 10,000 physical signatures dropped at the Collectorate forces the administration to negotiate.”',
        activistQuoteHi: '“केवल ऑनलाइन याचिकाएं खारिज हो जाती हैं। जब 10,000 हस्ताक्षरों का बक्सा कलेक्ट्रेट में रखा जाता है, तो प्रशासन वार्ता के लिए मजबूर होता है।”',
        groundChallengeEn: 'Grassroots campaigns struggle to bridge digital social media signatures with real physical ground turnouts and mainstream media coverage.',
        groundChallengeHi: 'जमीनी आंदोलनों में सोशल मीडिया के समर्थन को वास्तविक धरातल, कलेक्ट्रेट ज्ञापनों और मुख्यधारा मीडिया तक पहुंचाना कठिन होता है।',
        solutionOverviewEn: 'Sangathan unifies physical pen-and-paper signature tallying with 1-click public campaigns, bilingual media releases, and multi-org joint fronts.',
        solutionOverviewHi: 'संगठन भौतिक कागजी हस्ताक्षरों, डिजिटल अभियानों, द्विभाषी प्रेस रिलीज और संयुक्त मोर्चा गठबंधनों को एक मंच पर जोड़ता है।',
        keyTools: [
          { nameEn: 'Bilingual Press Release Studio', nameHi: 'द्विभाषी प्रेस रिलीज स्टूडियो', descEn: 'Draft journalistic English and Hindi media releases with embargo headers and 1-click WhatsApp journalist dispatch.', descHi: 'पत्रकारों के लिए अंग्रेजी व हिंदी प्रेस विज्ञप्तियां तैयार करें और 1-क्लिक में व्हाट्सएप पर भेजें।', icon: 'Newspaper' },
          { nameEn: 'Physical & Digital Petition Ledger', nameHi: 'भौतिक व डिजिटल हस्ताक्षर बहीखाता', descEn: 'Combine online signatures with verified pen-and-paper volunteer sheet tallies.', descHi: 'ऑनलाइन हस्ताक्षरों और जमीनी कार्यकर्ताओं द्वारा जुटाए गए कागजी हस्ताक्षरों को एकीकृत करें।', icon: 'Globe' },
          { nameEn: 'Joint Front Coalition Desk (संयुक्त मोर्चा)', nameHi: 'संयुक्त मोर्चा गठबंधन डेस्क', descEn: 'Form alliances with other movements, co-sign joint representations, and issue unified statements.', descHi: 'अन्य जन संगठनों के साथ मिलकर संयुक्त मोर्चा बनाएं और साझा मांग पत्र जारी करें।', icon: 'Network' }
        ],
        statutoryActs: [
          { titleEn: 'Constitution of India - Article 19(1)(a) & 19(1)(b)', titleHi: 'भारतीय संविधान - अनुच्छेद 19(1)(a) एवं 19(1)(b)', descEn: 'Fundamental right to freedom of speech, expression, and peaceful assembly without arms.', descHi: 'वाक् एवं अभिव्यक्ति की स्वतंत्रता और शांतिपूर्ण सभा करने का मौलिक संवैधानिक अधिकार।', provision: 'Fundamental Rights' }
        ],
        stepWorkflow: [
          { stepEn: '01', stepHi: '०१', titleEn: 'Draft Campaign & Parcha', titleHi: 'मांग पत्र व पर्चा बनाएं', detailEn: 'Create core demands, public campaign URL, and printable street flyers.', detailHi: 'मुख्य मांगें तय करें, सार्वजनिक अभियान लिंक और प्रिंट-रेडी पर्चे निकालें।' },
          { stepEn: '02', stepHi: '०२', titleEn: 'Collect Hybrid Signatures', titleHi: 'हस्ताक्षर अभियान', detailEn: 'Mobilize 100+ volunteers across neighborhoods collecting signatures.', detailHi: 'मोहल्लों और चौपालों में कार्यकर्ताओं द्वारा हस्ताक्षर जुटाएं।' },
          { stepEn: '03', stepHi: '०३', titleEn: 'Dispatch Press Release', titleHi: 'प्रेस विज्ञप्ति जारी करें', detailEn: 'Send bilingual media statement to local bureau chiefs and crime/civic reporters.', detailHi: 'स्थानीय संवाददाताओं और मीडिया दफ्तरों को 1-क्लिक में प्रेस नोट भेजें।' }
        ],
        faqs: [
          {
            questionEn: 'How does the Joint Front Coalition feature work?',
            questionHi: 'संयुक्त मोर्चा फीचर कैसे काम करता है?',
            answerEn: 'Multiple independent collectives on Sangathan can form a named Joint Front (e.g., Delhi Air Action Front) to co-publish press releases, aggregate member counts, and submit joint memorandums to government ministries.',
            answerHi: 'संगठन पर काम कर रहे कई अलग-अलग समूह मिलकर एक संयुक्त मोर्चा (जैसे दिल्ली पर्यावरण संघर्ष मोर्चा) बना सकते हैं, जिससे संयुक्त प्रेस नोट और सामूहिक ज्ञापन दिए जा सकें।'
          }
        ]
      }
    ],
    statutoryCompliance: [
      {
        actName: 'Societies Registration Act, 1860 / Indian Trusts Act, 1882',
        registrationRequirementEn: 'Optional for grassroots civic collectives. Informal unincorporated associations operate under fundamental rights guaranteed by Article 19(1)(c).',
        registrationRequirementHi: 'नागरिक समूहों के लिए अनिवार्य नहीं। अनौपचारिक समूह संविधान के अनुच्छेद 19(1)(c) के तहत मौलिक अधिकारों से संचालित होते हैं।',
        keyFilingsEn: 'No mandatory statutory annual filings for informal collectives; Sangathan provides voluntary internal double-entry cash book auditing.',
        keyFilingsHi: 'अनौपचारिक समूहों के लिए कोई सरकारी वार्षिक रिटर्न अनिवार्य नहीं; संगठन आंतरिक पारदर्शी बहीखाता प्रदान करता है।'
      }
    ],
    faqs: [
      {
        questionEn: 'What is Sangathan for Civic Collectives?',
        questionHi: 'नागरिक समूहों के लिए संगठन क्या है?',
        answerEn: 'Sangathan is an open-source, mobile-first operating system designed specifically for unregistered citizen groups, colony movements, environmental science volunteers, and activist defense teams in India.',
        answerHi: 'संगठन एक मोबाइल-फर्स्ट डिजिटल ऑपरेटिंग सिस्टम है जो भारत में अनौपचारिक नागरिक समूहों, मोहल्ला आंदोलनों, पर्यावरण कार्यकर्ताओं और विधिक सहायता दलों के लिए बनाया गया है।'
      },
      {
        questionEn: 'Is Sangathan completely free for grassroots groups?',
        questionHi: 'क्या संगठन जमीनी समूहों के लिए पूरी तरह निःशुल्क है?',
        answerEn: 'Yes. The Community Tier is ₹0 Forever for grassroots collectives up to 5 member profiles, with open participation (fair-use) for public supporters and petition signers. Beyond 5 actives, metered billing runs (active members − 5) × ₹11/month — no base fee, no annual lock-in.',
        answerHi: 'हाँ। कम्युनिटी टियर 5 सदस्य प्रोफाइल तक के सभी जमीनी समूहों के लिए हमेशा ₹0 है, साथ में सार्वजनिक समर्थकों व याचिका हस्ताक्षरकर्ताओं की खुली भागीदारी (उचित उपयोग)। 5 से अधिक सक्रिय सदस्यों पर मीटर बिलिंग (सक्रिय सदस्य − 5) × ₹11/माह — कोई बेस फीस नहीं, कोई वार्षिक बंधन नहीं।'
      },
      {
        questionEn: 'Does Sangathan work offline in zero-connectivity field conditions?',
        questionHi: 'क्या संगठन बिना इंटरनेट के फील्ड में काम करता है?',
        answerEn: 'Yes. Sangathan is built as an Offline-First Progressive Web App (PWA). Volunteers can record spot audits, signatures, and grievance forms offline; data auto-syncs when internet resumes.',
        answerHi: 'हाँ। संगठन एक ऑफलाइन-फर्स्ट प्रोग्रेसिव वेब ऐप है। कार्यकर्ता बिना इंटरनेट के भी डेटा और हस्ताक्षर दर्ज कर सकते हैं, जो नेटवर्क आने पर स्वतः सिंक हो जाता है।'
      }
    ]
  },

  'ngo': {
    id: 'ngo',
    slug: 'ngo',
    titleEn: 'Registered NGOs & Non-Profits',
    titleHi: 'पंजीकृत स्वयंसेवी संस्थाएं (NGOs)',
    categoryBadgeEn: 'Section 8, Trusts & Societies',
    categoryBadgeHi: 'सोसायटी, ट्रस्ट एवं धारा 8 एनजीओ',
    metaTitleEn: 'NGO Management Software India | 80G Receipts, FCRA & Donor CRM | Sangathan',
    metaTitleHi: 'एनजीओ प्रबंधन सॉफ्टवेयर | 80G रसीदें, FCRA व डोनर सीआरएम | संगठन',
    metaDescEn: 'All-in-one management software for Indian NGOs, Trusts & Societies. 80G/12A tax receipts, CSR-1 grant accounting, volunteer hours logging, and Darpan compliance.',
    metaDescHi: 'भारतीय एनजीओ, ट्रस्ट और सोसायटियों के लिए संपूर्ण प्रबंधन सॉफ्टवेयर। 80G/12A टैक्स रसीदें, सीएसआर अनुदान बहीखाता, स्वयंसेवक ट्रैकर एवं दर्पण अनुपालन।',
    keywords: [
      'NGO management software India', '80G tax receipt generator NGO', 'FCRA compliance tracker',
      'NGO donor CRM software', 'volunteer management system India', 'CSR grant milestone accounting',
      'NGO Darpan portal software', 'Society registration cash book', 'Trust accounting software India',
      'Section 8 non profit CRM'
    ],
    heroHeadlineEn: 'Complete Sovereign Infrastructure for Indian Non-Profits.',
    heroHeadlineHi: 'भारतीय स्वयंसेवी संस्थाओं के लिए पूर्ण पारदर्शी डिजिटल बुनियादी ढांचा।',
    heroSubheadlineEn: 'Replace messy spreadsheets and expensive foreign CRMs with an India-first operating system. Record donations and issue 80G/12A tax receipts, track grant tranches, log volunteer hours, and maintain audit-ready statutory cash books.',
    heroSubheadlineHi: 'बिखरे हुए स्प्रेडशीट और महंगे विदेशी सॉफ्टवेयर छोड़ें। 80G दान रसीदें बनाएं, सीएसआर ग्रांट्स ट्रैक करें, स्वयंसेवक घंटे दर्ज करें और ऑडिट-रेडी बहीखाता रखें।',
    activistQuoteEn: '“Donors don’t just want emotional stories anymore. They demand real-time programmatic fund utilization, 80G compliance, and cryptographic audit trails.”',
    activistQuoteHi: '“दानदाता केवल कहानियां नहीं, बल्कि पारदर्शी फंड उपयोग, त्वरित 80G रसीद और ऑडिट-प्रमाणित बहीखाता चाहते हैं।”',
    quoteAttributionEn: 'National Rural Development & Relief Foundation Lead',
    quoteAttributionHi: 'राष्ट्रीय ग्रामीण विकास एवं राहत फाउंडेशन',
    groundPillars: [
      {
        titleEn: '80G/12A Tax Receipts',
        titleHi: '80G व 12A दान रसीदें',
        descEn: 'Generate compliant PDF tax-exemption receipts with donor PAN and 10BE filing format, labelled 80G/12A when your NGO holds its own registration.',
        descHi: 'दानदाताओं के पैन कार्ड और 10BE फाइलिंग प्रारूप के साथ प्रमाणित टैक्स रसीदें; 80G/12A केवल अपने पंजीकरण पर।',
        icon: 'Receipt'
      },
      {
        titleEn: 'Grant Tranche & Milestone Spend',
        titleHi: 'अनुदान किश्त व बजट लेखाजोखा',
        descEn: 'Track CSR and institutional grants against line-item budgets with real-time remaining balance calculations.',
        descHi: 'सीएसआर और संस्थागत अनुदानों के मद-वार खर्च, शेष राशि और बिल वाउचर का पारदर्शी प्रबंधन।',
        icon: 'Wallet'
      },
      {
        titleEn: 'Cryptographic Volunteer Certificates',
        titleHi: 'प्रमाणित स्वयंसेवक सेवा प्रमाण पत्र',
        descEn: 'Log volunteer hours on ground and issue tamper-evident digital certificates with SHA-256 verification hashes.',
        descHi: 'स्वयंसेवकों के सेवा घंटे दर्ज करें और डिजिटल क्यूआर व SHA-256 सत्यापन वाले आधिकारिक प्रमाण पत्र जारी करें।',
        icon: 'Award'
      },
      {
        titleEn: 'Audit-Ready Double-Entry Ledger',
        titleHi: 'ऑडिट-रेडी डबल-एंट्री कैश बुक',
        descEn: 'Export print-ready statutory cash books, bank ledgers, and receipt registers formatted for Indian Chartered Accountants.',
        descHi: 'सीए (CA) और आयकर ऑडिट के लिए प्रिंट-रेडी कैश बुक, बैंक लेजर और रसीद रजिस्टर 1-क्लिक में डाउनलोड करें।',
        icon: 'ShieldCheck'
      }
    ],
    coreTools: [
      {
        nameEn: '80G Tax Exemption Receipt Engine',
        nameHi: '80G टैक्स छूट रसीद जनरेटर',
        descEn: 'Generates sequentially-numbered PDF receipts with donor PAN and registration number; mark as 80G/12A when your organisation holds its own registration.',
        descHi: 'दानदाता पैन और संस्था पंजीकरण संख्या के साथ क्रमांकित PDF रसीदें; 80G/12A केवल अपने पंजीकरण पर।',
        icon: 'Receipt',
        badge: 'IT Act 1961'
      },
      {
        nameEn: 'Milestone Grant & CSR Accounting',
        nameHi: 'सीएसआर व ग्रांट लेखाजोखा',
        descEn: 'Sanctioned budget vs actual spend tracking with voucher attachment for CSR-1 compliance.',
        descHi: 'सीएसआर-1 अनुपालन के लिए स्वीकृत बजट बनाम वास्तविक खर्च और बिल वाउचर संग्रह।',
        icon: 'Wallet',
        badge: 'CSR-1 Ready'
      },
      {
        nameEn: 'Volunteer Hour Registry & Digital Badges',
        nameHi: 'स्वयंसेवक सेवा रजिस्टर व प्रमाण पत्र',
        descEn: 'Onboard field volunteers, track duty shifts, and issue verifiable digital credentials.',
        descHi: 'स्वयंसेवकों को जोड़ें, फील्ड ड्यूटी ट्रैक करें और सत्यापन योग्य डिजिटल प्रमाण पत्र दें।',
        icon: 'Users',
        badge: 'QR-Verified'
      },
      {
        nameEn: 'Universal Sheets/Excel Importer',
        nameHi: 'यूनिवर्सल डेटा इंपोर्टर',
        descEn: '1-click migration of 10,000+ donor records and member rosters with auto-column matching.',
        descHi: 'एक्सेल और गूगल शीट्स से 10,000+ डोनर व सदस्य रिकॉर्ड्स का 1-क्लिक आसान माइग्रेशन।',
        icon: 'Database',
        badge: 'Zero Data Loss'
      }
    ],
    subtypes: [
      {
        id: 'welfare_relief',
        slug: 'welfare-relief',
        titleEn: 'Education, Health & Relief Welfare',
        titleHi: 'शिक्षा, स्वास्थ्य व राहत वितरण कार्यक्रम',
        taglineEn: 'Volunteer hours logging, 80G/12A donor receipts, beneficiary survey forms, and field distribution audits.',
        taglineHi: 'स्वयंसेवक सेवा घंटे, 80G/12A दान रसीदें, लाभार्थी डेटा सर्वेक्षण और राहत वितरण लेखाजोखा।',
        metaTitleEn: 'Relief Welfare & Health NGO Software | Beneficiary & 80G System | Sangathan',
        metaTitleHi: 'राहत वितरण व स्वास्थ्य एनजीओ सॉफ्टवेयर | लाभार्थी ट्रैकर व 80G रसीद | संगठन',
        metaDescEn: 'Manage ration kits, medical camps, scholarship distributions, volunteer rosters, and 80G donor receipts for relief non-profits.',
        metaDescHi: 'राशन किट, मेडिकल कैंप, छात्रवृत्ति वितरण और स्वयंसेवक प्रबंधन के लिए विशेष एनजीओ सॉफ्टवेयर।',
        keywords: ['relief NGO management software', 'beneficiary survey software India', '80G ration distribution app', 'health camp volunteer tracker'],
        activistQuoteEn: '“When disaster strikes, spreadsheets collapse. Sangathan keeps our distribution audit-ready while feeding 5,000 families daily.”',
        activistQuoteHi: '“आपदा के समय फाइलें खो जाती हैं। संगठन 5,000 परिवारों तक राशन पहुंचाते हुए पूरे ऑडिट को पारदर्शी रखता है।”',
        groundChallengeEn: 'Managing hundreds of field volunteers, beneficiary lists, and individual donor queries during emergency relief operations.',
        groundChallengeHi: 'राहत कार्यों के दौरान सैकड़ों स्वयंसेवकों, लाभार्थी सूचियों और दानदाताओं की 80G रसीदों को संभालना कठिन होता है।',
        solutionOverviewEn: 'Sangathan streamlines beneficiary intake, tracks relief kit dispatches with photos, and records donation receipts that can be shared with donors via WhatsApp — labelled 80G only when your NGO holds its own registration.',
        solutionOverviewHi: 'संगठन लाभार्थियों का त्वरित पंजीकरण करता है, राहत वितरण फोटो रिकॉर्ड रखता है और दान रसीदें दर्ज कर व्हाट्सएप पर दानदाताओं से साझा करता है — 80G केवल अपने पंजीकरण पर।',
        keyTools: [
          { nameEn: 'Beneficiary Intake & Ration Logger', nameHi: 'लाभार्थी पंजीकरण व राशन लॉगर', descEn: 'Track ration kit or medicine disbursements per household with Aadhaar/ID check.', descHi: 'परिवार-वार राशन या दवा वितरण का सुरक्षित रिकॉर्ड।', icon: 'ClipboardList' },
          { nameEn: 'Donation Receipt Dispatch', nameHi: 'दान रसीद वितरण', descEn: 'Record UPI donations and share the generated PDF tax receipt with the donor — labelled 80G/12A when your NGO holds its own registration.', descHi: 'यूपीआई दान दर्ज करें और जनरेट PDF टैक्स रसीद दानदाता के साथ साझा करें — 80G केवल अपने पंजीकरण पर।', icon: 'Receipt' }
        ],
        statutoryActs: [
          { titleEn: 'Income Tax Act, 1961 - Section 80G / 12A', titleHi: 'आयकर अधिनियम, 1961 - धारा 80G / 12A', descEn: '50% tax deduction for donors and annual Form 10BD electronic return filing.', descHi: 'दानदाताओं को 50% टैक्स छूट और वार्षिक फॉर्म 10BD फाइलिंग की वैधानिक व्यवस्था।', provision: 'Section 80G(5)(vi)' }
        ],
        stepWorkflow: [
          { stepEn: '01', stepHi: '०१', titleEn: 'Setup Relief Campaign', titleHi: 'राहत अभियान बनाएं', detailEn: 'Create campaign with target beneficiary count and UPI donation gateway.', detailHi: 'लक्ष्य और यूपीआई डोनेशन लिंक के साथ राहत अभियान शुरू करें।' },
          { stepEn: '02', stepHi: '०२', titleEn: 'Distribute with Offline PWA', titleHi: 'फील्ड में वितरण करें', detailEn: 'Field team checks in beneficiaries offline and logs kit numbers.', detailHi: 'फील्ड टीम बिना इंटरनेट के लाभार्थियों को किट वितरित कर डेटा दर्ज करती है।' },
          { stepEn: '03', stepHi: '०३', titleEn: 'Issue Tax Receipts', titleHi: 'टैक्स रसीदें जारी करें', detailEn: 'Generate and email PDF tax receipts to all contributors — labelled 80G when your NGO holds its own registration.', detailHi: 'सभी दानदाताओं को प्रमाणित टैक्स रसीदें भेजें — 80G केवल अपने पंजीकरण पर।' }
        ],
        faqs: [
          {
            questionEn: 'Does Sangathan support Form 10BD export for IT Department filing?',
            questionHi: 'क्या संगठन फॉर्म 10BD फाइलिंग के लिए डेटा एक्सपोर्ट करता है?',
            answerEn: 'Yes. Sangathan generates annual 10BD CSV files with donor PANs, addresses, and transaction IDs ready for direct upload to the Income Tax e-Filing portal.',
            answerHi: 'हाँ। संगठन आयकर पोर्टल पर सीधे अपलोड करने के लिए दानदाता के पैन और पते के साथ फॉर्म 10BD CSV फाइल तैयार करता है।'
          }
        ]
      },
      {
        id: 'policy_advocacy',
        slug: 'policy-advocacy',
        titleEn: 'Policy Research & Advocacy Think-Tank',
        titleHi: 'नीति अनुसंधान, थिंक-टैंक व पैरवी',
        taglineEn: 'Whitepaper repositories, policy consultation records, empirical survey data, and government representations.',
        taglineHi: 'नीतिगत शोध पत्र, सरकारी प्रतिनिधित्व, जन संवाद और अनुभवजन्य अनुसंधान डेटा।',
        metaTitleEn: 'Policy Think Tank & Advocacy Management Software | Sangathan',
        metaTitleHi: 'नीति अनुसंधान व थिंक-टैंक प्रबंधन सॉफ्टवेयर | संगठन',
        metaDescEn: 'Organize research whitepapers, stakeholder consultation rounds, legal representations, and empirical survey dossiers for policy think-tanks.',
        metaDescHi: 'शोध पत्रों, नीतिगत परामर्शों और अनुभवजन्य डेटा को व्यवस्थित करने के लिए विशेष थिंक-टैंक सॉफ्टवेयर।',
        keywords: ['think tank management software', 'policy advocacy CRM India', 'research whitepaper repository', 'stakeholder consultation software'],
        activistQuoteEn: '“Sound policy advocacy requires rigorous empirical data and clear records of government representations.”',
        activistQuoteHi: '“ठोस नीतिगत बदलाव के लिए मजबूत शोध डेटा और सरकारी पत्राचार का व्यवस्थित रिकॉर्ड जरूरी है।”',
        groundChallengeEn: 'Managing policy submissions, tracking inter-ministerial memos, and securing confidential survey data.',
        groundChallengeHi: 'मंत्रालयों को भेजे गए ज्ञापनों, शोध सर्वेक्षणों और गोपनीय डेटा का व्यवस्थित प्रबंधन न होना।',
        solutionOverviewEn: 'Sangathan provides encrypted document vaults, stakeholder meeting trackers, and automated empirical survey analysis.',
        solutionOverviewHi: 'संगठन सुरक्षित दस्तावेज वॉल्ट, हितधारक बैठक ट्रैकर और स्वचालित सर्वेक्षण विश्लेषण प्रदान करता है।',
        keyTools: [
          { nameEn: 'Sovereign Document Vault', nameHi: 'सुरक्षित दस्तावेज वॉल्ट', descEn: 'Encrypted storage for research datasets, government petitions, and policy drafts.', descHi: 'शोध डेटा और सरकारी ज्ञापनों के लिए सुरक्षित डिजिटल वॉल्ट।', icon: 'Lock' }
        ],
        statutoryActs: [
          { titleEn: 'Societies Registration Act, 1860', titleHi: 'सोसायटी पंजीकरण अधिनियम, 1860', descEn: 'Governs literary, scientific, and educational non-profit societies in India.', descHi: 'वैज्ञानिक, साहित्यिक और नीतिगत गैर-लाभकारी संस्थाओं का वैधानिक ढांचा।', provision: 'Section 20' }
        ],
        stepWorkflow: [
          { stepEn: '01', stepHi: '०१', titleEn: 'Publish Consultation', titleHi: 'परामर्श प्रकाशित करें', detailEn: 'Collect expert inputs via encrypted survey forms.', detailHi: 'विशेषज्ञों और नागरिकों से नीतिगत सुझाव एकत्र करें।' }
        ],
        faqs: [
          {
            questionEn: 'Can we store confidential research whitepapers securely?',
            questionHi: 'क्या हम गोपनीय शोध पत्र सुरक्षित रख सकते हैं?',
            answerEn: 'Yes. Sangathan includes role-based access control and zero-knowledge encrypted document storage.',
            answerHi: 'हाँ। संगठन में भूमिका-आधारित सुरक्षा और एन्क्रिप्टेड स्टोरेज की सुविधा है।'
          }
        ]
      },
      {
        id: 'community_shg',
        slug: 'community-shg',
        titleEn: 'Community Development & Women SHGs',
        titleHi: 'सामुदायिक विकास व महिला स्वयं सहायता समूह (SHG)',
        taglineEn: 'Micro-grants bookkeeping, artisan training workshops, SHG saving logs, and grassroots empowerment projects.',
        taglineHi: 'माइक्रो-अनुदान बहीखाता, कार्यशालाएं, SHG बचत रिकॉर्ड और जमीनी आजीविका परियोजनाएं।',
        metaTitleEn: 'Self Help Group (SHG) Management Software | Sangathan',
        metaTitleHi: 'महिला स्वयं सहायता समूह (SHG) प्रबंधन सॉफ्टवेयर | संगठन',
        metaDescEn: 'Track monthly SHG member savings, internal loan repayments, artisan training attendance, and livelihood micro-grants.',
        metaDescHi: 'एसएचजी बचत, आंतरिक ऋण, आजीविका प्रशिक्षण और जमीनी आजीविका परियोजनाओं के लिए सरल सॉफ्टवेयर।',
        keywords: ['SHG management software India', 'women self help group app', 'micro loan tracking software NGO', 'artisan livelihood ledger'],
        activistQuoteEn: '“When village women manage their own transparent SHG ledger on Sangathan, community self-reliance becomes unstoppable.”',
        activistQuoteHi: '“जब महिलाएं संगठन पर अपना पारदर्शी बचत बहीखाता खुद चलाती हैं, तो आत्मनिर्भरता वास्तविक बनती है।”',
        groundChallengeEn: 'Paper register passbooks get damaged or lost, causing disputes in monthly savings and micro-loan interest calculations.',
        groundChallengeHi: 'कागजी पासबुक फटने या खोने से बचत और ब्याज गणना में विवाद उत्पन्न होते हैं।',
        solutionOverviewEn: 'Sangathan provides a simple bilingual ledger for monthly savings, loan installments, and artisan workshop rosters.',
        solutionOverviewHi: 'संगठन मासिक बचत, ऋण किश्तों और आजीविका प्रशिक्षण के लिए सरल हिंदी बहीखाता प्रदान करता है।',
        keyTools: [
          { nameEn: 'SHG Savings & Loan Ledger', nameHi: 'एसएचजी बचत व ऋण बहीखाता', descEn: 'Track member monthly contributions, interest calculations, and bank linkage status.', descHi: 'सदस्यों की मासिक बचत, ऋण किस्तें और बैंक लिंकेज रिकॉर्ड।', icon: 'Wallet' }
        ],
        statutoryActs: [
          { titleEn: 'NABARD SHG-Bank Linkage Program Guidelines', titleHi: 'नाबार्ड एसएचजी-बैंक लिंकेज दिशा-निर्देश', descEn: 'Standards for group savings, regular meetings, and internal lending ratios.', descHi: 'नियमित बैठक, बचत और आंतरिक ऋण के लिए नाबार्ड के मानक।', provision: 'SHG Norms' }
        ],
        stepWorkflow: [
          { stepEn: '01', stepHi: '०१', titleEn: 'Log Monthly Savings', titleHi: 'मासिक बचत दर्ज करें', detailEn: 'Enter member attendance and monthly saving deposits in 1 tap.', detailHi: 'बैठक में उपस्थित सदस्यों की मासिक बचत दर्ज करें।' }
        ],
        faqs: [
          {
            questionEn: 'Is the SHG module accessible in Hindi?',
            questionHi: 'क्या एसएचजी मॉड्यूल हिंदी में उपलब्ध है?',
            answerEn: 'Yes. The entire SHG interface is available in simple Hindi and English with large mobile-friendly touch targets.',
            answerHi: 'हाँ। पूरा इंटरफ़ेस सरल हिंदी और अंग्रेजी में उपलब्ध है और मोबाइल पर आसानी से चलता है।'
          }
        ]
      },
      {
        id: 'animal_green',
        slug: 'animal-green',
        titleEn: 'Animal Welfare & Green Action',
        titleHi: 'पशु कल्याण, आश्रय व पर्यावरण संरक्षण',
        taglineEn: 'Rescue dispatch tickets, vaccination and foster logs, tree plantation drives, and animal feeder rosters.',
        taglineHi: 'रेस्क्यू डिस्पैच टिकट, टीकाकरण व आश्रय रिकॉर्ड, वृक्षारोपण और पशु आहार रोस्टर।',
        metaTitleEn: 'Animal Rescue & Welfare NGO Software | Foster & Green Action | Sangathan',
        metaTitleHi: 'पशु कल्याण व रेस्क्यू एनजीओ सॉफ्टवेयर | शेल्टर व ग्रीन एक्शन | संगठन',
        metaDescEn: 'Track animal rescue dispatches, sterilization/vaccination records, foster applications, and community feeder rosters.',
        metaDescHi: 'पशु रेस्क्यू टिकट, नसबंदी/टीकाकरण रिकॉर्ड, आश्रय प्रबंधन और वृक्षारोपण अभियानों के लिए सॉफ्टवेयर।',
        keywords: ['animal rescue management software', 'stray dog vaccination tracker India', 'animal shelter CRM', 'tree plantation drive app'],
        activistQuoteEn: '“From reporting an injured stray to veterinary surgery and post-op foster care, Sangathan tracks every rescue life cycle.”',
        activistQuoteHi: '“घायल पशु की सूचना से लेकर सर्जरी और पुनर्वास तक, संगठन हर रेस्क्यू की पूरी निगरानी रखता है।”',
        groundChallengeEn: 'Coordinating emergency rescue calls across city volunteers and tracking multi-dose vaccination schedules.',
        groundChallengeHi: 'रेस्क्यू कॉल्स का तुरंत समन्वय और टीकाकरण की तारीखों का रिकॉर्ड रखना चुनौतीपूर्ण होता है।',
        solutionOverviewEn: 'Sangathan provides live rescue ticket dispatch, foster application workflows, and automated vaccination reminders.',
        solutionOverviewHi: 'संगठन लाइव रेस्क्यू टिकट, फोस्टर आवेदन और स्वचालित टीकाकरण रिमाइंडर उपलब्ध कराता है।',
        keyTools: [
          { nameEn: 'Rescue Dispatch & Medical Log', nameHi: 'रेस्क्यू डिस्पैच व मेडिकल लॉग', descEn: 'Capture injury photos, ambulance dispatch status, and vet clinical notes.', descHi: 'तस्वीर के साथ रेस्क्यू स्थिति और पशु चिकित्सक के पर्चे दर्ज करें।', icon: 'Activity' }
        ],
        statutoryActs: [
          { titleEn: 'Prevention of Cruelty to Animals Act, 1960', titleHi: 'पशु क्रूरता निवारण अधिनियम, 1960', descEn: 'Legal framework establishing AWBI guidelines and protection for community animals.', descHi: 'भारतीय जीव जन्तु कल्याण बोर्ड (AWBI) के नियम और पशु सुरक्षा अधिकार।', provision: 'Section 11 & ABC Rules' }
        ],
        stepWorkflow: [
          { stepEn: '01', stepHi: '०१', titleEn: 'Log Rescue Alert', titleHi: 'रेस्क्यू अलर्ट दर्ज करें', detailEn: 'Upload geo-tagged photo of the distressed animal.', detailHi: 'घायल पशु की जीपीएस फोटो और स्थान अपलोड करें।' }
        ],
        faqs: [
          {
            questionEn: 'Can volunteers access the rescue desk on mobile?',
            questionHi: 'क्या स्वयंसेवक मोबाइल पर रेस्क्यू टिकट देख सकते हैं?',
            answerEn: 'Yes. Field rescuers can accept tickets and update surgery status directly from their smartphones.',
            answerHi: 'हाँ। फील्ड कार्यकर्ता अपने स्मार्टफोन से सीधे टिकट स्वीकार कर स्थिति अपडेट कर सकते हैं।'
          }
        ]
      }
    ],
    statutoryCompliance: [
      {
        actName: 'Income Tax Act 1961 (12A/80G/10BE) & Companies Act 2013 (CSR-1)',
        registrationRequirementEn: 'Mandatory registration with Registrar of Societies/Trusts/MCA, Darpan Portal, and Income Tax e-filing.',
        registrationRequirementHi: 'सोसायटी/ट्रस्ट/MCA, नीति आयोग दर्पण पोर्टल और आयकर विभाग में पंजीकरण।',
        keyFilingsEn: 'Form 10BD (Donor reporting), Form 10B/10BB (Audit Report), CSR-1 annual fund utilization certificates.',
        keyFilingsHi: 'फॉर्म 10BD (दानदाता सूची), फॉर्म 10B/10BB (ऑडिट रिपोर्ट) एवं सीएसआर उपयोगिता प्रमाण पत्र।'
      }
    ],
    faqs: [
      {
        questionEn: 'How does pricing work for registered NGOs and trusts?',
        questionHi: 'पंजीकृत एनजीओ और ट्रस्टों के लिए मूल्य निर्धारण कैसे काम करता है?',
        answerEn: 'NGOs start on the Community Tier (₹0, up to 5 member profiles). Beyond 5 actives, metered billing runs (active members − 5) × ₹11/month with no base fee and no annual lock-in — including Sangathan AI intelligence, plugins and priority support. Whitelabel branding removal is a ₹999 one-time payment.',
        answerHi: 'एनजीओ कम्युनिटी टियर (₹0, 5 सदस्य प्रोफाइल तक) से शुरुआत करते हैं। 5 से अधिक सक्रिय सदस्यों पर मीटर बिलिंग (सक्रिय सदस्य − 5) × ₹11/माह — कोई बेस फीस नहीं, कोई वार्षिक बंधन नहीं — संगठन AI, प्लगइन्स व प्राथमिकता सहायता सहित। व्हाइट-लेबल ब्रांडिंग हटाना ₹999 एकमुश्त है।'
      },
      {
        questionEn: 'How does Sangathan help with NGO audit compliance?',
        questionHi: 'संगठन एनजीओ ऑडिट अनुपालन में कैसे मदद करता है?',
        answerEn: 'Sangathan generates automated, tamper-proof cash books, voucher logs, 80G receipt registers, and Form 10BD CSV files formatted specifically for Indian Chartered Accountants and Income Tax audits.',
        answerHi: 'संगठन स्वचालित कैश बुक, बिल वाउचर लॉग, 80G रसीद रजिस्टर और फॉर्म 10BD फाइल तैयार करता है जिसे सीए सीधे ऑडिट में उपयोग कर सकते हैं।'
      },
      {
        questionEn: 'Can we migrate from our existing Excel sheets or Razorpay/Stripe?',
        questionHi: 'क्या हम अपनी पुरानी एक्सेल फाइलों या रेजरपे से डेटा ला सकते हैं?',
        answerEn: 'Yes. Sangathan includes a Universal Data Importer with automatic column recognition and phone number sanitization, allowing complete migration in under 60 seconds.',
        answerHi: 'हाँ। संगठन के यूनिवर्सल डेटा इंपोर्टर से आप 60 सेकंड में अपनी पुरानी एक्सेल फाइलों से पूरा डेटा ट्रांसफर कर सकते हैं।'
      }
    ]
  },
}
