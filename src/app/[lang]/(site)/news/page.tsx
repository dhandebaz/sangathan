import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'समाचार और अपडेट' : 'News & Updates',
    description: isHindi ? 'संगठन से नवीनतम समाचार' : 'Latest news from Sangathan',
  }
}

const newsItems = [
  {
    id: 'unified-ticketing',
    category: 'Product Update',
    categoryColor: 'text-[var(--accent)]',
    title: 'Unified Ticketing Module Released',
    date: 'June 20, 2026',
    excerpt: 'We have completely overhauled the Helpdesk system, enabling powerful multi-tenant support. Grievances for Unions, Maintenance for RWAs, and Support for NGOs, all from a single scalable engine. This release improves the core functionality across all 4 major organizational structures we support.',
  },
  {
    id: 'cba-grants',
    category: 'Feature Release',
    categoryColor: 'text-[var(--success)]',
    title: 'CBA & Grants Management',
    date: 'June 18, 2026',
    excerpt: 'Unions can now securely manage Collective Bargaining Agreements, while NGOs gain dedicated pipelines to track grant proposals and compliance deadlines directly from their dashboards. This brings enterprise-level tracking to grassroots collectives.',
  },
  {
    id: '500-collectives',
    category: 'Community Spotlight',
    categoryColor: 'text-[var(--text-primary)]',
    title: '500+ Grassroots Collectives Onboarded',
    date: 'June 10, 2026',
    excerpt: 'Sangathan has now surpassed 500 active civic organizations on the platform. We are humbled to see student unions, environmental NGOs, and housing societies building robust governance using our free-to-use tools. This milestone proves the dire need for civic tech infrastructure.',
  },
  {
    id: 'free-plan-launch',
    category: 'Company News',
    categoryColor: 'text-brand-600',
    title: 'Sangathan introduces Forever Free Plan',
    date: 'May 01, 2026',
    excerpt: 'We believe civic infrastructure must be accessible to everyone. Sangathan now offers a Forever Free plan, empowering grassroots collectives with zero-cost tools to build the digital public goods of the future without financial barriers.',
  }
]

export default async function NewsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-12 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href={`/${lang}`} className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-8 transition-colors">
          <ArrowLeft size={16} />
          {isHindi ? 'होम पर वापस जाएं' : 'Back to Home'}
        </Link>
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)] mb-4">
            {isHindi ? 'समाचार और अपडेट' : 'News & Updates'}
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            {isHindi 
              ? 'संगठन पारिस्थितिकी तंत्र से नवीनतम सुविधाएँ, घोषणाएँ और सामुदायिक कहानियाँ पढ़ें।' 
              : 'Read the latest features, announcements, and community stories from the Sangathan ecosystem.'}
          </p>
        </div>

        <div className="space-y-8">
          {newsItems.map((item) => (
            <article key={item.id} className="bg-[var(--surface)] p-6 md:p-8 rounded-2xl border border-[var(--border-subtle)] hover:shadow-lg transition-all">
              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm font-medium">
                <span className={`flex items-center gap-1.5 ${item.categoryColor}`}>
                  <Tag size={14} />
                  {item.category}
                </span>
                <span className="text-[var(--text-tertiary)] flex items-center gap-1.5">
                  <Calendar size={14} />
                  {item.date}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 leading-snug">
                {item.title}
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed text-base md:text-lg mb-6">
                {item.excerpt}
              </p>
              <button className="text-[var(--accent)] font-semibold hover:underline flex items-center gap-2">
                {isHindi ? 'और पढ़ें' : 'Read more'} <ArrowLeft size={16} className="rotate-180" />
              </button>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
