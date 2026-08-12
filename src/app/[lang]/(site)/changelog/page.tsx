import { Sparkles, ShieldCheck, Zap, Server, Code, Users, Calendar, Activity, Rocket, Globe, LucideIcon, Building2, Network, Phone } from 'lucide-react'
import { Metadata } from 'next'
import { PageHeader } from '@/components/public/page-header'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'परिवर्तन लॉग | संगठन' : 'Changelog | Sangathan',
    description: isHindi
      ? 'हमारे अपडेट और सुधारों का एक पारदर्शी रिकॉर्ड।'
      : 'A transparent record of our updates and improvements.',
  }
}

type Feature = {
  nameEn: string
  nameHi: string
  textEn: string
  textHi: string
}

type ChangelogEntry = {
  version: string
  titleEn: string
  titleHi: string
  dateEn: string
  dateHi: string
  descEn: string
  descHi: string
  color: 'green' | 'blue' | 'purple' | 'indigo' | 'orange' | 'emerald' | 'cyan' | 'pink' | 'rose' | 'amber' | 'slate'
  icon: LucideIcon
  features?: Feature[]
}

const changelogData: ChangelogEntry[] = [
  {
    version: 'v1.36.0',
    titleEn: 'Live Google Workspace API Integration — Contacts, Sheets & Forms with Incremental OAuth Consent',
    titleHi: 'लाइव Google Workspace API इंटीग्रेशन — संपर्क, शीट्स व फॉर्म्स, इन्क्रीमेंटल OAuth सहमति सहित',
    dateEn: 'August 2026',
    dateHi: 'अगस्त 2026',
    descEn: 'Upgraded the import infrastructure from manual CSV workarounds to real, authenticated Google API integration. Users can now pull contacts directly from Google People API, import private Google Sheets via the Sheets API, and migrate entire Google Forms (structure + all historical responses) via the Forms API. All permissions are requested incrementally — normal login stays lightweight, and additional Google API scopes are requested only when a user actually accesses the import feature.',
    descHi: 'आयात सुविधा को मैन्युअल CSV वर्कअराउंड से वास्तविक, प्रमाणित Google API इंटीग्रेशन में अपग्रेड किया गया। अब उपयोगकर्ता सीधे Google People API से संपर्क खींच सकते हैं, Sheets API से प्राइवेट Google Sheets आयात कर सकते हैं, और Forms API से पूरे Google Forms (संरचना + सभी ऐतिहासिक उत्तर) माइग्रेट कर सकते हैं। सभी अनुमतियाँ इन्क्रीमेंटली माँगी जाती हैं — सामान्य लॉगिन हल्का रहता है।',
    color: 'green',
    icon: Globe,
    features: [
      {
        nameEn: 'Live Google Contacts Import via People API',
        nameHi: 'Google People API से लाइव संपर्क आयात',
        textEn: 'One-click import of contacts directly from your Google account. Select specific contacts from a searchable checklist, with automatic phone/email/organization extraction and duplicate deduplication.',
        textHi: 'अपने Google खाते से एक क्लिक में सीधे संपर्क आयात करें। खोज योग्य चेकलिस्ट से विशिष्ट संपर्क चुनें, स्वचालित फ़ोन/ईमेल/संगठन निकालना और डुप्लिकेट हटाना।',
      },
      {
        nameEn: 'Private Google Sheets Import via Sheets API',
        nameHi: 'Sheets API से प्राइवेट Google Sheets आयात',
        textEn: 'Import data from private (non-shared) Google Sheets using authenticated API access. Falls back to public URL fetch for shared sheets. Supports specific tab selection.',
        textHi: 'प्रमाणित API एक्सेस से प्राइवेट (गैर-साझा) Google Sheets से डेटा आयात करें। साझा शीट्स के लिए सार्वजनिक URL फ़ेच पर फ़ॉलबैक। विशिष्ट टैब चयन सपोर्ट।',
      },
      {
        nameEn: 'Google Forms Structure & Response Migration via Forms API',
        nameHi: 'Forms API से Google Forms संरचना व उत्तर माइग्रेशन',
        textEn: 'Automatically pull form structure (questions, field types, options) and all historical responses from any Google Form. Auto-maps Google Forms question types to Sangathan field types.',
        textHi: 'किसी भी Google Form से फ़ॉर्म संरचना (प्रश्न, फ़ील्ड प्रकार, विकल्प) और सभी ऐतिहासिक उत्तर स्वचालित रूप से खींचें। Google Forms प्रश्न प्रकारों को संगठन फ़ील्ड प्रकारों में ऑटो-मैप करता है।',
      },
      {
        nameEn: 'Incremental OAuth Consent',
        nameHi: 'इन्क्रीमेंटल OAuth सहमति',
        textEn: 'Google API permissions are requested only when needed — not during normal login. Users see a clear consent prompt only when they access import features, keeping the login experience lightweight.',
        textHi: 'Google API अनुमतियाँ केवल आवश्यकता पड़ने पर माँगी जाती हैं — सामान्य लॉगिन के दौरान नहीं। उपयोगकर्ताओं को स्पष्ट सहमति प्रॉम्प्ट केवल आयात सुविधाओं तक पहुँचने पर दिखाई देता है।',
      },
    ],
  },
  {
    version: 'v1.35.0',
    titleEn: 'Jotform-Style Form & Survey Studio with Live Executive Intelligence & Participant PDF Dossiers',
    titleHi: 'जॉटफॉर्म-शैली फॉर्म व सर्वे स्टूडियो, लाइव कार्यकारी बुद्धिमत्ता एवं प्रतिभागी PDF डोजियर',
    dateEn: 'August 2026',
    dateHi: 'अगस्त 2026',
    descEn: 'Transformed Sangathan into an ultra-intuitive, Jotform-grade civic questionnaire and polling platform. Features curated 1-click templates tailored specifically for each organization archetype (NGOs, Student Unions, Workers Unions, RWAs, and Civic Collectives), 13 purpose-built field types including 1-5 Star Ratings and Likert Satisfaction Scales, real-time Goal Consensus and Sentiment Matrix analysis, automated executive synthesis, and 1-click Participant PDF Dossier exports.',
    descHi: 'संगठन को एक अत्यंत सहज, जॉटफॉर्म-ग्रेड नागरिक प्रश्नावली और पोलिंग प्लेटफॉर्म में तब्दील किया गया। इसमें प्रत्येक संगठन प्रकार (NGO, छात्र संघ, श्रमिक संघ, RWA और नागरिक समूह) के लिए विशेष रूप से तैयार किए गए 1-क्लिक टेम्पलेट्स, 1-5 स्टार रेटिंग और लिकर्ट संतुष्टि स्केल सहित 13 उद्देश्य-निर्मित फ़ील्ड प्रकार, रीयल-टाइम लक्ष्य सहमति और भावना विश्लेषण (Sentiment Matrix), स्वचालित कार्यकारी निष्कर्ष, और 1-क्लिक व्यक्तिगत प्रतिभागी PDF डोजियर निर्यात शामिल हैं।',
    color: 'orange',
    icon: Sparkles,
    features: [
      {
        nameEn: 'Curated 1-Click Org Archetype Templates',
        nameHi: '1-क्लिक संगठन-अनुकूल प्रश्नावली टेम्पलेट्स',
        textEn: 'Ready-to-use survey templates for Student Union Mess and Academic Grievances, Workers Union Shop-Floor Hazard and CBA Demands, RWA Colony Safai & Security Census, and NGO Volunteer Intake & Beneficiary Assessments.',
        textHi: 'छात्र संघ मेस व शैक्षणिक शिकायत, श्रमिक संघ सुरक्षा जोखिम व मांग पत्र (CBA), RWA सफाई व सुरक्षा जनगणना, और NGO स्वयंसेवक व लाभार्थी मूल्यांकन के लिए पूर्व-कॉन्फ़िगर सर्वेक्षण टेम्पलेट्स।',
      },
      {
        nameEn: 'Executive Survey Intelligence & Sentiment Matrix',
        nameHi: 'कार्यकारी सर्वे इंटेलिजेंस व भावना विश्लेषण (Sentiment Matrix)',
        textEn: 'Live computation of Goal Consensus Index (%), Average CSAT Rating / 5.0, Sentiment Distribution (Positive, Neutral, Negative, Urgent Escalations), question-by-question distribution graphs, and automated executive takeaways.',
        textHi: 'लक्ष्य सहमति सूचकांक (%), औसत CSAT रेटिंग (5 में से), भावना वितरण (सकारात्मक, तटस्थ, नकारात्मक, अत्यावश्यक शिकायतें), प्रश्नवार प्रतिशत बार चार्ट, और स्वचालित कार्यकारी निष्कर्षों की लाइव गणना।',
      },
      {
        nameEn: '1-Click Participant PDF Dossier & Executive Print Reports',
        nameHi: '1-क्लिक व्यक्तिगत प्रतिभागी PDF डोजियर व कार्यकारी प्रिंट रिपोर्ट',
        textEn: 'Inspect any individual submission in a dedicated Participant Dossier with contact links, verification IDs, and print-ready PDF scorecard formatting for committee and statutory review.',
        textHi: 'कमेटी और वैधानिक समीक्षा के लिए संपर्क लिंक, सत्यापन आईडी और प्रिंट-तैयार PDF स्कोरकार्ड प्रारूप के साथ एक समर्पित प्रतिभागी डोजियर में किसी भी व्यक्तिगत प्रतिक्रिया का तुरंत निरीक्षण करें।',
      },
    ],
  },
  {
    version: 'v1.34.0',
    titleEn: 'Universal Google Workspace & Legacy Survey Importer (Contacts, Sheets & Forms)',
    titleHi: 'यूनिवर्सल गूगल वर्कस्पेस व लिगेसी सर्वे आयातक (कॉन्टैक्ट्स, शीट्स एवं फॉर्म्स)',
    dateEn: 'August 2026',
    dateHi: 'अगस्त 2026',
    descEn: 'Empowered civil society organisations, unions, and associations to seamlessly migrate from Google Workspace into Sangathan. Introduced live Google Sheets import with automatic column auto-matching, Google Contacts / vCard batch importing for member directories and invitations, and a dedicated Google Forms / Past Survey Migrator that auto-generates form field schemas and ingests historical survey submissions with optional member conversion.',
    descHi: 'नागरिक समाज संगठनों, यूनियनों और संघों को Google Workspace से संगठन में सुचारू रूप से माइग्रेट करने में सक्षम बनाया गया। स्वचालित कॉलम मिलान के साथ लाइव Google Sheets आयात, सदस्य निर्देशिकाओं और आमंत्रणों के लिए Google Contacts / vCard बैच आयात, और एक समर्पित Google Forms / पूर्व सर्वे माइग्रेटर पेश किया गया जो स्वचालित रूप से फॉर्म फ़ील्ड स्कीमा बनाता है और वैकल्पिक सदस्य रूपांतरण के साथ ऐतिहासिक सर्वेक्षण सबमिशन को डेटाबेस में सहेजता है।',
    color: 'orange',
    icon: Sparkles,
    features: [
      {
        nameEn: 'Google Forms & Past Surveys Migrator',
        nameHi: 'गूगल फॉर्म्स व पूर्व सर्वेक्षण माइग्रेटर',
        textEn: 'Import legacy Google Forms by pasting a response sheet link or CSV. Sangathan auto-detects questions/fields (text, phone, number, dropdown, textarea), registers the form, and permanently ingests all historical responses into your organization analytics.',
        textHi: 'रिस्पॉन्स शीट लिंक या CSV पेस्ट करके पुराने Google Forms आयात करें। संगठन स्वचालित रूप से प्रश्नों/फ़ील्ड्स (टेक्स्ट, फ़ोन, नंबर, ड्रॉपडाउन, टेक्स्टएरिया) का पता लगाता है, फॉर्म पंजीकृत करता है और सभी ऐतिहासिक सबमिशन को हमेशा के लिए डेटाबेस में सहेजता है।',
      },
      {
        nameEn: 'Live Google Sheets & Drive Importer',
        nameHi: 'लाइव गूगल शीट्स व ड्राइव आयातक',
        textEn: 'Connect shared Google Sheets directly without manual download/re-upload friction. Visual AI auto-matcher maps names, phone numbers (+91 sanitization), emails, designations, and areas with duplicate suppression.',
        textHi: 'मैन्युअल डाउनलोड/री-अपलोड के बिना सीधे शेयर्ड Google Sheets कनेक्ट करें। विज़ुअल AI ऑटो-मैचर डुप्लिकेट सुरक्षा के साथ नाम, फ़ोन नंबर (+91 मानकीकरण), ईमेल, पद और क्षेत्रों को मैप करता है।',
      },
      {
        nameEn: 'Google Contacts Batch Import & Invitations',
        nameHi: 'गूगल कॉन्टैक्ट्स बैच आयात व आमंत्रण',
        textEn: 'Migrate contact lists exported from Google Contacts (CSV/vCard) with one click to send batch organisation invitations or populate local member rosters while maintaining strict tenant isolation.',
        textHi: 'सख्त डेटा अलगाव बनाए रखते हुए बैच संगठन आमंत्रण भेजने या स्थानीय सदस्य रोस्टर को भरने के लिए Google Contacts (CSV/vCard) से संपर्क सूचियों को 1 क्लिक में माइग्रेट करें।',
      },
    ],
  },
  {
    version: 'v1.33.0',
    titleEn: 'Native Mobile Touch UX, Instant Tools Drawer & Crisp Light Dashboards',
    titleHi: 'नेटिव मोबाइल टच UX, त्वरित उपकरण दराज़ एवं स्पष्ट लाइट डैशबोर्ड्स',
    dateEn: 'August 2026',
    dateHi: 'अगस्त 2026',
    descEn: 'Comprehensive mobile-first design overhaul for seamless daily smartphone usage across India. Introduced a 5-tab mobile bottom navigation bar with an instant-access drawer searching all 20+ civic tools, enlarged tap targets (≥48px), haptic touch states, pure light theme civic hero cards across Admin & Member dashboards, and intuitive bilingual Hinglish microcopy across all 4 organization types.',
    descHi: 'पूरे भारत में स्मार्टफोन पर सुगम दैनिक उपयोग के लिए व्यापक मोबाइल-प्रथम डिज़ाइन उन्नयन। सभी 20+ नागरिक उपकरणों को खोजने वाले त्वरित-पहुंच दराज़ के साथ 5-टैब मोबाइल निचला नेविगेशन बार, बड़े टैप लक्ष्य (≥48px), हैप्टिक टच फीडबैक, एडमिन और सदस्य डैशबोर्ड पर स्वच्छ लाइट थीम हीरो कार्ड और सभी 4 संगठन प्रकारों में सहज द्विभाषी हिंग्लिश शब्दावली पेश की गई।',
    color: 'emerald',
    icon: Rocket,
    features: [
      {
        nameEn: 'Mobile Bottom Navigation & Instant Tools Drawer',
        nameHi: 'मोबाइल बॉटम नेविगेशन व त्वरित उपकरण दराज़',
        textEn: 'Engineered a native 5-tab bottom navigation bar for Android and iOS PWA installs with an instant slide-up drawer featuring real-time search across all 20+ governance tools, statutory registers, and community utilities.',
        textHi: 'Android और iOS PWA इंस्टॉल के लिए एक नेटिव 5-टैब बॉटम नेविगेशन बार विकसित किया गया, जिसमें सभी 20+ प्रशासनिक उपकरणों, वैधानिक रजिस्टरों और सामुदायिक उपयोगिताओं में वास्तविक समय में खोज करने वाला स्लाइड-अप दराज़ शामिल है।',
      },
      {
        nameEn: 'Crisp Light Civic Dashboard Surfaces',
        nameHi: 'स्वच्छ लाइट नागरिक डैशबोर्ड सतहें',
        textEn: 'Eliminated heavy dark blocks in favor of crisp, geometric, light-themed civic surfaces with Indian time-of-day greetings, active workspace status badges, and 1-tap quick action shortcuts for adding members, issuing notices, and logging chanda.',
        textHi: 'पारंपरिक भारी डार्क ब्लॉक की जगह स्वच्छ, ज्यामितीय, लाइट-थीम नागरिक सतहें पेश की गईं, जिनमें समय-आधारित अभिवादन, सक्रिय कार्यक्षेत्र स्थिति बैज, और सदस्य जोड़ने, सूचना जारी करने व चंदा दर्ज करने के लिए 1-टैप शॉर्टकट शामिल हैं।',
      },
      {
        nameEn: 'India-First Bilingual Microcopy & Zero Learning Curve',
        nameHi: 'भारत-प्रथम द्विभाषी शब्दावली और शून्य सीखने का समय',
        textEn: 'Standardized natural dual-language labels (दान व चंदा • Donations, सदस्य व काडर • Members, सूचनाएं • Notices, दस्तावेज वॉल्ट) across NGOs, Student Unions, Workers Unions, and RWAs to ensure anyone can organize with zero training.',
        textHi: 'एनजीओ, छात्र संघों, मज़दूर यूनियनों और आरडब्ल्यूए में प्राकृतिक द्विभाषी लेबलों (दान व चंदा, सदस्य व काडर, सूचनाएं, दस्तावेज वॉल्ट) का मानकीकरण किया गया ताकि कोई भी बिना किसी प्रशिक्षण के आसानी से काम कर सके।',
      },
    ],
  },
  {
    version: 'v1.32.0',
    titleEn: 'Civic Pricing, Community Access & Sangathan AI Product Evolution',
    titleHi: 'नागरिक मूल्य निर्धारण, सामुदायिक पहुंच एवं संगठन AI उत्पाद विस्तार',
    dateEn: 'August 2026',
    dateHi: 'अगस्त 2026',
    descEn: 'Major platform repositioning as digital civic infrastructure under Bahujan Queer Foundation (Section 8 Non-Profit). Introduced voluntary one-time Community Access (₹5 to ₹500 or custom), Sustainer Access pay-what-you-can patronage, dedicated Pay & Price cost breakdown with live mission goal tracking, full support for unregistered civic collectives, and unified Sangathan AI with master organization-level AI control and strict data privacy guarantees.',
    descHi: 'बहुजन क्वीर फाउंडेशन (सेक्शन 8 गैर-लाभकारी संस्था) के तहत डिजिटल नागरिक बुनियादी ढांचे के रूप में प्रमुख मंच पुनर्गठन। स्वैच्छिक एकमुश्त सामुदायिक पहुंच (₹5 से ₹500 या कस्टम), संरक्षक पहुंच क्षमता अनुसार योगदान, लाइव मिशन लक्ष्य ट्रैकिंग के साथ विस्तृत लागत विश्लेषण, गैर-पंजीकृत नागरिक समूहों के लिए पूर्ण समर्थन, और मास्टर संगठन-स्तरीय नियंत्रण व सख्त डेटा गोपनीयता गारंटी के साथ एकीकृत संगठन AI पेश किया गया।',
    color: 'indigo',
    icon: ShieldCheck,
    features: [
      {
        nameEn: 'Non-Profit Civic Infrastructure Identity & Pay & Price',
        nameHi: 'गैर-लाभकारी नागरिक अवसंरचना पहचान और Pay & Price',
        textEn: 'Solidified institutional non-profit positioning under Bahujan Queer Foundation. Replaced commercial SaaS terminology with collective organizing concepts. Added transparent operational cost breakdown detailing server, encrypted storage, and communication infrastructure expenses.',
        textHi: 'बहुजन क्वीर फाउंडेशन के तहत गैर-लाभकारी संस्थागत पहचान स्थापित की गई। वाणिज्यिक SaaS शब्दावली को सामूहिक आयोजन अवधारणाओं से बदला गया। सर्वर, एन्क्रिप्टेड स्टोरेज और संचार खर्चों का पारदर्शी विवरण जोड़ा गया।',
      },
      {
        nameEn: 'Community Access Voluntary Contribution Model',
        nameHi: 'सामुदायिक पहुंच स्वैच्छिक योगदान मॉडल',
        textEn: 'Replaced traditional subscription walls with voluntary contribution choices (₹5, ₹10, ₹50, ₹100, ₹500, or Custom amount) giving grassroots groups, mutual-aid collectives, and student cells unrestricted access to core democratic governance tooling.',
        textHi: 'पारंपरिक सदस्यता शुल्क को स्वैच्छिक योगदान विकल्पों (₹5, ₹10, ₹50, ₹100, ₹500 या कस्टम राशि) से बदल दिया गया, जिससे जमीनी समूहों और छात्र इकाइयों को मुख्य लोकतांत्रिक शासन उपकरणों तक पहुंच मिलती है।',
      },
      {
        nameEn: 'Sustainer Access & Infrastructure Cross-Subsidy',
        nameHi: 'संरक्षक पहुंच व अवसंरचना क्रॉस-सब्सिडी',
        textEn: 'Introduced pay-what-you-can Sustainer Access (suggested ₹1,000/month or ₹10,000/year) for scaling NGOs and registered unions to unlock unlimited member capacity and directly cross-subsidize secure hosting for smaller grassroots collectives.',
        textHi: 'बढ़ते एनजीओ और पंजीकृत संघों के लिए संरक्षक पहुंच (सुझाया गया ₹1,000/माह या ₹10,000/वर्ष) पेश की गई, जिससे असीमित सदस्य क्षमता अनलॉक होती है और छोटे नागरिक समूहों के लिए मुफ्त सर्वर अवसंरचना को निधि मिलती है।',
      },
      {
        nameEn: 'Civic Collectives & Flexible Onboarding',
        nameHi: 'नागरिक समूह व लचीली ऑनबोर्डिंग',
        textEn: 'Added first-class support for unregistered civic collectives, social movements, and informal community campaigns across onboarding and capability blueprints without requiring statutory registration numbers.',
        textHi: 'वैधानिक पंजीकरण संख्या की आवश्यकता के बिना ऑनबोर्डिंग और क्षमता ब्लूप्रिंट में गैर-पंजीकृत नागरिक समूहों, सामाजिक आंदोलनों और अनौपचारिक अभियानों के लिए प्रथम श्रेणी का समर्थन जोड़ा गया।',
      },
      {
        nameEn: 'Sangathan AI Master Control & Reusable Privacy Modal',
        nameHi: 'संगठन AI मास्टर नियंत्रण व पुन: प्रयोज्य गोपनीयता मॉडल',
        textEn: 'Standardized AI assistive tools under "Sangathan AI", backed by an enforceable organization master On/Off toggle. Created a reusable AI Info Modal explaining data isolation, human sovereign decision-making, and zero cross-organization model training.',
        textHi: 'मास्टर On/Off टॉगल के साथ "संगठन AI" के तहत AI उपकरणों का मानकीकरण किया गया। डेटा पृथक्करण, मानव संप्रभु निर्णय और शून्य मॉडल क्रॉस-ट्रेनिंग की व्याख्या करने वाला एक पुन: प्रयोज्य AI सूचना मॉडल बनाया गया।',
      },
      {
        nameEn: 'Technical UI Refinements & Balanced Grid Architecture',
        nameHi: 'तकनीकी UI परिष्करण और संतुलित ग्रिड वास्तुकला',
        textEn: 'Refined Pay & Price page typography, replacing decorative floating pill tags with clean in-card status badges. Balanced the operational cost breakdown into a 6-item matrix and expanded FAQs to 6 structured entries for symmetric layout.',
        textHi: 'Pay & Price पेज के टाइपोग्राफी को परिष्कृत किया गया, जिससे फ्लोटिंग पिल टैग हटकर साफ इन-कार्ड बैज में बदल गए। परिचालन लागत विवरण को 6-मद मैट्रिक्स में संतुलित किया गया और अक्सर पूछे जाने वाले प्रश्नों को 6 संरचित प्रविष्टियों तक विस्तारित किया गया।',
      },
    ],
  },
  {
    version: 'v1.31.0',
    titleEn: 'Grassroots Colony Utility Kit: Chanda, Tenant Verification, Municipal Letters & Local Directory',
    titleHi: 'ज़मीनी कॉलोनी यूटिलिटी किट: चंदा, किरायेदार सत्यापन, नगरपालिका पत्र एवं स्थानीय निर्देशिका',
    dateEn: 'August 2026',
    dateHi: 'अगस्त 2026',
    descEn: 'Introduced a practical daily-use utility kit for RWA colonies, especially designed for kacchi colonies, unauthorised areas, and urban villages. Includes a 1-tap cash collection tracker for monthly chowkidari/safai chanda, a printable Delhi Police tenant verification form, pre-formatted municipal letter templates for representations to MLAs, MCD, DJB, BSES, and Police, plus a local services directory with pre-loaded emergency numbers.',
    descHi: 'RWA कॉलोनियों के लिए रोज़मर्रा के उपयोग वाली व्यावहारिक यूटिलिटी किट पेश की गई, विशेष रूप से कच्ची कॉलोनियों, अनधिकृत क्षेत्रों और शहरी गांवों के लिए डिज़ाइन की गई। मासिक चौकीदारी/सफाई चंदा के लिए 1-टैप कैश कलेक्शन ट्रैकर, प्रिंट करने योग्य दिल्ली पुलिस किरायेदार सत्यापन फॉर्म, विधायकों, MCD, DJB, BSES और पुलिस को प्रतिनिधित्व के लिए पूर्व-स्वरूपित नगरपालिका पत्र टेम्प्लेट, और पूर्व-लोड आपातकालीन नंबरों के साथ स्थानीय सेवा निर्देशिका शामिल है।',
    color: 'orange',
    icon: Phone,
    features: [
      {
        nameEn: 'Chanda Ledger (चंदा बहीखाता)',
        nameHi: 'चंदा बहीखाता',
        textEn: 'Monthly micro-collection tracker for chowkidari, safai, and community funds. Create collection rounds, auto-generate entries for all members, and mark payments with a single tap. Includes area-wise grouping and real-time collection rate dashboard.',
        textHi: 'चौकीदारी, सफाई और सामुदायिक फंड के लिए मासिक सूक्ष्म-संग्रह ट्रैकर। संग्रह राउंड बनाएं, सभी सदस्यों के लिए ऑटो-एंट्री जनरेट करें और एक टैप से भुगतान चिह्नित करें।',
      },
      {
        nameEn: 'Delhi Police Tenant Verification Form',
        nameHi: 'दिल्ली पुलिस किरायेदार सत्यापन फॉर्म',
        textEn: 'Generate pre-filled, print-ready tenant verification forms for submission to the local SHO office. Includes landlord details, tenant information, property specifics, and formal declaration with signature blocks.',
        textHi: 'स्थानीय SHO कार्यालय में जमा करने के लिए पूर्व-भरे, प्रिंट-तैयार किरायेदार सत्यापन फॉर्म तैयार करें। मकान मालिक विवरण, किरायेदार जानकारी, संपत्ति विवरण और हस्ताक्षर ब्लॉक के साथ औपचारिक घोषणा शामिल है।',
      },
      {
        nameEn: 'Municipal Letter Templates & Representations',
        nameHi: 'नगरपालिका पत्र टेम्पलेट व प्रतिनिधित्व',
        textEn: 'Pre-formatted letter templates for official colony representations to MLAs, Ward Councillors, MCD, DJB, BSES, and Police. Includes customizable letterhead, CC distribution, and print-ready output.',
        textHi: 'विधायकों, वार्ड पार्षदों, MCD, DJB, BSES और पुलिस को आधिकारिक कॉलोनी प्रतिनिधित्व के लिए पूर्व-स्वरूपित पत्र टेम्पलेट। अनुकूलन योग्य लेटरहेड, CC वितरण और प्रिंट-तैयार आउटपुट शामिल है।',
      },
      {
        nameEn: 'Local Services Directory with Emergency Numbers',
        nameHi: 'आपातकालीन नंबरों सहित स्थानीय सेवा निर्देशिका',
        textEn: 'Pinned contacts board with pre-loaded emergency numbers (Police 100, Fire 101, Ambulance 102, BSES, DJB, MCD helplines) plus editable local service contacts for electricians, plumbers, beat constables, and more.',
        textHi: 'पूर्व-लोड आपातकालीन नंबरों (पुलिस 100, अग्निशमन 101, एम्बुलेंस 102, BSES, DJB, MCD हेल्पलाइन) और इलेक्ट्रीशियन, प्लंबर, बीट कॉन्स्टेबल आदि के लिए संपादन योग्य स्थानीय सेवा संपर्कों वाला पिन किया गया संपर्क बोर्ड।',
      },
    ],
  },
  {
    version: 'v1.30.0',
    titleEn: 'National Master Reference & Geographical Data Engine (780+ Districts & Taxonomies)',
    titleHi: 'राष्ट्रीय मास्टर संदर्भ व भौगोलिक डेटा इंजन (780+ जिले एवं वैधानिक वर्गीकरण)',
    dateEn: 'August 2026',
    dateHi: 'अगस्त 2026',
    descEn: 'Equipped Sangathan with a pre-populated, verified master dataset of all 28 Indian States, 8 Union Territories, and 780+ administrative districts with ISO codes. Introduced domain-specific statutory taxonomies for NGOs (UN SDGs, 12A/80G, CSR-1), Student Unions (Central Panel posts, HEI faculties, UGC grievance bodies), Workers Unions (industrial sectors, dispute categories, ALC/RLC/CGIT tribunals), and RWAs (unit types, society amenities, standardized maintenance heads).',
    descHi: 'संगठन को भारत के सभी 28 राज्यों, 8 केंद्र शासित प्रदेशों और 780+ प्रशासनिक जिलों के पूर्व-आबादीकृत, सत्यापित मास्टर डेटा से सुसज्जित किया गया। एनजीओ (UN SDGs, 12A/80G, CSR-1), छात्र संघ (केंद्रीय पैनल पद, विश्वविद्यालय संकाय, यूजीसी निवारण सेल), श्रमिक संघ (औद्योगिक क्षेत्र, विवाद श्रेणियां, ALC/CGIT न्यायाधिकरण), और RWA (इकाई प्रकार, समाज सुविधाएं, मानकीकृत रखरखाव मदें) के लिए डोमेन-विशिष्ट वैधानिक वर्गीकरण पेश किया गया।',
    color: 'amber',
    icon: Globe,
    features: [
      {
        nameEn: 'Complete 28 States, 8 UTs & 780+ Districts Registry',
        nameHi: 'संपूर्ण 28 राज्य, 8 केंद्र शासित प्रदेश व 780+ जिले रजिस्ट्री',
        textEn: 'ISO 3166-2:IN compliant standardized geographical dataset with cascading State → District selector components for onboarding, member surveys, and event geofencing.',
        textHi: 'ऑनबोर्डिंग, सदस्य सर्वेक्षण और इवेंट जियोफेंसिंग के लिए कैस्केडिंग राज्य → जिला चयनकर्ता घटकों के साथ ISO 3166-2:IN मानकीकृत भौगोलिक डेटासेट।',
      },
      {
        nameEn: 'Domain-Specific Statutory Master Taxonomies',
        nameHi: 'डोमेन-विशिष्ट वैधानिक मास्टर वर्गीकरण',
        textEn: 'Standardized taxonomies covering 17 UN SDGs, statutory tax codes, student central panel portfolios, labor dispute categories, and RWA maintenance heads.',
        textHi: '17 संयुक्त राष्ट्र सतत विकास लक्ष्यों, वैधानिक कर कोड, छात्र केंद्रीय पैनल विभागों, श्रम विवाद श्रेणियों और RWA रखरखाव मदों को कवर करने वाले मानकीकृत वर्गीकरण।',
      },
      {
        nameEn: 'Interactive Master Reference Data Hub',
        nameHi: 'इंटरैक्टिव मास्टर संदर्भ डेटा केंद्र',
        textEn: 'Dedicated dashboard interface enabling organizers to browse, search, and copy official administrative codes and statutory authority mappings.',
        textHi: 'समर्पित डैशबोर्ड इंटरफ़ेस जो आयोजकों को आधिकारिक प्रशासनिक कोड और वैधानिक प्राधिकरण मैपिंग ब्राउज़, खोज और कॉपी करने में सक्षम बनाता है।',
      },
    ],
  },
  {
    version: 'v1.29.0',
    titleEn: 'All-in-One Civic Infrastructure: Universal Importer, Document Vault & Statutory Registers',
    titleHi: 'ऑल-इन-वन नागरिक अवसंरचना: यूनिवर्सल आयातक, दस्तावेज़ वॉल्ट व वैधानिक रजिस्टर्स',
    dateEn: 'August 2026',
    dateHi: 'अगस्त 2026',
    descEn: 'Transformed Sangathan into a fully self-contained, sovereign operating system for civil society organizations. Organizers can now migrate rosters directly from Excel/CSV in 60 seconds with auto-column matching, manage encrypted institutional documents and deeds in a sovereign cloud vault, and generate print-ready official registers (Form I, Form H, Cash Book) for government and registrar inspections with zero external software needed.',
    descHi: 'संगठन को नागरिक समाज संगठनों के लिए पूरी तरह से आत्मनिर्भर, संप्रभु ऑपरेटिंग सिस्टम में बदल दिया गया। आयोजक अब ऑटो-कॉलम मिलान के साथ 60 सेकंड में एक्सेल/सीएसवी से रोस्टर आयात कर सकते हैं, सुरक्षित क्लाउड वॉल्ट में कानूनी विलेखों और समझौतों का प्रबंधन कर सकते हैं, और सरकारी निरीक्षणों के लिए 1-क्लिक में आधिकारिक प्रिंट-रेडी वैधानिक रजिस्टर तैयार कर सकते हैं।',
    color: 'emerald',
    icon: Sparkles,
    features: [
      {
        nameEn: 'Smart Universal Data Importer & Migration Wizard',
        nameHi: 'स्मार्ट यूनिवर्सल डेटा आयातक व माइग्रेशन विज़ार्ड',
        textEn: 'Visual column auto-matcher with telephone validation, sandbox preview, duplicate conflict reconciliation, and instant 1-click batch import from Excel, Google Sheets, or CSV files.',
        textHi: 'एक्सेल, गूगल शीट्स या सीएसवी से तत्काल बैच आयात के लिए स्वचालित कॉलम मिलान, फ़ोन नंबर सत्यापन, पूर्वावलोकन और डुप्लिकेट समाधान।',
      },
      {
        nameEn: 'Institutional Document & Asset Cloud Vault',
        nameHi: 'संस्थागत दस्तावेज़ एवं परिसंपत्ति क्लाउड वॉल्ट',
        textEn: 'Role-based encrypted storage for Trust Deeds, 12A/80G tax orders, CBAs, AGM circulars, and asset deeds with granular access control (Public, Members Only, Executives Only).',
        textHi: 'ट्रस्ट डीड, 12A/80G कर आदेश, CBA, एजीएम परिपत्र और परिसंपत्ति विलेखों के लिए भूमिका-आधारित एन्क्रिप्टेड स्टोरेज।',
      },
      {
        nameEn: '1-Click Statutory PDF Registers & Audit Books',
        nameHi: '1-क्लिक वैधानिक PDF रजिस्टर व ऑडिट बुक्स',
        textEn: 'Official print-ready Form I Member Rolls (Societies/RWAs), Form H Returns (Trade Unions Act 1926), and Double-Entry Cash Books with SHA-256 verification hashes for registrar audits.',
        textHi: 'रजिस्ट्रार ऑडिट के लिए आधिकारिक प्रिंट-रेडी फॉर्म I सदस्य रजिस्टर, फॉर्म H रिटर्न (ट्रेड यूनियन अधिनियम 1926), और SHA-256 सत्यापित डबल-एंट्री कैश बुक।',
      },
    ],
  },
  {
    version: 'v1.28.0',
    titleEn: 'Comprehensive Statutory Data, Legal Frameworks & Organisation Playbooks',
    titleHi: 'व्यापक वैधानिक डेटा, कानूनी ढांचा एवं संगठन नियमावली हैंडबुक',
    dateEn: 'August 2026',
    dateHi: 'अगस्त 2026',
    descEn: 'Equipped Sangathan with exhaustive, domain-specific legal frameworks, statutory checklists, and operational playbooks for all 4 organization archetypes (NGOs, Student Unions, Workers Unions, and RWAs). Introduced an in-app Statutory Knowledge Hub with direct links to government registration portals, standard regulatory templates (Gyapan, 80G Receipts, POSH ICC, Strike Notices, AGM Circulations), and interactive documentation playbooks in English and Hindi.',
    descHi: 'संगठन को सभी 4 संगठन प्रकारों (एनजीओ, छात्र संघ, श्रमिक संघ, और आरडब्ल्यूए) के लिए संपूर्ण कानूनी ढांचे, वैधानिक चेकलिस्ट और परिचालन हैंडबुक से सुसज्जित किया गया। सरकारी पंजीकरण पोर्टलों, मानकीकृत नियामक प्रारूपों (ज्ञापन, 80G रसीदें, POSH ICC, हड़ताल नोटिस, एजीएम सर्कुलर) और द्विभाषी इंटरैक्टिव हैंडबुक के साथ एक इन-ऐप वैधानिक ज्ञान केंद्र पेश किया गया।',
    color: 'indigo',
    icon: Building2,
    features: [
      {
        nameEn: 'Dedicated Organisation Playbooks in Docs',
        nameHi: 'दस्तावेज़ों में समर्पित संगठन हैंडबुक व नियमावली',
        textEn: 'Exhaustive legal handbooks for NGOs (Trusts/Societies/Sec 8, 12A/80G, CSR-1, FCRA), Student Unions (Supreme Court Lyngdoh Committee, Gyapan memoranda, election counting desk, UGC Anti-Ragging), Workers Unions (Trade Unions Act 1926, CBAs, strike notice protocols, shop stewards), and RWAs (Model Bye-laws, maintenance billing formulas, 21-day AGM notices).',
        textHi: 'एनजीओ (12A/80G, CSR-1, FCRA), छात्र संघ (लिंगदोह समिति, ज्ञापन प्रारूप, मतगणना डेस्क), श्रमिक संघ (ट्रेड यूनियन अधिनियम 1926, CBA, हड़ताल नोटिस) और RWA (मॉडल उप-नियम, मेंटेनेंस बिलिंग, AGM नोटिस) के लिए विस्तृत कानूनी हैंडबुक।',
      },
      {
        nameEn: 'In-App Statutory Knowledge & Regulatory Hub',
        nameHi: 'इन-ऐप वैधानिक ज्ञान व विनियामक केंद्र',
        textEn: 'Interactive dashboard module providing organizers with instant access to their governing acts, direct government portal links (NITI Aayog Darpan, MCA, Income Tax, UGC, Ministry of Labour), critical statutory benchmarks, and ready-to-use templates.',
        textHi: 'इंटरैक्टिव डैशबोर्ड मॉड्यूल जो आयोजकों को उनके शासी अधिनियमों, आधिकारिक सरकारी पोर्टल लिंक (नीति आयोग दर्पण, MCA, आयकर, UGC, श्रम मंत्रालय), महत्वपूर्ण वैधानिक नियमों और उपयोग के लिए तैयार प्रारूपों तक तत्काल पहुंच प्रदान करता है।',
      },
      {
        nameEn: 'Instant On-Demand SEO Revalidation & IndexNow Protocol',
        nameHi: 'तत्काल ऑन-डिमांड एसईओ पुनर्वैधीकरण और इंडेक्सनाउ प्रोटोकॉल',
        textEn: 'Automatic Next.js ISR cache purging and instant IndexNow search engine notification pings whenever organisation profiles, compliance badges, events, or coalition networks update.',
        textHi: 'संगठन प्रोफाइल, अनुपालन विवरण, कार्यक्रम या गठबंधन नेटवर्क अपडेट होने पर स्वचालित कैश रीफ्रेश और सर्च इंजनों को त्वरित इंडेक्सनाउ सूचना।',
      },
    ],
  },
  {
    version: 'v1.27.0',
    titleEn: 'Full-Spectrum SEO, Schema.org Graph, Dynamic Social Previews & AI Search Indexes',
    titleHi: 'पूर्ण-स्पेक्ट्रम एसईओ, स्कीमा.ऑर्ग ग्राफ़, डायनामिक सोशल प्रीव्यू एवं एआई सर्च इंडेक्स',
    dateEn: 'August 2026',
    dateHi: 'अगस्त 2026',
    descEn: 'Empowered public organisations and civil society collectives to be fully discoverable across Google, Bing, and AI search engines (Perplexity, ChatGPT Search, Claude). Introduced rich Schema.org structured data, dynamic Edge OpenGraph image generation for social previews on WhatsApp and Twitter/X, comprehensive multi-entity XML sitemaps, AI bot crawler allowances, and a standardized llms.txt citation directory.',
    descHi: 'सार्वजनिक संगठनों और नागरिक समाज समूहों को गूगल, बिंग और एआई सर्च इंजनों (Perplexity, ChatGPT Search, Claude) पर पूरी तरह से खोजने योग्य बनाया गया। समृद्ध स्कीमा.ऑर्ग संरचित डेटा, व्हाट्सएप और ट्विटर पर सोशल पूर्वावलोकन के लिए डायनामिक ओपनग्राफ इमेज जनरेटर, व्यापक एक्सएमएल साइटमैप, एआई बॉट क्रॉलर अनुमतियां और मानकीकृत llms.txt दस्तावेज़ीकरण पेश किया गया।',
    color: 'emerald',
    icon: Globe,
    features: [
      {
        nameEn: 'Schema.org JSON-LD for Public Organisations & Events',
        nameHi: 'सार्वजनिक संगठनों और आयोजनों के लिए Schema.org JSON-LD',
        textEn: 'Deep structural markup (NGO, EducationalOrganization, LaborUnion, Event, Breadcrumbs) enabling Google Knowledge Graph and AI search engines to accurately reference registered entities.',
        textHi: 'गहन संरचनात्मक मार्कअप जो गूगल नॉलेज ग्राफ़ और एआई सर्च इंजनों को पंजीकृत संगठनों और आयोजनों को सटीक रूप से संदर्भित करने में सक्षम बनाता है।',
      },
      {
        nameEn: 'Dynamic Edge OpenGraph Image Generator',
        nameHi: 'डायनामिक एज ओपनग्राफ इमेज जनरेटर',
        textEn: 'Generates branded 1200x630 preview cards dynamically for every public organisation when shared across WhatsApp, Telegram, Twitter, LinkedIn, and Discord.',
        textHi: 'व्हाट्सएप, टेलीग्राम, ट्विटर और लिंक्डइन पर साझा किए जाने पर प्रत्येक सार्वजनिक संगठन के लिए 1200x630 ब्रांडेड पूर्वावलोकन कार्ड तुरंत तैयार करता है।',
      },
      {
        nameEn: 'Dynamic Supabase XML Sitemap & llms.txt Citation Standard',
        nameHi: 'डायनामिक सुपाबेस एक्सएमएल साइटमैप एवं llms.txt उद्धरण मानक',
        textEn: 'Auto-indexes public collectives, alliances, and upcoming events in sitemap.xml alongside an llms.txt reference guide optimized for next-gen AI search answer engines.',
        textHi: 'अगली पीढ़ी के एआई सर्च आंसर इंजनों के लिए llms.txt गाइड के साथ सभी सार्वजनिक संगठनों, गठबंधनों और आगामी कार्यक्रमों को sitemap.xml में स्वचालित रूप से अनुक्रमित करता है।',
      },
    ],
  },
  {
    version: 'v1.26.0',
    titleEn: 'Civic Solidarity Patronage, Member Capacity Safeguards & Annual Billing',
    titleHi: 'नागरिक एकजुटता संरक्षण, सदस्य क्षमता सुरक्षा उपाय एवं वार्षिक बिलिंग',
    dateEn: 'August 2026',
    dateHi: 'अगस्त 2026',
    descEn: 'Strengthened Sangathan\'s civic infrastructure and sustainable cross-subsidy model. Added hard-enforced plan capacity limits on the free Community tier to safeguard server resources, introduced annual solidarity patronage options with 2 months free discounts for funded institutions, dedicated Dashboard Billing & Capacity Management, and automated Razorpay plan activation.',
    descHi: 'संगठन के नागरिक बुनियादी ढांचे और टिकाऊ क्रॉस-सब्सिडी मॉडल को मजबूत किया गया। सर्वर संसाधनों की सुरक्षा के लिए मुफ्त समुदाय स्तर पर कठोर क्षमता सीमाएं जोड़ी गईं, वित्तपोषित संस्थानों के लिए 2 महीने की मुफ्त छूट के साथ वार्षिक एकजुटता संरक्षण विकल्प, समर्पित डैशबोर्ड बिलिंग और क्षमता प्रबंधन, और स्वचालित रेज़रपे सक्रियण।',
    color: 'indigo',
    icon: Sparkles,
    features: [
      {
        nameEn: 'Free Community Tier Safeguard & Capacity Limits',
        nameHi: 'मुफ्त समुदाय स्तर सुरक्षा एवं क्षमता सीमाएं',
        textEn: 'Grassroots collectives get all democratic tools, voting, and coalition federation tools for free (up to 20 users). Capacity is strictly monitored on invites and additions to prevent server exhaustion.',
        textHi: 'जमीनी स्तर के समूहों को सभी लोकतांत्रिक उपकरण, मतदान और गठबंधन उपकरण मुफ्त (20 उपयोगकर्ताओं तक) मिलते हैं। सर्वर संसाधनों की सुरक्षा के लिए आमंत्रणों पर क्षमता की निगरानी की जाती है।',
      },
      {
        nameEn: 'Institutional Solidarity Patronage (Annual & Monthly)',
        nameHi: 'संस्थागत एकजुटता संरक्षण (वार्षिक एवं मासिक)',
        textEn: 'Funded NGOs and trade unions can opt for the Institution tier (₹1,000/mo or ₹10,000/yr) with unlimited members and AI tools (Llama 3.3 70B), cross-subsidizing free hosting for grassroots groups.',
        textHi: 'वित्तपोषित एनजीओ और ट्रेड यूनियन असीमित सदस्यों और AI उपकरणों (Llama 3.3 70B) के साथ संस्थान स्तर (₹1,000/माह या ₹10,000/वर्ष) का विकल्प चुन सकते हैं, जो जमीनी समूहों के लिए मुफ्त होस्टिंग को सक्षम बनाता है।',
      },
      {
        nameEn: 'Dedicated Dashboard Capacity & Patronage Page',
        nameHi: 'समर्पित डैशबोर्ड क्षमता एवं संरक्षण पृष्ठ',
        textEn: 'Org admins can view live member slot meters, resource usage, white-label branding status, and complete Razorpay receipt history.',
        textHi: 'संगठन व्यवस्थापक लाइव सदस्य स्लॉट मीटर, संसाधन उपयोग, व्हाइट-लेबल ब्रांडिंग स्थिति और पूर्ण रेज़रपे रसीद इतिहास देख सकते हैं।',
      },
      {
        nameEn: 'Automated Razorpay Activation & Audit Logging',
        nameHi: 'स्वचालित रेज़रपे सक्रियण एवं ऑडिट लॉगिंग',
        textEn: 'Successful payment verifications automatically activate plan tiers, unlock AI intelligence features (Llama 3.3 70B), and record immutable audit logs.',
        textHi: 'सफल भुगतान सत्यापन स्वचालित रूप से योजना स्तरों को सक्रिय करते हैं, AI बुद्धिमत्ता सुविधाओं (Llama 3.3 70B) को अनलॉक करते हैं, और ऑडिट लॉग रिकॉर्ड करते हैं।',
      },
    ],
  },
  {
    version: 'v1.25.0',
    titleEn: 'Public Org Portal Polish, Upcoming Events & Full Bilingual Support',
    titleHi: 'सार्वजनिक संगठन पोर्टल पॉलिश, आगामी कार्यक्रम एवं पूर्ण द्विभाषी समर्थन',
    dateEn: 'August 2026',
    dateHi: 'अगस्त 2026',
    descEn: 'Enhanced public organization profile portals with upcoming event feeds, direct RSVP integration, localized Hindi translations, and streamlined membership applications. Polished mobile navigation bar with dynamic route localization across languages.',
    descHi: 'आगामी कार्यक्रम फीड, प्रत्यक्ष आरएसवीपी एकीकरण, स्थानीयकृत हिंदी अनुवाद, और सुव्यवस्थित सदस्यता अनुप्रयोगों के साथ सार्वजनिक संगठन प्रोफाइल पोर्टल का संवर्धन। भाषाओं में गतिशील रूट स्थानीयकरण के साथ मोबाइल नेविगेशन बार को पॉलिश किया गया।',
    color: 'indigo',
    icon: Building2,
    features: [
      {
        nameEn: 'Public Upcoming Events Feed',
        nameHi: 'सार्वजनिक आगामी कार्यक्रम फीड',
        textEn: 'Visitors on public org pages can now view upcoming rallies, general body meetings, and conferences with one-click RSVP links.',
        textHi: 'सार्वजनिक संगठन पृष्ठों पर आगंतुक अब एक-क्लिक आरएसवीपी लिंक के साथ आगामी रैलियों, आम सभा की बैठकों और सम्मेलनों को देख सकते हैं।',
      },
      {
        nameEn: 'Full Hindi & English Localization',
        nameHi: 'पूर्ण हिंदी एवं अंग्रेजी स्थानीयकरण',
        textEn: 'Public organization profiles, membership CTAs, metrics, and navigation bars now dynamically adapt to English and Hindi.',
        textHi: 'सार्वजनिक संगठन प्रोफाइल, सदस्यता सीटीए, आंकड़े, और नेविगेशन बार अब गतिशील रूप से अंग्रेजी और हिंदी के अनुकूल होते हैं।',
      },
      {
        nameEn: 'Mobile Navigation Enhancements',
        nameHi: 'मोबाइल नेविगेशन संवर्धन',
        textEn: 'Fixed language prefix routing for quick action tabs on mobile web and added haptic feedback support for app-like responsiveness.',
        textHi: 'मोबाइल वेब पर त्वरित एक्शन टैब के लिए भाषा उपसर्ग रूटिंग को ठीक किया गया और ऐप जैसी प्रतिक्रिया के लिए हैप्टिक फीडबैक समर्थन जोड़ा गया।',
      },
    ],
  },
  {
    version: 'v1.24.0',
    titleEn: 'Streamlined Org Registration, Team Invites & Critical Fixes',
    titleHi: 'सरलीकृत संगठन पंजीकरण, टीम आमंत्रण एवं महत्वपूर्ण सुधार',
    dateEn: 'August 2026',
    dateHi: 'अगस्त 2026',
    descEn: 'Complete overhaul of the organization registration flow. New orgs can now reserve a public URL with live availability checking, configure membership dues, set governance roles, and toggle features, with all settings persisted correctly. Added team invite system with shareable links. Fixed critical bugs including broken member management, rate limiting, and org type validation.',
    descHi: 'संगठन पंजीकरण प्रवाह का पूर्ण पुनर्निर्माण। नए संगठन अब लाइव उपलब्धता जांच के साथ सार्वजनिक URL आरक्षित कर सकते हैं, सदस्यता शुल्क कॉन्फ़िगर कर सकते हैं, शासन भूमिकाएं निर्धारित कर सकते हैं, और सुविधाएं टॉगल कर सकते हैं, सभी सही ढंग से सहेजी गईं। टीम आमंत्रण प्रणाली शेयर करने योग्य लिंक के साथ जोड़ी गई। महत्वपूर्ण बग्स ठीक किए गए जिनमें टूटा हुआ सदस्य प्रबंधन, दर सीमा, और संगठन प्रकार सत्यापन शामिल हैं।',
    color: 'emerald',
    icon: Building2,
    features: [
      {
        nameEn: 'Streamlined Org Registration Wizard',
        nameHi: 'सरलीकृत संगठन पंजीकरण विज़ार्ड',
        textEn: 'All 5 steps of the onboarding wizard now persist correctly: name, slug, description, designation, membership policy, and dues are all saved.',
        textHi: 'ऑनबोर्डिंग विज़ार्ड के सभी 5 चरण अब सही ढंग से सहेजे जाते हैं: नाम, स्लग, विवरण, पदनाम, सदस्यता नीति, और शुल्क सभी सहेजी जाती हैं।',
      },
      {
        nameEn: 'Live Slug Availability Check',
        nameHi: 'लाइव स्लग उपलब्धता जांच',
        textEn: 'Organizations can now see in real-time whether their desired public URL is available before submitting.',
        textHi: 'संगठन अब जमा करने से पहले वास्तविक समय में देख सकते हैं कि उनका वांछित सार्वजनिक URL उपलब्ध है या नहीं।',
      },
      {
        nameEn: 'Team Invite System',
        nameHi: 'टीम आमंत्रण प्रणाली',
        textEn: 'Org admins can now invite team members via email with shareable invite links. New members can accept invites and join instantly.',
        textHi: 'संगठन व्यवस्थापक अब शेयर करने योग्य आमंत्रण लिंक के साथ ईमेल के माध्यम से टीम के सदस्यों को आमंत्रित कर सकते हैं। नए सदस्य आमंत्रण स्वीकार कर सकते हैं और तुरंत शामिल हो सकते हैं।',
      },
      {
        nameEn: 'Fixed Member Management',
        nameHi: 'सदस्य प्रबंधन ठीक किया गया',
        textEn: 'Recreated the members table that was accidentally dropped, fixing member addition, status changes, and dashboard member counts.',
        textHi: 'गलती से हटाई गई सदस्य तालिका को फिर से बनाया गया, जिससे सदस्य जोड़ना, स्थिति परिवर्तन, और डैशबोर्ड सदस्य गणना ठीक हो गई।',
      },
      {
        nameEn: 'Fixed Rate Limiting & Validation',
        nameHi: 'दर सीमा एवं सत्यापन ठीक किया गया',
        textEn: 'Org creation rate limiting now works correctly. Signup form password requirements now match server rules (12+ chars).',
        textHi: 'संगठन निर्माण दर सीमा अब सही ढंग से काम करती है। साइनअप फॉर्म पासवर्ड आवश्यकताएं अब सर्वर नियमों (12+ अक्षर) से मेल खाती हैं।',
      },
    ],
  },
  {
    version: 'v1.25.0',
    titleEn: 'Features Page Accuracy Audit & Feature Verification',
    titleHi: 'फीचर पेज सटीकता ऑडिट एवं फीचर सत्यापन',
    dateEn: 'August 2026',
    dateHi: 'अगस्त 2026',
    descEn: 'Conducted a comprehensive verification audit of every feature listed on the Features page across all organization types (NGO, Student Union, Workers Union, RWA). Confirmed that all claimed dashboard modules (including Digital Notice Board, Financial Ledger, Forms & Surveys, Elections, Volunteer Coordination, Visitor Management, and more) map directly to implemented routes in src/app/[lang]/dashboard/. All feature claims on the public Features page are now verified against living code.',
    descHi: 'नगरों के सभी संगठन प्रकारों (एनजीओ, छात्र संघ, श्रमिक संघ, आरडब्ल्यूए) के सम्मिलित रूप से फीचर पेज पर listing की गई हर सुविधा का एक व्यापक सत्यापन ऑडिट किया गया है। इसमें यह पुष्टि की गई है कि डिजिटल नोटिस बोर्ड (Announcements), वित्तीय बहीखाता (Financials), फॉर्म्स एवं सर्वेक्षण, चुनाव, स्वयंसेवक समन्वय, आगंतुक प्रबंधन और अधिक अन्य रास्तों के साथ मेल खाते हैं। सार्वजनिक फीचर पेज पर किए गए सभी फीचर दावों को अब से src/app/[lang]/dashboard/ में कार्यान्वित मार्गों के विरुद्ध सत्यापित किया गया है।',
    color: 'slate',
    icon: ShieldCheck,
    features: [
      {
        nameEn: 'Features Page Verified Against Living Code',
        nameHi: 'फीचर पेज लीविंग कोड के विरुद्ध सत्यावित',
        textEn: 'Audited every dashboard route under src/app/[lang]/dashboard/ and cross-referenced it with feature claims on the public Features page. All major claimed features (Digital Notice Board, Financial Ledger, Forms Builder, Elections, Visitor Management, Maintenance Tickets, Volunteer Coordination, Document Management) are confirmed implemented.',
        textHi: 'src/app/[lang]/dashboard/ के अंतर्गत हर डैशबोर्ड रास्ते का ऑडिट किया गया और इसे सार्वजनिक फीचर पेज पर फीचर दावों के साथ पूरा किया गया। सभी प्रमुख दावों (डिजिटल नोटिस बोर्ड, वित्तीय बहीखाता, फॉर्म बिल्डर, चुनाव, आगंतुक प्रबंधन, रखरखाव टिकट, स्वयंसेवक समन्वय, दस्तावेज़ प्रबंधन) का पुष्टि कार्यान्वयन किया गया है।',
      },
      {
        nameEn: 'Network Directory Page',
        nameHi: 'नेटवर्क डायरेक्ट्री पृष्ठ',
        textEn: 'Created the missing /network index page so the footer Network link resolves correctly. Lists all public networks with links to their detail pages.',
        textHi: 'फुटर नेटवर्क लिंक के सही ढंग से समाधान होने के लिए /network इंडेक्स पृष्ठ बनाया गया। सभी सार्वजनिक नेटवर्क की सूची दी गई है जिनके विवरण पृष्ठों के लिंक हैं।',
      },
      {
        nameEn: 'Sitemap Expanded',
        nameHi: 'साइटमैप विस्तारित',
        textEn: 'Added missing bilingual (/en and /hi) routes for Features, About, Changelog, Network, and Status to src/app/sitemap.ts.',
        textHi: 'फीचर्स, अबाउट, चेंजलॉग, नेटवर्क और स्टेटस के लिए मिसिंग द्विभाषी (/en और /hi) रास्तों को src/app/sitemap.ts में जोड़ा गया।',
      },
    ],
  },
  {
    version: 'v1.23.0',
    titleEn: 'Redesigned Dashboards, Mobile-Native Feel & New Member Onboarding',
    titleHi: 'नवीनीकृत डैशबोर्ड, मोबाइल-नेटिव अनुभव एवं नए सदस्य ऑनबोर्डिंग',
    dateEn: 'August 2026',
    dateHi: 'अगस्त 2026',
    descEn: 'Complete dashboard redesign tailored for each organization type (NGO, Student Union, Workers Union, RWA) with a mobile-first native app experience. New step-by-step onboarding guide helps first-time digital users get started easily. Bottom navigation adapts to show the most relevant features per organization type.',
    descHi: 'प्रत्येक संगठन प्रकार (एनजीओ, छात्र संघ, श्रमिक संघ, आरडब्ल्यूए) के अनुरूप पूर्ण डैशबोर्ड पुनर्रचना, मोबाबाइल-प्रथम नेटिव ऐप अनुभव के साथ। नया चरण-दर-चरण ऑनबोर्डिंग गाइड पहली बार डिजिटल उपयोगकर्ताओं को आसानी से शुरू करने में मदद करता है। निचला नेविगेशन प्रत्येक संगठन प्रकार के लिए सबसे प्रासंगिक सुविधाएं दिखाता है।',
    color: 'indigo',
    icon: Rocket,
    features: [
      {
        nameEn: 'Org-Type Specific Dashboards',
        nameHi: 'संगठन-प्रकार विशिष्ट डैशबोर्ड',
        textEn: 'Each organization type now has tailored stats, priority actions, and feature grids that match their specific workflow needs.',
        textHi: 'प्रत्येक संगठन प्रकार के पास अब अपने विशिष्ट कार्यप्रवाह आवश्यकताओं से मेल खाने वाले आंकड़े, प्राथमिकता कार्य और सुविधा ग्रिड हैं।',
      },
      {
        nameEn: 'New Member Onboarding Guide',
        nameHi: 'नए सदस्य ऑनबोर्डिंग गाइड',
        textEn: 'A simple 4-step walkthrough helps first-time users understand the app. Can be skipped anytime and re-triggered from settings.',
        textHi: 'एक सरल 4-चरणीय वॉकथ्रू पहली बार उपयोगकर्ताओं को ऐप समझने में मदद करता है। किसी भी समय छोड़ा जा सकता है और सेटिंग्स से फिर से शुरू किया जा सकता है।',
      },
      {
        nameEn: 'Mobile-Native Bottom Navigation',
        nameHi: 'मोबाइल-नेटिव निचला नेविगेशन',
        textEn: 'Bottom tab bar now adapts to show the most relevant 4th tab based on organization type (Donations for NGO, Elections for Student Union, etc).',
        textHi: 'निचला टैब बार अब संगठन प्रकार के आधार पर सबसे प्रासंगिक चौथे टैब (एनजीओ के लिए दान, छात्र संघ के लिए चुनाव, आदि) दिखाने के लिए अनुकूलित होता है।',
      },
      {
        nameEn: 'Bilingual Hindi/English Interface',
        nameHi: 'द्विभाषी हिंदी/अंग्रेज़ी इंटरफ़ेस',
        textEn: 'All dashboard sections now display content in both Hindi and English for better accessibility across user comfort levels.',
        textHi: 'सभी डैशबोर्ड अनुभाग अब उपयोगकर्ता सुविधा स्तरों में बेहतर पहुंच के लिए हिंदी और अंग्रेज़ी दोनों में सामग्री प्रदर्शित करते हैं।',
      },
    ],
  },
  {
    version: 'v1.22.0',
    titleEn: 'Resilient AI Service',
    titleHi: 'विश्वसनीय एआई सेवा',
    dateEn: 'August 2026',
    dateHi: 'अगस्त 2026',
    descEn: 'AI-powered meeting minutes, proposal analysis, form insights, content drafting, notifications, and ticket triage now automatically continue through an available provider when another service is temporarily unavailable. Supabase connections support modern publishable keys for safer key rotation, and the platform now uses updated, leaner production dependencies.',
    descHi: 'बैठक विवरण, प्रस्ताव विश्लेषण, फॉर्म अंतर्दृष्टि, सामग्री लेखन, सूचनाएं और टिकट वर्गीकरण अब किसी सेवा के अस्थायी रूप से अनुपलब्ध होने पर उपलब्ध एआई प्रदाता के माध्यम से जारी रहते हैं।',
    color: 'cyan',
    icon: Server,
    features: [
      {
        nameEn: 'Automatic AI Failover',
        nameHi: 'स्वचालित एआई फेलओवर',
        textEn: 'Keeps supported AI tools available by moving requests to another configured provider during rate limits, quota interruptions, or service outages.',
        textHi: 'दर सीमा, कोटा रुकावट या सेवा बाधा के दौरान अनुरोधों को दूसरे कॉन्फ़िगर किए गए प्रदाता तक ले जाकर एआई उपकरण उपलब्ध रखता है।',
      },
    ],
  },
  {
    version: 'v1.21.0',
    titleEn: 'Zero-Meta Master Channels, Real-Time WebSockets & Indian Statutory Compliance',
    titleHi: 'मास्टर संचार चैनल, रीयल-टाइम वेबसॉकेट्स एवं भारतीय वैधानिक अनुपालन',
    dateEn: 'August 2026',
    dateHi: 'अगस्त 2026',
    descEn: 'Comprehensive upgrade introducing zero-Meta-API WhatsApp QR Multi-Device pairing, 1-click grammY Telegram webhook linking, real-time Supabase WebSocket inbox synchronization, automated Indian statutory compliance rules for all 4 organization types, and full platform-wide polish.',
    descHi: 'शून्य-मेटा एपीआई व्हाट्सएप क्यूआर पेयरिंग, 1-क्लिक ग्रैमी टेलीग्राम वेबहुक लिंकिंग, रीयल-टाइम सुपाबेस वेबसॉकेट इनबॉक्स सिंक, सभी 4 संगठन प्रकारों के लिए स्वचालित भारतीय वैधानिक अनुपालन और संपूर्ण प्लेटफॉर्म सुधार।',
    color: 'emerald' as const,
    icon: Sparkles,
    features: [
      {
        nameEn: 'Zero-Meta WhatsApp QR Linking',
        nameHi: 'व्हाट्सएप क्यूआर डिवाइस लिंकिंग',
        textEn: 'Seamless Multi-Device QR code pairing allowing grassroots organizations to connect their official WhatsApp without developer accounts or API token hurdles.',
        textHi: 'बिना किसी डेवलपर खाते या एपीआई टोकन के जमीनी संगठनों के लिए आसान व्हाट्सएप क्यूआर डिवाइस लिंकिंग।'
      },
      {
        nameEn: '1-Click Telegram Engine & Realtime Inbox',
        nameHi: 'टेलीग्राम इंजन एवं रीयल-टाइम इनबॉक्स',
        textEn: 'Automatic @BotFather webhook registration with instant Supabase Realtime channel stream for two-way volunteer communication.',
        textHi: 'स्वचालित बॉट वेबहुक और सुपाबेस रीयल-टाइम वेबसॉकेट्स के साथ तत्काल द्विमार्गी वॉलंटियर संचार इनबॉक्स।'
      },
      {
        nameEn: 'AI Indian Statutory Compliance Rules',
        nameHi: 'भारतीय वैधानिक अनुपालन नियम',
        textEn: 'Context-aware statutory filing suggestions covering 12A/80G, CSR-1, Lyngdoh Committee electoral compliance, Trade Union Form H, and RWA Registrar submissions.',
        textHi: '12A/80G, सीएसआर-1, लिंगदोह समिति चुनावी अनुपालन, ट्रेड यूनियन फॉर्म H, और आरडब्ल्यूए रजिस्ट्रार फाइलिंग के लिए स्वचालित नियम।'
      }
    ]
  },
  {
    version: 'v1.20.0',
    titleEn: 'India-Targeted SEO, Frontend Design Refresh & Content Enhancement',
    titleHi: 'भारत-लक्षित एसईओ, फ्रंटेंड डिज़ाइन रिफ्रेश और सामग्री संवर्धन',
    dateEn: 'August 2026',
    dateHi: 'अगस्त 2026',
    descEn: 'Comprehensive update delivering India-targeted SEO infrastructure with JSON-LD structured data across all pages, expanded sitemap covering 30+ routes with hreflang alternates, enhanced landing page with new \'Who Uses Sangathan\', \'Built for India\', and \'What\'s New\' sections, security page design consistency fix, navigation and footer expansion, and comprehensive keyword optimization targeting Indian grassroots organizations.',
    descHi: 'भारत-लक्षित एसईओ बुनियादी ढांचे के साथ व्यापक अपडेट जिसमें सभी पृष्ठों पर JSON-LD संरचित डेटा, hreflang विकल्पों के साथ 30+ मार्गों को कवर करने वाला विस्तारित साइटमैप, नए \'संगठन किसके लिए\', \'भारत के लिए बनाया गया\', और \'नया क्या है\' अनुभागों के साथ उन्नत लैंडिंग पृष्ठ, सुरक्षा पृष्ठ डिज़ाइन स्थिरता सुधार, नेविगेशन और फुटर विस्तार, और भारतीय जमीनी संगठनों को लक्षित करते हुए व्यापक कीवर्ड अनुकूलन शामिल है।',
    color: 'blue' as const,
    icon: Globe,
    features: [
      {
        nameEn: 'India-Targeted SEO Infrastructure',
        nameHi: 'भारत-लक्षित एसईओ बुनियादी ढांचा',
        textEn: 'JSON-LD structured data (Organization, WebSite, SoftwareApplication, Breadcrumb, FAQ schemas), comprehensive sitemap with 30+ pages and hreflang alternates, enhanced robots.txt, and 30+ India-specific keywords targeting NGO, Student Union, Workers Union, and RWA search queries.',
        textHi: 'JSON-LD संरचित डेटा (संगठन, वेबसाइट, सॉफ्टवेयर एप्लिकेशन, ब्रेडक्रम्ब, एफएक्यू स्कीमा), hreflang विकल्पों के साथ 30+ पृष्ठों का व्यापक साइटमैप, उन्नत robots.txt, और एनजीओ, छात्र संघ, श्रमिक संघ और आरडब्ल्यूए खोज प्रश्नों को लक्षित करने वाले 30+ भारत-विशिष्ट कीवर्ड।'
      },
      {
        nameEn: 'Landing Page Design Enhancement',
        nameHi: 'लैंडिंग पृष्ठ डिज़ाइन संवर्धन',
        textEn: 'Three new sections: \'Who Uses Sangathan\' showcasing all 4 organization types, \'Built for India\' highlighting UPI, Hindi, compliance, and offline-first capabilities, and \'What\'s New\' featuring v1.19.0 highlights.',
        textHi: 'तीन नए अनुभाग: सभी 4 संगठन प्रकारों को प्रदर्शित करने वाला \'संगठन किसके लिए\', UPI, हिंदी, अनुपालन और ऑफ़लाइन-प्रथम क्षमताओं को उजागर करने वाला \'भारत के लिए बनाया गया\', और v1.19.0 हाइलाइट्स प्रस्तुत करने वाला \'नया क्या है\'।'
      },
      {
        nameEn: 'Navigation & Footer Expansion',
        nameHi: 'नेविगेशन और फुटर विस्तार',
        textEn: 'Added About and Changelog to main navigation bar. Expanded footer with Roadmap, Status, Network, Community Guidelines, and Refund Policy links.',
        textHi: 'मुख्य नेविगेशन बार में हमारे बारे में और अपडेट जोड़ा गया। रोडमैप, स्थिति, नेटवर्क, सामुदायिक दिशानिर्देश और रिफंड नीति लिंक के साथ फुटर का विस्तार किया गया।'
      },
      {
        nameEn: 'Security Page Design Fix & Feature Components Update',
        nameHi: 'सुरक्षा पृष्ठ डिज़ाइन सुधार और फीचर कंपोनेंट अपडेट',
        textEn: 'Fixed CSS variable references in the Security page for consistent styling. Added missing icon mappings in the interactive features component for all 4 organization types. Dynamic feature count display.',
        textHi: 'सुसंगत स्टाइलिंग के लिए सुरक्षा पृष्ठ में CSS वेरिएबल संदर्भों को ठीक किया गया। सभी 4 संगठन प्रकारों के लिए इंटरैक्टिव फीचर कंपोनेंट में गायब आइकन मैपिंग जोड़ी गई। गतिशील सुविधा गणना प्रदर्शन।'
      }
    ]
  },
  {
    version: 'v1.19.0',
    titleEn: '4-Pillar Enterprise Civic OS: Viral Growth, Grassroots Bot & Financial Transparency',
    titleHi: '4-स्तंभ एंटरप्राइज सिविक ओएस: वायरल ग्रोथ, बॉट इंटरफेस एवं वित्तीय पारदर्शिता',
    dateEn: 'August 2026',
    dateHi: 'अगस्त 2026',
    descEn: 'Major milestone release delivering 4 foundational civic pillars: 1-Click Public Petition & Campaign Studio with live counters and volunteer conversion hooks, Sharable Verified Member Badges for Instagram/X/WhatsApp Stories, WhatsApp & Telegram Conversational Interface & Simulator, Offline-First Field Mode PWA, Emergency SOS Legal Rapid-Response Network with GPS broadcasting, Public Trust & Transparency Ledger with SHA-256 audited receipts, AI-Powered Grant & CSR Opportunity Matcher, No-Code Event-Driven Automations, Immutable Audit Chain with Dual-Approval workflows, and Guided 5-Minute Onboarding Wizards.',
    descHi: '4 मूलभूत नागरिक स्तंभों को पेश करने वाली प्रमुख रिलीज़: लाइव काउंटरों और स्वयंसेवक रूपांतरण हुक के साथ 1-क्लिक सार्वजनिक याचिका और अभियान स्टूडियो, इंस्टाग्राम/एक्स/व्हाट्सएप कहानियों के लिए साझा करने योग्य सत्यापित सदस्य बैज, व्हाट्सएप और टेलीग्राम बॉट इंटरफेस और सिम्युलेटर, ऑफलाइन-प्रथम फील्ड मोड पीडब्ल्यूए, जीपीएस प्रसारण के साथ आपातकालीन एसओएस कानूनी नेटवर्क, एसएचए-256 ऑडिट प्राप्तियों के साथ सार्वजनिक विश्वास और पारदर्शिता बहीखाता, एआई-संचालित अनुदान और सीएसआर मैचर, नो-कोड ऑटोमेशन, दोहरे अनुमोदन वर्कफ़्लो के साथ अपरिवर्तनीय ऑडिट श्रृंखला, और 5-मिनट का निर्देशित ऑनबोर्डिंग विज़ार्ड।',
    color: 'emerald',
    icon: Rocket,
    features: [
      {
        nameEn: '1-Click Public Petition & Campaign Studio',
        nameHi: '1-क्लिक सार्वजनिक याचिका एवं अभियान स्टूडियो',
        textEn: 'Publish open petitions with live counters, 1-click volunteer conversion hooks, and inter-union solidarity co-sponsorship endorsements.',
        textHi: 'लाइव काउंटरों, 1-क्लिक स्वयंसेवक रूपांतरण हुक, और अंतर-यूनियन एकजुटता सह-प्रायोजन के साथ खुली याचिकाएं प्रकाशित करें।'
      },
      {
        nameEn: 'Sharable Verified Member Badges',
        nameHi: 'साझा करने योग्य सत्यापित सदस्य बैज',
        textEn: 'Generate high-resolution dynamic social media graphics for Instagram, Twitter/X, and WhatsApp Stories with verified QR codes and cryptographic hashes.',
        textHi: 'सत्यापित क्यूआर कोड और क्रिप्टोग्राफिक हैश के साथ इंस्टाग्राम, ट्विटर/एक्स और व्हाट्सएप स्टोरीज के लिए उच्च-रिज़ॉल्यूशन सोशल मीडिया ग्राफिक्स जेनरेट करें।'
      },
      {
        nameEn: 'Unified Member Communications & 2-Way Live Dispatch',
        nameHi: 'एकीकृत सदस्य संचार एवं 2-तरफा लाइव डिस्पैच',
        textEn: 'Multi-tenant organization-specific communications desk unifying member interactions across WhatsApp and Telegram. Supports 2-way admin direct messaging, auto-categorized grievance ticketing, and 1-click mass broadcasts.',
        textHi: 'व्हाट्सएप और टेलीग्राम पर सदस्य इंटरैक्शन को एकीकृत करने वाला बहु-किरायेदार संगठन-विशिष्ट संचार डेस्क। 2-तरफा व्यवस्थापक प्रत्यक्ष संदेश, ऑटो-वर्गीकृत शिकायत टिकटिंग और 1-क्लिक मास प्रसारण का समर्थन करता है।'
      },
      {
        nameEn: 'grammY Telegram Engine & WhatsApp QR Linked Devices',
        nameHi: 'grammY टेलीग्राम इंजन एवं व्हाट्सएप क्यूआर लिंक्ड डिवाइस',
        textEn: 'Production-ready Telegram Bot API integration using the grammY framework with automated webhook registration, alongside a live WhatsApp QR scanner for Multi-Device session pairing and Meta Cloud API integration.',
        textHi: 'grammY फ्रेमवर्क का उपयोग करके स्वचालित वेबहुक पंजीकरण के साथ उत्पादन-तैयार टेलीग्राम बॉट एपीआई एकीकरण, मल्टी-डिवाइस सत्र युग्मन और मेटा क्लाउड एपीआई के लिए लाइव व्हाट्सएप क्यूआर स्कैनर।'
      },
      {
        nameEn: 'Offline-First Field Organizer Mode (PWA)',
        nameHi: 'ऑफलाइन-प्रथम फील्ड आयोजक मोड',
        textEn: 'Door-to-door membership drives, rally check-ins, and grievance intake in zero-connectivity areas with automatic background queue synchronization.',
        textHi: 'स्वचालित पृष्ठभूमि कतार सिंक्रनाइज़ेशन के साथ शून्य-कनेक्टिविटी क्षेत्रों में डोर-टू-डोर सदस्यता अभियान और हाजिरी।'
      },
      {
        nameEn: 'Emergency SOS & Legal Rapid-Response',
        nameHi: 'आपातकालीन एसओएस एवं विधिक त्वरित प्रतिक्रिया',
        textEn: '1-tap crisis alert broadcasting GPS coordinates and situation notes to defense advocates with live police station (थाना) response tracking.',
        textHi: 'लाइव थाना प्रतिक्रिया ट्रैकिंग के साथ अधिवक्ताओं को जीपीएस निर्देशांक और स्थिति विवरण प्रसारित करने वाला 1-टैप आपातकालीन अलर्ट।'
      },
      {
        nameEn: 'Public Trust & Transparency Ledger',
        nameHi: 'सार्वजनिक विश्वास एवं पारदर्शिता बहीखाता',
        textEn: 'Real-time fund utilization breakdowns with SHA-256 verified receipt audit trails and live 96/100 A+ public trust rating.',
        textHi: 'एसएचए-256 सत्यापित रसीद ऑडिट और लाइव 96/100 ए+ पब्लिक ट्रस्ट रेटिंग के साथ रीयल-टाइम फंड उपयोग।'
      },
      {
        nameEn: 'AI Grant & CSR Opportunity Matcher',
        nameHi: 'एआई अनुदान एवं सीएसआर मैचर',
        textEn: 'Automated matching against open Indian government and CSR databases with 1-click structured AI proposal draft generation.',
        textHi: '1-क्लिक संरचित एआई प्रस्ताव मसौदा निर्माण के साथ खुले भारतीय सरकारी और सीएसआर डेटाबेस के खिलाफ स्वचालित मिलान।'
      },
      {
        nameEn: 'No-Code Automations & Dual Approvals',
        nameHi: 'नो-कोड ऑटोमेशन एवं दोहरा अनुमोदन',
        textEn: 'Event-driven triggers for digital IDs and welcome messages, paired with mandatory dual-approval guardrails for high-risk operations.',
        textHi: 'डिजिटल आईडी और स्वागत संदेशों के लिए ईवेंट-संचालित ट्रिगर, उच्च जोखिम वाले संचालन के लिए अनिवार्य दोहरे अनुमोदन गार्ड के साथ।'
      }
    ]
  },
  {
    version: 'v1.18.0',
    titleEn: 'Official Union Letterhead, Election Counting Tally & Regional i18n',
    titleHi: 'आधिकारिक यूनियन लेटरहेड, चुनाव मतगणना टैली एवं क्षेत्रीय भाषाएं',
    dateEn: 'August 2026',
    dateHi: 'अगस्त 2026',
    descEn: 'Major operational release introducing Official Union Letterhead & Printable PDF Exporter, Live Campus Election Counting Tally Desk for Central Panel candidates, Offline PWA Local Storage Queue for campus internet blackouts, and Expanded Regional Language Dictionaries supporting Hindi, Bengali, Tamil, Telugu, Marathi, and Kannada.',
    descHi: 'आधिकारिक यूनियन लेटरहेड और प्रिंट करने योग्य पीडीएफ एक्सपोर्टर, सेंट्रल पैनल के उम्मीदवारों के लिए लाइव कैंपस इलेक्शन काउंटिंग टैली डेस्क, कैंपस इंटरनेट ब्लैकआउट के लिए ऑफलाइन पीडब्ल्यूए लोकल स्टोरेज कतार, और हिंदी, बंगाली, तमिल, तेलुगु, मराठी और कन्नड़ का समर्थन करने वाले विस्तारित क्षेत्रीय भाषा शब्दकोश पेश करने वाली प्रमुख परिचालन रिलीज।',
    color: 'indigo',
    icon: Sparkles,
    features: [
      {
        nameEn: 'Official Union Letterhead PDF Exporter', nameHi: 'आधिकारिक यूनियन लेटरहेड पीडीएफ एक्सपोर्टर',
        textEn: 'Format formal Gyapans, RTI queries, and press releases onto official Union letterheads with customizable emblem headers and reference numbers.',
        textHi: 'अनुकूलन योग्य प्रतीक हेडर और संदर्भ संख्याओं के साथ आधिकारिक यूनियन लेटरहेड पर औपचारिक ज्ञापनों, आरटीआई प्रश्नों और प्रेस विज्ञप्तियों को प्रारूपित करें।'
      },
      {
        nameEn: 'Live Election Counting Tally Desk', nameHi: 'लाइव चुनाव मतगणना टैली डेस्क',
        textEn: 'Log round-by-round and booth-by-booth vote tallies on election counting night with live margin calculations for Central Panel candidates.',
        textHi: 'सेंट्रल पैनल के उम्मीदवारों के लिए लाइव मार्जिन गणना के साथ चुनाव मतगणना की रात को राउंड-बाय-राउंड और बूथ-बाय-बूथ वोट टैली दर्ज करें।'
      }
    ]
  },
  {
    version: 'v1.17.0',
    titleEn: 'Complete Indian Student Union Feature Suite',
    titleHi: 'संपूर्ण भारतीय छात्र संघ सुविधा सूट',
    dateEn: 'August 2026',
    dateHi: 'अगस्त 2026',
    descEn: 'Major release delivering 4 core Indian Student Union modules: Hostel & Mess Quality Audit Portal, RTI Act 2005 & VC/Dean Action Taken Report (ATR) Assistant, Legal Aid & Anti-Ragging Cell with Emergency Protest Detention SOS, and Campus Campaigning Suite for H2H canvassing and C2C lecture campaign scheduling.',
    descHi: '4 कोर भारतीय छात्र संघ मॉड्यूल पेश करने वाली प्रमुख रिलीज़: हॉस्टल और मेस गुणवत्ता ऑडिट पोर्टल, आरटीआई अधिनियम 2005 और कुलपति/डीन एक्शन टेकन रिपोर्ट (एटीआर) सहायक, आपातकालीन विरोध निरोध एसओएस के साथ कानूनी सहायता और एंटी-रैगिंग सेल, और एच 2 एच कैनवासिंग और सी 2 सी व्याख्यान अभियान शेड्यूलिंग के लिए परिसर अभियान सूट।',
    color: 'emerald',
    icon: ShieldCheck,
    features: [
      {
        nameEn: 'Hostel Allotment & Mess Quality Audit', nameHi: 'छात्रावास आवंटन एवं मेस गुणवत्ता समीक्षा',
        textEn: 'Track room allotment delays, submit daily mess meal ratings with photo evidence, and check 24x7 study hall availability.',
        textHi: 'कमरे के आवंटन में देरी को ट्रैक करें, फोटो साक्ष्य के साथ दैनिक भोजन रेटिंग जमा करें, और 24x7 अध्ययन कक्ष की उपलब्धता की जांच करें।'
      },
      {
        nameEn: 'RTI Act 2005 & Legal Aid Cell', nameHi: 'आरटीआई अधिनियम 2005 एवं कानूनी सहायता सेल',
        textEn: 'Generate legal RTI applications, log administration commitment deadlines, trigger emergency detention SOS alerts, and file anonymous anti-ragging complaints.',
        textHi: 'कानूनी आरटीआई आवेदन उत्पन्न करें, प्रशासन की प्रतिबद्धता समय सीमा दर्ज करें, आपातकालीन निरोध एसओएस अलर्ट ट्रिगर करें, और अनाम विरोधी रैगिंग शिकायतें दर्ज करें।'
      }
    ]
  },
  {
    version: 'v1.16.0',
    titleEn: 'Multi-Org Collaboration & Joint Front Hub (संयुक्त मोर्चा)',
    titleHi: 'मल्टी-ऑर्ग सहयोग और संयुक्त मोर्चा हब',
    dateEn: 'August 2026',
    dateHi: 'अगस्त 2026',
    descEn: 'Introduces multi-organization collaboration tools designed for Indian student union alliances (e.g. Left Unity, Joint Student Fronts). Includes inter-org alliance linking, co-signed Gyapan representations with joint leadership approvals, joint protest/rally scheduling with synchronized member broadcasts, and co-authored press statements.',
    descHi: 'भारतीय छात्र संघ गठबंधनों (जैसे वाम एकता, संयुक्त छात्र मोर्चा) के लिए डिज़ाइन किए गए बहु-संगठन सहयोग उपकरण पेश करता है। इसमें अंतर-संगठन गठबंधन लिंकिंग, संयुक्त नेतृत्व अनुमोदनों के साथ सह-हस्ताक्षरित ज्ञापन प्रतिनिधित्व, सिंक्रनाइज़ सदस्य प्रसारण के साथ संयुक्त विरोध/रैली शेड्यूलिंग, और सह-लेखक प्रेस बयान शामिल हैं।',
    color: 'purple',
    icon: Network,
    features: [
      {
        nameEn: 'Campus Alliance & Partner Linking', nameHi: 'कैंपस गठबंधन और पार्टनर लिंकिंग',
        textEn: 'Connect and link with partner student organizations on campus to form active coalitions and joint action fronts.',
        textHi: 'सक्रिय गठबंधन और संयुक्त कार्रवाई मोर्चे बनाने के लिए परिसर में भागीदार छात्र संगठनों से जुड़ें और लिंक करें।'
      },
      {
        nameEn: 'Co-Signed Gyapans & Joint Rallies', nameHi: 'सह-हस्ताक्षरित ज्ञापन और संयुक्त रैलियां',
        textEn: 'Co-author representations with digital approval from partner union leads and organize joint protests with synchronized multi-org member broadcasts.',
        textHi: 'पार्टनर यूनियन के मुख्य कार्यकारी अधिकारियों से डिजिटल अनुमोदन के साथ सह-लेखक प्रतिनिधित्व करें और सिंक्रनाइज़ किए गए बहु-संगठन सदस्य प्रसारणों के साथ संयुक्त विरोध प्रदर्शन आयोजित करें।'
      }
    ]
  },
  {
    version: 'v1.15.0',
    titleEn: 'On-Ground Member Induction Drive & Union Posts (पद) Registry',
    titleHi: 'ऑन-ग्राउंड सदस्य प्रवेश अभियान और यूनियन पोस्ट (पद) रजिस्ट्री',
    dateEn: 'August 2026',
    dateHi: 'अगस्त 2026',
    descEn: 'Major feature update introducing tools for student union member drives and official designation management. Includes an On-Ground Induction Desk for rapid canteen/gate booth registration, scannable QR posters, batch paper slip intake, pre-configured Indian union posts (President, Vice President, General Secretary, Joint Secretary, Coordinator, Convener, etc.), and custom post type creation.',
    descHi: 'छात्र संघ सदस्य अभियानों और आधिकारिक पद प्रबंधन के लिए उपकरणों की शुरुआत करने वाला प्रमुख सुविधा अद्यतन। इसमें तेजी से कैंटीन/गेट बूथ पंजीकरण के लिए ऑन-ग्राउंड इंडक्शन डेस्क, स्कैन योग्य क्यूआर पोस्टर, बैच पेपर स्लिप इनटेक, पूर्व-कॉन्फ़िगर किए गए भारतीय यूनियन पद (अध्यक्ष, उपाध्यक्ष, महासचिव, सह-सचिव, संयोजक, आदि) और कस्टम पोस्ट प्रकार निर्माण शामिल हैं।',
    color: 'orange',
    icon: Users,
    features: [
      {
        nameEn: 'On-Ground Membership Induction Drive', nameHi: 'ऑन-ग्राउंड सदस्यता अभियान',
        textEn: 'Fast mobile desk entry form for booth volunteers, scannable QR poster for self-registration, and batch intake for paper slips collected during rallies.',
        textHi: 'बूथ स्वयंसेवकों के लिए त्वरित मोबाइल डेस्क प्रविष्टि फॉर्म, स्व-पंजीकरण के लिए स्कैन करने योग्य क्यूआर पोस्टर, और रैलियों के दौरान एकत्र की गई कागजी पर्चियों के लिए बैच इनटेक।'
      },
      {
        nameEn: 'Union Posts (पद) & Designation Registry', nameHi: 'यूनियन पोस्ट (पद) एवं पदनाम रजिस्ट्री',
        textEn: 'Pre-loaded default union posts (President/अध्यक्ष, Vice President/उपाध्यक्ष, General Secretary/महासचिव, etc.) with custom post creation and direct member assignment.',
        textHi: 'कस्टम पोस्ट निर्माण और सीधे सदस्य आवंटन के साथ प्री-लोड डिफ़ॉल्ट यूनियन पद (अध्यक्ष, उपाध्यक्ष, महासचिव, आदि)।'
      }
    ]
  },
  {
    version: 'v1.14.0',
    titleEn: 'India-Focused Student Union Expansion & Master HEI Directory',
    titleHi: 'भारत-केंद्रित छात्र संघ विस्तार और मास्टर एचईआई डायरेक्टरी',
    dateEn: 'August 2026',
    dateHi: 'अगस्त 2026',
    descEn: 'Comprehensive localization release tailored for Indian Higher Educational Institutions (HEIs) and student politics. Includes a pre-populated master database of 1,000+ government institutions (including JMI, JNU, DU, BHU, IITs & NITs), support for independent student collectives on campuses where official unions are banned/restricted, Gyapan (ज्ञापन) Memorandum Builder, and automated Lyngdoh Committee compliance auditing.',
    descHi: 'भारतीय उच्च शिक्षा संस्थानों (HEIs) और छात्र राजनीति के लिए तैयार की गई व्यापक स्थानीयकरण रिलीज़। इसमें 1,000+ सरकारी संस्थानों (जेएमआई, जेएनयू, डीयू, बीएचयू, आईआईटी और एनआईटी सहित) का एक पूर्व-निर्मित मास्टर डेटाबेस, उन परिसरों पर स्वतंत्र छात्र समूहों के लिए समर्थन जहां आधिकारिक यूनियनों पर प्रतिबंध/प्रतिबंधित है, ज्ञापन ज्ञापन बिल्डर, और स्वचालित लिंगदोह समिति अनुपालन ऑडिटिंग शामिल है।',
    color: 'indigo',
    icon: Rocket,
    features: [
      {
        nameEn: 'Master Indian HEI Directory & Independent Collectives', nameHi: 'मास्टर भारतीय एचईआई निर्देशिका और स्वतंत्र समूह',
        textEn: 'Pre-seeded database of Indian government universities and colleges with governance status tracking (Official Union vs Independent Student Collective mode for campuses like Jamia Millia Islamia).',
        textHi: 'शासकीय स्थिति ट्रैकिंग के साथ भारतीय सरकारी विश्वविद्यालयों और कॉलेजों का पूर्व-सीडेड डेटाबेस (जामिया मिलिया इस्लामिया जैसे परिसरों के लिए आधिकारिक संघ बनाम स्वतंत्र छात्र सामूहिक मोड)।'
      },
      {
        nameEn: 'Gyapan (ज्ञापन) & Memorandum Generator', nameHi: 'ज्ञापन एवं मांग पत्र निर्माता',
        textEn: 'Formal representation drafting tool for Vice-Chancellors, Deans, and Wardens with integrated digital student signature petitions and official PDF export.',
        textHi: 'एकीकृत डिजिटल छात्र हस्ताक्षर याचिकाओं और आधिकारिक पीडीएफ निर्यात के साथ उप-कुलपतियों, डीन और वार्डन के लिए औपचारिक प्रतिनिधित्व प्रारूपण उपकरण।'
      },
      {
        nameEn: 'Lyngdoh Committee Compliance Auditor', nameHi: 'लिंगदोह समिति अनुपालन लेखा परीक्षक',
        textEn: 'Automated Supreme Court mandate evaluation for candidate age limits, 75%+ attendance thresholds, backlog checks, and the ₹5,000 campaign spending cap.',
        textHi: 'उम्मीदवार की आयु सीमा, 75%+ उपस्थिति सीमा, बकाया जांच और ₹5,000 अभियान खर्च सीमा के लिए स्वचालित सर्वोच्च न्यायालय जनादेश मूल्यांकन।'
      }
    ]
  },
  {
    version: 'v1.13.1',
    titleEn: 'Organization Name Topbar Fix & Cross-Org Route Resilience Audit',
    titleHi: 'संगठन नाम टॉपबार सुधार और क्रॉस-संगठन मार्ग लचीलापन लेखा परीक्षा',
    dateEn: 'August 2026',
    dateHi: 'अगस्त 2026',
    descEn: 'Updated the dashboard top navigation bar to dynamically display the active Organization Name instead of fallback text, and audited all organization types (NGO, RWA, Student Union, Workers Union) for zero error-screen resilience.',
    descHi: 'फॉलबैक टेक्स्ट के बजाय सक्रिय संगठन नाम को गतिशील रूप से प्रदर्शित करने के लिए डैशबोर्ड शीर्ष नेविगेशन बार को अपडेट किया गया, और शून्य त्रुटि-स्क्रीन लचीलेपन के लिए सभी संगठन प्रकारों (एनजीओ, आरडब्ल्यूए, छात्र संघ, कार्यकर्ता संघ) का ऑडिट किया गया।',
    color: 'emerald',
    icon: ShieldCheck,
    features: [
      {
        nameEn: 'Dynamic Org Dropdown Title', nameHi: 'डायनेमिक ऑर्ग ड्रॉपडाउन शीर्षक',
        textEn: 'Top-right profile dropdown now automatically displays the exact active Organisation Name for all account types.',
        textHi: 'शीर्ष-दाएं प्रोफ़ाइल ड्रॉपडाउन अब सभी खाता प्रकारों के लिए सटीक सक्रिय संगठन नाम स्वचालित रूप से प्रदर्शित करता है।'
      },
      {
        nameEn: 'Cross-Org Fault Tolerance', nameHi: 'क्रॉस-ऑर्ग फॉल्ट सहिष्णुता',
        textEn: 'Audited and updated all dashboard section routes (Forms, Campaigns, Grievances, Complaints, Maintenance, CBA, Grants) with service client fallbacks to guarantee 100% uptime across all organization types.',
        textHi: 'सभी संगठन प्रकारों में 100% अपटाइम की गारंटी के लिए सर्विस क्लाइंट फ़ॉलबैक के साथ सभी डैशबोर्ड अनुभाग मार्गों का ऑडिट और अद्यतनीकरण किया गया।'
      }
    ]
  },
  {
    version: 'v1.13.0',
    titleEn: 'Platform Support & Helpdesk Ticket Submission Resilience',
    titleHi: 'प्लेटफ़ॉर्म सहायता और हेल्पडेस्क टिकट प्रस्तुत करने का लचीलापन',
    dateEn: 'August 2026',
    dateHi: 'अगस्त 2026',
    descEn: 'Fixed support ticket submission failures by introducing intelligent fallbacks for OpenAI classification and AgentMail notifications, ensuring tickets always submit successfully.',
    descHi: 'OpenAI वर्गीकरण और AgentMail सूचनाओं के लिए बुद्धिमान फ़ॉलबैक शुरू करके सहायता टिकट जमा करने की विफलताओं को ठीक किया गया, जिससे यह सुनिश्चित हुआ कि टिकट हमेशा सफलतापूर्वक जमा होते हैं।',
    color: 'emerald',
    icon: ShieldCheck,
    features: [
      {
        nameEn: 'Fail-Safe Ticket Submission', nameHi: 'फ़ेल-सेफ टिकट सबमिशन',
        textEn: 'Decoupled ticket creation from third-party AI/email services so support requests save reliably regardless of API key status.',
        textHi: 'थर्ड-पार्टी एआई/ईमेल सेवाओं से टिकट निर्माण को अलग किया गया ताकि एपीआई कुंजी स्थिति की परवाह किए बिना सहायता अनुरोध मज़बूती से सहेजे जाएं।'
      }
    ]
  },
  {
    version: 'v1.12.9',
    titleEn: 'Dashboard Donations & Audit Logs Resilience Fix',
    titleHi: 'डैशबोर्ड दान और ऑडिट लॉग्स लचीलापन सुधार',
    dateEn: 'August 2026',
    dateHi: 'अगस्त 2026',
    descEn: 'Resolved an error loading data on the Donations page by implementing direct profile organization context resolution and service client fallbacks for transactions and recurring subscriptions.',
    descHi: 'सीधे प्रोफ़ाइल संगठन संदर्भ संकल्प और लेन-देन और आवर्ती सदस्यताओं के लिए सेवा क्लाइंट फ़ॉलबैक को लागू करके दान पृष्ठ पर लोड डेटा त्रुटि का समाधान किया गया।',
    color: 'emerald',
    icon: ShieldCheck,
    features: [
      {
        nameEn: 'Fault-Tolerant Collections', nameHi: 'फॉल्ट-टॉलरेंट संग्रह',
        textEn: 'Separated primary transaction loading from optional subscription tables to guarantee the page always renders cleanly.',
        textHi: 'प्राथमिक लेनदेन लोडिंग को वैकल्पिक सदस्यता तालिकाओं से अलग किया गया ताकि यह गारंटी दी जा सके कि पृष्ठ हमेशा आसानी से रेंडर होता है।'
      }
    ]
  },
  {
    version: 'v1.12.8',
    titleEn: 'Meetings Hub Feature Overhaul & Skeleton Loading',
    titleHi: 'बैठक हब सुविधा ओवरहाल और कंकाल लोडिंग',
    dateEn: 'August 2026',
    dateHi: 'अगस्त 2026',
    descEn: 'Transformed the Meetings dashboard with an instant UI skeleton loader, interactive metrics bar, live video call launcher, search filters, and one-click ICS calendar file exporting.',
    descHi: 'एक त्वरित UI कंकाल लोडर, इंटरैक्टिव मीट्रिक बार, लाइव वीडियो कॉल लॉन्चर, खोज फ़िल्टर और एक-क्लिक ICS कैलेंडर फ़ाइल निर्यात के साथ बैठक डैशबोर्ड को बदल दिया गया।',
    color: 'indigo',
    icon: Sparkles,
    features: [
      {
        nameEn: 'Instant Navigation & Skeleton', nameHi: 'त्वरित नेविगेशन और कंकाल',
        textEn: 'Added dedicated loading skeleton so navigating to Meetings is instantaneous with zero blank waiting states.',
        textHi: 'समर्पित लोडिंग कंकाल जोड़ा गया ताकि बैठकों में नेविगेट करना शून्य खाली प्रतीक्षा स्थितियों के साथ तुरंत हो सके।'
      },
      {
        nameEn: 'Interactive Video & Calendar Actions', nameHi: 'इंटरैक्टिव वीडियो और कैलेंडर क्रियाएं',
        textEn: 'Launch Jitsi video rooms directly from meeting cards and export native .ics calendar files with one click.',
        textHi: 'मीटिंग कार्ड से सीधे Jitsi वीडियो रूम लॉन्च करें और एक क्लिक के साथ मूल .ics कैलेंडर फ़ाइलें निर्यात करें।'
      }
    ]
  },
  {
    version: 'v1.12.7',
    titleEn: 'Dashboard Meetings Page Data Resilience Fix',
    titleHi: 'डैशबोर्ड बैठक पृष्ठ डेटा लचीलापन सुधार',
    dateEn: 'August 2026',
    dateHi: 'अगस्त 2026',
    descEn: 'Fixed an error loading the Meetings page by resolving organization context directly from authenticated profiles and implementing robust query fallbacks.',
    descHi: 'प्रमाणित प्रोफाइल से सीधे संगठन संदर्भ को हल करके और मजबूत क्वेरी फ़ॉलबैक लागू करके बैठक पृष्ठ लोड करने में एक त्रुटि को ठीक किया गया।',
    color: 'emerald',
    icon: ShieldCheck,
    features: [
      {
        nameEn: 'Query Resiliency', nameHi: 'क्वेरी लचीलापन',
        textEn: 'Restructured database queries and added a service role fallback so meeting schedules always render reliably.',
        textHi: 'डेटाबेस प्रश्नों का पुनर्गठन किया गया और एक सेवा भूमिका फ़ॉलबैक जोड़ा गया ताकि बैठक कार्यक्रम हमेशा विश्वसनीय रूप से रेंडर हों।'
      }
    ]
  },
  {
    version: 'v1.12.6',
    titleEn: 'Proposals & Deliberation Feature Overhaul',
    titleHi: 'प्रस्ताव और विचार-विमर्श सुविधा ओवरहाल',
    dateEn: 'August 2026',
    dateHi: 'अगस्त 2026',
    descEn: 'Overhauled the Proposals feature with interactive deliberation modals, live discussion threads, status pipeline transitions, AI Proposal Brief analysis, and clear form validation feedback.',
    descHi: 'इंटरैक्टिव विचार-विमर्श मॉडल, लाइव चर्चा थ्रेड्स, स्थिति पाइपलाइन संक्रमण, एआई प्रस्ताव संक्षिप्त विश्लेषण और स्पष्ट फॉर्म सत्यापन प्रतिक्रिया के साथ प्रस्ताव सुविधा का ओवरहाल किया गया।',
    color: 'purple',
    icon: Sparkles,
    features: [
      {
        nameEn: 'Validation & Feedback', nameHi: 'सत्यापन और प्रतिक्रिया',
        textEn: 'Added instant Sonner toast notifications and updated Zod validation schemas so creation errors never fail silently.',
        textHi: 'त्वरित सॉनर टोस्ट सूचनाएं जोड़ी गईं और Zod सत्यापन स्कीमा को अपडेट किया गया ताकि निर्माण त्रुटियां कभी चुपचाप विफल न हों।'
      },
      {
        nameEn: 'Interactive Deliberation Modal', nameHi: 'इंटरैक्टिव विचार-विमर्श मॉडल',
        textEn: 'Clicking any proposal opens a full deliberation modal with comment threads, governance pipeline stage transitions, and AI Brief generation.',
        textHi: 'किसी भी प्रस्ताव पर क्लिक करने से टिप्पणी थ्रेड्स, शासन पाइपलाइन चरण संक्रमण और एआई ब्रीफ जेनरेशन के साथ एक पूर्ण विचार-विमर्श मॉडल खुलता है।'
      }
    ]
  },
  {
    version: 'v1.12.5',
    titleEn: 'Volunteers Page Speed & Skeleton Loading Optimization',
    titleHi: 'स्वयंसेवक पृष्ठ गति और कंकाल लोडिंग अनुकूलन',
    dateEn: 'August 2026',
    dateHi: 'अगस्त 2026',
    descEn: 'Eliminated page load delays on the Volunteers dashboard by replacing multi-step cache checks with a direct profile query and introducing an instant UI skeleton loader.',
    descHi: 'मल्टी-स्टेप कैश चेकों को सीधे प्रोफ़ाइल क्वेरी से बदलकर और एक त्वरित UI कंकाल लोडर पेश करके स्वयंसेवक डैशबोर्ड पर पृष्ठ लोड देरी को समाप्त किया गया।',
    color: 'emerald',
    icon: Zap,
    features: [
      {
        nameEn: 'Instant Skeleton Feedback', nameHi: 'त्वरित कंकाल प्रतिक्रिया',
        textEn: 'Replaced blank loading spinners with instant structural UI skeletons so pages respond immediately upon navigation.',
        textHi: 'खाली लोडिंग स्पिनरों को त्वरित संरचनात्मक UI कंकालों से बदल दिया गया ताकि नेविगेशन पर पृष्ठ तुरंत प्रतिक्रिया दें।'
      },
      {
        nameEn: 'Query Efficiency', nameHi: 'क्वेरी दक्षता',
        textEn: 'Bypassed remote cache roundtrips and restricted data fetching to lightweight columns and optimal page limits.',
        textHi: 'रिमोट कैश राउंडट्रिप को बायपास किया गया और डेटा फ़ैचिंग को हल्के कॉलम और इष्टतम पेज सीमाओं तक सीमित किया गया।'
      }
    ]
  },
  {
    version: 'v1.12.4',
    titleEn: 'Dashboard Member Registry Resilience Fix',
    titleHi: 'डैशबोर्ड सदस्य रजिस्ट्री लचीलापन सुधार',
    dateEn: 'August 2026',
    dateHi: 'अगस्त 2026',
    descEn: 'Fixed a member registry data-fetching issue by resolving active user organization contexts directly and implementing fallback query resolution for robust member list loading.',
    descHi: 'सक्रिय उपयोगकर्ता संगठन संदर्भों को सीधे हल करके और मजबूत सदस्य सूची लोडिंग के लिए फ़ॉलबैक क्वेरी रिज़ॉल्यूशन लागू करके सदस्य रजिस्ट्री डेटा-फ़ैचिंग समस्या को ठीक किया गया।',
    color: 'purple',
    icon: ShieldCheck,
    features: [
      {
        nameEn: 'Direct Context Resolution', nameHi: 'प्रत्यक्ष संदर्भ रिज़ॉल्यूशन',
        textEn: 'Directly resolves the authenticated user profile organization ID to eliminate cookie mismatch errors during member list fetching.',
        textHi: 'सदस्य सूची लाने के दौरान कुकी बेमेल त्रुटियों को समाप्त करने के लिए प्रमाणित उपयोगकर्ता प्रोफ़ाइल संगठन आईडी को सीधे हल करता है।'
      }
    ]
  },
  {
    version: 'v1.12.3',
    titleEn: 'Dependency Pruning & Build Performance Optimization',
    titleHi: 'निर्भरता छंटाई और बिल्ड प्रदर्शन अनुकूलन',
    dateEn: 'August 2026',
    dateHi: 'अगस्त 2026',
    descEn: 'Audited and pruned unneeded project dependencies to reduce bundle bloat and accelerate production compilation speeds.',
    descHi: 'बंडल के आकार को कम करने और उत्पादन संकलन की गति में सुधार के लिए अनावश्यक प्रोजेक्ट निर्भरताओं का ऑडिट और छंटाई की गई।',
    color: 'emerald',
    icon: Zap,
    features: [
      {
        nameEn: 'Dependency Audit', nameHi: 'निर्भरता ऑडिट',
        textEn: 'Removed redundant packages while ensuring all necessary core runtime and build dependencies are accurately linked.',
        textHi: 'यह सुनिश्चित करते हुए कि सभी आवश्यक कोर रनटाइम और बिल्ड निर्भरताएं सटीक रूप से जुड़ी हुई हैं, अनावश्यक पैकेज हटा दिए गए।'
      }
    ]
  },
  {
    version: 'v1.12.2',
    titleEn: 'Single Payment Gateway Consolidation (Razorpay)',
    titleHi: 'एकल भुगतान गेटवे एकीकरण (Razorpay)',
    dateEn: 'August 2026',
    dateHi: 'अगस्त 2026',
    descEn: 'Consolidated payment infrastructure to use Razorpay as the sole payment gateway for platform subscription checkouts, while retaining direct org-to-member UPI ID reference logging.',
    descHi: 'प्लेटफॉर्म सदस्यता चेकआउट के लिए Razorpay को एकमात्र भुगतान गेटवे के रूप में उपयोग करने के लिए भुगतान बुनियादी ढांचे को समेकित किया गया, जबकि प्रत्यक्ष org-से-सदस्य UPI ID संदर्भ लॉगिंग को बरकरार रखा गया।',
    color: 'indigo',
    icon: Sparkles,
    features: [
      {
        nameEn: 'Razorpay API Handlers', nameHi: 'Razorpay API हैंडलर',
        textEn: 'Implemented backend order creation and SHA-256 HMAC signature verification endpoints for Razorpay.',
        textHi: 'Razorpay के लिए बैकएंड ऑर्डर निर्माण और SHA-256 HMAC हस्ताक्षर सत्यापन एंडपॉइंट लागू किए गए।'
      },
      {
        nameEn: 'Gateway Cleanup', nameHi: 'गेटवे की सफाई',
        textEn: 'Removed unused alternative payment gateway SDKs and webhooks to keep the application lean and secure.',
        textHi: 'आवेदन को हल्का और सुरक्षित रखने के लिए अप्रयुक्त वैकल्पिक भुगतान गेटवे SDK और वेबहुक हटा दिए गए।'
      }
    ]
  },
  {
    version: 'v1.12.1',
    titleEn: 'Design System Unification',
    titleHi: 'डिज़ाइन सिस्टम एकीकरण',
    dateEn: 'August 2026',
    dateHi: 'अगस्त 2026',
    descEn: 'Completed a comprehensive review of the application\'s visual identity, stripping away remaining AI-generated blobby design patterns and enforcing a crisp, geometric, and technical aesthetic across all public pages and core UI components.',
    descHi: 'एप्लिकेशन की दृश्य पहचान की व्यापक समीक्षा पूरी की, शेष AI-जनित ब्लॉबी डिज़ाइन पैटर्न को हटा दिया और सभी सार्वजनिक पृष्ठों और मुख्य UI घटकों में एक क्रिस्प, ज्यामितीय और तकनीकी सौंदर्यशास्त्र लागू किया।',
    color: 'emerald',
    icon: Sparkles,
    features: [
      {
        nameEn: 'Geometric Components', nameHi: 'ज्यामितीय घटक',
        textEn: 'Updated core UI components (Cards, Buttons, Badges) to use sharp, technical border radii instead of organic, rounded shapes.',
        textHi: 'जैविक, गोलाकार आकृतियों के बजाय तेज, तकनीकी बॉर्डर रेडी का उपयोग करने के लिए मुख्य UI घटकों (कार्ड, बटन, बैज) को अपडेट किया गया।'
      },
      {
        nameEn: 'Typography Cleanup', nameHi: 'टाइपोग्राफी सफाई',
        textEn: 'Removed overused decorative typography patterns (wide-tracking uppercase labels) from headings across the platform for a cleaner look.',
        textHi: 'क्लीनर लुक के लिए पूरे प्लेटफॉर्म में हेडिंग से अति प्रयोग किए गए सजावटी टाइपोग्राफी पैटर्न (वाइड-ट्रैकिंग अपरकेस लेबल) को हटा दिया गया।'
      }
    ]
  },
  {
    version: 'v1.12.0',
    titleEn: 'Smart Compliance Tracker',
    titleHi: 'स्मार्ट अनुपालन ट्रैकर',
    dateEn: 'August 2026',
    dateHi: 'अगस्त 2026',
    descEn: 'Redesigned the Compliance Tracker to automatically suggest exact legal documents and registrations based on the organization\'s real usage metrics (members, donations, events).',
    descHi: 'संगठन के वास्तविक उपयोग मीट्रिक के आधार पर सटीक कानूनी दस्तावेजों और पंजीकरणों का स्वचालित रूप से सुझाव देने के लिए अनुपालन ट्रैकर को नया रूप दिया गया।',
    color: 'purple',
    icon: Sparkles,
    features: [
      {
        nameEn: 'Usage-Based Triggers', nameHi: 'उपयोग-आधारित ट्रिगर',
        textEn: 'Compliance requirements unlock progressively. For example, 80G tax exemption unlocks only after receiving the first donation.',
        textHi: 'अनुपालन आवश्यकताएं उत्तरोत्तर अनलॉक होती हैं। उदाहरण के लिए, पहला दान प्राप्त करने के बाद ही 80G कर छूट अनलॉक होती है।'
      },
      {
        nameEn: 'Direct Registration Links', nameHi: 'सीधे पंजीकरण लिंक',
        textEn: 'Exact government portal links (e.g., GST, FCRA) are now provided directly alongside the required compliance items.',
        textHi: 'सटीक सरकारी पोर्टल लिंक (जैसे, जीएसटी, एफसीआरए) अब सीधे आवश्यक अनुपालन वस्तुओं के साथ प्रदान किए जाते हैं।'
      }
    ]
  },
  {
    version: 'v1.11.0',
    titleEn: 'Production Hardening & System Operations Upgrade',
    titleHi: 'उत्पादन सुदृढ़ीकरण और प्रणाली संचालन उन्नयन',
    dateEn: 'August 2026',
    dateHi: 'अगस्त 2026',
    descEn: 'Hardened platform data processing, automated election tally operations, enhanced tax receipt calculation accuracy, and refined error handling across system administration workflows.',
    descHi: 'प्लेटफ़ॉर्म डेटा प्रोसेसिंग को सुदृढ़ किया गया, स्वचालित चुनाव गणना संचालन, कर रसीद गणना सटीकता में सुधार, और प्रशासनिक वर्कफ़्लो में त्रुटि प्रबंधन को परिष्कृत किया गया।',
    color: 'emerald',
    icon: ShieldCheck,
    features: [
      {
        nameEn: 'Atomic Election Vote Tallying', nameHi: 'परमाणु चुनाव वोट गणना',
        textEn: 'Upgraded candidate vote counting to atomic database operations to guarantee vote tally accuracy under high concurrent user participation.',
        textHi: 'उच्च समवर्ती उपयोगकर्ता भागीदारी के तहत वोट गणना सटीकता की गारंटी के लिए उम्मीदवार वोट गणना को परमाणु डेटाबेस संचालन में अपग्रेड किया गया।'
      },
      {
        nameEn: 'Automated Tax Receipt Valuation', nameHi: 'स्वचालित कर रसीद मूल्य निर्धारण',
        textEn: 'Seamlessly linked tax receipt generation with live donation ledger balances for instant, precise tax documentation.',
        textHi: 'त्वरित, सटीक कर प्रलेखन के लिए लाइव दान बहीखाता शेष राशि के साथ कर रसीद निर्माण को निर्बाध रूप से जोड़ा गया।'
      },
      {
        nameEn: 'Robust System Settings Parsing', nameHi: 'मजबूत सिस्टम सेटिंग्स पार्सिंग',
        textEn: 'Enhanced system administration configuration handling with structured error reporting and robust JSON parsing.',
        textHi: 'संरचित त्रुटि रिपोर्टिंग और मजबूत JSON पार्सिंग के साथ उन्नत सिस्टम प्रशासन कॉन्फ़िगरेशन प्रबंधन।'
      },
      {
        nameEn: 'Unauthenticated Pricing Access', nameHi: 'अनअथेंटिकेटेड मूल्य निर्धारण एक्सेस',
        textEn: 'Configured middleware routing to allow visitors to view public pricing and feature tiers without needing to log in first.',
        textHi: 'विज़िटर्स को लॉगिन किए बिना सार्वजनिक मूल्य निर्धारण और सुविधा स्तरों को देखने की अनुमति देने के लिए मिडलवेयर राउटिंग कॉन्फ़िगर की गई।'
      }
    ]
  },
  {
    version: 'v1.10.0',
    titleEn: 'Smart Intelligence Platform',
    titleHi: 'स्मार्ट इंटेलिजेंस प्लेटफॉर्म',
    dateEn: 'June 2026',
    dateHi: 'जून 2026',
    descEn: 'Six intelligent features to help organizations work smarter. All features gracefully fall back when disabled.',
    descHi: 'संगठनों को अधिक स्मार्ट तरीके से काम करने में मदद करने के लिए छह स्मार्ट सुविधाएँ। अक्षम होने पर सभी सुविधाएँ स्वचालित रूप से फ़ॉलबैक हो जाती हैं।',
    color: 'purple',
    icon: Zap,
    features: [
      {
        nameEn: 'Automated Weekly Summary', nameHi: 'स्वचालित साप्ताहिक सारांश',
        textEn: 'Upgraded dashboard summary with richer stats: tickets, members, events, and polls. Generates a strategic 3-4 sentence briefing.',
        textHi: 'टिकट, सदस्य, इवेंट और पोल के साथ उन्नत डैशबोर्ड सारांश। रणनीतिक 3-4 वाक्यों का ब्रीफिंग तैयार करता है।'
      },
      {
        nameEn: 'Social Content Generator', nameHi: 'सोशल कंटेंट जनरेटर',
        textEn: 'Draft social posts, newsletters, announcements, and reports from real org activity. Supports professional, casual, motivational, and formal tones.',
        textHi: 'वास्तविक संगठन गतिविधि से सोशल पोस्ट, न्यूज़लेटर, घोषणाएँ और रिपोर्ट तैयार करें। पेशेवर, आकस्मिक, प्रेरणादायक और औपचारिक शैलियों का समर्थन करता है।'
      },
      {
        nameEn: 'Meeting Minutes Automation', nameHi: 'मीटिंग मिनट्स ऑटोमेशन',
        textEn: 'Paste meeting notes to get structured minutes with summary, key discussions, decisions, action items, and next steps. Optionally create tasks from action items.',
        textHi: 'मीटिंग नोट्स पेस्ट करें और सारांश, मुख्य चर्चाएँ, निर्णय, कार्य आइटम और अगले कदमों के साथ संरचित मिनट्स प्राप्त करें। कार्य आइटम से कार्य बनाएँ।'
      },
      {
        nameEn: 'Form Response Analysis', nameHi: 'फ़ॉर्म प्रतिक्रिया विश्लेषण',
        textEn: 'Analyze form submissions for trends, patterns, and urgent flags. Automatically highlight submissions needing immediate attention.',
        textHi: 'रुझानों, पैटर्न और अत्यावश्यक फ़्लैग के लिए फ़ॉर्म सबमिशन का विश्लेषण करें। तत्काल ध्यान देने की आवश्यकता वाले सबमिशन को स्वचालित रूप से हाइलाइट करें।'
      },
      {
        nameEn: 'Smart Notifications', nameHi: 'स्मार्ट नोटिफिकेशन',
        textEn: 'Personalized push notifications for tasks, events, meetings, milestones, and announcements, generated per member with context-aware messaging.',
        textHi: 'कार्यों, इवेंट्स, मीटिंग्स, माइलस्टोन और घोषणाओं के लिए वैयक्तिकृत पुश नोटिफिकेशन, संदर्भ-जागरूक मैसेजिंग के साथ प्रति सदस्य उत्पन्न।'
      },
      {
        nameEn: 'Proposal & Policy Analyzer', nameHi: 'प्रस्ताव और नीति विश्लेषक',
        textEn: 'Analyze proposals for readability, strengths, concerns, conflicts with existing polls, and community sentiment. Generate plain-language briefs for member voting.',
        textHi: 'पठनीयता, ताकत, चिंताओं, मौजूदा पोल के साथ संघर्ष और सामुदायिक भावना के लिए प्रस्तावों का विश्लेषण करें। सदस्य मतदान के लिए सरल भाषा में ब्रीफ तैयार करें।'
      },
    ],
  },
  {
    version: 'v1.9.6',
    titleEn: 'Compliance Tracker: Real Certificate Management',
    titleHi: 'कम्प्लायंस ट्रैकर: वास्तविक प्रमाणपत्र प्रबंधन',
    dateEn: 'June 2026',
    dateHi: 'जून 2026',
    descEn: 'Replaced the static compliance checklist with a fully editable, database-backed Compliance Tracker. Each certification (12A, 80G, FCRA, Trade Union Registration, etc.) is now a real entity with document uploads, status tracking, and notes. The old page showed hardcoded statuses that never reflected actual progress. Now everything is dynamic and editable by org admins.',
    descHi: 'स्टैटिक कम्प्लायंस चेकलिस्ट को पूरी तरह से एडिट करने योग्य, डेटाबेस-समर्थित कम्प्लायंस ट्रैकर से बदल दिया गया। प्रत्येक प्रमाणपत्र (12A, 80G, FCRA, ट्रेड यूनियन रजिस्ट्रेशन, आदि) अब दस्तावेज़ अपलोड, स्थिति ट्रैकिंग और नोट्स के साथ एक वास्तविक इकाई है।',
    color: 'emerald',
    icon: ShieldCheck,
    features: [
      {
        nameEn: 'Org-Type-Specific Defaults', nameHi: 'संगठन-प्रकार-विशिष्ट डिफ़ॉल्ट',
        textEn: 'Each organisation type (NGO, RWA, Workers Union, Student Union) gets relevant compliance items pre-seeded, with no more one-size-fits-all checklists.',
        textHi: 'प्रत्येक संगठन प्रकार (NGO, RWA, श्रमिक संघ, छात्र संघ) को प्रासंगिक कम्प्लायंस आइटम पूर्व-निर्धारित मिलते हैं, बिना किसी एक-आकार-सभी के लिए चेकलिस्ट के।'
      },
      {
        nameEn: 'Document Upload & Storage', nameHi: 'दस्तावेज़ अपलोड और भंडारण',
        textEn: 'Upload PDFs and images for each compliance item. Documents are stored securely in org-specific folders with RLS policies.',
        textHi: 'प्रत्येक कम्प्लायंस आइटम के लिए PDF और इमेज अपलोड करें। दस्तावेज़ RLS नीतियों के साथ org-विशिष्ट फ़ोल्डरों में सुरक्षित रूप से संग्रहीत किए जाते हैं।'
      },
      {
        nameEn: 'Editable Status & Notes', nameHi: 'संपादन योग्य स्थिति और नोट्स',
        textEn: 'Admins can update status (Not Started → In Progress → Submitted → Approved/Rejected) and add notes for each requirement.',
        textHi: 'प्रशासक प्रत्येक आवश्यकता के लिए स्थिति (शुरू नहीं किया → प्रगति पर → सबमिट किया → स्वीकृत/अस्वीकृत) और नोट्स अपडेट कर सकते हैं।'
      },
      {
        nameEn: 'Custom Requirements', nameHi: 'कस्टम आवश्यकताएं',
        textEn: 'Add, edit, or remove compliance items as needed. Organisations can track any certification or registration relevant to them.',
        textHi: 'आवश्यकतानुसार कम्प्लायंस आइटम जोड़ें, संपादित करें या हटाएं। संगठन उनसे संबंधित किसी भी प्रमाणपत्र या पंजीकरण को ट्रैक कर सकते हैं।'
      },
    ]
  },
  {
    version: 'v1.9.5',
    titleEn: 'Navigation Fixes & Build Optimization',
    titleHi: 'नेविगेशन सुधार और बिल्ड ऑप्टिमाइज़ेशन',
    dateEn: 'June 2026',
    dateHi: 'जून 2026',
    descEn: 'Fixed page interactivity and improved build performance by removing the experimental React Compiler, plus fixed sidebar navigation dropdowns requiring two clicks to expand.',
    descHi: 'प्रायोगिक रिएक्ट कंपाइलर को हटाकर पेज इंटरैक्टिविटी ठीक की गई और बिल्ड प्रदर्शन में सुधार किया गया, साथ ही साइडबार नेविगेशन ड्रॉपडाउन को एक क्लिक में खोलने के लिए ठीक किया गया।',
    color: 'blue',
    icon: Zap,
    features: [
      {
        nameEn: 'Build Speed Optimization', nameHi: 'बिल्ड स्पीड ऑप्टिमाइज़ेशन',
        textEn: 'Removed the experimental React Compiler (babel-plugin-react-compiler) which was analysing all 108 page components, causing slow Vercel builds exceeding one minute and triggering hydration failures in client-side interactivity.',
        textHi: 'प्रायोगिक रिएक्ट कंपाइलर को हटाया गया जो सभी 108 पेज कंपोनेंट्स का विश्लेषण कर रहा था, जिससे Vercel बिल्ड धीमे हो रहे थे और क्लाइंट-साइड इंटरैक्टिविटी में हाइड्रेशन विफलताएं हो रही थीं।'
      },
      {
        nameEn: 'Sidebar Toggle Fix', nameHi: 'साइडबार टॉगल सुधार',
        textEn: 'Fixed sidebar navigation dropdowns that required two clicks to expand because the toggle function was misreading initial collapsed state, causing the first click to appear to do nothing.',
        textHi: 'साइडबार नेविगेशन ड्रॉपडाउन को ठीक किया गया जो विस्तार करने के लिए दो क्लिक की आवश्यकता थी, क्योंकि टॉगल फ़ंक्शन प्रारंभिक संक्षिप्त स्थिति को गलत पढ़ रहा था, जिससे पहला क्लिक कुछ नहीं करता दिख रहा था।'
      }
    ]
  },
  {
    version: 'v1.9.4',
    titleEn: 'Dashboard UI Consistency Improvements',
    titleHi: 'डैशबोर्ड UI एकरूपता में सुधार',
    dateEn: 'June 2026',
    dateHi: 'जून 2026',
    descEn: 'Standardised page headings, wrappers, and colour tokens across 30+ dashboard pages for a cohesive, polished experience. Removed hardcoded slate colours in favour of CSS variable tokens, ensuring consistent light-mode presentation.',
    descHi: 'एक सुसंगत अनुभव के लिए 30+ डैशबोर्ड पृष्ठों पर पृष्ठ शीर्षकों और रंग टोकन को मानकीकृत किया गया। CSS वेरिएबल टोकन के पक्ष में हार्डकोडेड स्लेट रंगों को हटाया गया।',
    color: 'slate',
    icon: Zap
  },
  {
    version: 'v1.9.3',
    titleEn: 'Dashboard Navigation and Loading Improvements',
    titleHi: 'डैशबोर्ड नेविगेशन और लोडिंग में सुधार',
    dateEn: 'June 2026',
    dateHi: 'जून 2026',
    descEn: 'Resolved an issue where the dashboard could enter an infinite loading state under certain redirection workflows, ensuring seamless onboarding and organization selection.',
    descHi: 'एक समस्या को हल किया गया जहाँ डैशबोर्ड कुछ पुनर्निर्देशन कार्यप्रवाहों के तहत अनंत लोडिंग स्थिति में प्रवेश कर सकता था, जिससे सहज ऑनबोर्डिंग और संगठन चयन सुनिश्चित हो सके।',
    color: 'blue',
    icon: Zap
  },
  {
    version: 'v1.9.2',
    titleEn: 'Razorpay Integration for Plans and Contributions',
    titleHi: 'प्लान और योगदान के लिए Razorpay इंटीग्रेशन',
    dateEn: 'June 2026',
    dateHi: 'जून 2026',
    descEn: 'Integrated Razorpay checkout to make our Institution and White-label plans directly purchasable, and added a dynamic amount input on the supporter page for custom contributions.',
    descHi: 'संस्थान और व्हाइट-लेबल प्लान को सीधे खरीदने योग्य बनाने के लिए Razorpay चेकआउट को एकीकृत किया गया, और कस्टम योगदान के लिए समर्थक पृष्ठ पर एक गतिशील राशि इनपुट जोड़ा गया।',
    color: 'emerald',
    icon: Sparkles
  },
  {
    version: 'v1.9.1',
    titleEn: 'Interactive Feature Exploration Redesign',
    titleHi: 'इंटरैक्टिव सुविधा अन्वेषण पुनर्रचना',
    dateEn: 'June 2026',
    dateHi: 'जून 2026',
    descEn: 'Redesigned the features page with a highly interactive, click-driven exploration dashboard, supporting both desktop split-pane and mobile accordion views for a premium look and feel.',
    descHi: 'अधिक इंटरैक्टिव, क्लिक-चालित अन्वेषण डैशबोर्ड के साथ सुविधाओं के पेज को फिर से डिज़ाइन किया गया, जो प्रीमियम लुक और फील के लिए डेस्कटॉप स्प्लिट-पेन और मोबाइल अकॉर्डियन दोनों दृश्यों का समर्थन करता है।',
    color: 'indigo',
    icon: Sparkles
  },
  {
    version: 'v1.9',
    titleEn: 'Secondary Features (Facilities, Dispatch & IDs)',
    titleHi: 'माध्यमिक सुविधाएँ (सुविधाएँ, प्रेषण और आईडी)',
    dateEn: 'June 2026',
    dateHi: 'जून 2026',
    descEn: 'Completion of the Sangathan Phase 3 Roadmap. Bringing facility booking for RWAs, worker dispatch for Unions, and beautiful Digital ID cards for students.',
    descHi: 'संगठन चरण 3 रोडमैप पूरा हो गया। RWA के लिए सुविधा बुकिंग, यूनियनों के लिए कार्यकर्ता प्रेषण और छात्रों के लिए सुंदर डिजिटल आईडी कार्ड लाना।',
    color: 'blue',
    icon: Building2,
    features: [
      {
        nameEn: 'Facility Booking (RWA)', nameHi: 'सुविधा बुकिंग (RWA)',
        textEn: 'Admins can list clubhouses or sports courts. Members can seamlessly request bookings, avoiding double-booking via smart date conflict checks.',
        textHi: 'प्रशासक क्लब हाउस या स्पोर्ट्स कोर्ट सूचीबद्ध कर सकते हैं। सदस्य स्मार्ट दिनांक संघर्ष जाँच के माध्यम से दोहरी बुकिंग से बचते हुए सहजता से बुकिंग का अनुरोध कर सकते हैं।'
      },
      {
        nameEn: 'Worker Dispatch System', nameHi: 'कार्यकर्ता प्रेषण प्रणाली',
        textEn: 'Workers unions can list open jobs from employers, and members can apply. Stewards can digitally dispatch workers directly from the dashboard.',
        textHi: 'श्रमिक संघ नियोक्ताओं की खुली नौकरियों को सूचीबद्ध कर सकते हैं, और सदस्य आवेदन कर सकते हैं। स्टूअर्ड सीधे डैशबोर्ड से श्रमिकों को डिजिटल रूप से भेज सकते हैं।'
      },
      {
        nameEn: 'Digital ID Cards & Grant Tracking', nameHi: 'डिजिटल आईडी कार्ड और अनुदान ट्रैकिंग',
        textEn: 'Students get autogenerated secure Digital ID cards with QR codes. NGOs get upgraded Grant Tracking interfaces to move funds from Draft to Awarded.',
        textHi: 'छात्रों को क्यूआर कोड वाले सुरक्षित डिजिटल आईडी कार्ड मिलते हैं। गैर सरकारी संगठनों को अनुदान को ड्राफ्ट से स्वीकृत तक ले जाने के लिए उन्नत अनुदान ट्रैकिंग इंटरफ़ेस मिलता है।'
      }
    ]
  },
  {
    version: 'v1.8.1',
    titleEn: 'Legal & Compliance Updates',
    titleHi: 'कानूनी और अनुपालन अपडेट',
    dateEn: 'June 2026',
    dateHi: 'जून 2026',
    descEn: 'Updated our Terms of Service, Privacy Policy, and Refund Policy with registered entity details to ensure transparency and compliance with standard payment gateways.',
    descHi: 'मानक भुगतान गेटवे के साथ पारदर्शिता और अनुपालन सुनिश्चित करने के लिए पंजीकृत इकाई विवरण के साथ हमारी सेवा की शर्तें, गोपनीयता नीति और धनवापसी नीति को अपडेट किया गया।',
    color: 'slate',
    icon: ShieldCheck
  },
  {
    version: 'v1.8',
    titleEn: 'Core Union Features (Student & Workers)',
    titleHi: 'कोर यूनियन फीचर्स (छात्र और श्रमिक)',
    dateEn: 'June 2026',
    dateHi: 'जून 2026',
    descEn: 'Major release empowering Student and Workers Unions with democratic elections, dues collection, and contract management capabilities.',
    descHi: 'छात्र और श्रमिक संघों को लोकतांत्रिक चुनाव, बकाया संग्रह और अनुबंध प्रबंधन क्षमताओं के साथ सशक्त बनाने वाली प्रमुख रिलीज।',
    color: 'emerald',
    icon: Sparkles,
    features: [
      {
        nameEn: 'Secure Union Elections', nameHi: 'सुरक्षित यूनियन चुनाव',
        textEn: 'End-to-end election flow allowing admins to set positions, nominate candidates, and members to securely and anonymously cast their votes.',
        textHi: 'प्रशासकों को पदों को निर्धारित करने, उम्मीदवारों को नामित करने और सदस्यों को सुरक्षित और गुमनाम रूप से अपना वोट डालने की अनुमति देने वाला एंड-टू-एंड चुनाव प्रवाह।'
      },
      {
        nameEn: 'Automated Dues Collection', nameHi: 'स्वचालित बकाया संग्रह',
        textEn: 'Workers unions can now create customized billing plans, auto-generate dues for members, and track paid vs. overdue statuses seamlessly.',
        textHi: 'श्रमिक संघ अब अनुकूलित बिलिंग योजनाएं बना सकते हैं, सदस्यों के लिए स्वचालित रूप से बकाया उत्पन्न कर सकते हैं, और भुगतान बनाम अतिदेय स्थितियों को ट्रैक कर सकते हैं।'
      },
      {
        nameEn: 'CBA Tracking & Uploads', nameHi: 'CBA ट्रैकिंग और अपलोड',
        textEn: 'Enhanced Collective Bargaining Agreement repository allowing document uploads, validity tracking, and status management (draft/active/expired).',
        textHi: 'सामूहिक सौदेबाजी समझौते भंडार को बढ़ाया गया है जो दस्तावेज़ अपलोड, वैधता ट्रैकिंग और स्थिति प्रबंधन (प्रारूप / सक्रिय / समाप्त) की अनुमति देता है।'
      }
    ]
  },
  {
    version: 'v1.7',
    titleEn: 'Civic Infrastructure Phase 1 (NGO & RWA)',
    titleHi: 'नागरिक अवसंरचना चरण 1 (NGO और RWA)',
    dateEn: 'June 2026',
    dateHi: 'जून 2026',
    descEn: 'Rolled out critical infrastructure features for NGOs and Resident Welfare Associations to manage their finances and operations effectively.',
    descHi: 'गैर सरकारी संगठनों और आरडब्ल्यूए (RWAs) के लिए उनके वित्त और संचालन को प्रभावी ढंग से प्रबंधित करने के लिए महत्वपूर्ण बुनियादी ढांचा सुविधाएं शुरू की गईं।',
    color: 'indigo',
    icon: Sparkles,
    features: [
      {
        nameEn: 'Tax Receipts & Subscriptions', nameHi: 'कर रसीदें और सदस्यता',
        textEn: 'NGOs can now generate compliant PDF tax receipts and track recurring donation subscriptions directly from the dashboard.',
        textHi: 'गैर सरकारी संगठन अब डैशबोर्ड से सीधे कर रसीदें (PDF) उत्पन्न कर सकते हैं और आवर्ती दान सदस्यता को ट्रैक कर सकते हैं।'
      },
      {
        nameEn: 'Maintenance Billing', nameHi: 'रखरखाव बिलिंग',
        textEn: 'RWAs can easily track units and automatically generate maintenance invoices with due dates and overdue statuses.',
        textHi: 'RWA आसानी से इकाइयों को ट्रैक कर सकते हैं और देय तिथियों के साथ रखरखाव चालान स्वचालित रूप से उत्पन्न कर सकते हैं।'
      },
      {
        nameEn: 'Visitor Management', nameHi: 'आगंतुक प्रबंधन',
        textEn: 'Pre-approve guests, manage gate logs, and perform instant check-ins and check-outs for enhanced society security.',
        textHi: 'पूर्व-अनुमोदित अतिथि, गेट लॉग प्रबंधित करें, और समाज की सुरक्षा के लिए त्वरित चेक-इन और चेक-आउट करें।'
      }
    ]
  },
  {
    version: 'v1.6',
    titleEn: 'Authentication Overhaul & Typography Refinement',
    titleHi: 'प्रमाणीकरण ओवरहाल और टाइपोग्राफी सुधार',
    dateEn: 'June 2026',
    dateHi: 'जून 2026',
    descEn: 'Completely redesigned the authentication flows with a crisp, geometric aesthetic, introduced Google and X logins, and applied a global typography refinement.',
    descHi: 'प्रमाणीकरण प्रवाह को एक ज्यामितीय सौंदर्यशास्त्र के साथ पूरी तरह से फिर से डिज़ाइन किया गया है, Google और X (Twitter) लॉगिन पेश किए गए हैं, और वैश्विक टाइपोग्राफी सुधार लागू किए गए हैं।',
    color: 'emerald',
    icon: Sparkles,
    features: [
      {
        nameEn: 'Geometric Design System', nameHi: 'ज्यामितीय डिजाइन सिस्टम',
        textEn: 'Upgraded all pages to a unified, premium geometric design system, strictly removing outdated dark cards and AI-generated blobs.',
        textHi: 'पुराने डार्क कार्ड्स और एआई-जनित ब्लॉब्स को हटाकर सभी पेजों को एक एकीकृत, प्रीमियम ज्यामितीय डिजाइन सिस्टम में अपग्रेड किया।'
      },
      {
        nameEn: 'Typography Refinements', nameHi: 'टाइपोग्राफी सुधार',
        textEn: 'Adopted Outfit as the unified global font, carefully calibrating header line-heights across the platform for perfect crispness.',
        textHi: 'एकीकृत वैश्विक फ़ॉन्ट के रूप में आउटफ़िट को अपनाया, सही स्पष्टता के लिए पूरे प्लेटफ़ॉर्म पर हेडर लाइन-ऊंचाई को सावधानीपूर्वक समायोजित किया।'
      },
      {
        nameEn: 'Google & X OAuth', nameHi: 'Google और X OAuth',
        textEn: 'One-click login and signup using your existing Google or X accounts for frictionless onboarding.',
        textHi: 'बिना किसी परेशानी के Google या X खातों का उपयोग करके एक-क्लिक लॉगिन और साइनअप।'
      }
    ]
  },
  {
    version: 'v1.5.2',
    titleEn: 'Pricing & Features Showcase',
    titleHi: 'मूल्य निर्धारण और सुविधाएँ',
    dateEn: 'June 2026',
    dateHi: 'जून 2026',
    descEn: 'Launched transparent pricing tiers and a beautiful features showcase tailored to NGOs, Student Unions, Workers Unions, and RWAs.',
    descHi: 'गैर सरकारी संगठनों, छात्र संघों, श्रमिक संघों और आरडब्ल्यूए (RWAs) के लिए पारदर्शी मूल्य निर्धारण स्तर और एक सुंदर सुविधा शोकेस लॉन्च किया गया।',
    color: 'cyan',
    icon: Sparkles,
  },
  {
    version: 'v1.5.1',
    titleEn: 'Design Consistency & Light Mode Only',
    titleHi: 'डिज़ाइन संगति और केवल लाइट मोड',
    dateEn: 'June 2026',
    dateHi: 'जून 2026',
    descEn: 'We have refined our public UI across the board. We completely removed the dark mode to ensure a consistent, premium light-mode experience and stripped away unnecessary badges to avoid a generic AI-generated look.',
    descHi: 'हमने सभी जगह अपनी सार्वजनिक UI को परिष्कृत किया है। हमने एक सुसंगत, प्रीमियम लाइट-मोड अनुभव सुनिश्चित करने के लिए डार्क मोड को पूरी तरह से हटा दिया है और एक सामान्य AI-जनित लुक से बचने के लिए अनावश्यक बैज हटा दिए हैं।',
    color: 'emerald',
    icon: Sparkles,
  },
  {
    version: 'v1.5',
    titleEn: 'Premium Public UI Overhaul',
    titleHi: 'सार्वजनिक UI का प्रीमियम ओवरहाल',
    dateEn: 'June 2026',
    dateHi: 'जून 2026',
    descEn: 'We have completely reimagined our public-facing interface, shedding the generic look for a high-end, unified native app aesthetic with beautiful gradients and micro-interactions.',
    descHi: 'हमने अपने सार्वजनिक इंटरफ़ेस की पूरी तरह से कल्पना की है, और सुंदर ग्रेडिएंट और सूक्ष्म इंटरैक्शन के साथ एक उच्च-अंत, एकीकृत देशी ऐप सौंदर्यशास्त्र के लिए सामान्य रूप को छोड़ दिया है।',
    color: 'indigo',
    icon: Sparkles,
    features: [
      {
        nameEn: 'Floating Navigation', nameHi: 'फ़्लोटिंग नेविगेशन',
        textEn: 'A sleek, pill-shaped floating navbar with glassmorphism effects and animated link states.',
        textHi: 'ग्लासमॉर्फिज्म प्रभाव और एनिमेटेड लिंक के साथ एक चिकना, फ़्लोटिंग नेविगेशन बार।'
      },
      {
        nameEn: 'Bento Box Redesign', nameHi: 'बेंटो बॉक्स डिज़ाइन',
        textEn: 'Upgraded landing pages with modern Bento Box grids, glowing mesh backgrounds, and premium typography.',
        textHi: 'आधुनिक बेंटो बॉक्स ग्रिड, चमकते मेष पृष्ठभूमि और प्रीमियम टाइपोग्राफी के साथ लैंडिंग पृष्ठों को अपग्रेड किया गया।'
      },
      {
        nameEn: 'Unified Aesthetics', nameHi: 'एकीकृत सौंदर्यशास्त्र',
        textEn: 'Standardized sub-pages (About, Governance, Contact) with a cohesive, polished PageHeader component.',
        textHi: 'एक सुसंगत, पॉलिश किए गए PageHeader घटक के साथ मानकीकृत उप-पृष्ठ (हमारे बारे में, शासन, संपर्क)।'
      }
    ]
  },
  {
    version: 'v1.4',
    titleEn: 'Architecture, Stability, & Support Model',
    titleHi: 'वास्तुकला, स्थिरता और समर्थन मॉडल',
    dateEn: 'June 2026',
    dateHi: 'जून 2026',
    descEn: 'This month we focused on massive platform stabilization and shifted to a transparent voluntary contribution model.',
    descHi: 'इस महीने हमने प्लेटफ़ॉर्म की स्थिरता पर ध्यान केंद्रित किया और एक पारदर्शी स्वैच्छिक योगदान मॉडल पर स्थानांतरित हुए।',
    color: 'emerald',
    icon: ShieldCheck,
    features: [
      {
        nameEn: 'Support Sangathan', nameHi: 'समर्थन संगठन',
        textEn: 'Replaced Razorpay dependencies with a 100% voluntary UPI-based contribution model highlighting infrastructure costs.',
        textHi: 'रेज़रपे को हटाकर वित्तीय पारदर्शिता और सीधे UPI योगदान वाला मॉडल लागू किया।'
      },
      {
        nameEn: 'Error Tracking', nameHi: 'त्रुटि ट्रैकिंग',
        textEn: 'Integrated Sentry for enterprise-grade observability and runtime error tracking.',
        textHi: 'एंटरप्राइज़-ग्रेड निगरानी के लिए Sentry का एकीकरण।'
      },
      {
        nameEn: 'Strict Typing', nameHi: 'सख्त टाइपिंग',
        textEn: 'Enforced strict Supabase database typing with the Next.js Turbopack compiler, discovering and patching numerous latent bugs.',
        textHi: 'सुपाबेस से सीधे डेटाबेस टाइपिंग लागू करके कई छिपी हुई त्रुटियों को ठीक किया और टर्बोपैक (Turbopack) संकलन में सुधार किया।'
      }
    ]
  },
  {
    version: 'v1.3',
    titleEn: 'Organization-Specific Workflows',
    titleHi: 'संगठन-विशिष्ट कार्यप्रवाह',
    dateEn: 'May 2026',
    dateHi: 'मई 2026',
    descEn: 'Specialized features and tailored dashboards for every type of organization.',
    descHi: 'विभिन्न प्रकार के संगठनों के लिए विशेष सुविधाएँ और डैशबोर्ड।',
    color: 'blue',
    icon: Users,
    features: [
      {
        nameEn: 'Specialized Dashboards', nameHi: 'विशेष डैशबोर्ड',
        textEn: 'Custom interfaces and capabilities for NGOs, Student Unions, Workers Unions, and RWAs.',
        textHi: 'गैर सरकारी संगठनों (NGO), छात्र संघों, श्रमिक संघों और RWA के लिए कस्टम इंटरफ़ेस।'
      },
      {
        nameEn: 'Campaigns & Volunteers', nameHi: 'अभियान और स्वयंसेवक',
        textEn: 'End-to-end CRUD systems for managing public campaigns and mobilising volunteers.',
        textHi: 'सार्वजनिक अभियानों और स्वयंसेवकों के प्रबंधन के लिए एंड-टू-एंड सिस्टम।'
      },
      {
        nameEn: 'Grievances & Maintenance', nameHi: 'शिकायत और रखरखाव',
        textEn: 'Dedicated workflows for Student Union grievances and RWA maintenance tracking.',
        textHi: 'शिकायतों और RWA रखरखाव अनुरोधों के लिए विशेष उपकरण।'
      }
    ]
  },
  {
    version: 'v1.2',
    titleEn: 'Dynamic Form Builder',
    titleHi: 'डायनामिक फॉर्म बिल्डर',
    dateEn: 'April 2026',
    dateHi: 'अप्रैल 2026',
    descEn: 'Making data collection flexible and powerful for administrators.',
    descHi: 'डेटा संग्रह को और अधिक लचीला और शक्तिशाली बनाना।',
    color: 'purple',
    icon: Sparkles,
    features: [
      {
        nameEn: 'Form Builder', nameHi: 'फॉर्म बिल्डर',
        textEn: 'Advanced visual form builder supporting complex fields like file uploads and date pickers.',
        textHi: 'जटिल फ़ील्ड और फ़ाइल अपलोड के साथ विज़ुअल फॉर्म निर्माण उपकरण।'
      },
      {
        nameEn: 'Public Surveys', nameHi: 'सार्वजनिक सर्वेक्षण',
        textEn: 'Granular access controls for public vs. members-only form submissions via secure URLs.',
        textHi: 'सुरक्षित URL के साथ सार्वजनिक और केवल-सदस्य फॉर्म एक्सेस नियंत्रण।'
      }
    ]
  },
  {
    version: 'v1.1',
    titleEn: 'Hardening & Performance',
    titleHi: 'सुदृढ़ीकरण और प्रदर्शन',
    dateEn: 'March 2026',
    dateHi: 'मार्च 2026',
    descEn: 'Post-launch stabilization, improved speed, and offline resilience foundation.',
    descHi: 'लॉन्च के बाद की स्थिरता, बेहतर गति और ऑफ़लाइन क्षमताओं पर काम।',
    color: 'indigo',
    icon: Zap
  },
  {
    version: 'v1.0',
    titleEn: 'Public Launch',
    titleHi: 'सार्वजनिक लॉन्च',
    dateEn: 'February 2026',
    dateHi: 'फ़रवरी 2026',
    descEn: 'We are proud to announce the public launch of Sangathan. This release includes the core infrastructure required for any collective to operate digitally.',
    descHi: 'हमें संगठन के सार्वजनिक लॉन्च की घोषणा करते हुए गर्व हो रहा है। इस रिलीज में किसी भी सामूहिक को डिजिटल रूप से संचालित करने के लिए आवश्यक मुख्य बुनियादी ढांचा शामिल है।',
    color: 'orange',
    icon: Rocket,
    features: [
      { nameEn: 'Registry', nameHi: 'रजिस्ट्री', textEn: 'Secure member management with role-based access.', textHi: 'भूमिका-आधारित पहुंच के साथ सुरक्षित सदस्य प्रबंधन।' },
      { nameEn: 'Forms', nameHi: 'फॉर्म', textEn: 'Public intake forms with spam protection.', textHi: 'स्पैम सुरक्षा के साथ सार्वजनिक इनटेक फॉर्म।' },
      { nameEn: 'Ledger', nameHi: 'बहीखाता', textEn: 'Donation logging and UPI reference verification.', textHi: 'दान लॉगिंग और यूपीआई संदर्भ सत्यापन।' },
      { nameEn: 'Meetings', nameHi: 'बैठकें', textEn: 'Attendance tracking and Jitsi integration.', textHi: 'उपस्थिति ट्रैकिंग और जित्सी एकीकरण।' },
      { nameEn: 'Security', nameHi: 'सुरक्षा', textEn: 'Admin phone verification and immutable audit logs.', textHi: 'व्यवस्थापक फोन सत्यापन और अपरिवर्तनीय ऑडिट लॉग।' }
    ]
  },
  {
    version: 'v0.9',
    titleEn: 'Beta Phase & Compliance Framework',
    titleHi: 'बीटा चरण और अनुपालन ढांचा',
    dateEn: 'January 2026',
    dateHi: 'जनवरी 2026',
    descEn: 'Private beta testing with 50 founding organisations. Focused on load testing, security auditing, and compliance framework implementation.',
    descHi: '50 संस्थापक संगठनों के साथ निजी बीटा परीक्षण। लोड परीक्षण, सुरक्षा ऑडिटिंग और अनुपालन ढांचे के कार्यान्वयन पर केंद्रित।',
    color: 'cyan',
    icon: Activity
  },
  {
    version: 'v0.8',
    titleEn: 'Real-Time Communications',
    titleHi: 'रीयल-टाइम संचार',
    dateEn: 'November 2025',
    dateHi: 'नवंबर 2025',
    descEn: 'Implemented our real-time messaging and meeting infrastructure.',
    descHi: 'हमारे रीयल-टाइम मैसेजिंग और मीटिंग इंफ्रास्ट्रक्चर को लागू किया।',
    color: 'rose',
    icon: Globe,
    features: [
      { nameEn: 'Jitsi Integration', nameHi: 'जित्सी एकीकरण', textEn: 'Self-hosted video conferencing within the dashboard.', textHi: 'डैशबोर्ड के भीतर स्व-होस्टेड वीडियो कॉन्फ्रेंसिंग।' },
      { nameEn: 'Announcements', nameHi: 'घोषणाएँ', textEn: 'Push notifications and email broadcasts for organization members.', textHi: 'संगठन के सदस्यों के लिए पुश सूचनाएं और ईमेल प्रसारण।' }
    ]
  },
  {
    version: 'v0.7',
    titleEn: 'Financial Ledger & Auditing',
    titleHi: 'वित्तीय बहीखाता और ऑडिटिंग',
    dateEn: 'September 2025',
    dateHi: 'सितंबर 2025',
    descEn: 'Core financial transparency features completed.',
    descHi: 'मुख्य वित्तीय पारदर्शिता सुविधाएँ पूरी हुईं।',
    color: 'amber',
    icon: Server,
    features: [
      { nameEn: 'Ledger', nameHi: 'बहीखाता', textEn: 'Double-entry bookkeeping system for donations and grants.', textHi: 'दान और अनुदान के लिए दोहरी प्रविष्टि बहीखाता प्रणाली।' },
      { nameEn: 'Audit Logs', nameHi: 'ऑडिट लॉग', textEn: 'Tamper-evident logs for every administrative action.', textHi: 'हर प्रशासनिक कार्रवाई के लिए छेड़छाड़-स्पष्ट लॉग।' }
    ]
  },
  {
    version: 'v0.5',
    titleEn: 'Member Registry Engine',
    titleHi: 'सदस्य रजिस्ट्री इंजन',
    dateEn: 'June 2025',
    dateHi: 'जून 2025',
    descEn: 'The heart of Sangathan. Built the highly-scalable member registry with comprehensive role-based access control (RBAC).',
    descHi: 'संगठन का दिल। व्यापक भूमिका-आधारित पहुंच नियंत्रण (RBAC) के साथ अत्यधिक स्केलेबल सदस्य रजिस्ट्री का निर्माण किया।',
    color: 'blue',
    icon: Code
  },
  {
    version: 'v0.1',
    titleEn: 'Project Inception & Core Architecture',
    titleHi: 'परियोजना की शुरुआत और वास्तुकला',
    dateEn: 'April 2025',
    dateHi: 'अप्रैल 2025',
    descEn: 'The foundational commit. Setup Next.js App Router, Supabase schema, and our global design system.',
    descHi: 'बुनियादी प्रतिबद्धता। नेक्स्ट.जेएस ऐप राउटर, सुपाबेस स्कीमा और हमारे वैश्विक डिजाइन सिस्टम की स्थापना।',
    color: 'slate',
    icon: Calendar
  }
]

