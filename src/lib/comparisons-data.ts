export interface ComparisonFeatureRow {
  featureNameEn: string
  featureNameHi: string
  sangathanValueEn: string
  sangathanValueHi: string
  competitorValueEn: string
  competitorValueHi: string
  category: 'pricing' | 'compliance' | 'ground_tools' | 'privacy' | 'democracy'
  sangathanAdvantage: boolean
}

export interface ComparisonPillar {
  titleEn: string
  titleHi: string
  sangathanDetailEn: string
  sangathanDetailHi: string
  competitorDetailEn: string
  competitorDetailHi: string
  verdictEn: string
  verdictHi: string
}

export interface ComparisonFAQ {
  questionEn: string
  questionHi: string
  answerEn: string
  answerHi: string
}

export interface ComparisonPageData {
  slug: string
  competitorName: string
  competitorCategoryEn: string
  competitorCategoryHi: string
  competitorTaglineEn: string
  competitorTaglineHi: string
  metaTitleEn: string
  metaTitleHi: string
  metaDescEn: string
  metaDescHi: string
  keywords: string[]
  heroHeadlineEn: string
  heroHeadlineHi: string
  heroSubheadlineEn: string
  heroSubheadlineHi: string
  summaryVerdictEn: string
  summaryVerdictHi: string
  activistQuoteEn: string
  activistQuoteHi: string
  quoteAttributionEn: string
  quoteAttributionHi: string
  comparisonMatrix: ComparisonFeatureRow[]
  pillars: ComparisonPillar[]
  faqs: ComparisonFAQ[]
}

