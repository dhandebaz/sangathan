import { getDocContent } from '@/lib/docs'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ lang: string; slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params
  const isHindi = lang === 'hi'
  
  // Basic title mapping for metadata
  const titles: Record<string, string> = {
    'getting-started': 'Getting Started',
    'members': 'Members',
    'forms': 'Forms',
    'meetings': 'Meetings',
    'donations': 'Donations',
    'supporter-plan': 'Supporter Plan',
    'security-governance': 'Security & Governance',
    'admin-responsibilities': 'Admin Responsibilities',
    'system-admin': 'System Admin',
    'data-lifecycle': 'Data Lifecycle',
    'troubleshooting': 'Troubleshooting',
    'faq': 'FAQ',
  }

  const title = titles[slug] || 'Documentation'
  
  return {
    title: `${title} | Sangathan Docs`,
    description: isHindi
      ? 'संगठन प्लेटफॉर्म प्रलेखन'
      : 'Sangathan Platform Documentation',
  }
}

export default async function DocPage({ params }: PageProps) {
  const { lang, slug } = await params
  const isHindi = lang === 'hi'
  
  const content = getDocContent(slug)

  if (!content) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {isHindi ? 'दस्तावेज़ नहीं मिला' : 'Document Not Found'}
        </h1>
        <p className="text-gray-500 mb-8">
          {isHindi
            ? 'क्षमा करें, आप जिस गाइड की तलाश कर रहे हैं वह मौजूद नहीं है।'
            : 'Sorry, the guide you are looking for does not exist.'}
        </p>
        <Link href={`/${lang}/docs`} className="text-orange-600 hover:underline flex items-center justify-center gap-2">
          <ArrowLeft size={16} /> {isHindi ? 'वापस दस्तावेजों पर जाएं' : 'Back to Docs'}
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-8">
        <Link href={`/${lang}/docs`} className="text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-4 text-sm">
          <ArrowLeft size={14} /> {isHindi ? 'दस्तावेज़' : 'Documentation'}
        </Link>
      </div>
      
      <article className="prose prose-slate max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-a:text-orange-600 hover:prose-a:text-orange-700">
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          {isHindi 
            ? 'क्या यह पृष्ठ मददगार था? हमें बताएं।'
            : 'Was this page helpful? Let us know.'}
        </p>
      </div>
    </div>
  )
}
