import { Book, Shield, Users, Settings, Megaphone, Wrench, LucideIcon } from 'lucide-react'

export type DocSection = {
  title: { en: string; hi: string }
  icon?: LucideIcon
  items: { title: { en: string; hi: string }; slug: string }[]
}

export const docsConfig: DocSection[] = [
  {
    title: { en: 'Getting Started', hi: 'शुरु करना' },
    icon: Book,
    items: [
      { title: { en: 'Quickstart Guide', hi: 'त्वरित आरंभ गाइड' }, slug: 'getting-started' },
    ]
  },
  {
    title: { en: 'Core Modules', hi: 'मुख्य मॉड्यूल' },
    icon: Users,
    items: [
      { title: { en: 'Member Management', hi: 'सदस्य प्रबंधन' }, slug: 'members' },
      { title: { en: 'Universal Data Importer', hi: 'यूनिवर्सल डेटा आयातक' }, slug: 'data-importer' },
      { title: { en: 'Document Vault', hi: 'दस्तावेज़ वॉल्ट' }, slug: 'document-vault' },
      { title: { en: 'Forms System', hi: 'फॉर्म सिस्टम' }, slug: 'forms' },
      { title: { en: 'Meetings & Minutes', hi: 'बैठकें और कार्यवृत्त' }, slug: 'meetings' },
      { title: { en: 'Donation Ledger', hi: 'दान बहीखाता' }, slug: 'donations' },
      { title: { en: 'Membership Requests', hi: 'सदस्यता अनुरोध' }, slug: 'membership-requests' },
    ]
  },
  {
    title: { en: 'Communication & Action', hi: 'संचार और कार्रवाई' },
    icon: Megaphone,
    items: [
      { title: { en: 'Announcements', hi: 'घोषणाएँ' }, slug: 'announcements' },
      { title: { en: 'Events & Campaigns', hi: 'कार्यक्रम और अभियान' }, slug: 'events-campaigns' },
      { title: { en: 'Tasks & Volunteers', hi: 'कार्य और स्वयंसेवक' }, slug: 'tasks-volunteers' },
      { title: { en: 'Appeals & Polls', hi: 'अपील और मतदान' }, slug: 'appeals-polls' },
    ]
  },
  {
    title: { en: 'Specialized Modules', hi: 'विशिष्ट मॉड्यूल' },
    icon: Wrench,
    items: [
      { title: { en: 'BQF AI Recognition & Verification', hi: 'BQF AI मान्यता व सत्यापन' }, slug: 'bqf-recognition' },
      { title: { en: 'Government & Municipal Representation Letters', hi: 'सरकारी व नगर निगम प्रतिवेदन पत्र' }, slug: 'municipal-letters' },
      { title: { en: 'Statutory Registers', hi: 'वैधानिक रजिस्टर्स' }, slug: 'statutory-registers' },
      { title: { en: 'Master Reference & Geo Data', hi: 'मास्टर संदर्भ व भौगोलिक डेटा' }, slug: 'master-reference-data' },
      { title: { en: 'Grievances & Complaints', hi: 'शिकायतें' }, slug: 'grievances' },
      { title: { en: 'Maintenance', hi: 'रखरखाव' }, slug: 'maintenance' },
      { title: { en: 'Student IDs', hi: 'छात्र आईडी' }, slug: 'student-ids' },
    ]
  },
  {
    title: { en: 'Security & Governance', hi: 'सुरक्षा और शासन' },
    icon: Shield,
    items: [
      { title: { en: 'Security Overview', hi: 'सुरक्षा अवलोकन' }, slug: 'security-governance' },
      { title: { en: 'Data Lifecycle', hi: 'डेटा जीवनचक्र' }, slug: 'data-lifecycle' },
      { title: { en: 'Admin Responsibilities', hi: 'प्रशासक जिम्मेदारियां' }, slug: 'admin-responsibilities' },
      { title: { en: 'Networks & Coalitions', hi: 'नेटवर्क और गठबंधन' }, slug: 'networks' },
      { title: { en: 'Analytics & Audit Logs', hi: 'एनालिटिक्स और ऑडिट लॉग' }, slug: 'analytics' },
    ]
  },
  {
    title: { en: 'System Administration', hi: 'सिस्टम प्रशासन' },
    icon: Shield,
    items: [
      { title: { en: 'System Admin Guide', hi: 'सिस्टम एडमिन गाइड' }, slug: 'system-admin' },
    ]
  },
  {
    title: { en: 'Organisation Playbooks', hi: 'संगठन नियमावली व दिशानिर्देश' },
    icon: Shield,
    items: [
      { title: { en: 'NGO & Civil Society Handbook', hi: 'एनजीओ व नागरिक समाज हैंडबुक' }, slug: 'ngo-playbook' },
      { title: { en: 'Student Union & Campus Guild', hi: 'छात्र संघ व विश्वविद्यालय परिषद' }, slug: 'student-union-playbook' },
      { title: { en: 'Trade Union & Labor Collective', hi: 'श्रमिक संघ व ट्रेड यूनियन' }, slug: 'workers-union-playbook' },
      { title: { en: 'Resident Welfare Association (RWA)', hi: 'आवासीय कल्याण संघ (RWA)' }, slug: 'rwa-playbook' },
    ]
  },
  {
    title: { en: 'Operations', hi: 'संचालन' },
    icon: Settings,
    items: [
      { title: { en: 'Support Sangathan', hi: 'संगठन का समर्थन करें' }, slug: 'support-sangathan' },
      { title: { en: 'Troubleshooting', hi: 'समस्या निवारण' }, slug: 'troubleshooting' },
      { title: { en: 'Operational FAQ', hi: 'परिचालन अक्सर पूछे जाने वाले प्रश्न' }, slug: 'faq' },
    ]
  }
]

// Pre-computed lookup map for O(1) slug access
export const docsBySlug = new Map(
  docsConfig.flatMap(section =>
    section.items.map(item => [item.slug.split('#')[0], item])
  )
)

// Pre-computed flat list of unique docs for pagination (deduplicated by slug)
const seenSlugs = new Set<string>()
export const flatDocs = Array.from(docsBySlug.values())
  .filter(item => {
    const base = item.slug.split('#')[0]
    if (seenSlugs.has(base)) return false
    seenSlugs.add(base)
    return true
  })
  .map(item => ({
    slug: item.slug.split('#')[0],
    title: item.title
  }))