const colorClasses = {
  green: 'bg-green-100 text-green-600 ring-green-100   ',
  emerald: 'bg-emerald-100 text-emerald-600 ring-emerald-100   ',
  blue: 'bg-blue-100 text-blue-600 ring-blue-100   ',
  purple: 'bg-purple-100 text-purple-600 ring-purple-100   ',
  indigo: 'bg-indigo-100 text-indigo-600 ring-indigo-100   ',
  orange: 'bg-orange-100 text-orange-600 ring-orange-100   ',
  cyan: 'bg-cyan-100 text-cyan-600 ring-cyan-100   ',
  pink: 'bg-pink-100 text-pink-600 ring-pink-100   ',
  rose: 'bg-rose-100 text-rose-600 ring-rose-100   ',
  amber: 'bg-amber-100 text-amber-600 ring-amber-100   ',
  slate: 'bg-slate-100 text-slate-600 ring-slate-100   ',
}

export default async function ChangelogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  return (
    <div className="bg-white  min-h-screen">
      <PageHeader 
        title={isHindi ? 'परिवर्तन लॉग' : 'Changelog'}
        description={isHindi 
          ? 'हमारे सफर का एक पारदर्शी रिकॉर्ड। हर कदम पर संगठन को मजबूत बनाते हुए।'
          : 'A transparent record of our journey. Making Sangathan stronger with every release.'}
      />

      {/* Timeline Section */}
      <div className="max-w-4xl mx-auto py-16 px-6 sm:px-8">
        <div className="relative border-s-2 border-slate-200  ml-4 md:ml-6">
          {changelogData.map((entry, index) => {
            const Icon = entry.icon
            return (
              <div key={entry.version} className={`mb-16 ms-8 md:ms-12 ${index === changelogData.length - 1 ? 'mb-0' : ''}`}>
                <span className={`absolute flex items-center justify-center w-10 h-10 rounded-full -start-5 ring-8 ring-white  shadow-sm ${colorClasses[entry.color]}`}>
                  <Icon size={18} className="stroke-[2.5]" />
                </span>
                
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mb-2">
                  <h3 className="flex items-center text-2xl font-bold text-slate-900  tracking-tight">
                    {isHindi ? entry.titleHi : entry.titleEn}
                    <span className={`bg-slate-100 text-slate-800 text-sm font-semibold me-2 px-2.5 py-0.5 rounded   ms-3 border border-slate-200 `}>
                      {entry.version}
                    </span>
                  </h3>
                  <time className="block text-sm font-medium leading-none text-slate-400  flex-shrink-0">
                    {isHindi ? entry.dateHi : entry.dateEn}
                  </time>
                </div>
                
                <div className="prose prose-slate  prose-lg max-w-none text-slate-600  mt-4">
                  <p className="leading-relaxed">
                    {isHindi ? entry.descHi : entry.descEn}
                  </p>
                  
                  {entry.features && entry.features.length > 0 && (
                    <div className="mt-6 bg-slate-50  rounded-xl p-6 border border-slate-100 ">
                      <ul className="space-y-4 m-0 p-0 list-none">
                        {entry.features.map((feature, fIndex) => (
                          <li key={fIndex} className="flex items-start m-0 p-0">
                            <div className="flex-shrink-0 mt-1.5 mr-3">
                              <div className={`w-1.5 h-1.5 rounded-full ${colorClasses[entry.color].split(' ')[0]}`}></div>
                            </div>
                            <div>
                              <strong className="text-slate-900  font-semibold inline-block mb-1">
                                {isHindi ? feature.nameHi : feature.nameEn}:
                              </strong>
                              <span className="block text-slate-600  text-base leading-snug">
                                {isHindi ? feature.textHi : feature.textEn}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
