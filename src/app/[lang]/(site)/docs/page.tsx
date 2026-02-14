import Link from 'next/link'
import { Metadata } from 'next'
import { docsConfig } from '@/lib/docs-config'

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

  return (
    <div className="max-w-4xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 text-[var(--text-primary)]">
          {isHindi ? 'दस्तावेज़' : 'Documentation'}
        </h1>
        <p className="text-xl text-[var(--text-secondary)] leading-relaxed">
          {isHindi 
            ? 'संगठन को प्रभावी ढंग से चलाने के लिए आपको जो कुछ भी जानने की आवश्यकता है।'
            : 'Everything you need to know to run Sangathan effectively.'}
        </p>
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

      <div className="mt-16 p-8 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-subtle)] text-center">
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
          {isHindi ? 'वह नहीं मिल रहा जो आप ढूंढ रहे हैं?' : 'Can\'t find what you\'re looking for?'}
        </h3>
        <p className="text-[var(--text-secondary)] mb-6">
          {isHindi
            ? 'हमारी सहायता टीम मदद के लिए यहां है।'
            : 'Our support team is here to help.'}
        </p>
        <Link 
          href={`/${lang}/contact`}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-[var(--bg-primary)] bg-[var(--text-primary)] hover:opacity-90 transition-opacity"
        >
          {isHindi ? 'सहायता से संपर्क करें' : 'Contact Support'}
        </Link>
      </div>
    </div>
  )
}
