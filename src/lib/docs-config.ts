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
      { title: { en: 'Account Verification', hi: 'खाता सत्यापन' }, slug: 'getting-started#verification' },
      { title: { en: 'Dashboard Overview', hi: 'डैशबोर्ड अवलोकन' }, slug: 'getting-started#dashboard' },
    ]
  },
  {
    title: { en: 'Core Modules', hi: 'मुख्य मॉड्यूल' },
    icon: Users,
    items: [
      { title: { en: 'Member Management', hi: 'सदस्य प्रबंधन' }, slug: 'members' },
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
    title: { en: 'Operations', hi: 'संचालन' },
    icon: Settings,
    items: [
      { title: { en: 'Support Sangathan', hi: 'समर्थक योजना' }, slug: 'support-sangathan' },
      { title: { en: 'Troubleshooting', hi: 'समस्या निवारण' }, slug: 'troubleshooting' },
      { title: { en: 'Operational FAQ', hi: 'परिचालन अक्सर पूछे जाने वाले प्रश्न' }, slug: 'faq' },
    ]
  }
]