export const COMPARISONS_DATA: Record<string, ComparisonPageData> = {
  'action-network': {
    slug: 'action-network',
    competitorName: 'Action Network',
    competitorCategoryEn: 'US Digital Mobilization Tool',
    competitorCategoryHi: 'अमेरिकी डिजिटल मोबिलाइजेशन टूल',
    competitorTaglineEn: 'US-centric email broadcast & progressive advocacy CRM',
    competitorTaglineHi: 'अमेरिकी आधारित ईमेल ब्रॉडकास्ट व अभियान सीआरएम',
    metaTitleEn: 'Sangathan vs Action Network: Best Organizing Tool for India | Full Comparison',
    metaTitleHi: 'संगठन बनाम एक्शन नेटवर्क | भारतीय जन आंदोलनों के लिए तुलना',
    metaDescEn: 'Compare Sangathan and Action Network. Why India\'s grassroots collectives choose Sangathan for offline PWA field audits, ₹1 printable flyers, WhatsApp bot, and ₹0 community pricing in INR.',
    metaDescHi: 'संगठन और एक्शन नेटवर्क की विस्तृत तुलना। जानें क्यों भारतीय नागरिक समूह ऑफलाइन फील्ड ऑडिट, ₹1 पर्चे, व्हाट्सएप बॉट और ₹0 निःशुल्क टियर के लिए संगठन चुनते हैं।',
    keywords: [
      'Sangathan vs Action Network', 'Action Network alternative India', 'Action Network pricing India',
      'grassroots organizing software India', 'best political campaign software India', 'offline organizing tool'
    ],
    heroHeadlineEn: 'Why Indian Movements Choose Sangathan Over Action Network',
    heroHeadlineHi: 'भारतीय जन आंदोलन एक्शन नेटवर्क की जगह संगठन क्यों चुनते हैं?',
    heroSubheadlineEn: 'Action Network was built for US progressive email fundraisers charging $105-$1,050/mo (₹9,000 - ₹90,000/mo in USD). Sangathan is built for Indian ground organizers with offline PWA field checks, ₹1 A4 photostat flyers, 30-day RTI reminders, and direct UPI chanda for ₹0.',
    heroSubheadlineHi: 'एक्शन नेटवर्क अमेरिकी ईमेल अभियानों और ₹9,000 से ₹90,000/माह के डॉलर भुगतानों के लिए बना है। संगठन भारतीय जमीनी कार्यकर्ताओं के लिए बना है—ऑफलाइन फील्ड जांच, ₹1 पर्चा, 30-दिवसीय आरटीआई याद और यूपीआई चंदा।',
    summaryVerdictEn: 'Action Network relies heavily on bulk email marketing and credit card donations in USD ($105+/mo or ₹9,000+/mo). Sangathan provides a true ground operating system tailored for India: physical A4 flyers, WhatsApp-first communication, offline field data sync, ₹0 community tier up to 5 members, and metered billing at ₹11/active member beyond 5.',
    summaryVerdictHi: 'एक्शन नेटवर्क केवल ईमेल और विदेशी कार्ड भुगतानों (₹9,000+/माह) पर निर्भर है। संगठन भारत की जमीनी वास्तविकताओं के अनुरूप है: भौतिक पर्चे, व्हाट्सएप समन्वय, ऑफलाइन डेटा सिंक और ₹0 निःशुल्क नागरिक टियर।',
    activistQuoteEn: '“In Indian bastis, email campaigns don’t work. You need ₹1 photostat leaflets on chai stalls, stamped ward receiving copies, and UPI. That’s why we use Sangathan.”',
    activistQuoteHi: '“भारतीय बस्तियों में ईमेल काम नहीं करते। वहां चाय की दुकानों पर ₹1 पर्चे, नगर निगम की मुहर लगी रिसीविंग और यूपीआई चाहिए। इसीलिए हम संगठन चुनते हैं।”',
    quoteAttributionEn: 'Clean Air & Citizen Action Front Convener',
    quoteAttributionHi: 'स्वच्छ हवा व नागरिक संघर्ष मोर्चा संयोजक',
    comparisonMatrix: [
      {
        featureNameEn: 'Pricing for Grassroots & Institutions',
        featureNameHi: 'जमीनी समूहों व संस्थाओं के लिए मूल्य',
        sangathanValueEn: '₹0 Forever (Community) • ₹1,000/mo (500 Cadres, +₹11/scale)',
        sangathanValueHi: '₹0 हमेशा निःशुल्क (कम्युनिटी) • ₹1,000/माह (500 काडर, +₹11/अतिरिक्त)',
        competitorValueEn: '₹9,000 - ₹90,000 / month ($105 - $1,050/mo USD + foreign fees)',
        competitorValueHi: '₹9,000 से ₹90,000 प्रति माह ($105 - $1,050/माह डॉलर में)',
        category: 'pricing',
        sangathanAdvantage: true
      },
      {
        featureNameEn: 'Primary Communication Medium',
        featureNameHi: 'प्राथमिक संवाद माध्यम',
        sangathanValueEn: 'WhatsApp Bots, Telegram & ₹1 A4 Print Flyers',
        sangathanValueHi: 'व्हाट्सएप बॉट, टेलीग्राम व ₹1 प्रिंटेबल पर्चे',
        competitorValueEn: 'Email Newsletters & US SMS Longcodes',
        competitorValueHi: 'ईमेल न्यूजलेटर व अमेरिकी एसएमएस',
        category: 'ground_tools',
        sangathanAdvantage: true
      },
      {
        featureNameEn: 'Zero-Connectivity Offline PWA',
        featureNameHi: 'बिना इंटरनेट ऑफलाइन PWA सपोर्ट',
        sangathanValueEn: '100% Offline-First with Background Queue Sync',
        sangathanValueHi: '100% ऑफलाइन कार्यक्षमता व बैकग्राउंड सिंक',
        competitorValueEn: 'No offline support (Requires stable desktop/cloud)',
        competitorValueHi: 'कोई ऑफलाइन सपोर्ट नहीं (स्थिर इंटरनेट जरूरी)',
        category: 'ground_tools',
        sangathanAdvantage: true
      },
      {
        featureNameEn: 'Indian Payment Gateway & Tax Compliance',
        featureNameHi: 'भारतीय भुगतान व टैक्स अनुपालन',
        sangathanValueEn: 'Direct UPI, QR code, 80G PDF with PAN & 10BD',
        sangathanValueHi: 'सीधा यूपीआई, क्यूआर कोड, 80G टैक्स रसीद व 10BD',
        competitorValueEn: 'Stripe Credit Cards (USD / foreign gateway fees)',
        competitorValueHi: 'केवल विदेशी क्रेडिट कार्ड (स्ट्राइप USD)',
        category: 'compliance',
        sangathanAdvantage: true
      },
      {
        featureNameEn: 'Written Complaint Records',
        featureNameHi: 'लिखित शिकायत रिकॉर्ड',
        sangathanValueEn: 'Complaint diary with 30-day RTI reminder & Section 6(1) draft',
        sangathanValueHi: '30-दिवसीय आरटीआई याद वाली शिकायत डायरी',
        competitorValueEn: 'None (Only online petition signing)',
        competitorValueHi: 'कुछ नहीं (केवल ऑनलाइन याचिका)',
        category: 'compliance',
        sangathanAdvantage: true
      },
      {
        featureNameEn: 'Democratic Decision Making',
        featureNameHi: 'लोकतांत्रिक निर्णय प्रणाली',
        sangathanValueEn: 'Cryptographic anonymous secret ballots & GBM polls',
        sangathanValueHi: 'गोपनीय डिजिटल गुप्त मतदान व आम सभा जनमत',
        competitorValueEn: 'Top-down broadcast only (No voting/ballots)',
        competitorValueHi: 'केवल एकतरफा प्रसारण (कोई मतदान नहीं)',
        category: 'democracy',
        sangathanAdvantage: true
      },
      {
        featureNameEn: 'Institutional Verification & Solidarity Pathway',
        featureNameHi: 'संस्थागत सत्यापन व विधिक मार्गदर्शन',
        sangathanValueEn: 'Bahujan Queer Foundation (Section 8 NGO) Verification Pathway for Active Collectives',
        sangathanValueHi: 'सक्रिय समूहों के लिए बहुजन क्वीर फाउंडेशन (सेक्शन 8 NGO) सत्यापन कार्यक्रम',
        competitorValueEn: 'None',
        competitorValueHi: 'कोई नहीं',
        category: 'privacy',
        sangathanAdvantage: true
      }
    ],
    pillars: [
      {
        titleEn: 'Ground Reality: Email vs Chai Stall Mobilization',
        titleHi: 'जमीनी वास्तविकता: ईमेल बनाम चाय दुकान की लामबंदी',
        sangathanDetailEn: 'In India, less than 15% of informal workers and colony residents read promotional emails. Sangathan equips organizers with ₹1 high-contrast photostat flyers, physical signature sheets, and WhatsApp broadcast bots.',
        sangathanDetailHi: 'भारत में 15% से भी कम लोग प्रमोशनल ईमेल खोलते हैं। संगठन कार्यकर्ताओं को चाय की दुकानों के लिए ₹1 ब्लैक-एंड-व्हाइट पर्चे, कागजी हस्ताक्षर तालिकाएं और व्हाट्सएप बॉट देता है।',
        competitorDetailEn: 'Action Network is optimized for US-style mass email marketing lists, requiring donors and volunteers to engage via email inboxes.',
        competitorDetailHi: 'एक्शन नेटवर्क अमेरिकी स्टाइल ईमेल मार्केटिंग पर आधारित है, जहां सारा संवाद ईमेल इनबॉक्स के माध्यम से होता है।',
        verdictEn: 'Sangathan wins hands-down for on-ground Indian mass mobilizations.',
        verdictHi: 'भारतीय धरातल पर जन अभियानों के लिए संगठन सर्वश्रेष्ठ है।'
      },
      {
        titleEn: 'Pricing & Currency: ₹0 Forever vs ₹9,000+/mo ($105/mo USD)',
        titleHi: 'मूल्य व मुद्रा: ₹0 निःशुल्क बनाम ₹9,000+ प्रति माह ($105/माह)',
        sangathanDetailEn: 'Sangathan pricing is three numbers: ₹0 Forever for grassroots collectives up to 5 member profiles, then (active members − 5) × ₹11/month metered billing with no base fee and no annual lock-in. Public supporters, voters and petition signers are never counted.',
        sangathanDetailHi: 'संगठन का मूल्य तीन संख्याओं में है: 5 सदस्य प्रोफाइल तक ₹0 हमेशा निःशुल्क, फिर (सक्रिय सदस्य − 5) × ₹11/माह मीटर बिलिंग — कोई बेस फीस नहीं, कोई वार्षिक बंधन नहीं। सार्वजनिक समर्थक, मतदाता व हस्ताक्षरकर्ता कभी गिने नहीं जाते।',
        competitorDetailEn: 'Action Network charges tiered monthly fees starting at ₹9,000/month ($105/mo USD) and scaling up to ₹90,000/month (~$1,050/mo USD) payable exclusively with international cards.',
        competitorDetailHi: 'एक्शन नेटवर्क न्यूनतम ₹9,000 प्रति माह ($105/माह) से शुरू होकर ₹90,000 प्रति माह तक चार्ज करता है, जिसके लिए अंतरराष्ट्रीय क्रेडिट कार्ड और डॉलर भुगतान अनिवार्य है।',
        verdictEn: 'Sangathan is built for local solidarity, not corporate SaaS extraction.',
        verdictHi: 'संगठन नागरिक सेवा के लिए है, कॉरपोरेट मुनाफे के लिए नहीं।'
      }
    ],
    faqs: [
      {
        questionEn: 'Can I migrate my Action Network donor and petition contacts to Sangathan?',
        questionHi: 'क्या मैं एक्शन नेटवर्क का डेटा संगठन में ला सकता हूँ?',
        answerEn: 'Yes. Sangathan includes a Universal Data Importer that imports any Action Network CSV export with automatic field matching and Indian mobile number E.164 sanitization.',
        answerHi: 'हाँ। संगठन के यूनिवर्सल डेटा इंपोर्टर से आप एक्शन नेटवर्क की CSV फाइल को 1-क्लिक में भारतीय फोन नंबर फॉर्मेट के साथ इंपोर्ट कर सकते हैं।'
      },
      {
        questionEn: 'Does Sangathan support 80G tax exemption receipts for Indian donors?',
        questionHi: 'क्या संगठन भारतीय दानदाताओं के लिए 80G टैक्स रसीदें जारी करता है?',
        answerEn: 'Yes. Unlike Action Network, Sangathan generates 80G/12A PDF tax receipts with donor PAN, registration number, and annual Form 10BD export.',
        answerHi: 'हाँ। एक्शन नेटवर्क के विपरीत, संगठन दानदाता के पैन कार्ड के साथ प्रमाणित 80G PDF रसीद और वार्षिक फॉर्म 10BD रिपोर्ट तैयार करता है।'
      }
    ]
  },

  'nationbuilder': {
    slug: 'nationbuilder',
    competitorName: 'NationBuilder',
    competitorCategoryEn: 'Enterprise Campaign Software',
    competitorCategoryHi: 'विदेशी एंटरप्राइज अभियान सॉफ्टवेयर',
    competitorTaglineEn: 'High-cost US political campaign CRM & voter database',
    competitorTaglineHi: 'अत्यधिक महंगा अमेरिकी राजनीतिक सीआरएम व डेटाबेस',
    metaTitleEn: 'Sangathan vs NationBuilder: Why Grassroots Movements Choose Sangathan',
    metaTitleHi: 'संगठन बनाम नेशनबिल्डर | जन आंदोलनों व एनजीओ के लिए तुलना',
    metaDescEn: 'Compare Sangathan and NationBuilder. See why Indian NGOs and civic groups choose Sangathan for ₹0 community tier, metered ₹11/member billing, Indian statutory compliance, and ground PWA.',
    metaDescHi: 'संगठन और नेशनबिल्डर की संपूर्ण तुलना। जानें क्यों भारतीय एनजीओ और नागरिक समूह ₹0 टियर, मीटर ₹11/सदस्य बिलिंग और फील्ड PWA के लिए संगठन चुनते हैं।',
    keywords: [
      'Sangathan vs NationBuilder', 'NationBuilder alternative India', 'NationBuilder pricing review India',
      'NGO software India free', 'civic collective campaign platform'
    ],
    heroHeadlineEn: 'NationBuilder Costs Thousands of Dollars (₹3 Lakhs+/Yr). Sangathan Powers Movement Democracy for ₹0.',
    heroHeadlineHi: 'नेशनबिल्डर पर लाखों रुपये खर्च करने के बजाय संगठन से ₹0 में आंदोलन चलाएं।',
    heroSubheadlineEn: 'NationBuilder is a legacy enterprise CRM charging from ₹3,300 up to ₹1,29,000+ per month ($39 - $1,500+/mo USD). Sangathan provides purpose-built, accessible infrastructure with Indian statutory registers (Form I, 12A/80G, Cash Book) and mobile field checks for ₹0.',
    heroSubheadlineHi: 'नेशनबिल्डर ₹3,300 से ₹1,29,000+ प्रति माह की भारी विदेशी फीस मांगता है। संगठन भारतीय जमीनी आंदोलनों के लिए बना है—वैधानिक फॉर्म I/H रजिस्टर, 12A/80G रसीदें, पारदर्शी बहीखाता और मोबाइल फील्ड टूल्स।',
    summaryVerdictEn: 'NationBuilder locks movements into expensive subscriptions starting at ₹3,300 to ₹1,29,000+ per month ($39 - $1,500/mo USD). Sangathan is free for community organizers (up to 5 member profiles), then metered at (active members − 5) × ₹11/month with no base fee and no annual lock-in, and ships with Indian compliance out of the box.',
    summaryVerdictHi: 'नेशनबिल्डर ₹3,300 से ₹1,29,000+ प्रति माह की महंगी फीस ($39-$1,500/माह) और जटिल सेटअप मांगता है। संगठन जमीनी कार्यकर्ताओं के लिए 5 प्रोफाइल तक निःशुल्क है, फिर (सक्रिय सदस्य − 5) × ₹11/माह मीटर बिलिंग — कोई बेस फीस नहीं, कोई वार्षिक बंधन नहीं — और भारतीय कानूनी नियमों से लैस है।',
    activistQuoteEn: '“We were quoted ₹3 Lakhs/year for NationBuilder. We moved our 12,000 supporters to Sangathan in 10 minutes at zero cost and our field teams actually use it daily.”',
    activistQuoteHi: '“नेशनबिल्डर ने हमसे सालाना ₹3 लाख मांगे थे। हमने 10 मिनट में अपने 12,000 समर्थक संगठन पर ₹0 में माइग्रेट किए और आज हमारी फील्ड टीम इसे रोज चलाती है।”',
    quoteAttributionEn: 'Civic Collective Organizer',
    quoteAttributionHi: 'नागरिक समूह संयोजक',
    comparisonMatrix: [
      {
        featureNameEn: 'Starting Monthly Cost & Cadre Quota',
        featureNameHi: 'शुरुआती मासिक खर्च व काडर क्षमता',
        sangathanValueEn: '₹0 / mo (Community Free) • ₹1,000/mo (500 Cadres, +₹11/scale)',
        sangathanValueHi: '₹0 / माह (कम्युनिटी फ्री) • ₹1,000/माह (500 काडर, +₹11/अतिरिक्त)',
        competitorValueEn: '₹3,300 - ₹1,29,000+ / month ($39 - $1,500+/mo USD)',
        competitorValueHi: '₹3,300 से ₹1,29,000+ प्रति माह ($39 - $1,500+/माह)',
        category: 'pricing',
        sangathanAdvantage: true
      },
      {
        featureNameEn: 'Indian Statutory Registers (Form I, Cash Book, 80G)',
        featureNameHi: 'भारतीय वैधानिक रजिस्टर (फॉर्म I, रोकड़, 80G)',
        sangathanValueEn: 'Built-in print-ready PDF registers',
        sangathanValueHi: 'प्रिंट-रेडी वैधानिक रजिस्टर',
        competitorValueEn: 'None (US IRS format only)',
        competitorValueHi: 'कुछ नहीं (केवल अमेरिकी फॉर्मेट)',
        category: 'compliance',
        sangathanAdvantage: true
      },
      {
        featureNameEn: 'Ease of Use & Mobile Learning Curve',
        featureNameHi: 'उपयोग में सरलता व मोबाइल इंटरफेस',
        sangathanValueEn: 'Zero-training mobile PWA with bilingual Hindi/English',
        sangathanValueHi: 'बिना ट्रेनिंग वाला सरल द्विभाषी हिंदी/अंग्रेजी ऐप',
        competitorValueEn: 'Complex enterprise dashboard requiring certified consultants',
        competitorValueHi: 'जटिल एंटरप्राइज सिस्टम जिसके लिए कंसल्टेंट चाहिए',
        category: 'ground_tools',
        sangathanAdvantage: true
      },
      {
        featureNameEn: 'Secret Voting & Group Decisions',
        featureNameHi: 'गुप्त मतदान व सामूहिक निर्णय',
        sangathanValueEn: 'Anonymous ballots for group decisions',
        sangathanValueHi: 'सामूहिक फैसलों के लिए गोपनीय मतदान',
        competitorValueEn: 'No secret ballot or internal election voting',
        competitorValueHi: 'कोई आंतरिक गुप्त मतदान प्रणाली नहीं',
        category: 'democracy',
        sangathanAdvantage: true
      }
    ],
    pillars: [
      {
        titleEn: 'Pricing Disparity: ₹3,300 - ₹1.29 Lakh/mo SaaS vs ₹0 Civic Solidarity',
        titleHi: 'कीमत का अंतर: ₹3,300 - ₹1.29 लाख/माह कॉरपोरेट SaaS बनाम ₹0 नागरिक एकजुटता',
        sangathanDetailEn: 'Sangathan is backed by Bahujan Queer Foundation (Section 8 NGO) with an open solidarity model. Funded institutions cross-subsidize grassroots collectives.',
        sangathanDetailHi: 'संगठन बहुजन क्वीर फाउंडेशन (सेक्शन 8 एनजीओ) द्वारा संचालित है। बड़े संस्थान छोटे नागरिक समूहों की मुफ्त होस्टिंग को सहयोग करते हैं।',
        competitorDetailEn: 'NationBuilder is a venture-backed commercial SaaS that aggressively increases subscription costs up to ₹1,29,000/month ($1,500/mo USD) as your supporter contact list grows.',
        competitorDetailHi: 'नेशनबिल्डर एक प्राइवेट कंपनी है जो आपके सदस्यों की संख्या बढ़ते ही ₹1,29,000 प्रति माह ($1,500/माह) तक की भारी फीस वसूलती है।',
        verdictEn: 'Sangathan ensures your movement is never held hostage to software license fees.',
        verdictHi: 'संगठन पर आपका आंदोलन कभी सॉफ्टवेयर फीस के कारण नहीं रुकता।'
      }
    ],
    faqs: [
      {
        questionEn: 'Does Sangathan have contact limits on the free plan?',
        questionHi: 'क्या संगठन के फ्री प्लान में संपर्कों की कोई सीमा है?',
        answerEn: 'Public supporters, petition signers and survey respondents are never counted — open participation under fair-use on every tier. The free Community Tier covers up to 5 member profiles; beyond 5 actives, metered billing runs (active members − 5) × ₹11/month.',
        answerHi: 'सार्वजनिक समर्थक, याचिका हस्ताक्षरकर्ता व सर्वे प्रतिभागी कभी गिने नहीं जाते — हर श्रेणी में खुली भागीदारी (उचित उपयोग)। मुफ्त कम्युनिटी टियर 5 सदस्य प्रोफाइल तक है; 5 से अधिक सक्रिय सदस्यों पर मीटर बिलिंग (सक्रिय सदस्य − 5) × ₹11/माह।'
      }
    ]
  },

  'everyaction': {
    slug: 'everyaction',
    competitorName: 'EveryAction (Bonterra)',
    competitorCategoryEn: 'US Legacy Non-Profit CRM',
    competitorCategoryHi: 'अमेरिकी गैर-लाभकारी सीआरएम',
    competitorTaglineEn: 'High-overhead legacy non-profit fundraising & advocacy suite',
    competitorTaglineHi: 'पारंपरिक गैर-लाभकारी फंडरेज़िंग सॉफ्टवेयर',
    metaTitleEn: 'Sangathan vs EveryAction (Bonterra) | Best Indian NGO Software',
    metaTitleHi: 'संगठन बनाम एवरीएक्शन (बोनटेरा) | भारतीय एनजीओ के लिए तुलना',
    metaDescEn: 'Compare Sangathan and EveryAction / Bonterra. Discover why Indian NGOs choose Sangathan for 80G-ready tax receipts, FCRA tracking, and ₹0-₹1,000 INR pricing vs ₹30,000+/mo USD contracts.',
    metaDescHi: 'संगठन और एवरीएक्शन की तुलना। जानें क्यों भारतीय स्वयंसेवी संस्थाएं 80G दान रसीदों, एफसीआरए ट्रैकिंग और डेटा स्वतंत्रता के लिए संगठन चुनती हैं।',
    keywords: [
      'Sangathan vs EveryAction', 'Bonterra alternative India', 'best NGO donor software India',
      '80G donor management software', 'FCRA compliant NGO database'
    ],
    heroHeadlineEn: 'Built for Indian Statutory Compliance, Not Western Corporate Overhead.',
    heroHeadlineHi: 'भारतीय कानूनी व आयकर नियमों के अनुकूल, विदेशी जटिलताओं से मुक्त।',
    heroSubheadlineEn: 'EveryAction costs ₹30,000 to ₹1,50,000+ per month ($350 - $1,800/mo USD) and was built for US 501(c)(3) rules. Sangathan is built specifically for Indian Income Tax 80G/12A receipts, CSR-1 grant accounting, Darpan ID tracking, and double-entry cash books for ₹0 to ₹1,000/mo.',
    heroSubheadlineHi: 'एवरीएक्शन ₹30,000 से ₹1,50,000+ प्रति माह चार्ज करता है और अमेरिकी 501(c)(3) नियमों के लिए बना है। संगठन भारतीय आयकर धारा 80G/12A, सीएसआर-1 ग्रांट्स, नीति आयोग दर्पण आईडी और डबल-एंट्री कैश बुक के लिए ₹0 से ₹1,000/माह में उपलब्ध है।',
    summaryVerdictEn: 'EveryAction requires long-term lock-in enterprise contracts costing ₹3.6 Lakhs to ₹18 Lakhs/year and lacks support for Indian tax requirements. Sangathan provides out-of-the-box 80G certificates, Form 10BD reporting, and instant UPI giving for ₹0 Community or ₹1,000/mo Sustainer access.',
    summaryVerdictHi: 'एवरीएक्शन में ₹3.6 लाख से ₹18 लाख/वर्ष के भारी वार्षिक अनुबंध होते हैं और भारतीय टैक्स नियमों का कोई सपोर्ट नहीं है। संगठन 80G रसीदें, 10BD फाइलिंग और यूपीआई दान ₹0 कम्युनिटी या ₹1,000/माह संरक्षक प्लान में देता है।',
    activistQuoteEn: '“EveryAction couldn’t even print a PAN-verified 80G receipt or handle UPI, and quoted us ₹50,000/month. Sangathan handled our entire annual donor audit in one afternoon for ₹1,000/mo.”',
    activistQuoteHi: '“एवरीएक्शन न तो पैन कार्ड वाली 80G रसीद दे सकता था और न ही यूपीआई, ऊपर से ₹50,000/माह मांग रहा था। संगठन ने ₹1,000/माह में हमारा पूरा वार्षिक डोनर ऑडिट एक दोपहर में तैयार कर दिया।”',
    quoteAttributionEn: 'National Child Education & Relief Trust Treasurer',
    quoteAttributionHi: 'राष्ट्रीय बाल शिक्षा एवं राहत ट्रस्ट कोषाध्यक्ष',
    comparisonMatrix: [
      {
        featureNameEn: 'Starting Monthly Subscription Cost',
        featureNameHi: 'शुरुआती मासिक सदस्यता खर्च',
        sangathanValueEn: '₹0 Forever (Community) • ₹1,000/mo (500 Cadres Base, +₹11/scale)',
        sangathanValueHi: '₹0 हमेशा निःशुल्क (कम्युनिटी) • ₹1,000/माह (500 काडर, +₹11/अतिरिक्त)',
        competitorValueEn: '₹30,000 - ₹1,50,000+ / month ($350 - $1,800/mo USD + multi-year contract)',
        competitorValueHi: '₹30,000 से ₹1,50,000+ प्रति माह ($350 - $1,800/माह) + कड़ा वार्षिक अनुबंध',
        category: 'pricing',
        sangathanAdvantage: true
      },
      {
        featureNameEn: '80G & 12A Compliant Tax Receipts',
        featureNameHi: '80G व 12A आयकर दान रसीदें',
        sangathanValueEn: 'PDF generation with PAN & 10BD export',
        sangathanValueHi: 'पैन कार्ड व 10BD एक्सपोर्ट के साथ PDF रसीदें',
        competitorValueEn: 'No (US 501(c)(3) only)',
        competitorValueHi: 'नहीं (केवल अमेरिकी टैक्स रसीदें)',
        category: 'compliance',
        sangathanAdvantage: true
      },
      {
        featureNameEn: 'Contract & Vendor Lock-in',
        featureNameHi: 'अनुबंध व वेंडर लॉक-इन',
        sangathanValueEn: 'Zero lock-in, 1-click full open JSON/CSV data export',
        sangathanValueHi: 'शून्य लॉक-इन, 1-क्लिक में पूरा डेटा एक्सपोर्ट',
        competitorValueEn: 'Strict multi-year annual contracts with migration fees',
        competitorValueHi: 'कड़े बहु-वर्षीय अनुबंध और भारी माइग्रेशन फीस',
        category: 'privacy',
        sangathanAdvantage: true
      }
    ],
    pillars: [
      {
        titleEn: 'Statutory Alignment with Indian Law',
        titleHi: 'भारतीय कानूनों के साथ सीधा तालमेल',
        sangathanDetailEn: 'Sangathan generates official registers for the Societies Registration Act 1860, Indian Trusts Act 1882, and CSR-1 project tracking.',
        sangathanDetailHi: 'संगठन सोसायटी एक्ट 1860, इंडियन ट्रस्ट एक्ट 1882 और सीएसआर-1 के लिए आधिकारिक वैधानिक रजिस्टर तैयार करता है।',
        competitorDetailEn: 'EveryAction is tied to US state and federal FEC reporting rules.',
        competitorDetailHi: 'एवरीएक्शन पूरी तरह से अमेरिकी चुनाव और फेडरल नियमों से बंधा हुआ है।',
        verdictEn: 'Sangathan is the only choice for Indian non-profits.',
        verdictHi: 'भारतीय गैर-लाभकारी संस्थाओं के लिए संगठन ही एकमात्र सटीक विकल्प है।'
      }
    ],
    faqs: [
      {
        questionEn: 'Does Sangathan support CSR milestone grant reporting?',
        questionHi: 'क्या संगठन सीएसआर ग्रांट्स की रिपोर्टिंग संभालता है?',
        answerEn: 'Yes. Sangathan tracks sanctioned budgets vs actual spend with voucher attachments for annual CSR-1 audit reporting.',
        answerHi: 'हाँ। संगठन स्वीकृत बजट बनाम वास्तविक खर्च और बिल वाउचर के साथ सीएसआर-1 ऑडिट रिपोर्ट तैयार करता है।'
      }
    ]
  },

  'mobilize': {
    slug: 'mobilize',
    competitorName: 'Mobilize',
    competitorCategoryEn: 'Event Ticketing & Volunteer Shift Tool',
    competitorCategoryHi: 'इवेंट टिकटिंग व वॉलंटियर शिफ्ट टूल',
    competitorTaglineEn: 'US volunteer event scheduling and canvassing portal',
    competitorTaglineHi: 'अमेरिकी स्वयंसेवक इवेंट व शिफ्ट शेड्यूलिंग पोर्टल',
    metaTitleEn: 'Sangathan vs Mobilize: All-in-One Movement OS vs Event Scheduler',
    metaTitleHi: 'संगठन बनाम मोबिलाइज | संपूर्ण जन आंदोलन प्रणाली बनाम इवेंट टूल',
    metaDescEn: 'Compare Sangathan and Mobilize. Why civic movements need a full democratic operating system (₹0 - ₹1,000/mo) rather than paying ₹8,500 - ₹45,000/mo USD for single-purpose event tools.',
    metaDescHi: 'संगठन और मोबिलाइज की तुलना। जानें क्यों नागरिक समूहों को केवल इवेंट टिकटिंग नहीं बल्कि गुप्त मतदान, आरटीआई ट्रैकर और फील्ड जांच वाली संपूर्ण प्रणाली चाहिए।',
    keywords: [
      'Sangathan vs Mobilize', 'Mobilize America alternative', 'volunteer management app India',
      'grassroots event organizing platform', 'civic event ticketing India'
    ],
    heroHeadlineEn: 'Mobilize Does Event Shifts. Sangathan Powers the Entire Movement.',
    heroHeadlineHi: 'मोबिलाइज केवल इवेंट बनाता है; संगठन पूरा जन आंदोलन चलाता है।',
    heroSubheadlineEn: 'Mobilize costs ₹8,500 to ₹45,000+ per month ($100 - $500/mo USD) for event signups alone. Sangathan is a complete digital operating system providing field checks, ₹1 printable flyers, complaint diary with RTI reminders, 80G donations, and democratic voting for ₹0 to ₹1,000/mo.',
    heroSubheadlineHi: 'मोबिलाइज केवल इवेंट साइनअप के लिए ₹8,500 से ₹45,000+ प्रति माह लेता है। संगठन संपूर्ण आंदोलन ऑपरेटिंग सिस्टम है—फील्ड जांच, ₹1 पर्चा, आरटीआई याद वाली शिकायत डायरी, 80G दान और गुप्त मतदान।',
    summaryVerdictEn: 'Event signups alone do not win civic battles. Sangathan combines public mobilization with administrative accountability, statutory filing, transparent financial ledgers, and emergency defense infrastructure at ₹0 Community or ₹1,000/mo Sustainer access vs Mobilize\'s ₹8,500+/mo ($100+/mo USD) fee.',
    summaryVerdictHi: 'केवल इवेंट बनाने से नागरिक समस्याएं हल नहीं होतीं। संगठन इवेंट्स के साथ-साथ प्रशासनिक जवाबदेही, कानूनी सुरक्षा, खुला बहीखाता और आपातकालीन एसओएस देता है।',
    activistQuoteEn: '“Mobilize can tell you who came to a rally for ₹20,000/mo. Sangathan turns those attendees into a disciplined collective that forces the administration to fix our ward for ₹0.”',
    activistQuoteHi: '“मोबिलाइज ₹20,000/माह में केवल यह बताता है कि रैली में कौन आया। संगठन उन लोगों को एक अनुशासित शक्ति बनाता है जो प्रशासन से अपना हक छीन कर लाती है।”',
    quoteAttributionEn: 'Campus Action Volunteer',
    quoteAttributionHi: 'छात्र संघ कैम्पस एक्शन सचिव',
    comparisonMatrix: [
      {
        featureNameEn: 'Monthly Cost & Subscription Value',
        featureNameHi: 'मासिक खर्च व प्लेटफॉर्म का दायरा',
        sangathanValueEn: '₹0 Forever (Community) • ₹1,000/mo (500 Cadres Full OS)',
        sangathanValueHi: '₹0 हमेशा निःशुल्क (कम्युनिटी) • ₹1,000/माह (500 काडर संपूर्ण OS)',
        competitorValueEn: '₹8,500 - ₹45,000+ / month ($100 - $500/mo USD for event tool only)',
        competitorValueHi: '₹8,500 से ₹45,000+ प्रति माह ($100 - $500/माह केवल इवेंट टूल के लिए)',
        category: 'pricing',
        sangathanAdvantage: true
      },
      {
        featureNameEn: 'Platform Scope & Utility',
        featureNameHi: 'प्लेटफॉर्म का दायरा व क्षमता',
        sangathanValueEn: 'Complete Movement OS (Grievances, Audits, Voting, Ledger, Events)',
        sangathanValueHi: 'संपूर्ण आंदोलन ओएस (शिकायत, ऑडिट, वोटिंग, बहीखाता, इवेंट)',
        competitorValueEn: 'Event & volunteer shift scheduling only',
        competitorValueHi: 'केवल इवेंट व वॉलंटियर शिफ्ट शेड्यूलिंग',
        category: 'ground_tools',
        sangathanAdvantage: true
      },
      {
        featureNameEn: 'Field Evidence & Spot Audits',
        featureNameHi: 'फील्ड साक्ष्य व स्पॉट ऑडिट',
        sangathanValueEn: 'Air quality, sewer overflow, and pothole GPS sensor logger',
        sangathanValueHi: 'वायु गुणवत्ता, सीवर और सड़क गड्ढों का जीपीएस सेंसर लॉगर',
        competitorValueEn: 'None',
        competitorValueHi: 'कुछ नहीं',
        category: 'ground_tools',
        sangathanAdvantage: true
      }
    ],
    pillars: [
      {
        titleEn: 'Beyond Events: Complete Administrative Escalation',
        titleHi: 'इवेंट्स से आगे: पूर्ण प्रशासनिक पैरवी',
        sangathanDetailEn: 'Sangathan keeps street turnouts connected to follow-up with dated complaint diary entries and 30-day RTI reminders.',
        sangathanDetailHi: 'संगठन रैली की भीड़ को तारीख वाली शिकायत डायरी और 30-दिवसीय आरटीआई याद से जोड़े रखता है।',
        competitorDetailEn: 'Mobilize ends at the event door—it has no tools for legal defense, administrative follow-up, or local government accountability.',
        competitorDetailHi: 'मोबिलाइज केवल इवेंट तक सीमित है—इसमें कानूनी सुरक्षा या सरकारी पत्राचार का कोई टूल नहीं है।',
        verdictEn: 'Sangathan provides 10x more utility for real-world impact.',
        verdictHi: 'वास्तविक बदलाव के लिए संगठन 10 गुना अधिक उपयोगी है।'
      }
    ],
    faqs: [
      {
        questionEn: 'Can we create public events and rallies on Sangathan?',
        questionHi: 'क्या हम संगठन पर सार्वजनिक इवेंट्स और रैलियां बना सकते हैं?',
        answerEn: 'Yes. Sangathan includes full event creation with RSVP ticketing, WhatsApp reminders, volunteer shift allocations, and QR check-in.',
        answerHi: 'हाँ। संगठन में RSVP टिकटिंग, व्हाट्सएप रिमाइंडर, वॉलंटियर शिफ्ट और क्यूआर कोड चेक-इन के साथ संपूर्ण इवेंट मैनेजमेंट है।'
      }
    ]
  },

  'civicrm': {
    slug: 'civicrm',
    competitorName: 'CiviCRM',
    competitorCategoryEn: 'Open Source Self-Hosted CRM',
    competitorCategoryHi: 'ओपन सोर्स सेल्फ-होस्टेड सीआरएम',
    competitorTaglineEn: 'Legacy PHP/Drupal self-hosted civic database',
    competitorTaglineHi: 'पारंपरिक PHP/द्रुपल आधारित सेल्फ-होस्टेड डेटाबेस',
    metaTitleEn: 'Sangathan vs CiviCRM: Modern Cloud PWA vs Legacy PHP Hosting',
    metaTitleHi: 'संगठन बनाम CiviCRM | आधुनिक क्लाउड PWA बनाम जटिल PHP सर्वर',
    metaDescEn: 'Compare Sangathan and CiviCRM. Why modern non-profits choose Sangathan for zero server maintenance, mobile-first PWA, instant setup, and WhatsApp integration vs ₹25,000-₹50,000/mo hosting bills.',
    metaDescHi: 'संगठन और CiviCRM की तुलना। जानें क्यों आधुनिक एनजीओ शून्य सर्वर मेंटेनेंस, मोबाइल-फर्स्ट PWA और व्हाट्सएप इंटीग्रेशन के लिए संगठन चुनते हैं।',
    keywords: [
      'Sangathan vs CiviCRM', 'CiviCRM alternative modern', 'CiviCRM hosting cost comparison',
      'open source NGO software cloud', 'CiviCRM maintenance problems'
    ],
    heroHeadlineEn: 'Say Goodbye to Broken PHP Servers and Expensive CiviCRM Hosting.',
    heroHeadlineHi: 'टूटे हुए PHP सर्वर और महंगे CiviCRM मेंटेनेंस से मुक्ति पाएं।',
    heroSubheadlineEn: 'CiviCRM requires complex Drupal/WordPress servers, security patching, and ₹25,000 to ₹50,000/month in IT consultant fees. Sangathan gives you a blazing-fast, modern Next.js Progressive Web App with zero maintenance and instant setup for ₹0 to ₹1,000/mo.',
    heroSubheadlineHi: 'CiviCRM के लिए जटिल सर्वर, सिक्यूरिटी पैच और ₹25,000 से ₹50,000/माह के आईटी कंसल्टेंट चाहिए। संगठन आधुनिक, तेज और बिना किसी सर्वर मेंटेनेंस के ₹0 से ₹1,000/माह में तुरंत शुरू होता है।',
    summaryVerdictEn: 'While CiviCRM is open source, the hidden costs of server management, plugin conflicts, and developer retainers (₹3 Lakhs - ₹6 Lakhs/year) make it unviable for grassroots teams. Sangathan provides sovereign digital infrastructure with zero maintenance overhead.',
    summaryVerdictHi: 'यद्यपि CiviCRM ओपन सोर्स है, लेकिन सर्वर खर्च और ₹3 से ₹6 लाख/वर्ष की तकनीकी जटिलताएं इसे आम संस्थाओं के लिए अनुपयोगी बना देती हैं। संगठन बिना किसी तकनीकी झंझट के संपूर्ण समाधान देता है।',
    activistQuoteEn: '“Our CiviCRM server crashed every time we sent a campaign update. Switching to Sangathan saved us ₹40,000/month in server and developer bills.”',
    activistQuoteHi: '“जब भी हम अभियान चलाते, हमारा CiviCRM सर्वर क्रैश हो जाता था। संगठन पर आने से हमारे सर्वर और डेवलपर के ₹40,000 प्रति माह बच गए।”',
    quoteAttributionEn: 'Environmental Rights Network IT Coordinator',
    quoteAttributionHi: 'पर्यावरण अधिकार नेटवर्क आईटी समन्वयक',
    comparisonMatrix: [
      {
        featureNameEn: 'True Monthly Infrastructure & Maintenance Cost',
        featureNameHi: 'वास्तविक मासिक इंफ्रास्ट्रक्चर व मेंटेनेंस खर्च',
        sangathanValueEn: '₹0 / mo (Community) • ₹1,000/mo (500 Cadres Sustainer, Zero maintenance)',
        sangathanValueHi: '₹0 / माह (कम्युनिटी) • ₹1,000/माह (500 काडर संरक्षक, शून्य मेंटेनेंस)',
        competitorValueEn: '₹25,000 - ₹50,000 / month (AWS/VPS servers + Drupal/PHP IT developer retainers)',
        competitorValueHi: '₹25,000 से ₹50,000 प्रति माह (क्लाउड सर्वर + PHP/Drupal डेवलपर मेंटेनेंस)',
        category: 'pricing',
        sangathanAdvantage: true
      },
      {
        featureNameEn: 'Server Setup & Maintenance Burden',
        featureNameHi: 'सर्वर सेटअप व मेंटेनेंस का झंझट',
        sangathanValueEn: 'Zero setup, 1-click cloud PWA with automatic updates',
        sangathanValueHi: 'शून्य झंझट, 1-क्लिक क्लाउड PWA व स्वतः अपडेट',
        competitorValueEn: 'Complex self-managed Linux/PHP/MySQL hosting & patches',
        competitorValueHi: 'जटिल लिनक्स/PHP सर्वर, डेटाबेस व सिक्योरिटी पैच',
        category: 'ground_tools',
        sangathanAdvantage: true
      },
      {
        featureNameEn: 'Mobile-First Experience',
        featureNameHi: 'मोबाइल-फर्स्ट अनुभव',
        sangathanValueEn: 'Native-feel offline PWA installable on any smartphone',
        sangathanValueHi: 'स्मार्टफोन पर चलने वाला तेज व आधुनिक PWA',
        competitorValueEn: 'Clunky 2000s desktop browser interface',
        competitorValueHi: 'पुरातन डेस्कटॉप आधारित धीमा इंटरफेस',
        category: 'ground_tools',
        sangathanAdvantage: true
      }
    ],
    pillars: [
      {
        titleEn: 'Total Cost of Ownership: Hidden Tech Debt',
        titleHi: 'कुल वास्तविक खर्च: तकनीकी बोझ से मुक्ति',
        sangathanDetailEn: 'Sangathan handles all hosting, cryptographic backups, encryption, and scaling without charging maintenance fees.',
        sangathanDetailHi: 'संगठन बिना किसी मेंटेनेंस चार्ज के सारा डेटा, बैकअप और सुरक्षा क्लाउड पर संभालता है।',
        competitorDetailEn: 'CiviCRM appears free initially but requires ₹25,000 - ₹50,000 monthly for specialized Drupal/PHP system administration.',
        competitorDetailHi: 'CiviCRM दिखने में फ्री है लेकिन इसे चलाने के लिए ₹25,000 से ₹50,000 प्रति माह का आईटी इंजीनियर रखना पड़ता है।',
        verdictEn: 'Sangathan is truly accessible to non-technical organizers.',
        verdictHi: 'संगठन गैर-तकनीकी कार्यकर्ताओं के लिए सबसे आसान और सस्ता है।'
      }
    ],
    faqs: [
      {
        questionEn: 'Do we own our data on Sangathan like we do on a self-hosted CiviCRM?',
        questionHi: 'क्या संगठन पर हमारा डेटा सुरक्षित और हमारे नियंत्रण में रहता है?',
        answerEn: 'Yes. Sangathan enforces complete data sovereignty with 1-click full JSON/CSV export, zero telemetry tracking, and Section 8 non-profit governance.',
        answerHi: 'हाँ। संगठन डेटा संप्रभुता की पूर्ण गारंटी देता है—आप कभी भी 1-क्लिक में अपना संपूर्ण डेटा एक्सपोर्ट कर सकते हैं।'
      }
    ]
  },

  'whatsapp-sheets': {
    slug: 'whatsapp-sheets',
    competitorName: 'WhatsApp Groups & Google Sheets',
    competitorCategoryEn: 'Ad-hoc Informal Messaging & Spreadsheets',
    competitorCategoryHi: 'अनौपचारिक व्हाट्सएप ग्रुप व गूगल शीट्स',
    competitorTaglineEn: 'Scattered group chats, lost files & spreadsheet chaos',
    competitorTaglineHi: 'बिखरे हुए चैट, खोई हुई फाइलें व एक्सेल की अव्यवस्था',
    metaTitleEn: 'Sangathan vs WhatsApp Groups & Google Sheets: Why Spreadsheets Fail Movements',
    metaTitleHi: 'संगठन बनाम व्हाट्सएप ग्रुप व गूगल शीट्स | आंदोलन के लिए सही व्यवस्था',
    metaDescEn: 'Compare Sangathan with WhatsApp groups and Excel sheets. Why serious civic movements and NGOs switch to Sangathan for dated records, secret voting, and RTI reminders.',
    metaDescHi: 'संगठन और व्हाट्सएप/एक्सेल की तुलना। जानें क्यों गंभीर जन आंदोलन और एनजीओ खोई हुई फाइलों से बचकर पारदर्शी बहीखाते और गुप्त मतदान के लिए संगठन अपनाते हैं।',
    keywords: [
      'Sangathan vs WhatsApp groups', 'Google sheets alternative NGO', 'WhatsApp group organizing problems',
      'society management without excel', 'union membership software vs spreadsheet'
    ],
    heroHeadlineEn: 'WhatsApp Groups Cause Clutter. Spreadsheets Break. Sangathan Wins Battles.',
    heroHeadlineHi: 'व्हाट्सएप पर केवल शोर होता है; एक्सेल फाइलें खो जाती हैं; संगठन से जीत मिलती है।',
    heroSubheadlineEn: 'Organizing on WhatsApp groups leads to message chaos, lost documents, privacy leaks, and zero accountability. Sangathan replaces spreadsheet chaos with structured member rolls, complaint diary with RTI reminders, transparent UPI ledgers, and secret ballots for ₹0 to ₹1,000/mo.',
    heroSubheadlineHi: 'व्हाट्सएप ग्रुपों में जरूरी बातें दब जाती हैं, नंबर लीक होते हैं और कोई जिम्मेदारी तय नहीं होती। संगठन स्प्रेडशीट की अव्यवस्था को हटाकर व्यवस्थित सदस्य पंजी, आरटीआई याद वाली शिकायत डायरी और पारदर्शी बहीखाता देता है।',
    summaryVerdictEn: 'WhatsApp is an informal chat app, not an organization operating system. Sangathan provides the structured discipline and financial transparency that turns scattered groups into strong institutions with a ₹0 Community tier and ₹1,000/mo Sustainer plan.',
    summaryVerdictHi: 'व्हाट्सएप केवल बातचीत के लिए है, संगठन चलाने के लिए नहीं। संगठन वह अनुशासन और वित्तीय पारदर्शिता देता है जो भीड़ को मजबूत संगठन बनाती है।',
    activistQuoteEn: '“On WhatsApp, our municipal petition got lost in 500 good-morning messages. On Sangathan, it is a dated diary entry with a photo that nobody can deny.”',
    activistQuoteHi: '“व्हाट्सएप पर हमारा मांग पत्र 500 गुड-मॉर्निंग मैसेज में दब गया था। संगठन पर वह तारीख वाली फोटो सहित प्रविष्टि है जिससे कोई मुकर नहीं सकता।”',
    quoteAttributionEn: 'Colony Resident Welfare Action Team Member',
    quoteAttributionHi: 'कॉलोनी नागरिक सुधार टीम साथी',
    comparisonMatrix: [
      {
        featureNameEn: 'Total Cost & Operational Risk',
        featureNameHi: 'कुल खर्च व परिचालन जोखिम',
        sangathanValueEn: '₹0 Forever (Community) • ₹1,000/mo (500 Cadres Sustainer)',
        sangathanValueHi: '₹0 हमेशा निःशुल्क (कम्युनिटी) • ₹1,000/माह (500 काडर संरक्षक)',
        competitorValueEn: '₹0 direct (High hidden losses in lost donations, leakage & manual chaos)',
        competitorValueHi: '₹0 प्रत्यक्ष (डेटा नुकसान, खोए हुए दान और मैन्युअल अव्यवस्था की भारी छिपी लागत)',
        category: 'pricing',
        sangathanAdvantage: true
      },
      {
        featureNameEn: 'Information Organization & Retrieval',
        featureNameHi: 'जानकारी का व्यवस्थित रिकॉर्ड',
        sangathanValueEn: 'Structured desks for grievances, bills, votes, and registers',
        sangathanValueHi: 'शिकायत, बिल, वोट और रजिस्टर के लिए अलग-अलग डेस्क',
        competitorValueEn: 'Chaotic chat stream with files buried under endless messages',
        competitorValueHi: 'मैसेजों की बाढ़ में खो जाने वाली फाइलें और तस्वीरें',
        category: 'ground_tools',
        sangathanAdvantage: true
      },
      {
        featureNameEn: 'Member Privacy & Phone Number Safety',
        featureNameHi: 'सदस्यों की निजता व फोन नंबर सुरक्षा',
        sangathanValueEn: 'Role-based access; phone numbers protected from strangers',
        sangathanValueHi: 'भूमिका-आधारित सुरक्षा; अजनबियों से फोन नंबर पूरी तरह सुरक्षित',
        competitorValueEn: 'Every member phone number exposed to all group participants',
        competitorValueHi: 'ग्रुप के हर व्यक्ति को सभी सदस्यों का नंबर दिखना',
        category: 'privacy',
        sangathanAdvantage: true
      },
      {
        featureNameEn: 'Financial Transparency & 80G Receipts',
        featureNameHi: 'वित्तीय पारदर्शिता व टैक्स रसीदें',
        sangathanValueEn: 'Double-entry ledger with PDF receipts',
        sangathanValueHi: 'अनुबंध बहीखाता व PDF रसीदें',
        competitorValueEn: 'Manual spreadsheet rows prone to accidental deletion and fraud',
        competitorValueHi: 'एक्सेल शीट जिसमें गलती से डेटा डिलीट होने का खतरा रहता है',
        category: 'compliance',
        sangathanAdvantage: true
      },
      {
        featureNameEn: 'Democratic Voting Integrity',
        featureNameHi: 'लोकतांत्रिक मतदान की विश्वसनीयता',
        sangathanValueEn: 'Cryptographic secret ballots with verified 1-person-1-vote',
        sangathanValueHi: 'क्रिप्टोग्राफिक गुप्त मतदान (1-व्यक्ति-1-वोट)',
        competitorValueEn: 'Open WhatsApp polls easily rigged with no voter secrecy',
        competitorValueHi: 'खुले व्हाट्सएप पोल जिनमें गोपनीयता शून्य होती है',
        category: 'democracy',
        sangathanAdvantage: true
      },
      {
        featureNameEn: 'Communications & Video Sync',
        featureNameHi: 'संवाद व वीडियो कॉल एकीकरण',
        sangathanValueEn: 'Unified Inbox with 1-click Google Meet video rooms & Telegram bots',
        sangathanValueHi: '1-क्लिक Google Meet वीडियो कॉलिंग व टेलीग्राम बॉट युक्त एकीकृत इनबॉक्स',
        competitorValueEn: 'Unrecorded personal calls and disorganized group mentions',
        competitorValueHi: 'बिना रिकॉर्ड की निजी कॉल्स और अनियंत्रित ग्रुप मैसेज',
        category: 'ground_tools',
        sangathanAdvantage: true
      },
      {
        featureNameEn: 'Operational Schedule & Field Pairing',
        featureNameHi: 'केंद्रीकृत कैलेंडर व फील्ड रोस्टर',
        sangathanValueEn: 'Centralized Calendar with live Google & Apple iCal sync + Surveyor Pairing',
        sangathanValueHi: 'Google व Apple iCal सिंक और फील्ड सर्वेक्षक जोड़ियों वाला केंद्रीकृत कैलेंडर',
        competitorValueEn: 'Missed meeting reminders buried in chat scrollback',
        competitorValueHi: 'चैट में खो जाने वाले मीटिंग रिमाइंडर्स',
        category: 'ground_tools',
        sangathanAdvantage: true
      }
    ],
    pillars: [
      {
        titleEn: 'Administrative Impact: Casual Chat vs Legal Proof',
        titleHi: 'प्रशासनिक प्रभाव: सामान्य चैट बनाम कानूनी सबूत',
        sangathanDetailEn: 'Sangathan produces stamped receiving copies, formal letters, and statutory RTI applications that government officers must legally answer.',
        sangathanDetailHi: 'संगठन मुहर लगे मांग पत्र और वैधानिक आरटीआई आवेदन तैयार करता है जिनका जवाब देना अधिकारी के लिए कानूनी रूप से अनिवार्य है।',
        competitorDetailEn: 'WhatsApp screenshots are routinely ignored by government officials and carry zero legal weight in administrative proceedings.',
        competitorDetailHi: 'व्हाट्सएप के स्क्रीनशॉट को सरकारी अधिकारी कूड़ेदान में डाल देते हैं और उनकी कोई कानूनी मान्यता नहीं होती।',
        verdictEn: 'Sangathan gives you institutional administrative power.',
        verdictHi: 'संगठन आपको संस्थागत प्रशासनिक ताकत देता है।'
      }
    ],
    faqs: [
      {
        questionEn: 'Do we have to stop using WhatsApp completely?',
        questionHi: 'क्या हमें व्हाट्सएप का इस्तेमाल पूरी तरह बंद करना होगा?',
        answerEn: 'No! Sangathan integrates with WhatsApp. You can send broadcast notices, tax/80G-ready receipts, and vote links directly into your members’ WhatsApp while keeping your core database and records secure on Sangathan.',
        answerHi: 'नहीं! संगठन व्हाट्सएप से सीधे जुड़ता है। आप संगठन से सीधे सदस्यों के व्हाट्सएप पर रसीदें, सूचनाएं और वोटिंग लिंक भेज सकते हैं जबकि मुख्य रिकॉर्ड संगठन पर सुरक्षित रहेगा।'
      }
    ]
  }
}
