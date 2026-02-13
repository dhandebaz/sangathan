import Link from 'next/link'
import { Metadata } from 'next'
import { Book, Shield, Users, FileText, Settings, HelpCircle, Activity } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'दस्तावेज़ | संगठन' : 'Documentation | Sangathan',
    description: isHindi
      ? 'संगठन प्लेटफॉर्म के लिए व्यापक गाइड और संदर्भ।'
      : 'Comprehensive guides and references for the Sangathan platform.',
  }
}

export default async function DocsIndex({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  const categories = [
    {
      title: isHindi ? 'शुरु करना' : 'Getting Started',
      icon: Book,
      items: [
        { title: isHindi ? 'त्वरित आरंभ गाइड' : 'Quickstart Guide', slug: 'getting-started' },
        { title: isHindi ? 'खाता सत्यापन' : 'Account Verification', slug: 'getting-started#verification' },
        { title: isHindi ? 'डैशबोर्ड अवलोकन' : 'Dashboard Overview', slug: 'getting-started#dashboard' },
      ]
    },
    {
      title: isHindi ? 'मुख्य मॉड्यूल' : 'Core Modules',
      icon: Users,
      items: [
        { title: isHindi ? 'सदस्य प्रबंधन' : 'Member Management', slug: 'members' },
        { title: isHindi ? 'फॉर्म सिस्टम' : 'Forms System', slug: 'forms' },
        { title: isHindi ? 'बैठकें और कार्यवृत्त' : 'Meetings & Minutes', slug: 'meetings' },
        { title: isHindi ? 'दान बहीखाता' : 'Donation Ledger', slug: 'donations' },
      ]
    },
    {
      title: isHindi ? 'सुरक्षा और शासन' : 'Security & Governance',
      icon: Shield,
      items: [
        { title: isHindi ? 'सुरक्षा अवलोकन' : 'Security Overview', slug: 'security-governance' },
        { title: isHindi ? 'डेटा जीवनचक्र' : 'Data Lifecycle', slug: 'data-lifecycle' },
        { title: isHindi ? 'प्रशासक जिम्मेदारियां' : 'Admin Responsibilities', slug: 'admin-responsibilities' },
      ]
    },
    {
      title: isHindi ? 'संचालन' : 'Operations',
      icon: Settings,
      items: [
        { title: isHindi ? 'समर्थक योजना' : 'Supporter Plan', slug: 'supporter-plan' },
        { title: isHindi ? 'समस्या निवारण' : 'Troubleshooting', slug: 'troubleshooting' },
        { title: isHindi ? 'परिचालन अक्सर पूछे जाने वाले प्रश्न' : 'Operational FAQ', slug: 'faq' },
      ]
    }
  ]

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          {isHindi ? 'दस्तावेज़' : 'Documentation'}
        </h1>
        <p className="text-xl text-gray-500">
          {isHindi 
            ? 'संगठन को प्रभावी ढंग से चलाने के लिए आपको जो कुछ भी जानने की आवश्यकता है।'
            : 'Everything you need to know to run Sangathan effectively.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((category, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 hover:border-orange-200 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                <category.icon size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{category.title}</h2>
            </div>
            <ul className="space-y-3">
              {category.items.map((item, itemIdx) => (
                <li key={itemIdx}>
                  <Link 
                    href={`/${lang}/docs/${item.slug}`}
                    className="flex items-center text-gray-600 hover:text-orange-600 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mr-3 group-hover:bg-orange-500 transition-colors"></span>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-16 p-8 bg-gray-50 rounded-2xl border border-gray-200 text-center">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {isHindi ? 'वह नहीं मिल रहा जो आप ढूंढ रहे हैं?' : 'Can\'t find what you\'re looking for?'}
        </h3>
        <p className="text-gray-500 mb-6">
          {isHindi
            ? 'हमारी सहायता टीम मदद के लिए यहां है।'
            : 'Our support team is here to help.'}
        </p>
        <Link 
          href={`/${lang}/contact`}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-black transition-colors"
        >
          {isHindi ? 'सहायता से संपर्क करें' : 'Contact Support'}
        </Link>
      </div>
    </div>
  )
}
