import { Book, Shield, Users, Settings, LucideIcon } from 'lucide-react'

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
    ]
  },
  {
    title: { en: 'Security & Governance', hi: 'सुरक्षा और शासन' },
    icon: Shield,
    items: [
      { title: { en: 'Security Overview', hi: 'सुरक्षा अवलोकन' }, slug: 'security-governance' },
      { title: { en: 'Data Lifecycle', hi: 'डेटा जीवनचक्र' }, slug: 'data-lifecycle' },
      { title: { en: 'Admin Responsibilities', hi: 'प्रशासक जिम्मेदारियां' }, slug: 'admin-responsibilities' },
      { title: { en: 'System Admin', hi: 'सिस्टम एडमिन' }, slug: 'system-admin' },
    ]
  },
  {
    title: { en: 'Operations', hi: 'संचालन' },
    icon: Settings,
    items: [
      { title: { en: 'Supporter Plan', hi: 'समर्थक योजना' }, slug: 'supporter-plan' },
      { title: { en: 'Troubleshooting', hi: 'समस्या निवारण' }, slug: 'troubleshooting' },
      { title: { en: 'Operational FAQ', hi: 'परिचालन अक्सर पूछे जाने वाले प्रश्न' }, slug: 'faq' },
    ]
  }
]
