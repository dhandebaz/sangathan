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
    metaDescEn: 'Purpose-built digital operating system for informal civic groups, colony activists, citizen science teams, and legal defense networks. 1-tap spot audits, ₹1 printable Parchas, 15-day RTI tracker, and BQF verification pathway for active collectives.',
    metaDescHi: 'अनौपचारिक नागरिक समूहों, कॉलोनी कार्यकर्ताओं, पर्यावरण जांच दलों और विधिक रक्षा नेटवर्क के लिए विशेष डिजिटल ऑपरेटिंग सिस्टम। फील्ड जांच, ₹1 पर्चा, 15-दिवसीय आरटीआई ट्रैकर एवं सक्रिय समूहों के लिए BQF सत्यापन मार्ग।',
    keywords: [
      'civic collective software India', 'grassroots movement management', 'colony action tool',
      'citizen science air pollution app Delhi', 'RTI 15-day tracker', 'printable A4 parcha generator',
      'legal defense rapid response', 'BQF verification pathway', 'unregistered group management software',
      'citizen grievance escalation MCD', 'public petition studio India'
    ],
    heroHeadlineEn: 'You Don\'t Need Registration to Organize. You Need Sangathan.',
    heroHeadlineHi: 'बस्ती में बदलाव के लिए पंजीकरण नहीं, संगठित शक्ति चाहिए।',
    heroSubheadlineEn: 'The zero-tech, mobile-first operating system for informal citizen groups, colony monitors, and activist campaigns. Force administrative action with stamped physical records, spot evidence, and statutory RTI countdowns.',
    heroSubheadlineHi: 'अनौपचारिक नागरिक समूहों, मोहल्ला कार्यकर्ताओं और जन अभियानों के लिए पूर्ण डिजिटल प्लेटफॉर्म। मौखिक शिकायतों के बजाय स्टैम्प्ड रिसीविंग, जमीनी सबूत और 15-दिवसीय आरटीआई काउंटडाउन से काम कराएं।',
    activistQuoteEn: '“Babus ignore verbal complaints and WhatsApp forwards. They only act when faced with physical stamped receiving and statutory RTI penalties.”',
    activistQuoteHi: '“सरकारी अधिकारी मौखिक बातों और व्हाट्सएप ग्रुपों को अनदेखा करते हैं। वे केवल लिखित, स्टैम्प्ड और वैधानिक आरटीआई नोटिस से डरते हैं।”',
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
        titleEn: '15-Day Stamped Receiving Tracker',
        titleHi: '15-दिवसीय स्टैम्प्ड रिसीविंग ट्रैकर',
        descEn: 'Log municipal receiving numbers and trigger automatic Section 6(1) RTI applications when babus fail to act within 15 days.',
        descHi: 'नगर निगम की डायरी संख्या दर्ज करें और 15 दिनों में कार्रवाई न होने पर स्वचालित धारा 6(1) आरटीआई आवेदन तैयार करें।',
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
        nameEn: 'Stamped Receiving & RTI Escalation Desk',
        nameHi: 'स्टैम्प्ड रिसीविंग व आरटीआई डेस्क',
        descEn: 'Upload stamped receiving copies from ward offices and start automatic 15-day statutory countdown timers.',
        descHi: 'वार्ड कार्यालयों से मुहर लगी रिसीविंग कॉपी अपलोड करें और 15-दिवसीय वैधानिक काउंटडाउन शुरू करें।',
        icon: 'Clock',
        badge: 'Statutory Accountability'
      },
      {
        nameEn: 'Emergency Legal SOS & Detention Broadcast',
        nameHi: 'आपातकालीन लीगल SOS व हिरासत अलर्ट',
        descEn: 'Instant 1-tap crisis broadcast transmitting GPS coordinates, thana details, and legal defense alert to designated panel advocates.',
        descHi: '1-टैप आपातकालीन प्रसारण जो जीपीएस लोकेशन, थाना विवरण और कानूनी सहायता दल को तुरंत अलर्ट भेजता है।',
        icon: 'ShieldAlert',
        badge: 'Activist Protection'
      }
    ],
    subtypes: [
      {
        id: 'colony_civic',
        slug: 'colony-civic',
        titleEn: 'Neighborhood & Colony Municipal Action',
        titleHi: 'मोहल्ला व कॉलोनी नागरिक सुधार',
        taglineEn: 'Fix broken roads, sewer overflows, uncollected waste & streetlights with ₹1 Parchas and official diary timers.',
        taglineHi: 'सड़क, पानी, सीवर और कचरा समस्याओं पर ₹1 पर्चा और 15-दिवसीय काउंटडाउन डायरी से जवाबदेही सुनिश्चित करें।',
        metaTitleEn: 'Colony Action & Municipal Grievance Software | Ward Accountability | Sangathan',
        metaTitleHi: 'कॉलोनी नागरिक सुधार सॉफ्टवेयर | नगर निगम व वार्ड जवाबदेही | संगठन',
        metaDescEn: 'Organize colony residents, track municipal receiving copies, generate 1-page A4 flyers, and file automated RTI escalations for local ward issues.',
        metaDescHi: 'कॉलोनी निवासियों को संगठित करें, नगर निगम की रिसीविंग ट्रैक करें, ₹1 पर्चे निकालें और वार्ड स्तर पर आरटीआई से त्वरित समाधान पाएं।',
        keywords: ['colony action app India', 'RWA alternative informal group', 'municipal grievance escalation Delhi', 'MCD ward diary tracker', 'pothole complaint tracking software'],
        activistQuoteEn: '“When 200 residents hand an MCD Junior Engineer a typed representation with a diary number, the pothole gets fixed in 72 hours.”',
        activistQuoteHi: '“जब 200 निवासी डायरी नंबर के साथ मुहर लगा मांग पत्र नगर निगम जेई को देते हैं, तो गड्ढा 72 घंटे में भरता है।”',
        groundChallengeEn: 'Residents file verbal complaints or post on WhatsApp groups, which local officials ignore without any accountability or timeline.',
        groundChallengeHi: 'निवासी केवल व्हाट्सएप पर शिकायतें करते हैं, जिसे स्थानीय पार्षद व निगम कर्मचारी बिना किसी जवाबदेही के नजरअंदाज कर देते हैं।',
        solutionOverviewEn: 'Sangathan provides physical A4 printable flyers for colony tea stalls, tracks official municipal receiving stamps, and fires statutory 15-day RTI escalations automatically.',
        solutionOverviewHi: 'संगठन चाय की दुकानों के लिए ₹1 पर्चे तैयार करता है, आधिकारिक डायरी नंबर ट्रैक करता है और 15 दिन बाद स्वतः आरटीआई नोटिस भेजता है।',
        keyTools: [
          { nameEn: '1-Page Colony Parcha Generator', nameHi: '1-पेज मोहल्ला पर्चा जनरेटर', descEn: 'High-contrast A4 flyers ready for ₹1 photostat machines with problem summary and signature blocks.', descHi: 'समस्या का स्पष्ट विवरण और हस्ताक्षर तालिकाओं वाला ₹1 फोटोस्टेट-रेडी A4 पर्चा।', icon: 'Printer' },
          { nameEn: 'MCD Ward Diary Tracker', nameHi: 'वार्ड डायरी व रिसीविंग ट्रैकर', descEn: 'Log receiving numbers from the Junior Engineer (JE) office with active countdown clocks.', descHi: 'जेई कार्यालय से प्राप्त डायरी संख्या दर्ज करें और 15-दिवसीय टाइमर सक्रिय करें।', icon: 'Clock' },
          { nameEn: 'Automated Section 6(1) RTI Drafter', nameHi: 'धारा 6(1) आरटीआई ड्राफ्टर', descEn: 'Generate legally formatted RTI petitions citing DMC Act provisions when work is delayed.', descHi: 'काम में देरी होने पर नगर निगम अधिनियम के तहत स्वचालित आरटीआई मसौदा तैयार करें।', icon: 'Scale' }
        ],
        statutoryActs: [
          { titleEn: 'Delhi Municipal Corporation (DMC) Act, 1957', titleHi: 'दिल्ली नगर निगम अधिनियम, 1957', descEn: 'Mandates basic sanitation, road upkeep, and streetlight maintenance by local ward staff.', descHi: 'वार्ड स्तर पर स्वच्छता, सड़क मरम्मत और प्रकाश व्यवस्था बनाए रखने का वैधानिक दायित्व।', provision: 'Sections 42 & 43' },
          { titleEn: 'Right to Information Act, 2005', titleHi: 'सूचना का अधिकार अधिनियम, 2005', descEn: 'Provides citizens the statutory right to inspect official files and obtain work completion estimates.', descHi: 'सरकारी फाइलों के निरीक्षण और कार्य प्रगति रिपोर्ट प्राप्त करने का वैधानिक अधिकार।', provision: 'Section 6(1)' }
        ],
        stepWorkflow: [
          { stepEn: '01', stepHi: '०१', titleEn: 'Generate 1-Page Parcha', titleHi: 'पर्चा जनरेट करें', detailEn: 'Select issue (pothole/drain/garbage), generate ₹1 photostat flyer with signature table.', detailHi: 'समस्या चुनें और हस्ताक्षर तालिका के साथ ₹1 फोटोस्टेट पर्चा तैयार करें।' },
          { stepEn: '02', stepHi: '०२', titleEn: 'Collect 50+ Colony Signatures', titleHi: 'हस्ताक्षर एकत्र करें', detailEn: 'Place the sheet at local chai stalls, resident gates, and evening colony gatherings.', detailHi: 'स्थानीय चाय की दुकान, कॉलोनी गेट और पार्कों में निवासियों के हस्ताक्षर लें।' },
          { stepEn: '03', stepHi: '०३', titleEn: 'Submit & Get Stamped Receiving', titleHi: 'मुहर लगी रिसीविंग लें', detailEn: 'Handover to ward Junior Engineer and photograph the stamped diary number in Sangathan.', detailHi: 'वार्ड जेई को सौंपें और मुहर लगी डायरी संख्या की फोटो ऐप में अपलोड करें।' },
          { stepEn: '04', stepHi: '०४', titleEn: '15-Day Auto RTI Escalation', titleHi: '15-दिवसीय आरटीआई', detailEn: 'If unrepaired in 15 days, Sangathan generates a statutory Section 6(1) RTI application.', detailHi: '15 दिनों में काम न होने पर ऐप स्वचालित धारा 6(1) आरटीआई आवेदन तैयार करता है।' }
        ],
        faqs: [
          {
            questionEn: 'Do we need a registered RWA to use this tool?',
            questionHi: 'क्या इस टूल का उपयोग करने के लिए पंजीकृत RWA की आवश्यकता है?',
            answerEn: 'No. Sangathan is built specifically for informal citizen groups, colony residents, and unorganized basti collectives without requiring society registration or PAN cards.',
            answerHi: 'नहीं। संगठन विशेष रूप से अनौपचारिक नागरिक समूहों और मोहल्ला निवासियों के लिए बनाया गया है, जिसमें किसी पंजीकरण या पैन कार्ड की आवश्यकता नहीं है।'
          },
          {
            questionEn: 'How does the 15-day RTI countdown work?',
            questionHi: '15-दिवसीय आरटीआई काउंटडाउन कैसे काम करता है?',
            answerEn: 'Once you upload the official receiving stamp, Sangathan activates a 15-day countdown clock. If unresolved, it generates a pre-filled RTI asking for daily progress reports and officer accountability.',
            answerHi: 'जब आप मुहर लगी रिसीविंग अपलोड करते हैं, तो 15 दिन का टाइमर शुरू होता है। काम न होने पर ऐप संबंधित अधिकारी के खिलाफ दैनिक प्रगति रिपोर्ट मांगने वाली आरटीआई तैयार करता है।'
          }
        ]
      },
      {
        id: 'citizen_science',
        slug: 'citizen-science',
        titleEn: 'Environmental & Citizen Science',
        titleHi: 'पर्यावरण व वायु प्रदूषण निगरानी (नागरिक विज्ञान मॉडल)',
        taglineEn: 'Deploy ground air PM2.5 and water testing teams, log GPS-tagged spot sensor readings, and send statutory notices to DPCC/CPCB.',
        taglineHi: 'जमीनी प्रदूषण व पानी जांच डेटा दर्ज करें और DPCC/CPCB को तत्काल वैधानिक नोटिस व RTI भेजें।',
        metaTitleEn: 'Citizen Science & Air Quality Monitoring App | Ground Audits | Sangathan',
        metaTitleHi: 'पर्यावरण व वायु गुणवत्ता निगरानी सॉफ्टवेयर | नागरिक विज्ञान मॉडल | संगठन',
        metaDescEn: 'Empower ground activists to log PM2.5/PM10 air sensor data, water TDS, and industrial pollution spots with GPS geotagging and instant statutory notices.',
        metaDescHi: 'कार्यकर्ताओं को PM2.5/PM10 वायु सेंसर डेटा, पानी TDS और प्रदूषण हॉटस्पॉट दर्ज करने और वैधानिक नोटिस जारी करने की शक्ति दें।',
        keywords: ['air quality monitoring app India', 'citizen science environmental app', 'PM2.5 sensor logger', 'DPCC CPCB legal notice generator', 'industrial pollution whistleblower tool'],
        activistQuoteEn: '“Pollution data in government hands is sanitized. Independent citizen science logs on Sangathan force the High Court and NGT to act.”',
        activistQuoteHi: '“सरकारी प्रदूषण आंकड़े वास्तविक स्थिति छिपाते हैं। संगठन पर दर्ज स्वतंत्र नागरिक डेटा से एनजीटी व अदालतों में ठोस कार्रवाई होती है।”',
        groundChallengeEn: 'Community pollution hotspots (smog towers, waste burning, industrial smoke) go unmonitored by government stations located miles away.',
        groundChallengeHi: 'स्थानीय प्रदूषण स्रोत (कचरा जलना, औद्योगिक धुआं) सरकारी मॉनिटरिंग स्टेशनों से दूर होने के कारण रिकॉर्ड ही नहीं होते।',
        solutionOverviewEn: 'Sangathan allows volunteers to deploy portable sensors, capture GPS-tagged photos, and auto-draft statutory notices citing the Air Act 1981 and NGT orders.',
        solutionOverviewHi: 'संगठन स्वयंसेवकों को पोर्टेबल सेंसर डेटा, जीपीएस तस्वीरें और वायु अधिनियम 1981 के तहत तत्काल विधिक नोटिस तैयार करने की सुविधा देता है।',
        keyTools: [
          { nameEn: 'Ground Sensor & Hotspot Logger', nameHi: 'ग्राउंड सेंसर व हॉटस्पॉट लॉगर', descEn: 'Record PM2.5, PM10, AQI, and water TDS readings with GPS coordinates and photo evidence.', descHi: 'जीपीएस लोकेशन और तस्वीरों के साथ PM2.5, PM10 और पानी TDS डेटा दर्ज करें।', icon: 'Activity' },
          { nameEn: 'DPCC/CPCB Statutory Notice Studio', nameHi: 'प्रदूषण नियंत्रण बोर्ड नोटिस स्टूडियो', descEn: 'Generate legal representations citing Section 31A of Air Act 1981 and CAQM GRAP directives.', descHi: 'वायु अधिनियम 1981 की धारा 31A और ग्रैप (GRAP) नियमों के तहत विधिक नोटिस बनाएं।', icon: 'Scale' },
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
        answerEn: 'Yes. Under our 2-tier Civic Solidarity model, the Community Tier is ₹0 Forever for all grassroots collectives, informal groups, and community volunteers up to 20 core leaders with unlimited public supporters and petition signers. For scaling movements, Sustainer Access provides 500 active cadre slots at ₹1,000/mo with transparent ₹11/cadre/month capacity expansion.',
        answerHi: 'हाँ। हमारे नागरिक एकजुटता मॉडल के तहत, कम्युनिटी टियर सभी जमीनी समूहों, कार्यकर्ताओं और 20 कोर सदस्यों के लिए हमेशा ₹0 (पूर्णतः निःशुल्क) है। बड़े आंदोलनों के लिए संरक्षक योजना 500 सक्रिय काडर ₹1,000/माह में देती है और अतिरिक्त काडर केवल ₹11/माह पर बढ़ते हैं।'
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
    metaDescEn: 'All-in-one management software for Indian NGOs, Trusts & Societies. Automated 80G/12A tax receipts, CSR-1 grant accounting, volunteer hours logging, and Darpan compliance.',
    metaDescHi: 'भारतीय एनजीओ, ट्रस्ट और सोसायटियों के लिए संपूर्ण प्रबंधन सॉफ्टवेयर। स्वचालित 80G/12A टैक्स रसीदें, सीएसआर अनुदान बहीखाता, स्वयंसेवक ट्रैकर एवं दर्पण अनुपालन।',
    keywords: [
      'NGO management software India', '80G tax receipt generator NGO', 'FCRA compliance tracker',
      'NGO donor CRM software', 'volunteer management system India', 'CSR grant milestone accounting',
      'NGO Darpan portal software', 'Society registration cash book', 'Trust accounting software India',
      'Section 8 non profit CRM'
    ],
    heroHeadlineEn: 'Complete Sovereign Infrastructure for Indian Non-Profits.',
    heroHeadlineHi: 'भारतीय स्वयंसेवी संस्थाओं के लिए पूर्ण पारदर्शी डिजिटल बुनियादी ढांचा।',
    heroSubheadlineEn: 'Replace messy spreadsheets and expensive foreign CRMs with an India-first operating system. Issue 80G tax receipts, track grant tranches, log volunteer hours, and maintain audit-ready statutory cash books.',
    heroSubheadlineHi: 'बिखरे हुए स्प्रेडशीट और महंगे विदेशी सॉफ्टवेयर छोड़ें। 80G दान रसीदें बनाएं, सीएसआर ग्रांट्स ट्रैक करें, स्वयंसेवक घंटे दर्ज करें और ऑडिट-रेडी बहीखाता रखें।',
    activistQuoteEn: '“Donors don’t just want emotional stories anymore. They demand real-time programmatic fund utilization, 80G compliance, and cryptographic audit trails.”',
    activistQuoteHi: '“दानदाता केवल कहानियां नहीं, बल्कि पारदर्शी फंड उपयोग, त्वरित 80G रसीद और ऑडिट-प्रमाणित बहीखाता चाहते हैं।”',
    quoteAttributionEn: 'National Rural Development & Relief Foundation Lead',
    quoteAttributionHi: 'राष्ट्रीय ग्रामीण विकास एवं राहत फाउंडेशन',
    groundPillars: [
      {
        titleEn: 'Automated 80G & 12A Receipts',
        titleHi: 'स्वचालित 80G व 12A दान रसीदें',
        descEn: 'Instant compliant PDF tax exemption receipts with PAN, 10BE filing format, and WhatsApp delivery to donors.',
        descHi: 'दानदाताओं के पैन कार्ड और 10BE फाइलिंग प्रारूप के साथ तत्काल प्रमाणित 80G टैक्स रसीदें और व्हाट्सएप डिलीवरी।',
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
        descEn: 'Auto-generates IT-compliant PDF receipts with donor PAN, registration number, and unique serial number.',
        descHi: 'दानदाता पैन, संस्था पंजीकरण संख्या और अद्वितीय क्रमांक के साथ आयकर-अनुपालन PDF रसीद।',
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
        taglineEn: 'Volunteer hours logging, 80G tax-exempt donor receipts, beneficiary survey forms, and field distribution audits.',
        taglineHi: 'स्वयंसेवक सेवा घंटे, 80G दान रसीदें, लाभार्थी डेटा सर्वेक्षण और राहत वितरण लेखाजोखा।',
        metaTitleEn: 'Relief Welfare & Health NGO Software | Beneficiary & 80G System | Sangathan',
        metaTitleHi: 'राहत वितरण व स्वास्थ्य एनजीओ सॉफ्टवेयर | लाभार्थी ट्रैकर व 80G रसीद | संगठन',
        metaDescEn: 'Manage ration kits, medical camps, scholarship distributions, volunteer rosters, and 80G donor receipts for relief non-profits.',
        metaDescHi: 'राशन किट, मेडिकल कैंप, छात्रवृत्ति वितरण और स्वयंसेवक प्रबंधन के लिए विशेष एनजीओ सॉफ्टवेयर।',
        keywords: ['relief NGO management software', 'beneficiary survey software India', '80G ration distribution app', 'health camp volunteer tracker'],
        activistQuoteEn: '“When disaster strikes, spreadsheets collapse. Sangathan keeps our distribution audit-ready while feeding 5,000 families daily.”',
        activistQuoteHi: '“आपदा के समय फाइलें खो जाती हैं। संगठन 5,000 परिवारों तक राशन पहुंचाते हुए पूरे ऑडिट को पारदर्शी रखता है।”',
        groundChallengeEn: 'Managing hundreds of field volunteers, beneficiary lists, and individual donor queries during emergency relief operations.',
        groundChallengeHi: 'राहत कार्यों के दौरान सैकड़ों स्वयंसेवकों, लाभार्थी सूचियों और दानदाताओं की 80G रसीदों को संभालना कठिन होता है।',
        solutionOverviewEn: 'Sangathan automates beneficiary intake, tracks relief kit dispatches with photos, and sends instant 80G receipts to donors on WhatsApp.',
        solutionOverviewHi: 'संगठन लाभार्थियों का त्वरित पंजीकरण करता है, राहत वितरण फोटो रिकॉर्ड रखता है और दानदाताओं को व्हाट्सएप पर 80G रसीद भेजता है।',
        keyTools: [
          { nameEn: 'Beneficiary Intake & Ration Logger', nameHi: 'लाभार्थी पंजीकरण व राशन लॉगर', descEn: 'Track ration kit or medicine disbursements per household with Aadhaar/ID check.', descHi: 'परिवार-वार राशन या दवा वितरण का सुरक्षित रिकॉर्ड।', icon: 'ClipboardList' },
          { nameEn: 'Instant 80G WhatsApp Dispatch', nameHi: 'त्वरित 80G व्हाट्सएप रसीद', descEn: 'Auto-send PDF tax receipt to donor\'s mobile number the moment UPI donation lands.', descHi: 'यूपीआई से दान प्राप्त होते ही दानदाता के व्हाट्सएप पर 80G रसीद भेजें।', icon: 'Receipt' }
        ],
        statutoryActs: [
          { titleEn: 'Income Tax Act, 1961 - Section 80G / 12A', titleHi: 'आयकर अधिनियम, 1961 - धारा 80G / 12A', descEn: '50% tax deduction for donors and annual Form 10BD electronic return filing.', descHi: 'दानदाताओं को 50% टैक्स छूट और वार्षिक फॉर्म 10BD फाइलिंग की वैधानिक व्यवस्था।', provision: 'Section 80G(5)(vi)' }
        ],
        stepWorkflow: [
          { stepEn: '01', stepHi: '०१', titleEn: 'Setup Relief Campaign', titleHi: 'राहत अभियान बनाएं', detailEn: 'Create campaign with target beneficiary count and UPI donation gateway.', detailHi: 'लक्ष्य और यूपीआई डोनेशन लिंक के साथ राहत अभियान शुरू करें।' },
          { stepEn: '02', stepHi: '०२', titleEn: 'Distribute with Offline PWA', titleHi: 'फील्ड में वितरण करें', detailEn: 'Field team checks in beneficiaries offline and logs kit numbers.', detailHi: 'फील्ड टीम बिना इंटरनेट के लाभार्थियों को किट वितरित कर डेटा दर्ज करती है।' },
          { stepEn: '03', stepHi: '०३', titleEn: 'Issue 80G Certificates', titleHi: '80G रसीदें जारी करें', detailEn: 'Auto-generate and email 80G certificates to all contributors.', detailHi: 'सभी दानदाताओं को स्वतः प्रमाणित 80G रसीदें भेजें।' }
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
        answerEn: 'NGOs can start on the Community Tier (₹0 / voluntary) or access the Sustainer Plan for ₹1,000/month (or ₹10,000/year) which includes 500 active staff/volunteer slots, Sangathan AI intelligence, and scalable expansion at ₹11/member/month.',
        answerHi: 'एनजीओ कम्युनिटी टियर (₹0 स्वैच्छिक) से शुरुआत कर सकते हैं या संरक्षक योजना (₹1,000/माह या ₹10,000/वर्ष) चुन सकते हैं जिसमें 500 सक्रिय स्टाफ/स्वयंसेवक स्लॉट, संगठन AI और ₹11/अतिरिक्त सदस्य का पारदर्शी पैमाना शामिल है।'
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

  'student-union': {
    id: 'student_union',
    slug: 'student-union',
    titleEn: 'Student Unions & Campus Councils',
    titleHi: 'छात्र संघ व कैम्पस काउंसिल',
    categoryBadgeEn: 'Universities & Colleges',
    categoryBadgeHi: 'विश्वविद्यालय व महाविद्यालय',
    metaTitleEn: 'Student Union Election Software India | Lyngdoh Compliance & Voting | Sangathan',
    metaTitleHi: 'छात्र संघ चुनाव सॉफ्टवेयर | लिंगदोह अनुपालन व गुप्त मतदान | संगठन',
    metaDescEn: 'Digital infrastructure for Indian universities, colleges, and student unions. Lyngdoh Committee compliance, digital nomination filing, secret ballots, hostel grievance desks, and campus flyer studios.',
    metaDescHi: 'भारतीय विश्वविद्यालयों और छात्र संघों के लिए पूर्ण डिजिटल समाधान। लिंगदोह समिति अनुपालन, डिजिटल नामांकन, गुप्त मतदान, हॉस्टल शिकायत निवारण एवं कैम्पस पर्चा स्टूडियो।',
    keywords: [
      'student union election software India', 'Lyngdoh committee compliance software', 'campus election secret voting app',
      'university hostel grievance software', 'anti-ragging cell complaint portal', 'student movement parcha generator',
      'college union membership management', 'student council election portal'
    ],
    heroHeadlineEn: 'Defend Campus Democracy with Sovereign Digital Tools.',
    heroHeadlineHi: 'छात्र लोकतंत्र को मजबूत करें: निष्पक्ष चुनाव व छात्र अधिकार।',
    heroSubheadlineEn: 'Run tamper-evident campus elections compliant with Supreme Court Lyngdoh norms, file digital nominations, manage hostel mess quality tickets, and mobilize campus agitations with ₹1 photostat flyers.',
    heroSubheadlineHi: 'सुप्रीम कोर्ट लिंगदोह समिति के मानकों के अनुसार निष्पक्ष छात्र संघ चुनाव कराएं, डिजिटल नामांकन लें, हॉस्टल-मेस समस्याओं का समाधान करें और कैम्पस पर्चे जारी करें।',
    activistQuoteEn: '“Student elections are often manipulated with muscle and money. Sangathan gives students cryptographically secure ballots and transparent expenditure audits.”',
    activistQuoteHi: '“छात्र संघ चुनावों में धनबल और धांधली रोकने के लिए संगठन पारदर्शी गुप्त मतदान और लिंगदोह खर्च ऑडिट प्रदान करता है।”',
    quoteAttributionEn: 'Central University Student Union Election Convener',
    quoteAttributionHi: 'केंद्रीय विश्वविद्यालय छात्र संघ चुनाव संयोजक',
    groundPillars: [
      {
        titleEn: 'Lyngdoh Norms & Expense Cap Audits',
        titleHi: 'लिंगदोह समिति अनुपालन व खर्च सीमा',
        descEn: 'Enforce official candidate age limits, attendance thresholds, and ₹5,000 statutory election expenditure caps.',
        descHi: 'प्रत्याशी आयु सीमा, उपस्थिति और ₹5,000 की वैधानिक चुनाव खर्च सीमा का डिजिटल ऑडिट।',
        icon: 'Scale'
      },
      {
        titleEn: 'Tamper-Evident Digital Secret Ballot',
        titleHi: 'सुरक्षित डिजिटल गुप्त मतदान',
        descEn: 'Cryptographic student voter authentication with zero voter coercion and instant transparent tallying.',
        descHi: 'विश्वविद्यालय रोल नंबर आधारित सुरक्षित गुप्त मतदान और त्वरित पारदर्शी परिणाम।',
        icon: 'Vote'
      },
      {
        titleEn: 'Hostel, Mess & Library Grievance Desks',
        titleHi: 'छात्रावास, मेस व लाइब्रेरी शिकायत डेस्क',
        descEn: 'Log daily mess food quality ratings, water cooler breakdowns, and track warden escalations.',
        descHi: 'मेस भोजन गुणवत्ता, पानी, वाई-फाई और हॉस्टल समस्याओं पर वार्डन को सीधी शिकायत व ट्रैकिंग।',
        icon: 'CheckSquare'
      },
      {
        titleEn: 'Campus Flyer & Strike Mandate Studio',
        titleHi: 'कैम्पस पर्चा व हड़ताल जनमत स्टूडियो',
        descEn: 'Draft bilingual campus leaflets for ₹1 photostats and conduct instant General Body Meeting (GBM) referendums.',
        descHi: 'कैम्पस पर्चे बनाएं और आम सभा (GBM) में छात्र मांगों पर तत्काल गोपनीय जनमत संग्रह कराएं।',
        icon: 'Printer'
      }
    ],
    coreTools: [
      {
        nameEn: 'Lyngdoh Digital Nomination Desk',
        nameHi: 'लिंगदोह डिजिटल नामांकन डेस्क',
        descEn: 'Candidate verification for age, academic clearance, and automated expense bill auditing.',
        descHi: 'प्रत्याशी योग्यता जांच, नो-ड्यूज प्रमाणपत्र और चुनावी खर्च का पारदर्शी ब्योरा।',
        icon: 'Scale',
        badge: 'SC Mandated'
      },
      {
        nameEn: 'Campus Secret Ballot Engine',
        nameHi: 'कैम्पस सीक्रेट बैलेट इंजन',
        descEn: 'Anonymous cryptographic voting with single-vote enforcement per verified student ID.',
        descHi: 'छात्र पहचान पत्र आधारित गोपनीय ऑनलाइन व ऑफलाइन मतदान प्रणाली।',
        icon: 'Vote',
        badge: 'Zero Tampering'
      },
      {
        nameEn: 'Hostel & Mess Quality Auditor',
        nameHi: 'मेस व हॉस्टल गुणवत्ता जांच',
        descEn: 'Daily food inspection logs, hygiene photos, and automated notices to Chief Warden.',
        descHi: 'दैनिक भोजन गुणवत्ता जांच, स्वच्छता फोटो और चीफ वार्डन को स्वतः नोटिस।',
        icon: 'Activity',
        badge: 'Ground Welfare'
      },
      {
        nameEn: 'Anonymous Anti-Ragging Cell',
        nameHi: 'गोपनीय एंटी-रैगिंग सेल',
        descEn: '100% confidential complaint filing adhering to UGC 2009 anti-ragging regulations.',
        descHi: 'यूजीसी 2009 नियमों के तहत पूर्णतः गोपनीय शिकायत निवारण व्यवस्था।',
        icon: 'ShieldCheck',
        badge: 'UGC Compliant'
      }
    ],
    subtypes: [
      {
        id: 'campus_elections',
        slug: 'campus-elections',
        titleEn: 'Campus Elections & Lyngdoh Compliance',
        titleHi: 'छात्र संघ चुनाव व लिंगदोह समिति अनुपालन',
        taglineEn: 'Digital nomination filing, expenditure cap auditing, Lyngdoh criteria checks, and tamper-evident secret ballots.',
        taglineHi: 'डिजिटल नामांकन, चुनाव खर्च सीमा ऑडिट, लिंगदोह अनुपालन और सुरक्षित गुप्त मतदान।',
        metaTitleEn: 'Campus Election & Lyngdoh Compliance Software | Sangathan',
        metaTitleHi: 'छात्र संघ चुनाव व लिंगदोह अनुपालन सॉफ्टवेयर | संगठन',
        metaDescEn: 'Run clean college and university student elections with candidate vetting, expenditure caps, and cryptographic secret ballots.',
        metaDescHi: 'कॉलेज और विश्वविद्यालय छात्र संघ चुनावों के लिए डिजिटल नामांकन, लिंगदोह खर्च ऑडिट और गुप्त मतदान।',
        keywords: ['campus election software', 'Lyngdoh committee rules software', 'college union voting system', 'student election nomination software'],
        activistQuoteEn: '“When elections adhere to Lyngdoh norms, genuine student leaders emerge without money power.”',
        activistQuoteHi: '“जब चुनाव लिंगदोह नियमों के तहत होते हैं, तो बिना धनबल के सच्चे छात्र नेता आगे आते हैं।”',
        groundChallengeEn: 'Paper ballot manipulation, excessive illegal spending, and disputes over candidate eligibility.',
        groundChallengeHi: 'कागजी मतपत्रों में गड़बड़ी, अवैध चुनाव खर्च और प्रत्याशी पात्रता पर विवाद।',
        solutionOverviewEn: 'Sangathan provides candidate vetting against Supreme Court norms and cryptographic digital ballots.',
        solutionOverviewHi: 'संगठन लिंगदोह नियमों के तहत प्रत्याशी सत्यापन और सुरक्षित डिजिटल मतदान उपलब्ध कराता है।',
        keyTools: [
          { nameEn: 'Lyngdoh Expense Cap Auditor', nameHi: 'खर्च सीमा ऑडिट', descEn: 'Log bills and verify candidates remain under the statutory ₹5,000 expenditure limit.', descHi: 'प्रत्याशियों के प्रचार खर्च का ₹5,000 की वैधानिक सीमा के तहत ऑडिट।', icon: 'Scale' }
        ],
        statutoryActs: [
          { titleEn: 'Supreme Court Lyngdoh Committee Recommendations (2006)', titleHi: 'सुप्रीम कोर्ट लिंगदोह समिति सिफारिशें (2006)', descEn: 'Binding guidelines for student union elections across all Indian universities.', descHi: 'भारतीय विश्वविद्यालयों में छात्र संघ चुनावों के लिए अनिवार्य दिशानिर्देश।', provision: 'Sections 6.1 - 6.8' }
        ],
        stepWorkflow: [
          { stepEn: '01', stepHi: '०१', titleEn: 'Publish Election Notice', titleHi: 'चुनाव अधिसूचना जारी करें', detailEn: 'Set candidate criteria and voter roll verification dates.', detailHi: 'नामांकन और मतदाता सूची सत्यापन की तिथियां घोषित करें।' }
        ],
        faqs: [
          {
            questionEn: 'How does Sangathan enforce voter secrecy?',
            questionHi: 'संगठन मतदान की गोपनीयता कैसे सुनिश्चित करता है?',
            answerEn: 'Sangathan separates voter authentication from the ballot record using cryptographic hashing, ensuring no one can link a vote to a specific student.',
            answerHi: 'संगठन क्रिप्टोग्राफिक तकनीक से मतदाता पहचान और दिए गए वोट को अलग रखता है जिससे गोपनीयता 100% सुरक्षित रहती है।'
          }
        ]
      },
      {
        id: 'hostel_mess',
        slug: 'hostel-mess',
        titleEn: 'Hostel, Mess & Campus Welfare',
        titleHi: 'छात्रावास, मेस गुणवत्ता व छात्र कल्याण',
        taglineEn: 'Log daily food quality inspections, hostel maintenance requests, library amenity tickets, and warden escalations.',
        taglineHi: 'मेस भोजन गुणवत्ता जांच, छात्रावास रखरखाव शिकायतें और वार्डन स्तर पर त्वरित निवारण।',
        metaTitleEn: 'Hostel Mess & Student Welfare Management | Sangathan',
        metaTitleHi: 'छात्रावास व मेस प्रबंधन सॉफ्टवेयर | संगठन',
        metaDescEn: 'Track mess food inspections, hostel plumbing/electrical tickets, and library seat availability for university students.',
        metaDescHi: 'मेस भोजन निरीक्षण, हॉस्टल मेंटेनेंस और लाइब्रेरी सुविधाओं के प्रबंधन के लिए छात्र कल्याण सॉफ्टवेयर।',
        keywords: ['hostel management software university', 'mess food quality inspection app', 'student grievance portal hostel'],
        activistQuoteEn: '“Mess food quality improves when daily inspection logs with photos are shared directly with the Dean of Student Welfare.”',
        activistQuoteHi: '“जब मेस के भोजन की दैनिक जांच तस्वीरें सीधे छात्र कल्याण संकायाध्यक्ष (DSW) तक पहुंचती हैं, तो सुधार तुरंत होता है।”',
        groundChallengeEn: 'Complaints about substandard food and broken hostel infrastructure get lost in paper complaint registers.',
        groundChallengeHi: 'खराब भोजन और टूटे हॉस्टल की शिकायतें कागजी रजिस्टरों में दबकर रह जाती हैं।',
        solutionOverviewEn: 'Sangathan logs photo-verified inspection tickets and sends automatic escalations to the Warden.',
        solutionOverviewHi: 'संगठन फोटो सहित शिकायत दर्ज करता है और वार्डन व प्रशासन को स्वतः अलर्ट भेजता है।',
        keyTools: [
          { nameEn: 'Daily Mess Inspection Logger', nameHi: 'मेस भोजन गुणवत्ता जांच', descEn: 'Rate hygiene, taste, and nutrition with kitchen photos.', descHi: 'रसोई की तस्वीरों के साथ स्वच्छता और गुणवत्ता का दैनिक रिकॉर्ड।', icon: 'CheckSquare' }
        ],
        statutoryActs: [
          { titleEn: 'UGC Guidelines on Student Entitlements', titleHi: 'यूजीसी छात्र अधिकार दिशा-निर्देश', descEn: 'Mandates minimum living standards and hygienic mess facilities in university hostels.', descHi: 'विश्वविद्यालय छात्रावासों में स्वच्छ भोजन और मूलभूत सुविधाओं की अनिवार्यता।', provision: 'UGC Norms' }
        ],
        stepWorkflow: [
          { stepEn: '01', stepHi: '०१', titleEn: 'Log Mess Rating', titleHi: 'रेटिंग दर्ज करें', detailEn: 'Mess committee logs lunch/dinner quality inspection.', detailHi: 'मेस समिति भोजन गुणवत्ता और स्वच्छता की जांच दर्ज करती है।' }
        ],
        faqs: [
          {
            questionEn: 'Can general students raise hostel repair tickets?',
            questionHi: 'क्या आम छात्र हॉस्टल मरम्मत की शिकायत कर सकते हैं?',
            answerEn: 'Yes. Any resident student can scan the hostel QR code to submit a repair ticket with photos.',
            answerHi: 'हाँ। कोई भी छात्र हॉस्टल क्यूआर कोड स्कैन करके फोटो के साथ मेंटेनेंस शिकायत दर्ज कर सकता है।'
          }
        ]
      },
      {
        id: 'academic_antiragging',
        slug: 'academic-antiragging',
        titleEn: 'Academic Rights & Anti-Ragging Cell',
        titleHi: 'शैक्षणिक अधिकार, शिकायत निवारण व एंटी-रैगिंग सेल',
        taglineEn: 'Fee refund disputes, curriculum grievances, anonymous anti-ragging complaints, and disciplinary hearing records.',
        taglineHi: 'फीस वापसी विवाद, परीक्षा शिकायतें, गोपनीय एंटी-रैगिंग शिकायतें और छात्र सहायता।',
        metaTitleEn: 'Anti-Ragging & Academic Grievance Portal | UGC Compliant | Sangathan',
        metaTitleHi: 'एंटी-रैगिंग व शैक्षणिक अधिकार पोर्टल | यूजीसी अनुपालन | संगठन',
        metaDescEn: 'Confidential anti-ragging reporting, fee refund dispute tracking, and academic grievance resolution under UGC regulations.',
        metaDescHi: 'यूजीसी नियमों के तहत गोपनीय एंटी-रैगिंग शिकायत निवारण और फीस विवाद समाधान प्रणाली।',
        keywords: ['anti-ragging software UGC', 'student academic grievance portal', 'fee refund complaint software college'],
        activistQuoteEn: '“Zero tolerance for ragging requires absolute confidentiality and swift institutional accountability.”',
        activistQuoteHi: '“रैगिंग मुक्त कैम्पस के लिए पूर्ण गोपनीयता और त्वरित कानूनी कार्रवाई जरूरी है।”',
        groundChallengeEn: 'Victims fear retaliation when filing ragging or harassment complaints through open channels.',
        groundChallengeHi: 'पीड़ित छात्र पहचान उजागर होने और बदले की कार्रवाई के डर से शिकायत दर्ज नहीं करा पाते।',
        solutionOverviewEn: 'Sangathan provides 100% anonymous complaint channels with encrypted evidence uploads directly to the Anti-Ragging Committee.',
        solutionOverviewHi: 'संगठन एंटी-रैगिंग कमेटी को पूर्णतः गोपनीय और एन्क्रिप्टेड शिकायत भेजने की सुविधा देता है।',
        keyTools: [
          { nameEn: 'Anonymous Incident Desk', nameHi: 'गोपनीय शिकायत डेस्क', descEn: 'Submit complaints without revealing identity, with token-based follow-up.', descHi: 'पहचान उजागर किए बिना शिकायत दर्ज करें और टोकन नंबर से प्रगति देखें।', icon: 'ShieldCheck' }
        ],
        statutoryActs: [
          { titleEn: 'UGC Regulations on Curbing the Menace of Ragging in Higher Educational Institutions, 2009', titleHi: 'यूजीसी रैगिंग रोकथाम विनियम, 2009', descEn: 'Statutory mandate to investigate complaints within 24 hours.', descHi: '24 घंटे के भीतर रैगिंग शिकायतों की जांच करने का वैधानिक निर्देश।', provision: 'Regulation 6.3' }
        ],
        stepWorkflow: [
          { stepEn: '01', stepHi: '०१', titleEn: 'Submit Confidential Report', titleHi: 'गोपनीय रिपोर्ट दर्ज करें', detailEn: 'Student submits details anonymously and receives a private access key.', detailHi: 'छात्र बिना नाम बताए विवरण दर्ज करता है और गुप्त एक्सेस की प्राप्त करता है।' }
        ],
        faqs: [
          {
            questionEn: 'Is the student identity protected from college authorities?',
            questionHi: 'क्या छात्र की पहचान कॉलेज प्रशासन से भी सुरक्षित रहती है?',
            answerEn: 'Yes. The system uses zero-knowledge encryption so even administrators cannot see the student name unless voluntarily provided.',
            answerHi: 'हाँ। सिस्टम में पहचान पूरी तरह सुरक्षित रहती है और छात्र की सहमति के बिना नाम दिखाई नहीं देता।'
          }
        ]
      },
      {
        id: 'student_movement',
        slug: 'student-movement',
        titleEn: 'Student Activism & Fee Agitations',
        titleHi: 'छात्र आंदोलन, पर्चा वितरण व संघर्ष मोर्चा',
        taglineEn: 'Campus flyer distribution, general body meetings (GBMs), strike mandates, and solidarity campaigns across universities.',
        taglineHi: 'कैम्पस पर्चा अभियान, आम सभा (GBM) आयोजन, फीस वृद्धि आंदोलन और अंतर-विश्वविद्यालय एकजुटता।',
        metaTitleEn: 'Student Movement & Campus Organizing Software | Sangathan',
        metaTitleHi: 'छात्र आंदोलन व कैम्पस पर्चा सॉफ्टवेयर | संगठन',
        metaDescEn: 'Mobilize university students against fee hikes, organize general body meetings, print ₹1 campus flyers, and build inter-college coalitions.',
        metaDescHi: 'फीस वृद्धि के खिलाफ छात्र लामबंदी, आम सभा (GBM) जनमत, ₹1 कैम्पस पर्चे और विश्वविद्यालय एकजुटता मोर्चा।',
        keywords: ['student movement software', 'campus flyer parcha generator', 'fee hike agitation app', 'university strike referendum tool'],
        activistQuoteEn: '“When the administration arbitrarily hikes fees by 300%, a unified student strike mandate backed by 5,000 votes reverses the decision.”',
        activistQuoteHi: '“जब प्रशासन मनमाने ढंग से फीस बढ़ाता है, तो 5,000 छात्रों का लोकतांत्रिक जनमत ही उसे वापस लेने पर मजबूर करता है।”',
        groundChallengeEn: 'Spreading information across university hostels and getting accurate turnout mandates for general body meetings.',
        groundChallengeHi: 'विशाल कैम्पस में हॉस्टलों तक पर्चा पहुंचाना और आम सभा में वैध जनमत तैयार करना।',
        solutionOverviewEn: 'Sangathan prints high-contrast campus flyers for canteens and conducts instant mobile strike referendums.',
        solutionOverviewHi: 'संगठन कैंटीन के लिए ₹1 पर्चे बनाता है और छात्रों के बीच ऑनलाइन हड़ताल जनमत संग्रह कराता है।',
        keyTools: [
          { nameEn: 'Campus Agit-Prop Parcha Studio', nameHi: 'कैम्पस पर्चा स्टूडियो', descEn: 'Generate high-contrast flyers ready for college photostat corners.', descHi: 'कॉलेज फोटोस्टेट मशीनों के लिए उच्च-कंट्रास्ट A4 पर्चे।', icon: 'Printer' }
        ],
        statutoryActs: [
          { titleEn: 'Constitution of India - Article 19(1)(c)', titleHi: 'भारतीय संविधान - अनुच्छेद 19(1)(c)', descEn: 'Fundamental right of students to form democratic unions and associations.', descHi: 'छात्रों को लोकतांत्रिक संघ और संगठन बनाने का मौलिक अधिकार।', provision: 'Article 19(1)(c)' }
        ],
        stepWorkflow: [
          { stepEn: '01', stepHi: '०१', titleEn: 'Generate Campus Parcha', titleHi: 'पर्चा निकालें', detailEn: 'Draft demands on fee hike and print 200 copies for hostel distribution.', detailHi: 'मांग पत्र तैयार करें और हॉस्टलों में बांटने के लिए ₹1 पर्चे निकालें।' }
        ],
        faqs: [
          {
            questionEn: 'How can students vote in a campus strike referendum?',
            questionHi: 'छात्र हड़ताल जनमत में कैसे वोट कर सकते हैं?',
            answerEn: 'Verified students receive a secure 1-time link to vote yes/no on the strike resolution within a 4-hour window.',
            answerHi: 'सत्यापित छात्रों को सुरक्षित लिंक मिलता है जिससे वे हड़ताल प्रस्ताव पर 4 घंटे में अपना गोपनीय मत दे सकते हैं।'
          }
        ]
      }
    ],
    statutoryCompliance: [
      {
        actName: 'Supreme Court Lyngdoh Committee Mandate (2006) & UGC Regulations',
        registrationRequirementEn: 'Operates within university statutes or independent student democratic councils.',
        registrationRequirementHi: 'विश्वविद्यालय संविधियों या स्वतंत्र लोकतांत्रिक छात्र परिषदों के तहत संचालन।',
        keyFilingsEn: 'Election expense returns submitted to Dean of Student Welfare / Election Commissioner.',
        keyFilingsHi: 'डीएसडब्ल्यू (DSW) या मुख्य चुनाव आयुक्त को चुनाव खर्च का अंतिम ब्योरा सौंपना।'
      }
    ],
    faqs: [
      {
        questionEn: 'Can Sangathan be used for college departmental elections?',
        questionHi: 'क्या संगठन का उपयोग विभागीय चुनावों के लिए किया जा सकता है?',
        answerEn: 'Yes. Sangathan supports elections at every scale, from small departmental student councils (50 voters) to university-wide presidential elections (50,000+ voters).',
        answerHi: 'हाँ। संगठन छोटे विभागीय छात्र संघों से लेकर 50,000+ छात्रों वाले केंद्रीय विश्वविद्यालय चुनावों तक सभी स्तरों पर काम करता है।'
      },
      {
        questionEn: 'Is Sangathan free for university student unions and candidate panels?',
        questionHi: 'क्या छात्र संघों व पैनलों के लिए संगठन निःशुल्क है?',
        answerEn: 'Yes! Student panels and independent unions can use Sangathan for ₹0 Forever on the Community Tier (up to 20 elected council leaders with unlimited voting students and petition signers). Sustainer access provides 500 active council slots at ₹1,000/mo.',
        answerHi: 'हाँ! छात्र पैनल और स्वतंत्र यूनियन कम्युनिटी टियर पर हमेशा ₹0 में उपयोग कर सकते हैं (20 निर्वाचित पदाधिकारी, असीमित छात्र मतदाता व समर्थक)।'
      }
    ]
  },

  'workers-union': {
    id: 'workers_union',
    slug: 'workers-union',
    titleEn: 'Workers & Trade Unions',
    titleHi: 'श्रमिक व ट्रेड यूनियन',
    categoryBadgeEn: 'Organized & Gig Labor',
    categoryBadgeHi: 'संगठित, फैक्ट्री व गिग श्रमिक',
    metaTitleEn: 'Trade Union Management Software India | Trade Unions Act 1926 & CBA | Sangathan',
    metaTitleHi: 'ट्रेड यूनियन प्रबंधन सॉफ्टवेयर | ट्रेड यूनियन एक्ट 1926 व वेतन समझौता | संगठन',
    metaDescEn: 'Digital operating system for Indian trade unions, plant cadre, factory workers, and gig delivery riders. Form H annual returns, CBA wage negotiations, shift rosters, strike ballots, and factory safety logs.',
    metaDescHi: 'भारतीय ट्रेड यूनियनों, फैक्ट्री वर्करों और गिग डिलीवरी राइडर्स के लिए विशेष सॉफ्टवेयर। फॉर्म H वार्षिक रिटर्न, वेतन मांग पत्र, हड़ताल मतदान और कार्यस्थल सुरक्षा निरीक्षण।',
    keywords: [
      'trade union management software India', 'Trade Unions Act 1926 Form H software', 'collective bargaining agreement software',
      'factory safety audit OSHA app India', 'gig worker union app delivery rider', 'plant cadre levy collection software',
      'strike notice Section 22 23 generator', 'union membership card printer'
    ],
    heroHeadlineEn: 'Sovereign Digital Power for the Working Class.',
    heroHeadlineHi: 'मज़दूर एकता की डिजिटल ताकत: वेतन समझौता व वैधानिक अधिकार।',
    heroSubheadlineEn: 'Manage plant cadre, automate Trade Unions Act Form H returns, draft tripartite Charters of Demands, track factory safety violations, and collect monthly union levy transparently.',
    heroSubheadlineHi: 'प्लांट यूनिटों को संगठित करें, ट्रेड यूनियन अधिनियम फॉर्म H रिटर्न तैयार करें, वेतन मांग पत्र का मसौदा बनाएं, फैक्ट्री सुरक्षा जांचें और मासिक चंदा पारदर्शी रूप से इकट्ठा करें।',
    activistQuoteEn: '“Management relies on expensive corporate lawyers. Sangathan gives union leaders statutory calculators, strike authorization tallies, and airtight legal notices.”',
    activistQuoteHi: '“प्रबंधन महंगे कॉरपोरेट वकीलों के सहारे चलता है। संगठन यूनियन नेताओं को वैधानिक मांग पत्र, गुप्त हड़ताल मतदान और मजबूत कानूनी हथियार देता है।”',
    quoteAttributionEn: 'Automobile & Engineering Workers Union General Secretary',
    quoteAttributionHi: 'ऑटोमोबाइल व इंजीनियरिंग वर्कर्स यूनियन महासचिव',
    groundPillars: [
      {
        titleEn: 'Form H Statutory Returns & Register',
        titleHi: 'फॉर्म H वैधानिक वार्षिक रिटर्न',
        descEn: 'Auto-generate audited annual returns, membership rolls, and general fund balance sheets formatted for the Registrar of Trade Unions.',
        descHi: 'रजिस्ट्रार ऑफ ट्रेड यूनियन्स के लिए फॉर्म H वार्षिक रिटर्न, सदस्य पंजी और सामान्य निधि का ऑडिट-रेडी ब्योरा।',
        icon: 'FileText'
      },
      {
        titleEn: 'CBA Wage Talks & Charter of Demands',
        titleHi: 'सामूहिक सौदाकारी (CBA) व मांग पत्र',
        descEn: 'Draft tripartite wage revision demands, cost-of-living allowance (VDA) matrices, and track management negotiation minutes.',
        descHi: 'वेतन वृद्धि, महंगाई भत्ता (VDA) गणना और प्रबंधन के साथ त्रिपक्षीय वार्ता के कार्यवृत्त (मिनट्स) का रिकॉर्ड।',
        icon: 'Scale'
      },
      {
        titleEn: 'Strike Authorization Secret Ballot',
        titleHi: 'हड़ताल अधिकार गोपनीय मतदान',
        descEn: 'Conduct legally binding secret strike ballots compliant with Industrial Disputes Act Section 22/23 notices.',
        descHi: 'औद्योगिक विवाद अधिनियम की धारा 22/23 के तहत वैध और गोपनीय हड़ताल मतदान कराएं।',
        icon: 'Vote'
      },
      {
        titleEn: 'Gig & Platform Worker Solidarity',
        titleHi: 'गिग वर्कर व डिलीवरी राइडर सुरक्षा',
        descEn: 'Mutual-aid accident relief funds, dynamic rate-card dispute loggers, and digital gig union membership credentials.',
        descHi: 'डिलीवरी राइडर्स के लिए दुर्घटना सहायता कोष, रेट-कार्ड विवाद निवारण और डिजिटल सदस्यता कार्ड।',
        icon: 'HardHat'
      }
    ],
    coreTools: [
      {
        nameEn: 'Trade Unions Act Form H Generator',
        nameHi: 'ट्रेड यूनियन एक्ट फॉर्म H जनरेटर',
        descEn: 'Pre-filled statutory annual return with membership rolls and general fund cash ledger.',
        descHi: 'सदस्यता ब्योरे और सामान्य निधि लेजर के साथ तैयार आधिकारिक फॉर्म H रिटर्न।',
        icon: 'FileText',
        badge: 'Statutory Form H'
      },
      {
        nameEn: 'CBA Charter of Demands Studio',
        nameHi: 'वेतन मांग पत्र (CBA) ड्राफ्टर',
        descEn: 'Templates for 3-year wage settlements, shift allowances, and statutory bonus demands.',
        descHi: '3-वर्षीय वेतन समझौते, शिफ्ट भत्ते और बोनस मांगों के लिए विधिक प्रारूप।',
        icon: 'Scale',
        badge: 'Tripartite Standard'
      },
      {
        nameEn: 'Plant Levy & UPI Chanda Ledger',
        nameHi: 'मासिक चंदा व लेवी बहीखाता',
        descEn: 'Track ₹50/₹100 monthly union subscription per shopfloor unit with instant SMS/WhatsApp receipts.',
        descHi: 'प्लांट यूनिट-वार मासिक यूनियन लेवी का पारदर्शी संग्रह और रसीदें।',
        icon: 'Wallet',
        badge: 'Audit-Ready'
      },
      {
        nameEn: 'Workplace Safety & OSHA Violation Desk',
        nameHi: 'कार्यस्थल सुरक्षा व फैक्ट्री निरीक्षण',
        descEn: 'Capture hazard photos, track accidental injury compensation, and dispatch notices to Factory Inspectorate.',
        descHi: 'फैक्ट्री खतरों की तस्वीरें, दुर्घटना मुआवजा क्लेम और फैक्ट्री इंस्पेक्टर को नोटिस।',
        icon: 'AlertTriangle',
        badge: 'Factories Act 1948'
      }
    ],
    subtypes: [
      {
        id: 'cba_negotiations',
        slug: 'cba-negotiations',
        titleEn: 'Collective Bargaining (CBA) & Wage Talks',
        titleHi: 'सामूहिक सौदाकारी (CBA) व वेतन मांग पत्र',
        taglineEn: 'Draft tripartite Charters of Demands, track management minutes, strike authorization ballots, and cost-of-living index.',
        taglineHi: 'वेतन व भत्ते मांग पत्र तैयार करें, प्रबंधन वार्ता ट्रैक करें और गोपनीय हड़ताल मतदान कराएं।',
        metaTitleEn: 'Collective Bargaining Agreement (CBA) Software | Trade Union Wage Talks | Sangathan',
        metaTitleHi: 'सामूहिक सौदाकारी (CBA) व वेतन मांग पत्र सॉफ्टवेयर | संगठन',
        metaDescEn: 'Draft Charters of Demands, track wage settlement negotiations, compute VDA matrices, and conduct strike authorization votes.',
        metaDescHi: 'ट्रेड यूनियनों के लिए वेतन मांग पत्र, महंगाई भत्ता गणना, प्रबंधन वार्ता मिनट्स और हड़ताल मतदान।',
        keywords: ['collective bargaining software India', 'trade union charter of demands app', 'wage settlement software union', 'strike authorization voting tool'],
        activistQuoteEn: '“Management always claims losses during wage talks. Our cost-of-living data on Sangathan proves workers need a 25% hike.”',
        activistQuoteHi: '“प्रबंधन हमेशा घाटे का दावा करता है। संगठन पर दर्ज महंगाई डेटा साबित करता है कि मज़दूरों को 25% वेतन वृद्धि चाहिए।”',
        groundChallengeEn: 'Tracking complex multi-round negotiations with plant HR and maintaining worker consensus across departments.',
        groundChallengeHi: 'प्रबंधन के साथ कई दौर की वार्ता का रिकॉर्ड रखना और विभिन्न विभागों के मज़दूरों में सहमति बनाना।',
        solutionOverviewEn: 'Sangathan provides structured demand templates, negotiation minutes trackers, and instant secret worker polls.',
        solutionOverviewHi: 'संगठन मांग पत्र प्रारूप, वार्ता मिनट्स ट्रैकर और मज़दूरों के बीच त्वरित गुप्त मतदान उपलब्ध कराता है।',
        keyTools: [
          { nameEn: 'Tripartite Negotiation Minutes Tracker', nameHi: 'वार्ता मिनट्स ट्रैकर', descEn: 'Log agreed vs disputed clauses in real-time.', descHi: 'सहमति और असहमति वाले बिंदुओं का तारीख-वार रिकॉर्ड।', icon: 'Scale' }
        ],
        statutoryActs: [
          { titleEn: 'Industrial Disputes Act, 1947', titleHi: 'औद्योगिक विवाद अधिनियम, 1947', descEn: 'Legal framework for collective bargaining, conciliation, and Section 22/23 strike notices.', descHi: 'सामूहिक सौदाकारी, सुलह और धारा 22/23 हड़ताल नोटिस की वैधानिक व्यवस्था।', provision: 'Sections 18 & 22' }
        ],
        stepWorkflow: [
          { stepEn: '01', stepHi: '०१', titleEn: 'Draft Charter of Demands', titleHi: 'मांग पत्र तैयार करें', detailEn: 'Input basic wage, DA, HRA, and safety equipment demands.', detailHi: 'मूल वेतन, महंगाई भत्ता और सुरक्षा उपकरणों की मांगें तय करें।' }
        ],
        faqs: [
          {
            questionEn: 'How does Sangathan help file strike notices?',
            questionHi: 'संगठन हड़ताल नोटिस देने में कैसे मदद करता है?',
            answerEn: 'Sangathan generates official Form L/M strike notices citing Industrial Disputes Act provisions with 14-day statutory notice periods.',
            answerHi: 'संगठन औद्योगिक विवाद अधिनियम के तहत 14-दिवसीय अनिवार्य नोटिस के साथ फॉर्म L/M हड़ताल नोटिस तैयार करता है।'
          }
        ]
      },
      {
        id: 'safety_inspectorate',
        slug: 'safety-inspectorate',
        titleEn: 'Workplace Safety & Factory Audits',
        titleHi: 'कार्यस्थल सुरक्षा, दुर्घटना रिपोर्टिंग व फैक्ट्री निरीक्षण',
        taglineEn: 'OSHA hazard logs, machine safety audits, accidental injury claims, and statutory representations to Factory Inspectorate.',
        taglineHi: 'मशीन सुरक्षा जांच, दुर्घटना मुआवजा क्लेम और फैक्ट्री इंस्पेक्टर को कानूनी नोटिस।',
        metaTitleEn: 'Factory Safety & Workplace Hazard Logger | Factories Act 1948 | Sangathan',
        metaTitleHi: 'फैक्ट्री सुरक्षा व कार्यस्थल दुर्घटना निवारण सॉफ्टवेयर | संगठन',
        metaDescEn: 'Log shopfloor safety hazards, machine guarding failures, accidental injury claims, and file representations to the Chief Inspector of Factories.',
        metaDescHi: 'फैक्ट्री में मशीन सुरक्षा, रासायनिक खतरे, दुर्घटना मुआवजा और फैक्ट्री इंस्पेक्टर को वैधानिक नोटिस।',
        keywords: ['factory safety audit software India', 'workplace injury compensation tracker', 'Factories Act 1948 safety app'],
        activistQuoteEn: '“Worker safety is non-negotiable. Every unmaintained machine and missing guard is logged on Sangathan before an injury occurs.”',
        activistQuoteHi: '“मज़दूर की जान की कीमत है। किसी भी अनसेफ मशीन या लापरवाही को संगठन पर तुरंत दर्ज कर सुधार कराया जाता है।”',
        groundChallengeEn: 'Factory managements conceal minor accidents and fail to provide mandatory personal protective equipment (PPE).',
        groundChallengeHi: 'प्रबंधन अक्सर छोटी दुर्घटनाओं को दबा देता है और सुरक्षा उपकरण (PPE) उपलब्ध नहीं कराता।',
        solutionOverviewEn: 'Sangathan allows shop stewards to capture photo evidence of hazards and auto-dispatch statutory notices.',
        solutionOverviewHi: 'संगठन पर शॉप प्रतिनिधि खतरों की फोटो खींचकर सीधे फैक्ट्री इंस्पेक्टर को नोटिस भेज सकते हैं।',
        keyTools: [
          { nameEn: 'Hazard & Near-Miss Logger', nameHi: 'खतरा व दुर्घटना लॉगर', descEn: 'Photograph unmaintained machines and missing fire exits with timestamps.', descHi: 'खतरनाक मशीनों और आपातकालीन निकास की कमी का फोटो रिकॉर्ड।', icon: 'AlertTriangle' }
        ],
        statutoryActs: [
          { titleEn: 'Factories Act, 1948', titleHi: 'कारखाना अधिनियम, 1948', descEn: 'Mandates machine guarding, ventilation, and statutory compensation for workplace injuries.', descHi: 'मशीन सुरक्षा, स्वच्छ वातावरण और दुर्घटना पर वैधानिक मुआवजे का अधिकार।', provision: 'Chapters III & IV' },
          { titleEn: 'Employees’ Compensation Act, 1923', titleHi: 'कर्मचारी प्रतिकर अधिनियम, 1923', descEn: 'Statutory framework for compensation in case of fatal or disabling workplace injuries.', descHi: 'कार्यस्थल पर चोट या मृत्यु की स्थिति में वैधानिक मुआवजे का नियम।', provision: 'Section 3' }
        ],
        stepWorkflow: [
          { stepEn: '01', stepHi: '०१', titleEn: 'Log Hazard Incident', titleHi: 'खतरा दर्ज करें', detailEn: 'Shop steward photographs unsafe machinery or missing PPE.', detailHi: 'प्रतिनिधि असुरक्षित मशीन या पीपीई की कमी की फोटो लेता है।' }
        ],
        faqs: [
          {
            questionEn: 'Can accident logs be shared with labor court advocates?',
            questionHi: 'क्या दुर्घटना रिकॉर्ड श्रम न्यायालय के वकीलों को दिया जा सकता है?',
            answerEn: 'Yes. Sangathan exports certified injury dossiers with photo timestamps and medical bills for compensation claims.',
            answerHi: 'हाँ। संगठन मुआवजे के दावों के लिए फोटो टाइमस्टैम्प और मेडिकल पर्चों के साथ प्रमाणित डोजियर तैयार करता है।'
          }
        ]
      },
      {
        id: 'gig_informal',
        slug: 'gig-informal',
        titleEn: 'Gig Worker & Informal Labor Solidarity',
        titleHi: 'गिग वर्कर, डिलीवरी राइडर व असंगठित मज़दूर सुरक्षा',
        taglineEn: 'Rider mutual-aid chanda, emergency accident SOS, rate-card disputes, and gig union verification badges.',
        taglineHi: 'डिलीवरी राइडर परस्पर सहायता कोष, दुर्घटना SOS, रेट-कार्ड विवाद और डिजिटल यूनियन सदस्यता।',
        metaTitleEn: 'Gig Worker Union & Delivery Rider App | Mutual Aid & Rate Card | Sangathan',
        metaTitleHi: 'गिग वर्कर व डिलीवरी राइडर यूनियन सॉफ्टवेयर | संगठन',
        metaDescEn: 'Organize app delivery riders, manage emergency accident mutual-aid funds, contest arbitrary app IDs blockages, and challenge rate-cards.',
        metaDescHi: 'डिलीवरी राइडर्स, कैब ड्राइवर्स और गिग वर्करों के लिए यूनियन प्रबंधन, दुर्घटना सहायता और रेट-कार्ड विवाद निवारण।',
        keywords: ['gig worker union software India', 'delivery rider mutual aid app', 'Zomato Swiggy rider collective tool', 'gig worker welfare board software'],
        activistQuoteEn: '“When the app algorithm arbitrarily slashes pay per delivery, 500 united riders on Sangathan switch off and demand fair rates.”',
        activistQuoteHi: '“जब कंपनी ऐप अचानक डिलीवरी का रेट घटाती है, तो संगठन पर संगठित 500 राइडर्स एक साथ आवाज उठाते हैं।”',
        groundChallengeEn: 'Isolated gig workers face sudden app ID blockages, road accidents without insurance, and dropping per-kilometer payout rates.',
        groundChallengeHi: 'अकेले काम करने वाले गिग वर्करों की अचानक आईडी ब्लॉक हो जाती है और दुर्घटना होने पर कोई मदद नहीं मिलती।',
        solutionOverviewEn: 'Sangathan provides rider mutual-aid funds, emergency road accident SOS, and collective rate-card dispute logging.',
        solutionOverviewHi: 'संगठन राइडर्स का परस्पर सहायता कोष, सड़क दुर्घटना एसओएस और रेट-कार्ड विवाद दर्ज करने का मंच देता है।',
        keyTools: [
          { nameEn: 'Rider Mutual-Aid Pool', nameHi: 'राइडर परस्पर सहायता कोष', descEn: 'Collect ₹20/month per rider for immediate accident relief hospital deposits.', descHi: 'दुर्घटना में अस्पताल भर्ती के लिए ₹20 मासिक सहायता कोष।', icon: 'Wallet' }
        ],
        statutoryActs: [
          { titleEn: 'Code on Social Security, 2020 (Gig Workers Chapter)', titleHi: 'सामाजिक सुरक्षा संहिता, 2020 (गिग श्रमिक अध्याय)', descEn: 'Statutory recognition of platform and gig workers for welfare schemes and accident benefits.', descHi: 'प्लेटफॉर्म और गिग श्रमिकों के लिए कल्याणकारी योजनाओं की वैधानिक व्यवस्था।', provision: 'Chapter IX' }
        ],
        stepWorkflow: [
          { stepEn: '01', stepHi: '०१', titleEn: 'Register Hub / Fleet', titleHi: 'हब / फ्लीट जोड़ें', detailEn: 'Riders scan QR code at the cloud kitchen cluster to join collective.', detailHi: 'डिलीवरी हब पर क्यूआर कोड स्कैन करके राइडर्स समूह से जुड़ते हैं।' }
        ],
        faqs: [
          {
            questionEn: 'How does the accident emergency SOS help a delivery rider?',
            questionHi: 'दुर्घटना के समय आपातकालीन SOS डिलीवरी राइडर की कैसे मदद करता है?',
            answerEn: 'Tapping SOS broadcasts the rider location to all nearby union members and dispatches mutual-aid pool funds for emergency hospital admission.',
            answerHi: 'एसओएस दबाते ही आसपास के साथी राइडर्स को तुरंत सूचना मिलती है और अस्पताल के लिए आपातकालीन फंड उपलब्ध कराया जाता है।'
          }
        ]
      },
      {
        id: 'cadre_delegate',
        slug: 'cadre-delegate',
        titleEn: 'Shop-Floor Stewards & Unit Delegates',
        titleHi: 'संयंत्र यूनिट प्रतिनिधि, मासिक चंदा व गेट बैठकें',
        taglineEn: 'Plant department delegates, monthly union levy UPI collection, shift rosters, and gate meeting notices.',
        taglineHi: 'संयंत्र प्रतिनिधि नेटवर्क, UPI मासिक चंदा संग्रह, शिफ्ट रोस्टर और गेट सभाएं।',
        metaTitleEn: 'Plant Cadre & Union Delegate Management | Sangathan',
        metaTitleHi: 'यूनिट प्रतिनिधि व मासिक लेवी प्रबंधन सॉफ्टवेयर | संगठन',
        metaDescEn: 'Manage shopfloor delegates across plant departments, track shift rosters, organize factory gate meetings, and collect monthly union dues.',
        metaDescHi: 'फैक्ट्री के विभिन्न विभागों में प्रतिनिधि नेटवर्क, शिफ्ट रोस्टर, गेट सभाएं और पारदर्शी मासिक लेवी संग्रह।',
        keywords: ['union delegate management software', 'shopfloor steward app', 'plant union levy collection', 'factory gate meeting notices'],
        activistQuoteEn: '“A strong union is built on active shop stewards who connect every worker to the executive committee daily.”',
        activistQuoteHi: '“मजबूत यूनियन की नींव सक्रिय शॉप प्रतिनिधियों पर टिकी होती है जो हर मज़दूर को कार्यसमिति से जोड़ते हैं।”',
        groundChallengeEn: 'Collecting monthly subscription cash from thousands of shift workers and maintaining accurate department records.',
        groundChallengeHi: 'हजारों शिफ्ट वर्करों से नकद चंदा एकत्र करना और उसका सटीक विभाग-वार हिसाब रखना।',
        solutionOverviewEn: 'Sangathan provides 1-tap UPI levy collection with instant receipt generation and department delegate hierarchies.',
        solutionOverviewHi: 'संगठन यूपीआई से 1-टैप मासिक लेवी, डिजिटल रसीदें और विभाग-वार प्रतिनिधि नेटवर्क प्रदान करता है।',
        keyTools: [
          { nameEn: 'Shopfloor Levy Tracker', nameHi: 'शॉपफ्लोर लेवी ट्रैकर', descEn: 'Track monthly dues collection by department with live % progress.', descHi: 'विभाग-वार मासिक चंदा संग्रह और लाइव प्रगति रिपोर्ट।', icon: 'Wallet' }
        ],
        statutoryActs: [
          { titleEn: 'Trade Unions Act, 1926 - Section 15 & 16', titleHi: 'ट्रेड यूनियन अधिनियम, 1926 - धारा 15 एवं 16', descEn: 'Rules governing the utilization and auditing of General and Political Funds.', descHi: 'यूनियन की सामान्य और राजनीतिक निधि के उपयोग और ऑडिट के वैधानिक नियम।', provision: 'Sections 15 & 16' }
        ],
        stepWorkflow: [
          { stepEn: '01', stepHi: '०१', titleEn: 'Assign Shop Stewards', titleHi: 'प्रतिनिधि नियुक्त करें', detailEn: 'Appoint delegates for Assembly, Paint, Press, and Quality lines.', detailHi: 'असेंबली, पेंट, प्रेस और क्वालिटी लाइनों के प्रतिनिधि तय करें।' }
        ],
        faqs: [
          {
            questionEn: 'Can union delegates use Sangathan in low network factory floors?',
            questionHi: 'क्या फैक्ट्री के अंदर कम नेटवर्क में ऐप काम करेगा?',
            answerEn: 'Yes. The offline PWA allows stewards to log member dues and issues offline, syncing when they exit the shopfloor.',
            answerHi: 'हाँ। ऑफलाइन ऐप से प्रतिनिधि बिना इंटरनेट के भी चंदा और समस्याएं दर्ज कर सकते हैं, जो बाहर आने पर सिंक हो जाती हैं।'
          }
        ]
      }
    ],
    statutoryCompliance: [
      {
        actName: 'Trade Unions Act, 1926 & Industrial Relations Code, 2020',
        registrationRequirementEn: 'Registered with the Registrar of Trade Unions under the state Labor Commissionerate.',
        registrationRequirementHi: 'राज्य श्रम आयुक्त कार्यालय में रजिस्ट्रार ऑफ ट्रेड यूनियन्स के पास पंजीकरण।',
        keyFilingsEn: 'Form H (Annual Audit of General Fund, Asset Register, and Membership Rolls).',
        keyFilingsHi: 'फॉर्म H (सामान्य निधि, संपत्ति रजिस्टर और सदस्य सूची का वार्षिक ऑडिट रिटर्न)।'
      }
    ],
    faqs: [
      {
        questionEn: 'How does Sangathan prepare Form H returns?',
        questionHi: 'संगठन फॉर्म H रिटर्न कैसे तैयार करता है?',
        answerEn: 'Sangathan automatically aggregates all monthly member levy payments, expenditures, and asset additions into the exact format prescribed by the State Registrar of Trade Unions under Form H.',
        answerHi: 'संगठन पूरे साल के चंदे, खर्च और संपत्ति के ब्योरे को ट्रेड यूनियन एक्ट के तहत निर्धारित फॉर्म H प्रारूप में स्वतः तैयार करता है।'
      },
      {
        questionEn: 'How does cadre pricing scale for large factory units and gig-worker federations?',
        questionHi: 'फैक्ट्री यूनिटों और गिग-वर्कर महासंघों के लिए सदस्यता क्षमता कैसे बढ़ती है?',
        answerEn: 'Unions start free with 20 delegate seats on the Community Tier. For growing shop-floor units and federations, Sustainer Access provides 500 active union delegates for ₹1,000/mo, expanding at ₹11/delegate/month. Strike authorization voters and solidarity signers are completely unlimited.',
        answerHi: 'यूनियन 20 प्रतिनिधि सीटों के साथ निःशुल्क शुरू कर सकती हैं। बड़े महासंघों के लिए संरक्षक योजना ₹1,000/माह में 500 सक्रिय प्रतिनिधि देती है (₹11/अतिरिक्त प्रतिनिधि/माह)। हड़ताल समर्थक व आम श्रमिक असीमित संख्या में भाग ले सकते हैं।'
      }
    ]
  },

  'rwa': {
    id: 'rwa',
    slug: 'rwa',
    titleEn: 'Resident Welfare Associations (RWAs)',
    titleHi: 'आवासीय कल्याण संघ (RWAs) व हाउसिंग सोसायटियां',
    categoryBadgeEn: 'Societies & Apartments',
    categoryBadgeHi: 'अपार्टमेंट व हाउसिंग सोसायटियां',
    metaTitleEn: 'RWA Management Software India | Maintenance Billing, AGM & MCD Escalation | Sangathan',
    metaTitleHi: 'RWA प्रबंधन सॉफ्टवेयर | मेंटेनेंस बिलिंग, AGM चुनाव व नगर निगम शिकायतें | संगठन',
    metaDescEn: 'Sovereign resident management software for Indian RWAs, apartment societies, and plotted colonies. Transparent UPI maintenance billing, 21-day AGM notices, secret executive elections, and MCD ward escalations.',
    metaDescHi: 'भारतीय आरडब्ल्यूए, अपार्टमेंट सोसायटियों और कॉलोनियों के लिए संपूर्ण प्रबंधन सॉफ्टवेयर। पारदर्शी यूपीआई मेंटेनेंस बिलिंग, 21-दिवसीय एजीएम नोटिस, कार्यसमिति चुनाव एवं नगर निगम पैरवी।',
    keywords: [
      'RWA management software India', 'housing society maintenance billing app', 'apartment ownership act compliance',
      'RWA election online voting', 'society AGM notice generator', 'MCD ward councillor escalation tool',
      'society vendor AMC tracker', 'apartment guard visitor management'
    ],
    heroHeadlineEn: 'Democratic, Ad-Free Governance for Housing Societies.',
    heroHeadlineHi: 'हाउसिंग सोसायटियों के लिए लोकतांत्रिक, विज्ञापन-मुक्त पारदर्शी प्रशासन।',
    heroSubheadlineEn: 'Replace commercial apps that monetize resident data. Collect maintenance via UPI with zero gateway cut, conduct tamper-evident AGM executive elections, track lift/DG vendor AMCs, and escalate colony issues to municipal councillors.',
    heroSubheadlineHi: 'निवासियों के डेटा पर विज्ञापन बेचने वाले कमर्शियल ऐप छोड़ें। शून्य कमीशन पर यूपीआई से मेंटेनेंस वसूलें, एजीएम चुनाव कराएं, लिफ्ट/डीजी वेंडर एएमसी ट्रैक करें और पार्षद से कॉलोनी के काम कराएं।',
    activistQuoteEn: '“Most society apps treat residents as advertising targets. Sangathan restores genuine resident democracy, transparent accounts, and municipal accountability.”',
    activistQuoteHi: '“अधिकांश प्राइवेट ऐप निवासियों को विज्ञापन का जरिया मानते हैं। संगठन वास्तविक पारदर्शिता, खुला बहीखाता और नगर निगम में मजबूत पैरवी देता है।”',
    quoteAttributionEn: 'Apex Federation of RWAs President',
    quoteAttributionHi: 'फेडरेशन ऑफ आरडब्ल्यूए अध्यक्ष',
    groundPillars: [
      {
        titleEn: 'Transparent UPI Maintenance Ledger',
        titleHi: 'पारदर्शी यूपीआई मेंटेनेंस बहीखाता',
        descEn: 'Collect maintenance directly into society bank account via UPI with instant receipts and zero gateway commissions.',
        descHi: 'सीधे सोसायटी के बैंक खाते में यूपीआई से मेंटेनेंस संग्रह, तुरंत डिजिटल रसीदें और शून्य कमीशन।',
        icon: 'Receipt'
      },
      {
        titleEn: '21-Day Statutory AGM Notice Studio',
        titleHi: '21-दिवसीय वैधानिक AGM नोटिस',
        descEn: 'Generate legally binding Annual General Meeting circulars with audited balance sheets compliant with Apartment Acts.',
        descHi: 'अपार्टमेंट अधिनियम के तहत 21 दिन पूर्व एजेंडा और ऑडिटेड बैलेंस शीट के साथ आधिकारिक एजीएम नोटिस जारी करें।',
        icon: 'FileText'
      },
      {
        titleEn: 'Cryptographic Executive Committee Elections',
        titleHi: 'कार्यसमिति के निष्पक्ष चुनाव',
        descEn: 'Flat-owner verified secret voting for President, Secretary, and Treasurer seats with tamper-evident audit trails.',
        descHi: 'फ्लैट मालिकों के सत्यापित मतों से अध्यक्ष, सचिव और कोषाध्यक्ष के लिए पारदर्शी व निष्पक्ष चुनाव।',
        icon: 'Vote'
      },
      {
        titleEn: 'Municipal Escalations & Stamped Receivings',
        titleHi: 'नगर निगम पत्राचार व रिसीविंग',
        descEn: 'Track potholes, storm drains, and park maintenance with official stamped letters to MCD and Ward Councillors.',
        descHi: 'सड़क, नाली, पार्क और स्ट्रीटलाइट समस्याओं पर नगर निगम और क्षेत्रीय पार्षद को मुहर लगे मांग पत्र।',
        icon: 'Building2'
      }
    ],
    coreTools: [
      {
        nameEn: 'Flat-Wise Maintenance Billing Desk',
        nameHi: 'फ्लैट-वार मेंटेनेंस बिलिंग डेस्क',
        descEn: 'Automate per-sqft or flat rate monthly billing, WhatsApp payment links, and live defaulter ledger.',
        descHi: 'वर्गफुट या फिक्स्ड दर के अनुसार मासिक बिलिंग, व्हाट्सएप पेमेंट लिंक और डिफॉल्टर सूची।',
        icon: 'Receipt',
        badge: 'Zero Commission'
      },
      {
        nameEn: 'AGM Notice & Agenda Circular Studio',
        nameHi: 'एजीएम नोटिस व एजेंडा स्टूडियो',
        descEn: 'Statutory 21-day notice templates with proxy rules, voting agenda, and annual audited accounts.',
        descHi: '21-दिवसीय वैधानिक एजीएम नोटिस, प्रॉक्सी नियम और वार्षिक वित्तीय रिपोर्ट प्रारूप।',
        icon: 'FileText',
        badge: 'Societies Act Norms'
      },
      {
        nameEn: 'Lift, DG & Vendor AMC Tracker',
        nameHi: 'लिफ्ट, जनरेटर व वेंडर AMC ट्रैकर',
        descEn: 'Log maintenance tickets, track annual maintenance contracts (AMC), and monitor technician visit reports.',
        descHi: 'लिफ्ट, जनरेटर और एसटीपी के वार्षिक रख-रखाव अनुबंध (AMC) और तकनीशियन विजिट रिकॉर्ड।',
        icon: 'CheckSquare',
        badge: 'Operations'
      },
      {
        nameEn: 'MCD & Civic Agency Representation Desk',
        nameHi: 'नगर निगम व पार्षद पत्राचार डेस्क',
        descEn: 'Draft official representations to MCD Executive Engineers with stamped diary tracker.',
        descHi: 'नगर निगम अधिशासी अभियंता और पार्षद को आधिकारिक मांग पत्र व डायरी नंबर ट्रैकर।',
        icon: 'Building2',
        badge: 'Civic Power'
      }
    ],
    subtypes: [
      {
        id: 'estate_maintenance',
        slug: 'estate-maintenance',
        titleEn: 'Gated Society & Estate Operations',
        titleHi: 'सोसायटी रख-रखाव, लिफ्ट/डीजी व वेंडर AMC',
        taglineEn: 'Lift, DG, STP and plumbing job tickets, vendor AMC tracker, resident repair requests, and technician dispatch.',
        taglineHi: 'लिफ्ट, जनरेटर और प्लंबिंग टिकट, वेंडर AMC ट्रैकर और तकनीशियन प्रबंधन।',
        metaTitleEn: 'Gated Society Maintenance & AMC Management | Sangathan',
        metaTitleHi: 'सोसायटी रख-रखाव व वेंडर AMC प्रबंधन सॉफ्टवेयर | संगठन',
        metaDescEn: 'Track resident repair tickets, vendor AMC contracts for lifts/DGs, water supply schedules, and technician dispatches.',
        metaDescHi: 'सोसायटी में प्लंबिंग, इलेक्ट्रिकल शिकायतें, लिफ्ट/जनरेटर एएमसी और वेंडर बिलों का प्रबंधन।',
        keywords: ['society estate management software', 'apartment lift AMC tracker', 'society plumber electrician ticket app'],
        activistQuoteEn: '“When equipment breakdown tickets are visible to all residents, vendor AMCs get serviced on time without excuses.”',
        activistQuoteHi: '“जब लिफ्ट और जनरेटर की मरम्मत का ब्योरा सभी निवासियों को दिखता है, तो वेंडर बिना बहाने के समय पर काम करता है।”',
        groundChallengeEn: 'Unresolved resident repair requests and lack of tracking on expensive lift/DG vendor annual maintenance contracts.',
        groundChallengeHi: 'निवासियों की शिकायतों का समय पर निवारण न होना और महंगे वेंडर एएमसी का कोई ऑडिट न होना।',
        solutionOverviewEn: 'Sangathan provides resident ticket logging, technician SLA timers, and vendor contract renewal alerts.',
        solutionOverviewHi: 'संगठन शिकायत निवारण टाइमर, तकनीशियन ट्रैकिंग और वेंडर अनुबंध नवीनीकरण अलर्ट प्रदान करता है।',
        keyTools: [
          { nameEn: 'Vendor AMC & SLA Dashboard', nameHi: 'वेंडर AMC व SLA डैशबोर्ड', descEn: 'Track contract expiry, quarterly service dates, and payments.', descHi: 'अनुबंध समाप्ति तिथि, त्रैमासिक सर्विस और भुगतानों का रिकॉर्ड।', icon: 'CheckSquare' }
        ],
        statutoryActs: [
          { titleEn: 'State Apartment Ownership Acts', titleHi: 'राज्य अपार्टमेंट स्वामित्व अधिनियम', descEn: 'Statutory obligation of management committees to maintain common areas and safety equipment.', descHi: 'साझा सुविधाओं, लिफ्ट और सुरक्षा उपकरणों के रख-रखाव का वैधानिक दायित्व।', provision: 'Common Areas Provisions' }
        ],
        stepWorkflow: [
          { stepEn: '01', stepHi: '०१', titleEn: 'Log Repair Ticket', titleHi: 'शिकायत दर्ज करें', detailEn: 'Resident logs plumbing or electrical issue with photo.', detailHi: 'निवासी फोटो के साथ प्लंबिंग या बिजली की शिकायत दर्ज करता है।' }
        ],
        faqs: [
          {
            questionEn: 'Can residents track the status of their repair requests?',
            questionHi: 'क्या निवासी अपनी शिकायत की स्थिति देख सकते हैं?',
            answerEn: 'Yes. Residents receive live status updates from assigned technicians and can rate the service quality.',
            answerHi: 'हाँ। निवासी तकनीशियन का नाम, अनुमानित समय और कार्य पूरा होने की स्थिति लाइव देख सकते हैं।'
          }
        ]
      },
      {
        id: 'municipal_civic',
        slug: 'municipal-civic',
        titleEn: 'Colony & Ward Municipal Action',
        titleHi: 'कॉलोनी नागरिक सुधार, नगर निगम व पार्षद पत्राचार',
        taglineEn: 'MCD/civic agency escalation, road potholes, storm drains, streetlights, and ward councillor RTIs.',
        taglineHi: 'नगर निगम को मांग पत्र, नाली-सड़क शिकायतें और पार्षद स्तर पर नागरिक पैरवी।',
        metaTitleEn: 'Colony Municipal Grievance & Ward Action | Sangathan',
        metaTitleHi: 'कॉलोनी नागरिक सुधार व नगर निगम पैरवी | संगठन',
        metaDescEn: 'File official representations to municipal authorities, track stamped diary numbers, and generate RTIs for colony civic issues.',
        metaDescHi: 'सड़क, नाली, स्ट्रीटलाइट और कूड़े की समस्याओं पर नगर निगम व पार्षद को आधिकारिक पत्र और 15-दिवसीय आरटीआई।',
        keywords: ['colony municipal grievance software', 'RWA MCD escalation app', 'ward councillor representation generator'],
        activistQuoteEn: '“An RWA that only collects maintenance is just a billing agent. An RWA using Sangathan fights for municipal infrastructure.”',
        activistQuoteHi: '“केवल बिल वसूलने वाली आरडब्ल्यूए नहीं, बल्कि संगठन से जुड़कर नगर निगम से सड़क-पानी का अधिकार लेने वाली आरडब्ल्यूए बनें।”',
        groundChallengeEn: 'Civic agencies ignore colony issues outside the society gate like broken main roads and overflowing storm drains.',
        groundChallengeHi: 'सोसायटी गेट के बाहर की मुख्य सड़कों और नालियों की शिकायतों को सरकारी एजेंसियां टालती रहती हैं।',
        solutionOverviewEn: 'Sangathan drafts formal letters to municipal commissioners with stamped diary tracking and automatic RTI escalations.',
        solutionOverviewHi: 'संगठन निगम आयुक्त और पार्षद के नाम मुहर लगे मांग पत्र और 15-दिवसीय आरटीआई काउंटडाउन उपलब्ध कराता है।',
        keyTools: [
          { nameEn: 'Municipal Representation Generator', nameHi: 'नगर निगम मांग पत्र जनरेटर', descEn: 'Pre-drafted letters citing DMC Act provisions for road repair and drainage.', descHi: 'सड़क और नाली सुधार के लिए नगर निगम अधिनियम के तहत तैयार मांग पत्र।', icon: 'Building2' }
        ],
        statutoryActs: [
          { titleEn: 'Delhi Municipal Corporation Act / State Municipal Acts', titleHi: 'दिल्ली नगर निगम अधिनियम / राज्य नगर पालिका अधिनियम', descEn: 'Statutory duty of urban local bodies to maintain civic infrastructure.', descHi: 'नागरिक सुविधाओं के रख-रखाव के लिए स्थानीय निकायों का वैधानिक दायित्व।', provision: 'Civic Amenities' }
        ],
        stepWorkflow: [
          { stepEn: '01', stepHi: '०१', titleEn: 'Submit Colony Demand', titleHi: 'मांग पत्र तैयार करें', detailEn: 'Select civic issue and generate letter to Ward Executive Engineer.', detailHi: 'समस्या चुनें और अधिशासी अभियंता के नाम आधिकारिक पत्र निकालें।' }
        ],
        faqs: [
          {
            questionEn: 'How does Sangathan help when the councillor is unresponsive?',
            questionHi: 'यदि पार्षद ध्यान न दे तो संगठन कैसे मदद करता है?',
            answerEn: 'Sangathan generates a 15-day statutory RTI inquiry asking for the councillor fund allocation and pending work orders.',
            answerHi: 'संगठन पार्षद निधि के उपयोग और स्वीकृत कार्यों की सूची मांगने वाली 15-दिवसीय आरटीआई तैयार करता है।'
          }
        ]
      },
      {
        id: 'security_amenities',
        slug: 'security-amenities',
        titleEn: 'Security, Parking & Community Facilities',
        titleHi: 'सुरक्षा गार्ड रोस्टर, पार्किंग प्रबंधन व क्लब हाउस',
        taglineEn: 'Guard duty rosters, visitor logs, parking slot allocation, clubhouse & sports facility slot bookings.',
        taglineHi: 'सुरक्षा गार्ड रोस्टर, पार्किंग आवंटन और क्लब हाउस/सामुदायिक भवन बुकिंग।',
        metaTitleEn: 'Society Security, Parking & Facility Booking | Sangathan',
        metaTitleHi: 'सोसायटी सुरक्षा, पार्किंग व क्लब हाउस बुकिंग | संगठन',
        metaDescEn: 'Ad-free society gate security, visitor management, resident parking stickers, and clubhouse slot reservation.',
        metaDescHi: 'विज्ञापन-मुक्त गेट सुरक्षा, विजिटर एंट्री, पार्किंग स्टिकर और क्लब हाउस बुकिंग प्रबंधन।',
        keywords: ['society security guard roster app', 'apartment parking management software', 'clubhouse facility booking system'],
        activistQuoteEn: '“Security should protect residents, not sell their daily visitor data to commercial advertisers.”',
        activistQuoteHi: '“सुरक्षा व्यवस्था निवासियों की रक्षा के लिए होनी चाहिए, न कि उनके डेटा को विज्ञापनों के लिए बेचने के लिए।”',
        groundChallengeEn: 'Intrusive commercial security apps that bombard residents with shopping ads and sell contact details.',
        groundChallengeHi: 'प्राइवेट गेट ऐप जो निवासियों को विज्ञापनों से परेशान करते हैं और उनके फोन नंबर बेचते हैं।',
        solutionOverviewEn: 'Sangathan provides 100% ad-free, sovereign gate management, parking allocation, and clubhouse booking.',
        solutionOverviewHi: 'संगठन 100% विज्ञापन-मुक्त, सुरक्षित गेट प्रबंधन, पार्किंग आवंटन और क्लब हाउस बुकिंग प्रदान करता है।',
        keyTools: [
          { nameEn: 'Sovereign Gate Desk', nameHi: 'विज्ञापन-मुक्त गेट डेस्क', descEn: 'Fast visitor and delivery check-in with zero advertising.', descHi: 'बिना किसी विज्ञापन के त्वरित विजिटर और डिलीवरी एंट्री।', icon: 'ShieldCheck' }
        ],
        statutoryActs: [
          { titleEn: 'Digital Personal Data Protection (DPDP) Act, 2023', titleHi: 'डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम, 2023', descEn: 'Protects resident visitor logs from commercial exploitation and third-party data broker sales.', descHi: 'निवासियों के व्यक्तिगत डेटा और विजिटर रिकॉर्ड की व्यावसायिक दुरुपयोग से सुरक्षा।', provision: 'Data Protection' }
        ],
        stepWorkflow: [
          { stepEn: '01', stepHi: '०१', titleEn: 'Setup Guard Roster', titleHi: 'गार्ड रोस्टर बनाएं', detailEn: 'Assign shift timings and gate entry stations.', detailHi: 'सुरक्षा गार्डों की शिफ्ट और गेट ड्यूटी तय करें।' }
        ],
        faqs: [
          {
            questionEn: 'Are resident phone numbers shared with third-party advertisers?',
            questionHi: 'क्या निवासियों के फोन नंबर किसी विज्ञापनदाता को दिए जाते हैं?',
            answerEn: 'Never. Sangathan is built by a non-profit foundation with an absolute zero-monetization and anti-surveillance privacy guarantee.',
            answerHi: 'कदापि नहीं। संगठन एक गैर-लाभकारी पहल है जो डेटा गोपनीयता और शून्य-विज्ञापन की पूर्ण गारंटी देती है।'
          }
        ]
      },
      {
        id: 'agm_billing',
        slug: 'agm-billing',
        titleEn: 'Annual AGM Elections & Bill Collection',
        titleHi: 'वार्षिक AGM चुनाव, ऑनलाइन वोटिंग व मेंटेनेंस वसूली',
        taglineEn: 'Annual General Meeting agendas, tamper-evident executive election voting, and UPI maintenance billing ledger.',
        taglineHi: 'वार्षिक AGM एजेंडा, ऑनलाइन कार्यसमिति चुनाव और UPI मेंटेनेंस पारदर्शी बहीखाता।',
        metaTitleEn: 'RWA AGM Notice, Elections & Maintenance Billing | Sangathan',
        metaTitleHi: 'RWA एजीएम चुनाव व मेंटेनेंस बिलिंग सॉफ्टवेयर | संगठन',
        metaDescEn: 'Issue 21-day statutory AGM notices, conduct secret executive elections, and collect monthly maintenance via UPI with zero gateway cuts.',
        metaDescHi: '21-दिवसीय एजीएम नोटिस जारी करें, कार्यसमिति चुनाव कराएं और बिना कमीशन यूपीआई से मेंटेनेंस वसूलें।',
        keywords: ['RWA AGM election software', 'housing society billing ledger app', 'online RWA voting secret ballot'],
        activistQuoteEn: '“When society accounts are public on Sangathan and elections are tamper-evident, builder nexus and corruption disappear.”',
        activistQuoteHi: '“जब सोसायटी का बहीखाता संगठन पर पारदर्शी होता है और चुनाव निष्पक्ष होते हैं, तो भ्रष्टाचार स्वतः समाप्त हो जाता है।”',
        groundChallengeEn: 'AGMs plagued by quorum disputes, forged proxy votes, and allegations of fund mismanagement.',
        groundChallengeHi: 'एजीएम में फर्जी प्रॉक्सी वोटों के विवाद और फंड में हेराफेरी के आरोप।',
        solutionOverviewEn: 'Sangathan verifies flat-owner eligibility, conducts tamper-evident secret ballots, and publishes live audit ledgers.',
        solutionOverviewHi: 'संगठन फ्लैट मालिक सत्यापन, गोपनीय डिजिटल मतदान और लाइव वित्तीय बहीखाता उपलब्ध कराता है।',
        keyTools: [
          { nameEn: 'Flat-Owner Secret Ballot Engine', nameHi: 'फ्लैट मालिक सीक्रेट बैलेट', descEn: '1-flat-1-vote cryptographic election for management committee seats.', descHi: 'कार्यसमिति सीटों के लिए 1-फ्लैट-1-वोट की सुरक्षित गुप्त मतदान प्रणाली।', icon: 'Vote' }
        ],
        statutoryActs: [
          { titleEn: 'Societies Registration Act / Apartment Ownership Rules', titleHi: 'सोसायटी पंजीकरण अधिनियम / अपार्टमेंट स्वामित्व नियम', descEn: 'Mandates 21-day advance written notice and audited annual balance sheets before AGM.', descHi: 'एजीएम से पूर्व 21 दिन का अग्रिम लिखित नोटिस और ऑडिटेड बैलेंस शीट की अनिवार्यता।', provision: 'AGM Governance' }
        ],
        stepWorkflow: [
          { stepEn: '01', stepHi: '०१', titleEn: 'Publish 21-Day AGM Notice', titleHi: '21-दिवसीय एजीएम नोटिस जारी करें', detailEn: 'Upload audited balance sheet and send agenda circular to all flat owners.', detailHi: 'ऑडिटेड बैलेंस शीट और बैठक का एजेंडा सभी फ्लैट मालिकों को भेजें।' }
        ],
        faqs: [
          {
            questionEn: 'Can NRI or out-of-town flat owners vote in RWA elections?',
            questionHi: 'क्या शहर से बाहर या एनआरआई फ्लैट मालिक चुनाव में वोट कर सकते हैं?',
            answerEn: 'Yes. Verified flat owners can cast their vote securely from anywhere in the world using OTP authentication on Sangathan.',
            answerHi: 'हाँ। सत्यापित फ्लैट मालिक दुनिया के किसी भी कोने से ओटीपी प्रमाणीकरण के जरिए अपना सुरक्षित वोट दे सकते हैं।'
          }
        ]
      }
    ],
    statutoryCompliance: [
      {
        actName: 'State Apartment Ownership Acts & Societies Registration Act, 1860',
        registrationRequirementEn: 'Registered with the Registrar of Societies or competent Apartment Authority under State law.',
        registrationRequirementHi: 'राज्य कानून के तहत रजिस्ट्रार ऑफ सोसायटिज या सक्षम अपार्टमेंट प्राधिकरण में पंजीकृत।',
        keyFilingsEn: 'Annual General Meeting minutes, list of newly elected Management Committee members, and audited balance sheets.',
        keyFilingsHi: 'वार्षिक एजीएम मिनट्स, नवनिर्वाचित कार्यसमिति सदस्यों की सूची और सीए द्वारा ऑडिटेड बैलेंस शीट।'
      }
    ],
    faqs: [
      {
        questionEn: 'How does Sangathan differ from MyGate, ADDA, or NobrokerHood?',
        questionHi: 'संगठन अन्य कमर्शियल गेट ऐप (जैसे MyGate, ADDA) से कैसे अलग है?',
        answerEn: 'Commercial apps monetize resident phone numbers with advertisements and charge expensive per-flat monthly fees. Sangathan is built by a non-profit foundation (BQF) with zero ads, zero data harvesting, and a ₹0 Forever Community Tier for resident collectives (up to 20 committee members, unlimited resident voters). Sustainer access covers 500 active units/cadres for ₹1,000/mo with ₹11/unit scaling.',
        answerHi: 'कमर्शियल ऐप निवासियों को विज्ञापन दिखाते हैं और उनका डेटा बेचते हैं। संगठन 100% विज्ञापन-मुक्त है, कभी डेटा नहीं बेचती और सोसायटियों के लिए ₹0 निःशुल्क कम्युनिटी टियर (20 समिति सदस्य, असीमित निवासी मतदाता) तथा 500 फ्लैटों के लिए ₹1,000/माह संरक्षक टियर (₹11/अतिरिक्त फ्लैट) देती है।'
      }
    ]
  }
}
