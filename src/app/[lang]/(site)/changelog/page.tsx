import { GitCommit, Sparkles, ShieldCheck, Zap, Server, Code, Users, Calendar, Activity, Rocket, Globe } from 'lucide-react'
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
  icon: any
  features?: Feature[]
}

const changelogData: ChangelogEntry[] = [
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
  green: 'bg-green-100 text-green-600 ring-green-100 dark:bg-green-900 dark:text-green-300 dark:ring-green-900',
  emerald: 'bg-emerald-100 text-emerald-600 ring-emerald-100 dark:bg-emerald-900 dark:text-emerald-300 dark:ring-emerald-900',
  blue: 'bg-blue-100 text-blue-600 ring-blue-100 dark:bg-blue-900 dark:text-blue-300 dark:ring-blue-900',
  purple: 'bg-purple-100 text-purple-600 ring-purple-100 dark:bg-purple-900 dark:text-purple-300 dark:ring-purple-900',
  indigo: 'bg-indigo-100 text-indigo-600 ring-indigo-100 dark:bg-indigo-900 dark:text-indigo-300 dark:ring-indigo-900',
  orange: 'bg-orange-100 text-orange-600 ring-orange-100 dark:bg-orange-900 dark:text-orange-300 dark:ring-orange-900',
  cyan: 'bg-cyan-100 text-cyan-600 ring-cyan-100 dark:bg-cyan-900 dark:text-cyan-300 dark:ring-cyan-900',
  pink: 'bg-pink-100 text-pink-600 ring-pink-100 dark:bg-pink-900 dark:text-pink-300 dark:ring-pink-900',
  rose: 'bg-rose-100 text-rose-600 ring-rose-100 dark:bg-rose-900 dark:text-rose-300 dark:ring-rose-900',
  amber: 'bg-amber-100 text-amber-600 ring-amber-100 dark:bg-amber-900 dark:text-amber-300 dark:ring-amber-900',
  slate: 'bg-slate-100 text-slate-600 ring-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-800',
}

export default async function ChangelogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  return (
    <div className="bg-white dark:bg-transparent min-h-screen">
      <PageHeader 
        title={isHindi ? 'परिवर्तन लॉग' : 'Changelog'}
        description={isHindi 
          ? 'हमारे सफर का एक पारदर्शी रिकॉर्ड। हर कदम पर संगठन को मजबूत बनाते हुए।'
          : 'A transparent record of our journey. Making Sangathan stronger with every release.'}
        badge={isHindi ? 'अपडेट' : 'Updates & Improvements'}
      />

      {/* Timeline Section */}
      <div className="max-w-4xl mx-auto py-16 px-6 sm:px-8">
        <div className="relative border-s-2 border-slate-200 dark:border-slate-800 ml-4 md:ml-6">
          {changelogData.map((entry, index) => {
            const Icon = entry.icon
            return (
              <div key={entry.version} className={`mb-16 ms-8 md:ms-12 ${index === changelogData.length - 1 ? 'mb-0' : ''}`}>
                <span className={`absolute flex items-center justify-center w-10 h-10 rounded-full -start-5 ring-8 ring-white dark:ring-black shadow-sm ${colorClasses[entry.color]}`}>
                  <Icon size={18} className="stroke-[2.5]" />
                </span>
                
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mb-2">
                  <h3 className="flex items-center text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {isHindi ? entry.titleHi : entry.titleEn}
                    <span className={`bg-slate-100 text-slate-800 text-sm font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-slate-800 dark:text-slate-300 ms-3 border border-slate-200 dark:border-slate-700`}>
                      {entry.version}
                    </span>
                  </h3>
                  <time className="block text-sm font-medium leading-none text-slate-400 dark:text-slate-500 flex-shrink-0">
                    {isHindi ? entry.dateHi : entry.dateEn}
                  </time>
                </div>
                
                <div className="prose prose-slate dark:prose-invert prose-lg max-w-none text-slate-600 dark:text-slate-400 mt-4">
                  <p className="leading-relaxed">
                    {isHindi ? entry.descHi : entry.descEn}
                  </p>
                  
                  {entry.features && entry.features.length > 0 && (
                    <div className="mt-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
                      <ul className="space-y-4 m-0 p-0 list-none">
                        {entry.features.map((feature, fIndex) => (
                          <li key={fIndex} className="flex items-start m-0 p-0">
                            <div className="flex-shrink-0 mt-1.5 mr-3">
                              <div className={`w-1.5 h-1.5 rounded-full ${colorClasses[entry.color].split(' ')[0]}`}></div>
                            </div>
                            <div>
                              <strong className="text-slate-900 dark:text-slate-200 font-semibold inline-block mb-1">
                                {isHindi ? feature.nameHi : feature.nameEn}:
                              </strong>
                              <span className="block text-slate-600 dark:text-slate-400 text-base leading-snug">
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
