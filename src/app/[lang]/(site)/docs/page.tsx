import Link from 'next/link'
import { Metadata } from 'next'
import { docsConfig } from '@/lib/docs-config'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'दस्तावेज़ | संगठन' : 'Documentation | Sangathan',
    description: isHindi
      ? 'संगठन प्लेटफॉर्म पर संगठनों को सेटअप, चलाने और सुरक्षित रूप से स्केल करने के लिए पूर्ण मार्गदर्शिका।'
      : 'Complete handbook for setting up, running, and safely scaling organisations on Sangathan.',
  }
}

export default async function DocsIndex({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  return (
    <div className="max-w-4xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 text-[var(--text-primary)]">
          {isHindi ? 'दस्तावेज़' : 'Documentation'}
        </h1>
        <p className="text-xl text-[var(--text-secondary)] leading-relaxed">
          {isHindi 
            ? 'यह पेज किसी भी संगठन, समूह या नेटवर्क के लिए एक ही जगह पर मार्गदर्शन देता है ताकि आप बिना मदद मांगे प्लेटफॉर्म का उपयोग कर सकें।'
            : 'This page is a single place for organisations, collectives, and networks to learn how to use Sangathan without needing to contact us.'}
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 text-[var(--text-secondary)] text-sm">
          <div className="space-y-1">
            <h2 className="font-semibold text-[var(--text-primary)]">
              {isHindi ? 'यदि आप नए हैं' : 'If you are new'}
            </h2>
            <p>
              {isHindi
                ? 'पहले "Getting Started" पढ़ें, फिर सदस्य, फॉर्म और बैठकों के सेक्शन देखें।'
                : 'Start with "Getting Started", then move to Members, Forms, and Meetings sections.'}
            </p>
          </div>
          <div className="space-y-1">
            <h2 className="font-semibold text-[var(--text-primary)]">
              {isHindi ? 'यदि आपका संगठन पहले से चल रहा है' : 'If your organisation is already running'}
            </h2>
            <p>
              {isHindi
                ? 'फाइनेंस, सुरक्षा, गवर्नेंस और सामान्य समस्याओं के समाधान के लिए नीचे सभी मॉड्यूल देखें।'
                : 'Use the modules below for finance, security, governance, and day‑to‑day troubleshooting.'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {docsConfig.map((category, idx) => (
          <div key={idx} className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--accent)] transition-colors group">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[var(--bg-secondary)] rounded-lg text-[var(--accent)]">
                {category.icon && <category.icon size={24} />}
              </div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">{isHindi ? category.title.hi : category.title.en}</h2>
            </div>
            <ul className="space-y-3">
              {category.items.map((item, itemIdx) => (
                <li key={itemIdx}>
                  <Link 
                    href={`/${lang}/docs/${item.slug}`}
                    className="flex items-center text-[var(--text-secondary)] hover:text-[var(--accent)] group-hover:text-[var(--text-primary)] transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--border-subtle)] mr-3 group-hover:bg-[var(--accent)] transition-colors"></span>
                    {isHindi ? item.title.hi : item.title.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-16 p-8 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-subtle)]">
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">
          {isHindi ? 'किस विषय से शुरू करें?' : 'Where should you start?'}
        </h3>
        <div className="grid gap-6 md:grid-cols-2 text-sm text-[var(--text-secondary)]">
          <div className="space-y-2">
            <h4 className="font-semibold text-[var(--text-primary)]">
              {isHindi ? 'सेटअप और रोज़मर्रा का काम' : 'Setup and everyday work'}
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <Link href={`/${lang}/docs/getting-started`} className="text-[var(--accent)] hover:underline">
                  {isHindi ? 'Getting Started' : 'Getting Started'}
                </Link>
                {' '}
                {isHindi ? '– नया संगठन बनाना और पहली लॉगिन.' : '– creating your org and first login.'}
              </li>
              <li>
                <Link href={`/${lang}/docs/members`} className="text-[var(--accent)] hover:underline">
                  {isHindi ? 'Members' : 'Members'}
                </Link>
                {', '}
                <Link href={`/${lang}/docs/forms`} className="text-[var(--accent)] hover:underline">
                  {isHindi ? 'Forms' : 'Forms'}
                </Link>
                {', '}
                <Link href={`/${lang}/docs/meetings`} className="text-[var(--accent)] hover:underline">
                  {isHindi ? 'Meetings' : 'Meetings'}
                </Link>
                {' – '}
                {isHindi ? 'सदस्य डेटा, रजिस्ट्रेशन और बैठकों का रिकॉर्ड।' : 'member data, registrations, and meeting records.'}
              </li>
              <li>
                <Link href={`/${lang}/docs/donations`} className="text-[var(--accent)] hover:underline">
                  {isHindi ? 'Donations' : 'Donations'}
                </Link>
                {' – '}
                {isHindi ? 'दान के एंट्री और पारदर्शी रिकॉर्ड।' : 'recording donations and keeping a transparent ledger.'}
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-[var(--text-primary)]">
              {isHindi ? 'सुरक्षा, नीति और समस्या निवारण' : 'Security, policy, and troubleshooting'}
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <Link href={`/${lang}/docs/security-governance`} className="text-[var(--accent)] hover:underline">
                  {isHindi ? 'Security & Governance' : 'Security & Governance'}
                </Link>
                {' – '}
                {isHindi ? 'डेटा सुरक्षा और शक्ति संतुलन कैसे काम करता है।' : 'how security, roles, and power-balancing work.'}
              </li>
              <li>
                <Link href={`/${lang}/docs/data-lifecycle`} className="text-[var(--accent)] hover:underline">
                  {isHindi ? 'Data Lifecycle' : 'Data Lifecycle'}
                </Link>
                {' – '}
                {isHindi ? 'डेटा कैसे बनता, स्टोर होता और हटाया जाता है।' : 'how data is created, stored, and deleted.'}
              </li>
              <li>
                <Link href={`/${lang}/docs/admin-responsibilities`} className="text-[var(--accent)] hover:underline">
                  {isHindi ? 'Admin Responsibilities' : 'Admin Responsibilities'}
                </Link>
                {' – '}
                {isHindi ? 'आपकी कानूनी और नैतिक जिम्मेदारियां।' : 'your legal and ethical responsibilities as an admin.'}
              </li>
              <li>
                <Link href={`/${lang}/docs/troubleshooting`} className="text-[var(--accent)] hover:underline">
                  {isHindi ? 'Troubleshooting' : 'Troubleshooting'}
                </Link>
                {' / '}
                <Link href={`/${lang}/docs/faq`} className="text-[var(--accent)] hover:underline">
                  {isHindi ? 'FAQ' : 'FAQ'}
                </Link>
                {' – '}
                {isHindi ? 'अधिकांश आम समस्याओं के तुरंत समाधान।' : 'immediate answers to most common issues.'}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
