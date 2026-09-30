import { Metadata } from 'next'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/service'
import { PageHeader } from '@/components/public/page-header'
import { Users, Globe, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'नेटवर्क' : 'Network',
    description: isHindi
      ? 'सार्वजनिक संगठनों के बीच सहयोग और समर्थन के लिए नेटवर्क।'
      : 'Networks connecting public organisations for collaboration and mutual support.',
    alternates: {
      canonical: `https://sangathan.space/${lang}/network`,
      languages: {
        'en': 'https://sangathan.space/en/network',
        'hi': 'https://sangathan.space/hi/network',
      },
    },
  }
}

export default async function NetworkIndexPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const isHindi = lang === 'hi'
  const supabase = createServiceClient()

  const { data: networks } = await supabase
    .from('networks')
    .select('id, name, description, slug, visibility')
    .eq('visibility', 'public')
    .order('name', { ascending: true })

  return (
    <div className="bg-white min-h-screen">
      <PageHeader
        title={isHindi ? 'सार्वजनिक नेटवर्क' : 'Public Networks'}
        description={isHindi
          ? 'भारत के बुनियादी संगठनों के बीच सहयोग के लिए सार्वजनिक नेटवर्कों की एक सूची।'
          : 'A directory of public networks connecting grassroots organisations across India for collaboration and mutual support.'}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {networks && networks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {networks.map((network: { id: string; name: string; description: string | null; slug: string }) => (
              <Link
                key={network.id}
                href={`/${lang}/network/${network.slug}`}
                className="group block border border-slate-200 rounded-xl p-6 bg-white hover:border-indigo-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                    <Globe size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{network.name}</h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                      {network.description || (isHindi ? 'कोई विवरण उपलब्ध नहीं है।' : 'No description available.')}
                    </p>
                  </div>
                  <ArrowRight size={16} className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/30">
            <Users size={40} className="mx-auto text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {isHindi ? 'कोई सार्वजनिक नेटवर्क नहीं मिला' : 'No public networks found'}
            </h3>
            <p className="text-slate-500">
              {isHindi
                ? 'वर्तमान में कोई सार्वजनिक नेटवर्क उपलब्ध नहीं हैं। जल्द ही वापस आएं।'
                : 'No public networks are currently available. Check back soon.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
